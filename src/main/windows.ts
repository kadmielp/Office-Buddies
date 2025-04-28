import { BrowserWindow, shell, screen } from "electron";
import path from "path";

let mainWindow: BrowserWindow | undefined;

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
  mainWindow = new BrowserWindow({
    width: 125,
    height: 100,
    transparent: true,
    hasShadow: false,
    frame: false,
    acceptFirstMouse: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Setup Window open handler
  setupWindowOpenHandler(mainWindow);
}

/**
 * Setup the window open handler
 *
 * @param browserWindow The browser window
 */
export function setupWindowOpenHandler(browserWindow: BrowserWindow) {
  browserWindow.webContents.setWindowOpenHandler(({ url, features }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);

      return { action: 'deny' };
    }

    const width = parseInt(features.match(/width=(\d+)/)?.[1] || '400', 10);
    const height = parseInt(features.match(/height=(\d+)/)?.[1] || '600', 10);
    const shouldPositionNextToParent = features.includes('positionNextToParent');
    const newWindowPosition = shouldPositionNextToParent ? getPopoverWindowPosition(browserWindow, { width, height }) : undefined;

    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        frame: false,
        x: newWindowPosition?.x,
        y: newWindowPosition?.y,
        roundedCorners: false,
        minHeight: 400,
        minWidth: 400,
      },
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
export function getPopoverWindowPosition(browserWindow: BrowserWindow, size: { width: number, height: number }): { x: number, y: number } {
  const parentBounds = browserWindow.getBounds();
  const { width, height } = size;
  const SPACING = 50; // Distance between windows

  // Get the current display
  const displays = screen.getAllDisplays();
  const display = displays.find((display) =>
    parentBounds.x >= display.bounds.x &&
    parentBounds.x <= display.bounds.x + display.bounds.width
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
  return BrowserWindow.getAllWindows().find((window) => window.webContents.getTitle() === 'Clippy Chat');
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
    const mainWindow = getMainWindow();
    const [width, height] = chatWindow.getSize();
    const position = getPopoverWindowPosition(mainWindow, { width, height });

    chatWindow.setPosition(position.x, position.y);
    chatWindow.show();
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
