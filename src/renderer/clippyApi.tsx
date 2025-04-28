import { ElectronLlmRenderer } from "@electron/llm";

import type { ShowWindowByNameOptions, HideWindowByNameOptions } from "../ipc-messages";

export type ClippyApi = {
  showWindowByName: (options: ShowWindowByNameOptions) => Promise<void>;
  hideWindowByName: (options: HideWindowByNameOptions) => Promise<void>;
};

declare global {
  interface Window {
    electronAi: ElectronLlmRenderer;
    clippy: ClippyApi;
  }
}

export const clippyApi = window['clippy'];
export const electronAi = window['electronAi'];
