import { getAnimationKeysBrackets } from "../agent-packs";
import { buildSessionSystemPrompt } from "../prompt-helpers";
import { promptStreamingWithProvider } from "../ai-provider-client";
import { clippyApi } from "../clippyApi";
import { Message } from "../features/chat/Message";
import { SettingsState } from "../../shared/shared-state";

type StreamAssistantReplyArgs = {
  settings: SettingsState;
  selectedAgent: string;
  history: Message[];
  input: string;
  requestUUID: string;
  onResponding?: () => void;
  onChunk: (content: string) => void;
  onAnimationKey?: (animationKey: string) => void;
};

export async function streamAssistantReply({
  settings,
  selectedAgent,
  history,
  input,
  requestUUID,
  onResponding,
  onChunk,
  onAnimationKey,
}: StreamAssistantReplyArgs): Promise<string> {
  let dynamicKnowledgeContext = "";
  const knowledgeEnabled = Boolean(settings.useKnowledgeAtStart);

  if (knowledgeEnabled) {
    try {
      dynamicKnowledgeContext = await clippyApi.getDynamicKnowledgeContext(
        input,
        { enabled: true },
      );
    } catch (error) {
      console.error("Unable to load dynamic knowledge context", error);
    }
  }
  const systemPrompt = buildSessionSystemPrompt(
    settings,
    selectedAgent || "Clippy",
    dynamicKnowledgeContext,
  );
  const response = promptStreamingWithProvider({
    settings,
    systemPrompt,
    history,
    input,
    requestUUID,
  });

  let fullContent = "";
  let filteredContent = "";
  let hasSetAnimationKey = false;

  for await (const chunk of response) {
    if (fullContent === "") {
      onResponding?.();
    }

    if (!hasSetAnimationKey) {
      const { text, animationKey } = filterMessageContent(
        fullContent + chunk,
        selectedAgent,
      );

      filteredContent = text;
      fullContent += chunk;

      if (animationKey) {
        onAnimationKey?.(animationKey);
        hasSetAnimationKey = true;
      }
    } else {
      fullContent += chunk;
      filteredContent += chunk;
    }

    onChunk(filteredContent);
  }

  return filteredContent;
}

export function filterMessageContent(
  content: string,
  selectedAgent: string,
): {
  text: string;
  animationKey: string;
} {
  let text = content;
  let animationKey = "";
  const animationKeysBrackets = getAnimationKeysBrackets(selectedAgent);

  if (content === "[") {
    text = "";
  } else if (/^\[[A-Za-z]*$/m.test(content)) {
    text = content.replace(/^\[[A-Za-z]*$/m, "").trim();
  } else {
    for (const key of animationKeysBrackets) {
      if (content.startsWith(key)) {
        animationKey = key.slice(1, -1);
        text = content.slice(key.length).trim();
        break;
      }
    }
  }

  return { text, animationKey };
}
