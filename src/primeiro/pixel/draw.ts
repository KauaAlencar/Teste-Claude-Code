import { random } from "remotion";
import { PAL, PalKey } from "./palette";

// Every helper here fills whole pixels at integer positions, so nothing is
// ever anti-aliased: the 320x180 canvas is scaled up with `pixelated`.

export type Ctx = CanvasRenderingContext2D;

export const px = (ctx: Ctx, x: number, y: number, c: PalKey) => {
  ctx.fillStyle = PAL[c];
  ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
};

export const rect = (ctx: Ctx, x: number, y: number, w: number, h: number, c: PalKey) => {
  ctx.fillStyle = PAL[c];
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};

// Rectangle with a 1px outline.
export const box = (
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  fill: PalKey,
  outline: PalKey = "K",
) => {
  rect(ctx, x, y, w, h, outline);
  rect(ctx, x + 1, y + 1, w - 2, h - 2, fill);
};

// Checkerboard of one colour over whatever is below: the pixel-art way to blend.
export const dither = (
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  c: PalKey,
  phase = 0,
) => {
  ctx.fillStyle = PAL[c];
  for (let yy = Math.round(y); yy < y + h; yy++) {
    for (let xx = Math.round(x); xx < x + w; xx++) {
      if ((xx + yy + phase) % 2 === 0) {
        ctx.fillRect(xx, yy, 1, 1);
      }
    }
  }
};

export const disc = (ctx: Ctx, cx: number, cy: number, r: number, c: PalKey) => {
  ctx.fillStyle = PAL[c];
  for (let yy = -r; yy <= r; yy++) {
    const half = Math.floor(Math.sqrt(r * r - yy * yy + r * 0.8));
    ctx.fillRect(Math.round(cx - half), Math.round(cy + yy), half * 2 + 1, 1);
  }
};

// Horizontal bands of colour, dithered where two bands meet.
export const bands = (ctx: Ctx, y: number, stops: [PalKey, number][], width = 320) => {
  let top = y;
  stops.forEach(([c, h], i) => {
    rect(ctx, 0, top, width, h, c);
    const next = stops[i + 1];
    if (next) {
      dither(ctx, 0, top + h - 2, width, 2, next[0]);
    }
    top += h;
  });
};

type SpriteOptions = { flip?: boolean; blink?: boolean };

export const sprite = (
  ctx: Ctx,
  rows: readonly string[],
  x: number,
  y: number,
  { flip = false, blink = false }: SpriteOptions = {},
) => {
  const w = rows[0].length;
  const ox = Math.round(x);
  const oy = Math.round(y);
  rows.forEach((row, ry) => {
    for (let rx = 0; rx < w; rx++) {
      let c = row[rx];
      if (c === ".") {
        continue;
      }
      if (c === "q") {
        c = blink ? "S" : "K";
      } else if (c === "x") {
        c = blink ? "S" : "W";
      }
      ctx.fillStyle = PAL[c as PalKey];
      ctx.fillRect(ox + (flip ? w - 1 - rx : rx), oy + ry, 1, 1);
    }
  });
};

// Blinks for `length` frames every `every` frames, offset by a seed.
export const isBlinking = (frame: number, every = 96, length = 5, seed = 0) =>
  (frame + seed) % every < length;

export const rand = (seed: string) => random(seed);

// ---------- Tiny 3x5 bitmap font for signs and the clock ----------
const GLYPHS: Record<string, string[]> = {
  A: [".#.", "#.#", "###", "#.#", "#.#"],
  B: ["##.", "#.#", "##.", "#.#", "##."],
  I: ["###", ".#.", ".#.", ".#.", "###"],
  L: ["#..", "#..", "#..", "#..", "###"],
  O: ["###", "#.#", "#.#", "#.#", "###"],
  Ó: ["###", "#.#", "#.#", "#.#", "###"],
  R: ["##.", "#.#", "##.", "#.#", "#.#"],
  T: ["###", ".#.", ".#.", ".#.", ".#."],
  ">": ["#..", ".#.", "..#", ".#.", "#.."],
  ":": ["...", ".#.", "...", ".#.", "..."],
  " ": ["...", "...", "...", "...", "..."],
  "0": ["###", "#.#", "#.#", "#.#", "###"],
  "1": [".#.", "##.", ".#.", ".#.", "###"],
  "2": ["###", "..#", "###", "#..", "###"],
  "3": ["###", "..#", "###", "..#", "###"],
  "4": ["#.#", "#.#", "###", "..#", "..#"],
  "5": ["###", "#..", "###", "..#", "###"],
  "6": ["###", "#..", "###", "#.#", "###"],
  "7": ["###", "..#", "..#", ".#.", ".#."],
  "8": ["###", "#.#", "###", "#.#", "###"],
  "9": ["###", "#.#", "###", "..#", "###"],
};

export const textWidth = (text: string) => text.length * 4 - 1;

export const tinyText = (ctx: Ctx, text: string, x: number, y: number, c: PalKey) => {
  text.split("").forEach((ch, i) => {
    const g = GLYPHS[ch] ?? GLYPHS[" "];
    const gx = x + i * 4;
    g.forEach((row, ry) => {
      row.split("").forEach((v, rx) => {
        if (v === "#") {
          px(ctx, gx + rx, y + ry, c);
        }
      });
    });
    if (ch === "Ó") {
      px(ctx, gx + 2, y - 2, c);
    }
  });
};
