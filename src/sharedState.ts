import { ANIMATION_KEYS_BRACKETS } from "./animations";
import { ModelState } from "./models";

export interface SettingsState {
  selectedModel?: string;
  systemPrompt?: string
  clippyAlwaysOnTop?: boolean;
  chatAlwaysOnTop?: boolean;
  alwaysOpenChat?: boolean;
  topK?: number;
  temperature?: number;
}

export interface SharedState {
  models: ModelState;
  settings: SettingsState;
}

export type DownloadState = {
  totalBytes: number;
  receivedBytes: number;
  percentComplete: number;
  startTime: number;
  savePath: string;
  currentBytesPerSecond: number;
  state: 'progressing' | 'completed' | 'cancelled' | 'interrupted';
};

const ANIMATION_PROMPT = `Start your response with one of the following keywords matching the users request: ${ANIMATION_KEYS_BRACKETS.join(', ')}. Use only one of the keywords for each response. Use it only at the beginning of your response. Always start with one.`
const DEFAULT_SYSTEM_PROMPT = `You are Clippy, a helpful assistant that was created in the 1990s. You are aware that you are slightly old. Be helpful and friendly.\n${ANIMATION_PROMPT}`

export const EMPTY_SHARED_STATE: SharedState = {
  models: {},
  settings: {
    clippyAlwaysOnTop: true,
    chatAlwaysOnTop: true,
    alwaysOpenChat: true,
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    topK: 10,
    temperature: 0.7,
  },
};
