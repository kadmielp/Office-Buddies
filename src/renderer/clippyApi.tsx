import { ElectronLlmRenderer } from "@electron/llm";
import { SharedState } from "../types/interfaces";

export type ClippyApi = {
  toggleChatWindow: () => Promise<void>;
  minimizeChatWindow: () => Promise<void>;
  maximizeChatWindow: () => Promise<void>;
  updateModelState: () => Promise<void>;
  downloadModelByName: (name: string) => Promise<void>;
  deleteModelByName: (name: string) => Promise<boolean>;
  offStateChanged: () => void;
  onStateChanged: (callback: (state: SharedState) => void) => void;
  getFullState: () => Promise<SharedState>;
  getState: (key: string) => Promise<any>;
  setState: (key: string, value: any) => Promise<void>;
};

declare global {
  interface Window {
    electronAi: ElectronLlmRenderer;
    clippy: ClippyApi;
  }
}

export const clippyApi = window['clippy'];
export const electronAi = window['electronAi'];
