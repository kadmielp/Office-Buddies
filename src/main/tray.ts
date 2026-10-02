import path from "path";

import {
  Menu,
  Tray,
  app,
  nativeImage,
  type MenuItemConstructorOptions,
} from "electron";

import type { BubbleView } from "../renderer/contexts/BubbleViewContext";
import { IpcMessages } from "../shared/ipc-messages";
import { getLogger } from "./logger";
import { getStateManager } from "./state";
import {
  getChatWindow,
  getMainWindow,
  hideAssistantToTray,
  showAssistantFromTray,
  toggleChatWindow,
} from "./windows";

let tray: Tray | null = null;
let isQuitting = false;

function resolveTrayIconPath() {
  const iconFile = process.platform === "win32" ? "icon.ico" : "icon.png";
  return app.isPackaged
    ? path.join(process.resourcesPath, iconFile)
    : path.join(app.getAppPath(), "assets", iconFile);
}

async function createTrayIcon() {
  const image = nativeImage.createFromPath(resolveTrayIconPath());

  if (!image.isEmpty()) {
    return process.platform === "win32"
      ? image.resize({ width: 16, height: 16 })
      : image;
  }

  getLogger().warn(
    "Tray icon file missing or unreadable",
    resolveTrayIconPath(),
  );

  if (process.platform === "win32") {
    try {
      const executableIcon = await app.getFileIcon(process.execPath, {
        size: "small",
      });

      if (!executableIcon.isEmpty()) {
        return executableIcon;
      }
    } catch (error) {
      getLogger().warn("Failed to load tray icon from executable", error);
    }
  }

  return image;
}

function openView(view: BubbleView) {
  const mainWindow = getMainWindow();

  if (!mainWindow) {
    return;
  }

  showAssistantFromTray();
  mainWindow.webContents.send(IpcMessages.SET_BUBBLE_VIEW, view);
}

function buildTrayMenu() {
  const chatWindow = getChatWindow();
  const settings = getStateManager().getSettings();
  const menuTemplate: MenuItemConstructorOptions[] = [
    {
      label: "Show Assistant",
      click: () => showAssistantFromTray(),
    },
    {
      label: chatWindow?.isVisible() ? "Hide Chat" : "Show Chat",
      click: () => {
        showAssistantFromTray();

        if (!getChatWindow()) {
          openView("chat");
          return;
        }

        toggleChatWindow();
      },
    },
    { type: "separator" },
    {
      label: "Chat",
      click: () => openView("chat"),
    },
    {
      label: "Settings",
      click: () => openView("settings-general"),
    },
    {
      label: "Advanced Settings",
      click: () => openView("settings-advanced"),
    },
    { type: "separator" },
    {
      label: "Start with Windows",
      type: "checkbox",
      checked: Boolean(settings.startWithWindows),
      enabled: process.platform === "win32" && app.isPackaged,
      click: (menuItem) => {
        getStateManager().setStateValue(
          "settings.startWithWindows",
          menuItem.checked,
        );
        refreshTrayMenu();
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ];

  return Menu.buildFromTemplate(menuTemplate);
}

export async function createTray() {
  if (process.platform !== "win32" || tray) {
    return tray;
  }

  tray = new Tray(await createTrayIcon());
  tray.setToolTip("Office Buddies");
  tray.setContextMenu(buildTrayMenu());
  tray.on("click", () => {
    showAssistantFromTray();
    refreshTrayMenu();
  });
  tray.on("right-click", () => {
    refreshTrayMenu();
    tray?.popUpContextMenu();
  });

  return tray;
}

export function refreshTrayMenu() {
  tray?.setContextMenu(buildTrayMenu());
}

export function destroyTray() {
  tray?.destroy();
  tray = null;
}

export function shouldMinimizeToTray() {
  return process.platform === "win32";
}

export function isTrayQuitInProgress() {
  return isQuitting;
}
