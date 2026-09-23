import React, { useId } from "react";

// Pure SVG (no Remotion hooks): the transition scene also renders it to a
// static image. Same layout as the pixel bedroom, 6x bigger.

export const useIds = (...names: string[]) => {
  const base = useId().replace(/[^a-zA-Z0-9]/g, "");
  return Object.fromEntries(names.map((n) => [n, `${n}-${base}`])) as Record<string, string>;
};

const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
};

export const MATTRESS_TOP = 612;
export const LAMP_SWITCH = { x: 852, y: 548 };

type Light = {
  // 0 = off, 1 = on
  lamp: number;
  // 0 = daylight outside, 1 = night outside
  night: number;
  // morning sun coming in through the window
  sun: number;
};

export const Bedroom: React.FC<
  Light & { clock?: string; children?: React.ReactNode }
> = ({ lamp, night, sun, clock = "23:00", children }) => {
  const id = useIds(
    "wall",
    "floor",
    "glass",
    "curtain",
    "glow",
    "dark",
    "soft",
    "blur",
    "shade",
    "mattress",
    "pillow",
    "wood",
    "sunbeam",
    "moonbeam",
  );
  const skyTop = mix("#8CC3EC", "#0E1A3A", night);
  const skyMid = mix("#FFB98C", "#1E2A55", night);
  const skyLow = mix("#FFE28F", "#2B3566", night);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1920 1080"
      width={1920}
      height={1080}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id={id.wall} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DCC8A4" />
          <stop offset="1" stopColor="#EBDCC0" />
        </linearGradient>
        <linearGradient id={id.floor} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C4955E" />
          <stop offset="1" stopColor="#A87A48" />
        </linearGradient>
        <linearGradient id={id.glass} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={skyTop} />
          <stop offset="0.6" stopColor={skyMid} />
          <stop offset="1" stopColor={skyLow} />
        </linearGradient>
        <linearGradient id={id.curtain} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#355E9C" />
          <stop offset="0.3" stopColor="#4A7BC4" />
          <stop offset="0.55" stopColor="#2F5590" />
          <stop offset="0.8" stopColor="#4677BE" />
          <stop offset="1" stopColor="#30568F" />
        </linearGradient>
        <linearGradient id={id.wood} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A86E3E" />
          <stop offset="1" stopColor="#865328" />
        </linearGradient>
        <linearGradient id={id.mattress} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7F3EA" />
          <stop offset="1" stopColor="#D9D3C6" />
        </linearGradient>
        <radialGradient id={id.pillow} cx="0.45" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#DCD6CA" />
        </radialGradient>
        <radialGradient id={id.glow} cx="880" cy="486" r="1100" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFD9A0" stopOpacity={0.55} />
          <stop offset="0.25" stopColor="#FFB36B" stopOpacity={0.22} />
          <stop offset="1" stopColor="#FFB36B" stopOpacity={0} />
        </radialGradient>
        <radialGradient id={id.dark} cx="880" cy="486" r="1250" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#0B1030" stopOpacity={0} />
          <stop offset="0.35" stopColor="#0B1030" stopOpacity={0.25} />
          <stop offset="1" stopColor="#0B1030" stopOpacity={0.72} />
        </radialGradient>
        <linearGradient id={id.shade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF2D6" />
          <stop offset="1" stopColor="#F2C48C" />
        </linearGradient>
        <linearGradient id={id.sunbeam} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE9A8" stopOpacity={0.75} />
          <stop offset="1" stopColor="#FFD27A" stopOpacity={0.25} />
        </linearGradient>
        <linearGradient id={id.moonbeam} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A9C4FF" stopOpacity={0.55} />
          <stop offset="1" stopColor="#7C9CE8" stopOpacity={0.15} />
        </linearGradient>
        <filter id={id.soft} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={id.blur} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="30" />
        </filter>
      </defs>

      {/* Wall, dotted wallpaper, baseboard, floor */}
      <rect x={0} y={0} width={1920} height={700} fill={`url(#${id.wall})`} />
      <g fill="#C9AE84" opacity={0.45}>
        {Array.from({ length: 9 }, (_, r) =>
          Array.from({ length: 27 }, (_, c) => (
            <circle key={`${r}-${c}`} cx={(r % 2 === 0 ? 36 : 72) + c * 72} cy={48 + r * 72} r={4} />
          )),
        )}
      </g>
      <rect x={0} y={678} width={1920} height={42} fill="#8F5A31" />
      <rect x={0} y={678} width={1920} height={6} fill="#6B3F28" />
      <rect x={0} y={720} width={1920} height={360} fill={`url(#${id.floor})`} />
      <g stroke="#8E6034" strokeWidth={3} opacity={0.55}>
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={0} x2={1920} y1={762 + i * 48} y2={762 + i * 48} />
        ))}
        {Array.from({ length: 8 }, (_, i) =>
          Array.from({ length: 8 }, (_, j) => {
            const x = (i % 2) * 120 + j * 240;
            return <line key={`${i}-${j}`} x1={x} x2={x} y1={720 + i * 48} y2={762 + i * 48} />;
          }),
        )}
      </g>

      {/* Window */}
      <rect x={1044} y={78} width={504} height={16} rx={8} fill="#5C3A22" />
      <rect x={1110} y={114} width={372} height={384} rx={10} fill="#F4EFE4" />
      <rect x={1128} y={132} width={336} height={348} fill={`url(#${id.glass})`} />
      <g opacity={1 - night}>
        <circle cx={1392} cy={396} r={48} fill="#FFF3C4" />
        <circle cx={1392} cy={396} r={90} fill="#FFE9A8" opacity={0.35} />
      </g>
      <g opacity={night}>
        <circle cx={1210} cy={200} r={28} fill="#F3EFD9" />
        <circle cx={1222} cy={192} r={24} fill={skyTop} />
        {[
          [1300, 170],
          [1400, 230],
          [1180, 300],
          [1340, 290],
          [1430, 160],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r={3} fill="#FFF6D8" />
        ))}
      </g>
      <path
        d="M 1128 440 C 1200 420 1260 432 1320 424 C 1380 418 1430 430 1464 426 L 1464 480 L 1128 480 Z"
        fill={mix("#2F6A3C", "#101a2c", night)}
      />
      <rect x={1176} y={402} width={60} height={30} fill={mix("#D8452C", "#2a1a2a", night)} />
      <rect x={1272} y={410} width={48} height={20} fill={mix("#3F6FB5", "#1a2340", night)} />
      <rect x={1286} y={132} width={20} height={348} fill="#F4EFE4" />
      <rect x={1128} y={296} width={336} height={20} fill="#F4EFE4" />
      <rect x={1056} y={96} width={72} height={470} rx={20} fill={`url(#${id.curtain})`} />
      <rect x={1464} y={96} width={72} height={470} rx={20} fill={`url(#${id.curtain})`} />

      {/* Poster, shelf, books */}
      <rect x={180} y={156} width={168} height={204} rx={6} fill="#5A3F7A" />
      <path d="M 196 344 L 262 250 L 330 344 Z" fill="#2F6A3C" />
      <circle cx={300} cy={204} r={20} fill="#FFE28F" />
      <rect x={408} y={276} width={300} height={16} rx={4} fill="#6B3F28" />
      {[
        [420, 60, "#3F6FB5"],
        [444, 48, "#D8452C"],
        [468, 66, "#5DA34C"],
        [498, 54, "#FFE28F"],
        [522, 60, "#5A3F7A"],
        [600, 42, "#F5902C"],
      ].map(([x, h, c]) => (
        <rect key={x as number} x={x as number} y={276 - (h as number)} width={22} height={h as number} rx={3} fill={c as string} />
      ))}

      {/* Door */}
      <rect x={1590} y={198} width={228} height={522} rx={8} fill="#6B3F28" />
      <rect x={1602} y={210} width={204} height={510} rx={4} fill="#9A6236" />
      <rect x={1626} y={240} width={156} height={180} rx={6} fill="#8A5530" />
      <rect x={1626} y={456} width={156} height={228} rx={6} fill="#8A5530" />
      <circle cx={1782} cy={486} r={10} fill="#E8C36A" />

      {/* Rug */}
      <ellipse cx={1212} cy={924} rx={330} ry={62} fill="#5A3F7A" />
      <ellipse cx={1212} cy={924} rx={300} ry={48} fill="none" stroke="#FFB98C" strokeWidth={4} strokeDasharray="4 18" />

      {/* Bed */}
      <ellipse cx={450} cy={720} rx={420} ry={26} fill="#000000" opacity={0.18} filter={`url(#${id.soft})`} />
      <rect x={768} y={420} width={62} height={300} rx={14} fill={`url(#${id.wood})`} />
      <rect x={96} y={666} width={20} height={54} fill="#6B3F28" />
      <rect x={740} y={666} width={20} height={54} fill="#6B3F28" />
      <rect x={84} y={MATTRESS_TOP} width={708} height={60} rx={16} fill={`url(#${id.mattress})`} />
      <path
        d="M 604 540 C 600 508 626 498 660 500 L 744 504 C 772 506 774 530 770 556 C 766 590 752 606 724 606 L 640 606 C 612 606 606 580 604 540 Z"
        fill={`url(#${id.pillow})`}
      />

      {children}

      <rect x={42} y={546} width={60} height={174} rx={14} fill={`url(#${id.wood})`} />

      {/* Nightstand, lamp and clock */}
      <rect x={840} y={576} width={180} height={144} rx={8} fill={`url(#${id.wood})`} />
      <rect x={852} y={636} width={156} height={4} fill="#6B3F28" />
      <circle cx={930} cy={606} r={6} fill="#E8C36A" />
      <circle cx={930} cy={666} r={6} fill="#E8C36A" />
      <ellipse cx={882} cy={574} rx={26} ry={6} fill="#B9B4AB" />
      <rect x={862} y={548} width={40} height={26} rx={10} fill="#CFCAC0" />
      <rect x={878} y={500} width={8} height={50} fill="#3A3A40" />
      <path d="M 852 452 L 912 452 L 930 506 L 834 506 Z" fill={`url(#${id.shade})`} />
      <path d="M 852 452 L 912 452 L 930 506 L 834 506 Z" fill="#FFF6D0" opacity={lamp * 0.6} />
      <circle cx={LAMP_SWITCH.x} cy={LAMP_SWITCH.y + 16} r={6} fill="#3A3A40" />
      <rect x={918} y={522} width={96} height={54} rx={10} fill="#1B1B22" />
      <text
        x={966}
        y={560}
        textAnchor="middle"
        fontFamily="monospace"
        fontSize={28}
        fontWeight={700}
        fill="#FF5A3C"
      >
        {clock}
      </text>

      {/* Light: lamp glow, night darkness, moonlight, morning sun */}
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${id.dark})`} opacity={night * lamp} />
      <rect x={0} y={0} width={1920} height={1080} fill="#0B1030" opacity={night * (1 - lamp) * 0.7} />
      <path
        d="M 1128 480 L 1464 480 L 1270 1000 L 700 1000 Z"
        fill={`url(#${id.moonbeam})`}
        opacity={night * (1 - lamp * 0.8)}
        filter={`url(#${id.blur})`}
      />
      <rect x={0} y={0} width={1920} height={1080} fill={`url(#${id.glow})`} opacity={lamp} />
      <path
        d="M 1128 480 L 1464 480 L 1180 1020 L 720 1020 Z"
        fill={`url(#${id.sunbeam})`}
        opacity={sun}
        filter={`url(#${id.blur})`}
      />
      <rect x={0} y={0} width={1920} height={1080} fill="#FFB98C" opacity={sun * 0.12} />
    </svg>
  );
};
