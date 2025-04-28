// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { HideWindowByNameOptions, IpcRendererMessages, ShowWindowByNameOptions } from '../ipc-messages';

contextBridge.exposeInMainWorld('clippy', {
  hideWindowByName: (options: HideWindowByNameOptions) => ipcRenderer.invoke(IpcRendererMessages.HIDE_WINDOW_BY_NAME, options),
  showWindowByName: (options: ShowWindowByNameOptions) => ipcRenderer.invoke(IpcRendererMessages.SHOW_WINDOW_BY_NAME, options),
});
