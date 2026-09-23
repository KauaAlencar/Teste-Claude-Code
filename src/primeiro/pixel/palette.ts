// The whole pixel world (part 2) uses only these 24 colours.
export const PAL = {
  K: "#14101e", // outline / black
  D: "#2c2a40", // black trousers, deep shadow
  N: "#27325c", // navy polo
  n: "#1c2342", // navy shade
  B: "#3f6fb5", // blue roof, blanket
  L: "#8cc3ec", // sky, glass
  W: "#f6f2e9", // white
  g: "#c7c3bb", // light grey, silver
  G: "#7b7885", // grey, smoke
  S: "#f3c9a6", // skin
  s: "#d89a7c", // skin shade
  H: "#3e2518", // dark brown hair
  h: "#6b3f28", // brown, dark wood
  b: "#9a6236", // backpack, wood
  t: "#c99a62", // light wood, dirt road
  E: "#5da34c", // grass
  e: "#2f6a3c", // dark green
  Y: "#ffe28f", // light yellow, gold, sunlight
  O: "#f5902c", // orange
  R: "#d8452c", // red-orange
  A: "#b8691c", // amber
  U: "#5a3f7a", // purple
  C: "#ffb98c", // peach
  w: "#e9d8b8", // wall beige
} as const;

export type PalKey = keyof typeof PAL;

// Grid of the pixel world and how much it is scaled up to fill 1920x1080.
export const GRID_W = 320;
export const GRID_H = 180;
export const SCALE = 6;
