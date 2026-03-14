import { SettingsState } from "../shared/shared-state";
import { getAgentProfile } from "../shared/agent-profiles";
import { getAnimationKeysBrackets } from "./agent-packs";

const STRUCTURE_RULE =
  "Format every response using neat, readable structure (clear sections, short paragraphs, and bullets when useful).";

function applyTokens(prompt: string, selectedAgent: string): string {
  const profile = getAgentProfile(selectedAgent);

  return prompt
    .split("[AGENT_NAME]")
    .join(selectedAgent)
    .split("[AGENT_PERSONALITY]")
    .join(profile.personality)
    .split("[AGENT_APPEARANCE]")
    .join(profile.appearance)
    .split("[LIST OF ANIMATIONS]")
    .join(getAnimationKeysBrackets(selectedAgent).join(", "));
}

export function buildSystemPrompt(
  promptTemplate: string | undefined,
  selectedAgent: string,
): string {
  const template = promptTemplate || "";
  const prompt = applyTokens(template, selectedAgent);

  if (prompt.includes("[AGENT_") || prompt.includes("[LIST OF ANIMATIONS]")) {
    return ensureStructureRule(prompt);
  }

  const missingName = !template.includes("[AGENT_NAME]");
  const missingPersonality = !template.includes("[AGENT_PERSONALITY]");
  const missingAppearance = !template.includes("[AGENT_APPEARANCE]");
  const missingAnimations = !template.includes("[LIST OF ANIMATIONS]");

  if (
    !missingName &&
    !missingPersonality &&
    !missingAppearance &&
    !missingAnimations
  ) {
    return ensureStructureRule(prompt);
  }

  const profile = getAgentProfile(selectedAgent);
  const fallbackLines: string[] = [];

  if (missingName) fallbackLines.push(`- Name: ${selectedAgent}`);
  if (missingPersonality)
    fallbackLines.push(`- Personality: ${profile.personality}`);
  if (missingAppearance)
    fallbackLines.push(`- Appearance: ${profile.appearance}`);
  if (missingAnimations) {
    fallbackLines.push(
      `- Animation keys you may use at response start: ${getAnimationKeysBrackets(selectedAgent).join(", ")}`,
    );
  }

  return ensureStructureRule(`${prompt}

Agent context:
${fallbackLines.join("\n")}`);
}

export function buildSessionSystemPrompt(
  settings: SettingsState,
  selectedAgent: string,
  dynamicKnowledgeContext = "",
): string {
  const basePrompt = buildSystemPrompt(settings.systemPrompt, selectedAgent);
  const knowledgeContext = buildKnowledgeContext(settings);
  const extraKnowledgeContext = dynamicKnowledgeContext.trim();
  const knowledgeRule = buildKnowledgeUsageRule(
    settings,
    knowledgeContext,
    extraKnowledgeContext,
  );

  if (!knowledgeContext && !extraKnowledgeContext && !knowledgeRule) {
    return basePrompt;
  }

  return [basePrompt, knowledgeRule, knowledgeContext, extraKnowledgeContext]
    .filter(Boolean)
    .join("\n\n");
}

function ensureStructureRule(prompt: string): string {
  if (prompt.includes(STRUCTURE_RULE)) {
    return prompt;
  }

  return `${prompt}\n${STRUCTURE_RULE}`;
}

function buildKnowledgeContext(settings: SettingsState): string {
  if (!settings.useKnowledgeAtStart) {
    return "";
  }

  const fileLines = (settings.knowledgeFiles || []).map((file) => {
    const previewSuffix = file.previewText
      ? ` Extracted content: ${file.previewText.slice(0, 2000)}`
      : " Preview unavailable; use the file name and metadata as reference only.";

    return `- ${file.name} (${file.meta}, ${file.status}).${previewSuffix}`;
  });

  const knowledgeSourceLines = (settings.knowledgeSources || []).map(
    (source) =>
      `- ${source.name} (${source.meta}, ${source.status}). Treat this as a read-only connected knowledge source.`,
  );

  if (fileLines.length === 0 && knowledgeSourceLines.length === 0) {
    return "";
  }

  const sections = ["Knowledge sources available for this session:"];

  if (fileLines.length > 0) {
    sections.push("Files:");
    sections.push(...fileLines);
  }

  if (knowledgeSourceLines.length > 0) {
    sections.push("Connected knowledge sources:");
    sections.push(...knowledgeSourceLines);
  }

  return sections.join("\n");
}

function buildKnowledgeUsageRule(
  settings: SettingsState,
  knowledgeContext: string,
  dynamicKnowledgeContext: string,
): string {
  if (!settings.useKnowledgeAtStart) {
    return "";
  }

  if (!knowledgeContext && !dynamicKnowledgeContext) {
    return "";
  }

  return [
    "Knowledge-base mode is enabled for this conversation.",
    "Answer using the provided knowledge-base content first.",
    "If the answer is not supported by the provided knowledge-base content, say that the knowledge base does not contain enough information instead of guessing.",
  ].join("\n");
}
