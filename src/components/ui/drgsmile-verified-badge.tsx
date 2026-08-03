"use client";

import { cn } from "@/lib/utils";
import { LiquidGlassFrame } from "@/components/ui/liquid-glass-frame";
import { VerifiedBadge } from "@/components/ui/verified-badge";

const INSTAGRAM_URL = "https://www.instagram.com/drgsmile/?hl=es";

type DrGsmileVerifiedBadgeProps = {
  className?: string;
};

export function DrGsmileVerifiedBadge({ className }: DrGsmileVerifiedBadgeProps) {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visitar Instagram de drgsmile"
      className={cn(
        "pointer-events-auto inline-block outline-none transition-transform hover:scale-[1.03] focus-visible:scale-[1.03] active:scale-[0.98]",
        className
      )}
    >
      <LiquidGlassFrame variant="light" borderRadius={999} borderWidth={5}>
        <div className="flex items-center gap-2 px-6 py-3">
          <span className="text-base font-bold lowercase tracking-tight text-black md:text-lg">drgsmile</span>
          <VerifiedBadge variant="shimmer" size={28} aria-label="drgsmile verificado" />
        </div>
      </LiquidGlassFrame>
    </a>
  );
}
