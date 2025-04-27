import { shell, WebContents } from "electron";

export function setupWindowOpenHandler(webContents: WebContents) {
  webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);

      return { action: 'deny' };
    }

    return {
      action: 'allow',
      overrideBrowserWindowOptions: {
        titleBarStyle: 'hidden',
      },
    }
  });
}
