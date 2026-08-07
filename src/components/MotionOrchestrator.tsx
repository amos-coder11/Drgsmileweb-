"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  MotionConfig,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

export function MotionOrchestrator({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [pointerFine, setPointerFine] = useState(false);
  const [pointerActive, setPointerActive] = useState(false);
  const pointerX = useMotionValue(-120);
  const pointerY = useMotionValue(-120);
  const ringX = useSpring(pointerX, {
    stiffness: 180,
    damping: 24,
    mass: 0.42,
  });
  const ringY = useSpring(pointerY, {
    stiffness: 180,
    damping: 24,
    mass: 0.42,
  });
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.55,
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCurtainOpen(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateCapability = () => setPointerFine(media.matches);
    const updatePointer = (event: PointerEvent) => {
      pointerX.set(event.clientX);
      pointerY.set(event.clientY);
      const target = event.target;
      setPointerActive(
        target instanceof Element &&
          Boolean(target.closest("a, button, [role='button']")),
      );
    };

    updateCapability();
    media.addEventListener("change", updateCapability);
    window.addEventListener("pointermove", updatePointer, { passive: true });

    return () => {
      media.removeEventListener("change", updateCapability);
      window.removeEventListener("pointermove", updatePointer);
    };
  }, [pointerX, pointerY]);

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.72, ease: [0.19, 1, 0.22, 1] }}
    >
      <>
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[1000] overflow-hidden bg-[#11120f]"
          style={{
            transform: curtainOpen ? "translateY(-101%)" : "translateY(0)",
            transition: reducedMotion
              ? "none"
              : `transform 760ms ${EASE} 100ms`,
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-1/3 bg-[#609edb]"
            style={{
              transform: curtainOpen ? "translateX(-104%)" : "translateX(0)",
              transition: reducedMotion
                ? "none"
                : `transform 640ms ${EASE} 30ms`,
            }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/3 bg-[#f2f0e8]"
            style={{
              transform: curtainOpen ? "translateX(104%)" : "translateX(0)",
              transition: reducedMotion
                ? "none"
                : `transform 640ms ${EASE} 70ms`,
            }}
          />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-[clamp(3rem,10vw,8rem)] italic tracking-[-0.08em] text-[#f2f0e8]">
            DrG
          </span>
        </div>

        {pointerFine && !reducedMotion ? (
          <>
            <motion.span
              aria-hidden="true"
              className="pointer-events-none fixed z-[998] size-2 rounded-full bg-[#609edb] mix-blend-difference"
              style={{
                left: pointerX,
                top: pointerY,
                translateX: "-50%",
                translateY: "-50%",
              }}
            />
            <motion.span
              aria-hidden="true"
              className="pointer-events-none fixed z-[997] rounded-full border border-[#609edb]/65"
              animate={{
                width: pointerActive ? 52 : 34,
                height: pointerActive ? 52 : 34,
                opacity: pointerActive ? 0.9 : 0.55,
              }}
              style={{
                left: ringX,
                top: ringY,
                translateX: "-50%",
                translateY: "-50%",
              }}
              transition={{
                duration: 0.32,
                ease: [0.19, 1, 0.22, 1],
              }}
            />
          </>
        ) : null}

        <div
          aria-hidden="true"
          className="pointer-events-none fixed right-2 top-1/2 z-[80] hidden h-20 w-px -translate-y-1/2 overflow-hidden bg-[#609edb]/25 md:block"
        >
          <motion.span
            className="block h-full w-full origin-top bg-[#609edb]"
            style={{ scaleY: smoothProgress }}
          />
        </div>

        {children}
      </>
    </MotionConfig>
  );
}
