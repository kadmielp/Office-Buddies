import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Headline, Shot, Tag, usePop, useBeat } from "../kit";
import { C, SAFE } from "../theme";

const S = 640 / 410;

const Highlight: React.FC<{ y: number; at: number }> = ({ y, at }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 6, at + 30], [0, 1, 0.55], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 40 * S, width: 330 * S, top: y * S, height: 30 * S, border: `5px solid ${C.paper}`, borderRadius: 10, background: "rgba(255,255,192,.18)", opacity: o }} />
  );
};

export const S6Agents: React.FC = () => {
  const frame = useCurrentFrame();
  const q = usePop(20, 14);
  const p = usePop(195, 14);
  const h = usePop(8, 14);
  const beat = useBeat(0.02);
  const showPerm = frame >= 195;
  return (
    <AbsoluteFill style={{ background: C.ink }}>
      <div style={{ position: "absolute", left: SAFE + 20, top: 150, width: 640, height: 640 }}>
        {!showPerm && (
          <div style={{ position: "relative", transform: `scale(${q})`, transformOrigin: "50% 100%" }}>
            <Shot src="balloon-question.png" width={640} style={{ borderRadius: 22 }} />
            <Highlight y={160} at={165} />
          </div>
        )}
        {showPerm && (
          <div style={{ position: "relative", transform: `scale(${p})`, transformOrigin: "50% 100%" }}>
            <Shot src="balloon-permission.png" width={640} style={{ borderRadius: 22 }} />
            <Highlight y={173} at={245} />
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 900, top: 150, transform: `scale(${beat})`, transformOrigin: "0 50%", opacity: h }}>
        <Headline size={110}>When your agent</Headline>
        <Headline size={110} color={C.paper}>needs you,</Headline>
        <Headline size={110}>your buddy knows.</Headline>
      </div>
      <div style={{ position: "absolute", left: 900, top: 650, display: "flex", gap: 20, flexWrap: "wrap", width: 920 }}>
        <Pill at={14}>Claude Code</Pill>
        <Pill at={50}>Codex</Pill>
        <Pill at={110} bg={C.violet} fg={C.white}>Any tool · tiny JSON</Pill>
      </div>
      <div style={{ position: "absolute", left: 900, top: 800 }}>
        <Pill at={150} bg={C.teal} fg={C.white}>Answer</Pill>
      </div>
      <div style={{ position: "absolute", left: 1130, top: 800 }}>
        <Pill at={200} bg={C.teal} fg={C.white}>Allow / Deny</Pill>
      </div>
      <div style={{ position: "absolute", left: 900, top: 890 }}>
        <Pill at={255} bg={C.paper} fg={C.ink}>from the balloon</Pill>
      </div>
    </AbsoluteFill>
  );
};

const Pill: React.FC<{ at: number; bg?: string; fg?: string; children: React.ReactNode }> = ({ at, bg = C.white, fg = C.ink, children }) => {
  const p = usePop(at, 11);
  return (
    <div style={{ transform: `scale(${p})`, transformOrigin: "0 50%" }}>
      <Tag bg={bg} fg={fg} style={{ fontSize: 40 }}>{children}</Tag>
    </div>
  );
};
