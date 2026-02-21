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
} from "../agent-packs";
import { useChat } from "../contexts/ChatContext";
import { log } from "../logging";
import { useDebugState } from "../contexts/DebugContext";
import { useSharedState } from "../contexts/SharedStateContext";
import { clippyApi } from "../clippyApi";
import { useBubbleView } from "../contexts/BubbleViewContext";
import { isModelDownloading } from "../../helpers/model-helpers";
import { BuddySpeechPayload } from "../../types/interfaces";

const WAIT_TIME = 60000;
const DEEP_IDLE_WAIT_TIME = 5 * 60 * 1000;
const WINDOW_PADDING_WIDTH = 1;
const WINDOW_PADDING_HEIGHT = 7;

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

export function Clippy() {
  const {
    animationKey,
    setAnimationKey,
    status,
    setStatus,
    isStartingNewChat,
    setIsChatWindowOpen,
    isChatWindowOpen,
    addMessage,
    startNewChat,
  } = useChat();
  const { settings, models } = useSharedState();
  const { currentView, setCurrentView } = useBubbleView();
  const { enableDragDebug } = useDebugState();
  const selectedAgent = settings.selectedAgent || "Clippy";
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
  const [switchTargetAgent, setSwitchTargetAgent] = useState<string | null>(
    null,
  );
  const [buddySpeech, setBuddySpeech] = useState<BuddySpeechPayload | null>(
    null,
  );
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
  const shouldUseProcessingAnimation =
    hasShownStartupGreeting &&
    !isStartupGreetingPlaying &&
    (shouldUseChatProcessingAnimation || shouldUseBuddyProcessingAnimation);

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
    const speechPaddingWidth = buddySpeech ? 220 : 0;
    const speechPaddingHeight = buddySpeech ? 340 : 0;

    clippyApi.setMainWindowSize(
      agentPack.frameWidth + WINDOW_PADDING_WIDTH + speechPaddingWidth,
      agentPack.frameHeight + WINDOW_PADDING_HEIGHT + speechPaddingHeight,
    );
  }, [agentPack.frameHeight, agentPack.frameWidth, buddySpeech]);

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
  }, [clearCopyFeedbackTimeout, clearSpeechTimeout, scheduleBuddySpeechDismiss]);

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
        shouldUseBuddyProcessingAnimation
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
    runAnimation,
    shouldUseBuddyProcessingAnimation,
    shouldUseProcessingAnimation,
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
      {buddySpeech && (
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
