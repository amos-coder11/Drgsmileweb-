"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { AdmitOneTicket } from "@/components/ui/admit-one-ticket";

export function SmilePassSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 84,
    damping: 25,
    mass: 0.58,
  });

  const ticketY = useTransform(progress, [0.06, 0.36, 0.78], [190, 0, -65]);
  const ticketScale = useTransform(
    progress,
    [0.06, 0.38, 0.78],
    [0.82, 1, 0.96],
  );
  const ticketRotate = useTransform(
    progress,
    [0.06, 0.4, 0.8],
    [-6, 0, 2.5],
  );
  const ticketOpacity = useTransform(
    progress,
    [0.04, 0.18, 0.82, 0.94],
    [0, 1, 1, 0],
  );
  const copyY = useTransform(progress, [0.05, 0.3, 0.75], [70, 0, -35]);
  const lineScale = useTransform(progress, [0.12, 0.45], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="agenda"
      className="relative min-h-svh overflow-clip bg-[#11120f] text-[#f2f0e8] lg:h-[185svh]"
    >
      <div className="relative flex min-h-svh items-center overflow-hidden lg:sticky lg:top-0">
        <span id="pase" className="absolute top-0" aria-hidden="true" />
        <div
          aria-hidden="true"
          className="absolute -left-[12vw] top-[12%] h-[46vw] w-[46vw] rounded-full border border-[#609edb]/20"
        />
        <div
          aria-hidden="true"
          className="absolute -right-[7vw] bottom-[4%] h-[30vw] w-[30vw] rounded-full border border-[#609edb]/15"
        />

        <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-7 px-5 py-14 sm:px-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14 lg:px-16 lg:py-20">
          <motion.div
            style={
              reducedMotion || compact
                ? { y: 0, opacity: 1 }
                : { y: copyY }
            }
            className="relative z-20"
          >
            <span className="mb-5 block font-sans text-[10px] font-semibold uppercase tracking-[0.32em] text-[#609edb]">
              Acceso 04 · Tu experiencia
            </span>
            <h2 className="max-w-[8ch] font-sans text-[clamp(3.4rem,7vw,7rem)] font-black uppercase leading-[0.78] tracking-[-0.07em]">
              Tu sonrisa empieza aquí
            </h2>
            <motion.span
              aria-hidden="true"
              className="my-6 block h-px w-full max-w-xs origin-left bg-[#609edb]"
              style={reducedMotion ? undefined : { scaleX: lineScale }}
            />
            <p className="max-w-sm font-sans text-sm leading-relaxed text-[#f2f0e8]/68 md:text-base">
              Un pase simbólico hacia una valoración diseñada alrededor de ti,
              de tu historia y del resultado que quieres descubrir.
            </p>
            <a
              href="#agenda"
              className="group mt-7 inline-flex items-center gap-3 rounded-full border border-[#609edb] px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#f2f0e8] transition-colors duration-500 hover:bg-[#609edb] hover:text-[#11120f]"
            >
              Reservar valoración
              <ArrowDownRight
                size={16}
                className="transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1"
              />
            </a>
          </motion.div>

          <motion.div
            className="relative z-10 mx-auto mt-3 w-full max-w-[820px] lg:mt-0"
            style={
              reducedMotion || compact
                ? { y: 0, scale: 1, rotate: 0, opacity: 1 }
                : {
                    y: ticketY,
                    scale: ticketScale,
                    rotate: ticketRotate,
                    opacity: ticketOpacity,
                  }
            }
          >
            <AdmitOneTicket />
          </motion.div>
        </div>

        <p
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[0.11em] left-1/2 -translate-x-1/2 whitespace-nowrap font-serif text-[clamp(8rem,23vw,23rem)] italic leading-none tracking-[-0.08em] text-[#f2f0e8]/[0.035]"
        >
          Admit One
        </p>
      </div>
    </section>
  );
}
