import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS } from "../theme";

// Arcs that travel from the reader's head towards the target's head.
export const MindWaves: React.FC<{
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  intensity: number;
  reach?: number;
  count?: number;
}> = ({ fromX, fromY, toX, toY, intensity, reach = 1, count = 4 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (intensity <= 0) {
    return null;
  }
  const dx = toX - fromX;
  const dy = toY - fromY;
  const dist = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const start = 70;
  const end = Math.max(start + 1, (dist - 60) * reach);
  const t = frame / fps;
  return (
    <g transform={`translate(${fromX} ${fromY}) rotate(${angle})`} fill="none" strokeLinecap="round">
      {Array.from({ length: count }, (_, k) => {
        const u = (t * 0.85 + k / count) % 1;
        const px = start + (end - start) * u;
        const r = 26 + 38 * u;
        const a = (52 * Math.PI) / 180;
        const d = `M ${px + r * Math.cos(-a) - r} ${r * Math.sin(-a)} A ${r} ${r} 0 0 1 ${px + r * Math.cos(a) - r} ${r * Math.sin(a)}`;
        const o = intensity * Math.sin(Math.PI * u);
        return (
          <g key={k} opacity={o}>
            <path d={d} stroke={COLORS.glow} strokeWidth={12} opacity={0.45} />
            <path d={d} stroke="#D6F3FF" strokeWidth={5} />
          </g>
        );
      })}
    </g>
  );
};
