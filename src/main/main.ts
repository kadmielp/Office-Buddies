import { app, BrowserWindow } from 'electron';
import { loadElectronLlm } from '@electron/llm';
import path from 'node:path';
import { setupIpcListeners } from './ipc';
import { shouldQuit } from './squirrel-startup';
import { createMainWindow } from './windows';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (shouldQuit) {
  app.quit();
}

async function onReady() {
  await loadElectronLlm({
    getModelPath: (modelAlias: string) => {
      return path.join(app.getPath('downloads'), `${modelAlias}.gguf`);
    }
  });

  setupIpcListeners();
  await createMainWindow();
}



app.on('ready', onReady);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
