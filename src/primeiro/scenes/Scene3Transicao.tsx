import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { Bedroom } from "../illustrated/Bedroom";
import { HeroInBed, LIE_ANGLE } from "../illustrated/HeroInBed";
import { PAL } from "../pixel/palette";
import { drawRoom } from "../pixel/world";

const W = 1920;
const H = 1080;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Block sizes (screen px), each held for a few frames: pixels growing, then shrinking
// back down to the 6px grid of the pixel world.
const GROW = [2, 3, 4, 6, 8, 12, 20, 30, 40, 60, 120];
const SHRINK = [60, 40, 30, 20, 12, 6];
const GROW_FROM = 14;
const REORDER_FROM = 62;
const SHRINK_FROM = 90;
const HOLD = 4;
const COLS = 16;
const ROWS = 9;
const BIG = 120;

// The sunlit illustrated bedroom, rendered once to an image.
const useIllustration = () => {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [handle] = useState(() => delayRender("Rasterizing the illustrated bedroom"));
  useEffect(() => {
    const markup = renderToStaticMarkup(
      <Bedroom lamp={0} night={0} sun={1} clock="07:00">
        <HeroInBed
          angle={LIE_ANGLE}
          blanketEdge={640}
          hand={{ x: 470, y: 522 }}
          bend="down"
          eyesClosed={1}
        />
      </Bedroom>,
    );
    const image = new Image();
    image.onload = () => {
      setImg(image);
      continueRender(handle);
    };
    image.onerror = () => cancelRender(new Error("Could not rasterize the bedroom illustration"));
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  }, [handle]);
  return img;
};

const makeCanvas = (w: number, h: number) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
};

// Averages `src` down to (W/b x H/b) blocks.
const shrink = (src: CanvasImageSource, srcW: number, srcH: number, b: number) => {
  const small = makeCanvas(Math.round(W / b), Math.round(H / b));
  const sctx = small.getContext("2d")!;
  sctx.imageSmoothingEnabled = true;
  sctx.imageSmoothingQuality = "high";
  sctx.drawImage(src, 0, 0, srcW, srcH, 0, 0, small.width, small.height);
  return small;
};

const blowUp = (ctx: CanvasRenderingContext2D, small: HTMLCanvasElement) => {
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(small, 0, 0, small.width, small.height, 0, 0, W, H);
};

const glitch = (ctx: CanvasRenderingContext2D, f: number, intensity: number) => {
  if (intensity <= 0) {
    return;
  }
  const slices = Math.floor(intensity * 7 * random(`slices-${f}`)) + (random(`on-${f}`) < intensity ? 1 : 0);
  for (let k = 0; k < slices; k++) {
    const y = Math.floor(random(`y-${f}-${k}`) * (H / 6)) * 6;
    const h = (1 + Math.floor(random(`h-${f}-${k}`) * 8)) * 6;
    const dx = Math.round(((random(`dx-${f}-${k}`) - 0.5) * 2 * 150 * intensity) / 6) * 6;
    ctx.drawImage(ctx.canvas, 0, y, W, h, dx, y, W, h);
  }
  const lines = Math.floor(intensity * 6 * random(`lines-${f}`));
  const colors = [PAL.W, PAL.L, PAL.R, PAL.Y];
  for (let k = 0; k < lines; k++) {
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = colors[k % colors.length];
    const y = Math.floor(random(`ly-${f}-${k}`) * (H / 6)) * 6;
    const x = Math.floor(random(`lx-${f}-${k}`) * W * 0.6);
    ctx.fillRect(x, y, W * (0.2 + random(`lw-${f}-${k}`) * 0.6), 6);
  }
  ctx.globalAlpha = 1;
};

// 16–20s: the sun hits the room and the image turns into pixels.
export const Scene3Transicao: React.FC = () => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  const illustration = useIllustration();

  const pixelRoom = useMemo(() => {
    const c = makeCanvas(320, 180);
    drawRoom(c.getContext("2d")!, 0, { hero: "lying", eyesClosed: true });
    return c;
  }, []);

  // Which illustrated block ends up where, and when each one changes colour.
  const order = useMemo(() => {
    const cells = Array.from({ length: COLS * ROWS }, (_, i) => i);
    for (let i = cells.length - 1; i > 0; i--) {
      const j = Math.floor(random(`perm-${i}`) * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    return cells.map((from, to) => ({
      from,
      to,
      delay: Math.floor(random(`delay-${to}`) * 8),
      swap: 0.35 + random(`swap-${to}`) * 0.3,
    }));
  }, []);

  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx || !illustration) {
      return;
    }
    ctx.fillStyle = PAL.K;
    ctx.fillRect(0, 0, W, H);

    if (frame < GROW_FROM) {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(illustration, 0, 0, W, H);
    } else if (frame < REORDER_FROM) {
      const b = GROW[Math.min(GROW.length - 1, Math.floor((frame - GROW_FROM) / HOLD))];
      blowUp(ctx, shrink(illustration, W, H, b));
    } else if (frame < SHRINK_FROM) {
      // Big blocks fly from the illustrated picture into the pixel room
      const from = shrink(illustration, W, H, BIG);
      const to = shrink(pixelRoom, 320, 180, BIG);
      const f = Math.floor((frame - REORDER_FROM) / 2) * 2;
      // The board underneath switches halfway, so moving blocks never leave holes.
      blowUp(ctx, f < 13 ? from : to);
      order.forEach((cell) => {
        const t = interpolate(f - cell.delay, [0, 18], [0, 1], clamp);
        const e = t * t * (3 - 2 * t);
        const fx = (cell.from % COLS) * BIG;
        const fy = Math.floor(cell.from / COLS) * BIG;
        const tx = (cell.to % COLS) * BIG;
        const ty = Math.floor(cell.to / COLS) * BIG;
        const x = Math.round((fx + (tx - fx) * e) / 12) * 12;
        const y = Math.round((fy + (ty - fy) * e) / 12) * 12;
        const useTarget = t >= cell.swap;
        const src = useTarget ? to : from;
        const idx = useTarget ? cell.to : cell.from;
        ctx.drawImage(src, idx % COLS, Math.floor(idx / COLS), 1, 1, x, y, BIG, BIG);
      });
    } else {
      const b = SHRINK[Math.min(SHRINK.length - 1, Math.floor((frame - SHRINK_FROM) / HOLD))];
      blowUp(ctx, shrink(pixelRoom, 320, 180, b));
    }

    glitch(
      ctx,
      frame,
      interpolate(frame, [8, 30, 62, 90, 108, 116], [0, 0.55, 1, 0.8, 0.15, 0], clamp),
    );
  }, [frame, illustration, order, pixelRoom]);

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.K }}>
      <canvas ref={ref} width={W} height={H} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};
