import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  interpolateColors,
  useCurrentFrame,
} from "remotion";
import { useIds } from "../illustrated/Bedroom";
import { SevenSegment } from "../illustrated/Clock";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 12–16s: the bedside clock races from 23:00 to 07:00, then the sun comes in.
export const Scene2Relogio: React.FC = () => {
  const frame = useCurrentFrame();
  const id = useIds("wall", "wood", "body", "glow", "beam", "blur", "lampblur");

  const minutes = Math.floor(
    interpolate(frame, [8, 92], [0, 480], {
      ...clamp,
      easing: Easing.bezier(0.55, 0, 0.45, 1),
    }),
  );
  const total = (23 * 60 + minutes) % (24 * 60);
  const hh = String(Math.floor(total / 60)).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  const colon = Math.floor(frame / 8) % 2 === 0 || frame > 92;

  const dawn = interpolate(frame, [60, 118], [0, 1], clamp);
  const sun = interpolate(frame, [84, 118], [0, 1], {
    ...clamp,
    easing: Easing.bezier(0.33, 0, 0.2, 1),
  });
  const push = interpolate(frame, [0, 120], [1, 1.05], clamp);

  const on = "#FF5A3C";
  const off = "#2A1512";

  return (
    <AbsoluteFill style={{ backgroundColor: "#0E1330" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <linearGradient id={id.wall} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={interpolateColors(dawn, [0, 1], ["#10173A", "#C9A583"])} />
            <stop offset="1" stopColor={interpolateColors(dawn, [0, 1], ["#1C2552", "#E7C8A0"])} />
          </linearGradient>
          <linearGradient id={id.wood} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={interpolateColors(dawn, [0, 1], ["#3A2A2A", "#B07A48"])} />
            <stop offset="1" stopColor={interpolateColors(dawn, [0, 1], ["#1E1618", "#7A4E2C"])} />
          </linearGradient>
          <linearGradient id={id.body} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#34343E" />
            <stop offset="1" stopColor="#15151B" />
          </linearGradient>
          <linearGradient id={id.beam} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFF0B8" stopOpacity={0.85} />
            <stop offset="1" stopColor="#FFD27A" stopOpacity={0} />
          </linearGradient>
          <filter id={id.glow} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id={id.blur} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
          <filter id={id.lampblur} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>

        <g transform={`translate(960 560) scale(${push}) translate(-960 -560)`}>
          <rect width={1920} height={1080} fill={`url(#${id.wall})`} />
          {/* Moonlight on the wall fading into morning light */}
          <path
            d="M 1500 0 L 1920 0 L 1920 700 L 1380 700 Z"
            fill={interpolateColors(dawn, [0, 1], ["#6F8FE0", "#FFE3A0"])}
            opacity={0.25}
            filter={`url(#${id.blur})`}
          />
          {/* Out-of-focus lamp */}
          <g filter={`url(#${id.lampblur})`} opacity={0.9}>
            <path d="M 170 120 L 390 120 L 450 330 L 110 330 Z" fill={interpolateColors(dawn, [0, 1], ["#3A3350", "#F2C48C"])} />
            <rect x={262} y={330} width={30} height={330} fill="#2A2A30" />
            <ellipse cx={277} cy={690} rx={120} ry={34} fill="#6A6560" />
          </g>

          {/* Nightstand top */}
          <path d="M -40 700 L 1960 700 L 1960 1080 L -40 1080 Z" fill={`url(#${id.wood})`} />
          <rect x={-40} y={700} width={2000} height={10} fill="#FFFFFF" opacity={0.06} />

          {/* The clock */}
          <ellipse cx={960} cy={780} rx={470} ry={40} fill="#000000" opacity={0.35} filter={`url(#${id.glow})`} />
          <rect x={500} y={330} width={920} height={450} rx={70} fill={`url(#${id.body})`} />
          <rect x={560} y={392} width={800} height={326} rx={30} fill="#0A0A0E" />
          <g opacity={0.9} filter={`url(#${id.glow})`}>
            <SevenSegment value={hh[0]} x={600} y={420} scale={1.5} color={on} off="none" />
            <SevenSegment value={hh[1]} x={770} y={420} scale={1.5} color={on} off="none" />
            <SevenSegment value={mm[0]} x={1000} y={420} scale={1.5} color={on} off="none" />
            <SevenSegment value={mm[1]} x={1170} y={420} scale={1.5} color={on} off="none" />
          </g>
          <SevenSegment value={hh[0]} x={600} y={420} scale={1.5} color={on} off={off} />
          <SevenSegment value={hh[1]} x={770} y={420} scale={1.5} color={on} off={off} />
          <SevenSegment value={mm[0]} x={1000} y={420} scale={1.5} color={on} off={off} />
          <SevenSegment value={mm[1]} x={1170} y={420} scale={1.5} color={on} off={off} />
          <g fill={colon ? on : off}>
            <circle cx={958} cy={510} r={14} />
            <circle cx={958} cy={626} r={14} />
          </g>
          <path d="M 560 392 L 900 392 L 700 718 L 560 718 Z" fill="#FFFFFF" opacity={0.04} />
          <circle cx={1380} cy={370} r={10} fill="#3A3A44" />

          {/* The sun comes in through the window */}
          <path
            d="M 1920 -80 L 1920 420 L 700 1120 L 180 1120 Z"
            fill={`url(#${id.beam})`}
            opacity={sun * 0.9}
            filter={`url(#${id.blur})`}
          />
          <rect width={1920} height={1080} fill="#FFB98C" opacity={sun * 0.12} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
