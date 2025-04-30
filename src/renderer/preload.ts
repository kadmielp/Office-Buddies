// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { IpcMessages } from '../ipc-messages';
import type { SharedState } from '../sharedState';

import type { ClippyApi } from './clippyApi';

const clippyApi: ClippyApi = {
  toggleChatWindow: () => ipcRenderer.invoke(IpcMessages.TOGGLE_CHAT_WINDOW),
  minimizeChatWindow: () => ipcRenderer.invoke(IpcMessages.MINIMIZE_CHAT_WINDOW),
  maximizeChatWindow: () => ipcRenderer.invoke(IpcMessages.MAXIMIZE_CHAT_WINDOW),
  updateModelState: () => ipcRenderer.invoke(IpcMessages.STATE_UPDATE_MODEL_STATE),
  downloadModelByName: (name: string) => ipcRenderer.invoke(IpcMessages.DOWNLOAD_MODEL_BY_NAME, name),
  deleteModelByName: (name: string) => ipcRenderer.invoke(IpcMessages.DELETE_MODEL_BY_NAME, name),
  deleteAllModels: () => ipcRenderer.invoke(IpcMessages.DELETE_ALL_MODELS),
  getFullState: () => ipcRenderer.invoke(IpcMessages.STATE_GET_FULL),
  getState: (key: string) => ipcRenderer.invoke(IpcMessages.STATE_GET, key),
  setState: (key: string, value: any) => ipcRenderer.invoke(IpcMessages.STATE_SET, key, value),
  openStateInEditor: () => ipcRenderer.invoke(IpcMessages.STATE_OPEN_IN_EDITOR),
  onStateChanged: (callback: (state: SharedState) => void) => {
    ipcRenderer.on(IpcMessages.STATE_CHANGED, (_event, state: SharedState) => callback(state));
  },
  offStateChanged: () => {
    ipcRenderer.removeAllListeners(IpcMessages.STATE_CHANGED);
  },
}

contextBridge.exposeInMainWorld('clippy', clippyApi);

