import React from "react";
import { useIds } from "./Bedroom";
import { COLORS } from "./colors";

// Front view, brushing his teeth in front of the bathroom mirror.
// `brush` is the side-to-side offset of the toothbrush hand, in px.

const Tattoos: React.FC = () => (
  <g stroke={COLORS.tattoo} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round">
    {/* A swallow in flight, near the wrist */}
    <g transform="translate(62 0) rotate(-8)">
      <path d="M -24 -2 C -16 -14 -8 -12 -2 -3 C 4 -12 14 -16 24 -8 C 14 -6 8 -2 4 3 L 0 6 L -4 3 C -10 -1 -16 -2 -24 -2 Z" />
      <path d="M 0 6 L -6 16 M 0 6 L 5 16" />
      <circle cx={-1} cy={-1} r={1} fill={COLORS.tattoo} />
    </g>
    {/* A cat's head, closer to the elbow */}
    <g transform="translate(150 2) rotate(90)">
      <path d="M -16 8 L -18 -14 L -7 -6 Q 0 -9 7 -6 L 18 -14 L 16 8 Q 0 22 -16 8 Z" />
      <path d="M -8 1 L -4 1 M 4 1 L 8 1" />
      <path d="M -2 7 L 0 9 L 2 7" />
      <path d="M -10 9 L -22 7 M -10 11 L -21 13 M 10 9 L 22 7 M 10 11 L 21 13" strokeWidth={1.6} />
    </g>
  </g>
);

export const HeroBust: React.FC<{ brush: number; blink: number; foam: number }> = ({
  brush,
  blink,
  foam,
}) => {
  const id = useIds("tiles", "light", "face", "shirt", "fade", "counter", "arm");
  const hand = { x: 838 + brush, y: 552 + brush * 0.25 };
  const wrist = { x: hand.x - 18, y: hand.y + 24 };
  const elbow = { x: 624, y: 828 };
  const fAngle = (Math.atan2(elbow.y - wrist.y, elbow.x - wrist.x) * 180) / Math.PI;
  const fLen = Math.hypot(elbow.x - wrist.x, elbow.y - wrist.y);

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" width={1920} height={1080} style={{ display: "block" }}>
      <defs>
        <linearGradient id={id.tiles} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D7E0DA" />
          <stop offset="1" stopColor="#C3CEC7" />
        </linearGradient>
        <radialGradient id={id.light} cx="820" cy="40" r="1300" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE6BF" stopOpacity={0.7} />
          <stop offset="0.5" stopColor="#FFD9A6" stopOpacity={0.18} />
          <stop offset="1" stopColor="#2A2A3A" stopOpacity={0.35} />
        </radialGradient>
        <radialGradient id={id.face} cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#F6D2B3" />
          <stop offset="0.7" stopColor={COLORS.skin} />
          <stop offset="1" stopColor={COLORS.skinShade} />
        </radialGradient>
        <linearGradient id={id.shirt} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#A9ACB2" />
          <stop offset="0.6" stopColor={COLORS.shirt} />
          <stop offset="1" stopColor={COLORS.shirtShade} />
        </linearGradient>
        <linearGradient id={id.fade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={COLORS.hair} stopOpacity={0.95} />
          <stop offset="0.6" stopColor={COLORS.hair} stopOpacity={0.45} />
          <stop offset="1" stopColor={COLORS.hair} stopOpacity={0} />
        </linearGradient>
        <linearGradient id={id.counter} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FBFAF6" />
          <stop offset="1" stopColor="#DAD6CC" />
        </linearGradient>
        <linearGradient id={id.arm} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4CDAE" />
          <stop offset="1" stopColor={COLORS.skinShade} />
        </linearGradient>
      </defs>

      {/* Bathroom wall with subway tiles, towel, shelf */}
      <rect width={1920} height={1080} fill={`url(#${id.tiles})`} />
      <g stroke="#B4C0B8" strokeWidth={3}>
        {Array.from({ length: 18 }, (_, r) => (
          <line key={`h${r}`} x1={0} x2={1920} y1={r * 60} y2={r * 60} />
        ))}
        {Array.from({ length: 18 }, (_, r) =>
          Array.from({ length: 17 }, (_, c) => {
            const x = c * 120 + (r % 2) * 60;
            return <line key={`v${r}-${c}`} x1={x} x2={x} y1={r * 60} y2={r * 60 + 60} />;
          }),
        )}
      </g>
      <rect x={150} y={300} width={24} height={24} rx={12} fill="#9A9DA3" />
      <path d="M 120 330 L 210 330 C 230 330 236 350 236 370 L 236 800 C 236 830 214 840 190 840 L 140 840 C 116 840 100 830 100 800 L 100 370 C 100 350 108 330 120 330 Z" fill="#F2A98A" />
      <path d="M 100 700 L 236 700 L 236 730 L 100 730 Z M 100 750 L 236 750 L 236 764 L 100 764 Z" fill="#F7D3BF" />
      <rect x={1480} y={560} width={300} height={22} rx={8} fill="#E8E4DA" />
      <path d="M 1560 470 L 1620 470 L 1612 560 L 1568 560 Z" fill="#8CC3EC" />
      <rect x={1584} y={420} width={10} height={70} rx={4} fill="#F5902C" transform="rotate(-10 1589 455)" />
      <rect x={1660} y={500} width={70} height={60} rx={14} fill="#F6F2E9" />

      {/* Shirt: loose grey tee */}
      <path
        d="M 520 1080 C 530 900 560 760 660 700 C 740 656 820 630 885 612 C 910 640 1010 640 1035 612 C 1100 630 1180 656 1260 700 C 1360 760 1390 900 1400 1080 Z"
        fill={`url(#${id.shirt})`}
      />
      <path d="M 885 612 C 910 650 1010 650 1035 612 C 1020 640 990 660 960 660 C 930 660 900 640 885 612 Z" fill={COLORS.shirtShade} />
      <g stroke={COLORS.shirtShade} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7}>
        <path d="M 760 820 C 800 880 790 960 820 1040" />
        <path d="M 1150 820 C 1120 900 1140 980 1110 1060" />
      </g>

      {/* Neck and head */}
      <path d="M 900 520 L 1020 520 L 1030 640 C 1000 660 920 660 890 640 Z" fill={COLORS.skinShade} />
      <ellipse cx={842} cy={422} rx={22} ry={40} fill={COLORS.skinShade} />
      <ellipse cx={1078} cy={422} rx={22} ry={40} fill={COLORS.skinShade} />
      <path d="M 1080 404 C 1088 414 1088 432 1080 442" stroke={COLORS.skinDeep} strokeWidth={4} fill="none" />
      <circle cx={1084} cy={466} r={8} fill="none" stroke={COLORS.silver} strokeWidth={3.5} />
      <path
        d="M 960 245 C 1030 245 1078 300 1080 380 C 1082 440 1066 490 1040 525 C 1015 556 990 568 960 568 C 930 568 905 556 880 525 C 854 490 838 440 840 380 C 842 300 890 245 960 245 Z"
        fill={`url(#${id.face})`}
      />
      {/* Faded sides */}
      <path d="M 842 300 C 846 360 850 390 858 410 C 866 380 872 340 880 300 Z" fill={`url(#${id.fade})`} />
      <path d="M 1078 300 C 1074 360 1070 390 1062 410 C 1054 380 1048 340 1040 300 Z" fill={`url(#${id.fade})`} />

      {/* Thick dark brows, brown eyes */}
      <path d="M 880 352 C 900 334 930 332 950 342 L 948 358 C 928 350 902 352 884 364 Z" fill={COLORS.brow} />
      <path d="M 1040 352 C 1020 334 990 332 970 342 L 972 358 C 992 350 1018 352 1036 364 Z" fill={COLORS.brow} />
      {[916, 1004].map((cx) =>
        blink > 0.5 ? (
          <path key={cx} d={`M ${cx - 26} 392 Q ${cx} 404 ${cx + 26} 392`} stroke={COLORS.line} strokeWidth={4} fill="none" strokeLinecap="round" />
        ) : (
          <g key={cx}>
            <path d={`M ${cx - 28} 392 Q ${cx} 372 ${cx + 28} 392 Q ${cx} 408 ${cx - 28} 392 Z`} fill="#FFFFFF" />
            <circle cx={cx + 1} cy={391} r={12} fill={COLORS.iris} />
            <circle cx={cx + 1} cy={391} r={6} fill="#1A0F0A" />
            <circle cx={cx + 5} cy={387} r={3.5} fill="#FFFFFF" />
            <path d={`M ${cx - 28} 392 Q ${cx} 372 ${cx + 28} 392`} stroke={COLORS.line} strokeWidth={4} fill="none" strokeLinecap="round" />
          </g>
        ),
      )}
      {/* Nose */}
      <path d="M 968 380 C 972 420 980 446 984 464 C 976 476 960 480 946 472" stroke={COLORS.skinDeep} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.7} />
      <ellipse cx={950} cy={474} rx={7} ry={4} fill={COLORS.skinDeep} opacity={0.7} />
      <ellipse cx={974} cy={474} rx={7} ry={4} fill={COLORS.skinDeep} opacity={0.7} />
      <ellipse cx={900} cy={470} rx={26} ry={14} fill="#F2A28A" opacity={0.25} />
      <ellipse cx={1020} cy={470} rx={26} ry={14} fill="#F2A28A" opacity={0.25} />

      {/* Mouth with the toothbrush and foam */}
      <ellipse cx={968} cy={518} rx={30} ry={13} fill="#6B2A2A" />
      <path d="M 936 512 C 950 502 986 502 1000 512" stroke={COLORS.lips} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M 938 524 C 954 534 984 534 998 524" stroke={COLORS.lips} strokeWidth={7} fill="none" strokeLinecap="round" />
      <line x1={hand.x + 20} y1={hand.y - 18} x2={978 + brush * 0.4} y2={516} stroke="#3FA3C6" strokeWidth={14} strokeLinecap="round" />
      <g fill="#FFFFFF" opacity={0.95}>
        <circle cx={936} cy={522} r={7 * foam + 2} />
        <circle cx={1000} cy={520} r={8 * foam + 2} />
        <circle cx={944 + brush * 0.2} cy={532} r={5 * foam + 1} />
        <circle cx={992} cy={532} r={4 * foam + 1} />
        <circle cx={968} cy={506} r={5 * foam} />
      </g>

      {/* Voluminous, wavy, messy top falling onto the forehead */}
      <path
        d="M 842 330 C 826 270 846 206 900 186 C 930 160 990 158 1020 180 C 1076 190 1102 250 1080 330 C 1060 300 1040 290 1010 286 C 980 282 940 284 910 290 C 880 296 858 310 842 330 Z"
        fill={COLORS.hair}
      />
      <g fill={COLORS.hair}>
        <circle cx={880} cy={204} r={40} />
        <circle cx={930} cy={178} r={46} />
        <circle cx={990} cy={176} r={46} />
        <circle cx={1042} cy={200} r={40} />
        <circle cx={1070} cy={244} r={30} />
        <circle cx={852} cy={250} r={30} />
        <path d="M 896 276 C 884 306 890 330 906 344 C 908 320 916 300 930 284 Z" />
        <path d="M 936 280 C 930 310 938 332 954 342 C 952 318 958 298 970 284 Z" />
        <path d="M 1004 282 C 1012 304 1010 324 1000 336 C 1016 324 1026 304 1024 286 Z" />
      </g>
      <g stroke={COLORS.hairLight} strokeWidth={5} fill="none" strokeLinecap="round">
        <path d="M 868 214 C 880 196 900 192 914 202" />
        <path d="M 924 180 C 940 164 962 164 974 176" />
        <path d="M 996 172 C 1012 164 1032 170 1040 186" />
        <path d="M 1048 222 C 1062 228 1070 240 1070 256" />
        <path d="M 900 300 C 896 316 900 328 908 336" />
      </g>

      {/* Right forearm (tattoos) raised to the mouth, hand holding the brush */}
      <path d={`M 700 700 C 660 740 630 780 ${elbow.x} ${elbow.y}`} stroke={COLORS.skinShade} strokeWidth={70} fill="none" strokeLinecap="round" />
      <path d="M 660 700 C 700 690 760 700 780 740 C 740 790 690 800 640 790 C 630 760 640 720 660 700 Z" fill={`url(#${id.shirt})`} />
      <g transform={`translate(${wrist.x} ${wrist.y}) rotate(${fAngle})`}>
        <path d={`M 0 -24 L ${fLen} -34 C ${fLen + 22} -30 ${fLen + 22} 30 ${fLen} 34 L 0 24 C -8 20 -8 -20 0 -24 Z`} fill={`url(#${id.arm})`} />
        <Tattoos />
      </g>
      <g transform={`translate(${hand.x} ${hand.y}) rotate(-20)`}>
        <ellipse cx={0} cy={0} rx={36} ry={30} fill={COLORS.skin} />
        <path d="M -22 -14 C -10 -18 8 -18 20 -12" stroke={COLORS.skinDeep} strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M -24 0 C -12 -4 8 -4 22 0 M -22 12 C -10 8 8 8 18 12" stroke={COLORS.skinShade} strokeWidth={3} fill="none" strokeLinecap="round" />
        <path d="M 18 -20 C 30 -24 38 -18 36 -8" stroke={COLORS.skinShade} strokeWidth={10} fill="none" strokeLinecap="round" />
      </g>

      {/* Left arm resting on the sink: black watch, silver ring */}
      <path d="M 1270 710 C 1300 800 1320 900 1336 990" stroke={COLORS.skin} strokeWidth={62} fill="none" strokeLinecap="round" />
      <path d="M 1300 720 C 1316 800 1330 900 1340 990" stroke={COLORS.skinShade} strokeWidth={18} fill="none" strokeLinecap="round" opacity={0.6} />
      <path d="M 1240 690 C 1290 680 1340 700 1350 760 C 1320 800 1270 800 1236 780 C 1226 750 1226 710 1240 690 Z" fill={`url(#${id.shirt})`} />
      <rect x={1298} y={930} width={70} height={30} rx={6} fill={COLORS.watch} transform="rotate(-8 1333 945)" />
      <circle cx={1334} cy={944} r={20} fill="#26262E" stroke="#4A4A55" strokeWidth={4} />
      <path d="M 1334 944 L 1334 932 M 1334 944 L 1342 948" stroke="#D9DCE2" strokeWidth={2.5} strokeLinecap="round" />

      {/* Sink counter in front */}
      <rect x={0} y={990} width={1920} height={90} fill={`url(#${id.counter})`} />
      <rect x={0} y={990} width={1920} height={6} fill="#FFFFFF" />
      <g>
        <ellipse cx={1350} cy={1000} rx={48} ry={26} fill={COLORS.skin} />
        <path d="M 1316 994 C 1330 1010 1360 1014 1388 1004" stroke={COLORS.skinShade} strokeWidth={4} fill="none" strokeLinecap="round" />
        <rect x={1356} y={992} width={16} height={8} rx={3} fill={COLORS.silver} />
      </g>

      {/* Warm vanity light from above */}
      <rect width={1920} height={1080} fill={`url(#${id.light})`} />
    </svg>
  );
};
