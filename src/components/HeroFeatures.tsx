"use client";

import { useEffect, useRef, type ReactNode } from "react";
import OneAppIcon from "@iconify-react/arcticons/one-app";
import gsap from "gsap";
import { LiquidGlassFrame } from "./ui/liquid-glass-frame";
import { LiquidGlassDivider } from "./ui/liquid-glass-divider";

const features = [
  {
    label: "LA MEJOR SONRISA",
    icon: (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/images/dientes3d.png"
        alt=""
        width={1818}
        height={865}
        className="h-10 w-auto max-w-full object-contain [image-rendering:auto] md:h-16 lg:h-[4.5rem]"
        draggable={false}
        aria-hidden
      />
    ),
  },
  {
    label: "NÚMERO UNO EN ESTADOS UNIDOS",
    icon: (
      <span className="inline-flex text-4xl text-[#1B3022] md:text-6xl lg:text-7xl">
        <OneAppIcon height="1em" />
      </span>
    ),
  },
];

function FeatureCell({
  label,
  icon,
  className = "",
}: {
  label: string;
  icon: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center px-3 py-4 text-center md:px-5 md:py-6 ${className}`}
    >
      <div className="mb-2 flex h-10 w-full items-center justify-center md:mb-3 md:h-16 lg:h-[4.5rem]">
        {icon}
      </div>
      <span className="text-[0.55rem] font-semibold leading-tight tracking-[0.1em] text-[#1B3022] md:text-[0.6rem] lg:text-[0.65rem]">
        {label}
      </span>
    </div>
  );
}

export function HeroFeatures() {
  const mobileRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targets = [mobileRef.current, desktopRef.current].filter(Boolean);
    if (!targets.length) return;

    const tween = gsap.fromTo(
      targets,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, delay: 0.6, ease: "power3.out" }
    );

    return () => {
      tween.kill();
    };
  }, []);

  return (
    <>
      {/* Móvil — dos columnas horizontales, centrado abajo */}
      <div
        ref={mobileRef}
        className="absolute bottom-[clamp(8rem,calc(12vh+4.5rem),10.5rem)] left-[max(1rem,env(safe-area-inset-left))] right-[max(1rem,env(safe-area-inset-right))] z-[50] md:hidden"
      >
        <LiquidGlassFrame variant="light" borderRadius={18} borderWidth={4} className="w-full">
          <div className="flex min-h-[7.5rem] items-stretch">
            <FeatureCell
              label={features[0].label}
              icon={features[0].icon}
              className="min-w-0 flex-1"
            />
            <LiquidGlassDivider orientation="vertical" thickness={4} />
            <FeatureCell
              label={features[1].label}
              icon={features[1].icon}
              className="min-w-0 flex-1"
            />
          </div>
        </LiquidGlassFrame>
      </div>

      {/* Desktop — panel vertical a la izquierda (diseño actual) */}
      <div
        ref={desktopRef}
        className="absolute bottom-8 left-6 z-20 hidden md:block lg:bottom-12 lg:left-14"
      >
        <LiquidGlassFrame
          variant="light"
          borderRadius={20}
          borderWidth={5}
          className="w-[220px] lg:w-[240px]"
        >
          {features.map((feature, i) => (
            <div key={feature.label}>
              <FeatureCell label={feature.label} icon={feature.icon} />
              {i < features.length - 1 ? (
                <LiquidGlassDivider orientation="horizontal" thickness={5} />
              ) : null}
            </div>
          ))}
        </LiquidGlassFrame>
      </div>
    </>
  );
}
