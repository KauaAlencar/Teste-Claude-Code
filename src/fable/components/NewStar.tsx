import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, starPath, useSvgId } from "../theme";

// The star from the horse's forehead, which becomes a star in the sky.
export const NewStar: React.FC<{
  x: number;
  y: number;
  size?: number;
  glow?: number;
  rays?: number;
  rotation?: number;
}> = ({ x, y, size = 16, glow = 1, rays = 0, rotation = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const id = useSvgId("new-star");
  const twinkle = 0.5 + 0.5 * Math.sin((frame / fps) * Math.PI * 2 * 0.7);
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor="#FFF6D8" stopOpacity={0.9} />
          <stop offset="35%" stopColor="#FFE6A8" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#FFE6A8" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle r={size * (4.5 + twinkle)} fill={`url(#${id})`} opacity={glow} />
      {rays > 0 ? (
        <g stroke="#FFF6D8" strokeLinecap="round" opacity={rays * (0.6 + 0.4 * twinkle)}>
          <line x1={-size * 4} x2={size * 4} y1={0} y2={0} strokeWidth={3} />
          <line y1={-size * 4} y2={size * 4} x1={0} x2={0} strokeWidth={3} />
        </g>
      ) : null}
      <path
        d={starPath(size, size * 0.46)}
        transform={`rotate(${rotation})`}
        fill={COLORS.star}
        stroke={COLORS.star}
        strokeWidth={size * 0.22}
        strokeLinejoin="round"
      />
    </g>
  );
};
