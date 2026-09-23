import React from "react";
import { COLORS } from "../theme";

// The hole is drawn in two layers: the dark opening behind the character,
// and the ground in front of it, whose top edge follows the hole's near lip.
export const HoleBack: React.FC<{ x: number; y: number; rx: number; ry: number }> = ({
  x,
  y,
  rx,
  ry,
}) => (
  <g>
    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={COLORS.dirt} stroke={COLORS.outline} strokeWidth={6} />
    <ellipse cx={x} cy={y + ry * 0.28} rx={rx * 0.93} ry={ry * 0.74} fill="#1C110B" />
  </g>
);

export const GroundFront: React.FC<{
  x: number;
  y: number;
  rx: number;
  ry: number;
  fill: string;
  lip?: boolean;
}> = ({ x, y, rx, ry, fill, lip = true }) => (
  <g>
    <path
      d={`M -300 ${y} L ${x - rx} ${y} A ${rx} ${ry} 0 0 0 ${x + rx} ${y} L 2220 ${y} L 2220 1500 L -300 1500 Z`}
      fill={fill}
    />
    {lip ? (
      <path
        d={`M ${x - rx} ${y} A ${rx} ${ry} 0 0 0 ${x + rx} ${y}`}
        fill="none"
        stroke={COLORS.outline}
        strokeWidth={6}
      />
    ) : null}
  </g>
);

export const HoleCover: React.FC<{
  x: number;
  y: number;
  rx: number;
  ry: number;
  fill: string;
  crack: number;
  opacity?: number;
}> = ({ x, y, rx, ry, fill, crack, opacity = 1 }) => (
  <g opacity={opacity}>
    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={fill} />
    <g
      stroke={COLORS.outline}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity={crack}
    >
      <path d={`M ${x - rx * 0.7} ${y - 4} l 60 12 l 40 -14 l 70 10 l 50 -8`} />
      <path d={`M ${x - rx * 0.1} ${y - ry * 0.6} l 20 20 l -14 18 l 18 22`} />
      <path d={`M ${x + rx * 0.3} ${y + ry * 0.5} l 30 -16 l 40 6`} />
    </g>
  </g>
);

export const Branches: React.FC<{ x: number; y: number; scale?: number; opacity?: number }> = ({
  x,
  y,
  scale = 1,
  opacity = 1,
}) => (
  <g
    transform={`translate(${x} ${y}) scale(${scale})`}
    opacity={opacity}
    stroke={COLORS.outline}
    strokeWidth={5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M -190 -6 L 170 10" stroke={COLORS.woodDark} strokeWidth={14} />
    <path d="M -160 16 L 190 -14" stroke={COLORS.woodDark} strokeWidth={12} />
    {[-150, -90, -30, 30, 90, 150].map((px, i) => (
      <ellipse
        key={px}
        cx={px}
        cy={i % 2 === 0 ? -10 : 8}
        rx={42}
        ry={20}
        fill={i % 2 === 0 ? COLORS.treeLeaf : COLORS.treeLeafDark}
        transform={`rotate(${i % 2 === 0 ? -14 : 12} ${px} ${i % 2 === 0 ? -10 : 8})`}
      />
    ))}
  </g>
);
