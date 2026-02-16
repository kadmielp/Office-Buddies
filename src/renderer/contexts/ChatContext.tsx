import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { Message } from "../components/Message";
import { clippyApi } from "../clippyApi";
import { SharedStateContext } from "./SharedStateContext";
import { areAnyModelsReadyOrDownloading } from "../../helpers/model-helpers";
import { WelcomeMessageContent } from "../components/WelcomeMessageContent";
import { ChatRecord, MessageRecord } from "../../types/interfaces";
import { useDebugState } from "./DebugContext";
import { ErrorLoadModelMessageContent } from "../components/ErrorLoadModelMessageContent";
import { buildSystemPrompt } from "../prompt-helpers";
import {
  createProviderSession,
  destroyProviderSession,
  getProviderReadiness,
  initialPromptsFromMessages,
} from "../ai-provider-client";

import type {
  LanguageModelPrompt,
  LanguageModelCreateOptions,
} from "@electron/llm";

type ClippyNamedStatus =
  | "welcome"
  | "idle"
  | "responding"
  | "thinking"
  | "goodbye";

export type ChatContextType = {
  messages: Message[];
  addMessage: (message: Message) => Promise<void>;
  setMessages: (messages: Message[]) => void;
  animationKey: string;
  setAnimationKey: (animationKey: string) => void;
  status: ClippyNamedStatus;
  setStatus: (status: ClippyNamedStatus) => void;
  isModelLoaded: boolean;
  isStartingNewChat: boolean;
  isChatWindowOpen: boolean;
  setIsChatWindowOpen: (isChatWindowOpen: boolean) => void;
  chatRecords: Record<string, ChatRecord>;
  currentChatRecord: ChatRecord;
  selectChat: (chatId: string) => void;
  startNewChat: () => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  deleteAllChats: () => Promise<void>;
};

export const ChatContext = createContext<ChatContextType | undefined>(
  undefined,
);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatRecord, setCurrentChatRecord] = useState<ChatRecord>({
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    preview: "",
  });
  const [chatRecords, setChatRecords] = useState<Record<string, ChatRecord>>(
    {},
  );
  const [animationKey, setAnimationKey] = useState<string>("");
  const [status, setStatus] = useState<ClippyNamedStatus>("welcome");
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isStartingNewChat, setIsStartingNewChat] = useState(false);
  const { settings, models } = useContext(SharedStateContext);
  const debug = useDebugState();
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const [hasPerformedStartupCheck, setHasPerformedStartupCheck] =
    useState(false);

  const getSystemPrompt = useCallback(() => {
    return buildSystemPrompt(
      settings.systemPrompt,
      settings.selectedAgent || "Clippy",
    );
  }, [settings.selectedAgent, settings.systemPrompt]);

  const addMessage = useCallback(
    async (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    },
    [currentChatRecord, messages],
  );

  const startNewChat = useCallback(async () => {
    setIsStartingNewChat(true);

    const resetModelSession = async () => {
      if (debug?.simulateDownload) {
        return;
      }
      const readiness = getProviderReadiness(settings, models);

      if (!readiness.ready) {
        setIsModelLoaded(false);
        return;
      }

      try {
        await destroyProviderSession(settings);
      } catch (error) {
        console.error(error);
      }

      setIsModelLoaded(false);

      const options: LanguageModelCreateOptions = {
        modelAlias: settings.selectedModel,
        systemPrompt: getSystemPrompt(),
        topK: settings.topK,
        temperature: settings.temperature,
        initialPrompts: [],
      };

      try {
        await createProviderSession(settings, options);
        setIsModelLoaded(true);
      } catch (error) {
        console.error(error);
      }
    };

    // No need if there are no messages, we'll just keep the current chat
    // and update the timestamps
    try {
      if (messages.length === 0) {
        setCurrentChatRecord({
          ...currentChatRecord,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        await resetModelSession();
        return;
      }

      const newChatRecord = {
        id: crypto.randomUUID(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        preview: "",
      };

      setCurrentChatRecord(newChatRecord);
      setChatRecords((prevChatRecords) => ({
        ...prevChatRecords,
        [newChatRecord.id]: newChatRecord,
      }));
      setMessages([]);
      await resetModelSession();
    } finally {
      setIsStartingNewChat(false);
    }
  }, [
    currentChatRecord,
    debug?.simulateDownload,
    messages,
    settings.temperature,
    settings.topK,
    settings.selectedModel,
    settings.aiProvider,
    settings.remoteModel,
    settings.openAiApiKey,
    settings.geminiApiKey,
    settings.maritacaApiKey,
    models,
    getSystemPrompt,
    setIsStartingNewChat,
  ]);

  const loadModel = useCallback(
    async (initialPrompts: LanguageModelPrompt[] = []) => {
      setIsModelLoaded(false);

      const options: LanguageModelCreateOptions = {
        modelAlias: settings.selectedModel,
        systemPrompt: getSystemPrompt(),
        topK: settings.topK,
        temperature: settings.temperature,
        initialPrompts,
      };

      console.log("Loading model with options:", options);

      try {
        const readiness = getProviderReadiness(settings, models);
        if (!readiness.ready) {
          setIsModelLoaded(false);
          return;
        }

        await createProviderSession(settings, options);
        setIsModelLoaded(true);
      } catch (error) {
        console.error(error);

        addMessage({
          id: crypto.randomUUID(),
          children: <ErrorLoadModelMessageContent error={error} />,
          sender: "clippy",
          createdAt: Date.now(),
        });
      }
    },
    [
      settings.selectedModel,
      settings.aiProvider,
      settings.remoteModel,
      settings.openAiApiKey,
      settings.geminiApiKey,
      settings.maritacaApiKey,
      settings.topK,
      settings.temperature,
      models,
      getSystemPrompt,
      addMessage,
    ],
  );

  const selectChat = useCallback(
    async (chatId: string) => {
      try {
        const chatWithMessages = await clippyApi.getChatWithMessages(chatId);
        const selectedChatMessages = chatWithMessages?.messages || [];

        if (chatWithMessages) {
          setMessages(selectedChatMessages);
          setCurrentChatRecord(chatWithMessages.chat);
        }

        if (!debug?.simulateDownload) {
          try {
            await destroyProviderSession(settings);
          } catch (error) {
            console.error(error);
          }
        }

        await loadModel(initialPromptsFromMessages(selectedChatMessages));
      } catch (error) {
        console.error(error);
      }
    },
    [debug?.simulateDownload, loadModel, settings],
  );

  const deleteChat = useCallback(
    async (chatId: string) => {
      await clippyApi.deleteChat(chatId);

      setChatRecords((prevChatRecords) => {
        const newChatRecords = { ...prevChatRecords };
        delete newChatRecords[chatId];
        return newChatRecords;
      });

      if (currentChatRecord.id === chatId) {
        await startNewChat();
      }
    },
    [currentChatRecord.id],
  );

  const deleteAllChats = useCallback(async () => {
    await clippyApi.deleteAllChats();

    setChatRecords({});
    setMessages([]);
    startNewChat();
  }, []);

  // Update the chat record in the database whenever messages change
  useEffect(() => {
    const updatedChatRecord = {
      ...currentChatRecord,
      updatedAt: Date.now(),
      preview: currentChatRecord.preview || getPreviewFromMessages(messages),
    };

    const chatWithMessages = {
      chat: updatedChatRecord,
      messages: messages.map(messageRecordFromMessage),
    };

    setCurrentChatRecord(updatedChatRecord);
    setChatRecords((prevChatRecords) => ({
      ...prevChatRecords,
      [updatedChatRecord.id]: updatedChatRecord,
    }));

    clippyApi.writeChatWithMessages(chatWithMessages).catch((error) => {
      console.error(error);
    });
  }, [messages]);

  // Load the model when the selected model changes
  // or when the selected agent, system prompt, topK, or temperature change
  useEffect(() => {
    if (debug?.simulateDownload) {
      setIsModelLoaded(true);
      return;
    }

    const readiness = getProviderReadiness(settings, models);

    if (readiness.ready) {
      loadModel();
    } else if (isModelLoaded) {
      destroyProviderSession(settings)
        .then(() => {
          setIsModelLoaded(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [
    settings.aiProvider,
    settings.selectedModel,
    settings.remoteModel,
    settings.openAiApiKey,
    settings.geminiApiKey,
    settings.maritacaApiKey,
    settings.selectedAgent,
    settings.systemPrompt,
    settings.topK,
    settings.temperature,
    models,
  ]);

  // If selectedModel is undefined or not available, set it to the first downloaded model
  useEffect(() => {
    if (settings.aiProvider !== "local") {
      return;
    }

    if (
      !settings.selectedModel ||
      !models[settings.selectedModel] ||
      !models[settings.selectedModel].downloaded
    ) {
      const downloadedModel = Object.values(models).find(
        (model) => model.downloaded,
      );

      if (downloadedModel) {
        clippyApi.setState("settings.selectedModel", downloadedModel.name);
      }
    }
  }, [models, settings.aiProvider]);

  // At app startup, initially load the chat records from the main process
  useEffect(() => {
    clippyApi.getChatRecords().then((chatRecords) => {
      setChatRecords(chatRecords);
    });
  }, []);

  // At app startup, check if any models are ready. If none are, kick off a download
  // for our smallest model and tell the user about it.
  useEffect(() => {
    if (hasPerformedStartupCheck) {
      return;
    }

    if (Object.keys(models).length === 0) {
      return;
    }

    // This is a startup-only check. Once we know the app already has chat history
    // or any ready/downloading model, do not auto-trigger downloads later due to
    // user actions like deleting models.
    if (messages.length > 0 || areAnyModelsReadyOrDownloading(models)) {
      setHasPerformedStartupCheck(true);
      return;
    }

    setHasPerformedStartupCheck(true);

    addMessage({
      id: crypto.randomUUID(),
      children: <WelcomeMessageContent />,
      content: "Welcome to Office Buddies!",
      sender: "clippy",
      createdAt: Date.now(),
    });

    const downloadModelIfNoneReady = async () => {
      if (settings.aiProvider !== "local") {
        return;
      }

      await clippyApi.downloadModelByName("Gemma 3 (1B)");

      setTimeout(async () => {
        await clippyApi.updateModelState();
      }, 500);
    };

    void downloadModelIfNoneReady();
  }, [hasPerformedStartupCheck, messages.length, models, settings.aiProvider]);

  // Subscribe to the main process's newChat event
  useEffect(() => {
    clippyApi.offNewChat();
    clippyApi.onNewChat(async () => {
      await startNewChat();
    });

    return () => {
      clippyApi.offNewChat();
    };
  }, [startNewChat]);

  const value = {
    chatRecords,
    currentChatRecord,
    selectChat,
    deleteChat,
    deleteAllChats,
    startNewChat,
    messages,
    addMessage,
    setMessages,
    animationKey,
    setAnimationKey,
    status,
    setStatus,
    isModelLoaded,
    isStartingNewChat,
    isChatWindowOpen,
    setIsChatWindowOpen,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }

  return context;
}

function messageRecordFromMessage(message: Message): MessageRecord {
  return {
    id: message.id,
    content: message.content,
    sender: message.sender,
    createdAt: message.createdAt,
  };
}

function getPreviewFromMessages(messages: Message[]): string {
  if (messages.length === 0) {
    return "";
  }

  if (messages[0].sender === "clippy") {
    return "Welcome to Office Buddies!";
  }

  // Remove newlines and limit to 100 characters
  return messages[0].content.replace(/\n/g, " ").substring(0, 100);
}
