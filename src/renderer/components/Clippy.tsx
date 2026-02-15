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

const WAIT_TIME = 6000;
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
    const totalWeight = branches.reduce(
      (sum, branch) => sum + branch.weight,
      0,
    );
    const random = Math.random() * totalWeight;
    let cumulative = 0;

    for (const branch of branches) {
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

export function Clippy() {
  const {
    animationKey,
    status,
    setStatus,
    setIsChatWindowOpen,
    isChatWindowOpen,
  } = useChat();
  const { settings } = useSharedState();
  const { enableDragDebug } = useDebugState();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const spriteImageRef = useRef<HTMLImageElement | null>(null);
  const frameTimeoutRef = useRef<number | undefined>(undefined);
  const defaultTimeoutRef = useRef<number | undefined>(undefined);
  const idleTimeoutRef = useRef<number | undefined>(undefined);
  const manualOnceTimeoutRef = useRef<number | undefined>(undefined);
  const activeAnimationRef = useRef<string>("Default");
  const hasPlayedWelcomeRef = useRef<boolean>(false);

  const [isSpriteReady, setIsSpriteReady] = useState(false);
  const [manualAnimationKey, setManualAnimationKey] = useState<string | null>(
    null,
  );

  const agentPack = useMemo(
    () => getAgentPack(settings.selectedAgent),
    [settings.selectedAgent],
  );
  const contextMenuAnimations = useMemo(
    () => getChatAnimationKeys(settings.selectedAgent),
    [settings.selectedAgent],
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

  const clearManualOnceTimeout = useCallback(() => {
    if (manualOnceTimeoutRef.current) {
      window.clearTimeout(manualOnceTimeoutRef.current);
      manualOnceTimeoutRef.current = undefined;
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

      for (const [sourceX, sourceY] of frame.images ?? []) {
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
    [agentPack.sounds],
  );

  const runAnimation = useCallback(
    (key: string) => {
      if (!isSpriteReady || !agentPack.animations[key]) {
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
    (key: string) => {
      if (isDisallowedChatAnimationKey(key)) {
        log("Blocked disallowed animation", { key, agent: agentPack.name });
        runAnimation("Default");
        return;
      }

      if (!agentPack.animations[key]) {
        log("Animation not found", { key, agent: agentPack.name });
        return;
      }

      log("Playing animation", { key, agent: agentPack.name });
      clearDefaultTimeout();
      runAnimation(key);

      defaultTimeoutRef.current = window.setTimeout(
        () => {
          runAnimation("Default");
        },
        getAnimationDuration(agentPack, key) + 200,
      );
    },
    [agentPack, clearDefaultTimeout, runAnimation],
  );

  const toggleChat = useCallback(() => {
    setIsChatWindowOpen(!isChatWindowOpen);
  }, [isChatWindowOpen, setIsChatWindowOpen]);

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
    clearManualOnceTimeout();
    playAnimation(manualAnimationKey);
    manualOnceTimeoutRef.current = window.setTimeout(() => {
      setManualAnimationKey(null);
    }, Math.max(getAnimationDuration(agentPack, manualAnimationKey) + 250, 300));

    return () => {
      clearManualOnceTimeout();
    };
  }, [
    agentPack,
    clearIdleTimeout,
    clearManualOnceTimeout,
    playAnimation,
    setManualAnimationKey,
    isSpriteReady,
    manualAnimationKey,
  ]);

  useEffect(() => {
    if (!isSpriteReady) {
      return;
    }

    if (manualAnimationKey) {
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

      runAnimation(randomIdleAnimationKey);

      idleTimeoutRef.current = window.setTimeout(
        () => {
          runAnimation("Default");
          idleTimeoutRef.current = window.setTimeout(
            playRandomIdleAnimation,
            WAIT_TIME,
          );
        },
        getAnimationDuration(agentPack, randomIdleAnimationKey),
      );
    };

    if (status === "welcome" && !hasPlayedWelcomeRef.current) {
      hasPlayedWelcomeRef.current = true;

      const welcomeAnimationKey = agentPack.animations.Show
        ? "Show"
        : "Default";

      runAnimation(welcomeAnimationKey);
      defaultTimeoutRef.current = window.setTimeout(
        () => {
          setStatus("idle");
        },
        getAnimationDuration(agentPack, welcomeAnimationKey) + 200,
      );
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
  ]);

  useEffect(() => {
    if (!animationKey || manualAnimationKey) {
      return;
    }

    log("New animation key", { animationKey });
    playAnimation(animationKey);
  }, [animationKey, manualAnimationKey, playAnimation]);

  return (
    <div style={{ position: "relative" }}>
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
