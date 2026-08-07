"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

import { cn } from "@/lib/utils";

export interface VelocityScrollRow {
  text: string;
  className?: string;
  /** Positive scrolls left→right; negative reverses. Defaults alternate by row index. */
  velocity?: number;
}

interface VelocityScrollProps {
  rows?: VelocityScrollRow[];
  /** @deprecated Use `rows` for multi-line layouts */
  text?: string;
  default_velocity?: number;
  className?: string;
}

interface ParallaxProps {
  children: string;
  baseVelocity: number;
  className?: string;
}

export const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

function ParallaxText({
  children,
  baseVelocity = 100,
  className,
}: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 34,
    stiffness: 180,
    mass: 0.55,
  });

  const velocityFactor = useTransform(smoothVelocity, [-1200, 0, 1200], [-2.25, 0, 2.25], {
    clamp: true,
  });
  const shouldReduceMotion = useReducedMotion();

  const [repetitions, setRepetitions] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const calculateRepetitions = () => {
      if (containerRef.current && textRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const textWidth = textRef.current.offsetWidth;
        const newRepetitions = Math.ceil(containerWidth / textWidth) + 2;
        setRepetitions(newRepetitions);
      }
    };

    calculateRepetitions();

    window.addEventListener("resize", calculateRepetitions);
    return () => window.removeEventListener("resize", calculateRepetitions);
  }, [children]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "100px 0px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const x = useTransform(baseX, (v) => `${wrap(-100 / repetitions, 0, v)}%`);

  const directionFactor = React.useRef<number>(1);
  useAnimationFrame((_, delta) => {
    if (shouldReduceMotion || !isVisible) return;

    const velocity = velocityFactor.get();
    if (velocity < -0.01) {
      directionFactor.current = -1;
    } else if (velocity > 0.01) {
      directionFactor.current = 1;
    }

    const speedBoost = 1 + Math.abs(velocity);
    const moveBy =
      directionFactor.current * baseVelocity * speedBoost * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div
      className="w-full overflow-hidden whitespace-nowrap"
      ref={containerRef}
    >
      <motion.div className={cn("inline-block", className)} style={{ x }}>
        {Array.from({ length: repetitions }).map((_, i) => (
          <span key={i} ref={i === 0 ? textRef : null}>
            {children}{" "}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function VelocityScroll({
  rows,
  text,
  default_velocity = 5,
  className,
}: VelocityScrollProps) {
  const resolvedRows: VelocityScrollRow[] =
    rows ??
    (text
      ? [
          { text, className, velocity: default_velocity },
          { text, className, velocity: -default_velocity },
        ]
      : []);

  return (
    <section className="relative w-full">
      {resolvedRows.map((row, index) => (
        <ParallaxText
          key={`${row.text}-${index}`}
          baseVelocity={
            row.velocity ??
            (index % 2 === 0 ? default_velocity : -default_velocity)
          }
          className={row.className ?? className}
        >
          {row.text}
        </ParallaxText>
      ))}
    </section>
  );
}
