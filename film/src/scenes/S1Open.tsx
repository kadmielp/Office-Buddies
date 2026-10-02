import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Balloon, Sprite, usePop } from "../kit";
import { C } from "../theme";

const type = (text: string, frame: number, start: number, cps = 1.1) =>
  text.slice(0, Math.max(0, Math.floor((frame - start) * cps)));

export const S1Open: React.FC = () => {
  const frame = useCurrentFrame();
  const pop = usePop(0);
  const bPop = usePop(8, 14);
  const l1 = type("It looks like you're about to use AI…", frame, 10, 1.15);
  const l2 = type("in a boring chat window.", frame, 72, 1.0);
  const l3 = type("Let's fix that.", frame, 128, 0.9);
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <AbsoluteFill
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div style={{ position: "absolute", left: 560, top: 470, transform: `scale(${pop})`, transformOrigin: "50% 100%" }}>
        <Sprite agent="Clippy" anim={frame < 120 ? "RestPose" : "Thinking"} scale={4} />
      </div>
      <div style={{ position: "absolute", left: 560, bottom: 640, transform: `scale(${bPop})`, transformOrigin: "10% 100%" }}>
        <Balloon width={1100} tail="bottom-left" style={{ fontSize: 52, minHeight: 230 }}>
          <div>{l1}</div>
          <div>{l2}</div>
          <div style={{ fontWeight: 800 }}>{l3}</div>
        </Balloon>
      </div>
    </AbsoluteFill>
  );
};
