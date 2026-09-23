import { loadFont } from "@remotion/fonts";
import { useId } from "react";
import { staticFile } from "remotion";

// Font files live in public/fonts so rendering works offline (SIL OFL license).
export const SERIF = "Cormorant Garamond";

(
  [
    ["600", "normal"],
    ["700", "normal"],
    ["600", "italic"],
  ] as const
).forEach(([weight, style]) => {
  loadFont({
    family: SERIF,
    url: staticFile(`fonts/cormorant-garamond-latin-${weight}-${style}.woff2`),
    weight,
    style,
  });
});

export const FPS = 30;

export const COLORS = {
  outline: "#4A2E1E",
  grass: "#AEB05C",
  grassDark: "#8F9549",
  grassLight: "#C7C06C",
  hillFar: "#E3AE6E",
  hillMid: "#C99B56",
  barnRed: "#B4432F",
  barnRedDark: "#963527",
  barnRoof: "#7B2C23",
  trim: "#FBEBD3",
  wood: "#A86B3C",
  woodDark: "#734526",
  woodLight: "#C98D55",
  hay: "#E8C36A",
  hayDark: "#C9A04A",
  glow: "#7FD3FF",
  cream: "#FFF4E2",
  star: "#FFF8E7",
  dirt: "#5A3A28",
  dirtDark: "#2A1A12",
  treeLeaf: "#9AA44E",
  treeLeafDark: "#7F8A3F",
};

export type SkyStops = [number, string][];

export const SKY: Record<
  "dawn" | "day" | "afternoon" | "dusk" | "night",
  SkyStops
> = {
  dawn: [
    [0, "#8C88C0"],
    [0.45, "#E7A0A0"],
    [0.78, "#F8C28F"],
    [1, "#FCE1A9"],
  ],
  day: [
    [0, "#9DBFD8"],
    [0.45, "#D3DCC6"],
    [0.78, "#F3DDAE"],
    [1, "#FAE6B6"],
  ],
  afternoon: [
    [0, "#DA8360"],
    [0.45, "#EFA46A"],
    [0.78, "#F8C582"],
    [1, "#FCDDA3"],
  ],
  dusk: [
    [0, "#4F4474"],
    [0.45, "#A95E7C"],
    [0.78, "#E48C6C"],
    [1, "#F4B173"],
  ],
  night: [
    [0, "#0D1230"],
    [0.45, "#18204A"],
    [0.78, "#2B2A5C"],
    [1, "#433767"],
  ],
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// SVG ids must be unique per mounted instance: scenes overlap during transitions.
export const useSvgId = (prefix: string) => {
  const id = useId();
  return `${prefix}-${id.replace(/[^a-zA-Z0-9]/g, "")}`;
};

export const starPath = (outer: number, inner: number, points = 5) => {
  const coords: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / points) * i - Math.PI / 2;
    coords.push(`${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`);
  }
  return `M ${coords.join(" L ")} Z`;
};
