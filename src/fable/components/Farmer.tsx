import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

const C = {
  outline: "#3E2415",
  shirt: "#C8553D",
  shirtDark: "#A5432F",
  denim: "#4A6A96",
  denimDark: "#3A5378",
  skin: "#EDBB93",
  skinDark: "#DC9B72",
  boot: "#4A2E1E",
  hat: "#E4B85E",
  hatDark: "#C99A42",
  band: "#9A4E2C",
  mustache: "#7A4A2A",
};

// World position of the farmer's head, for aiming mind waves and thought bubbles.
export const farmerHeadPoint = ({
  x,
  y,
  scale = 1,
  facing = 1,
}: {
  x: number;
  y: number;
  scale?: number;
  facing?: number;
}) => ({ x: x + facing * scale * 6, y: y - scale * 360 });

export const Farmer: React.FC<{
  x: number;
  y: number;
  scale?: number;
  facing?: number;
  walkPhase?: number;
  walkAmount?: number;
  breathOffset?: number;
  opacity?: number;
}> = ({
  x,
  y,
  scale = 1,
  facing = 1,
  walkPhase = 0,
  walkAmount = 0,
  breathOffset = 0,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame + breathOffset) / fps;
  const breath = Math.sin((t * 2 * Math.PI) / 3);
  const swing = walkAmount * 24 * Math.sin(walkPhase);
  const bob = -Math.abs(Math.sin(walkPhase)) * 6 * walkAmount + breath * 1.2;

  return (
    <g
      transform={`translate(${x} ${y}) scale(${facing * scale} ${scale})`}
      opacity={opacity}
      stroke={C.outline}
      strokeWidth={5}
      strokeLinejoin="round"
      strokeLinecap="round"
    >
      {/* Far leg and arm */}
      <g transform={`rotate(${-swing} -10 -180)`}>
        <rect x={-26} y={-190} width={30} height={170} rx={15} fill={C.denimDark} />
        <path d="M -30 -28 h 44 a 12 12 0 0 1 12 12 v 16 h -60 v -16 a 12 12 0 0 1 4 -12 Z" fill={C.boot} />
      </g>
      <g transform={`translate(0 ${bob})`}>
        <g transform={`rotate(${swing * 0.9} -6 -282)`}>
          <path d="M -6 -282 L -14 -196" stroke={C.outline} strokeWidth={34} fill="none" />
          <path d="M -6 -282 L -14 -196" stroke={C.shirtDark} strokeWidth={24} fill="none" />
          <circle cx={-14} cy={-190} r={14} fill={C.skinDark} />
        </g>
      </g>

      {/* Near leg */}
      <g transform={`rotate(${swing} 8 -180)`}>
        <rect x={-6} y={-190} width={30} height={170} rx={15} fill={C.denim} />
        <path d="M -10 -28 h 44 a 12 12 0 0 1 12 12 v 16 h -60 v -16 a 12 12 0 0 1 4 -12 Z" fill={C.boot} />
      </g>

      <g transform={`translate(0 ${bob})`}>
        {/* Torso */}
        <rect x={-50} y={-308} width={100} height={155} rx={40} fill={C.shirt} />
        <path d="M -42 -250 h 84 v 70 a 26 26 0 0 1 -26 26 h -32 a 26 26 0 0 1 -26 -26 Z" fill={C.denim} />
        <path d="M -32 -250 L -36 -300 M 32 -250 L 36 -300" stroke={C.denim} strokeWidth={11} fill="none" />
        <rect x={-16} y={-238} width={32} height={26} rx={6} fill={C.denimDark} strokeWidth={4} />

        {/* Near arm */}
        <g transform={`rotate(${-swing * 0.9} 18 -282)`}>
          <path d="M 18 -282 L 30 -196" stroke={C.outline} strokeWidth={34} fill="none" />
          <path d="M 18 -282 L 30 -196" stroke={C.shirt} strokeWidth={24} fill="none" />
          <circle cx={30} cy={-190} r={14} fill={C.skin} />
        </g>

        {/* Head */}
        <rect x={-8} y={-318} width={26} height={20} rx={6} fill={C.skinDark} />
        <circle cx={-16} cy={-350} r={11} fill={C.skinDark} />
        <circle cx={6} cy={-352} r={44} fill={C.skin} />
        <circle cx={48} cy={-348} r={10} fill={C.skinDark} />
        <circle cx={24} cy={-334} r={9} fill="#F2A28A" stroke="none" opacity={0.6} />
        <circle cx={28} cy={-362} r={5} fill={C.outline} stroke="none" />
        <path d="M 18 -376 q 10 -6 20 0" fill="none" strokeWidth={4} />
        <path d="M 26 -334 q 12 9 28 0" stroke={C.mustache} strokeWidth={9} fill="none" />

        {/* Straw hat */}
        <ellipse cx={6} cy={-386} rx={86} ry={16} fill={C.hat} />
        <path d="M -34 -388 C -36 -446 48 -446 46 -388 Z" fill={C.hat} />
        <path d="M -35 -402 L 47 -402" stroke={C.band} strokeWidth={11} fill="none" />
        <path d="M -60 -380 q 66 10 132 0" stroke={C.hatDark} strokeWidth={3} fill="none" />
      </g>
    </g>
  );
};
