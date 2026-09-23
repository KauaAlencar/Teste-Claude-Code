import React from "react";
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { Horse } from "../components/Horse";
import { Narration } from "../components/Narration";
import { Moon, Sky, Stars } from "../components/Scenery";
import { clamp, SERIF, SKY, starPath } from "../theme";

// 0–8s: starry sky, the title rises slowly.
export const Scene1Abertura: React.FC = () => {
  const frame = useCurrentFrame();

  const shooting = interpolate(frame, [150, 178], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0D1230" }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <Sky stops={SKY.night} />
        <Stars
          count={150}
          seed="abertura"
          height={780}
          opacity={interpolate(frame, [0, 45], [0.25, 1], clamp)}
        />
        <Moon x={1600} y={200} r={60} />

        {/* Shooting star */}
        <g opacity={Math.sin(Math.PI * shooting)}>
          <line
            x1={260 + shooting * 520}
            y1={120 + shooting * 150}
            x2={260 + shooting * 520 - 150}
            y2={120 + shooting * 150 - 44}
            stroke="#FFF6D8"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>

        {/* Hills, with the tiny silhouette of our horse and his star */}
        <path
          d="M -20 880 C 300 800 520 840 760 822 C 1000 804 1260 764 1520 800 C 1720 828 1850 818 1940 810 L 1940 1100 L -20 1100 Z"
          fill="#231E45"
        />
        <Horse
          x={520}
          y={836}
          scale={0.3}
          variant="hero"
          breathOffset={10}
          palette={{
            body: "#1A1734",
            far: "#15122B",
            mane: "#15122B",
            hoof: "#15122B",
            muzzle: "#1A1734",
            outline: "#15122B",
          }}
          blink={false}
        />
        <path
          d="M -20 952 C 380 902 700 942 1000 916 C 1300 892 1600 932 1940 906 L 1940 1100 L -20 1100 Z"
          fill="#171431"
        />
      </svg>

      <AbsoluteFill style={{ alignItems: "center", paddingTop: 250 }}>
        <Interactive.Div
          name="Estrela do título"
          style={{
            opacity: interpolate(frame, [10, 60], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.33, 0, 0.2, 1),
            }),
            scale: interpolate(frame, [10, 70], [0.4, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12 }),
              output: "perceptual-scale",
            }),
            marginBottom: 18,
          }}
        >
          <svg width={70} height={70} viewBox="-35 -35 70 70">
            <path
              d={starPath(26, 11)}
              fill="#FFF8E7"
              stroke="#FFF8E7"
              strokeWidth={4}
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 12px rgba(255, 236, 190, 0.9))" }}
            />
          </svg>
        </Interactive.Div>
        <Interactive.Div
          name="Título"
          style={{
            opacity: interpolate(frame, [20, 110], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.33, 0, 0.2, 1),
            }),
            translate: interpolate(frame, [20, 130], ["0px 40px", "0px 0px"], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            color: "#FFF1D6",
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 150,
            lineHeight: 1,
            textAlign: "center",
            textShadow: "0 0 40px rgba(255, 214, 150, 0.35), 0 4px 18px rgba(0, 0, 0, 0.4)",
          }}
        >
          O Cavalo que Lia Mentes
        </Interactive.Div>
      </AbsoluteFill>

      <Narration from={100} to={250}>
        Era uma vez um cavalo que podia ler mentes.
      </Narration>
    </AbsoluteFill>
  );
};
