import { drawHero } from "./characters";
import {
  bands,
  box,
  Ctx,
  disc,
  dither,
  px,
  rand,
  rect,
  sprite,
  textWidth,
  tinyText,
} from "./draw";
import { PalKey } from "./palette";
import { SPRITES } from "./sprites";

const clip = (ctx: Ctx, x: number, y: number, w: number, h: number, paint: () => void) => {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  paint();
  ctx.restore();
};

export const tree = (ctx: Ctx, x: number, ground: number, r = 14) => {
  rect(ctx, x - 3, ground - r - 12, 6, r + 12, "K");
  rect(ctx, x - 2, ground - r - 12, 4, r + 12, "h");
  disc(ctx, x, ground - r - 16, r + 1, "K");
  disc(ctx, x, ground - r - 16, r, "e");
  disc(ctx, x - 2, ground - r - 18, r - 3, "E");
  px(ctx, x - 5, ground - r - 23, "Y");
};

// ---------------------------------------------------------------- Bedroom
// Same layout as the illustrated room: bed on the left with the pillow at the
// right end, nightstand with lamp and clock, window, door on the far right.
export const ROOM = { blanketTop: 99, floor: 120 };

const clockDigits = (ctx: Ctx, x: number, y: number, c: PalKey) => {
  // "7:00" with a narrow colon so it fits the little clock.
  tinyText(ctx, "7", x, y, c);
  px(ctx, x + 4, y + 1, c);
  px(ctx, x + 4, y + 3, c);
  tinyText(ctx, "00", x + 6, y, c);
};

export const drawRoom = (
  ctx: Ctx,
  frame: number,
  {
    hero,
    blink = false,
    eyesClosed = false,
    heroDx = 0,
    heroDy = 0,
  }: {
    hero: "lying" | "sitting" | "handsUp" | "none";
    blink?: boolean;
    eyesClosed?: boolean;
    heroDx?: number;
    heroDy?: number;
  },
) => {
  // Wall with a little pattern, baseboard, floor planks
  rect(ctx, 0, 0, 320, 120, "w");
  for (let y = 8; y < 110; y += 12) {
    for (let x = (y / 12) % 2 === 0 ? 6 : 12; x < 320; x += 12) {
      px(ctx, x, y, "t");
    }
  }
  rect(ctx, 0, 113, 320, 7, "b");
  rect(ctx, 0, 113, 320, 1, "h");
  rect(ctx, 0, 120, 320, 60, "t");
  for (let y = 127, i = 0; y < 180; y += 8, i++) {
    rect(ctx, 0, y, 320, 1, "b");
    for (let x = (i % 2) * 20; x < 320; x += 40) {
      rect(ctx, x, y - 7, 1, 7, "b");
    }
  }

  // Window with the morning outside
  rect(ctx, 174, 14, 84, 2, "h");
  box(ctx, 186, 20, 60, 62, "W");
  clip(ctx, 189, 23, 54, 56, () => {
    bands(ctx, 23, [
      ["L", 22],
      ["C", 16],
      ["Y", 20],
    ]);
    disc(ctx, 232, 66, 8, "Y");
    disc(ctx, 232, 66, 5, "W");
    rect(ctx, 189, 70, 54, 9, "e");
    rect(ctx, 196, 66, 10, 5, "R");
    rect(ctx, 212, 68, 8, 3, "B");
  });
  rect(ctx, 214, 23, 3, 56, "W");
  rect(ctx, 189, 49, 54, 3, "W");
  for (const cx of [176, 244]) {
    rect(ctx, cx, 16, 12, 78, "K");
    rect(ctx, cx + 1, 16, 10, 77, "B");
    for (let fx = cx + 3; fx < cx + 11; fx += 3) {
      rect(ctx, fx, 17, 1, 76, "n");
    }
  }

  // Sunbeam on the wall and the floor
  for (let y = 83; y < 170; y++) {
    const t = (y - 83) / 87;
    const x0 = Math.round(190 - t * 70);
    const x1 = Math.round(242 - t * 46);
    for (let x = x0; x < x1; x++) {
      if ((x + y) % 2 === 0) {
        px(ctx, x, y, "Y");
      }
    }
  }

  // Poster and shelf
  box(ctx, 30, 26, 28, 34, "U");
  for (let i = 0; i < 10; i++) {
    rect(ctx, 34 + i, 52 - i, 20 - i * 2, 1, "e");
  }
  disc(ctx, 50, 34, 3, "Y");
  rect(ctx, 68, 46, 50, 3, "h");
  const books: [number, number, PalKey][] = [
    [70, 10, "B"],
    [74, 8, "R"],
    [78, 11, "E"],
    [83, 9, "Y"],
    [87, 10, "U"],
    [100, 7, "O"],
  ];
  books.forEach(([bx, bh, c]) => box(ctx, bx, 46 - bh, 4, bh, c));

  // Door
  box(ctx, 266, 34, 36, 86, "b");
  box(ctx, 271, 40, 26, 30, "b", "h");
  box(ctx, 271, 76, 26, 38, "b", "h");
  px(ctx, 296, 80, "Y");
  px(ctx, 296, 81, "Y");

  // Rug
  rect(ctx, 150, 146, 104, 16, "K");
  rect(ctx, 151, 147, 102, 14, "U");
  for (let x = 153; x < 251; x += 4) {
    px(ctx, x, 149, "C");
    px(ctx, x + 2, 158, "C");
  }

  // Bed: shadow, headboard, mattress, pillow
  dither(ctx, 16, 118, 112, 3, "b");
  box(ctx, 128, 72, 10, 48, "h");
  rect(ctx, 130, 74, 6, 44, "b");
  box(ctx, 14, 102, 118, 10, "W");
  rect(ctx, 15, 110, 116, 1, "g");
  rect(ctx, 16, 111, 3, 9, "h");
  rect(ctx, 124, 111, 3, 9, "h");
  box(ctx, 100, 84, 28, 17, "W");
  rect(ctx, 101, 98, 26, 2, "g");

  if (hero === "lying") {
    // Asleep, head on the pillow, blanket up to the chin
    drawHero(ctx, { x: 101, y: 80 + heroDy, pose: "front", blink: eyesClosed || blink });
  } else if (hero === "sitting" || hero === "handsUp") {
    drawHero(ctx, {
      x: 101 + heroDx,
      y: 72 + heroDy,
      pose: hero === "handsUp" ? "handsUp" : "front",
      blink,
    });
  }

  // Blanket (covers the hero from the waist or the neck down)
  const top = hero === "lying" ? 94 : ROOM.blanketTop;
  const right = 126;
  box(ctx, 14, top, right - 14, 114 - top, "B");
  rect(ctx, 15, top + 1, right - 16, 2, "L");
  for (let fx = 30; fx < right - 6; fx += 18) {
    rect(ctx, fx, top + 4, 1, 110 - top - 4, "n");
  }
  box(ctx, 8, 92, 8, 28, "h");

  // Nightstand, lamp (off) and clock
  box(ctx, 140, 96, 30, 24, "b");
  rect(ctx, 141, 106, 28, 1, "h");
  px(ctx, 155, 101, "Y");
  px(ctx, 155, 111, "Y");
  rect(ctx, 144, 92, 7, 4, "g");
  rect(ctx, 146, 84, 2, 8, "K");
  for (let i = 0; i < 8; i++) {
    rect(ctx, 144 - Math.floor(i / 2), 76 + i, 6 + Math.floor(i / 2) * 2, 1, i === 7 ? "K" : "C");
  }
  box(ctx, 153, 87, 17, 9, "K");
  clockDigits(ctx, 155, 89, "R");
  void frame;
};

// ---------------------------------------------------------- Window view
export const drawWindowView = (ctx: Ctx, frame: number) => {
  bands(ctx, 0, [
    ["L", 40],
    ["C", 26],
    ["Y", 30],
  ]);
  disc(ctx, 250, 86, 12, "Y");
  disc(ctx, 250, 86, 8, "W");
  // Clouds drifting in steps
  const drift = Math.floor(frame / 6);
  for (const [cx, cy] of [
    [60, 24],
    [180, 16],
  ]) {
    const x = cx + drift;
    rect(ctx, x, cy, 30, 6, "W");
    rect(ctx, x + 6, cy - 4, 14, 4, "W");
  }
  // Hills and the little town
  for (let x = 0; x < 320; x++) {
    const h = Math.round(92 + 6 * Math.sin(x * 0.035) + 3 * Math.sin(x * 0.09));
    rect(ctx, x, h, 1, 180 - h, "e");
  }
  rect(ctx, 0, 104, 320, 76, "E");
  dither(ctx, 0, 104, 320, 2, "e");
  // Dirt paths
  for (let y = 104; y < 180; y++) {
    const cx = Math.round(160 + Math.sin(y * 0.08) * 26 + (y - 104) * 0.6);
    rect(ctx, cx - 4 - Math.floor((y - 104) / 10), y, 8 + Math.floor((y - 104) / 5), 1, "t");
  }
  rect(ctx, 20, 132, 110, 5, "t");
  rect(ctx, 200, 124, 120, 5, "t");
  const house = (x: number, y: number, roof: PalKey) => {
    box(ctx, x, y, 26, 18, "w");
    for (let i = 0; i < 9; i++) {
      rect(ctx, x - 3 + i, y - 1 - i, 32 - i * 2, 1, i === 8 ? "K" : roof);
    }
    rect(ctx, x + 10, y + 8, 6, 10, "h");
    box(ctx, x + 3, y + 4, 5, 5, "L");
    box(ctx, x + 18, y + 4, 5, 5, "L");
  };
  house(40, 112, "R");
  house(96, 108, "B");
  house(214, 106, "U");
  house(262, 114, "R");
  tree(ctx, 20, 124, 10);
  tree(ctx, 150, 122, 9);
  tree(ctx, 196, 120, 8);
  tree(ctx, 300, 128, 10);
  // Window frame around the view
  rect(ctx, 0, 0, 320, 8, "w");
  rect(ctx, 0, 0, 10, 180, "w");
  rect(ctx, 310, 0, 10, 180, "w");
  rect(ctx, 0, 132, 320, 48, "w");
  // White frame (outlined) and the cross bar
  rect(ctx, 10, 8, 300, 6, "K");
  rect(ctx, 11, 9, 298, 4, "W");
  rect(ctx, 10, 126, 300, 6, "K");
  rect(ctx, 11, 127, 298, 4, "W");
  rect(ctx, 10, 8, 6, 124, "K");
  rect(ctx, 11, 9, 4, 122, "W");
  rect(ctx, 304, 8, 6, 124, "K");
  rect(ctx, 305, 9, 4, 122, "W");
  rect(ctx, 157, 13, 6, 114, "K");
  rect(ctx, 158, 13, 4, 114, "W");
  rect(ctx, 4, 130, 312, 5, "t");
  rect(ctx, 4, 135, 312, 1, "b");
};

// ---------------------------------------------------------------- Town
// Everything the camera needs to show stays above y=136: the dialogue box
// covers the bottom of the screen.
export const TOWN_WIDTH = 760;
export const TOWN_FEET = 135;
const TOWN_GROUND = 124;

const townHouse = (ctx: Ctx, x: number, w: number, roof: PalKey) => {
  const g = TOWN_GROUND;
  box(ctx, x, g - 50, w, 50, "w");
  rect(ctx, x + 1, g - 5, w - 2, 4, "t");
  for (let i = 0; i < 16; i++) {
    const c: PalKey = i === 15 ? "K" : i % 4 === 0 ? "h" : roof;
    rect(ctx, x - 6 + i, g - 51 - i, w + 12 - i * 2, 1, c);
  }
  box(ctx, x + w - 24, g - 26, 13, 26, "h");
  px(ctx, x + w - 14, g - 13, "Y");
  box(ctx, x + 8, g - 40, 14, 12, "L");
  rect(ctx, x + 14, g - 39, 1, 10, "W");
  px(ctx, x + 10, g - 38, "W");
};

export const drawTown = (ctx: Ctx, camX: number, frame: number) => {
  const cx = Math.round(camX);
  bands(ctx, 0, [
    ["L", 54],
    ["C", 22],
    ["Y", 22],
  ]);
  // Clouds (far, slow)
  for (const [wx, wy] of [
    [40, 16],
    [190, 28],
    [360, 14],
    [520, 24],
  ]) {
    const x = wx - Math.round(cx * 0.2);
    rect(ctx, x, wy, 36, 7, "W");
    rect(ctx, x + 8, wy - 5, 16, 5, "W");
  }
  // Hills (parallax)
  for (let sx = 0; sx < 320; sx++) {
    const wx = sx + Math.round(cx * 0.5);
    const h = Math.round(90 + 7 * Math.sin(wx * 0.03) + 4 * Math.sin(wx * 0.071));
    rect(ctx, sx, h, 1, 124 - h, "e");
  }
  // Ground and road
  rect(ctx, 0, 112, 320, 68, "E");
  dither(ctx, 0, 112, 320, 2, "e");
  rect(ctx, 0, 126, 320, 14, "t");
  rect(ctx, 0, 126, 320, 1, "b");
  rect(ctx, 0, 139, 320, 1, "b");
  for (let i = 0; i < 70; i++) {
    const wx = Math.floor(rand(`peb-${i}`) * TOWN_WIDTH);
    px(ctx, wx - cx, 128 + Math.floor(rand(`peb-y-${i}`) * 10), "b");
    const fx = Math.floor(rand(`flw-${i}`) * TOWN_WIDTH);
    const fy = 114 + Math.floor(rand(`flw-y-${i}`) * 10);
    px(ctx, fx - cx, fy, i % 3 === 0 ? "Y" : i % 3 === 1 ? "R" : "W");
  }

  const at = (wx: number) => wx - cx;
  townHouse(ctx, at(8), 76, "R");
  townHouse(ctx, at(236), 64, "B");
  townHouse(ctx, at(384), 60, "U");
  for (const wx of [118, 196, 330, 468, 556]) {
    tree(ctx, at(wx), 126, 13);
  }
  // Fence
  for (let wx = 300; wx < 372; wx += 8) {
    rect(ctx, at(wx), 110, 3, 14, "K");
    rect(ctx, at(wx) + 1, 111, 1, 12, "b");
  }
  rect(ctx, at(300), 114, 72, 2, "b");

  // Signpost pointing to the lab
  rect(ctx, at(510), 100, 3, 26, "h");
  box(ctx, at(496), 90, 32, 12, "t");
  tinyText(ctx, "LAB>", at(496) + Math.floor((32 - textWidth("LAB>")) / 2), 94, "K");

  // The laboratory: white walls, blue roof, sign
  const lx = at(596);
  const g = TOWN_GROUND;
  box(ctx, lx, g - 74, 148, 74, "W");
  rect(ctx, lx + 1, g - 9, 146, 8, "g");
  for (let i = 0; i < 12; i++) {
    rect(ctx, lx - 8 + i, g - 75 - i, 164 - i * 2, 1, i === 11 ? "K" : i % 3 === 0 ? "n" : "B");
  }
  rect(ctx, lx + 118, g - 100, 3, 14, "g");
  disc(ctx, lx + 119, g - 102, 4, "g");
  box(ctx, lx + 34, g - 68, 80, 13, "N");
  tinyText(ctx, "LABORATÓRIO", lx + 34 + Math.floor((80 - textWidth("LABORATÓRIO")) / 2), g - 63, "W");
  box(ctx, lx + 60, g - 36, 28, 36, "L");
  rect(ctx, lx + 73, g - 35, 2, 34, "g");
  px(ctx, lx + 63, g - 32, "W");
  px(ctx, lx + 64, g - 31, "W");
  box(ctx, lx + 12, g - 50, 28, 20, "L");
  box(ctx, lx + 108, g - 50, 28, 20, "L");
  void frame;
};

// ------------------------------------------------------------ Laboratory
export const EGGS = [124, 159, 194];
export const TABLE_TOP = 92;
export const LAB_FEET = 132;

export const drawLab = (ctx: Ctx, frame: number, { eggs = [true, true, true] } = {}) => {
  rect(ctx, 0, 0, 320, 90, "W");
  for (let y = 8; y < 86; y += 12) {
    rect(ctx, 0, y, 320, 1, "g");
    for (let x = (y / 4) % 2 === 0 ? 0 : 8; x < 320; x += 16) {
      px(ctx, x, y + 6, "g");
    }
  }
  rect(ctx, 0, 84, 320, 6, "B");
  rect(ctx, 0, 84, 320, 1, "n");
  for (let y = 90; y < 180; y += 8) {
    for (let x = 0; x < 320; x += 8) {
      rect(ctx, x, y, 8, 8, ((x + y - 90) / 8) % 2 === 0 ? "W" : "L");
    }
  }

  // Console with a scrolling graph and blinking buttons
  box(ctx, 10, 22, 54, 66, "g");
  box(ctx, 16, 28, 42, 26, "e");
  for (let x = 0; x < 40; x++) {
    const y = Math.round(41 + Math.sin((x + Math.floor(frame / 3)) * 0.4) * 6);
    px(ctx, 17 + x, y, "E");
  }
  (["R", "Y", "E", "B"] as PalKey[]).forEach((c, i) => {
    const on = (Math.floor(frame / 10) + i) % 3 !== 0;
    rect(ctx, 18 + i * 10, 62, 5, 4, on ? c : "G");
  });
  rect(ctx, 18, 72, 38, 3, "G");

  // Poster of a capsule
  box(ctx, 80, 14, 26, 32, "w");
  sprite(ctx, SPRITES.EGG, 86, 22);

  // Shelves with bottles
  for (const sy of [26, 52]) {
    rect(ctx, 240, sy, 66, 3, "h");
    (["B", "E", "R", "Y", "U", "O"] as PalKey[]).forEach((c, i) => {
      box(ctx, 244 + i * 10, sy - 10 + (i % 2) * 2, 6, 10 - (i % 2) * 2, c);
    });
  }

  // Table
  box(ctx, 108, TABLE_TOP, 114, 7, "b");
  rect(ctx, 109, TABLE_TOP + 1, 112, 1, "t");
  box(ctx, 112, TABLE_TOP + 6, 5, 30, "h");
  box(ctx, 213, TABLE_TOP + 6, 5, 30, "h");

  // Capsules: bands shine in turn, sparkles pop around them
  EGGS.forEach((ex, i) => {
    if (!eggs[i]) {
      return;
    }
    const shine = (Math.floor(frame / 6) - i * 3) % 14 === 0;
    const rows = shine ? SPRITES.EGG.map((r) => r.replace(/Y/g, "W")) : SPRITES.EGG;
    sprite(ctx, rows, ex, TABLE_TOP - 16);
    const sp = Math.floor(frame / 9) + i * 5;
    if (sp % 4 === 0) {
      sprite(ctx, SPRITES.SPARK, ex - 3 + ((sp * 7) % 18), TABLE_TOP - 22 + ((sp * 5) % 12));
    }
  });
};

// ---------------------------------------------------- Sunrise road (end)
export const drawSunriseRoad = (ctx: Ctx, frame: number) => {
  bands(ctx, 0, [
    ["U", 24],
    ["C", 34],
    ["O", 14],
    ["Y", 24],
  ]);
  // Sun rising at the end of the road, rays blinking in steps
  const rays = Math.floor(frame / 8) % 2 === 0;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const len = rays ? 28 : 22;
    for (let r = 18; r < len; r += 2) {
      px(ctx, 232 + Math.round(Math.cos(a) * r), 90 + Math.round(Math.sin(a) * r), "Y");
    }
  }
  disc(ctx, 232, 90, 15, "Y");
  disc(ctx, 232, 90, 10, "W");

  rect(ctx, 0, 96, 320, 84, "E");
  rect(ctx, 0, 96, 320, 6, "e");
  dither(ctx, 0, 102, 320, 3, "e");
  for (let y = 97; y < 180; y++) {
    const t = (y - 96) / 84;
    const x0 = Math.round(231 - t * 150);
    const x1 = Math.round(233 + t * 30);
    rect(ctx, x0, y, x1 - x0, 1, "t");
    px(ctx, x0, y, "b");
    px(ctx, x1, y, "b");
  }
  tree(ctx, 280, 132, 12);
  tree(ctx, 256, 110, 6);
  tree(ctx, 196, 108, 5);
  tree(ctx, 170, 124, 9);

  // Laboratory on the left
  box(ctx, -10, 80, 96, 84, "W");
  rect(ctx, -9, 154, 94, 9, "g");
  for (let i = 0; i < 10; i++) {
    rect(ctx, -16 + i, 79 - i, 110 - i * 2, 1, i === 9 ? "K" : i % 3 === 0 ? "n" : "B");
  }
  box(ctx, 44, 124, 26, 40, "L");
  rect(ctx, 56, 125, 2, 38, "g");
  box(ctx, 6, 102, 24, 18, "L");
};
