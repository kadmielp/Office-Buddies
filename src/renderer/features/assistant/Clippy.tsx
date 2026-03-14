import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import Markdown from "react-markdown";

import {
  getAgentPack,
  getChatAnimationKeys,
  getAnimationDuration,
  getIdleAnimationKeys,
  getDeepIdleAnimationKeys,
  isDisallowedChatAnimationKey,
  AgentAnimation,
  AgentFrame,
} from "../../agent-packs";
import { useChat } from "../../contexts/ChatContext";
import { log } from "../../logging";
import { useDebugState } from "../../contexts/DebugContext";
import { useSharedState } from "../../contexts/SharedStateContext";
import { clippyApi } from "../../clippyApi";
import { useBubbleView } from "../../contexts/BubbleViewContext";
import { isModelDownloading } from "../../../shared/model-helpers";
import { BuddySpeechPayload } from "../../../types/interfaces";
import { Message } from "../chat/Message";
import { streamAssistantReply } from "../../helpers/stream-assistant-reply";
import { getThemeIcons } from "../../theme/theme";

const WAIT_TIME = 60000;
const DEEP_IDLE_WAIT_TIME = 5 * 60 * 1000;
const WINDOW_PADDING_WIDTH = 1;
const WINDOW_PADDING_HEIGHT = 7;
const SPEECH_BUBBLE_PADDING_WIDTH = 220;
const SPEECH_BUBBLE_PADDING_HEIGHT = 340;
const MINI_CHAT_PADDING_WIDTH = 400;
const MINI_CHAT_PADDING_HEIGHT = 360;

type MiniChatScreenshot = {
  dataUrl: string;
  width: number;
  height: number;
};

type MiniChatMessage = Message & {
  screenshots?: MiniChatScreenshot[];
  promptContent?: string;
};

function getFrameTimeout(frame: AgentFrame): number {
  return Math.max(frame.duration ?? 100, 10);
}

function getNextFrameIndex(
  animation: AgentAnimation,
  currentIndex: number,
): number {
  const frame = animation.frames[currentIndex];

  if (!frame) {
    return animation.frames.length;
  }

  const branches = frame.branching?.branches ?? [];

  if (branches.length > 0) {
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const branch of branches) {
      if (!Number.isFinite(branch.weight) || branch.weight <= 0) {
        continue;
      }

      cumulative += branch.weight;

      if (random <= cumulative) {
        return branch.frameIndex;
      }
    }
  }

  if (typeof frame.exitBranch === "number") {
    return frame.exitBranch;
  }

  return currentIndex + 1;
}

function findFirstAnimationKey(
  animations: Record<string, AgentAnimation>,
  candidates: string[],
): string | undefined {
  return candidates.find((key) => Boolean(animations[key]));
}

function getBuddyChatPrompt(payload: BuddySpeechPayload): string {
  const selectedText = normalizeSelectedTextForChat(
    payload.selectedText?.trim() || "",
  );

  if (!selectedText) {
    return "Help me with this.";
  }

  if (payload.action === "define") {
    return `Define this word and include context examples: ${selectedText}`;
  }

  if (payload.action === "summarize") {
    return `Summarize this text in a concise way:\n\n${selectedText}`;
  }

  if (payload.action === "rewrite-friendly") {
    return `Rewrite this in a friendlier tone while keeping the meaning:\n\n${selectedText}`;
  }

  return `Explain this in simple terms:\n\n${selectedText}`;
}

function normalizeSelectedTextForChat(value: string): string {
  if (!value) {
    return "";
  }

  const lines = value.replace(/\r/g, "").split("\n");
  const nonEmptyLines = lines.filter((line) => line.trim().length > 0);

  if (nonEmptyLines.length === 0) {
    return value.trim();
  }

  const minIndent = nonEmptyLines.reduce((currentMin, line) => {
    const indentLength = (line.match(/^[ \t]*/) || [""])[0].length;
    return Math.min(currentMin, indentLength);
  }, Number.MAX_SAFE_INTEGER);

  return lines
    .map((line) => line.slice(Math.min(minIndent, line.length)).trimEnd())
    .join("\n")
    .trim();
}

function buildMiniChatPrompt(message: string, screenshotCount: number): string {
  const trimmedMessage = message.trim();

  if (screenshotCount > 0 && trimmedMessage) {
    return `${trimmedMessage}\n\n[The user also attached ${screenshotCount} screenshot${screenshotCount === 1 ? "" : "s"} from the current display.]`;
  }

  if (screenshotCount > 0) {
    return `I attached ${screenshotCount} screenshot${screenshotCount === 1 ? "" : "s"} from my current display.`;
  }

  return trimmedMessage;
}

export function Clippy() {
  const {
    animationKey,
    setAnimationKey,
    status,
    setStatus,
    isStartingNewChat,
    setIsChatWindowOpen,
    isChatWindowOpen,
    messages,
    addMessage,
    startNewChat,
  } = useChat();
  const { settings, models } = useSharedState();
  const { currentView, setCurrentView } = useBubbleView();
  const { enableDragDebug } = useDebugState();
  const selectedAgent = settings.selectedAgent || "Clippy";
  const themeIcons = useMemo(
    () => getThemeIcons(settings.uiDesign),
    [settings.uiDesign],
  );
  const isAssistantGalleryOpen =
    currentView === "assistant-gallery" && isChatWindowOpen;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spriteImageRef = useRef<HTMLImageElement | null>(null);
  const frameTimeoutRef = useRef<number | undefined>(undefined);
  const defaultTimeoutRef = useRef<number | undefined>(undefined);
  const idleTimeoutRef = useRef<number | undefined>(undefined);
  const speechTimeoutRef = useRef<number | undefined>(undefined);
  const copyFeedbackTimeoutRef = useRef<number | undefined>(undefined);
  const activeAnimationRef = useRef<string>("Default");
  const hasPlayedWelcomeRef = useRef<boolean>(false);
  const idleStartedAtRef = useRef<number | null>(null);
  const wasBuddySpeechLoadingRef = useRef<boolean>(false);

  const [isSpriteReady, setIsSpriteReady] = useState(false);
  const [displayedAgent, setDisplayedAgent] = useState<string>(selectedAgent);
  const [manualAnimationKey, setManualAnimationKey] = useState<string | null>(
    null,
  );
  const [proactiveSpeech, setProactiveSpeech] = useState<{
    message: string;
    actions?: Array<{ label: string; action: string }>;
    animation?: string;
    loop?: boolean;
  } | null>(null);
  const [switchTargetAgent, setSwitchTargetAgent] = useState<string | null>(
    null,
  );
  const [buddySpeech, setBuddySpeech] = useState<BuddySpeechPayload | null>(
    null,
  );
  const [miniChatMessages, setMiniChatMessages] = useState<MiniChatMessage[]>(
    [],
  );
  const [miniChatInput, setMiniChatInput] = useState("");
  const [miniChatStreamingContent, setMiniChatStreamingContent] = useState("");
  const [isMiniChatOpen, setIsMiniChatOpen] = useState(false);
  const [miniChatScreenshots, setMiniChatScreenshots] = useState<
    MiniChatScreenshot[]
  >([]);
  const [isCapturingMiniChatScreenshot, setIsCapturingMiniChatScreenshot] =
    useState(false);
  const [hasCopiedBuddySpeech, setHasCopiedBuddySpeech] = useState(false);
  const [isBuddyThinking, setIsBuddyThinking] = useState(false);
  const [hasShownStartupGreeting, setHasShownStartupGreeting] =
    useState<boolean>(false);
  const [isStartupGreetingPlaying, setIsStartupGreetingPlaying] =
    useState<boolean>(false);
  const [switchPhase, setSwitchPhase] = useState<
    "none" | "goodbye" | "welcome"
  >("none");
  const isAgentSwitchAnimating = switchPhase !== "none";
  const miniChatInputRef = useRef<HTMLTextAreaElement | null>(null);
  const hasMiniChatKnowledge =
    (settings.knowledgeFiles?.length || 0) > 0 ||
    (settings.knowledgeSources?.length || 0) > 0;
  const isMiniChatKnowledgeEnabled = settings.useKnowledgeInMiniChat !== false;

  const agentPack = useMemo(
    () => getAgentPack(displayedAgent),
    [displayedAgent],
  );
  const contextMenuAnimations = useMemo(
    () => getChatAnimationKeys(displayedAgent),
    [displayedAgent],
  );
  const isAnyModelDownloading = useMemo(
    () => Object.values(models || {}).some(isModelDownloading),
    [models],
  );
  const shouldUseChatProcessingAnimation =
    isAnyModelDownloading || isStartingNewChat;
  const shouldUseBuddyProcessingAnimation = isBuddyThinking;
  const miniChatAnimationPhase =
    isMiniChatOpen && (status === "thinking" || status === "responding")
      ? status
      : null;
  const shouldUseProcessingAnimation =
    hasShownStartupGreeting &&
    !isStartupGreetingPlaying &&
    (shouldUseChatProcessingAnimation ||
      shouldUseBuddyProcessingAnimation ||
      Boolean(miniChatAnimationPhase));
  const displayedMiniChatMessages =
    miniChatStreamingContent.trim().length > 0
      ? [
          ...miniChatMessages,
          {
            id: "mini-chat-streaming",
            content: miniChatStreamingContent,
            sender: "clippy" as const,
            createdAt: Date.now(),
          },
        ]
      : miniChatMessages;
  const hasSpeechBubble =
    isMiniChatOpen || Boolean(buddySpeech) || Boolean(proactiveSpeech);

  const clearFrameTimeout = useCallback(() => {
    if (frameTimeoutRef.current) {
      window.clearTimeout(frameTimeoutRef.current);
      frameTimeoutRef.current = undefined;
    }
  }, []);

  const clearDefaultTimeout = useCallback(() => {
    if (defaultTimeoutRef.current) {
      window.clearTimeout(defaultTimeoutRef.current);
      defaultTimeoutRef.current = undefined;
    }
  }, []);

  const clearIdleTimeout = useCallback(() => {
    if (idleTimeoutRef.current) {
      window.clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = undefined;
    }
  }, []);

  const clearSpeechTimeout = useCallback(() => {
    if (speechTimeoutRef.current) {
      window.clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = undefined;
    }
  }, []);

  const clearCopyFeedbackTimeout = useCallback(() => {
    if (copyFeedbackTimeoutRef.current) {
      window.clearTimeout(copyFeedbackTimeoutRef.current);
      copyFeedbackTimeoutRef.current = undefined;
    }
  }, []);

  const scheduleBuddySpeechDismiss = useCallback(() => {
    clearSpeechTimeout();
    speechTimeoutRef.current = window.setTimeout(() => {
      setBuddySpeech(null);
    }, 20000);
  }, [clearSpeechTimeout]);

  const drawFrame = useCallback(
    (frame: AgentFrame) => {
      const canvas = canvasRef.current;
      const spriteImage = spriteImageRef.current;

      if (!canvas || !spriteImage) {
        return;
      }

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      context.clearRect(0, 0, agentPack.frameWidth, agentPack.frameHeight);

      const mapColumns = Math.max(
        1,
        Math.floor(spriteImage.width / agentPack.frameWidth),
      );
      const sources = frame.images ?? [];

      for (const imageRef of sources) {
        let sourceX = 0;
        let sourceY = 0;

        if (typeof imageRef === "number") {
          sourceX = (imageRef % mapColumns) * agentPack.frameWidth;
          sourceY = Math.floor(imageRef / mapColumns) * agentPack.frameHeight;
        } else {
          [sourceX, sourceY] = imageRef;
        }

        context.drawImage(
          spriteImage,
          sourceX,
          sourceY,
          agentPack.frameWidth,
          agentPack.frameHeight,
          0,
          0,
          agentPack.frameWidth,
          agentPack.frameHeight,
        );
      }
    },
    [agentPack.frameHeight, agentPack.frameWidth],
  );

  const playSound = useCallback(
    (soundKey?: string) => {
      if (settings.disableSound) {
        return;
      }

      if (!soundKey) {
        return;
      }

      const source = agentPack.sounds[soundKey];

      if (!source) {
        return;
      }

      const audio = new Audio(source);
      void audio.play().catch(() => {});
    },
    [agentPack.sounds, settings.disableSound],
  );

  const runAnimation = useCallback(
    (key: string, onComplete?: () => void) => {
      if (!isSpriteReady || !agentPack.animations[key]) {
        onComplete?.();
        return;
      }

      activeAnimationRef.current = key;
      clearFrameTimeout();

      const animation = agentPack.animations[key];

      const tick = (frameIndex: number): void => {
        if (activeAnimationRef.current !== key) {
          return;
        }

        const frame = animation.frames[frameIndex];

        if (!frame) {
          return;
        }

        drawFrame(frame);
        playSound(frame.sound);

        const nextFrameIndex = getNextFrameIndex(animation, frameIndex);

        if (nextFrameIndex < 0 || nextFrameIndex >= animation.frames.length) {
          onComplete?.();
          return;
        }

        frameTimeoutRef.current = window.setTimeout(() => {
          tick(nextFrameIndex);
        }, getFrameTimeout(frame));
      };

      tick(0);
    },
    [
      agentPack.animations,
      clearFrameTimeout,
      drawFrame,
      isSpriteReady,
      playSound,
    ],
  );

  const playAnimation = useCallback(
    (key: string, onComplete?: () => void) => {
      if (isDisallowedChatAnimationKey(key)) {
        log("Blocked disallowed animation", { key, agent: agentPack.name });
        runAnimation("Default");
        onComplete?.();
        return;
      }

      if (!agentPack.animations[key]) {
        log("Animation not found", { key, agent: agentPack.name });
        onComplete?.();
        return;
      }

      log("Playing animation", { key, agent: agentPack.name });
      clearDefaultTimeout();
      let isCompleted = false;
      const finish = () => {
        if (isCompleted) {
          return;
        }

        isCompleted = true;
        clearDefaultTimeout();
        runAnimation("Default");
        onComplete?.();
      };
      runAnimation(key, finish);

      defaultTimeoutRef.current = window.setTimeout(
        () => {
          log("Animation watchdog fallback", { key, agent: agentPack.name });
          finish();
        },
        Math.max((getAnimationDuration(agentPack, key) + 200) * 3, 4000),
      );
    },
    [agentPack, clearDefaultTimeout, runAnimation],
  );

  const toggleChat = useCallback(() => {
    if (isChatWindowOpen) {
      setIsChatWindowOpen(false);
      return;
    }

    setCurrentView("chat");
    setIsChatWindowOpen(true);
  }, [isChatWindowOpen, setCurrentView, setIsChatWindowOpen]);

  const closeMiniChat = useCallback(() => {
    setIsMiniChatOpen(false);
    setMiniChatInput("");
    setMiniChatMessages([]);
    setMiniChatStreamingContent("");
    setMiniChatScreenshots([]);
    setIsCapturingMiniChatScreenshot(false);
  }, []);

  const openMiniChat = useCallback(() => {
    clearSpeechTimeout();
    clearCopyFeedbackTimeout();
    setBuddySpeech(null);
    setProactiveSpeech(null);
    setHasCopiedBuddySpeech(false);
    setIsMiniChatOpen(true);

    requestAnimationFrame(() => {
      miniChatInputRef.current?.focus();
    });
  }, [clearCopyFeedbackTimeout, clearSpeechTimeout]);

  const captureMiniChatScreenshot = useCallback(async () => {
    if (!isMiniChatOpen || isCapturingMiniChatScreenshot) {
      return;
    }

    setIsCapturingMiniChatScreenshot(true);

    try {
      const screenshot = await clippyApi.captureAssistantScreenshot();
      if (screenshot) {
        setMiniChatScreenshots((prevScreenshots) => [
          ...prevScreenshots,
          screenshot,
        ]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsCapturingMiniChatScreenshot(false);
      requestAnimationFrame(() => {
        miniChatInputRef.current?.focus();
      });
    }
  }, [isCapturingMiniChatScreenshot, isMiniChatOpen]);

  const sendMiniChatMessage = useCallback(async () => {
    const trimmedMessage = miniChatInput.trim();
    const screenshotCount = miniChatScreenshots.length;
    const prompt = buildMiniChatPrompt(trimmedMessage, screenshotCount);

    if ((!trimmedMessage && screenshotCount === 0) || status !== "idle") {
      return;
    }

    const visibleContent =
      trimmedMessage ||
      (screenshotCount > 0
        ? `Attached ${screenshotCount} screenshot${screenshotCount === 1 ? "" : "s"}.`
        : "");

    const userMessage: MiniChatMessage = {
      id: crypto.randomUUID(),
      content: visibleContent,
      imageDataUrls: miniChatScreenshots.map(
        (screenshot) => screenshot.dataUrl,
      ),
      sender: "user",
      createdAt: Date.now(),
      screenshots: miniChatScreenshots,
      promptContent: prompt,
    };

    const history = [
      ...messages,
      ...miniChatMessages.map((message) => ({
        id: message.id,
        content:
          message.promptContent ||
          message.content ||
          ((message.screenshots?.length || 0) > 0
            ? `The user attached ${message.screenshots?.length} screenshot${message.screenshots?.length === 1 ? "" : "s"} from the current display.`
            : ""),
        imageDataUrls: message.imageDataUrls,
        sender: message.sender,
        createdAt: message.createdAt,
      })),
      userMessage,
    ];

    setMiniChatMessages((prevMessages) => [...prevMessages, userMessage]);
    setMiniChatInput("");
    setMiniChatStreamingContent("");
    setMiniChatScreenshots([]);
    setStatus("thinking");

    try {
      const filteredContent = await streamAssistantReply({
        settings: {
          ...settings,
          useKnowledgeAtStart: isMiniChatKnowledgeEnabled,
        },
        selectedAgent,
        history,
        input: prompt,
        requestUUID: crypto.randomUUID(),
        onResponding: () => setStatus("responding"),
        onChunk: (content) => setMiniChatStreamingContent(content),
        onAnimationKey: (animationKey) => setAnimationKey(animationKey),
      });

      setMiniChatMessages((prevMessages) => [
        ...prevMessages,
        {
          id: crypto.randomUUID(),
          content: filteredContent,
          sender: "clippy",
          createdAt: Date.now(),
        },
      ]);
    } catch (error) {
      console.error(error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unknown error while contacting remote provider.";

      setMiniChatMessages((prevMessages) => [
        ...prevMessages,
        {
          id: crypto.randomUUID(),
          content: `Falha ao obter resposta: ${errorMessage}`,
          sender: "clippy",
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setMiniChatStreamingContent("");
      setStatus("idle");
      requestAnimationFrame(() => {
        miniChatInputRef.current?.focus();
      });
    }
  }, [
    messages,
    miniChatInput,
    miniChatMessages,
    miniChatScreenshots,
    isMiniChatKnowledgeEnabled,
    selectedAgent,
    setAnimationKey,
    setStatus,
    settings,
    status,
  ]);

  useEffect(() => {
    if (selectedAgent === displayedAgent) {
      return;
    }

    setManualAnimationKey(null);

    if (switchPhase === "none" && isSpriteReady) {
      setSwitchTargetAgent(selectedAgent);
      setSwitchPhase("goodbye");
      return;
    }

    // Initial load or unavailable sprite: switch directly.
    if (switchPhase === "none") {
      setDisplayedAgent(selectedAgent);
      setSwitchTargetAgent(null);
      setSwitchPhase("none");
      return;
    }

    // If the user changes selection during a transition, keep latest target.
    setSwitchTargetAgent(selectedAgent);
  }, [displayedAgent, isSpriteReady, selectedAgent, switchPhase]);

  useEffect(() => {
    if (!isMiniChatOpen) {
      return;
    }

    requestAnimationFrame(() => {
      miniChatInputRef.current?.focus();
    });
  }, [isMiniChatOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMiniChatOpen) {
        event.preventDefault();
        closeMiniChat();
        return;
      }

      if (!(event.ctrlKey && event.key === "Enter")) {
        if (!(event.ctrlKey && event.key.toLowerCase() === "e")) {
          return;
        }

        if (!isMiniChatOpen) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();
        void captureMiniChatScreenshot();
        return;
      }

      if (isChatWindowOpen) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (isMiniChatOpen) {
        void sendMiniChatMessage();
        return;
      }

      openMiniChat();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    captureMiniChatScreenshot,
    closeMiniChat,
    isChatWindowOpen,
    isMiniChatOpen,
    openMiniChat,
    sendMiniChatMessage,
  ]);

  useEffect(() => {
    hasPlayedWelcomeRef.current = false;
    setHasShownStartupGreeting(false);
    setIsStartupGreetingPlaying(false);
    setIsSpriteReady(false);

    const spriteImage = new Image();

    spriteImage.onload = () => {
      spriteImageRef.current = spriteImage;
      setIsSpriteReady(true);
      runAnimation("Default");
    };

    spriteImage.src = agentPack.mapSrc;

    return () => {
      spriteImageRef.current = null;
    };
  }, [agentPack.mapSrc, runAnimation]);

  useEffect(() => {
    if (
      !isSpriteReady ||
      hasShownStartupGreeting ||
      isStartupGreetingPlaying ||
      manualAnimationKey ||
      isAgentSwitchAnimating
    ) {
      return;
    }

    const welcomeAnimationKey =
      findFirstAnimationKey(agentPack.animations, ["Greeting", "Show"]) ??
      "Default";

    hasPlayedWelcomeRef.current = true;
    setIsStartupGreetingPlaying(true);

    runAnimation(welcomeAnimationKey, () => {
      setHasShownStartupGreeting(true);
      setIsStartupGreetingPlaying(false);

      if (status === "welcome") {
        setStatus("idle");
      }
    });
  }, [
    agentPack.animations,
    hasShownStartupGreeting,
    isAgentSwitchAnimating,
    isSpriteReady,
    isStartupGreetingPlaying,
    manualAnimationKey,
    runAnimation,
    setStatus,
    status,
  ]);

  useEffect(() => {
    clippyApi.offProactiveSpeech();
    clippyApi.onProactiveSpeech((payload) => {
      const defaultAnimation = "GetAttention";
      const animation = payload.animation || defaultAnimation;
      const loop = payload.loop ?? true;

      setProactiveSpeech({
        message: payload.message,
        actions: payload.actions,
        animation: animation,
        loop: loop,
      });

      if (animation && !loop) {
        setManualAnimationKey(animation);
      }

      scheduleProactiveSpeechDismiss();
    });

    return () => {
      clippyApi.offProactiveSpeech();
    };
  }, []);

  const scheduleProactiveSpeechDismiss = useCallback(() => {
    clearSpeechTimeout();
    speechTimeoutRef.current = window.setTimeout(() => {
      setProactiveSpeech(null);
    }, 30000);
  }, [clearSpeechTimeout]);

  const closeProactiveSpeech = useCallback(() => {
    clearSpeechTimeout();
    setProactiveSpeech(null);
  }, [clearSpeechTimeout]);

  useEffect(() => {
    const speechPaddingWidth = isMiniChatOpen
      ? MINI_CHAT_PADDING_WIDTH
      : hasSpeechBubble
        ? SPEECH_BUBBLE_PADDING_WIDTH
        : 0;
    const speechPaddingHeight = isMiniChatOpen
      ? MINI_CHAT_PADDING_HEIGHT
      : hasSpeechBubble
        ? SPEECH_BUBBLE_PADDING_HEIGHT
        : 0;

    clippyApi.setMainWindowSize(
      agentPack.frameWidth + WINDOW_PADDING_WIDTH + speechPaddingWidth,
      agentPack.frameHeight + WINDOW_PADDING_HEIGHT + speechPaddingHeight,
    );
  }, [
    agentPack.frameHeight,
    agentPack.frameWidth,
    hasSpeechBubble,
    isMiniChatOpen,
  ]);

  useEffect(() => {
    clippyApi.setContextMenuAnimations(contextMenuAnimations).catch((error) => {
      console.error(error);
    });
  }, [contextMenuAnimations]);

  useEffect(() => {
    clippyApi.offContextMenuSelectAnimation();
    clippyApi.onContextMenuSelectAnimation((key) => {
      if (!key) {
        setManualAnimationKey(null);
        return;
      }

      setManualAnimationKey(key);
    });

    return () => {
      clippyApi.offContextMenuSelectAnimation();
    };
  }, []);

  useEffect(() => {
    clippyApi.offBuddySpeech();
    clippyApi.onBuddySpeech((payload) => {
      const isLoading = Boolean(payload.isLoading);
      const wasLoading = wasBuddySpeechLoadingRef.current;
      wasBuddySpeechLoadingRef.current = isLoading;

      setBuddySpeech(payload);
      setHasCopiedBuddySpeech(false);
      setIsBuddyThinking(isLoading);

      if (wasLoading && !isLoading) {
        setManualAnimationKey("GetAttention");
      }

      scheduleBuddySpeechDismiss();
    });

    return () => {
      clippyApi.offBuddySpeech();
      clearSpeechTimeout();
      clearCopyFeedbackTimeout();
    };
  }, [
    clearCopyFeedbackTimeout,
    clearSpeechTimeout,
    scheduleBuddySpeechDismiss,
  ]);

  const closeBuddySpeech = useCallback(() => {
    clearSpeechTimeout();
    clearCopyFeedbackTimeout();
    setBuddySpeech(null);
    setHasCopiedBuddySpeech(false);
  }, [clearCopyFeedbackTimeout, clearSpeechTimeout]);

  const retryBuddySpeech = useCallback(() => {
    if (!buddySpeech || !buddySpeech.selectedText) {
      return;
    }

    clippyApi
      .runBuddyAction(buddySpeech.action, buddySpeech.selectedText)
      .catch((error) => {
        console.error(error);
      });
    scheduleBuddySpeechDismiss();
  }, [buddySpeech, scheduleBuddySpeechDismiss]);

  const openBuddySpeechInChat = useCallback(() => {
    void (async () => {
      if (buddySpeech) {
        await startNewChat(true);
        await addMessage({
          id: crypto.randomUUID(),
          content: getBuddyChatPrompt(buddySpeech),
          sender: "user",
          createdAt: Date.now(),
        });
        await addMessage({
          id: crypto.randomUUID(),
          content: buddySpeech.speech,
          sender: "clippy",
          createdAt: Date.now(),
        });
      }

      setCurrentView("chat");
      setIsChatWindowOpen(true);
      closeBuddySpeech();
    })().catch((error) => {
      console.error(error);
    });
  }, [
    addMessage,
    buddySpeech,
    closeBuddySpeech,
    setCurrentView,
    setIsChatWindowOpen,
    startNewChat,
  ]);

  const copyBuddySpeech = useCallback(() => {
    if (!buddySpeech?.speech) {
      return;
    }

    clippyApi
      .clipboardWrite({ text: buddySpeech.speech } as any)
      .then(() => {
        setHasCopiedBuddySpeech(true);
        clearCopyFeedbackTimeout();
        copyFeedbackTimeoutRef.current = window.setTimeout(() => {
          setHasCopiedBuddySpeech(false);
        }, 2200);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [buddySpeech, clearCopyFeedbackTimeout]);

  useEffect(() => {
    if (!manualAnimationKey) {
      return;
    }

    if (!agentPack.animations[manualAnimationKey]) {
      setManualAnimationKey(null);
    }
  }, [agentPack.animations, manualAnimationKey]);

  useEffect(() => {
    if (!isSpriteReady || !manualAnimationKey) {
      return;
    }

    clearIdleTimeout();
    playAnimation(manualAnimationKey, () => {
      setManualAnimationKey(null);
    });
  }, [clearIdleTimeout, playAnimation, isSpriteReady, manualAnimationKey]);

  useEffect(() => {
    if (!isAgentSwitchAnimating || manualAnimationKey) {
      return;
    }

    clearDefaultTimeout();
    clearIdleTimeout();
    clearFrameTimeout();

    if (switchPhase === "goodbye") {
      if (!isSpriteReady) {
        return;
      }

      const goodbyeAnimationKey = findFirstAnimationKey(agentPack.animations, [
        "Goodbye",
        "GoodBye",
      ]);
      const targetAgent = switchTargetAgent || selectedAgent;

      if (goodbyeAnimationKey) {
        playAnimation(goodbyeAnimationKey, () => {
          setIsSpriteReady(false);
          setDisplayedAgent(targetAgent);
          setSwitchPhase("welcome");
        });
        return;
      }

      setIsSpriteReady(false);
      setDisplayedAgent(targetAgent);
      setSwitchPhase("welcome");
      return;
    }

    if (switchPhase === "welcome") {
      if (!isSpriteReady) {
        return;
      }

      const targetAgent = switchTargetAgent || displayedAgent;

      if (displayedAgent !== targetAgent) {
        setIsSpriteReady(false);
        setDisplayedAgent(targetAgent);
        return;
      }

      const welcomeAnimationKey =
        findFirstAnimationKey(agentPack.animations, ["Greeting", "Show"]) ??
        "Default";

      playAnimation(welcomeAnimationKey, () => {
        setStatus("idle");
        setSwitchTargetAgent(null);
        setSwitchPhase("none");
      });
    }
  }, [
    agentPack.animations,
    clearDefaultTimeout,
    clearFrameTimeout,
    clearIdleTimeout,
    displayedAgent,
    isAgentSwitchAnimating,
    isSpriteReady,
    manualAnimationKey,
    playAnimation,
    selectedAgent,
    setStatus,
    switchPhase,
    switchTargetAgent,
  ]);

  useEffect(() => {
    if (!isSpriteReady) {
      return;
    }

    if (
      manualAnimationKey ||
      isAgentSwitchAnimating ||
      shouldUseProcessingAnimation
    ) {
      return;
    }

    const playRandomIdleAnimation = () => {
      if (status !== "idle") {
        return;
      }

      if (idleStartedAtRef.current === null) {
        idleStartedAtRef.current = Date.now();
      }

      const deepIdleAnimationKeys = getDeepIdleAnimationKeys(agentPack);
      const hasReachedDeepIdleWindow =
        Date.now() - idleStartedAtRef.current >= DEEP_IDLE_WAIT_TIME;
      const idleAnimationKeys =
        hasReachedDeepIdleWindow && deepIdleAnimationKeys.length > 0
          ? deepIdleAnimationKeys
          : getIdleAnimationKeys(agentPack);

      if (idleAnimationKeys.length === 0) {
        return;
      }

      const randomIdleAnimationKey =
        idleAnimationKeys[Math.floor(Math.random() * idleAnimationKeys.length)];

      runAnimation(randomIdleAnimationKey, () => {
        runAnimation("Default");
        idleTimeoutRef.current = window.setTimeout(
          playRandomIdleAnimation,
          WAIT_TIME,
        );
      });
    };

    if (status === "idle") {
      if (idleStartedAtRef.current === null) {
        idleStartedAtRef.current = Date.now();
      }
      playRandomIdleAnimation();
    } else {
      idleStartedAtRef.current = null;
    }

    return () => {
      clearDefaultTimeout();
      clearIdleTimeout();
      clearFrameTimeout();
    };
  }, [
    agentPack,
    clearDefaultTimeout,
    clearFrameTimeout,
    clearIdleTimeout,
    isSpriteReady,
    runAnimation,
    setStatus,
    status,
    manualAnimationKey,
    isAgentSwitchAnimating,
    shouldUseProcessingAnimation,
  ]);

  useEffect(() => {
    if (!isSpriteReady || manualAnimationKey || isAgentSwitchAnimating) {
      return;
    }

    if (!shouldUseProcessingAnimation) {
      return;
    }

    const processingAnimationKey =
      findFirstAnimationKey(
        agentPack.animations,
        miniChatAnimationPhase === "responding"
          ? ["Writing", "Processing", "Thinking"]
          : miniChatAnimationPhase === "thinking"
            ? ["Thinking", "Processing", "Searching"]
            : shouldUseBuddyProcessingAnimation
              ? ["Thinking", "Processing"]
              : ["Processing", "Thinking", "Searching"],
      ) ?? "Default";
    let isCancelled = false;

    const playProcessingLoop = () => {
      if (isCancelled) {
        return;
      }

      runAnimation(processingAnimationKey, () => {
        if (isCancelled) {
          return;
        }

        playProcessingLoop();
      });
    };

    playProcessingLoop();

    return () => {
      isCancelled = true;
      runAnimation("Default");
    };
  }, [
    agentPack.animations,
    isAgentSwitchAnimating,
    isSpriteReady,
    manualAnimationKey,
    miniChatAnimationPhase,
    runAnimation,
    shouldUseBuddyProcessingAnimation,
    shouldUseProcessingAnimation,
  ]);

  useEffect(() => {
    if (!isSpriteReady || manualAnimationKey || isAgentSwitchAnimating) {
      return;
    }

    if (
      !proactiveSpeech ||
      !proactiveSpeech.loop ||
      !proactiveSpeech.animation
    ) {
      return;
    }

    const loopKey = proactiveSpeech.animation;
    if (!agentPack.animations[loopKey]) {
      return;
    }

    let isCancelled = false;

    const playLoop = () => {
      if (isCancelled) {
        return;
      }

      runAnimation(loopKey, () => {
        if (isCancelled) {
          return;
        }
        playLoop();
      });
    };

    playLoop();

    return () => {
      isCancelled = true;
      runAnimation("Default");
    };
  }, [
    agentPack.animations,
    isAgentSwitchAnimating,
    isSpriteReady,
    manualAnimationKey,
    runAnimation,
    proactiveSpeech,
  ]);

  useEffect(() => {
    if (
      !animationKey ||
      manualAnimationKey ||
      isAgentSwitchAnimating ||
      isBuddyThinking
    ) {
      return;
    }

    log("New animation key", { animationKey });
    playAnimation(animationKey, () => {
      setAnimationKey("");
    });
  }, [
    animationKey,
    isAgentSwitchAnimating,
    isBuddyThinking,
    manualAnimationKey,
    playAnimation,
    setAnimationKey,
  ]);

  return (
    <div
      style={{
        position: "relative",
        visibility: isAssistantGalleryOpen ? "hidden" : "visible",
        pointerEvents: isAssistantGalleryOpen ? "none" : "auto",
      }}
    >
      {isMiniChatOpen && (
        <div
          className={`buddy-speech buddy-speech-mini-chat app-no-drag ${
            miniChatScreenshots.length > 0 || isCapturingMiniChatScreenshot
              ? "has-toolbar"
              : ""
          }`}
        >
          {(miniChatScreenshots.length > 0 ||
            isCapturingMiniChatScreenshot) && (
            <div className="buddy-mini-chat-toolbar">
              <div className="buddy-mini-chat-toolbar-left">
                <button
                  type="button"
                  className="buddy-mini-chat-attachment-pill"
                  aria-label={
                    isCapturingMiniChatScreenshot
                      ? "Capturing screenshot"
                      : "Remove last pending screenshot"
                  }
                  disabled={
                    miniChatScreenshots.length === 0 ||
                    isCapturingMiniChatScreenshot
                  }
                  onClick={() =>
                    setMiniChatScreenshots((prevScreenshots) =>
                      prevScreenshots.slice(0, -1),
                    )
                  }
                >
                  <div className="buddy-mini-chat-attachment-pill-icons">
                    {miniChatScreenshots.map((_, index) => (
                      <img
                        key={`mini-chat-screenshot-${index}`}
                        src={themeIcons.attachment}
                        alt=""
                        aria-hidden="true"
                        className="buddy-mini-chat-attachment-pill-icon"
                      />
                    ))}
                    {isCapturingMiniChatScreenshot && (
                      <img
                        src={themeIcons.attachment}
                        alt="Capturing screenshot"
                        className="buddy-mini-chat-attachment-pill-icon buddy-mini-chat-attachment-pill-icon-pending"
                      />
                    )}
                  </div>
                  {miniChatScreenshots.length > 0 &&
                    !isCapturingMiniChatScreenshot && (
                      <span className="buddy-mini-chat-attachment-pill-count">
                        {miniChatScreenshots.length}
                      </span>
                    )}
                </button>
              </div>
            </div>
          )}
          <button
            className="buddy-speech-close"
            aria-label="Close mini chat"
            onClick={closeMiniChat}
          >
            x
          </button>
          {displayedMiniChatMessages.length > 0 && (
            <div className="buddy-mini-chat-log" aria-live="polite">
              <>
                {displayedMiniChatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`buddy-mini-chat-message ${message.sender === "user" ? "is-user" : "is-assistant"}`}
                  >
                    <div className="buddy-mini-chat-message-label">
                      {message.sender === "user" ? "You" : selectedAgent}
                    </div>
                    <div className="buddy-mini-chat-message-body">
                      {(message.screenshots?.length || 0) > 0 && (
                        <div className="buddy-mini-chat-inline-attachment">
                          <img
                            src={themeIcons.attachment}
                            alt=""
                            aria-hidden="true"
                            className="buddy-mini-chat-inline-attachment-icon"
                          />
                          <span>
                            {message.screenshots?.length} screenshot
                            {message.screenshots?.length === 1 ? "" : "s"}{" "}
                            attached
                          </span>
                        </div>
                      )}
                      {message.content && (
                        <Markdown
                          components={{
                            a: ({ node, ...props }) => (
                              <a
                                target="_blank"
                                rel="noopener noreferrer"
                                {...props}
                              />
                            ),
                          }}
                        >
                          {message.content}
                        </Markdown>
                      )}
                    </div>
                  </div>
                ))}
              </>
            </div>
          )}
          <textarea
            ref={miniChatInputRef}
            className="buddy-mini-chat-input"
            rows={1}
            value={miniChatInput}
            disabled={
              status === "thinking" ||
              status === "responding" ||
              isCapturingMiniChatScreenshot
            }
            onChange={(event) => setMiniChatInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                closeMiniChat();
                return;
              }

              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                void sendMiniChatMessage();
              }
            }}
            placeholder="Start typing... (press Enter to send)"
          />
          <div className="buddy-mini-chat-footer">
            {hasMiniChatKnowledge && (
              <div className="buddy-mini-chat-options">
                <button
                  type="button"
                  className={`buddy-mini-chat-option-pill${
                    isMiniChatKnowledgeEnabled ? " is-active" : ""
                  }`}
                  aria-pressed={isMiniChatKnowledgeEnabled}
                  title={
                    isMiniChatKnowledgeEnabled
                      ? "Knowledge mode is on for mini chat"
                      : "Knowledge mode is off for mini chat"
                  }
                  onClick={() => {
                    void clippyApi.setState(
                      "settings.useKnowledgeInMiniChat",
                      !isMiniChatKnowledgeEnabled,
                    );
                  }}
                >
                  <span
                    className={`buddy-mini-chat-option-indicator${
                      isMiniChatKnowledgeEnabled ? " is-active" : ""
                    }`}
                    aria-hidden="true"
                  />
                  <span>Knowledge</span>
                </button>
              </div>
            )}
            <div className="buddy-mini-chat-shortcuts">
              <span className="buddy-mini-chat-shortcut">
                <kbd>Ctrl</kbd>
                <kbd>E</kbd>
                <span>Screenshot</span>
              </span>
              <span className="buddy-mini-chat-shortcut">
                <kbd>Ctrl</kbd>
                <kbd>Enter</kbd>
                <span>Send</span>
              </span>
              <span className="buddy-mini-chat-shortcut">
                <kbd>Esc</kbd>
                <span>Cancel</span>
              </span>
            </div>
          </div>
          <div className="buddy-speech-tail" />
        </div>
      )}
      {!isMiniChatOpen && proactiveSpeech && (
        <div className="buddy-speech app-no-drag" aria-live="polite">
          <button
            className="buddy-speech-close"
            aria-label="Close message"
            onClick={closeProactiveSpeech}
          >
            x
          </button>
          <div className="buddy-speech-content">
            <Markdown
              components={{
                a: ({ node, ...props }) => (
                  <a target="_blank" rel="noopener noreferrer" {...props} />
                ),
              }}
            >
              {proactiveSpeech.message}
            </Markdown>
          </div>
          <div
            className="buddy-speech-options"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            {proactiveSpeech.actions &&
              proactiveSpeech.actions.map((action, idx) => (
                <button
                  key={idx}
                  className="buddy-speech-option"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    justifyContent: "flex-start",
                    padding: "2px 4px",
                  }}
                  onClick={() => {
                    setProactiveSpeech({
                      message: "Sending to Zero...",
                      actions: [],
                      loop: false,
                    });
                    setManualAnimationKey("SendMail");
                    clippyApi.sendProactiveAction("proactive", action.action);
                  }}
                >
                  <span className="buddy-speech-option-dot" />
                  {action.label}
                </button>
              ))}
            {(proactiveSpeech.actions?.length ?? 0) > 0 && (
              <div
                style={{
                  borderTop: "1px solid rgba(0,0,0,0.1)",
                  width: "100%",
                  margin: "4px 0",
                }}
              />
            )}
            <button
              className="buddy-speech-option"
              style={{
                width: "100%",
                textAlign: "left",
                justifyContent: "flex-start",
                padding: "2px 4px",
              }}
              onClick={() => {
                clippyApi.sendProactiveAction("proactive", "open_chat");
                setProactiveSpeech(null);
                setManualAnimationKey("SendMail");
                setIsChatWindowOpen(true);
                setCurrentView("chat");
              }}
            >
              <span
                className="buddy-speech-option-dot"
                style={{ backgroundColor: "#808080" }}
              />
              Open in chat
            </button>
          </div>
          <div className="buddy-speech-tail" />
        </div>
      )}
      {!isMiniChatOpen && buddySpeech && (
        <div className="buddy-speech app-no-drag" aria-live="polite">
          <button
            className="buddy-speech-close"
            aria-label="Close buddy message"
            onClick={closeBuddySpeech}
          >
            x
          </button>
          <div className="buddy-speech-content">
            <Markdown
              components={{
                a: ({ node, ...props }) => (
                  <a target="_blank" rel="noopener noreferrer" {...props} />
                ),
              }}
            >
              {buddySpeech.speech}
            </Markdown>
          </div>
          <div className="buddy-speech-options">
            <button className="buddy-speech-option" onClick={retryBuddySpeech}>
              <span className="buddy-speech-option-dot" />
              Try again
            </button>
            <button
              className="buddy-speech-option"
              onClick={openBuddySpeechInChat}
            >
              <span className="buddy-speech-option-dot" />
              Open in chat
            </button>
            <button className="buddy-speech-option" onClick={copyBuddySpeech}>
              <span className="buddy-speech-option-dot" />
              {hasCopiedBuddySpeech ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="buddy-speech-tail" />
        </div>
      )}
      <div
        className="app-drag"
        style={{
          position: "absolute",
          height: `${agentPack.frameHeight}px`,
          width: `${agentPack.frameWidth}px`,
          backgroundColor: enableDragDebug ? "blue" : "transparent",
          opacity: 0.5,
          zIndex: 5,
        }}
      >
        <div
          className="app-no-drag"
          style={{
            position: "absolute",
            height: `${Math.floor(agentPack.frameHeight * 0.86)}px`,
            width: `${Math.floor(agentPack.frameWidth * 0.36)}px`,
            backgroundColor: enableDragDebug ? "red" : "transparent",
            zIndex: 10,
            right: `${Math.floor(agentPack.frameWidth * 0.32)}px`,
            top: `${Math.floor(agentPack.frameHeight * 0.02)}px`,
            cursor: "help",
          }}
          onClick={toggleChat}
        ></div>
      </div>
      <canvas
        ref={canvasRef}
        className="app-no-select"
        width={agentPack.frameWidth}
        height={agentPack.frameHeight}
        aria-label={agentPack.name}
      />
    </div>
  );
}
