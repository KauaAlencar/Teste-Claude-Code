import React from "react";
import { useIds } from "./Bedroom";
import { COLORS } from "./colors";

// Pure SVG (no Remotion hooks). Side view: he sits up in bed facing left
// (towards his feet) and lies back onto the pillow on the right.

type Point = { x: number; y: number };

const rot = (p: Point, deg: number): Point => {
  const r = (deg * Math.PI) / 180;
  return { x: p.x * Math.cos(r) - p.y * Math.sin(r), y: p.x * Math.sin(r) + p.y * Math.cos(r) };
};

export const LIE_ANGLE = 84;
const SHOULDER_LOCAL = { x: 0, y: -190 };
const UPPER = 100;
const FORE = 96;

export const hipAt = (angle: number): Point => ({ x: 450, y: 606 - 28 * (angle / LIE_ANGLE) });

export const shoulderAt = (angle: number): Point => {
  const hip = hipAt(angle);
  const s = rot(SHOULDER_LOCAL, angle);
  return { x: hip.x + s.x, y: hip.y + s.y };
};

// Two-bone IK: returns the elbow and the (reachable) wrist.
const solveArm = (s: Point, target: Point, bend: "up" | "down") => {
  const dx = target.x - s.x;
  const dy = target.y - s.y;
  const d = Math.min(Math.hypot(dx, dy), UPPER + FORE - 1);
  const base = Math.atan2(dy, dx);
  const cos = (UPPER * UPPER + d * d - FORE * FORE) / (2 * UPPER * d);
  const a = Math.acos(Math.max(-1, Math.min(1, cos)));
  const c1 = { x: s.x + Math.cos(base + a) * UPPER, y: s.y + Math.sin(base + a) * UPPER };
  const c2 = { x: s.x + Math.cos(base - a) * UPPER, y: s.y + Math.sin(base - a) * UPPER };
  const elbow = bend === "up" ? (c1.y < c2.y ? c1 : c2) : c1.y > c2.y ? c1 : c2;
  const wrist = { x: s.x + Math.cos(base) * d, y: s.y + Math.sin(base) * d };
  return { elbow, wrist };
};

// Top edge of the blanket along the bed when he is lying down.
const blanketTopAt = (x: number, breath: number) => {
  const pts: [number, number][] = [
    [84, 600],
    [120, 560],
    [160, 532],
    [200, 552],
    [300, 552],
    [420, 546],
    [480, 512],
    [560, 500 - breath],
    [660, 504 - breath],
    [760, 540],
  ];
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    if (x <= x1) {
      const t = (x - x0) / (x1 - x0);
      const s = t * t * (3 - 2 * t);
      return y0 + (y1 - y0) * s;
    }
  }
  return pts[pts.length - 1][1];
};

const HEAD_PATH =
  "M 28 -34 C 22 -48 6 -54 -10 -52 C -28 -50 -38 -38 -40 -22 C -41 -15 -43 -10 -44 -6 C -46 -2 -52 6 -54 12 C -55 15 -52 18 -46 18 C -45 21 -47 24 -46 26 C -45 29 -46 31 -44 33 C -43 38 -40 42 -34 44 C -24 48 -10 46 0 40 L 12 34 C 22 28 30 14 32 0 C 34 -14 32 -26 28 -34 Z";

const ProfileHead: React.FC<{ eyesClosed: number }> = ({ eyesClosed }) => {
  const id = useIds("fade", "skull");
  return (
    <g>
      <defs>
        <linearGradient id={id.fade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={COLORS.hair} stopOpacity={0.95} />
          <stop offset="0.55" stopColor={COLORS.hair} stopOpacity={0.55} />
          <stop offset="1" stopColor={COLORS.hair} stopOpacity={0} />
        </linearGradient>
        <clipPath id={id.skull}>
          <path d={HEAD_PATH} />
        </clipPath>
      </defs>
      {/* Neck */}
      <path d="M -10 34 L 18 28 L 24 74 L -8 76 Z" fill={COLORS.skinShade} />
      {/* Head */}
      <path d={HEAD_PATH} fill={COLORS.skin} />
      <path d="M -34 44 C -24 48 -10 46 0 40 L 12 34 C 4 42 -14 48 -34 44 Z" fill={COLORS.skinShade} opacity={0.6} />
      {/* Faded sides: short hair fading into skin around the ear */}
      <path
        d="M -2 -44 L 40 -44 L 40 26 C 30 26 18 24 10 18 C 4 4 0 -20 -2 -44 Z"
        fill={`url(#${id.fade})`}
        clipPath={`url(#${id.skull})`}
      />
      {/* Ear with a small silver earring */}
      <ellipse cx={10} cy={2} rx={8} ry={13} fill={COLORS.skin} />
      <path d="M 12 -6 C 16 -2 16 6 12 10" stroke={COLORS.skinShade} strokeWidth={2.5} fill="none" />
      <circle cx={11} cy={17} r={3.6} fill="none" stroke={COLORS.silver} strokeWidth={2.2} />
      {/* Brow, eye, nose, mouth */}
      <path d="M -41 -18 Q -33 -24 -22 -19 L -23 -14 Q -32 -18 -40 -13 Z" fill={COLORS.brow} />
      {eyesClosed > 0.5 ? (
        <path d="M -38 -6 Q -31 -2 -24 -6" stroke={COLORS.line} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      ) : (
        <g>
          <path d="M -38 -6 Q -31 -11 -24 -6 Q -31 -2 -38 -6 Z" fill="#FFFFFF" />
          <circle cx={-33} cy={-6} r={3.2} fill={COLORS.iris} />
          <circle cx={-34} cy={-7} r={1} fill="#FFFFFF" />
          <path d="M -38 -6 Q -31 -11 -24 -6" stroke={COLORS.line} strokeWidth={2.2} fill="none" />
        </g>
      )}
      <path d="M -48 13 Q -45 15 -43 13" stroke={COLORS.skinDeep} strokeWidth={2} fill="none" />
      <path d="M -46 27 Q -42 28 -38 26" stroke={COLORS.lips} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      {/* Voluminous wavy top, one lock falling onto the forehead */}
      <path
        d="M -44 -24 C -50 -40 -42 -58 -26 -62 C -20 -74 -2 -76 8 -66 C 18 -74 34 -66 34 -54 C 42 -48 42 -36 36 -30 C 30 -30 24 -32 18 -34 C 6 -44 -12 -46 -26 -40 C -34 -36 -38 -30 -40 -24 Z"
        fill={COLORS.hair}
      />
      <path d="M -44 -30 C -50 -22 -50 -14 -45 -8 C -43 -15 -39 -21 -33 -28 Z" fill={COLORS.hair} />
      <g fill="none" stroke={COLORS.hairLight} strokeWidth={3} strokeLinecap="round" opacity={0.8}>
        <path d="M -30 -56 C -24 -62 -16 -60 -12 -54" />
        <path d="M -4 -64 C 2 -68 10 -66 12 -60" />
        <path d="M 16 -58 C 22 -60 28 -56 28 -50" />
      </g>
    </g>
  );
};

export const HeroInBed: React.FC<{
  angle: number;
  blanketEdge: number;
  hand: Point;
  bend: "up" | "down";
  eyesClosed: number;
  breath?: number;
}> = ({ angle, blanketEdge, hand, bend, eyesClosed, breath = 0 }) => {
  const hip = hipAt(angle);
  const shoulder = shoulderAt(angle);
  const { elbow, wrist } = solveArm(shoulder, hand, bend);
  const fx = wrist.x - elbow.x;
  const fy = wrist.y - elbow.y;
  const flen = Math.hypot(fx, fy);
  const ux = fx / flen;
  const uy = fy / flen;
  const handAngle = (Math.atan2(uy, ux) * 180) / Math.PI;
  const watchA = { x: wrist.x - ux * 20, y: wrist.y - uy * 20 };
  const watchB = { x: wrist.x - ux * 6, y: wrist.y - uy * 6 };
  const sleeveEnd = { x: shoulder.x + (elbow.x - shoulder.x) * 0.5, y: shoulder.y + (elbow.y - shoulder.y) * 0.5 };

  // Blanket: from the foot of the bed to `blanketEdge`, draping over the side
  const step = 12;
  const top: string[] = [];
  for (let x = 84; x <= blanketEdge; x += step) {
    top.push(`L ${x} ${blanketTopAt(x, breath).toFixed(1)}`);
  }
  const edgeTop = blanketTopAt(blanketEdge, breath);
  const blanket = `M 84 668 ${top.join(" ")} L ${blanketEdge} ${edgeTop.toFixed(1)} C ${blanketEdge + 14} ${edgeTop + 40} ${blanketEdge + 10} ${edgeTop + 110} ${blanketEdge + 4} 672 Z`;

  return (
    <g>
      {/* Legs: pyjama shorts, shins, feet (toes up) */}
      <rect x={250} y={552} width={230} height={60} rx={28} fill={COLORS.shorts} />
      <rect x={262} y={556} width={200} height={10} rx={5} fill="#3A3F5A" opacity={0.7} />
      <path d="M 270 560 L 272 606 L 160 604 Q 146 592 150 576 L 160 568 Z" fill={COLORS.skin} />
      <path d="M 166 602 C 150 602 138 592 136 574 C 134 552 140 536 150 530 C 158 526 166 532 168 544 L 172 580 Z" fill={COLORS.skin} />

      {/* Torso, neck and head turn together around the hip */}
      <g transform={`translate(${hip.x} ${hip.y}) rotate(${angle})`}>
        <path
          d="M 44 6 L 46 -150 C 46 -190 30 -208 8 -212 L -22 -210 C -46 -204 -58 -180 -60 -150 L -64 -40 C -66 -10 -62 4 -58 8 Z"
          fill={COLORS.shirt}
        />
        <path d="M 44 6 L 46 -150 C 46 -190 30 -208 8 -212 L 20 -150 L 18 6 Z" fill={COLORS.shirtShade} opacity={0.7} />
        <g stroke={COLORS.shirtShade} strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.8}>
          <path d="M -40 -120 C -30 -100 -34 -80 -26 -60" />
          <path d="M -50 -40 C -40 -30 -30 -28 -20 -30" />
        </g>
        <g transform="translate(-6 -262)">
          <ProfileHead eyesClosed={eyesClosed} />
        </g>
      </g>

      <path d={blanket} fill={COLORS.blanket} />
      <path d={blanket} fill="none" stroke={COLORS.blanketShade} strokeWidth={3} opacity={0.6} />
      {Array.from({ length: Math.max(0, Math.floor((blanketEdge - 140) / 90)) }, (_, i) => {
        const x = 150 + i * 90;
        return (
          <path
            key={x}
            d={`M ${x} ${blanketTopAt(x, breath) + 14} C ${x + 10} ${blanketTopAt(x, breath) + 50} ${x - 6} 620 ${x + 4} 664`}
            stroke={COLORS.blanketShade}
            strokeWidth={5}
            fill="none"
            opacity={0.5}
            strokeLinecap="round"
          />
        );
      })}
      <path
        d={`M ${blanketEdge - 26} ${blanketTopAt(blanketEdge - 26, breath)} L ${blanketEdge} ${edgeTop} C ${blanketEdge + 14} ${edgeTop + 40} ${blanketEdge + 10} ${edgeTop + 110} ${blanketEdge + 4} 672 L ${blanketEdge - 22} 672 C ${blanketEdge - 16} ${edgeTop + 100} ${blanketEdge - 20} ${edgeTop + 40} ${blanketEdge - 26} ${blanketTopAt(blanketEdge - 26, breath)} Z`}
        fill={COLORS.blanketHem}
      />

      {/* Near (left) arm: sleeve, forearm, black watch, hand with a silver ring */}
      <g strokeLinecap="round">
        <line x1={shoulder.x} y1={shoulder.y} x2={elbow.x} y2={elbow.y} stroke={COLORS.skinShade} strokeWidth={30} />
        <line x1={shoulder.x} y1={shoulder.y} x2={sleeveEnd.x} y2={sleeveEnd.y} stroke={COLORS.shirt} strokeWidth={40} />
        <line x1={elbow.x} y1={elbow.y} x2={wrist.x} y2={wrist.y} stroke={COLORS.skin} strokeWidth={25} />
        <line x1={watchA.x} y1={watchA.y} x2={watchB.x} y2={watchB.y} stroke={COLORS.watch} strokeWidth={29} strokeLinecap="butt" />
      </g>
      <g transform={`translate(${wrist.x} ${wrist.y}) rotate(${handAngle})`}>
        <ellipse cx={16} cy={0} rx={19} ry={13} fill={COLORS.skin} />
        <path d="M 22 -9 C 30 -8 36 -4 36 2" stroke={COLORS.skinShade} strokeWidth={3} fill="none" strokeLinecap="round" />
        <rect x={25} y={-4} width={5} height={12} rx={2} fill={COLORS.silver} />
      </g>
    </g>
  );
};
