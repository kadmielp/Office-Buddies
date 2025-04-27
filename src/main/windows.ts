import { BrowserWindow, shell, screen } from "electron";

export function setupWindowOpenHandler(browserWindow: BrowserWindow) {
  browserWindow.webContents.setWindowOpenHandler(({ url, features }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);

      return { action: 'deny' };
    }

    const width = parseInt(features.match(/width=(\d+)/)?.[1] || '400', 10);
    const height = parseInt(features.match(/height=(\d+)/)?.[1] || '600', 10);
    const shouldPositionNextToParent = features.includes('positionNextToParent');
    const newWindowPosition = shouldPositionNextToParent ? getNewWindowPosition(browserWindow, { width, height }) : undefined;

    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        titleBarStyle: 'hidden',
        x: newWindowPosition?.x,
        y: newWindowPosition?.y,
      },
    }
  });
}

function getNewWindowPosition(browserWindow: BrowserWindow, size: { width: number, height: number }): { x: number, y: number } {
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
