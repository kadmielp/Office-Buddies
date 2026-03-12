import { ElectronLlmRenderer } from "@electron/llm";
import {
  KnowledgeFileSource,
  KnowledgeMcpSource,
  MpcServerConfig,
  MpcServerType,
  SharedState,
} from "../shared/shared-state";
import {
  ChatRecord,
  MessageRecord,
  ChatWithMessages,
  ClippyDebugInfo,
  Versions,
  BuddySpeechPayload,
  BuddyAction,
} from "../types/interfaces";
import { DebugState } from "../shared/debug-state";

import type { BubbleView } from "./contexts/BubbleViewContext";
import { Data } from "electron";

export type ClippyApi = {
  captureAssistantScreenshot: () => Promise<{
    dataUrl: string;
    width: number;
    height: number;
  } | null>;
  // Window
  toggleChatWindow: () => Promise<void>;
  minimizeChatWindow: () => Promise<void>;
  maximizeChatWindow: () => Promise<void>;
  setMainWindowSize: (width: number, height: number) => Promise<void>;
  onSetBubbleView: (callback: (bubbleView: BubbleView) => void) => void;
  offSetBubbleView: () => void;
  popupAppMenu: () => void;
  setContextMenuAnimations: (animationKeys: string[]) => Promise<void>;
  onContextMenuSelectAnimation: (
    callback: (animationKey: string | null) => void,
  ) => void;
  offContextMenuSelectAnimation: () => void;
  onBuddySpeech: (callback: (payload: BuddySpeechPayload) => void) => void;
  offBuddySpeech: () => void;
  runBuddyAction: (action: BuddyAction, selectionText: string) => Promise<void>;
  // Models
  updateModelState: () => Promise<void>;
  downloadModelByName: (name: string) => Promise<void>;
  removeModelByName: (name: string) => Promise<void>;
  deleteModelByName: (name: string) => Promise<boolean>;
  deleteAllModels: () => Promise<boolean>;
  addModelFromFile: () => Promise<void>;
  pickKnowledgeFiles: (
    existingFiles: KnowledgeFileSource[],
  ) => Promise<KnowledgeFileSource[]>;
  refreshKnowledgeFiles: (
    existingFiles: KnowledgeFileSource[],
  ) => Promise<KnowledgeFileSource[]>;
  getAvailableMcpSources: () => Promise<KnowledgeMcpSource[]>;
  saveMcpServer: (server: {
    id?: string;
    name: string;
    type: MpcServerType;
    endpoint?: string;
    command?: string;
    credential?: string;
  }) => Promise<MpcServerConfig>;
  deleteMcpServer: (serverId: string) => Promise<void>;
  // State
  offStateChanged: () => void;
  onStateChanged: (callback: (state: SharedState) => void) => void;
  getFullState: () => Promise<SharedState>;
  getState: (key: string) => Promise<any>;
  setState: (key: string, value: any) => Promise<void>;
  openStateInEditor: () => Promise<void>;
  // Debug
  offDebugStateChanged: () => void;
  onDebugStateChanged: (callback: (state: DebugState) => void) => void;
  getFullDebugState: () => Promise<DebugState>;
  getDebugState: (key: string) => Promise<any>;
  setDebugState: (key: string, value: any) => Promise<void>;
  openDebugStateInEditor: () => Promise<void>;
  getDebugInfo(): Promise<ClippyDebugInfo>;
  // App
  getVersions: () => Promise<Versions>;
  checkForUpdates: () => Promise<void>;
  // Chats
  getChatRecords: () => Promise<Record<string, ChatRecord>>;
  getChatWithMessages: (chatId: string) => Promise<ChatWithMessages | null>;
  writeChatWithMessages: (chatWithMessages: ChatWithMessages) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  deleteAllChats: () => Promise<void>;
  onNewChat: (callback: () => void) => void;
  offNewChat: () => void;
  // Proactive
  onProactiveSpeech: (
    callback: (payload: {
      message: string;
      animation?: string;
      actions?: Array<{ label: string; action: string }>;
      loop?: boolean;
    }) => void,
  ) => void;
  offProactiveSpeech: () => void;
  // Remote AI Providers
  fetchRemoteProviderModels: (
    provider: "openai" | "gemini" | "maritaca" | "openclaw",
  ) => Promise<string[]>;
  promptRemoteProvider: (payload: {
    provider: "openai" | "gemini" | "maritaca" | "openclaw";
    systemPrompt: string;
    history: MessageRecord[];
    requestUUID?: string;
    onChunk?: (chunk: string) => void;
    onDone?: () => void;
    onError?: (error: string) => void;
  }) => Promise<string> | void;
  // Clipboard
  clipboardWrite: (data: Data) => Promise<void>;
  // Proactive
  sendProactiveAction: (messageId: string, action: string) => Promise<void>;
  onProactiveMessage: (
    callback: (payload: {
      message: string;
      animation?: string;
      actions?: Array<{ label: string; action: string }>;
    }) => void,
  ) => void;
  offProactiveMessage: () => void;
};

declare global {
  interface Window {
    electronAi: ElectronLlmRenderer;
    clippy: ClippyApi;
  }
}

export const clippyApi = window["clippy"];
export const electronAi = window["electronAi"];

