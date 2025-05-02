import { ipcMain } from "electron";
import {
  toggleChatWindow,
  maximizeChatWindow,
  minimizeChatWindow,
} from "./windows";
import { IpcMessages } from "../ipc-messages";
import { getModelManager } from "./models";
import { getStateManager } from "./state";
import { getChatManager } from "./chats";
import { ChatWithMessages } from "../types/interfaces";

export function setupIpcListeners() {
  ipcMain.handle(IpcMessages.TOGGLE_CHAT_WINDOW, () => toggleChatWindow());
  ipcMain.handle(IpcMessages.MINIMIZE_CHAT_WINDOW, () => minimizeChatWindow());
  ipcMain.handle(IpcMessages.MAXIMIZE_CHAT_WINDOW, () => maximizeChatWindow());

  ipcMain.handle(IpcMessages.DOWNLOAD_MODEL_BY_NAME, (_, name: string) =>
    getModelManager().downloadModelByName(name),
  );
  ipcMain.handle(IpcMessages.DELETE_MODEL_BY_NAME, (_, name: string) =>
    getModelManager().deleteModelByName(name),
  );
  ipcMain.handle(IpcMessages.DELETE_ALL_MODELS, () =>
    getModelManager().deleteAllModels(),
  );
  ipcMain.handle(IpcMessages.STATE_UPDATE_MODEL_STATE, () =>
    getStateManager().updateModelState(),
  );
  ipcMain.handle(
    IpcMessages.STATE_GET_FULL,
    () => getStateManager().store.store,
  );
  ipcMain.handle(IpcMessages.STATE_SET, (_, key: string, value: any) =>
    getStateManager().store.set(key, value),
  );
  ipcMain.handle(IpcMessages.STATE_GET, (_, key: string) =>
    getStateManager().store.get(key),
  );
  ipcMain.handle(IpcMessages.STATE_OPEN_IN_EDITOR, () =>
    getStateManager().store.openInEditor(),
  );

  ipcMain.handle(IpcMessages.CHAT_GET_CHAT_RECORDS, () =>
    getChatManager().getChats(),
  );
  ipcMain.handle(IpcMessages.CHAT_GET_CHAT_WITH_MESSAGES, (_, chatId: string) =>
    getChatManager().getChatWithMessages(chatId),
  );
  ipcMain.handle(
    IpcMessages.CHAT_WRITE_CHAT_WITH_MESSAGES,
    (_, chatWithMessages: ChatWithMessages) =>
      getChatManager().writeChatWithMessages(chatWithMessages),
  );
}
