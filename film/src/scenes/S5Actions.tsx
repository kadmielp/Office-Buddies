import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Balloon, Body, Headline, Sprite, Tag, usePop } from "../kit";
import { C, FONT, SAFE } from "../theme";

const KEYS = [
  { k: "Win + F2", t: "Define", at: 55 },
  { k: "Win + F3", t: "Summarize", at: 80 },
  { k: "Win + F4", t: "Explain like I'm 5", at: 105 },
  { k: "Win + F5", t: "Rewrite, friendlier", at: 130 },
];

export const S5Actions: React.FC = () => {
  const frame = useCurrentFrame();
  const doc = usePop(2, 16);
  const sel = interpolate(frame, [15, 45], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bal = usePop(165, 12);
  const clip = usePop(150, 10);
  return (
    <AbsoluteFill style={{ background: C.teal }}>
      <div style={{ position: "absolute", left: SAFE, top: 120, width: 860, transform: `scale(${doc})`, transformOrigin: "0 0" }}>
        <div style={{ background: C.white, borderRadius: 14, padding: "48px 52px", fontFamily: FONT, color: C.ink, fontSize: 44, lineHeight: 1.5, boxShadow: "0 24px 60px rgba(0,0,0,.35)" }}>
          The best discoveries are often a happy accident, pure{" "}
          <span style={{ position: "relative", display: "inline-block", fontWeight: 700 }}>
            <span style={{ position: "absolute", left: 0, top: 4, bottom: 4, width: `${sel}%`, background: "#A8D1FF", zIndex: 0 }} />
            <span style={{ position: "relative", zIndex: 1 }}>serendipity</span>
          </span>
          .
        </div>
      </div>
      <div style={{ position: "absolute", left: 1040, top: 110, display: "flex", flexDirection: "column", gap: 22 }}>
        <Headline size={96}>One shortcut.</Headline>
        {KEYS.map((k) => (
          <KeyRow key={k.k} {...k} />
        ))}
      </div>
      <div style={{ position: "absolute", left: SAFE, top: 470, transform: `scale(${bal})`, transformOrigin: "10% 100%" }}>
        <Balloon width={600} tail="bottom-left" style={{ fontSize: 36 }}>
          <b>serendipity</b>: finding something good by chance.
        </Balloon>
      </div>
      <div style={{ position: "absolute", left: SAFE + 20, bottom: 40, transform: `scale(${clip})`, transformOrigin: "50% 100%" }}>
        <Sprite agent="Clippy" anim="Explain" scale={2.6} />
      </div>
      <div style={{ position: "absolute", right: SAFE, bottom: 60 }}>
        <Body size={26} color="rgba(255,255,255,.85)">Illustrative recreation of the on-screen flow</Body>
      </div>
    </AbsoluteFill>
  );
};

const KeyRow: React.FC<{ k: string; t: string; at: number }> = ({ k, t, at }) => {
  const p = usePop(at, 11);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, transform: `translateX(${(1 - p) * 120}px)`, opacity: p }}>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, background: C.paper, color: C.ink, border: `4px solid ${C.ink}`, borderBottomWidth: 9, borderRadius: 14, padding: "8px 24px", minWidth: 230, textAlign: "center" }}>{k}</div>
      <Tag bg="transparent" fg={C.white} style={{ fontSize: 48, padding: 0 }}>{t}</Tag>
    </div>
  );
};
