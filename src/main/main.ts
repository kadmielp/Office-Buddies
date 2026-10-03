import { shouldQuit } from "./squirrel-startup";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (shouldQuit) {
  app.quit();
}

import { app, BrowserWindow } from "electron";
import { setupIpcListeners } from "./ipc";
import {
  createMainWindow,
  setupWindowListener,
  showAssistantFromTray,
} from "./windows";
import { stopLocalLlm } from "./local-llm";
import { setupAutoUpdater } from "./update";
import { setupAppMenu } from "./menu";
import {
  registerGlobalShortcuts,
  unregisterGlobalShortcuts,
} from "./shortcuts";
import { startProactiveServer } from "./proactive-server";
import { createTray, destroyTray, isTrayQuitInProgress } from "./tray";

// Only one buddy may run: a second copy couldn't open the agent listener's
// port, so it hands over to the running one and quits.
const hasInstanceLock = !shouldQuit && app.requestSingleInstanceLock();

if (!shouldQuit && !hasInstanceLock) {
  app.quit();
}

app.on("second-instance", () => {
  showAssistantFromTray();
});

async function onReady() {
  if (!hasInstanceLock) {
    return;
  }

  console.info(`Welcome to Office Buddies v${app.getVersion()}`);

  await setupAutoUpdater();
  setupAppMenu();
  setupIpcListeners();
  setupWindowListener();
  await createMainWindow();
  await createTray();
  registerGlobalShortcuts();
  startProactiveServer();
}

app.on("ready", onReady);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin" && isTrayQuitInProgress()) {
    app.quit();
  }
});

app.on("will-quit", () => {
  stopLocalLlm();
  unregisterGlobalShortcuts();
  destroyTray();
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
