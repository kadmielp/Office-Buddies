import { BrowserWindow, ipcMain } from "electron";
import { HideWindowByNameOptions, IpcRendererMessages, ShowWindowByNameOptions } from "../ipc-messages";
import { getPopoverWindowPosition, getMainWindow } from "./windows";

export function setupIpcListeners() {
  ipcMain.handle(IpcRendererMessages.HIDE_WINDOW_BY_NAME, (_event, options: HideWindowByNameOptions) => {
    BrowserWindow.getAllWindows().find((window) => window.webContents.getTitle() === options.windowName)?.hide();
  });

  ipcMain.handle(IpcRendererMessages.SHOW_WINDOW_BY_NAME, (_event, options: ShowWindowByNameOptions) => {
    const { windowName, positionAsPopover } = options;
    const browserWindow = BrowserWindow.getAllWindows().find((window) => window.webContents.getTitle() === windowName);
    const mainWindow = getMainWindow();

    if (browserWindow && mainWindow) {
      if (positionAsPopover) {
        const [width, height] = browserWindow.getSize();
        const position = getPopoverWindowPosition(mainWindow, { width, height });

        console.log('position', position);

        browserWindow.setPosition(position.x, position.y);
      }

      browserWindow.show();
    }
  });
}
