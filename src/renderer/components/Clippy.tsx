import { useEffect, useState, useCallback, useMemo, useRef } from "react";

import {
  getAgentPack,
  getChatAnimationKeys,
  getAnimationDuration,
  getIdleAnimationKeys,
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

const WAIT_TIME = 60000;
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

export function Clippy() {
  const {
    animationKey,
    setAnimationKey,
    status,
    setStatus,
    setIsChatWindowOpen,
    isChatWindowOpen,
  } = useChat();
  const { settings } = useSharedState();
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
  const activeAnimationRef = useRef<string>("Default");
  const hasPlayedWelcomeRef = useRef<boolean>(false);

  const [isSpriteReady, setIsSpriteReady] = useState(false);
  const [displayedAgent, setDisplayedAgent] = useState<string>(selectedAgent);
  const [manualAnimationKey, setManualAnimationKey] = useState<string | null>(
    null,
  );
  const [switchTargetAgent, setSwitchTargetAgent] = useState<string | null>(
    null,
  );
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
    clippyApi.setMainWindowSize(
      agentPack.frameWidth + WINDOW_PADDING_WIDTH,
      agentPack.frameHeight + WINDOW_PADDING_HEIGHT,
    );
  }, [agentPack.frameHeight, agentPack.frameWidth]);

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

    if (manualAnimationKey || isAgentSwitchAnimating) {
      return;
    }

    const playRandomIdleAnimation = () => {
      if (status !== "idle") {
        return;
      }

      const idleAnimationKeys = getIdleAnimationKeys(agentPack);

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

    if (status === "welcome" && !hasPlayedWelcomeRef.current) {
      hasPlayedWelcomeRef.current = true;

      const welcomeAnimationKey =
        findFirstAnimationKey(agentPack.animations, ["Greeting", "Show"]) ??
        "Default";

      runAnimation(welcomeAnimationKey, () => {
        setStatus("idle");
      });
    } else if (status === "idle") {
      playRandomIdleAnimation();
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
  ]);

  useEffect(() => {
    if (!animationKey || manualAnimationKey || isAgentSwitchAnimating) {
      return;
    }

    log("New animation key", { animationKey });
    playAnimation(animationKey, () => {
      setAnimationKey("");
    });
  }, [
    animationKey,
    isAgentSwitchAnimating,
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
