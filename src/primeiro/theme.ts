import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Bundled in public/fonts so rendering works offline (SIL OFL license).
const FAMILY = "Press Start 2P";
// Quoted for CSS: an unquoted family name containing "2P" is invalid.
export const PIXEL_FONT = `"${FAMILY}"`;

loadFont({
  family: FAMILY,
  url: staticFile("fonts/press-start-2p-latin-400-normal.woff2"),
  weight: "400",
});

export const FPS = 30;
