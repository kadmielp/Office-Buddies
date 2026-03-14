// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, Data, ipcRenderer } from "electron";
import { IpcMessages } from "../shared/ipc-messages";
import type { KnowledgeFileSource, SharedState } from "../shared/shared-state";

import type { ClippyApi } from "./clippyApi";
import {
  BuddyAction,
  BuddySpeechPayload,
  ChatWithMessages,
  DynamicKnowledgeContextResult,
  MessageReference,
} from "../types/interfaces";
import { DebugState } from "../shared/debug-state";
import { BubbleView } from "./contexts/BubbleViewContext";

const clippyApi: ClippyApi = {
  captureAssistantScreenshot: () =>
    ipcRenderer.invoke(IpcMessages.CAPTURE_ASSISTANT_SCREENSHOT),
  // Window
  toggleChatWindow: () => ipcRenderer.invoke(IpcMessages.TOGGLE_CHAT_WINDOW),
  minimizeChatWindow: () =>
    ipcRenderer.invoke(IpcMessages.MINIMIZE_CHAT_WINDOW),
  maximizeChatWindow: () =>
    ipcRenderer.invoke(IpcMessages.MAXIMIZE_CHAT_WINDOW),
  setMainWindowSize: (width: number, height: number) =>
    ipcRenderer.invoke(IpcMessages.SET_MAIN_WINDOW_SIZE, width, height),
  onSetBubbleView(callback: (bubbleView: BubbleView) => void) {
    ipcRenderer.on(IpcMessages.SET_BUBBLE_VIEW, (_event, bubbleView) =>
      callback(bubbleView),
    );
  },
  offSetBubbleView() {
    ipcRenderer.removeAllListeners(IpcMessages.SET_BUBBLE_VIEW);
  },
  popupAppMenu: () => ipcRenderer.invoke(IpcMessages.POPUP_APP_MENU),
  setContextMenuAnimations: (animationKeys: string[]) =>
    ipcRenderer.invoke(IpcMessages.SET_CONTEXT_MENU_ANIMATIONS, animationKeys),
  onContextMenuSelectAnimation: (
    callback: (animationKey: string | null) => void,
  ) => {
    ipcRenderer.on(
      IpcMessages.CONTEXT_MENU_SELECT_ANIMATION,
      (_event, animationKey: string | null) => callback(animationKey),
    );
  },
  offContextMenuSelectAnimation: () => {
    ipcRenderer.removeAllListeners(IpcMessages.CONTEXT_MENU_SELECT_ANIMATION);
  },
  onBuddySpeech: (callback: (payload: BuddySpeechPayload) => void) => {
    ipcRenderer.on(
      IpcMessages.CONTEXT_MENU_BUDDY_SPEECH,
      (_event, payload: BuddySpeechPayload) => callback(payload),
    );
  },
  offBuddySpeech: () => {
    ipcRenderer.removeAllListeners(IpcMessages.CONTEXT_MENU_BUDDY_SPEECH);
  },
  runBuddyAction: (action: BuddyAction, selectionText: string) =>
    ipcRenderer.invoke(IpcMessages.BUDDY_RUN_ACTION, action, selectionText),

  // Models
  updateModelState: () =>
    ipcRenderer.invoke(IpcMessages.STATE_UPDATE_MODEL_STATE),
  downloadModelByName: (name: string) =>
    ipcRenderer.invoke(IpcMessages.DOWNLOAD_MODEL_BY_NAME, name),
  deleteModelByName: (name: string) =>
    ipcRenderer.invoke(IpcMessages.DELETE_MODEL_BY_NAME, name),
  removeModelByName: (name: string) =>
    ipcRenderer.invoke(IpcMessages.REMOVE_MODEL_BY_NAME, name),
  deleteAllModels: () => ipcRenderer.invoke(IpcMessages.DELETE_ALL_MODELS),
  addModelFromFile: () => ipcRenderer.invoke(IpcMessages.ADD_MODEL_FROM_FILE),
  pickKnowledgeFiles: (existingFiles: KnowledgeFileSource[]) =>
    ipcRenderer.invoke(IpcMessages.KNOWLEDGE_PICK_FILES, existingFiles),
  refreshKnowledgeFiles: (existingFiles: KnowledgeFileSource[]) =>
    ipcRenderer.invoke(IpcMessages.KNOWLEDGE_REFRESH_FILES, existingFiles),
  getAvailableKnowledgeSources: () =>
    ipcRenderer.invoke(IpcMessages.KNOWLEDGE_GET_AVAILABLE_SOURCES),
  getDynamicKnowledgeContext: (
    query: string,
    options?: { enabled?: boolean },
  ): Promise<DynamicKnowledgeContextResult> =>
    ipcRenderer.invoke(
      IpcMessages.KNOWLEDGE_GET_DYNAMIC_CONTEXT,
      query,
      options,
    ),
  openReference: (reference: MessageReference) =>
    ipcRenderer.invoke(IpcMessages.APP_OPEN_REFERENCE, reference),
  saveIntegration: (integration) =>
    ipcRenderer.invoke(IpcMessages.INTEGRATIONS_SAVE, integration),
  deleteIntegration: (integrationId: string) =>
    ipcRenderer.invoke(IpcMessages.INTEGRATIONS_DELETE, integrationId),

  // State
  getFullState: () => ipcRenderer.invoke(IpcMessages.STATE_GET_FULL),
  getState: (key: string) => ipcRenderer.invoke(IpcMessages.STATE_GET, key),
  setState: (key: string, value: any) =>
    ipcRenderer.invoke(IpcMessages.STATE_SET, key, value),
  openStateInEditor: () => ipcRenderer.invoke(IpcMessages.STATE_OPEN_IN_EDITOR),
  onStateChanged: (callback: (state: SharedState) => void) => {
    ipcRenderer.on(IpcMessages.STATE_CHANGED, (_event, state: SharedState) =>
      callback(state),
    );
  },
  offStateChanged: () => {
    ipcRenderer.removeAllListeners(IpcMessages.STATE_CHANGED);
  },

  // Debug
  getFullDebugState: () => ipcRenderer.invoke(IpcMessages.DEBUG_STATE_GET_FULL),
  getDebugState: (key: string) =>
    ipcRenderer.invoke(IpcMessages.DEBUG_STATE_GET, key),
  setDebugState: (key: string, value: any) =>
    ipcRenderer.invoke(IpcMessages.DEBUG_STATE_SET, key, value),
  openDebugStateInEditor: () =>
    ipcRenderer.invoke(IpcMessages.DEBUG_STATE_OPEN_IN_EDITOR),
  onDebugStateChanged: (callback: (state: DebugState) => void) => {
    ipcRenderer.on(
      IpcMessages.DEBUG_STATE_CHANGED,
      (_event, state: DebugState) => callback(state),
    );
  },
  offDebugStateChanged: () => {
    ipcRenderer.removeAllListeners(IpcMessages.DEBUG_STATE_CHANGED);
  },
  getDebugInfo: () => ipcRenderer.invoke(IpcMessages.DEBUG_GET_DEBUG_INFO),

  // Chats
  getChatRecords: () => ipcRenderer.invoke(IpcMessages.CHAT_GET_CHAT_RECORDS),
  getChatWithMessages: (chatId: string) =>
    ipcRenderer.invoke(IpcMessages.CHAT_GET_CHAT_WITH_MESSAGES, chatId),
  writeChatWithMessages: (chatWithMessages: ChatWithMessages) =>
    ipcRenderer.invoke(
      IpcMessages.CHAT_WRITE_CHAT_WITH_MESSAGES,
      chatWithMessages,
    ),
  deleteChat: (chatId: string) =>
    ipcRenderer.invoke(IpcMessages.CHAT_DELETE_CHAT, chatId),
  deleteAllChats: () => ipcRenderer.invoke(IpcMessages.CHAT_DELETE_ALL_CHATS),
  onNewChat: (callback: () => void) => {
    ipcRenderer.on(IpcMessages.CHAT_NEW_CHAT, callback);
  },
  offNewChat: () => {
    ipcRenderer.removeAllListeners(IpcMessages.CHAT_NEW_CHAT);
  },
  onProactiveSpeech: (callback: (payload: any) => void) => {
    ipcRenderer.on(IpcMessages.PROACTIVE_MESSAGE, (_event, payload: any) =>
      callback(payload),
    );
  },
  offProactiveSpeech: () => {
    ipcRenderer.removeAllListeners(IpcMessages.PROACTIVE_MESSAGE);
  },
  fetchRemoteProviderModels: (
    provider: "openai" | "gemini" | "maritaca" | "openclaw",
  ) => ipcRenderer.invoke(IpcMessages.AI_FETCH_MODELS, provider),
  promptRemoteProvider: (payload: {
    provider: "openai" | "gemini" | "maritaca" | "openclaw";
    systemPrompt: string;
    history: ChatWithMessages["messages"];
    requestUUID?: string;
    onChunk?: (chunk: string) => void;
    onDone?: () => void;
    onError?: (error: string) => void;
  }) => {
    if (payload.requestUUID && payload.onChunk) {
      // Streaming mode
      const { requestUUID } = payload;
      const chunkListener = (_event: any, data: { chunk: string }) =>
        payload.onChunk!(data.chunk);
      const doneListener = () => {
        cleanup();
        payload.onDone?.();
      };
      const errorListener = (_event: any, data: { error: string }) => {
        cleanup();
        payload.onError?.(data.error);
      };

      const cleanup = () => {
        ipcRenderer.removeListener(
          `clippy_ai_prompt_chunk_${requestUUID}`,
          chunkListener,
        );
        ipcRenderer.removeListener(
          `clippy_ai_prompt_done_${requestUUID}`,
          doneListener,
        );
        ipcRenderer.removeListener(
          `clippy_ai_prompt_error_${requestUUID}`,
          errorListener,
        );
      };

      ipcRenderer.on(`clippy_ai_prompt_chunk_${requestUUID}`, chunkListener);
      ipcRenderer.on(`clippy_ai_prompt_done_${requestUUID}`, doneListener);
      ipcRenderer.on(`clippy_ai_prompt_error_${requestUUID}`, errorListener);

      ipcRenderer.send("clippy_ai_prompt_streaming", {
        provider: payload.provider,
        systemPrompt: payload.systemPrompt,
        history: payload.history,
        requestUUID: payload.requestUUID,
      });
    } else {
      return ipcRenderer.invoke(IpcMessages.AI_PROMPT, payload);
    }
  },

  // App
  getVersions: () => ipcRenderer.invoke(IpcMessages.APP_GET_VERSIONS),
  checkForUpdates: () => ipcRenderer.invoke(IpcMessages.APP_CHECK_FOR_UPDATES),
  restartApp: () => ipcRenderer.invoke(IpcMessages.APP_RESTART),

  // Clipboard
  clipboardWrite: (data: Data) =>
    ipcRenderer.invoke(IpcMessages.CLIPBOARD_WRITE, data),

  // Proactive
  sendProactiveAction: (messageId: string, action: string) =>
    ipcRenderer.invoke(IpcMessages.PROACTIVE_ACTION_CLICK, messageId, action),
  onProactiveMessage: (callback: (payload: any) => void) => {
    ipcRenderer.on(IpcMessages.PROACTIVE_MESSAGE, (_event, payload: any) =>
      callback(payload),
    );
  },
  offProactiveMessage: () => {
    ipcRenderer.removeAllListeners(IpcMessages.PROACTIVE_MESSAGE);
  },
};

contextBridge.exposeInMainWorld("clippy", clippyApi);
