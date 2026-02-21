import {
  BrowserWindow,
  shell,
  screen,
  app,
  MenuItemConstructorOptions,
} from "electron";
import contextMenu from "electron-context-menu";
import { getLogger } from "./logger";

import path from "path";
import { getStateManager } from "./state";
import { getDebugManager } from "./debug";
import { popupAppMenu } from "./menu";
import { runBuddyAction } from "./buddy-actions";

let mainWindow: BrowserWindow | undefined;

function setWindowAlwaysOnTop(
  window: BrowserWindow | undefined,
  enabled: boolean | undefined,
) {
  if (!window) {
    return;
  }

  const shouldStayOnTop = Boolean(enabled);
  window.setAlwaysOnTop(shouldStayOnTop);

  if (shouldStayOnTop) {
    window.moveTop();
  }
}

function syncAlwaysOnTopWithSettings() {
  const settings = getStateManager().store.get("settings");
  setWindowAlwaysOnTop(getMainWindow(), settings.clippyAlwaysOnTop);
  setWindowAlwaysOnTop(getChatWindow(), settings.chatAlwaysOnTop);
}

/**
 * Get the main window
 *
 * @returns The main window
 */
export function getMainWindow(): BrowserWindow | undefined {
  return mainWindow;
}

/**
 * Create the main window
 *
 * @returns The main window
 */
export async function createMainWindow() {
  getLogger().info("Creating main window");

  if (mainWindow && !mainWindow.isDestroyed()) {
    getLogger().info("Main window already exists, skipping creation");
    return;
  }

  const settings = getStateManager().store.get("settings");
  const DEFAULT_WIDTH = 125;
  const DEFAULT_HEIGHT = 100;
  const DEFAULT_MARGIN = 20;
  const { workArea } = screen.getPrimaryDisplay();
  const defaultX = workArea.x + workArea.width - DEFAULT_WIDTH - DEFAULT_MARGIN;
  const defaultY =
    workArea.y + workArea.height - DEFAULT_HEIGHT - DEFAULT_MARGIN;

  mainWindow = new BrowserWindow({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    x: defaultX,
    y: defaultY,
    transparent: true,
    hasShadow: false,
    frame: false,
    titleBarStyle: "hidden",
    acceptFirstMouse: true,
    backgroundMaterial: "none",
    resizable: false,
    maximizable: false,
    roundedCorners: false,
    thickFrame: false,
    title: "Office Buddies",
    alwaysOnTop: Boolean(settings.clippyAlwaysOnTop),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  setMainWindowAlwaysOnTop(settings.clippyAlwaysOnTop);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  mainWindow.on("system-context-menu", (event) => {
    event.preventDefault();
    popupAppMenu();
  });

  mainWindow.webContents.on("context-menu", (event) => {
    event.preventDefault();
    popupAppMenu();
  });
}

export function setupWindowListener() {
  app.on(
    "browser-window-created",
    (_event: Electron.Event, browserWindow: BrowserWindow) => {
      const isMainWindow = !browserWindow.getParentWindow();

      getLogger().info(`Creating window (${isMainWindow ? "main" : "child"})`);

      setupWindowOpenHandler(browserWindow);
      setupNavigationHandler(browserWindow);

      if (!isMainWindow) {
        contextMenu({
          window: browserWindow,
          prepend: (_defaultActions, parameters) => {
            const selectionText = parameters.selectionText?.trim();

            if (!selectionText) {
              return [];
            }

            return [
              {
                label: "Buddy",
                submenu: getBuddyContextActions(selectionText),
              },
              { type: "separator" },
            ];
          },
        });
      }

      if (getDebugManager().store.get("openDevToolsOnStart")) {
        browserWindow.webContents.openDevTools({ mode: "detach" });
      }

      browserWindow.webContents.on("did-finish-load", () => {
        setFontSize(getStateManager().store.get("settings").defaultFontSize, [
          browserWindow,
        ]);
        setFont(getStateManager().store.get("settings").defaultFont, [
          browserWindow,
        ]);
        syncAlwaysOnTopWithSettings();
      });
    },
  );
}

function getBuddyContextActions(
  selectionText: string,
): MenuItemConstructorOptions[] {
  return [
    {
      label: "Define",
      click: () => {
        void runBuddyAction("define", selectionText);
      },
    },
    {
      label: "Summarize",
      click: () => {
        void runBuddyAction("summarize", selectionText);
      },
    },
    {
      label: "Explain Like I'm 5",
      click: () => {
        void runBuddyAction("explain-simple", selectionText);
      },
    },
    {
      label: "Rewrite Friendly",
      click: () => {
        void runBuddyAction("rewrite-friendly", selectionText);
      },
    },
  ];
}

/**
 * Setup the window open handler
 *
 * @param browserWindow The browser window
 */
export function setupWindowOpenHandler(browserWindow: BrowserWindow) {
  browserWindow.webContents.setWindowOpenHandler(({ url, features }) => {
    if (url.startsWith("http")) {
      shell.openExternal(url);

      return { action: "deny" };
    }

    getLogger().info(`window.open() called with features: ${features}`);

    const width = parseInt(features.match(/width=(\d+)/)?.[1] || "400", 10);
    const height = parseInt(features.match(/height=(\d+)/)?.[1] || "600", 10);
    const shouldPositionNextToParent = features.includes(
      "positionNextToParent",
    );
    const newWindowPosition = shouldPositionNextToParent
      ? getPopoverWindowPosition(browserWindow, { width, height })
      : undefined;

    return {
      action: "allow",
      overrideBrowserWindowOptions: {
        frame: false,
        x: newWindowPosition?.x,
        y: newWindowPosition?.y,
        roundedCorners: false,
        minHeight: 400,
        minWidth: 400,
        alwaysOnTop: Boolean(
          getStateManager().store.get("settings").chatAlwaysOnTop,
        ),
        parent: browserWindow,
      },
    };
  });
}

function setupNavigationHandler(browserWindow: BrowserWindow) {
  browserWindow.webContents.on("will-navigate", (event, url) => {
    event.preventDefault();

    if (url.startsWith("http")) {
      shell.openExternal(url);
    }
  });
}

/**
 * Get the new window position for a popover-like window
 *
 * @param browserWindow The browser window
 * @param size The size of the new window
 * @returns The new window position
 */
export function getPopoverWindowPosition(
  browserWindow: BrowserWindow,
  size: { width: number; height: number },
): { x: number; y: number } {
  const parentBounds = browserWindow.getBounds();
  const { width, height } = size;
  const SPACING = 50; // Distance between windows

  // Get the current display
  const displays = screen.getAllDisplays();
  const display =
    displays.find(
      (display) =>
        parentBounds.x >= display.bounds.x &&
        parentBounds.x <= display.bounds.x + display.bounds.width,
    ) || displays[0];

  // Calculate horizontal position (left or right of parent)
  let x: number;
  const leftPosition = parentBounds.x - width - SPACING;

  // If left position would be off-screen, position to the right
  if (leftPosition < display.bounds.x) {
    x = parentBounds.x + parentBounds.width + SPACING;
  } else {
    x = leftPosition;
  }

  // Try to align the bottom of the new window with the parent window
  let y = parentBounds.y + parentBounds.height - height;

  // Check if the window would be too high (off-screen at the top)
  if (y < display.bounds.y) {
    // Move the window down as much as necessary
    y = display.bounds.y;
  }

  return { x, y };
}

/**
 * Get the chat window
 *
 * @returns The chat window
 */
export function getChatWindow(): BrowserWindow | undefined {
  return BrowserWindow.getAllWindows().find(isChatWindow);
}

/**
 * Check if a window is a chat window
 *
 * @param window The window to check
 * @returns True if the window is a chat window
 */
function isChatWindow(window: BrowserWindow): boolean {
  return window.webContents.getTitle() === "Office Buddies Chat";
}

/**
 * Toggle the chat window
 */
export function toggleChatWindow() {
  const chatWindow = getChatWindow();

  if (!chatWindow) {
    return;
  }

  if (chatWindow.isVisible()) {
    chatWindow.hide();
  } else {
    syncAlwaysOnTopWithSettings();
    const mainWindow = getMainWindow();
    const [width, height] = chatWindow.getSize();
    const position = getPopoverWindowPosition(mainWindow, { width, height });

    chatWindow.setPosition(position.x, position.y);
    chatWindow.show();
    chatWindow.focus();
  }
}

/**
 * Minimize the chat window
 */
export function minimizeChatWindow() {
  return getChatWindow()?.minimize();
}

/**
 * Maximize the chat window
 */
export function maximizeChatWindow() {
  if (getChatWindow()?.isMaximized()) {
    return getChatWindow()?.unmaximize();
  }

  return getChatWindow()?.maximize();
}

export function setMainWindowAlwaysOnTop(enabled: boolean | undefined) {
  setWindowAlwaysOnTop(getMainWindow(), enabled);
}

export function setChatWindowAlwaysOnTop(enabled: boolean | undefined) {
  setWindowAlwaysOnTop(getChatWindow(), enabled);
  // Keep main-window policy authoritative after changing chat's top-most flag.
  setMainWindowAlwaysOnTop(
    getStateManager().store.get("settings").clippyAlwaysOnTop,
  );
}

/**
 * Set the main window size while keeping it anchored to the bottom-right.
 *
 * @param width The window width
 * @param height The window height
 */
export function setMainWindowSize(width: number, height: number) {
  const window = getMainWindow();

  if (!window) {
    return;
  }

  const bounds = window.getBounds();
  const x = bounds.x + bounds.width - width;
  const y = bounds.y + bounds.height - height;

  window.setBounds({
    x,
    y,
    width,
    height,
  });
}

/**
 * Set the font size for all windows
 *
 * @param fontSize The font size to set
 */
export function setFontSize(
  fontSize: number,
  windows: BrowserWindow[] = BrowserWindow.getAllWindows(),
) {
  windows.forEach((window) => {
    window.webContents.executeJavaScript(
      `document.documentElement.style.setProperty('--font-size', '${fontSize}px');`,
    );
  });
}

/**
 * Set the font for all windows
 *
 * @param font The font to set
 */
export function setFont(
  font: string,
  windows: BrowserWindow[] = BrowserWindow.getAllWindows(),
) {
  windows.forEach((window) => {
    window.webContents.executeJavaScript(
      `document.querySelector('.clippy').setAttribute('data-font', '${font}');`,
    );
  });
}
