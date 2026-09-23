import React, { useLayoutEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Ctx } from "./draw";
import { GRID_H, GRID_W, PAL } from "./palette";

// A 320x180 canvas scaled 6x without smoothing. `draw` paints one frame.
export const PixelCanvas: React.FC<{
  draw: (ctx: Ctx, frame: number) => void;
  children?: React.ReactNode;
}> = ({ draw, children }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const frame = useCurrentFrame();

  useLayoutEffect(() => {
    const ctx = ref.current?.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, GRID_W, GRID_H);
    draw(ctx, frame);
  }, [draw, frame]);

  return (
    <AbsoluteFill style={{ backgroundColor: PAL.K }}>
      <canvas
        ref={ref}
        width={GRID_W}
        height={GRID_H}
        style={{ width: "100%", height: "100%", imageRendering: "pixelated" }}
      />
      {children}
    </AbsoluteFill>
  );
};

// Retro block wipe: 16px squares appear diagonally. progress 0 = clear, 1 = black.
export const blockWipe = (ctx: Ctx, progress: number) => {
  if (progress <= 0) {
    return;
  }
  ctx.fillStyle = PAL.K;
  const cols = GRID_W / 16;
  const rows = Math.ceil(GRID_H / 16);
  for (let by = 0; by < rows; by++) {
    for (let bx = 0; bx < cols; bx++) {
      const threshold = (bx + by) / (cols + rows - 1);
      if (progress >= threshold) {
        ctx.fillRect(bx * 16, by * 16, 16, 16);
      }
    }
  }
};

// Progress of a wipe that runs over `length` frames starting at `start`, in whole steps.
export const wipeProgress = (frame: number, start: number, length = 8) =>
  Math.min(1, Math.max(0, Math.floor(frame - start + 1) / length));
