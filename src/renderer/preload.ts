// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { IpcRendererMessages } from '../ipc-messages';

contextBridge.exposeInMainWorld('clippy', {
  toggleChatWindow: () => ipcRenderer.invoke(IpcRendererMessages.TOGGLE_CHAT_WINDOW),
  minimizeChatWindow: () => ipcRenderer.invoke(IpcRendererMessages.MINIMIZE_CHAT_WINDOW),
  maximizeChatWindow: () => ipcRenderer.invoke(IpcRendererMessages.MAXIMIZE_CHAT_WINDOW),
});
