"use client";

import type { RefObject } from "react";
import { useScroll, useTransform } from "motion/react";
import { RaulSignatureDraw } from "@/components/ui/raul-signature-draw";

/** Ventana de scroll donde la firma va de 0→1 (antes de que el morph continúe) */
export const SIGNATURE_DRAW_START = 0.32;
export const SIGNATURE_DRAW_END = 0.62;

/** Firma Raúl — trazo del zip signature-scroll, encima de fondo1 */
export function Fondo1RaulOverlay({
  scrollTargetRef,
}: {
  scrollTargetRef: RefObject<HTMLElement | null>;
}) {
  const { scrollYProgress } = useScroll({
    target: scrollTargetRef,
    offset: ["start start", "end end"],
  });

  const drawProgress = useTransform(
    scrollYProgress,
    [SIGNATURE_DRAW_START, SIGNATURE_DRAW_END],
    [0, 1]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      <RaulSignatureDraw scrollProgress={drawProgress} stroke="#ffffff" />
    </div>
  );
}
