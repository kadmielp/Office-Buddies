import {
  app,
  clipboard,
  Data,
  desktopCapturer,
  ipcMain,
  screen,
  shell,
} from "electron";
import {
  getMainWindow,
  toggleChatWindow,
  maximizeChatWindow,
  minimizeChatWindow,
  setMainWindowSize,
} from "./windows";
import { IpcMessages } from "../shared/ipc-messages";
import { getModelManager } from "./model-manager";
import { getStateManager } from "./state";
import { getChatManager } from "./chats";
import { ChatWithMessages, MessageReference } from "../types/interfaces";
import { popupAppMenu, setContextMenuAnimations } from "./menu";
import { checkForUpdates } from "./update";
import { getVersions } from "./helpers/getVersions";
import { getClippyDebugInfo } from "./debug-clippy";
import { getDebugManager } from "./debug";
import {
  fetchRemoteProviderModels,
  promptRemoteProvider,
  promptStreamingRemoteProvider,
} from "./remote-ai";
import { runBuddyAction } from "./buddy-actions";
import { BuddyAction } from "../types/interfaces";
import {
  getAvailableKnowledgeSources,
  pickKnowledgeFiles,
  refreshKnowledgeFiles,
} from "./knowledge";
import { buildDynamicKnowledgeContext } from "./knowledge-runtime";
import { KnowledgeFileSource } from "../shared/shared-state";
import { getIntegrationManager } from "./integrations";

export function setupIpcListeners() {
  // Window
  ipcMain.handle(IpcMessages.TOGGLE_CHAT_WINDOW, () => toggleChatWindow());
  ipcMain.handle(IpcMessages.MINIMIZE_CHAT_WINDOW, () => minimizeChatWindow());
  ipcMain.handle(IpcMessages.MAXIMIZE_CHAT_WINDOW, () => maximizeChatWindow());
  ipcMain.handle(IpcMessages.SET_MAIN_WINDOW_SIZE, (_, width, height) =>
    setMainWindowSize(width, height),
  );
  ipcMain.handle(IpcMessages.POPUP_APP_MENU, () => popupAppMenu());
  ipcMain.handle(
    IpcMessages.SET_CONTEXT_MENU_ANIMATIONS,
    (_, animationKeys: string[]) => setContextMenuAnimations(animationKeys),
  );
  ipcMain.handle(
    IpcMessages.BUDDY_RUN_ACTION,
    (_, action: BuddyAction, selectionText: string) =>
      runBuddyAction(action, selectionText),
  );
  ipcMain.handle(IpcMessages.CAPTURE_ASSISTANT_SCREENSHOT, async () => {
    const mainWindow = getMainWindow();

    if (!mainWindow) {
      return null;
    }

    const display = screen.getDisplayMatching(mainWindow.getBounds());
    const sources = await desktopCapturer.getSources({
      types: ["screen"],
      thumbnailSize: {
        width: Math.max(display.size.width, 1),
        height: Math.max(display.size.height, 1),
      },
    });
    const matchingSource =
      sources.find((source) => source.display_id === String(display.id)) ||
      sources[0];

    if (!matchingSource || matchingSource.thumbnail.isEmpty()) {
      return null;
    }

    const { width, height } = matchingSource.thumbnail.getSize();

    return {
      dataUrl: matchingSource.thumbnail.toDataURL(),
      width,
      height,
    };
  });

  // App
  ipcMain.handle(IpcMessages.APP_CHECK_FOR_UPDATES, () => checkForUpdates());
  ipcMain.handle(IpcMessages.APP_GET_VERSIONS, () => getVersions());
  ipcMain.handle(IpcMessages.APP_RESTART, () => {
    app.relaunch();
    app.exit(0);
  });
  ipcMain.handle(
    IpcMessages.APP_OPEN_REFERENCE,
    async (_, reference: MessageReference) => {
      if ("url" in reference && reference.url) {
        await shell.openExternal(reference.url);
        return;
      }

      if ("path" in reference && reference.path) {
        await shell.openPath(reference.path);
        return;
      }
    },
  );

  // Model
  ipcMain.handle(IpcMessages.DOWNLOAD_MODEL_BY_NAME, (_, name: string) =>
    getModelManager().downloadModelByName(name),
  );
  ipcMain.handle(IpcMessages.REMOVE_MODEL_BY_NAME, (_, name: string) =>
    getModelManager().removeModelByName(name),
  );
  ipcMain.handle(IpcMessages.DELETE_MODEL_BY_NAME, (_, name: string) =>
    getModelManager().deleteModelByName(name),
  );
  ipcMain.handle(IpcMessages.DELETE_ALL_MODELS, () =>
    getModelManager().deleteAllModels(),
  );
  ipcMain.handle(IpcMessages.ADD_MODEL_FROM_FILE, () =>
    getModelManager().addModelFromFile(),
  );
  ipcMain.handle(
    IpcMessages.KNOWLEDGE_PICK_FILES,
    (_, existingFiles: KnowledgeFileSource[] = []) =>
      pickKnowledgeFiles(existingFiles),
  );
  ipcMain.handle(
    IpcMessages.KNOWLEDGE_REFRESH_FILES,
    (_, existingFiles: KnowledgeFileSource[] = []) =>
      refreshKnowledgeFiles(existingFiles),
  );
  ipcMain.handle(IpcMessages.KNOWLEDGE_GET_AVAILABLE_SOURCES, () =>
    getAvailableKnowledgeSources(),
  );
  ipcMain.handle(
    IpcMessages.KNOWLEDGE_GET_DYNAMIC_CONTEXT,
    (_, query: string, options?: { enabled?: boolean }) =>
      buildDynamicKnowledgeContext(query, options),
  );
  ipcMain.handle(IpcMessages.INTEGRATIONS_SAVE, (_, integration) =>
    getIntegrationManager().saveIntegration(integration),
  );
  ipcMain.handle(IpcMessages.INTEGRATIONS_DELETE, (_, integrationId: string) =>
    getIntegrationManager().deleteIntegration(integrationId),
  );

  // State
  ipcMain.handle(IpcMessages.STATE_UPDATE_MODEL_STATE, () =>
    getStateManager().updateModelState(),
  );
  ipcMain.handle(IpcMessages.STATE_GET_FULL, () =>
    getStateManager().getSharedStateForRenderer(),
  );
  ipcMain.handle(IpcMessages.STATE_SET, (_, key: string, value: any) =>
    getStateManager().setStateValue(key, value),
  );
  ipcMain.handle(IpcMessages.STATE_GET, (_, key: string) =>
    getStateManager().getStateValueForRenderer(key),
  );
  ipcMain.handle(IpcMessages.STATE_OPEN_IN_EDITOR, () =>
    getStateManager().store.openInEditor(),
  );

  // Debug
  ipcMain.handle(
    IpcMessages.DEBUG_STATE_GET_FULL,
    () => getDebugManager().store.store,
  );
  ipcMain.handle(IpcMessages.DEBUG_STATE_SET, (_, key: string, value: any) =>
    getDebugManager().store.set(key, value),
  );
  ipcMain.handle(IpcMessages.DEBUG_STATE_GET, (_, key: string) =>
    getDebugManager().store.get(key),
  );
  ipcMain.handle(IpcMessages.DEBUG_STATE_OPEN_IN_EDITOR, () =>
    getDebugManager().store.openInEditor(),
  );
  ipcMain.handle(IpcMessages.DEBUG_GET_DEBUG_INFO, () => getClippyDebugInfo());

  // Chat
  ipcMain.handle(IpcMessages.CHAT_GET_CHAT_RECORDS, () =>
    getChatManager().getChats(),
  );
  ipcMain.handle(IpcMessages.CHAT_GET_CHAT_WITH_MESSAGES, (_, chatId: string) =>
    getChatManager().getChatWithMessages(chatId),
  );
  ipcMain.handle(
    IpcMessages.CHAT_WRITE_CHAT_WITH_MESSAGES,
    (_, chatWithMessages: ChatWithMessages) =>
      getChatManager().writeChatWithMessages(chatWithMessages),
  );
  ipcMain.handle(IpcMessages.CHAT_DELETE_CHAT, (_, chatId: string) =>
    getChatManager().deleteChat(chatId),
  );
  ipcMain.handle(IpcMessages.CHAT_DELETE_ALL_CHATS, () =>
    getChatManager().deleteAllChats(),
  );
  ipcMain.handle(IpcMessages.AI_FETCH_MODELS, (_, provider: string) =>
    fetchRemoteProviderModels(provider as any, getStateManager().getSettings()),
  );

  ipcMain.handle(
    IpcMessages.AI_PROMPT,
    async (
      _,
      payload: {
        provider: "openai" | "gemini" | "maritaca" | "openclaw";
        systemPrompt: string;
        history: ChatWithMessages["messages"];
      },
    ) =>
      promptRemoteProvider({
        provider: payload.provider as any,
        settings: getStateManager().getSettings(),
        systemPrompt: payload.systemPrompt,
        history: payload.history,
      }),
  );

  ipcMain.on(
    "clippy_ai_prompt_streaming",
    async (
      event,
      payload: {
        provider: "openai" | "gemini" | "maritaca" | "openclaw";
        systemPrompt: string;
        history: ChatWithMessages["messages"];
        requestUUID: string;
      },
    ) => {
      try {
        const stream = promptStreamingRemoteProvider({
          provider: payload.provider as any,
          settings: getStateManager().getSettings(),
          systemPrompt: payload.systemPrompt,
          history: payload.history,
        });

        for await (const chunk of stream) {
          event.reply(`clippy_ai_prompt_chunk_${payload.requestUUID}`, {
            chunk,
          });
        }

        event.reply(`clippy_ai_prompt_done_${payload.requestUUID}`);
      } catch (error) {
        event.reply(`clippy_ai_prompt_error_${payload.requestUUID}`, {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    },
  );

  // Clipboard
  ipcMain.handle(IpcMessages.CLIPBOARD_WRITE, (_, data: Data) =>
    clipboard.write(data, "clipboard"),
  );

  // Proactive
  ipcMain.handle(
    IpcMessages.PROACTIVE_ACTION_CLICK,
    async (event, messageId: string, action: string) => {
      console.log(`Proactive action clicked: ${messageId} -> ${action}`);

      const settings = getStateManager().getSettings();
      if (settings.aiProvider === "openclaw" && settings.openclawEndpoint) {
        try {
          const endpoint = settings.openclawEndpoint.replace(/\/$/, "");
          const response = await fetch(`${endpoint}/v1/chat/completions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${settings.openclawApiKey || ""}`,
            },
            body: JSON.stringify({
              model: settings.remoteModel || "default",
              messages: [
                {
                  role: "user",
                  content: `[Office Buddies Action]: ${action}`,
                },
              ],
            }),
          });

          if (response.ok) {
            const data = await response.json();
            const reply = data.choices?.[0]?.message?.content;
            if (reply) {
              // Send the agent's response back to the balloon
              getMainWindow()?.webContents.send(IpcMessages.PROACTIVE_MESSAGE, {
                message: reply,
                // We keep the balloon open with the new message
              });
            }
          } else {
            console.error(`OpenClaw feedback failed: ${response.status}`);
          }
        } catch (error) {
          console.error(
            "Failed to send proactive action feedback to OpenClaw:",
            error,
          );
        }
      }
    },
  );
}
