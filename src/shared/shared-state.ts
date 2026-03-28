import { ModelState } from "./models";

export type DefaultFont =
  | "Pixelated MS Sans Serif"
  | "Comic Sans MS"
  | "Tahoma"
  | "System Default";
export type DefaultFontSize = number;
export type UiDesign = "Win98" | "WinXP";
export type AiProvider =
  | "local"
  | "openai"
  | "gemini"
  | "maritaca"
  | "openclaw";

export type KnowledgeFileStatus = "Ready" | "Indexed" | "Error";
export type KnowledgeSourceStatus = "Connected" | "Available" | "Error";
export type IntegrationType = "mcp" | "confluence";
export type McpTransportType = "http" | "stdio";

export interface KnowledgeFileSource {
  id: string;
  name: string;
  meta: string;
  status: KnowledgeFileStatus;
  filePath: string;
  previewText?: string;
}

export interface KnowledgeSource {
  id: string;
  name: string;
  meta: string;
  status: KnowledgeSourceStatus;
  integrationId: string;
  integrationType: IntegrationType;
  resourceId?: string;
}

export interface IntegrationConfig {
  id: string;
  name: string;
  type: IntegrationType;
  transport?: McpTransportType;
  endpoint?: string;
  command?: string;
  baseUrl?: string;
  accountEmail?: string;
  status: KnowledgeSourceStatus;
  hasCredential: boolean;
}

export interface IntegrationTestResult {
  ok: boolean;
  message: string;
  details?: string;
  statusCode?: number;
}

export interface SettingsState {
  aiProvider?: AiProvider;
  selectedModel?: string;
  remoteModel?: string;
  remoteMaxTokens?: number;
  openAiApiKey?: string;
  geminiApiKey?: string;
  maritacaApiKey?: string;
  openclawApiKey?: string;
  openclawEndpoint?: string;
  selectedAgent?: string;
  systemPrompt?: string;
  clippyAlwaysOnTop?: boolean;
  chatAlwaysOnTop?: boolean;
  alwaysOpenChat?: boolean;
  topK?: number;
  temperature?: number;
  uiDesign: UiDesign;
  defaultFont: DefaultFont;
  defaultFontSize: number;
  disableAutoUpdate?: boolean;
  disableSound?: boolean;
  startWithWindows?: boolean;
  enableProactiveMessages?: boolean;
  proactivePort?: number;
  useKnowledgeAtStart?: boolean;
  useKnowledgeInMiniChat?: boolean;
  knowledgeFiles?: KnowledgeFileSource[];
  knowledgeSources?: KnowledgeSource[];
  integrations?: IntegrationConfig[];
  knowledgeMcpSources?: {
    id: string;
    name: string;
    meta: string;
    status: KnowledgeSourceStatus;
    serverId: string;
    resourceId?: string;
  }[];
  mcpServers?: {
    id: string;
    name: string;
    type: McpTransportType;
    endpoint?: string;
    command?: string;
    status: KnowledgeSourceStatus;
    hasCredential: boolean;
  }[];
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
Format every response using neat, readable structure (clear sections, short paragraphs, and bullets when useful).
${ANIMATION_PROMPT}`;

export const DEFAULT_SETTINGS: SettingsState = {
  aiProvider: "local",
  clippyAlwaysOnTop: true,
  chatAlwaysOnTop: true,
  alwaysOpenChat: true,
  selectedAgent: "Clippy",
  systemPrompt: DEFAULT_SYSTEM_PROMPT,
  remoteMaxTokens: 512,
  topK: 10,
  temperature: 0.7,
  uiDesign: "Win98",
  defaultFont: "Tahoma",
  defaultFontSize: 12,
  disableAutoUpdate: false,
  disableSound: false,
  startWithWindows: false,
  enableProactiveMessages: false,
  proactivePort: 5050,
  useKnowledgeAtStart: false,
  useKnowledgeInMiniChat: true,
  knowledgeFiles: [],
  knowledgeSources: [],
  integrations: [],
};

export const EMPTY_SHARED_STATE: SharedState = {
  models: {},
  settings: {
    ...DEFAULT_SETTINGS,
  },
};
