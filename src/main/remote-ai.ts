import { SettingsState } from "../sharedState";
import { MessageRecord } from "../types/interfaces";

export const MARITACA_BASE_URL = "https://chat.maritaca.ai/api";

type RemoteProvider = "openai" | "gemini" | "maritaca";
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

function toChatHistoryMessages(history: MessageRecord[]) {
  return history
    .filter((msg) => !!msg.content)
    .map((msg) => ({
      role: msg.sender === "clippy" ? "assistant" : "user",
      content: msg.content || "",
    }));
}

function toGeminiHistory(history: MessageRecord[]) {
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

  return response.json();
}

async function promptOpenAiCompatible(args: {
  endpoint: string;
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens: number;
  systemPrompt: string;
  history: MessageRecord[];
}) {
  const response = await fetch(args.endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${args.apiKey}`,
    },
    body: JSON.stringify({
      model: args.model,
      messages: [
        { role: "system", content: args.systemPrompt },
        ...toChatHistoryMessages(args.history),
      ],
      temperature: args.temperature,
      max_tokens: args.maxTokens,
      stream: false,
    }),
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

export async function fetchRemoteProviderModels(
  provider: RemoteProvider,
  settings: SettingsState,
): Promise<string[]> {
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

export async function promptRemoteProvider(args: {
  provider: RemoteProvider;
  settings: SettingsState;
  systemPrompt: string;
  history: MessageRecord[];
}): Promise<string> {
  if (args.provider === "openai") {
    return promptOpenAiCompatible({
      endpoint: "https://api.openai.com/v1/chat/completions",
      apiKey: args.settings.openAiApiKey || "",
      model: args.settings.remoteModel || "",
      temperature: args.settings.temperature,
      maxTokens: resolveRemoteMaxTokens(args.settings),
      systemPrompt: args.systemPrompt,
      history: args.history,
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
