import { IntegrationConfig, KnowledgeSource } from "../shared/shared-state";
import {
  DynamicKnowledgeContextResult,
  MessageReference,
} from "../types/interfaces";
import { getIntegrationManager } from "./integrations";
import { getLogger } from "./logger";
import { getStateManager } from "./state";

type ConfluenceSearchResult = {
  id: string;
  title: string;
  text: string;
  storageValue?: string;
  url?: string;
};

type ConfluencePageContent = {
  storageValue: string;
  text: string;
};

type ConfluenceEvidenceChunk = {
  text: string;
  score: number;
  location?: string;
  snippet?: string;
};

type HeadingMatch = {
  level: number;
  title: string;
  index: number;
};

type KnowledgeContextSection = {
  context: string;
  references: MessageReference[];
};

const MAX_MATCHES_PER_SOURCE = 2;
const MAX_SEARCH_CANDIDATES = 6;
const MAX_EVIDENCE_PER_MATCH = 3;
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
): Promise<DynamicKnowledgeContextResult> {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return { promptContext: "", references: [] };
  }

  const settings = getStateManager().getSettings();

  if (!(options.enabled ?? settings.useKnowledgeAtStart)) {
    return { promptContext: "", references: [] };
  }

  const lines: string[] = [];
  const references: MessageReference[] = [];

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
        lines.push(section.context);
        references.push(...section.references);
      }
    }
  }

  if (lines.length === 0) {
    return { promptContext: "", references: [] };
  }

  return {
    promptContext: [
      "Connected-source retrieval results for the current user message:",
      "Use retrieved evidence below when answering.",
      "If a source reports an error or no matches, say that plainly instead of guessing.",
      "If the retrieved content is insufficient, say the knowledge base does not contain enough information.",
      ...lines,
    ].join("\n"),
    references: dedupeBy(references, (reference) => reference.id),
  };
}

async function buildConfluenceKnowledgeSection(
  query: string,
  source: KnowledgeSource,
  integration: IntegrationConfig,
): Promise<KnowledgeContextSection> {
  const integrationManager = getIntegrationManager();
  const credential = integrationManager.getCredential(integration.id)?.trim();
  const baseUrl = normalizeConfluenceBaseUrl(integration.baseUrl || "");
  const accountEmail = integration.accountEmail?.trim() || "";

  if (!baseUrl || !accountEmail || !credential) {
    integrationManager.setIntegrationStatus(integration.id, "Error");
    return {
      context: `- Source ${source.name}: Confluence is missing a base URL, account email, or API token.`,
      references: [],
    };
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
      return {
        context: `- Source ${source.name}: no matching Confluence pages were found for the current query.`,
        references: [],
      };
    }

    const lines = [
      `- Source ${source.name}: matched ${matches.length} page(s).`,
    ];
    const references: MessageReference[] = [];

    matches.slice(0, MAX_MATCHES_PER_SOURCE).forEach((match, index) => {
      lines.push(`  Match ${index + 1} title: ${match.title}`);

      if (match.url) {
        lines.push(`  Match ${index + 1} url: ${match.url}`);
      }

      const evidenceChunks = selectRelevantEvidenceChunks(match, query).slice(
        0,
        MAX_EVIDENCE_PER_MATCH,
      );

      if (evidenceChunks.length > 0) {
        references.push(
          buildConfluenceReference(source, match, evidenceChunks[0]),
        );
      }

      evidenceChunks.forEach((chunk, chunkIndex) => {
        lines.push(
          `  Match ${index + 1} evidence ${chunkIndex + 1}: ${chunk.text}`,
        );
      });
    });

    return {
      context: lines.join("\n"),
      references,
    };
  } catch (error) {
    integrationManager.setIntegrationStatus(integration.id, "Error");
    const message = error instanceof Error ? error.message : String(error);
    getLogger().warn("Confluence retrieval failed", {
      integrationId: integration.id,
      sourceId: source.id,
      message,
    });
    return {
      context: `- Source ${source.name}: Confluence retrieval failed. ${message}`,
      references: [],
    };
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

  const storageValueFromSearch =
    typeof result?.body?.storage?.value === "string"
      ? result.body.storage.value
      : "";
  const textFromSearch = storageToPlainText(storageValueFromSearch);
  let text = textFromSearch;
  let storageValue = storageValueFromSearch;

  try {
    // Search results often contain only a short fragment of the page body.
    // Fetch the full page so excerpt selection can reach values that appear
    // lower in tables or later sections.
    const fullPageContent = await fetchConfluencePageContent(
      id,
      integration,
      accountEmail,
      apiToken,
    );

    storageValue =
      fullPageContent.storageValue.length >= storageValueFromSearch.length
        ? fullPageContent.storageValue
        : storageValueFromSearch;
    text =
      fullPageContent.text.length >= textFromSearch.length
        ? fullPageContent.text
        : textFromSearch;
  } catch (error) {
    getLogger().warn("Unable to fetch Confluence page body", {
      integrationId: integration.id,
      pageId: id,
      message: error instanceof Error ? error.message : String(error),
    });
  }

  return {
    id,
    title,
    text,
    storageValue,
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
  const pageContent = await fetchConfluencePageContent(
    pageId,
    integration,
    accountEmail,
    apiToken,
  );
  return pageContent.text;
}

async function fetchConfluencePageContent(
  pageId: string,
  integration: IntegrationConfig,
  accountEmail: string,
  apiToken: string,
): Promise<ConfluencePageContent> {
  const baseUrl = normalizeConfluenceBaseUrl(integration.baseUrl || "");
  const url = `${baseUrl}/rest/api/content/${encodeURIComponent(
    pageId,
  )}?expand=body.storage`;
  const payload = await fetchConfluenceJson(url, accountEmail, apiToken);
  return toConfluencePageContent(payload);
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
  const pageContent = toConfluencePageContent(payload);

  return {
    id: pageId,
    title:
      typeof payload?.title === "string" && payload.title
        ? payload.title
        : `Confluence page ${pageId}`,
    text: pageContent.text,
    storageValue: pageContent.storageValue,
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

function toConfluencePageContent(payload: any): ConfluencePageContent {
  const storageValue =
    typeof payload?.body?.storage?.value === "string"
      ? payload.body.storage.value
      : "";

  return {
    storageValue,
    text: storageToPlainText(storageValue),
  };
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

function selectRelevantEvidenceChunks(
  result: ConfluenceSearchResult,
  query: string,
): ConfluenceEvidenceChunk[] {
  const keywordTokens = extractKeywordTokens(query);
  const phraseCandidates = buildPhraseCandidates(keywordTokens);
  const evidenceChunks: ConfluenceEvidenceChunk[] = [];
  const excerpt = selectRelevantExcerpt(result.text, query);
  const excerptText = `Excerpt: ${excerpt}`;

  if (result.storageValue) {
    evidenceChunks.push(
      ...extractTableRowEvidenceChunks(
        result.storageValue,
        keywordTokens,
        phraseCandidates,
      ),
    );
    evidenceChunks.push(
      ...extractBodyBlockEvidenceChunks(
        result.storageValue,
        keywordTokens,
        phraseCandidates,
      ),
    );
  }

  evidenceChunks.push({
    text: excerptText,
    snippet: excerpt,
    score: Math.max(
      1,
      scoreEvidenceText(excerptText, keywordTokens, phraseCandidates),
    ),
  });

  return dedupeBy(
    evidenceChunks
      .filter((chunk) => chunk.score > 0 && chunk.text.length >= 12)
      .sort((left, right) => right.score - left.score),
    (chunk) => chunk.text.toLowerCase(),
  );
}

function extractTableRowEvidenceChunks(
  storageValue: string,
  keywordTokens: string[],
  phraseCandidates: string[],
): ConfluenceEvidenceChunk[] {
  const headings = extractHeadingMatches(storageValue);
  const evidenceChunks: ConfluenceEvidenceChunk[] = [];

  for (const tableMatch of storageValue.matchAll(/<table\b[^>]*>[\s\S]*?<\/table>/gi)) {
    const tableHtml = tableMatch[0];
    const headingPath = getHeadingPathAtIndex(headings, tableMatch.index || 0);
    let headerCells: string[] = [];

    for (const rowMatch of tableHtml.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
      const rowHtml = rowMatch[0];
      const cells = Array.from(
        rowHtml.matchAll(/<(td|th)\b[^>]*>([\s\S]*?)<\/\1>/gi),
      ).map((match) => ({
        tag: match[1].toLowerCase(),
        value: htmlFragmentToText(match[2]),
      }));

      if (cells.length === 0) {
        continue;
      }

      const hasOnlyHeaders = cells.every((cell) => cell.tag === "th");

      if (hasOnlyHeaders) {
        headerCells = cells.map((cell) => cell.value);
        continue;
      }

      const rowValues = cells.map((cell) => cell.value).filter(Boolean);

      if (rowValues.length === 0) {
        continue;
      }

      const rowText =
        headerCells.length === rowValues.length && headerCells.length > 0
          ? headerCells
              .map((header, index) => `${header}: ${rowValues[index]}`)
              .join(" | ")
          : rowValues.join(" | ");
      const evidenceText = headingPath
        ? `Section: ${headingPath} | Table row: ${rowText}`
        : `Table row: ${rowText}`;
      const score =
        scoreEvidenceText(evidenceText, keywordTokens, phraseCandidates) +
        6 +
        scorePrimaryCell(rowValues[0], keywordTokens, phraseCandidates);

      evidenceChunks.push({
        text: evidenceText,
        score,
        location: headingPath || undefined,
        snippet: rowText,
      });
    }
  }

  return evidenceChunks;
}

function extractBodyBlockEvidenceChunks(
  storageValue: string,
  keywordTokens: string[],
  phraseCandidates: string[],
): ConfluenceEvidenceChunk[] {
  const headings = extractHeadingMatches(storageValue);
  const evidenceChunks: ConfluenceEvidenceChunk[] = [];

  for (const blockMatch of storageValue.matchAll(
    /<(p|li|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi,
  )) {
    const text = htmlFragmentToText(blockMatch[2]);

    if (text.length < 24) {
      continue;
    }

    const headingPath = getHeadingPathAtIndex(headings, blockMatch.index || 0);
    const evidenceText = headingPath
      ? `Section: ${headingPath} | Content: ${text}`
      : `Content: ${text}`;
    const score = scoreEvidenceText(
      evidenceText,
      keywordTokens,
      phraseCandidates,
    );

    if (score > 0) {
      evidenceChunks.push({
        text: evidenceText,
        score,
        location: headingPath || undefined,
        snippet: text,
      });
    }
  }

  return evidenceChunks;
}

function buildConfluenceReference(
  source: KnowledgeSource,
  match: ConfluenceSearchResult,
  evidenceChunk: ConfluenceEvidenceChunk,
): MessageReference {
  return {
    id: `confluence:${source.id}:${match.id}`,
    kind: "confluence",
    title: match.title,
    sourceName: source.name,
    location: evidenceChunk.location,
    url: match.url,
    snippet: trimReferenceSnippet(evidenceChunk.snippet || evidenceChunk.text),
  };
}

function findBestExcerptWindow(text: string, query: string) {
  const haystack = text.toLowerCase();
  const keywordTokens = extractKeywordTokens(query);
  const phraseCandidates = buildPhraseCandidates(keywordTokens);
  const terms = dedupeBy(
    [...keywordTokens, ...phraseCandidates].filter((term) => term.length >= 4),
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
      const score =
        scoreWindowByTerms(windowText, keywordTokens, phraseCandidates) +
        scoreStructuredWindow(windowText, keywordTokens);

      if (!bestWindow || score > bestWindow.score) {
        bestWindow = { start: windowStart, score };
      }

      fromIndex = matchIndex + term.length;
    }
  }

  return bestWindow;
}

function scoreWindowByTerms(
  windowText: string,
  keywordTokens: string[],
  phraseCandidates: string[],
) {
  let score = 0;

  for (const token of dedupeBy(keywordTokens, (value) => value)) {
    if (windowText.includes(token)) {
      score += 2;
    }
  }

  for (const phrase of dedupeBy(phraseCandidates, (value) => value)) {
    if (windowText.includes(phrase)) {
      score += phrase.split(" ").length >= 3 ? 4 : 3;
    }
  }

  return score;
}

function scoreStructuredWindow(windowText: string, keywordTokens: string[]) {
  const lines = windowText
    .split(/(?<=[.!?])\s+|\s{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.reduce((bestScore, line) => {
    const tokenMatches = keywordTokens.filter((token) => line.includes(token));
    const numericBoost = /\b\d+(?:[.,]\d+)?%?\b/.test(line) ? 2 : 0;
    const lineScore = tokenMatches.length * 3 + numericBoost;

    return Math.max(bestScore, lineScore);
  }, 0);
}

function extractHeadingMatches(storageValue: string): HeadingMatch[] {
  return Array.from(storageValue.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi))
    .map((match) => ({
      level: Number(match[1]),
      title: htmlFragmentToText(match[2]),
      index: match.index || 0,
    }))
    .filter((heading) => Boolean(heading.title));
}

function getHeadingPathAtIndex(headings: HeadingMatch[], index: number): string {
  const activeHeadings: HeadingMatch[] = [];

  for (const heading of headings) {
    if (heading.index > index) {
      break;
    }

    while (
      activeHeadings.length > 0 &&
      activeHeadings[activeHeadings.length - 1].level >= heading.level
    ) {
      activeHeadings.pop();
    }

    activeHeadings.push(heading);
  }

  return activeHeadings.map((heading) => heading.title).join(" > ");
}

function htmlFragmentToText(fragment: string): string {
  return normalizeWhitespace(
    decodeHtmlEntities(
      fragment
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/(p|div|li)>/gi, "\n")
        .replace(/<[^>]+>/g, " "),
    ),
  );
}

function scoreEvidenceText(
  text: string,
  keywordTokens: string[],
  phraseCandidates: string[],
): number {
  const normalizedText = normalizeWhitespace(text).toLowerCase();
  let score = 0;

  for (const phrase of dedupeBy(phraseCandidates, (value) => value)) {
    if (normalizedText.includes(phrase)) {
      score += phrase.split(" ").length >= 3 ? 7 : 5;
    }
  }

  for (const token of dedupeBy(keywordTokens, (value) => value)) {
    if (normalizedText.includes(token)) {
      score += 2;
    }
  }

  if (/\b\d+(?:[.,]\d+)?%?\b/.test(normalizedText)) {
    score += 1;
  }

  return score;
}

function scorePrimaryCell(
  primaryValue: string | undefined,
  keywordTokens: string[],
  phraseCandidates: string[],
) {
  if (!primaryValue) {
    return 0;
  }

  const normalizedPrimaryValue = normalizeWhitespace(primaryValue).toLowerCase();
  let score = 0;

  for (const phrase of dedupeBy(phraseCandidates, (value) => value)) {
    if (normalizedPrimaryValue.includes(phrase)) {
      score += 6;
    }
  }

  for (const token of dedupeBy(keywordTokens, (value) => value)) {
    if (normalizedPrimaryValue.includes(token)) {
      score += 3;
    }
  }

  return score;
}

function trimExcerpt(value: string) {
  const excerpt = normalizeWhitespace(value).slice(0, MAX_EXCERPT_CHARS);
  return excerpt.length < value.length ? `${excerpt}...` : excerpt;
}

function trimReferenceSnippet(value: string) {
  const snippet = normalizeWhitespace(value).slice(0, 280);
  return snippet.length < value.length ? `${snippet}...` : snippet;
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
