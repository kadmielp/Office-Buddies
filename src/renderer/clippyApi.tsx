import { ElectronLlmRenderer } from "@electron/llm";

export type ClippyApi = {
  toggleChatWindow: () => Promise<void>;
  minimizeChatWindow: () => Promise<void>;
  maximizeChatWindow: () => Promise<void>;
};

declare global {
  interface Window {
    electronAi: ElectronLlmRenderer;
    clippy: ClippyApi;
  }
}

export const clippyApi = window['clippy'];
export const electronAi = window['electronAi'];
