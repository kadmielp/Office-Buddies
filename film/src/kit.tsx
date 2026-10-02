import React from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { BEAT, C, DISPLAY, FONT, FPS } from "./theme";
import Clippy from "./data/Clippy.json";
import Merlin from "./data/Merlin.json";
import Bonzi from "./data/Bonzi.json";
import Genie from "./data/Genie.json";
import Peedy from "./data/Peedy.json";
import Rover from "./data/Rover.json";
import Rocky from "./data/Rocky.json";
import F1 from "./data/F1.json";
import Links from "./data/Links.json";
import Genius from "./data/Genius.json";

type AgentData = {
  framesize: number[];
  sheet: number[];
  animations: Record<string, { d: number; i: number[] | null }[]>;
};
export const AGENTS: Record<string, AgentData> = {
  Clippy, Merlin, Bonzi, Genie, Peedy, Rover, Rocky, F1, Links, Genius,
} as unknown as Record<string, AgentData>;

// Plays an assistant animation straight from the app's own sprite data.
export const Sprite: React.FC<{
  agent: string;
  anim?: string;
  scale?: number;
  offset?: number; // frames to shift the animation
  style?: React.CSSProperties;
}> = ({ agent, anim = "RestPose", scale = 2, offset = 0, style }) => {
  const frame = useCurrentFrame();
  const data = AGENTS[agent];
  const frames = data.animations[anim] ?? data.animations.RestPose;
  const total = frames.reduce((s, f) => s + f.d, 0) || 1;
  let t = (((frame + offset) / FPS) * 1000) % total;
  let cur = frames[0];
  for (const f of frames) {
    if (t < f.d) { cur = f; break; }
    t -= f.d;
  }
  const [fw, fh] = data.framesize;
  const [x, y] = cur.i ?? [0, 0];
  return (
    <div
      style={{
        width: fw * scale,
        height: fh * scale,
        backgroundImage: `url(${staticFile(`agents/${agent}.png`)})`,
        backgroundSize: `${data.sheet[0] * scale}px ${data.sheet[1] * scale}px`,
        backgroundPosition: `${-x * scale}px ${-y * scale}px`,
        imageRendering: "auto",
        ...style,
      }}
    />
  );
};

// Pulse that fires on every beat (120 BPM).
export const useBeat = (amount = 0.04) => {
  const frame = useCurrentFrame();
  const p = (frame % BEAT) / BEAT;
  return 1 + amount * Math.pow(1 - p, 3);
};

export const usePop = (delay = 0, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness: 140 } });
};

export const fade = (frame: number, from: number, dur = 9) =>
  interpolate(frame, [from, from + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const ease = Easing.bezier(0.2, 0.8, 0.2, 1);

export const Headline: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, color = C.white, size = 120, style }) => (
  <div style={{ fontFamily: DISPLAY, fontSize: size, lineHeight: 1.02, color, letterSpacing: -1, ...style }}>{children}</div>
);

export const Body: React.FC<{ children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties }> = ({
  children, color = C.white, size = 40, style,
}) => <div style={{ fontFamily: FONT, fontSize: size, lineHeight: 1.3, color, ...style }}>{children}</div>;

// Classic Office Assistant speech balloon.
export const Balloon: React.FC<{ children: React.ReactNode; width?: number; style?: React.CSSProperties; tail?: "bottom-right" | "bottom-left" }> = ({
  children, width = 560, style, tail = "bottom-right",
}) => (
  <div
    style={{
      position: "relative", width, background: C.paper, color: C.ink, fontFamily: FONT, fontSize: 38, lineHeight: 1.25,
      border: `4px solid ${C.ink}`, borderRadius: 22, padding: "26px 32px", boxShadow: "10px 10px 0 rgba(0,0,0,.35)", ...style,
    }}
  >
    {children}
    <div
      style={{
        position: "absolute", bottom: -34, [tail === "bottom-right" ? "right" : "left"]: 70, width: 0, height: 0,
        borderLeft: "22px solid transparent", borderRight: "22px solid transparent", borderTop: `34px solid ${C.ink}`,
      }}
    />
    <div
      style={{
        position: "absolute", bottom: -24, [tail === "bottom-right" ? "right" : "left"]: 74, width: 0, height: 0,
        borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: `28px solid ${C.paper}`,
      }}
    />
  </div>
);

export const Shot: React.FC<{ src: string; width: number; style?: React.CSSProperties }> = ({ src, width, style }) => (
  <Img
    src={staticFile(`screens/${src}`)}
    style={{ width, borderRadius: 14, boxShadow: "0 24px 60px rgba(0,0,0,.45)", ...style }}
  />
);

export const Tag: React.FC<{ children: React.ReactNode; bg?: string; fg?: string; style?: React.CSSProperties }> = ({
  children, bg = C.white, fg = C.ink, style,
}) => (
  <div style={{ background: bg, color: fg, fontFamily: FONT, fontWeight: 700, fontSize: 34, padding: "10px 24px", borderRadius: 999, ...style }}>
    {children}
  </div>
);
