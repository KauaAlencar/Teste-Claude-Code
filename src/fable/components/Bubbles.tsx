import React from "react";
import { COLORS, SERIF, useSvgId } from "../theme";

export const SpeechBubble: React.FC<{
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  tailX?: number;
  tailY?: number;
  children: React.ReactNode;
}> = ({ x, y, scale = 1, opacity = 1, tailX = -70, tailY = 110, children }) => {
  const shapes = (
    <>
      <rect x={-190} y={-66} width={380} height={132} rx={62} />
      <path d={`M -60 40 L ${tailX} ${tailY} L 10 50 Z`} />
    </>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <g fill={COLORS.outline} stroke={COLORS.outline} strokeWidth={12} strokeLinejoin="round">
        {shapes}
      </g>
      <g fill={COLORS.cream}>{shapes}</g>
      <text
        x={0}
        y={22}
        textAnchor="middle"
        fontFamily={SERIF}
        fontSize={70}
        fontWeight={700}
        fill="#5A2A1A"
      >
        {children}
      </text>
    </g>
  );
};

export const ThoughtBubble: React.FC<{
  x: number;
  y: number;
  rx: number;
  ry: number;
  fromX: number;
  fromY: number;
  progress: number;
  fill?: string;
  stroke?: string;
  children?: React.ReactNode;
}> = ({
  x,
  y,
  rx,
  ry,
  fromX,
  fromY,
  progress,
  fill = COLORS.cream,
  stroke = COLORS.outline,
  children,
}) => {
  const clipId = useSvgId("thought");
  const lobes = 11;
  const trail = [0.18, 0.4, 0.64].map((u, i) => ({
    cx: fromX + (x - fromX) * u * 0.78,
    cy: fromY + (y - fromY) * u * 0.78,
    r: 9 + i * 7,
    visible: Math.min(1, Math.max(0, (progress - i * 0.12) / 0.12)),
  }));
  const cloudT = Math.min(1, Math.max(0, (progress - 0.3) / 0.7));
  const cloudShapes = (
    <>
      <ellipse cx={0} cy={0} rx={rx} ry={ry} />
      {Array.from({ length: lobes }, (_, i) => {
        const a = (i / lobes) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={Math.cos(a) * rx * 0.9}
            cy={Math.sin(a) * ry * 0.9}
            r={Math.min(rx, ry) * 0.4}
          />
        );
      })}
    </>
  );
  return (
    <g>
      {trail.map((c, i) => (
        <circle
          key={i}
          cx={c.cx}
          cy={c.cy}
          r={c.r * c.visible}
          fill={fill}
          stroke={stroke}
          strokeWidth={5}
          opacity={c.visible}
        />
      ))}
      {cloudT > 0 ? (
        <g transform={`translate(${x} ${y}) scale(${cloudT})`} opacity={Math.min(1, cloudT * 2)}>
          <defs>
            <clipPath id={clipId}>
              <ellipse cx={0} cy={0} rx={rx * 0.98} ry={ry * 0.95} />
            </clipPath>
          </defs>
          <g fill={stroke} stroke={stroke} strokeWidth={12}>
            {cloudShapes}
          </g>
          <g fill={fill}>{cloudShapes}</g>
          <g clipPath={`url(#${clipId})`}>{children}</g>
        </g>
      ) : null}
    </g>
  );
};
