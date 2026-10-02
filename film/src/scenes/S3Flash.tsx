import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Headline, Sprite, usePop, useBeat } from "../kit";
import { C, FLASH } from "../theme";

const SPRITES = [
  { agent: "Rover", anim: "Thinking" },
  { agent: "Merlin", anim: "Thinking" },
  { agent: "Clippy", anim: "Wave" },
  { agent: "Bonzi", anim: "Congratulate" },
];

export const S3Flash: React.FC = () => {
  const frame = useCurrentFrame();
  let idx = -1;
  FLASH.forEach((f, i) => { if (frame >= f.at) idx = i; });
  const cur = FLASH[Math.max(0, idx)];
  const at = idx < 0 ? 0 : FLASH[idx].at;
  const pop = usePop(at, 9);
  const beat = useBeat(0.03);
  const sp = SPRITES[Math.max(0, idx)];
  return (
    <AbsoluteFill style={{ background: cur.bg, alignItems: "center", justifyContent: "center" }}>
      {idx >= 0 && (
        <div style={{ transform: `scale(${(0.7 + 0.3 * pop) * beat})` }}>
          <Headline size={330} color={cur.fg} style={{ textAlign: "center" }}>{cur.word}</Headline>
        </div>
      )}
      {idx >= 0 && (
        <div style={{ position: "absolute", right: 120, bottom: 70, opacity: pop }}>
          <Sprite agent={sp.agent} anim={sp.anim} scale={sp.agent === "Rover" ? 3 : 2.4} />
        </div>
      )}
      <div style={{ position: "absolute", left: 96, bottom: 70, width: 180, height: 14, background: cur.fg === C.white ? "rgba(255,255,255,.4)" : "rgba(0,0,0,.25)", borderRadius: 7 }}>
        <div style={{ width: `${((idx + 1) / FLASH.length) * 100}%`, height: "100%", background: cur.fg, borderRadius: 7 }} />
      </div>
    </AbsoluteFill>
  );
};
