/**
 * Tolerant parser for animation cues ("[Thinking]", "{GestureUp}", ...) that
 * models emit inside chat replies. Kept free of app imports so it is testable
 * on its own.
 *
 * Safety rules (false positives cost more than missed animations):
 * - code (fenced blocks, inline backticks) is never touched
 * - a token only counts if it exactly matches a valid key or an alias target
 * - "[]" and "{}" match anywhere; "()" and "*" only alone on their own line
 * - markdown links/refs and indexing (`x[Wave]`, `[Wave](url)`) are skipped
 */

export const MAX_ANIMATIONS_PER_REPLY = 3;
const MAX_PENDING_TOKEN_LENGTH = 32;

/** Loose names models tend to use -> candidate real keys, first match wins. */
const ANIMATION_ALIASES: Record<string, string[]> = {
  think: ["Thinking", "Processing"],
  thinking: ["Thinking", "Processing"],
  ponder: ["Thinking"],
  hmm: ["Thinking"],
  hello: ["Greeting", "Wave"],
  hi: ["Greeting", "Wave"],
  greet: ["Greeting", "Wave"],
  bye: ["Goodbye", "Wave"],
  goodbye: ["Goodbye", "Wave"],
  wave: ["Wave", "Greeting"],
  search: ["Searching"],
  searching: ["Searching"],
  look: ["CheckingSomething", "Searching"],
  check: ["CheckingSomething"],
  write: ["Writing"],
  writing: ["Writing"],
  explain: ["Explain"],
  point: ["GestureUp", "Explain"],
  celebrate: ["Congratulate"],
  congrats: ["Congratulate"],
  happy: ["Congratulate"],
  alert: ["Alert"],
  warning: ["Alert"],
  email: ["SendMail"],
  mail: ["SendMail"],
};

export type AnimationKeyResolver = (token: string) => string | null;

export function normalizeAnimationToken(token: string): string {
  return token.toLowerCase().replace(/[\s_-]+/g, "");
}

export function createAnimationResolver(
  validKeys: string[],
): AnimationKeyResolver {
  const byNormalized = new Map<string, string>();
  for (const key of validKeys) {
    byNormalized.set(normalizeAnimationToken(key), key);
  }

  return (token) => {
    const normalized = normalizeAnimationToken(token);
    const exact = byNormalized.get(normalized);
    if (exact) return exact;

    for (const candidate of ANIMATION_ALIASES[normalized] ?? []) {
      const resolved = byNormalized.get(normalizeAnimationToken(candidate));
      if (resolved) return resolved;
    }

    // Models often prefix real keys ("IdleGestureUp" -> "GestureUp").
    const stripped = normalized.replace(/^(deepidle|idle)/, "");
    if (stripped && stripped !== normalized) {
      const direct = byNormalized.get(stripped);
      if (direct) return direct;
      for (const candidate of ANIMATION_ALIASES[stripped] ?? []) {
        const resolved = byNormalized.get(normalizeAnimationToken(candidate));
        if (resolved) return resolved;
      }
    }
    return null;
  };
}

const TOKEN_RE =
  /\{\{\s*([A-Za-z][A-Za-z _-]{0,30})\s*\}\}|\[\s*([A-Za-z][A-Za-z _-]{0,30})\s*\]|\{\s*([A-Za-z][A-Za-z _-]{0,30})\s*\}|\(\s*([A-Za-z][A-Za-z _-]{0,30})\s*\)|\*\s*([A-Za-z][A-Za-z _-]{0,30})\s*\*/g;

/** Ranges of text that must never be parsed: code fences and inline code. */
function findCodeRanges(content: string): Array<[number, number]> {
  const ranges: Array<[number, number]> = [];
  const re = /```[\s\S]*?(?:```|$)|`[^`\n]*`/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(content)) !== null) {
    ranges.push([match.index, match.index + match[0].length]);
  }
  return ranges;
}

function isLineAlone(content: string, start: number, end: number): boolean {
  const lineStart = content.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = content.indexOf("\n", end);
  const lineEnd = nextBreak === -1 ? content.length : nextBreak;
  return (
    content.slice(lineStart, start).trim() === "" &&
    content.slice(end, lineEnd).trim() === ""
  );
}

export type ParsedAnimationContent = {
  /** Content with cues removed (and an unfinished trailing cue held back). */
  text: string;
  /** Resolved animation keys in order of appearance. */
  keys: string[];
};

export function parseAnimationContent(
  content: string,
  resolve: AnimationKeyResolver,
  { final = false }: { final?: boolean } = {},
): ParsedAnimationContent {
  const codeRanges = findCodeRanges(content);
  const inCode = (index: number) =>
    codeRanges.some(([from, to]) => index >= from && index < to);

  const keys: string[] = [];
  let text = "";
  let cursor = 0;
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;

  while ((match = TOKEN_RE.exec(content)) !== null) {
    const start = match.index;
    const end = start + match[0].length;
    if (inCode(start)) continue;

    const isSquareOrCurly = match[1] || match[2] || match[3];
    const token = match[1] ?? match[2] ?? match[3] ?? match[4] ?? match[5];

    if (!isSquareOrCurly && !isLineAlone(content, start, end)) continue;

    // x[Wave] (indexing) and [Wave](url) / [Wave][1] / [Wave]: ref (markdown)
    if (match[2] !== undefined) {
      if (start > 0 && /[A-Za-z0-9_)\]]/.test(content[start - 1])) continue;
      if (/^(\(|\[|:)/.test(content.slice(end, end + 1))) continue;
    }

    const key = resolve(token);
    if (!key) continue;

    text += content.slice(cursor, start);
    cursor = end;
    if (
      keys.length < MAX_ANIMATIONS_PER_REPLY &&
      keys[keys.length - 1] !== key
    ) {
      keys.push(key);
    }
  }

  let rest = content.slice(cursor);

  if (!final) {
    // Hold back an unfinished trailing cue like "[Gest" until it resolves.
    const pending = rest.match(/(?:\{\{|\[|\{)[A-Za-z _-]{0,30}\}?\}?$/);
    if (
      pending &&
      pending[0].length <= MAX_PENDING_TOKEN_LENGTH &&
      !inCode(cursor + (pending.index ?? 0))
    ) {
      rest = rest.slice(0, pending.index);
    }
  }

  text += rest;

  // Collapse the gaps left behind by removed cues.
  text = text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^[ \t\n]+/, "");

  return { text: final ? text.trim() : text, keys };
}
