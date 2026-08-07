"use client";

import { VelocityScroll } from "@/components/ui/scroll-based-velocity";
import { cn } from "@/lib/utils";

const themes = {
  dark: {
    serif:
      "font-[family-name:var(--font-serif)] text-[clamp(3.5rem,14vw,11rem)] font-normal uppercase leading-[0.9] tracking-[-0.03em] text-[#609edb]/88",
    sans: "font-[family-name:var(--font-body)] text-[clamp(3rem,12vw,9.5rem)] font-bold uppercase leading-[0.85] tracking-[-0.04em] text-[#f2f2ea]/75",
  },
  light: {
    serif:
      "font-[family-name:var(--font-serif)] text-[clamp(2.75rem,11vw,8.5rem)] font-normal uppercase leading-[0.9] tracking-[-0.03em] text-[#1B3022]/10",
    sans: "font-[family-name:var(--font-body)] text-[clamp(2.5rem,9vw,7.5rem)] font-bold uppercase leading-[0.85] tracking-[-0.04em] text-[#609edb]/20",
  },
} as const;

/** Texto de fondo con scroll — detrás del contenido principal */
export function HeroVelocityBackground({
  variant = "dark",
  className,
}: {
  variant?: keyof typeof themes;
  className?: string;
}) {
  const t = themes[variant];

  return (
    <div
      className={cn(
        "flex h-full w-full flex-col justify-center gap-1 overflow-hidden md:gap-2",
        className
      )}
      aria-hidden
    >
      <VelocityScroll
        default_velocity={2.4}
        rows={[
          { text: "DISEÑAMOS SONRISAS", className: t.serif, velocity: 2.4 },
          {
            text: "TRANSFORMAMOS CONFIANZA",
            className: t.sans,
            velocity: -2.4,
          },
        ]}
      />
    </div>
  );
}
