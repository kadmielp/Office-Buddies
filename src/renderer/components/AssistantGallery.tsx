import { useEffect, useMemo, useRef, useState } from "react";
import { AgentAnimation, AgentFrame, AVAILABLE_AGENTS, getAgentPack } from "../agent-packs";
import { clippyApi } from "../clippyApi";
import { useSharedState } from "../contexts/SharedStateContext";
import { useBubbleView } from "../contexts/BubbleViewContext";

type AssistantDetails = {
  displayName: string;
  speech: string;
  description: string;
};

const ASSISTANT_COPY: Record<string, AssistantDetails> = {
  Clippy: {
    displayName: "Clippit",
    speech:
      "Hey, there. Want quick answers to your questions about Office? Just click me.",
    description:
      "Though nothing more than a thin metal wire, Clippit will help find what you need and keep it all together.",
  },
  F1: {
    displayName: "F1",
    speech: "QUERY> HOW ARE YOU? STATUS= READY FOR INSTRUCTION",
    description:
      "F1 is the first of the 300/M series, built to serve. This robot is fully optimized for Office use.",
  },
  Merlin: {
    displayName: "Merlin",
    speech:
      "While a little old-fashioned, a little digital magic is always helpful.",
    description:
      "I am your wise and magical companion. When you need assistance, summon me for a demonstration of my awesome, cyber-magical powers.",
  },
  Links: {
    displayName: "Links",
    speech: "Did I see a mouse move?",
    description:
      "If you're on the prowl for answers in Office, Links can chase them down for you.",
  },
  Rocky: {
    displayName: "Rocky",
    speech: "Don't worry, I'm fully Office-trained.",
    description:
      "If you fall into a ravine, call Lassie. If you need help in Office, call Rocky.",
  },
  Bonzi: {
    displayName: "Bonzi",
    speech: "Hello there! I'm your new best friend.",
    description:
      "Bonzi is the purple gorilla who's always ready to explore the web and assist you with your daily tasks.",
  },
  Genie: {
    displayName: "Genie",
    speech: "Your wish is my command.",
    description:
      "The Genie is at your service. Whether you need a simple tip or a major project completed, he's here to grant your Office wishes.",
  },
  Genius: {
    displayName: "Genius",
    speech: "I'm here to help.",
    description:
      "The Genius will answer your questions with a smile. He's always thinking, but never too busy to help.",
  },
  Peedy: {
    displayName: "Peedy",
    speech: "I'm ready to help.",
    description:
      "Peedy is a knowledgeable fellow who can help you find your way around Office. He's also quite a singer!",
  },
  Rover: {
    displayName: "Rover",
    speech: "I'm ready to help you find what you need.",
    description:
      "Rover is the pup who loves to find things for you. He's always eager to help you fetch the right information.",
  },
};

const ASSISTANT_ORDER = [
  "Clippy",
  "F1",
  "Merlin",
  "Links",
  "Rocky",
  "Bonzi",
  "Genie",
  "Genius",
  "Peedy",
  "Rover",
];

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
    const totalWeight = branches.reduce((sum, branch) => sum + branch.weight, 0);
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

function pickPreviewAnimationKey(animations: Record<string, AgentAnimation>): string {
  const candidates = ["GetAttention", "Greeting", "Show", "Default"];
  return candidates.find((key) => animations[key]) || "Default";
}

function AssistantPreview({
  agentName,
  isSoundEnabled,
}: {
  agentName: string;
  isSoundEnabled: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const pack = getAgentPack(agentName);
    const previewAnimationKey = pickPreviewAnimationKey(pack.animations);
    const animation = pack.animations[previewAnimationKey] || pack.animations.Default;
    const canvas = canvasRef.current;

    if (!canvas || !animation || animation.frames.length === 0) {
      return;
    }

    let isDisposed = false;
    const image = new Image();

    const clearTimer = () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    };

    const drawFrame = (frame: AgentFrame) => {
      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      context.clearRect(0, 0, pack.frameWidth, pack.frameHeight);

      const mapColumns = Math.max(1, Math.floor(image.width / pack.frameWidth));
      const sources = frame.images ?? [];

      for (const imageRef of sources) {
        let sourceX = 0;
        let sourceY = 0;

        if (typeof imageRef === "number") {
          sourceX = (imageRef % mapColumns) * pack.frameWidth;
          sourceY = Math.floor(imageRef / mapColumns) * pack.frameHeight;
        } else {
          [sourceX, sourceY] = imageRef;
        }

        context.drawImage(
          image,
          sourceX,
          sourceY,
          pack.frameWidth,
          pack.frameHeight,
          0,
          0,
          pack.frameWidth,
          pack.frameHeight,
        );
      }
    };

    const playSound = (soundKey?: string) => {
      if (!isSoundEnabled) {
        return;
      }

      if (!soundKey) {
        return;
      }

      const source = pack.sounds[soundKey];

      if (!source) {
        return;
      }

      const audio = new Audio(source);
      void audio.play().catch(() => {});
    };

    let stepCount = 0;
    const maxSteps = Math.max(animation.frames.length * 4, animation.frames.length + 1);

    const tick = (frameIndex: number) => {
      if (isDisposed) {
        return;
      }

      const frame = animation.frames[frameIndex];

      if (!frame) {
        timeoutRef.current = window.setTimeout(() => tick(0), 250);
        return;
      }

      drawFrame(frame);
      playSound(frame.sound);
      stepCount += 1;
      const nextFrameIndex = getNextFrameIndex(animation, frameIndex);
      const frameTimeout = Math.max(frame.duration ?? 100, 10);

      if (
        nextFrameIndex < 0 ||
        nextFrameIndex >= animation.frames.length ||
        stepCount >= maxSteps
      ) {
        return;
      }

      timeoutRef.current = window.setTimeout(() => tick(nextFrameIndex), frameTimeout);
    };

    image.onload = () => {
      if (isDisposed) {
        return;
      }

      tick(0);
    };

    image.src = pack.mapSrc;

    return () => {
      isDisposed = true;
      clearTimer();
    };
  }, [agentName, isSoundEnabled]);

  const pack = getAgentPack(agentName);

  return (
    <canvas
      ref={canvasRef}
      width={pack.frameWidth}
      height={pack.frameHeight}
      style={{
        width: "100%",
        height: "100%",
        imageRendering: "pixelated",
      }}
      aria-label={agentName}
    />
  );
}

export function AssistantGallery() {
  const { settings } = useSharedState();
  const { setCurrentView } = useBubbleView();
  const galleryAgents = useMemo(() => {
    const available = new Set(AVAILABLE_AGENTS);
    const ordered = ASSISTANT_ORDER.filter((agent) => available.has(agent));

    for (const agent of AVAILABLE_AGENTS) {
      if (!ordered.includes(agent)) {
        ordered.push(agent);
      }
    }

    return ordered;
  }, []);
  const selectedAgent = settings.selectedAgent || "Clippy";
  const isSoundEnabled = !settings.disableSound;
  const initialIndex = Math.max(galleryAgents.indexOf(selectedAgent), 0);
  const [agentIndex, setAgentIndex] = useState(initialIndex);

  const currentAgent = galleryAgents[agentIndex] || "Clippy";
  const details = ASSISTANT_COPY[currentAgent] || {
    displayName: currentAgent,
    speech: "I'm here to help.",
    description: "This assistant is ready to help you in Office Buddies.",
  };

  const onBack = () => {
    if (agentIndex > 0) {
      setAgentIndex(agentIndex - 1);
    }
  };

  const onNext = () => {
    if (agentIndex < galleryAgents.length - 1) {
      setAgentIndex(agentIndex + 1);
    }
  };

  const onOk = () => {
    clippyApi.setState("settings.selectedAgent", currentAgent);
    setCurrentView("chat");
  };

  const onCancel = () => {
    setCurrentView("chat");
  };

  return (
    <div style={{ padding: "12px", height: "100%", boxSizing: "border-box" }}>
      <p style={{ marginTop: "0", marginBottom: "10px" }}>
        You can scroll through the different assistants by using the &lt;Back
        and Next&gt; buttons. When you are finished selecting your assistant,
        click the OK button.
      </p>

      <fieldset style={{ margin: 0 }}>
        <legend>{details.displayName}</legend>
        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "flex-start",
            minHeight: "260px",
            height: "150px",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", gap: "12px", width: "100%" }}>
            <div
              style={{
                width: "92px",
                height: "92px",
                border: "1px solid #808080",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <AssistantPreview
                agentName={currentAgent}
                isSoundEnabled={isSoundEnabled}
              />
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  border: "1px solid #808080",
                  background: "#fff",
                  minHeight: "82px",
                  padding: "10px",
                  marginBottom: "12px",
                }}
              >
                {details.speech}
              </div>
              <div style={{ minHeight: "72px" }}>{details.description}</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              marginTop: "auto",
            }}
          >
            <button onClick={onBack} disabled={agentIndex <= 0}>
              &lt; Back
            </button>
            <button
              onClick={onNext}
              disabled={agentIndex >= galleryAgents.length - 1}
              style={{ marginLeft: "8px" }}
            >
              Next &gt;
            </button>
          </div>
        </div>
      </fieldset>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "18px" }}>
        <button onClick={onOk} style={{ minWidth: "70px" }}>
          OK
        </button>
        <button onClick={onCancel} style={{ minWidth: "70px", marginLeft: "8px" }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
