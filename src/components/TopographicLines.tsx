"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const horizontalLines = [
  "M-100 200 Q200 150 400 220 T800 180 T1200 240 T1600 200",
  "M-100 280 Q250 230 500 300 T900 260 T1300 320 T1600 280",
  "M-100 360 Q180 310 450 380 T850 340 T1250 400 T1600 360",
  "M-100 440 Q220 390 480 460 T880 420 T1280 480 T1600 440",
  "M-100 520 Q200 470 460 540 T860 500 T1260 560 T1600 520",
  "M-100 600 Q240 550 500 620 T900 580 T1300 640 T1600 600",
  "M-100 680 Q190 630 470 700 T870 660 T1270 720 T1600 680",
  "M-100 760 Q210 710 490 780 T890 740 T1290 800 T1600 760",
];

const curvedLines = [
  "M800 -50 Q1000 80 1100 200 Q1200 320 1050 450 Q900 580 700 500",
  "M900 -30 Q1080 100 1160 220 Q1240 340 1100 470 Q960 600 780 520",
  "M1000 -10 Q1160 120 1220 240 Q1280 360 1150 490 Q1020 620 860 540",
];

function LineGroup({
  className,
  stroke,
}: {
  className?: string;
  stroke: string;
}) {
  return (
    <g className={className}>
      {horizontalLines.map((d, i) => (
        <path key={`h-${i}`} d={d} stroke={stroke} strokeWidth="1" fill="none" />
      ))}
      {curvedLines.map((d, i) => (
        <path key={`c-${i}`} d={d} stroke={stroke} strokeWidth="1" fill="none" />
      ))}
    </g>
  );
}

export function TopographicLines() {
  const layer1Ref = useRef<SVGGElement>(null);
  const layer2Ref = useRef<SVGGElement>(null);
  const floatRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const layer1 = layer1Ref.current;
    const layer2 = layer2Ref.current;
    const float = floatRef.current;
    if (!layer1 || !layer2 || !float) return;

    const tweens: gsap.core.Tween[] = [];

    // Scroll horizontal continuo — efecto de líneas deslizándose
    tweens.push(
      gsap.to([layer1, layer2], {
        x: -1440,
        duration: 40,
        repeat: -1,
        ease: "none",
      })
    );

    // Flotación vertical suave en capa extra
    tweens.push(
      gsap.to(float, {
        y: 25,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    );

    // Oscilación lateral en las curvas
    tweens.push(
      gsap.to(float, {
        x: 35,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    );

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Capa 1 — scroll infinito */}
        <g ref={layer1Ref}>
          <LineGroup stroke="#D5D5D5" />
        </g>

        {/* Capa 2 — duplicada para loop seamless */}
        <g ref={layer2Ref} transform="translate(1440, 0)">
          <LineGroup stroke="#D5D5D5" />
        </g>

        {/* Capa flotante — movimiento orgánico extra */}
        <g ref={floatRef} opacity="0.6">
          {horizontalLines.map((d, i) => (
            <path
              key={`float-h-${i}`}
              d={d}
              stroke="#C8C8C8"
              strokeWidth="0.8"
              fill="none"
            />
          ))}
          {curvedLines.map((d, i) => (
            <path
              key={`float-c-${i}`}
              d={d}
              stroke="#C8C8C8"
              strokeWidth="0.8"
              fill="none"
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
