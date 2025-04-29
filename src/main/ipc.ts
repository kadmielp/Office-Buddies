import { ipcMain } from "electron";
import { toggleChatWindow, maximizeChatWindow, minimizeChatWindow } from "./windows";
import { IpcMessages } from "../ipc-messages";
import { getModelManager } from "./models";
import { getStateManager } from "./state";

export function setupIpcListeners() {
  ipcMain.handle(IpcMessages.TOGGLE_CHAT_WINDOW, () => toggleChatWindow());
  ipcMain.handle(IpcMessages.MINIMIZE_CHAT_WINDOW, () => minimizeChatWindow());
  ipcMain.handle(IpcMessages.MAXIMIZE_CHAT_WINDOW, () => maximizeChatWindow());

  ipcMain.handle(IpcMessages.DOWNLOAD_MODEL_BY_NAME, (_, name: string) => getModelManager().downloadModelByName(name));
  ipcMain.handle(IpcMessages.DELETE_MODEL_BY_NAME, (_, name: string) => getModelManager().deleteModelByName(name));

  ipcMain.handle(IpcMessages.STATE_UPDATE_MODEL_STATE, () => getStateManager().updateModelState());
  ipcMain.handle(IpcMessages.STATE_GET_FULL, () => getStateManager().store.store);
  ipcMain.handle(IpcMessages.STATE_SET, (_, key: string, value: any) => getStateManager().store.set(key, value));
  ipcMain.handle(IpcMessages.STATE_GET, (_, key: string) => getStateManager().store.get(key));
}
