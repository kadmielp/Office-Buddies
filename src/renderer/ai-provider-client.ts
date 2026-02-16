import type {
  LanguageModelCreateOptions,
  LanguageModelPrompt,
} from "@electron/llm";
import { clippyApi, electronAi } from "./clippyApi";
import { Message } from "./components/Message";
import { ModelState } from "../models";
import { SettingsState } from "../sharedState";
import { MessageRecord } from "../types/interfaces";

export const MARITACA_BASE_URL = "https://chat.maritaca.ai/api";

type ProviderName = NonNullable<SettingsState["aiProvider"]>;

type ProviderReadiness = {
  ready: boolean;
  reason?: string;
};

const remoteAbortControllers = new Map<string, AbortController>();
let localSessionOperation: Promise<void> = Promise.resolve();
const LOCAL_SYSTEM_PROMPT_FALLBACK = "You are a helpful assistant.";

function queueLocalSessionOperation(operation: () => Promise<void>) {
  const nextOperation = localSessionOperation.then(operation, operation);
  localSessionOperation = nextOperation.catch(() => {});
  return nextOperation;
}

function isStoppedSessionError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return /Unexpected message type:\s*stopped/i.test(error.message);
}

function buildLocalTurnInput(systemPrompt: string, input: string): string {
  const prompt = systemPrompt.trim() || LOCAL_SYSTEM_PROMPT_FALLBACK;
  const userInput = input.trim();

  return [
    "System instructions (highest priority):",
    prompt,
    "",
    "User message:",
    userInput,
    "",
    "Assistant response rules:",
    "- Obey the system instructions above.",
    "- Reply to the user message directly.",
    "- Respond in the same language used in the user's latest message.",
    "- Never leave the response empty.",
    "- If you output an animation key, always include normal text after it.",
  ].join("\n");
}

export async function createProviderSession(
  settings: SettingsState,
  options: LanguageModelCreateOptions,
) {
  if ((settings.aiProvider || "local") !== "local") {
    return;
  }

  await queueLocalSessionOperation(async () => {
    try {
      await electronAi.create(options);
      return;
    } catch (error) {
      if (!isStoppedSessionError(error)) {
        throw error;
      }

      // Recovery path for transient renderer/main session desync.
      await electronAi.destroy().catch(() => {});
      await electronAi.create(options);
    }
  });
}

export async function destroyProviderSession(settings: SettingsState) {
  if ((settings.aiProvider || "local") !== "local") {
    return;
  }

  await queueLocalSessionOperation(async () => {
    await electronAi.destroy();
  });
}

export function abortProviderRequest(
  settings: SettingsState,
  requestUUID: string,
) {
  if ((settings.aiProvider || "local") === "local") {
    return electronAi.abortRequest(requestUUID);
  }

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

  if (provider === "local") {
    const localInput = buildLocalTurnInput(args.systemPrompt, args.input);
    const stream = await electronAi.promptStreaming(localInput, {
      requestUUID: args.requestUUID,
    });

    for await (const chunk of stream) {
      yield chunk;
    }

    return;
  }

  const controller = new AbortController();
  remoteAbortControllers.set(args.requestUUID, controller);

  try {
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

function toChatHistoryMessages(history: Message[]) {
  return history
    .filter((msg) => !!msg.content)
    .map((msg) => ({
      role: msg.sender === "clippy" ? "assistant" : "user",
      content: msg.content || "",
    }));
}

function toGeminiHistory(history: Message[]) {
  return history
    .filter((msg) => !!msg.content)
    .map((msg) => ({
      role: msg.sender === "clippy" ? "model" : "user",
      parts: [{ text: msg.content || "" }],
    }));
}

function getGeminiText(payload: any): string {
  const candidates = payload?.candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) {
    return "";
  }

  const parts = candidates[0]?.content?.parts;
  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .map((part: any) => part?.text || "")
    .join("")
    .trim();
}

function getOpenAiCompatibleText(payload: any): string {
  const content = payload?.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => (typeof item?.text === "string" ? item.text : ""))
      .join("")
      .trim();
  }

  return "";
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

  const provider = args.provider as "openai" | "gemini" | "maritaca";
  const history: MessageRecord[] = args.history.map((msg) => ({
    id: msg.id,
    sender: msg.sender,
    content: msg.content,
    createdAt: msg.createdAt,
  }));

  return clippyApi.promptRemoteProvider({
    provider,
    systemPrompt: args.systemPrompt,
    history,
  });
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

  const remoteProvider = provider as "openai" | "gemini" | "maritaca";
  return clippyApi.fetchRemoteProviderModels(remoteProvider);
}
