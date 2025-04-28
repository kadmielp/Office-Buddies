import { ipcMain } from "electron";
import { toggleChatWindow, maximizeChatWindow, minimizeChatWindow } from "./windows";
import { IpcRendererMessages } from "../ipc-messages";

export function setupIpcListeners() {
  ipcMain.handle(IpcRendererMessages.TOGGLE_CHAT_WINDOW, () => toggleChatWindow());

  ipcMain.handle(IpcRendererMessages.MINIMIZE_CHAT_WINDOW, () => minimizeChatWindow());

  ipcMain.handle(IpcRendererMessages.MAXIMIZE_CHAT_WINDOW, () => maximizeChatWindow());
}
