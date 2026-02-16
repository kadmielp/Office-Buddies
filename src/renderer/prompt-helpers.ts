import { getAgentProfile } from "../agent-profiles";
import { getAnimationKeysBrackets } from "./agent-packs";

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
    return prompt;
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
    return prompt;
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

  return `${prompt}

Agent context:
${fallbackLines.join("\n")}`;
}
