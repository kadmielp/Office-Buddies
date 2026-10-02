import React from "react";
import { AbsoluteFill } from "remotion";
import { Headline, Shot, Sprite, Tag, usePop } from "../kit";
import { C, SAFE } from "../theme";

const ERAS = [
  { chat: "win98-chat.png", balloon: "win98-balloon.png", label: "Windows 98", at: 12 },
  { chat: "xp-chat.png", balloon: "xp-balloon.png", label: "Windows XP", at: 57 },
  { chat: "chat-win11.png", balloon: "balloon-question.png", label: "Windows 11", at: 84 },
];

export const S7Themes: React.FC = () => {
  const head = usePop(0, 14);
  const clip = usePop(156, 10);
  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <div style={{ position: "absolute", left: SAFE, top: 70, opacity: head }}>
        <Headline size={110} color={C.ink}>Pick your era.</Headline>
      </div>
      <div style={{ position: "absolute", left: SAFE, right: SAFE, top: 240, display: "flex", justifyContent: "space-between" }}>
        {ERAS.map((e) => (
          <Era key={e.label} {...e} />
        ))}
      </div>
      <div style={{ position: "absolute", right: SAFE, top: 40, transform: `scale(${clip})`, transformOrigin: "50% 100%" }}>
        <Sprite agent="Merlin" anim="Greet" scale={1.6} />
      </div>
    </AbsoluteFill>
  );
};

const Era: React.FC<{ chat: string; balloon: string; label: string; at: number }> = ({ chat, balloon, label, at }) => {
  const p = usePop(at, 13);
  const b = usePop(at + 8, 12);
  return (
    <div style={{ position: "relative", width: 520, height: 700, transform: `translateY(${(1 - p) * 260}px)`, opacity: p }}>
      <Shot src={chat} width={420} style={{ borderRadius: 6 }} />
      <div style={{ position: "absolute", right: -10, bottom: 70, transform: `scale(${b})`, transformOrigin: "100% 100%" }}>
        <Shot src={balloon} width={300} style={{ borderRadius: 12 }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", justifyContent: "center" }}>
        <Tag bg={C.ink} fg={C.white} style={{ fontSize: 40 }}>{label}</Tag>
      </div>
    </div>
  );
};
