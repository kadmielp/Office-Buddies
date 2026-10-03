import { clippyApi } from "./clippyApi";
import { Message } from "./features/chat/Message";
import { ModelState } from "../shared/models";
import {
  getHarnessEndpoint,
  HARNESS_PROVIDERS,
  isHarnessProvider,
} from "../shared/agent-harness";
import { SettingsState } from "../shared/shared-state";
import type { LocalLlmStatus } from "../shared/local-llm";

type ProviderName = NonNullable<SettingsState["aiProvider"]>;

type ProviderReadiness = {
  ready: boolean;
  reason?: string;
};

// Kept from the previous engine so callers can describe a session the same way.
export type LanguageModelPrompt = {
  role: "user" | "assistant";
  type: "text";
  content: string;
};

export type LanguageModelCreateOptions = {
  modelAlias?: string;
  systemPrompt?: string;
  topK?: number;
  temperature?: number;
  initialPrompts?: LanguageModelPrompt[];
};

const remoteAbortControllers = new Map<string, AbortController>();
let localSessionOperation: Promise<unknown> = Promise.resolve();

function queueLocalSessionOperation<T>(operation: () => Promise<T>) {
  const nextOperation = localSessionOperation.then(operation, operation);
  localSessionOperation = nextOperation.catch(() => {});
  return nextOperation;
}

/**
 * Loads the local model into the bundled llama.cpp server. Resolves with the
 * runtime in use (and why it fell back to the CPU, if it did).
 */
export async function createProviderSession(
  settings: SettingsState,
  _options?: LanguageModelCreateOptions,
): Promise<LocalLlmStatus | undefined> {
  if ((settings.aiProvider || "local") !== "local") {
    // A remote provider is selected: release the local model's memory.
    void clippyApi.stopLocalModel().catch(() => {});
    return undefined;
  }

  return queueLocalSessionOperation(() => clippyApi.startLocalModel());
}

export async function destroyProviderSession(settings: SettingsState) {
  if ((settings.aiProvider || "local") !== "local") {
    return;
  }

  // The server is stateless (history is sent with every request), so a new
  // chat keeps the loaded model; it is stopped when the provider/model changes
  // or the app quits.
}

export function abortProviderRequest(
  _settings: SettingsState,
  requestUUID: string,
) {
  clippyApi.abortRemoteProvider(requestUUID);

  const controller = remoteAbortControllers.get(requestUUID);
  controller?.abort();
  remoteAbortControllers.delete(requestUUID);
}

export function getProviderReadiness(
  settings: SettingsState,
  models: ModelState,
): ProviderReadiness {
  const provider = (settings.aiProvider || "local") as ProviderName;

  if (provider === "local") {
    if (!settings.selectedModel) {
      return { ready: false, reason: "No local model selected." };
    }

    if (!models[settings.selectedModel]?.downloaded) {
      return {
        ready: false,
        reason: "Selected local model is not downloaded.",
      };
    }

    return { ready: true };
  }

  const remoteModel = settings.remoteModel?.trim();
  if (!remoteModel) {
    return { ready: false, reason: "No remote model configured." };
  }

  if (provider === "openai" && !settings.openAiApiKey?.trim()) {
    return { ready: false, reason: "OpenAI API key is missing." };
  }

  if (provider === "gemini" && !settings.geminiApiKey?.trim()) {
    return { ready: false, reason: "Gemini API key is missing." };
  }

  if (provider === "maritaca" && !settings.maritacaApiKey?.trim()) {
    return { ready: false, reason: "Maritaca API key is missing." };
  }

  if (isHarnessProvider(provider) && !getHarnessEndpoint(settings, provider)) {
    return {
      ready: false,
      reason: `${HARNESS_PROVIDERS[provider].label} endpoint is missing.`,
    };
  }

  return { ready: true };
}

export async function* promptStreamingWithProvider(args: {
  settings: SettingsState;
  systemPrompt: string;
  history: Message[];
  input: string;
  requestUUID: string;
}): AsyncGenerator<string> {
  const provider = (args.settings.aiProvider || "local") as ProviderName;

  const controller = new AbortController();
  remoteAbortControllers.set(args.requestUUID, controller);

  try {
    if (
      provider === "local" ||
      provider === "openai" ||
      isHarnessProvider(provider)
    ) {
      const chunks: string[] = [];
      let isDone = false;
      let error: string | null = null;
      let resolveNext: (() => void) | null = null;

      const history = args.history.map((msg) => ({
        id: msg.id,
        sender: msg.sender,
        content: msg.content,
        imageDataUrls: msg.imageDataUrls,
        createdAt: msg.createdAt,
      }));

      clippyApi.promptRemoteProvider({
        provider: provider as any,
        systemPrompt: args.systemPrompt,
        history,
        requestUUID: args.requestUUID,
        onChunk: (chunk) => {
          chunks.push(chunk);
          if (resolveNext) {
            resolveNext();
            resolveNext = null;
          }
        },
        onDone: () => {
          isDone = true;
          if (resolveNext) {
            resolveNext();
            resolveNext = null;
          }
        },
        onError: (err) => {
          error = err;
          if (resolveNext) {
            resolveNext();
            resolveNext = null;
          }
        },
      });

      while (!isDone || chunks.length > 0) {
        if (error) throw new Error(error);
        if (chunks.length > 0) {
          yield chunks.shift()!;
        } else {
          await new Promise<void>((resolve) => {
            resolveNext = resolve;
          });
        }
      }
      return;
    }

    // Fallback for others (Gemini/Maritaca non-streaming for now)
    const text = await promptRemoteProvider({
      provider,
      settings: args.settings,
      systemPrompt: args.systemPrompt,
      history: args.history,
      signal: controller.signal,
    });

    yield text;
  } finally {
    remoteAbortControllers.delete(args.requestUUID);
  }
}

async function promptRemoteProvider(args: {
  provider: ProviderName;
  settings: SettingsState;
  systemPrompt: string;
  history: Message[];
  signal: AbortSignal;
}): Promise<string> {
  if (args.signal.aborted) {
    throw new Error("Request aborted");
  }

  const provider = args.provider as
    | "openai"
    | "gemini"
    | "maritaca"
    | "openclaw"
    | "hermes";
  const history = args.history.map((msg) => ({
    id: msg.id,
    sender: msg.sender,
    content: msg.content,
    imageDataUrls: msg.imageDataUrls,
    createdAt: msg.createdAt,
  }));

  const result = clippyApi.promptRemoteProvider({
    provider: provider as any,
    systemPrompt: args.systemPrompt,
    history,
  });

  if (result instanceof Promise) {
    return result;
  }

  return "";
}

export function initialPromptsFromMessages(messages: Message[]) {
  return messages
    .filter((msg) => !!msg.content)
    .map((msg) => ({
      role: msg.sender === "clippy" ? "assistant" : "user",
      type: "text",
      content: msg.content || "",
    })) as LanguageModelPrompt[];
}

export async function fetchProviderModels(
  provider: ProviderName,
  settings: SettingsState,
): Promise<string[]> {
  if (provider === "local") {
    return [];
  }

  const remoteProvider = provider as
    | "openai"
    | "gemini"
    | "maritaca"
    | "openclaw"
    | "hermes";
  return clippyApi.fetchRemoteProviderModels(remoteProvider as any) as any;
}
