import React from "react";
import { AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SCENES, TRANSITION } from "./theme";
import { S1Open } from "./scenes/S1Open";
import { S2Promise } from "./scenes/S2Promise";
import { S3Flash } from "./scenes/S3Flash";
import { S4Models } from "./scenes/S4Models";
import { S5Actions } from "./scenes/S5Actions";
import { S6Agents } from "./scenes/S6Agents";
import { S7Themes } from "./scenes/S7Themes";
import { S8Close } from "./scenes/S8Close";

type Reveal = "circle-left" | "wipe-left" | "diagonal" | "rise" | "portal" | "wipe-right" | "circle-right";

// Entry transition of each scene: a mask that grows over the previous one.
const clip = (kind: Reveal, p: number): string => {
  switch (kind) {
    case "circle-left": return `circle(${p * 150}% at 30% 60%)`;
    case "circle-right": return `circle(${p * 150}% at 85% 40%)`;
    case "portal": return `circle(${p * 110}% at 50% 50%)`;
    case "wipe-left": return `inset(0 ${(1 - p) * 100}% 0 0)`;
    case "wipe-right": return `inset(0 0 0 ${(1 - p) * 100}%)`;
    case "rise": return `inset(${(1 - p) * 100}% 0 0 0)`;
    case "diagonal": return `polygon(0 0, ${p * 200}% 0, ${p * 200 - 100}% 100%, 0 100%)`;
  }
};

const Entry: React.FC<{ kind?: Reveal; children: React.ReactNode }> = ({ kind, children }) => {
  const frame = useCurrentFrame();
  if (!kind) return <>{children}</>;
  const p = interpolate(frame, [0, TRANSITION], [0, 1], { extrapolateRight: "clamp", easing: Easing.bezier(0.7, 0, 0.2, 1) });
  return <AbsoluteFill style={{ clipPath: p >= 1 ? undefined : clip(kind, p) }}>{children}</AbsoluteFill>;
};

const LIST: { key: keyof typeof SCENES; C: React.FC; kind?: Reveal }[] = [
  { key: "s1", C: S1Open },
  { key: "s2", C: S2Promise, kind: "circle-left" },
  { key: "s3", C: S3Flash, kind: "wipe-left" },
  { key: "s4", C: S4Models, kind: "diagonal" },
  { key: "s5", C: S5Actions, kind: "rise" },
  { key: "s6", C: S6Agents, kind: "portal" },
  { key: "s7", C: S7Themes, kind: "wipe-right" },
  { key: "s8", C: S8Close, kind: "circle-right" },
];

export const Film: React.FC<{ withAudio?: boolean }> = ({ withAudio = false }) => (
  <AbsoluteFill style={{ background: "#000" }}>
    {LIST.map(({ key, C, kind }, i) => {
      const s = SCENES[key];
      const extra = i < LIST.length - 1 ? TRANSITION : 0; // previous scene stays under the next one's reveal
      return (
        <Sequence key={key} from={s.from} durationInFrames={s.len + extra} layout="none">
          <Sequence from={0} durationInFrames={s.len + extra}>
            <Entry kind={kind}><C /></Entry>
          </Sequence>
        </Sequence>
      );
    })}
    {withAudio && <Audio src={staticFile("mix.wav")} />}
  </AbsoluteFill>
);
