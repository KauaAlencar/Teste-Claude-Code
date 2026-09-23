import React from "react";
import {
  interpolateColors,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, SkyStops, starPath, useSvgId } from "../theme";

export const mixSky = (a: SkyStops, b: SkyStops, t: number): SkyStops =>
  a.map(([offset, color], i) => [
    offset,
    interpolateColors(t, [0, 1], [color, b[i][1]]),
  ]);

export const Sky: React.FC<{ stops: SkyStops; y?: number; height?: number }> = ({
  stops,
  y = 0,
  height = 1080,
}) => {
  const id = useSvgId("sky");
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {stops.map(([offset, color]) => (
            <stop key={offset} offset={offset} stopColor={color} />
          ))}
        </linearGradient>
      </defs>
      <rect x={-300} y={y} width={2520} height={height} fill={`url(#${id})`} />
    </>
  );
};

export const Sun: React.FC<{
  x: number;
  y: number;
  r?: number;
  color?: string;
  opacity?: number;
}> = ({ x, y, r = 90, color = "#FFE6A6", opacity = 1 }) => {
  const id = useSvgId("sun");
  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={color} stopOpacity={0.9} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 3.2} fill={`url(#${id})`} />
      <circle cx={x} cy={y} r={r} fill={color} />
    </g>
  );
};

export const Moon: React.FC<{ x: number; y: number; r?: number; opacity?: number }> = ({
  x,
  y,
  r = 56,
  opacity = 1,
}) => {
  const maskId = useSvgId("moon");
  const glowId = useSvgId("moon-glow");
  return (
    <g opacity={opacity}>
      <defs>
        <mask id={maskId}>
          <circle cx={x} cy={y} r={r} fill="white" />
          <circle cx={x + r * 0.45} cy={y - r * 0.25} r={r * 0.85} fill="black" />
        </mask>
        <radialGradient id={glowId}>
          <stop offset="0%" stopColor="#FFF1C9" stopOpacity={0.35} />
          <stop offset="100%" stopColor="#FFF1C9" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r * 3} fill={`url(#${glowId})`} />
      <circle cx={x} cy={y} r={r} fill="#FFF1C9" mask={`url(#${maskId})`} />
    </g>
  );
};

export const Stars: React.FC<{
  count?: number;
  seed?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  opacity?: number;
}> = ({
  count = 90,
  seed = "stars",
  x = 0,
  y = 0,
  width = 1920,
  height = 700,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <g opacity={opacity}>
      {Array.from({ length: count }, (_, i) => {
        const sx = x + random(`${seed}-x-${i}`) * width;
        const sy = y + Math.pow(random(`${seed}-y-${i}`), 1.4) * height;
        const size = 1.4 + random(`${seed}-r-${i}`) * 2.6;
        const speed = 1.2 + random(`${seed}-s-${i}`) * 2.2;
        const phase = random(`${seed}-p-${i}`) * Math.PI * 2;
        const twinkle = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * speed + phase));
        if (i % 9 === 0) {
          return (
            <path
              key={i}
              d={starPath(size * 2.6, size * 1.1)}
              transform={`translate(${sx} ${sy})`}
              fill={COLORS.star}
              stroke={COLORS.star}
              strokeWidth={1.5}
              strokeLinejoin="round"
              opacity={twinkle}
            />
          );
        }
        return (
          <circle key={i} cx={sx} cy={sy} r={size} fill={COLORS.star} opacity={twinkle} />
        );
      })}
    </g>
  );
};

export const Tree: React.FC<{
  x: number;
  y: number;
  scale?: number;
  leaf?: string;
  leafDark?: string;
  outline?: string;
}> = ({
  x,
  y,
  scale = 1,
  leaf = COLORS.treeLeaf,
  leafDark = COLORS.treeLeafDark,
  outline = COLORS.outline,
}) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 40 + x) * 1.2;
  const canopy = (
    <>
      <circle cx={-52} cy={-205} r={70} />
      <circle cx={48} cy={-215} r={74} />
      <circle cx={-4} cy={-285} r={82} />
    </>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x={-18} y={-180} width={36} height={182} rx={14} fill="#7A4B2A" stroke={outline} strokeWidth={6} />
      <g transform={`rotate(${sway} 0 -150)`}>
        <g fill={outline} stroke={outline} strokeWidth={12}>
          {canopy}
        </g>
        <g fill={leafDark}>{canopy}</g>
        <circle cx={-14} cy={-262} r={70} fill={leaf} />
        <circle cx={34} cy={-226} r={50} fill={leaf} />
        <circle cx={-30} cy={-290} r={22} fill="#FFFFFF" opacity={0.12} />
      </g>
    </g>
  );
};

export const Cloud: React.FC<{
  x: number;
  y: number;
  scale?: number;
  color?: string;
  opacity?: number;
}> = ({ x, y, scale = 1, color = "#FFF1DD", opacity = 0.9 }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`} fill={color} opacity={opacity}>
    <ellipse cx={0} cy={0} rx={130} ry={34} />
    <circle cx={-50} cy={-18} r={42} />
    <circle cx={10} cy={-38} r={54} />
    <circle cx={64} cy={-14} r={38} />
  </g>
);

export const Fence: React.FC<{
  x1: number;
  x2: number;
  y: number;
  spacing?: number;
  height?: number;
  color?: string;
}> = ({ x1, x2, y, spacing = 160, height = 120, color = COLORS.woodLight }) => {
  const posts: number[] = [];
  for (let px = x1; px <= x2 + 0.5; px += spacing) {
    posts.push(px);
  }
  return (
    <g stroke={COLORS.outline} strokeWidth={5} strokeLinejoin="round">
      <rect x={x1 - 10} y={y - height * 0.78} width={x2 - x1 + 20} height={18} rx={9} fill={color} />
      <rect x={x1 - 10} y={y - height * 0.4} width={x2 - x1 + 20} height={18} rx={9} fill={color} />
      {posts.map((px) => (
        <rect key={px} x={px - 13} y={y - height} width={26} height={height + 8} rx={10} fill={color} />
      ))}
    </g>
  );
};

export const GrassTufts: React.FC<{
  seed: string;
  count?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  color?: string;
}> = ({
  seed,
  count = 40,
  x = 0,
  y = 800,
  width = 1920,
  height = 280,
  color = COLORS.grassDark,
}) => (
  <g stroke={color} strokeWidth={5} strokeLinecap="round" fill="none">
    {Array.from({ length: count }, (_, i) => {
      const gx = x + random(`${seed}-gx-${i}`) * width;
      const gy = y + random(`${seed}-gy-${i}`) * height;
      const s = 0.7 + (gy - y) / Math.max(1, height) * 0.8;
      return (
        <path
          key={i}
          transform={`translate(${gx} ${gy}) scale(${s})`}
          d="M 0 0 q -4 -12 -12 -20 M 0 0 q 1 -16 -1 -26 M 0 0 q 5 -12 13 -18"
        />
      );
    })}
  </g>
);

export const Birds: React.FC<{ y?: number; speed?: number; opacity?: number }> = ({
  y = 220,
  speed = 3,
  opacity = 0.8,
}) => {
  const frame = useCurrentFrame();
  return (
    <g stroke="#6B3B2A" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={opacity}>
      {[0, 1, 2].map((i) => {
        const bx = -120 + frame * speed + i * 70;
        const by = y + i * 26 + Math.sin(frame / 8 + i) * 6;
        const flap = Math.sin(frame / 4 + i * 1.7) * 8;
        return (
          <path
            key={i}
            d={`M ${bx - 20} ${by - flap} Q ${bx - 8} ${by - 6} ${bx} ${by} Q ${bx + 8} ${by - 6} ${bx + 20} ${by - flap}`}
          />
        );
      })}
    </g>
  );
};

export type LandPalette = { far: string; mid: string; grass: string };

export const LAND: Record<"dawn" | "day" | "afternoon" | "dusk" | "night", LandPalette> = {
  dawn: { far: "#D6A07E", mid: "#B89A60", grass: "#A7A85C" },
  day: { far: "#E3AE6E", mid: "#C99B56", grass: "#AEB05C" },
  afternoon: { far: "#D9955F", mid: "#B98A4A", grass: "#A3A156" },
  dusk: { far: "#9C6A70", mid: "#7E6458", grass: "#7D7B52" },
  night: { far: "#2C2A55", mid: "#232144", grass: "#2E3934" },
};

// Rolling hills + ground. `horizon` is where the far hills sit, `ground` where the grass starts.
export const Landscape: React.FC<{
  palette: LandPalette;
  horizon?: number;
  ground?: number;
}> = ({ palette, horizon = 640, ground = 780 }) => {
  const h = horizon;
  const g = ground;
  return (
    <g>
      <path
        d={`M -300 ${h} C 260 ${h - 90} 520 ${h - 40} 800 ${h - 60} C 1080 ${h - 80} 1300 ${h - 130} 1580 ${h - 70} C 1760 ${h - 40} 1860 ${h - 60} 2220 ${h - 50} L 2220 1500 L -300 1500 Z`}
        fill={palette.far}
      />
      <path
        d={`M -300 ${h + 70} C 300 ${h + 10} 640 ${h + 60} 980 ${h + 36} C 1320 ${h + 12} 1640 ${h + 64} 2220 ${h + 30} L 2220 1500 L -300 1500 Z`}
        fill={palette.mid}
      />
      <path
        d={`M -300 ${g} C 500 ${g - 22} 1300 ${g + 12} 2220 ${g - 10} L 2220 1500 L -300 1500 Z`}
        fill={palette.grass}
      />
    </g>
  );
};

// Cools and darkens everything inside it, so the same characters work at dusk and at night.
export const Night: React.FC<{ amount?: number; children: React.ReactNode }> = ({
  amount = 1,
  children,
}) => {
  const id = useSvgId("night");
  const r = 1 - 0.54 * amount;
  const g = 1 - 0.48 * amount;
  const b = 1 - 0.38 * amount;
  return (
    <>
      <defs>
        <filter id={id} colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values={`${r} 0 0 0 ${0.02 * amount} 0 ${g} 0 0 ${0.04 * amount} 0 0 ${b} 0 ${0.07 * amount} 0 0 0 1 0`}
          />
        </filter>
      </defs>
      <g filter={`url(#${id})`}>{children}</g>
    </>
  );
};
