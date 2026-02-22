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

  const settings = getStateManager().getSettings();
  const speech =
    action === "define"
      ? await getDefinitionSpeech(text, settings)
      : await getGeneratedSpeech(action, text, settings);
  const formattedSpeech = formatSpeechForBalloon(speech);

  getMainWindow()?.webContents.send(IpcMessages.CONTEXT_MENU_BUDDY_SPEECH, {
    action,
    selectedText: truncateText(text, MAX_SELECTION_LENGTH),
    speech: formattedSpeech,
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
  const normalized = normalizeText(text);

  switch (action) {
    case "summarize":
      return `Quick summary:\n${summarizeTextFallback(normalized)}`;
    case "explain-simple":
      return `Simple explanation:\n${simplifyTextFallback(normalized)}`;
    case "rewrite-friendly":
      return `Friendlier rewrite:\n${rewriteFriendlyFallback(normalized)}`;
    default:
      return summarizeTextFallback(normalized);
  }
}

async function getGeneratedSpeech(
  action: Exclude<BuddyAction, "define">,
  text: string,
  settings: SettingsState,
): Promise<string> {
  const provider = settings.aiProvider || "local";

  if (provider === "local") {
    return getStaticSpeech(action, text);
  }

  if (!isRemoteProviderConfigured(settings)) {
    return getStaticSpeech(action, text);
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

  if (provider === "openclaw") {
    return Boolean(settings.openclawEndpoint?.trim());
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

function getDefineSystemPrompt(): string {
  return [
    "You define one selected word in plain language.",
    "Return: first line with `word (part of speech)`, then 1-2 concise bullet-style definition lines.",
    "No markdown code fences or extra commentary.",
    "Reply in the same language as the input when possible.",
  ].join(" ");
}

async function getDefinitionSpeech(
  text: string,
  settings: SettingsState,
): Promise<string> {
  const singleWord = getSingleWord(text);

  if (!singleWord) {
    return `I can define one word at a time. Try selecting a single word instead of \"${truncateText(text, 50)}\".`;
  }

  const normalized = singleWord.toLowerCase();
  const provider = settings.aiProvider || "local";

  if (provider !== "local" && isRemoteProviderConfigured(settings)) {
    try {
      const response = await promptRemoteProvider({
        provider,
        settings,
        systemPrompt: getDefineSystemPrompt(),
        history: [
          {
            id: `buddy-define-${Date.now()}`,
            sender: "user",
            content: normalized,
            createdAt: Date.now(),
          },
        ],
      });

      const trimmed = response.trim();
      if (trimmed) {
        return truncateText(trimmed, 800);
      }
    } catch {
      // Dictionary fallback below.
    }
  }

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

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function summarizeTextFallback(value: string): string {
  if (!value) {
    return "I couldn't find enough text to summarize.";
  }

  const sentences = splitSentences(value);
  if (sentences.length === 0) {
    return truncateText(value, 260);
  }

  if (sentences.length === 1) {
    return truncateText(sentences[0], 260);
  }

  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "if",
    "then",
    "than",
    "to",
    "of",
    "in",
    "on",
    "for",
    "with",
    "as",
    "at",
    "by",
    "from",
    "that",
    "this",
    "these",
    "those",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "it",
    "its",
    "he",
    "she",
    "they",
    "we",
    "you",
    "i",
  ]);

  const frequency = new Map<string, number>();

  for (const sentence of sentences) {
    for (const token of sentence.toLowerCase().match(/[a-z0-9]+/g) || []) {
      if (token.length <= 2 || stopWords.has(token)) {
        continue;
      }

      frequency.set(token, (frequency.get(token) || 0) + 1);
    }
  }

  const scored: Array<{ sentence: string; index: number; score: number }> =
    sentences.map((sentence, index) => {
      const tokens = sentence.toLowerCase().match(/[a-z0-9]+/g) || [];
      let score = 0;
      for (const token of tokens) {
        score += frequency.get(token) || 0;
      }
      const positionBonus = index === 0 ? 0.5 : 0;

      return { sentence, index, score: score + positionBonus };
    });

  const topSentences = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(2, sentences.length))
    .sort((a, b) => a.index - b.index)
    .map((item) => item.sentence);

  let result = "";

  for (const sentence of topSentences) {
    const next = result ? `${result} ${sentence}` : sentence;
    if (next.length > 260 && result) {
      break;
    }
    result = next;
  }

  return truncateText(result || topSentences[0] || sentences[0], 260);
}

function simplifyTextFallback(value: string): string {
  if (!value) {
    return "Please select a little more text and try again.";
  }

  const summary = summarizeTextFallback(value);
  return `This means: ${summary}`;
}

function rewriteFriendlyFallback(value: string): string {
  if (!value) {
    return "Please select text to rewrite.";
  }

  let rewritten = value
    .replace(/\b(can't)\b/gi, "cannot")
    .replace(/\b(don't)\b/gi, "do not")
    .replace(/\b(won't)\b/gi, "will not");

  rewritten = rewritten.charAt(0).toUpperCase() + rewritten.slice(1);

  if (!/[.!?]$/.test(rewritten)) {
    rewritten += ".";
  }

  return truncateText(rewritten, 420);
}

function splitSentences(value: string): string[] {
  return value
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0);
}

function formatSpeechForBalloon(value: string): string {
  const text = value.replace(/\r/g, "").trim();

  if (!text) {
    return text;
  }

  const hasStructuredMarkdown =
    /^(\s*[-*]\s|\s*\d+\.\s|#+\s)/m.test(text) || text.includes("\n\n");

  if (hasStructuredMarkdown) {
    return text;
  }

  const sentences = splitSentences(normalizeText(text));

  if (sentences.length <= 1) {
    return wrapByLineLength(sentences[0] || text, 170);
  }

  const paragraphs: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const next = current ? `${current} ${sentence}` : sentence;

    if (next.length > 190 && current) {
      paragraphs.push(current);
      current = sentence;
      continue;
    }

    current = next;
  }

  if (current) {
    paragraphs.push(current);
  }

  return paragraphs.join("\n\n");
}

function wrapByLineLength(value: string, maxLength: number): string {
  const words = value.split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return value;
  }

  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;

    if (next.length > maxLength && line) {
      lines.push(line);
      line = word;
      continue;
    }

    line = next;
  }

  if (line) {
    lines.push(line);
  }

  return lines.join("\n");
}
