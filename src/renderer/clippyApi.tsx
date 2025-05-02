import { ElectronLlmRenderer } from "@electron/llm";
import { SharedState } from "../sharedState";
import { ChatRecord, ChatWithMessages } from "../types/interfaces";

export type ClippyApi = {
  // Window
  toggleChatWindow: () => Promise<void>;
  minimizeChatWindow: () => Promise<void>;
  maximizeChatWindow: () => Promise<void>;
  // Models
  updateModelState: () => Promise<void>;
  downloadModelByName: (name: string) => Promise<void>;
  deleteModelByName: (name: string) => Promise<boolean>;
  deleteAllModels: () => Promise<boolean>;
  // State
  offStateChanged: () => void;
  onStateChanged: (callback: (state: SharedState) => void) => void;
  getFullState: () => Promise<SharedState>;
  getState: (key: string) => Promise<any>;
  setState: (key: string, value: any) => Promise<void>;
  openStateInEditor: () => Promise<void>;
  // Chats
  getChatRecords: () => Promise<Record<string, ChatRecord>>;
  getChatWithMessages: (chatId: string) => Promise<ChatWithMessages | null>;
  writeChatWithMessages: (chatWithMessages: ChatWithMessages) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  deleteAllChats: () => Promise<void>;
};

declare global {
  interface Window {
    electronAi: ElectronLlmRenderer;
    clippy: ClippyApi;
  }
}

export const clippyApi = window["clippy"];
export const electronAi = window["electronAi"];
