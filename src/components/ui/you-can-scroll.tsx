"use client";

import { cn } from "@/lib/utils";

export function YouCanScroll({ compactIntro = false }: { compactIntro?: boolean }) {
  return (
    <div
      className={cn(
        "you-can-scroll relative z-10 w-full text-[#f2f2ea]",
        compactIntro && "you-can-scroll--compact"
      )}
      aria-label="Transición a galería"
    >
      <header
        className={cn(
          "you-can-scroll__intro",
          compactIntro && "you-can-scroll__intro--compact"
        )}
      >
        <h1
          className="you-can-scroll__fluid font-[family-name:var(--font-display)]"
          style={{ fontSize: "calc(var(--fluid-type) * 2)" }}
        >
          Mejor
          <br />
          Sonríe
        </h1>
      </header>
    </div>
  );
}
