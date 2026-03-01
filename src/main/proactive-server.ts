import * as http from "http";
import { getStateManager } from "./state";
import { getMainWindow } from "./windows";
import { IpcMessages } from "../ipc-messages";
import { getLogger } from "./logger";

let server: http.Server | null = null;

export function startProactiveServer() {
  const settings = getStateManager().getSettings();

  if (!settings.enableProactiveMessages) {
    stopProactiveServer();
    return;
  }

  if (server) {
    return;
  }

  const port = settings.proactivePort || 5050;

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
          const currentSettings = getStateManager().getSettings();

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

  server.listen(port, "0.0.0.0", () => {
    getLogger().info(`Proactive server listening on port ${port}`);
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
    getLogger().info("Proactive server stopped");
  }
}
