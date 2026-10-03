import { SettingsState } from "../shared/shared-state";
import { DEFAULT_LOCAL_CONTEXT_SIZE } from "../shared/local-llm";
import { getModelManager } from "./model-manager";
import { getLocalLlmEndpoint, startLocalLlm } from "./local-llm";
import { MessageRecord } from "../types/interfaces";
import {
  getHarnessApiKey,
  getHarnessEndpoint,
  HARNESS_PROVIDERS,
  HarnessProvider,
  isHarnessProvider,
} from "../shared/agent-harness";

export const MARITACA_BASE_URL = "https://chat.maritaca.ai/api";

export const OPENCLAW_DEFAULT_MODEL = HARNESS_PROVIDERS.openclaw.defaultModel;

type RemoteProvider =
  | "local"
  | "openai"
  | "gemini"
  | "maritaca"
  | HarnessProvider;
const DEFAULT_REMOTE_MAX_TOKENS = 512;
const MIN_REMOTE_MAX_TOKENS = 64;
const MAX_REMOTE_MAX_TOKENS = 8192;

function resolveRemoteMaxTokens(settings: SettingsState): number {
  const value = settings.remoteMaxTokens;

  if (!Number.isFinite(value)) {
    return DEFAULT_REMOTE_MAX_TOKENS;
  }

  return Math.max(
    MIN_REMOTE_MAX_TOKENS,
    Math.min(MAX_REMOTE_MAX_TOKENS, Math.floor(value as number)),
  );
}

function toChatHistoryMessages(
  history: MessageRecord[],
  options?: { includeImages?: boolean },
) {
  return history
    .filter((msg) => !!msg.content || (msg.imageDataUrls?.length || 0) > 0)
    .map((msg) => {
      const role = msg.sender === "clippy" ? "assistant" : "user";
      const imageDataUrls = msg.imageDataUrls || [];

      if (
        options?.includeImages &&
        role === "user" &&
        imageDataUrls.length > 0
      ) {
        return {
          role,
          content: [
            ...(msg.content ? [{ type: "text", text: msg.content || "" }] : []),
            ...imageDataUrls.map((dataUrl) => ({
              type: "image_url",
              image_url: { url: dataUrl },
            })),
          ],
        };
      }

      return {
        role,
        content: msg.content || "",
      };
    });
}

function toGeminiHistory(history: MessageRecord[]) {
  return history
    .filter((msg) => !!msg.content || (msg.imageDataUrls?.length || 0) > 0)
    .map((msg) => {
      const imageDataUrls = msg.imageDataUrls || [];
      const parts: Array<Record<string, unknown>> = [];

      if (msg.content) {
        parts.push({ text: msg.content || "" });
      }

      if (msg.sender !== "clippy") {
        for (const dataUrl of imageDataUrls) {
          const inlineData = parseDataUrlForGemini(dataUrl);
          if (inlineData) {
            parts.push({ inlineData });
          }
        }
      }

      return {
        role: msg.sender === "clippy" ? "model" : "user",
        parts,
      };
    });
}

function parseDataUrlForGemini(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);

  if (!match) {
    return null;
  }

  return {
    mimeType: match[1],
    data: match[2],
  };
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

async function fetchJson(url: string, headers?: Record<string, string>) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Request failed (${response.status}) at ${url}: ${body}`);
  }

  const rawText = await response.text();
  try {
    return JSON.parse(rawText);
  } catch (err) {
    throw new Error(
      `Failed to parse JSON response from ${url}. Raw response: ${rawText.slice(0, 500)}`,
    );
  }
}

async function promptOpenAiCompatible(args: {
  endpoint: string;
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens: number;
  systemPrompt: string;
  history: MessageRecord[];
  includeImages?: boolean;
}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (args.apiKey && args.apiKey.trim()) {
    headers.Authorization = `Bearer ${args.apiKey.trim()}`;
  }

  const body: any = {
    model: args.model,
    messages: [
      { role: "system", content: args.systemPrompt },
      ...toChatHistoryMessages(args.history, {
        includeImages: args.includeImages,
      }),
    ],
    temperature: args.temperature,
    max_tokens: args.maxTokens,
    stream: false,
  };

  // OpenClaw specific metadata
  if (args.endpoint.includes(".ts.net") || args.endpoint.includes("openclaw")) {
    body.metadata = { reply_to: "bubble" };
  }

  const response = await fetch(args.endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Provider request failed (${response.status}) at ${args.endpoint}: ${body}`,
    );
  }

  const payload = await response.json();
  return getOpenAiCompatibleText(payload);
}

function ensureProtocol(url: string): string {
  if (!url) return "";
  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `http://${normalized}`;
  }
  return normalized;
}

function getHarnessBaseUrl(
  settings: SettingsState,
  provider: HarnessProvider,
): string {
  const endpoint = getHarnessEndpoint(settings, provider);

  if (!endpoint) {
    throw new Error(
      `${HARNESS_PROVIDERS[provider].label} endpoint is missing.`,
    );
  }

  const baseUrl = ensureProtocol(endpoint).replace(/\/+$/, "");

  return baseUrl.endsWith("/v1") ? baseUrl : `${baseUrl}/v1`;
}

function getHarnessChatUrl(
  settings: SettingsState,
  provider: HarnessProvider,
): string {
  return `${getHarnessBaseUrl(settings, provider)}/chat/completions`;
}

export async function fetchRemoteProviderModels(
  provider: RemoteProvider,
  settings: SettingsState,
): Promise<string[]> {
  if (isHarnessProvider(provider)) {
    const { defaultModel } = HARNESS_PROVIDERS[provider];

    if (!getHarnessEndpoint(settings, provider)) {
      return [defaultModel];
    }

    try {
      const payload = await fetchJson(
        `${getHarnessBaseUrl(settings, provider)}/models`,
        { Authorization: `Bearer ${getHarnessApiKey(settings, provider)}` },
      );

      const models = ((payload?.data as Array<any>) || [])
        .map((item) => item?.id)
        .filter((id) => typeof id === "string")
        .sort();

      if (models.length > 0) {
        return models;
      }
    } catch {
      // Fall back to the harness's default model when discovery is unavailable.
    }

    return [defaultModel];
  }

  if (provider === "openai") {
    const payload = await fetchJson("https://api.openai.com/v1/models", {
      Authorization: `Bearer ${settings.openAiApiKey || ""}`,
    });

    return ((payload?.data as Array<any>) || [])
      .map((item) => item?.id)
      .filter((id) => typeof id === "string")
      .sort();
  }

  if (provider === "gemini") {
    const apiKey = encodeURIComponent(settings.geminiApiKey || "");
    const payload = await fetchJson(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );

    return ((payload?.models as Array<any>) || [])
      .map((item) => item?.name)
      .filter((name) => typeof name === "string")
      .map((name: string) => name.replace(/^models\//, ""))
      .sort();
  }

  const endpoints = [
    `${MARITACA_BASE_URL}/models`,
    `${MARITACA_BASE_URL}/v1/models`,
  ];

  let lastError: unknown = null;

  for (const endpoint of endpoints) {
    try {
      const payload = await fetchJson(endpoint, {
        Authorization: `Bearer ${settings.maritacaApiKey || ""}`,
      });

      const models = ((payload?.data as Array<any>) || [])
        .map((item) => item?.id)
        .filter((id) => typeof id === "string")
        .sort();

      if (models.length > 0) {
        return models;
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Unable to load Maritaca models.");
}

async function* streamOpenAiCompatible(args: {
  endpoint: string;
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens: number;
  systemPrompt: string;
  history: MessageRecord[];
  includeImages?: boolean;
  extraBody?: Record<string, unknown>;
  signal?: AbortSignal;
}): AsyncGenerator<string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (args.apiKey && args.apiKey.trim()) {
    headers.Authorization = `Bearer ${args.apiKey.trim()}`;
  }

  const body: any = {
    model: args.model,
    messages: [
      { role: "system", content: args.systemPrompt },
      ...toChatHistoryMessages(args.history, {
        includeImages: args.includeImages,
      }),
    ],
    temperature: args.temperature,
    max_tokens: args.maxTokens,
    stream: true,
    ...args.extraBody,
  };

  // OpenClaw specific metadata
  if (args.endpoint.includes(".ts.net") || args.endpoint.includes("openclaw")) {
    body.metadata = { reply_to: "bubble" };
  }

  const response = await fetch(args.endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: args.signal,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Provider request failed (${response.status}) at ${args.endpoint}: ${body}`,
    );
  }

  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === "data: [DONE]") continue;

      if (trimmed.startsWith("data: ")) {
        try {
          const json = JSON.parse(trimmed.slice(6));
          const chunk = json.choices?.[0]?.delta?.content || "";
          if (chunk) yield chunk;
        } catch (e) {
          // Ignore parse errors for partial lines
        }
      }
    }
  }
}

/**
 * Makes sure the bundled llama-server is running the selected local model and
 * returns its OpenAI-compatible endpoint. Loads it on demand when needed.
 */
export async function ensureLocalModel(settings: SettingsState) {
  const existing = getLocalLlmEndpoint();
  if (existing) {
    return existing;
  }

  const status = await loadLocalModel(settings);
  const endpoint = getLocalLlmEndpoint();
  if (!status.ready || !endpoint) {
    throw new Error("The local model is not running.");
  }

  return endpoint;
}

export function loadLocalModel(settings: SettingsState) {
  const model = settings.selectedModel
    ? getModelManager().getModelByName(settings.selectedModel)
    : undefined;

  if (!model?.path || !model.downloaded) {
    throw new Error("The selected local model is not downloaded.");
  }

  return startLocalLlm(
    model.path,
    settings.localBackend || "auto",
    settings.localContextSize || DEFAULT_LOCAL_CONTEXT_SIZE,
  );
}

const LOCAL_SYSTEM_SUFFIX = [
  "",
  "Assistant response rules:",
  "- Obey the system instructions above.",
  "- Reply to the user message directly.",
  "- Respond in the same language used in the user's latest message.",
  "- Never leave the response empty.",
  "- If you output an animation key, always include normal text after it.",
].join("\n");

// Rough budget: ~3 characters per token, keeping room for the reply.
const LOCAL_REPLY_TOKEN_RESERVE = 1024;

/**
 * llama-server rejects prompts that exceed the context window, so drop the
 * oldest turns until the conversation fits. The newest message is always kept.
 */
function prepareLocalPrompt(
  settings: SettingsState,
  systemPrompt: string,
  history: MessageRecord[],
) {
  const contextSize = settings.localContextSize || DEFAULT_LOCAL_CONTEXT_SIZE;
  const system = `${systemPrompt.trim() || "You are a helpful assistant."}\n${LOCAL_SYSTEM_SUFFIX}`;
  let budget =
    Math.max(512, contextSize - LOCAL_REPLY_TOKEN_RESERVE) * 3 - system.length;

  const kept: MessageRecord[] = [];
  for (let i = history.length - 1; i >= 0; i--) {
    budget -= (history[i].content || "").length;
    if (budget < 0 && kept.length > 0) {
      break;
    }
    kept.unshift(history[i]);
  }

  return { systemPrompt: system, history: kept };
}

function getLocalSamplingBody(settings: SettingsState) {
  return settings.topK ? { top_k: settings.topK } : {};
}

export async function* promptStreamingRemoteProvider(args: {
  provider: RemoteProvider;
  settings: SettingsState;
  systemPrompt: string;
  history: MessageRecord[];
  signal?: AbortSignal;
}): AsyncGenerator<string> {
  if (args.provider === "local") {
    const endpoint = await ensureLocalModel(args.settings);
    const prompt = prepareLocalPrompt(
      args.settings,
      args.systemPrompt,
      args.history,
    );
    yield* streamOpenAiCompatible({
      endpoint: endpoint.url,
      apiKey: endpoint.apiKey,
      model: "local",
      temperature: args.settings.temperature,
      maxTokens: -1,
      systemPrompt: prompt.systemPrompt,
      history: prompt.history,
      extraBody: getLocalSamplingBody(args.settings),
      signal: args.signal,
    });
    return;
  }

  if (args.provider === "openai") {
    yield* streamOpenAiCompatible({
      endpoint: "https://api.openai.com/v1/chat/completions",
      apiKey: args.settings.openAiApiKey || "",
      model: args.settings.remoteModel || "",
      temperature: args.settings.temperature,
      maxTokens: resolveRemoteMaxTokens(args.settings),
      systemPrompt: args.systemPrompt,
      history: args.history,
      includeImages: true,
      signal: args.signal,
    });
    return;
  }

  if (isHarnessProvider(args.provider)) {
    yield* streamOpenAiCompatible({
      endpoint: getHarnessChatUrl(args.settings, args.provider),
      apiKey: getHarnessApiKey(args.settings, args.provider),
      model:
        args.settings.remoteModel ||
        HARNESS_PROVIDERS[args.provider].defaultModel,
      temperature: args.settings.temperature,
      maxTokens: resolveRemoteMaxTokens(args.settings),
      systemPrompt: args.systemPrompt,
      history: args.history,
      includeImages: true,
      signal: args.signal,
    });
    return;
  }

  // Fallback to non-streaming for others for now or implement them
  const result = await promptRemoteProvider(args);
  yield result;
}

export async function promptRemoteProvider(args: {
  provider: RemoteProvider;
  settings: SettingsState;
  systemPrompt: string;
  history: MessageRecord[];
}): Promise<string> {
  if (args.provider === "local") {
    const endpoint = await ensureLocalModel(args.settings);
    const prompt = prepareLocalPrompt(
      args.settings,
      args.systemPrompt,
      args.history,
    );
    return promptOpenAiCompatible({
      endpoint: endpoint.url,
      apiKey: endpoint.apiKey,
      model: "local",
      temperature: args.settings.temperature,
      maxTokens: -1,
      systemPrompt: prompt.systemPrompt,
      history: prompt.history,
    });
  }

  if (args.provider === "openai") {
    return promptOpenAiCompatible({
      endpoint: "https://api.openai.com/v1/chat/completions",
      apiKey: args.settings.openAiApiKey || "",
      model: args.settings.remoteModel || "",
      temperature: args.settings.temperature,
      maxTokens: resolveRemoteMaxTokens(args.settings),
      systemPrompt: args.systemPrompt,
      history: args.history,
      includeImages: true,
    });
  }

  if (isHarnessProvider(args.provider)) {
    return promptOpenAiCompatible({
      endpoint: getHarnessChatUrl(args.settings, args.provider),
      apiKey: getHarnessApiKey(args.settings, args.provider),
      model:
        args.settings.remoteModel ||
        HARNESS_PROVIDERS[args.provider].defaultModel,
      temperature: args.settings.temperature,
      maxTokens: resolveRemoteMaxTokens(args.settings),
      systemPrompt: args.systemPrompt,
      history: args.history,
      includeImages: true,
    });
  }

  if (args.provider === "maritaca") {
    const endpoints = [
      `${MARITACA_BASE_URL}/chat/completions`,
      `${MARITACA_BASE_URL}/v1/chat/completions`,
    ];

    let lastError: unknown = null;

    for (const endpoint of endpoints) {
      try {
        return await promptOpenAiCompatible({
          endpoint,
          apiKey: args.settings.maritacaApiKey || "",
          model: args.settings.remoteModel || "",
          temperature: args.settings.temperature,
          maxTokens: resolveRemoteMaxTokens(args.settings),
          systemPrompt: args.systemPrompt,
          history: args.history,
        });
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error("Maritaca request failed.");
  }

  const model = encodeURIComponent(args.settings.remoteModel || "");
  const apiKey = encodeURIComponent(args.settings.geminiApiKey || "");
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: args.systemPrompt }],
      },
      contents: toGeminiHistory(args.history),
      generationConfig: {
        temperature: args.settings.temperature,
      },
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${body}`);
  }

  const payload = await response.json();
  return getGeminiText(payload);
}
