import { getMainWindow } from "./windows";
import { IpcMessages } from "../ipc-messages";
import { BuddyAction, BuddySpeechPayload } from "../types/interfaces";
import { getStateManager } from "./state";
import { promptRemoteProvider } from "./remote-ai";
import { SettingsState } from "../sharedState";

const MAX_SELECTION_LENGTH = 220;

export async function runBuddyAction(
  action: BuddyAction,
  selectionText: string,
): Promise<void> {
  const text = selectionText.trim();

  if (!text) {
    return;
  }

  const window = getMainWindow();

  if (!window || window.isDestroyed()) {
    return;
  }

  window.webContents.send(IpcMessages.CONTEXT_MENU_BUDDY_SPEECH, {
    action,
    selectedText: truncateText(text, MAX_SELECTION_LENGTH),
    speech: getLoadingSpeech(action),
    isLoading: true,
  } as BuddySpeechPayload);

  const speech =
    action === "define"
      ? await getDefinitionSpeech(text)
      : await getGeneratedSpeech(action, text);

  getMainWindow()?.webContents.send(IpcMessages.CONTEXT_MENU_BUDDY_SPEECH, {
    action,
    selectedText: truncateText(text, MAX_SELECTION_LENGTH),
    speech,
    isLoading: false,
  } as BuddySpeechPayload);
}

function getLoadingSpeech(action: BuddyAction): string {
  if (action === "define") {
    return "Let me check a dictionary for that...";
  }

  return "Let me think about that...";
}

function getStaticSpeech(action: BuddyAction, text: string): string {
  const quoted = `\"${truncateText(text, 80)}\"`;

  switch (action) {
    case "summarize":
      return `Quick summary: ${quoted} looks important. If you want, ask me in chat and I can summarize it properly.`;
    case "explain-simple":
      return `Like you're five: ${quoted} means the same idea in smaller, simpler steps.`;
    case "rewrite-friendly":
      return `I can help rewrite that in a friendlier tone. Open chat and paste it, and I'll draft a polished version.`;
    default:
      return "I can help with that in chat.";
  }
}

async function getGeneratedSpeech(
  action: Exclude<BuddyAction, "define">,
  text: string,
): Promise<string> {
  const settings = getStateManager().store.get("settings");
  const provider = settings.aiProvider || "local";

  if (provider === "local") {
    return getStaticSpeech(action, text);
  }

  if (!isRemoteProviderConfigured(settings)) {
    return "Remote provider is not configured. Add API key and model in Settings > Model.";
  }

  try {
    const response = await promptRemoteProvider({
      provider,
      settings,
      systemPrompt: getBuddySystemPrompt(action),
      history: [
        {
          id: `buddy-${Date.now()}`,
          sender: "user",
          content: text,
          createdAt: Date.now(),
        },
      ],
    });

    const trimmed = response.trim();

    if (!trimmed) {
      return getStaticSpeech(action, text);
    }

    return truncateText(trimmed, 1600);
  } catch {
    return getStaticSpeech(action, text);
  }
}

function isRemoteProviderConfigured(settings: SettingsState): boolean {
  const provider = settings.aiProvider || "local";
  const model = settings.remoteModel?.trim();

  if (!model) {
    return false;
  }

  if (provider === "openai") {
    return Boolean(settings.openAiApiKey?.trim());
  }

  if (provider === "gemini") {
    return Boolean(settings.geminiApiKey?.trim());
  }

  if (provider === "maritaca") {
    return Boolean(settings.maritacaApiKey?.trim());
  }

  return false;
}

function getBuddySystemPrompt(action: Exclude<BuddyAction, "define">): string {
  if (action === "summarize") {
    return [
      "You summarize selected text from desktop apps.",
      "Return a concise summary in 1-3 sentences.",
      "Do not include markdown, bullet points, or surrounding quotes.",
      "Reply in the same language as the input text.",
    ].join(" ");
  }

  if (action === "rewrite-friendly") {
    return [
      "You rewrite selected text in a friendlier tone.",
      "Keep original meaning, improve clarity, and keep length similar.",
      "Do not include markdown, bullet points, labels, or extra commentary.",
      "Reply in the same language as the input text.",
    ].join(" ");
  }

  return [
    "You explain selected text in simple language.",
    "Keep it short and clear.",
    "Reply in the same language as the input text.",
  ].join(" ");
}

async function getDefinitionSpeech(text: string): Promise<string> {
  const singleWord = getSingleWord(text);

  if (!singleWord) {
    return `I can define one word at a time. Try selecting a single word instead of \"${truncateText(text, 50)}\".`;
  }

  const normalized = singleWord.toLowerCase();

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(normalized)}`,
    );

    if (!response.ok) {
      throw new Error(`Dictionary request failed: ${response.status}`);
    }

    const data = (await response.json()) as DictionaryEntry[];
    const parsed = parseDefinition(data);

    if (!parsed) {
      throw new Error("No definition in dictionary response");
    }

    const [first, second] = parsed.definitions;
    const lines = [
      `${parsed.word} (${parsed.partOfSpeech})`,
      "",
      `- ${normalizeDefinitionText(first)}`,
    ];

    if (second) {
      lines.push(`- ${normalizeDefinitionText(second)}`);
    }

    return lines.join("\n");
  } catch {
    return `I couldn't reach the dictionary right now. ${normalized}: a term worth checking in context.`;
  }
}

function getSingleWord(text: string): string | null {
  const match = text.trim().match(/^[A-Za-z][A-Za-z'-]{0,38}$/);
  return match ? match[0] : null;
}

function truncateText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 3)}...`;
}

type DictionaryEntry = {
  word?: string;
  meanings?: Array<{
    partOfSpeech?: string;
    definitions?: Array<{ definition?: string }>;
  }>;
};

function parseDefinition(data: DictionaryEntry[]): {
  word: string;
  partOfSpeech: string;
  definitions: string[];
} | null {
  for (const entry of data) {
    const word = entry.word?.trim();

    if (!word || !entry.meanings) {
      continue;
    }

    for (const meaning of entry.meanings) {
      const definitions = (meaning.definitions || [])
        .map((item) => item.definition?.trim())
        .filter((item): item is string => Boolean(item))
        .slice(0, 2);

      if (definitions.length > 0) {
        return {
          word,
          partOfSpeech: meaning.partOfSpeech || "word",
          definitions,
        };
      }
    }
  }

  return null;
}

function normalizeDefinitionText(value: string): string {
  return value
    .replace(/\s+/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim();
}
