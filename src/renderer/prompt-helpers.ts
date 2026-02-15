import { getAgentProfile } from "../agent-profiles";
import { getAnimationKeysBrackets } from "./agent-packs";
import { DEFAULT_SYSTEM_PROMPT } from "../sharedState";

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
  const prompt = applyTokens(promptTemplate || DEFAULT_SYSTEM_PROMPT, selectedAgent);

  if (prompt.includes("[AGENT_") || prompt.includes("[LIST OF ANIMATIONS]")) {
    return prompt;
  }

  const profile = getAgentProfile(selectedAgent);

  return `${prompt}

Agent context:
- Name: ${selectedAgent}
- Personality: ${profile.personality}
- Appearance: ${profile.appearance}
- Animation keys you may use at response start: ${getAnimationKeysBrackets(selectedAgent).join(", ")}`;
}
