import { getChatAnimationKeys } from "../agent-packs";
import {
  createAnimationResolver,
  parseAnimationContent,
} from "./animation-keys";
import { buildSessionSystemPrompt } from "../prompt-helpers";
import { promptStreamingWithProvider } from "../ai-provider-client";
import { clippyApi } from "../clippyApi";
import { Message } from "../features/chat/Message";
import { SettingsState } from "../../shared/shared-state";
import {
  DynamicKnowledgeContextResult,
  MessageReference,
} from "../../types/interfaces";

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
}: StreamAssistantReplyArgs): Promise<{
  content: string;
  references: MessageReference[];
}> {
  let knowledgeContextResult: DynamicKnowledgeContextResult = {
    promptContext: "",
    references: [],
  };
  const knowledgeEnabled = Boolean(settings.useKnowledgeAtStart);

  if (knowledgeEnabled) {
    try {
      knowledgeContextResult = await clippyApi.getDynamicKnowledgeContext(
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
    knowledgeContextResult.promptContext,
  );
  const response = promptStreamingWithProvider({
    settings,
    systemPrompt,
    history,
    input,
    requestUUID,
  });

  const resolve = createAnimationResolver(getChatAnimationKeys(selectedAgent));
  let fullContent = "";
  let filteredContent = "";
  let emittedKeys = 0;

  const refresh = (final: boolean) => {
    const parsed = parseAnimationContent(fullContent, resolve, { final });
    filteredContent = parsed.text;
    for (; emittedKeys < parsed.keys.length; emittedKeys++) {
      onAnimationKey?.(parsed.keys[emittedKeys]);
    }
  };

  for await (const chunk of response) {
    if (fullContent === "") {
      onResponding?.();
    }

    fullContent += chunk;
    refresh(false);
    onChunk(filteredContent);
  }

  refresh(true);
  onChunk(filteredContent);

  return {
    content: filteredContent,
    references: knowledgeContextResult.references,
  };
}
