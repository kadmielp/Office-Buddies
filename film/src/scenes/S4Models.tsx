import React from "react";
import { AbsoluteFill } from "remotion";
import { Headline, Shot, Sprite, Tag, usePop, useBeat } from "../kit";
import { C, SAFE } from "../theme";

const REMOTE = [
  { n: "OpenAI", at: 78 },
  { n: "Google", at: 93 },
  { n: "Maritaca", at: 108 },
  { n: "OpenClaw", at: 123 },
  { n: "Hermes", at: 138 },
];

export const S4Models: React.FC = () => {
  const shot = usePop(4, 16);
  const head = usePop(10, 14);
  const local = usePop(24, 12);
  const clip = usePop(165, 10);
  const beat = useBeat(0.02);
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <div style={{ position: "absolute", left: SAFE, top: 62, transform: `translateX(${(1 - shot) * -200}px)`, opacity: shot }}>
        <Shot src="settings-model.png" width={740} />
      </div>
      <div style={{ position: "absolute", left: 900, top: 130, opacity: head, transform: `scale(${beat})`, transformOrigin: "0 50%" }}>
        <Headline size={130} color={C.ink}>Pick your</Headline>
        <Headline size={130} color={C.violet}>brain.</Headline>
      </div>
      <div style={{ position: "absolute", left: 900, top: 500, transform: `scale(${local})`, transformOrigin: "0 50%" }}>
        <Tag bg={C.teal} fg={C.white} style={{ fontSize: 40 }}>On your machine · Local GGUF</Tag>
      </div>
      <div style={{ position: "absolute", left: 900, top: 620, display: "flex", flexWrap: "wrap", gap: 18, width: 900 }}>
        {REMOTE.map((r) => (
          <Chip key={r.n} at={r.at}>{r.n}</Chip>
        ))}
      </div>
      <div style={{ position: "absolute", right: 120, bottom: 70, transform: `scale(${clip})`, transformOrigin: "50% 100%" }}>
        <Sprite agent="Clippy" anim="Thinking" scale={2.4} />
      </div>
    </AbsoluteFill>
  );
};

const Chip: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const p = usePop(at, 10);
  return (
    <div style={{ transform: `scale(${p})` }}>
      <Tag bg={C.ink} fg={C.white} style={{ fontSize: 40 }}>{children}</Tag>
    </div>
  );
};
