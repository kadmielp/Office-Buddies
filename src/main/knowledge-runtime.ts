import { IntegrationConfig, KnowledgeSource } from "../shared/shared-state";
import { getIntegrationManager } from "./integrations";
import { getLogger } from "./logger";
import { getStateManager } from "./state";

type ConfluenceSearchResult = {
  id: string;
  title: string;
  text: string;
  url?: string;
};

const MAX_MATCHES_PER_SOURCE = 2;
const MAX_SEARCH_CANDIDATES = 6;
const MAX_EXCERPT_CHARS = 1200;
const TITLE_JOINERS = new Set([
  "the",
  "of",
  "and",
  "a",
  "an",
  "to",
  "for",
  "in",
  "on",
  "with",
  "by",
]);
const QUERY_STOP_WORDS = new Set([
  "what",
  "does",
  "do",
  "did",
  "is",
  "are",
  "can",
  "could",
  "would",
  "will",
  "my",
  "the",
  "a",
  "an",
  "article",
  "page",
  "post",
  "document",
  "published",
  "say",
  "says",
  "about",
  "tell",
  "me",
  "please",
  "that",
  "this",
  "of",
  "our",
  "we",
  "us",
  "from",
  "at",
  "or",
  "be",
]);

export async function buildDynamicKnowledgeContext(
  query: string,
  options: { enabled?: boolean } = {},
): Promise<string> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return "";
  }

  const settings = getStateManager().getSettings();

  if (!(options.enabled ?? settings.useKnowledgeAtStart)) {
    return "";
  }

  const lines: string[] = [];

  for (const source of settings.knowledgeSources || []) {
    const integration = (settings.integrations || []).find(
      (candidate) => candidate.id === source.integrationId,
    );

    if (!integration) {
      continue;
    }

    if (integration.type === "confluence") {
      const section = await buildConfluenceKnowledgeSection(
        trimmedQuery,
        source,
        integration,
      );

      if (section) {
        lines.push(section);
      }
    }
  }

  if (lines.length === 0) {
    return "";
  }

  return [
    "Connected-source retrieval results for the current user message:",
    "Use retrieved excerpts below when answering.",
    "If a source reports an error or no matches, say that plainly instead of guessing.",
    "If the retrieved content is insufficient, say the knowledge base does not contain enough information.",
    ...lines,
  ].join("\n");
}

async function buildConfluenceKnowledgeSection(
  query: string,
  source: KnowledgeSource,
  integration: IntegrationConfig,
): Promise<string> {
  const integrationManager = getIntegrationManager();
  const credential = integrationManager.getCredential(integration.id)?.trim();
  const baseUrl = normalizeConfluenceBaseUrl(integration.baseUrl || "");
  const accountEmail = integration.accountEmail?.trim() || "";

  if (!baseUrl || !accountEmail || !credential) {
    integrationManager.setIntegrationStatus(integration.id, "Error");
    return `- Source ${source.name}: Confluence is missing a base URL, account email, or API token.`;
  }

  try {
    const directUrlMatches = await fetchConfluenceMatchesFromUrls(
      query,
      integration,
      accountEmail,
      credential,
    );
    getLogger().info("Confluence direct URL lookup completed", {
      integrationId: integration.id,
      sourceId: source.id,
      directUrlMatchCount: directUrlMatches.length,
    });
    const matches =
      directUrlMatches.length > 0
        ? directUrlMatches
        : await searchConfluenceMatches(
            query,
            integration,
            accountEmail,
            credential,
          );

    integrationManager.setIntegrationStatus(integration.id, "Connected");
    getLogger().info("Confluence retrieval completed", {
      integrationId: integration.id,
      sourceId: source.id,
      matchCount: matches.length,
      usedDirectUrlLookup: directUrlMatches.length > 0,
      matchedPageIds: matches.map((match) => match.id),
    });

    if (matches.length === 0) {
      return `- Source ${source.name}: no matching Confluence pages were found for the current query.`;
    }

    const lines = [
      `- Source ${source.name}: matched ${matches.length} page(s).`,
    ];

    matches.slice(0, MAX_MATCHES_PER_SOURCE).forEach((match, index) => {
      lines.push(`  Match ${index + 1} title: ${match.title}`);

      if (match.url) {
        lines.push(`  Match ${index + 1} url: ${match.url}`);
      }

      lines.push(
        `  Match ${index + 1} excerpt: ${selectRelevantExcerpt(match.text, query)}`,
      );
    });

    return lines.join("\n");
  } catch (error) {
    integrationManager.setIntegrationStatus(integration.id, "Error");
    const message = error instanceof Error ? error.message : String(error);
    getLogger().warn("Confluence retrieval failed", {
      integrationId: integration.id,
      sourceId: source.id,
      message,
    });
    return `- Source ${source.name}: Confluence retrieval failed. ${message}`;
  }
}

async function fetchConfluenceMatchesFromUrls(
  query: string,
  integration: IntegrationConfig,
  accountEmail: string,
  apiToken: string,
): Promise<ConfluenceSearchResult[]> {
  const urls = extractUrls(query).filter((url) =>
    belongsToConfluenceIntegration(url, integration),
  );
  const matches: ConfluenceSearchResult[] = [];

  for (const url of urls) {
    const match = await resolveConfluenceUrlToPage(
      url,
      integration,
      accountEmail,
      apiToken,
    );

    if (match) {
      matches.push(match);
    }
  }

  return dedupeBy(matches, (match) => match.id);
}

async function searchConfluenceMatches(
  query: string,
  integration: IntegrationConfig,
  accountEmail: string,
  apiToken: string,
): Promise<ConfluenceSearchResult[]> {
  const queries = buildConfluenceSearchQueries(query).slice(
    0,
    MAX_SEARCH_CANDIDATES,
  );
  const matchesById = new Map<
    string,
    ConfluenceSearchResult & { score: number }
  >();
  let completedSearches = 0;
  let lastError: unknown = null;

  for (const { cql, boost } of queries) {
    try {
      const results = await searchConfluenceWithCql(
        integration,
        accountEmail,
        apiToken,
        cql,
      );
      completedSearches += 1;

      for (const result of results) {
        const relevanceScore = scoreConfluenceResult(result, query);
        const existing = matchesById.get(result.id);

        if (!existing) {
          matchesById.set(result.id, {
            ...result,
            score: boost + relevanceScore,
          });
          continue;
        }

        existing.score += boost + relevanceScore;
        existing.text =
          result.text.length > existing.text.length
            ? result.text
            : existing.text;
        existing.url = existing.url || result.url;
      }
    } catch (error) {
      lastError = error;

      if (
        error instanceof Error &&
        /(401|403|unauthorized|forbidden)/i.test(error.message)
      ) {
        throw error;
      }
    }
  }

  if (completedSearches === 0 && lastError) {
    throw lastError;
  }

  return Array.from(matchesById.values())
    .sort((left, right) => right.score - left.score)
    .map(({ score: _score, ...result }) => result);
}

async function searchConfluenceWithCql(
  integration: IntegrationConfig,
  accountEmail: string,
  apiToken: string,
  cql: string,
): Promise<ConfluenceSearchResult[]> {
  const baseUrl = normalizeConfluenceBaseUrl(integration.baseUrl || "");
  const url = `${baseUrl}/rest/api/content/search?cql=${encodeURIComponent(
    cql,
  )}&limit=${MAX_MATCHES_PER_SOURCE}&expand=body.storage`;
  const payload = await fetchConfluenceJson(url, accountEmail, apiToken);
  const results = Array.isArray(payload?.results) ? payload.results : [];
  const mappedResults = await Promise.all(
    results.map((result: any) =>
      mapConfluenceResult(result, integration, accountEmail, apiToken),
    ),
  );

  return mappedResults.filter(
    (result): result is ConfluenceSearchResult => result !== null,
  );
}

async function mapConfluenceResult(
  result: any,
  integration: IntegrationConfig,
  accountEmail: string,
  apiToken: string,
): Promise<ConfluenceSearchResult | null> {
  const id = typeof result?.id === "string" ? result.id : "";
  const title = typeof result?.title === "string" ? result.title : "";

  if (!id || !title) {
    return null;
  }

  const textFromSearch = storageToPlainText(result?.body?.storage?.value || "");
  let text = textFromSearch;

  if (!text) {
    try {
      text = await fetchConfluencePageText(
        id,
        integration,
        accountEmail,
        apiToken,
      );
    } catch (error) {
      getLogger().warn("Unable to fetch Confluence page body", {
        integrationId: integration.id,
        pageId: id,
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return {
    id,
    title,
    text,
    url: buildConfluencePageUrl(result, integration),
  };
}

async function resolveConfluenceUrlToPage(
  url: string,
  integration: IntegrationConfig,
  accountEmail: string,
  apiToken: string,
): Promise<ConfluenceSearchResult | null> {
  const authorization = `Basic ${Buffer.from(`${accountEmail}:${apiToken}`).toString("base64")}`;
  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    headers: {
      Accept: "text/html,application/json",
      Authorization: authorization,
    },
  });

  const responseBody = await response.text();

  if (!response.ok) {
    throw new Error(
      `Request failed (${response.status}) while resolving Confluence URL: ${responseBody.slice(0, 300)}`,
    );
  }

  const resolvedUrl = response.url || url;
  const pageId =
    extractConfluencePageId(resolvedUrl) ||
    extractConfluencePageIdFromHtml(responseBody);

  getLogger().info("Confluence URL resolved", {
    integrationId: integration.id,
    originalUrl: url,
    resolvedUrl,
    pageId: pageId || null,
  });

  if (!pageId) {
    return null;
  }

  return fetchConfluencePageById(
    pageId,
    integration,
    accountEmail,
    apiToken,
    resolvedUrl,
  );
}

async function fetchConfluencePageText(
  pageId: string,
  integration: IntegrationConfig,
  accountEmail: string,
  apiToken: string,
): Promise<string> {
  const baseUrl = normalizeConfluenceBaseUrl(integration.baseUrl || "");
  const url = `${baseUrl}/rest/api/content/${encodeURIComponent(
    pageId,
  )}?expand=body.storage`;
  const payload = await fetchConfluenceJson(url, accountEmail, apiToken);
  return storageToPlainText(payload?.body?.storage?.value || "");
}

async function fetchConfluencePageById(
  pageId: string,
  integration: IntegrationConfig,
  accountEmail: string,
  apiToken: string,
  resolvedUrl?: string,
): Promise<ConfluenceSearchResult> {
  const baseUrl = normalizeConfluenceBaseUrl(integration.baseUrl || "");
  const url = `${baseUrl}/rest/api/content/${encodeURIComponent(
    pageId,
  )}?expand=body.storage`;
  const payload = await fetchConfluenceJson(url, accountEmail, apiToken);

  return {
    id: pageId,
    title:
      typeof payload?.title === "string" && payload.title
        ? payload.title
        : `Confluence page ${pageId}`,
    text: storageToPlainText(payload?.body?.storage?.value || ""),
    url: resolvedUrl,
  };
}

async function fetchConfluenceJson(
  url: string,
  accountEmail: string,
  apiToken: string,
): Promise<any> {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Basic ${Buffer.from(`${accountEmail}:${apiToken}`).toString("base64")}`,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Request failed (${response.status}) while calling Confluence: ${body.slice(0, 300)}`,
    );
  }

  return response.json();
}

function buildConfluenceSearchQueries(query: string) {
  const normalized = normalizeQuery(query);
  const titleCandidates = extractTitleCandidates(normalized);
  const textCandidates = extractTextCandidates(normalized);
  const keywordTokens = extractKeywordTokens(normalized);
  const phraseCandidates = buildPhraseCandidates(keywordTokens);
  const queries: Array<{ cql: string; boost: number }> = [];

  for (const candidate of titleCandidates) {
    queries.push({
      cql: `type = page AND title ~ "${escapeCql(candidate)}"`,
      boost: 3,
    });
  }

  for (const candidate of textCandidates) {
    queries.push({
      cql: `type = page AND text ~ "${escapeCql(candidate)}"`,
      boost: titleCandidates.includes(candidate) ? 2 : 1,
    });
  }

  for (const candidate of phraseCandidates) {
    queries.push({
      cql: `type = page AND text ~ "${escapeCql(candidate)}"`,
      boost: candidate.split(" ").length >= 3 ? 2 : 1,
    });
  }

  for (const candidate of phraseCandidates.slice(0, 2)) {
    queries.push({
      cql: `type = page AND title ~ "${escapeCql(candidate)}"`,
      boost: 2,
    });
  }

  return dedupeBy(queries, (item) => item.cql);
}

function extractTitleCandidates(query: string): string[] {
  const normalized = normalizeQuery(query);
  const quoted = extractQuotedPhrases(normalized);
  const titleLike = extractTitleLikePhrases(normalized);

  return dedupeBy(
    [...quoted, ...titleLike].filter((candidate) => candidate.length >= 3),
    (candidate) => candidate.toLowerCase(),
  );
}

function extractTextCandidates(query: string): string[] {
  const normalized = normalizeQuery(query);
  const titleCandidates = extractTitleCandidates(normalized);
  const stripped = extractKeywordTokens(normalized).join(" ");
  const candidates = [...titleCandidates];

  if (stripped.length >= 6) {
    candidates.push(stripped);
  }

  candidates.push(...buildPhraseCandidates(extractKeywordTokens(normalized)));

  return dedupeBy(
    candidates.filter((candidate) => candidate.length >= 3),
    (candidate) => candidate.toLowerCase(),
  );
}

function extractKeywordTokens(query: string): string[] {
  return query
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/"([^"]+)"/g, "$1")
    .split(/\s+/)
    .map(stripToken)
    .filter(Boolean)
    .map((token) => token.toLowerCase())
    .filter((token) => token && !QUERY_STOP_WORDS.has(token));
}

function buildPhraseCandidates(tokens: string[]): string[] {
  const phrases: string[] = [];
  const maxPhraseLength = Math.min(4, tokens.length);

  for (let size = maxPhraseLength; size >= 2; size -= 1) {
    for (let start = 0; start + size <= tokens.length; start += 1) {
      const candidate = tokens.slice(start, start + size).join(" ");

      if (candidate.length >= 6) {
        phrases.push(candidate);
      }
    }
  }

  return dedupeBy(phrases, (candidate) => candidate);
}

function extractQuotedPhrases(query: string): string[] {
  return Array.from(query.matchAll(/"([^"]{2,})"/g))
    .map((match) => normalizeWhitespace(match[1]))
    .filter(Boolean);
}

function extractTitleLikePhrases(query: string): string[] {
  const normalized = query
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/"([^"]+)"/g, "$1");
  const tokens = normalized.split(/\s+/).map(stripToken).filter(Boolean);
  const phrases: string[] = [];

  for (let index = 0; index < tokens.length; index += 1) {
    if (!startsWithUppercase(tokens[index])) {
      continue;
    }

    let endIndex = index;

    while (endIndex + 1 < tokens.length) {
      const nextToken = tokens[endIndex + 1];

      if (
        startsWithUppercase(nextToken) ||
        TITLE_JOINERS.has(nextToken.toLowerCase())
      ) {
        endIndex += 1;
        continue;
      }

      break;
    }

    const phrase = normalizeWhitespace(
      tokens.slice(index, endIndex + 1).join(" "),
    );
    if (phrase.split(" ").length >= 2) {
      phrases.push(phrase);
    }

    index = endIndex;
  }

  return phrases;
}

function buildConfluencePageUrl(result: any, integration: IntegrationConfig) {
  const relativeUrl =
    result?._links?.webui ||
    result?._links?.tinyui ||
    result?._expandable?.webui;

  if (typeof relativeUrl !== "string" || !relativeUrl) {
    return undefined;
  }

  const baseUrl = normalizeConfluenceBaseUrl(integration.baseUrl || "");
  const origin = safeGetOrigin(baseUrl);

  if (/^https?:\/\//i.test(relativeUrl)) {
    return relativeUrl;
  }

  if (origin && relativeUrl.startsWith("/wiki/")) {
    return `${origin}${relativeUrl}`;
  }

  return `${baseUrl}${relativeUrl.startsWith("/") ? "" : "/"}${relativeUrl}`;
}

function extractUrls(query: string) {
  return Array.from(query.matchAll(/https?:\/\/[^\s)]+/g))
    .map((match) => match[0].replace(/[.,!?;:]+$/, ""))
    .filter(Boolean);
}

function belongsToConfluenceIntegration(
  url: string,
  integration: IntegrationConfig,
) {
  try {
    const integrationOrigin = safeGetOrigin(
      normalizeConfluenceBaseUrl(integration.baseUrl || ""),
    );
    return integrationOrigin && new URL(url).origin === integrationOrigin;
  } catch {
    return false;
  }
}

function extractConfluencePageId(url: string) {
  const pagePathMatch = url.match(/\/pages\/(\d+)(?:\/|$)/);

  if (pagePathMatch) {
    return pagePathMatch[1];
  }

  const queryParamMatch = url.match(/[?&]pageId=(\d+)/);
  return queryParamMatch?.[1] || "";
}

function extractConfluencePageIdFromHtml(html: string) {
  const pageIdPatterns = [
    /<meta[^>]+name=["']ajs-page-id["'][^>]+content=["'](\d+)["']/i,
    /<meta[^>]+content=["'](\d+)["'][^>]+name=["']ajs-page-id["']/i,
    /data-content-id=["'](\d+)["']/i,
    /"contentId":"(\d+)"/i,
    /"pageId":"(\d+)"/i,
    /<link[^>]+rel=["']canonical["'][^>]+href=["'][^"']*[?&]pageId=(\d+)/i,
    /<link[^>]+href=["'][^"']*[?&]pageId=(\d+)[^"']*["'][^>]+rel=["']canonical["']/i,
  ];

  for (const pattern of pageIdPatterns) {
    const match = html.match(pattern);

    if (match?.[1]) {
      return match[1];
    }
  }

  return "";
}

function selectRelevantExcerpt(text: string, query: string): string {
  const normalizedText = normalizeWhitespace(text);

  if (!normalizedText) {
    return "Page text could not be extracted.";
  }

  const excerptWindow = findBestExcerptWindow(normalizedText, query);

  if (!excerptWindow) {
    return trimExcerpt(normalizedText);
  }

  const start = Math.max(0, excerptWindow.start - 220);
  const end = Math.min(
    normalizedText.length,
    excerptWindow.start + MAX_EXCERPT_CHARS,
  );
  return trimExcerpt(normalizedText.slice(start, end));
}

function findBestExcerptWindow(text: string, query: string) {
  const haystack = text.toLowerCase();
  const terms = dedupeBy(
    [
      ...extractKeywordTokens(query),
      ...buildPhraseCandidates(extractKeywordTokens(query)),
    ].filter((term) => term.length >= 4),
    (term) => term,
  );
  let bestWindow: { start: number; score: number } | null = null;

  for (const term of terms) {
    let fromIndex = 0;

    while (fromIndex < haystack.length) {
      const matchIndex = haystack.indexOf(term, fromIndex);

      if (matchIndex === -1) {
        break;
      }

      const windowStart = Math.max(0, matchIndex - 180);
      const windowEnd = Math.min(
        haystack.length,
        windowStart + MAX_EXCERPT_CHARS,
      );
      const windowText = haystack.slice(windowStart, windowEnd);
      const score = terms.reduce(
        (total, candidate) => total + (windowText.includes(candidate) ? 1 : 0),
        0,
      );

      if (!bestWindow || score > bestWindow.score) {
        bestWindow = { start: windowStart, score };
      }

      fromIndex = matchIndex + term.length;
    }
  }

  return bestWindow;
}

function trimExcerpt(value: string) {
  const excerpt = normalizeWhitespace(value).slice(0, MAX_EXCERPT_CHARS);
  return excerpt.length < value.length ? `${excerpt}...` : excerpt;
}

function storageToPlainText(storageValue: string): string {
  return normalizeWhitespace(
    decodeHtmlEntities(
      storageValue
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(p|div|li|tr|h1|h2|h3|h4|h5|h6)>/gi, "\n")
        .replace(/<[^>]+>/g, " "),
    ),
  );
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_match, codePoint) =>
      String.fromCharCode(Number(codePoint)),
    )
    .replace(/&#x([0-9a-f]+);/gi, (_match, codePoint) =>
      String.fromCharCode(parseInt(codePoint, 16)),
    );
}

function normalizeConfluenceBaseUrl(baseUrl: string) {
  return baseUrl.trim().replace(/\/+$/, "");
}

function safeGetOrigin(url: string) {
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
}

function normalizeQuery(query: string) {
  return normalizeWhitespace(query.replace(/[\u201C\u201D]/g, '"'));
}

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function stripToken(token: string) {
  return token.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, "");
}

function startsWithUppercase(value: string) {
  return /^[A-Z]/.test(value);
}

function escapeCql(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function scoreConfluenceResult(result: ConfluenceSearchResult, query: string) {
  const title = normalizeWhitespace(result.title).toLowerCase();
  const text = normalizeWhitespace(result.text).toLowerCase();
  const phrases = buildPhraseCandidates(extractKeywordTokens(query));
  const terms = dedupeBy(
    [...extractKeywordTokens(query), ...phrases].filter(
      (term) => term.length >= 4,
    ),
    (term) => term,
  );

  return terms.reduce((score, term) => {
    if (title.includes(term)) {
      return score + (term.includes(" ") ? 4 : 2);
    }

    if (text.includes(term)) {
      return score + (term.includes(" ") ? 2 : 1);
    }

    return score;
  }, 0);
}

function dedupeBy<T>(values: T[], getKey: (value: T) => string) {
  const seen = new Set<string>();

  return values.filter((value) => {
    const key = getKey(value);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
