import React from "react";

// Seven-segment digits, drawn in a 100x180 box.
const SEGMENTS: Record<string, string> = {
  a: "M 18 6 L 82 6 L 72 20 L 28 20 Z",
  b: "M 88 12 L 94 20 L 92 84 L 84 90 L 78 82 L 80 26 Z",
  c: "M 84 96 L 92 102 L 90 164 L 82 174 L 76 160 L 78 104 Z",
  d: "M 26 162 L 72 162 L 80 176 L 16 176 Z",
  e: "M 14 96 L 20 104 L 18 160 L 10 170 L 6 164 L 8 102 Z",
  f: "M 12 12 L 20 26 L 18 82 L 12 90 L 6 84 L 8 20 Z",
  g: "M 22 84 L 76 84 L 84 91 L 76 98 L 22 98 L 14 91 Z",
};

const DIGITS: Record<string, string> = {
  "0": "abcdef",
  "1": "bc",
  "2": "abged",
  "3": "abgcd",
  "4": "fgbc",
  "5": "afgcd",
  "6": "afgedc",
  "7": "abc",
  "8": "abcdefg",
  "9": "abcdfg",
};

export const SevenSegment: React.FC<{
  value: string;
  x: number;
  y: number;
  scale?: number;
  color: string;
  off: string;
}> = ({ value, x, y, scale = 1, color, off }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    {Object.entries(SEGMENTS).map(([name, d]) => (
      <path key={name} d={d} fill={DIGITS[value]?.includes(name) ? color : off} />
    ))}
  </g>
);
