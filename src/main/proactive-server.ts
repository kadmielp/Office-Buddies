import * as http from "http";
import { getStateManager } from "./state";
import { getMainWindow } from "./windows";
import { IpcMessages } from "../ipc-messages";
import { getLogger } from "./logger";

let server: http.Server | null = null;
let activePort: number | null = null;
const PROACTIVE_BIND_ADDRESS = "127.0.0.1";

export function startProactiveServer() {
  const settings = getStateManager().getSettings();
  const port = settings.proactivePort || 5050;

  if (!settings.enableProactiveMessages) {
    stopProactiveServer();
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
    if (req.method === "POST" && req.url === "/notify") {
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

  server.listen(port, PROACTIVE_BIND_ADDRESS, () => {
    getLogger().info(
      `Proactive server listening on ${PROACTIVE_BIND_ADDRESS}:${port}`,
    );
  });

  server.on("error", (error) => {
    getLogger().error("Proactive server error", error);
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
