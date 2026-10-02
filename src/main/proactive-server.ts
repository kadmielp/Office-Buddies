import * as http from "http";
import { getStateManager } from "./state";
import { getMainWindow } from "./windows";
import { IpcMessages } from "../shared/ipc-messages";
import { getLogger } from "./logger";
import { handleAgentEvent } from "./agent-events";
import { AgentEventResponse, getAgentAdapter } from "./agents";
import { AGENT_EVENT_PATH } from "../shared/agent-events";
import { timingSafeEqual } from "crypto";
import { getAgentHookInfo } from "./agent-hooks";

function hasInstalledAgentHooks(): boolean {
  return (["claude-code", "codex"] as const).some(
    (source) => getAgentHookInfo(source).status !== "not_installed",
  );
}

let server: http.Server | null = null;
let activePort: number | null = null;
let listenerError: string | null = null;

export interface ListenerStatus {
  running: boolean;
  port: number | null;
  error: string | null;
}

export function getListenerStatus(): ListenerStatus {
  return {
    running: server?.listening ?? false,
    port: activePort,
    error: listenerError,
  };
}
const PROACTIVE_BIND_ADDRESS = "127.0.0.1";
const MAX_AGENT_EVENT_BYTES = 256 * 1024;

export function startProactiveServer() {
  const settings = getStateManager().getSettings();
  const port = settings.proactivePort || 5050;

  // Installed Claude Code / Codex hooks post here, so they keep it running
  // even when OpenClaw notifications are off.
  if (!settings.enableProactiveMessages && !hasInstalledAgentHooks()) {
    stopProactiveServer();
    listenerError = null;
    return;
  }

  if (server && activePort === port) {
    return;
  }

  if (server) {
    getLogger().info(
      `Restarting proactive server to apply port change (${activePort} -> ${port})`,
    );
    stopProactiveServer();
  }

  server = http.createServer((req, res) => {
    const requestUrl = new URL(
      req.url || "/",
      `http://${PROACTIVE_BIND_ADDRESS}`,
    );

    if (req.method === "POST" && requestUrl.pathname === AGENT_EVENT_PATH) {
      handleAgentEventRequest(req, res, requestUrl);
      return;
    }

    if (req.method === "POST" && req.url === "/notify") {
      if (!getStateManager().getSettings().enableProactiveMessages) {
        req.resume();
        res.writeHead(403);
        res.end();
        return;
      }

      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        try {
          const data = JSON.parse(body);
          const { message, animation, actions, loop } = data;

          const mainWindow = getMainWindow();
          if (mainWindow) {
            mainWindow.webContents.send(IpcMessages.PROACTIVE_MESSAGE, {
              message,
              animation,
              actions,
              loop,
            });

            // Show window if hidden
            if (!mainWindow.isVisible()) {
              mainWindow.show();
            }
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "ok" }));
        } catch (error) {
          getLogger().error("Failed to parse proactive message", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: "error", message: "Invalid JSON" }));
        }
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  activePort = port;

  listenerError = null;
  server.listen(port, PROACTIVE_BIND_ADDRESS, () => {
    getLogger().info(
      `Proactive server listening on ${PROACTIVE_BIND_ADDRESS}:${port}`,
    );
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    getLogger().error("Proactive server error", error);
    listenerError =
      error.code === "EADDRINUSE"
        ? `Port ${port} is already in use by another program (or another copy of Office Buddies).`
        : error.message;
    stopProactiveServer();
  });
}

export function stopProactiveServer() {
  if (server) {
    server.close();
    server = null;
    activePort = null;
    getLogger().info("Proactive server stopped");
  }
}

function handleAgentEventRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  requestUrl: URL,
) {
  const source = requestUrl.searchParams.get("agent");
  const token = getStateManager().getSettings().agentHookToken || "";
  const adapter = getAgentAdapter(source);

  if (!adapter || !isAuthorized(req, token)) {
    req.resume();
    res.writeHead(401);
    res.end();
    return;
  }

  let body = "";
  let tooLarge = false;

  req.on("data", (chunk) => {
    if (tooLarge) {
      return;
    }

    body += chunk.toString();

    if (body.length > MAX_AGENT_EVENT_BYTES) {
      tooLarge = true;
    }
  });

  req.on("end", () => {
    if (tooLarge) {
      res.writeHead(413);
      res.end();
      return;
    }

    let payload: unknown;

    try {
      payload = JSON.parse(body);
    } catch (error) {
      getLogger().error("Failed to parse agent event", error);
      res.writeHead(400);
      res.end();
      return;
    }

    // Questions keep the request open until they are answered or released.
    handleAgentEvent(adapter, payload, req.headers, (callback) => {
      // The agent may already have hung up while the event was being checked.
      if (res.destroyed && !res.writableEnded) {
        callback();
        return;
      }

      res.on("close", () => {
        if (!res.writableEnded) {
          callback();
        }
      });
    })
      .catch((error): AgentEventResponse => {
        getLogger().error("Failed to handle agent event", error);
        return null;
      })
      .then((response) => {
        if (res.writableEnded || res.destroyed) {
          return;
        }

        if (!response) {
          // Empty 2xx body: hooks treat this as "no decision".
          res.writeHead(204);
          res.end();
          return;
        }

        res.writeHead(200, {
          "Content-Type": "application/json; charset=utf-8",
        });
        res.end(JSON.stringify(response));
      });
  });
}

function isAuthorized(req: http.IncomingMessage, token: string): boolean {
  const header = req.headers.authorization || "";
  const expected = Buffer.from(`Bearer ${token}`);
  const actual = Buffer.from(header);

  return (
    token.length > 0 &&
    actual.length === expected.length &&
    timingSafeEqual(actual, expected)
  );
}
