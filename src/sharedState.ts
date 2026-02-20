import { ModelState } from "./models";

export type DefaultFont =
  | "Pixelated MS Sans Serif"
  | "Comic Sans MS"
  | "Tahoma"
  | "System Default";
export type DefaultFontSize = number;
export type AiProvider = "local" | "openai" | "gemini" | "maritaca";

export interface SettingsState {
  aiProvider?: AiProvider;
  selectedModel?: string;
  remoteModel?: string;
  openAiApiKey?: string;
  geminiApiKey?: string;
  maritacaApiKey?: string;
  selectedAgent?: string;
  systemPrompt?: string;
  clippyAlwaysOnTop?: boolean;
  chatAlwaysOnTop?: boolean;
  alwaysOpenChat?: boolean;
  topK?: number;
  temperature?: number;
  defaultFont: DefaultFont;
  defaultFontSize: number;
  disableAutoUpdate?: boolean;
  disableSound?: boolean;
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
  state: "progressing" | "completed" | "cancelled" | "interrupted";
};

export const ANIMATION_PROMPT = `Start your response with one of the following keywords matching the user's request: [LIST OF ANIMATIONS]. Use only one keyword, and only at the very beginning of your response. Always start with one.`;
export const DEFAULT_SYSTEM_PROMPT = `You are [AGENT_NAME], a helpful local desktop assistant running on the user's computer.
Personality: [AGENT_PERSONALITY]
Appearance context: [AGENT_APPEARANCE]
When asked who you are, describe yourself as [AGENT_NAME], a local AI assistant in this app. Do not mention underlying model names or providers.
Keep replies useful, accurate, and respectful.
Always reply in the same language used by the user in their most recent message.
${ANIMATION_PROMPT}`;

export const DEFAULT_SETTINGS: SettingsState = {
  aiProvider: "local",
  clippyAlwaysOnTop: true,
  chatAlwaysOnTop: true,
  alwaysOpenChat: true,
  selectedAgent: "Clippy",
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  topK: 10,
  temperature: 0.7,
  defaultFont: "Tahoma",
  defaultFontSize: 12,
  disableAutoUpdate: false,
  disableSound: false,
};

export const EMPTY_SHARED_STATE: SharedState = {
  models: {},
  settings: {
    ...DEFAULT_SETTINGS,
  },
};
