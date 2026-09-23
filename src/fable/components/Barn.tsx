import React from "react";
import { COLORS, SERIF } from "../theme";

export const Barn: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => {
  const roof = "M -300 -292 L -228 -440 L 0 -520 L 228 -440 L 300 -292";
  return (
    <g
      transform={`translate(${x} ${y}) scale(${scale})`}
      stroke={COLORS.outline}
      strokeWidth={6}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      <path
        d="M -260 0 L -260 -306 L -206 -432 L 0 -504 L 206 -432 L 260 -306 L 260 0 Z"
        fill={COLORS.barnRed}
      />
      <g stroke={COLORS.barnRedDark} strokeWidth={5}>
        {[-208, -156, -104, 104, 156, 208].map((px) => (
          <line key={px} x1={px} x2={px} y1={px === -208 || px === 208 ? -330 : -380} y2={-8} />
        ))}
      </g>
      <path d={roof} fill="none" strokeWidth={48} />
      <path d={roof} fill="none" stroke={COLORS.barnRoof} strokeWidth={36} />
      {/* Hayloft door */}
      <rect x={-58} y={-448} width={116} height={100} rx={8} fill={COLORS.barnRedDark} />
      <path d="M -52 -442 L 52 -354 M 52 -442 L -52 -354" stroke={COLORS.trim} strokeWidth={9} />
      <rect x={-58} y={-448} width={116} height={100} rx={8} fill="none" stroke={COLORS.trim} strokeWidth={11} />
      {/* Main doors */}
      <rect x={-124} y={-236} width={248} height={236} rx={6} fill={COLORS.barnRedDark} />
      <path
        d="M -118 -230 L -4 -6 M -4 -230 L -118 -6 M 118 -230 L 4 -6 M 4 -230 L 118 -6"
        stroke={COLORS.trim}
        strokeWidth={10}
      />
      <path d="M 0 -236 L 0 0" stroke={COLORS.trim} strokeWidth={10} />
      <rect x={-124} y={-236} width={248} height={236} rx={6} fill="none" stroke={COLORS.trim} strokeWidth={13} />
      {/* Corner trims */}
      <path d="M -254 -300 L -254 -4 M 254 -300 L 254 -4" stroke={COLORS.trim} strokeWidth={12} />
    </g>
  );
};

// Lean-to stable. Origin: bottom-left corner on the ground.
export const StableBack: React.FC<{ x: number; y: number; width: number; scale?: number }> = ({
  x,
  y,
  width,
  scale = 1,
}) => (
  <g
    transform={`translate(${x} ${y}) scale(${scale})`}
    stroke={COLORS.outline}
    strokeWidth={6}
    strokeLinejoin="round"
  >
    <rect x={0} y={-282} width={width} height={282} fill="#5E3B28" />
    <g stroke="#4B2E1F" strokeWidth={4}>
      {[-240, -190, -140, -90].map((py) => (
        <line key={py} x1={6} x2={width - 6} y1={py} y2={py} />
      ))}
    </g>
    <rect x={0} y={-34} width={width} height={34} fill={COLORS.hay} />
    <g stroke={COLORS.hayDark} strokeWidth={4} strokeLinecap="round">
      {Array.from({ length: Math.floor(width / 38) }, (_, i) => (
        <path key={i} d={`M ${20 + i * 38} -8 l 10 -18 M ${34 + i * 38} -6 l -6 -20`} />
      ))}
    </g>
  </g>
);

export const StableFront: React.FC<{ x: number; y: number; width: number; scale?: number }> = ({
  x,
  y,
  width,
  scale = 1,
}) => (
  <g
    transform={`translate(${x} ${y}) scale(${scale})`}
    stroke={COLORS.outline}
    strokeWidth={6}
    strokeLinejoin="round"
  >
    <rect x={width - 34} y={-300} width={30} height={306} rx={10} fill={COLORS.woodLight} />
    <rect x={width * 0.5 - 15} y={-300} width={30} height={306} rx={10} fill={COLORS.woodLight} />
    <rect x={-8} y={-118} width={width + 8} height={22} rx={10} fill={COLORS.woodLight} />
    <rect x={-8} y={-66} width={width + 8} height={22} rx={10} fill={COLORS.woodLight} />
    <path
      d={`M -16 -322 L ${width + 60} -262 L ${width + 60} -226 L -16 -286 Z`}
      fill={COLORS.barnRoof}
    />
  </g>
);

export const Sign: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => (
  <g
    transform={`translate(${x} ${y}) scale(${scale})`}
    stroke={COLORS.outline}
    strokeWidth={6}
    strokeLinejoin="round"
  >
    <rect x={-180} y={-250} width={26} height={256} rx={10} fill={COLORS.wood} />
    <rect x={154} y={-250} width={26} height={256} rx={10} fill={COLORS.wood} />
    <rect x={-250} y={-280} width={500} height={124} rx={20} fill={COLORS.woodLight} />
    <rect x={-236} y={-266} width={472} height={96} rx={14} fill="none" stroke={COLORS.wood} strokeWidth={4} />
    <circle cx={-222} cy={-252} r={5} fill={COLORS.woodDark} strokeWidth={0} />
    <circle cx={222} cy={-252} r={5} fill={COLORS.woodDark} strokeWidth={0} />
    <text
      x={0}
      y={-202}
      textAnchor="middle"
      fontFamily={SERIF}
      fontSize={54}
      fontWeight={700}
      fill="#4A2A1A"
      stroke="none"
    >
      Fazenda Chihuahua
    </text>
  </g>
);

export const HayBale: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <g
    transform={`translate(${x} ${y}) scale(${scale})`}
    stroke={COLORS.outline}
    strokeWidth={5}
    strokeLinejoin="round"
  >
    <rect x={-70} y={-80} width={140} height={80} rx={16} fill={COLORS.hay} />
    <path d="M -34 -80 L -34 0 M 34 -80 L 34 0" stroke={COLORS.hayDark} strokeWidth={6} />
    <path d="M -58 -60 l 14 -8 M -10 -30 l 14 -8 M 44 -52 l 12 -8" stroke={COLORS.hayDark} strokeWidth={4} strokeLinecap="round" />
  </g>
);
