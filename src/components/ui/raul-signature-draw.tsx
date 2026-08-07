"use client";

import type { MotionValue } from "motion/react";
import { motion, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Firma "Raúl" — un solo trazo continuo (signature-scroll-animation).
 * pathLength normalizado a 1 para revelar con strokeDashoffset 0→1.
 */
export const RAUL_SIGNATURE_PATH =
  "M 900 150 " +
  "C 620 70 250 130 130 300 " +
  "C 40 425 70 560 260 575 " +
  "C 520 595 800 470 940 330 " +
  "C 1040 230 1015 120 890 120 " +
  "C 800 120 720 210 690 320 " +
  "C 640 470 540 700 470 860 " +
  "C 500 720 540 600 560 560 " +
  "C 520 560 500 615 524 660 " +
  "C 548 700 610 696 628 652 " +
  "C 638 626 632 585 618 560 " +
  "C 616 610 620 662 652 678 " +
  "C 676 690 700 652 710 600 " +
  "C 716 652 730 692 770 684 " +
  "C 806 677 828 630 848 570 " +
  "C 890 460 940 210 978 40 " +
  "C 986 12 990 120 982 300 " +
  "C 976 450 998 585 1120 585 " +
  "C 1260 585 1420 565 1520 555";

type RaulSignatureDrawProps = {
  scrollProgress: MotionValue<number>;
  className?: string;
  /** Trazo interior — blanco */
  stroke?: string;
  /** Borde exterior — azul 2px */
  strokeBorder?: string;
  strokeWidth?: number;
  borderWidth?: number;
};

export function RaulSignatureDraw({
  scrollProgress,
  className,
  stroke = "#ffffff",
  strokeBorder = "#609edb",
  strokeWidth = 9,
  borderWidth = 2,
}: RaulSignatureDrawProps) {
  const dashOffset = useTransform(scrollProgress, (p) => 1 - p);
  const strokeOpacity = useTransform(scrollProgress, (p) =>
    p <= 0.008 ? 0 : 1
  );

  const dashStyle = {
    strokeDasharray: 1,
    strokeDashoffset: dashOffset,
    opacity: strokeOpacity,
  };

  const pathProps = {
    d: RAUL_SIGNATURE_PATH,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    pathLength: 1,
  };

  return (
    <svg
      className={cn(
        "pointer-events-none absolute left-1/2 top-1/2 z-[150] w-[118%] max-w-none -translate-x-1/2 -translate-y-1/2",
        className
      )}
      viewBox="0 0 1560 900"
      fill="none"
      aria-hidden
    >
      {/* Borde azul 2px */}
      <motion.path
        {...pathProps}
        stroke={strokeBorder}
        strokeWidth={strokeWidth + borderWidth * 2}
        style={dashStyle}
      />
      {/* Trazo blanco */}
      <motion.path
        {...pathProps}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={dashStyle}
      />
    </svg>
  );
}
