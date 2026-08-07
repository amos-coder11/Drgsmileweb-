"use client";

import Image from "next/image";
import type { MotionValue } from "motion/react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowDown, Sparkles } from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import CardFanCarousel from "./ui/card-fan-carousel";
import { SmileBookSection } from "./SmileBookSection";
import { TopographicBackground } from "./TopographicBackground";
import { Component as CinematicProductScrollSection } from "./ui/cinematic-product-scroll-section";
import { Component as FlipLinks } from "./ui/flip-links";
import { SmilePassSection } from "./SmilePassSection";

const FAN_CARDS = [
  { imgUrl: "/images/fondo10.png", alt: "Paciente junto al doctor después de su transformación" },
  { imgUrl: "/images/fondo7.png", alt: "Paciente de DrGsmile en consulta" },
  { imgUrl: "/images/fondo8.png", alt: "Familia celebrando una nueva sonrisa" },
  { imgUrl: "/images/fondo4.png", alt: "Equipo completo de la clínica DrGsmile" },
  { imgUrl: "/images/fondo12.png", alt: "Experiencia DrGsmile fuera de la clínica" },
  { imgUrl: "/images/fondo5.png", alt: "Reconocimiento profesional en odontología" },
  { imgUrl: "/images/fondo11.png", alt: "Doctor Raúl en Smile Studio" },
  { imgUrl: "/images/fondo2.png", alt: "Doctor Raúl en una experiencia especial" },
  { imgUrl: "/images/fondo3.png", alt: "Momentos de la comunidad DrGsmile" },
];

function JourneyLine({
  progress,
  className,
}: {
  progress: MotionValue<number>;
  className?: string;
}) {
  const pathLength = useTransform(progress, [0.04, 0.84], [0.02, 1]);
  const leadPathLength = useTransform(progress, [0, 0.16], [0, 1]);
  const opacity = useTransform(
    progress,
    [0, 0.08, 0.88, 0.98],
    [0.25, 1, 1, 0],
  );

  return (
    <motion.svg
      viewBox="0 0 1120 1740"
      fill="none"
      className={cn("drg-journey-line", className)}
      style={{ opacity }}
      aria-hidden
    >
      <motion.path
        d="M734 0C734 92 594 105 616 220C632 305 756 292 734 410"
        stroke="#609edb"
        strokeWidth="13"
        strokeLinecap="round"
        style={{ pathLength: leadPathLength }}
      />
      <motion.path
        d="M734 20c-89 90-41 166 37 140 122-40 137 123 25 153-132 36-214-68-322 4-140 94-11 239 123 179 165-74 307 47 219 173-101 158-459-18-502 242-39 234 344 220 361 455 17 231-493 150-504 426-12 294 473 131 398 501"
        stroke="#609edb"
        strokeWidth="13"
        strokeLinecap="round"
        style={{ pathLength }}
      />
    </motion.svg>
  );
}

function EditorialImage({
  src,
  alt,
  className,
  imageClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-[#11120f]", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", imageClassName)}
        sizes="(max-width: 768px) 78vw, 46vw"
      />
    </div>
  );
}

type DrGsmileScrollExperienceProps = {
  className?: string;
};

export const SvgFollowScroll = forwardRef<
  HTMLElement,
  DrGsmileScrollExperienceProps
>(function SvgFollowScroll({ className }, forwardedRef) {
  const sectionRef = useRef<HTMLElement>(null);
  const introSceneRef = useRef<HTMLDivElement>(null);
  const storySceneRef = useRef<HTMLDivElement>(null);

  const setRef = (node: HTMLElement | null) => {
    sectionRef.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  const { scrollYProgress: introRawProgress } = useScroll({
    target: introSceneRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: storyRawProgress } = useScroll({
    target: storySceneRef,
    offset: ["start start", "end end"],
  });
  const introSmoothProgress = useSpring(introRawProgress, {
    stiffness: 82,
    damping: 25,
    mass: 0.6,
    restDelta: 0.0005,
  });
  const storySmoothProgress = useSpring(storyRawProgress, {
    stiffness: 82,
    damping: 25,
    mass: 0.6,
    restDelta: 0.0005,
  });
  const shouldReduceMotion = useReducedMotion();
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1023px)");
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const introProgress = shouldReduceMotion
    ? introRawProgress
    : introSmoothProgress;
  const storyProgress = shouldReduceMotion
    ? storyRawProgress
    : storySmoothProgress;

  const introY = useTransform(
    introProgress,
    [0, 0.12, 0.76, 1],
    [compact ? 120 : 70, 0, 0, compact ? -72 : -110],
  );
  const introScale = useTransform(
    introProgress,
    [0.76, 1],
    [1, compact ? 0.92 : 0.88],
  );
  const introOpacity = useTransform(
    introProgress,
    [0, 0.1, 0.76, 0.9, 1],
    [0, 1, 1, 1, 0],
  );
  const introRule = useTransform(introProgress, [0.04, 0.24], [0, 1]);

  const storyMainY = useTransform(
    storyProgress,
    [0, 0.96],
    [compact ? 55 : 175, compact ? -30 : -95],
  );
  const storyMainScale = useTransform(
    storyProgress,
    [0, 0.9],
    [0.96, 1.025],
  );
  const storyMainRotate = useTransform(
    storyProgress,
    [0, 0.52, 0.96],
    [-2.4, 0, 1.1],
  );
  const storyLeftY = useTransform(
    storyProgress,
    [0.04, 0.96],
    [compact ? 60 : 245, compact ? -15 : -128],
  );
  const storyRightY = useTransform(
    storyProgress,
    [0.08, 0.98],
    [compact ? 70 : 295, compact ? -8 : -148],
  );
  const storyQuoteY = useTransform(
    storyProgress,
    [0.14, 0.9],
    [compact ? 20 : 86, compact ? -10 : -36],
  );
  const storyQuoteOpacity = useTransform(
    storyProgress,
    [0.14, 0.3, 0.82, 0.96],
    [0, 1, 1, 0],
  );

  return (
    <section
      ref={setRef}
      id="recorrido"
      className={cn(
        "relative z-[170] w-full overflow-clip bg-[#f2f2ea] text-[#1B3022]",
        className
      )}
      aria-label="Recorrido DrGsmile"
    >
      <div
        ref={introSceneRef}
        data-light-surface
        className="relative h-[190svh] bg-[#f2f2ea] lg:h-[260svh]"
      >
        <div className="sticky top-0 h-svh overflow-hidden">
          <div className="absolute inset-0 opacity-80">
            <TopographicBackground lineColor="#c9cec2" />
          </div>
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#f2f2ea] to-transparent" />

          <JourneyLine
            progress={introProgress}
            className="pointer-events-none absolute left-1/2 top-[-12vh] h-[176vh] w-[min(92vw,880px)] -translate-x-1/2"
          />

          <motion.div
            style={{ y: introY, scale: introScale, opacity: introOpacity }}
            className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center will-change-transform"
          >
            <div className="mb-7 flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] md:text-xs">
              <span>Experiencia DrGsmile</span>
              <motion.span
                style={{ scaleX: introRule }}
                className="h-px w-16 origin-left bg-[#1B3022]"
              />
              <span>Scroll 01</span>
            </div>

            <h1
              style={{
                width: "100%",
                maxWidth: "min(96vw, 1100px)",
                textTransform: "uppercase",
                lineHeight: 0.78,
                letterSpacing: "-0.075em",
              }}
            >
              <span
                style={{
                  display: "block",
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(2.55rem, 10.8vw, 10rem)",
                  fontWeight: 900,
                }}
              >
                El trazo que
              </span>
              <span
                style={{
                  display: "block",
                  marginBlock: "0.04em",
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(3.4rem, 12.6vw, 12rem)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  letterSpacing: "-0.045em",
                  textTransform: "none",
                  color: "#609edb",
                }}
              >
                sigue tu
              </span>
              <span
                style={{
                  display: "block",
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(2.55rem, 10.8vw, 10rem)",
                  fontWeight: 900,
                }}
              >
                recorrido
              </span>
            </h1>

            <div className="mt-9 flex flex-col items-center gap-4">
              <p className="max-w-xl text-balance text-sm font-medium uppercase tracking-[0.06em] md:text-base">
                Sigue bajando para descubrir la experiencia DrGsmile
              </p>
              <span className="flex size-11 items-center justify-center rounded-full border border-[#1B3022]/40 bg-[#f2f2ea]/80 backdrop-blur">
                <ArrowDown className="drg-scroll-cue size-4" />
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div
        ref={storySceneRef}
        data-black-surface
        className="relative h-[215svh] bg-[#11120f] text-[#f2f2ea] lg:h-[290svh]"
      >
        <svg
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          className="absolute -top-[9svh] left-0 h-[10svh] w-full fill-[#11120f]"
          aria-hidden
        >
          <path d="M0 70C302 111 564 92 746 82c251-13 455 14 694-42v70H0Z" />
        </svg>

        <div className="sticky top-0 h-svh overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <TopographicBackground lineColor="#405d77" />
          </div>
          <div className="absolute left-5 top-24 z-20 flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] md:left-10">
            <Sparkles className="size-4 text-[#609edb]" />
            Historias reales · Sonrisas reales
          </div>

          <motion.div
            style={{ y: storyMainY, scale: storyMainScale, rotate: storyMainRotate }}
            className="absolute left-[9vw] top-[18vh] h-[42vh] w-[min(45vw,560px)] will-change-transform max-lg:left-[9vw] max-lg:top-[15vh] max-lg:h-[29vh] max-lg:w-[82vw]"
          >
            <EditorialImage
              src="/images/fondo4.png"
              alt="Equipo de la clínica DrGsmile"
              className="h-full w-full shadow-2xl"
              imageClassName="object-center"
            />
            <div className="absolute -top-5 left-0 flex items-center gap-2 text-[0.58rem] font-bold uppercase tracking-[0.16em]">
              <span>El equipo</span>
              <span className="h-1.5 w-14 bg-[#609edb]" />
            </div>
          </motion.div>

          <motion.div
            style={{ y: storyLeftY }}
            className="absolute -left-[3vw] top-[63vh] h-[28vh] w-[min(29vw,360px)] will-change-transform max-lg:-left-[7vw] max-lg:top-[80vh] max-lg:h-[18vh] max-lg:w-[48vw]"
          >
            <EditorialImage
              src="/images/fondo8.png"
              alt="Paciente junto al doctor después de su tratamiento"
              className="h-full w-full border-8 border-[#11120f]"
            />
          </motion.div>

          <motion.div
            style={{ y: storyRightY }}
            className="absolute right-[4vw] top-[31vh] h-[46vh] w-[min(33vw,430px)] will-change-transform max-lg:-right-[7vw] max-lg:top-[79vh] max-lg:h-[19vh] max-lg:w-[50vw]"
          >
            <EditorialImage
              src="/images/fondo5.png"
              alt="Reconocimiento profesional del doctor"
              className="h-full w-full border-[10px] border-[#11120f]"
            />
            <span className="absolute -bottom-4 right-0 bg-[#609edb] px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.14em] text-[#11120f]">
              Precisión digital
            </span>
          </motion.div>

          <motion.div
            style={{ y: storyQuoteY, opacity: storyQuoteOpacity }}
            className="pointer-events-none absolute inset-x-0 top-[32vh] z-10 mx-auto max-w-[min(90vw,860px)] text-center will-change-transform max-lg:top-[49vh] max-lg:z-30 max-lg:max-w-[92vw] max-lg:bg-[#11120f]/94 max-lg:px-4 max-lg:py-5"
          >
            <p className="text-balance font-[family-name:var(--font-serif)] text-[clamp(2rem,6.2vw,6.5rem)] leading-[0.94] tracking-[-0.04em]">
              No importa dónde empiezas,
              <span className="block font-[family-name:var(--font-body)] font-black uppercase text-[#609edb]">
                importa cómo sonríes
              </span>
              al terminar.
            </p>
          </motion.div>

          <div className="absolute bottom-8 right-6 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#f2f2ea]/55 md:right-10">
            Scroll 02 / 03
          </div>
        </div>
      </div>

      <CinematicProductScrollSection />

      <SmilePassSection />

      <SmileBookSection />

      <div
        id="sonrisas"
        data-light-surface
        className="relative flex flex-col justify-center overflow-visible bg-[#f2f2ea] pb-12 pt-16 lg:min-h-svh lg:pb-28 lg:pt-28"
      >
        <div className="absolute inset-0 opacity-75">
          <TopographicBackground lineColor="#c9cec2" />
        </div>
        <motion.div
          className="relative z-10 mx-auto mb-1 flex w-full max-w-[90rem] flex-col items-center px-5 text-center md:mb-0"
          initial={
            shouldReduceMotion
              ? false
              : { clipPath: "inset(0 0 100% 0)", y: 64, opacity: 0 }
          }
          whileInView={{ clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.35 }}
          transition={{ duration: 0.92, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="mb-4 flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.2em]">
            <span className="h-px w-12 bg-[#1B3022]" />
            Casos reales · Resultados reales
            <span className="h-px w-12 bg-[#1B3022]" />
          </div>
          <h2 className="uppercase leading-[0.78] tracking-[-0.065em]">
            <span className="block font-[family-name:var(--font-body)] text-[clamp(2.65rem,7.6vw,7.7rem)] font-black">
              Sonrisas que
            </span>
            <span className="block font-[family-name:var(--font-serif)] text-[clamp(3.25rem,8.7vw,9rem)] font-normal italic tracking-[-0.035em] text-[#609edb] normal-case">
              inspiran
            </span>
          </h2>
        </motion.div>

        <CardFanCarousel cards={FAN_CARDS} />

        <div className="absolute bottom-7 right-6 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#1B3022]/55 md:right-10">
          Scroll 04 / 04
        </div>
      </div>

      <FlipLinks />

      <div
        data-black-surface
        className="relative overflow-hidden bg-[#11120f] px-5 pb-10 pt-16 text-[#f2f2ea] md:px-10 md:pt-20"
        style={{ minHeight: "100svh" }}
      >
        <div className="absolute inset-0 opacity-10">
          <TopographicBackground lineColor="#609edb" />
        </div>
        <motion.div
          className="relative z-10 flex min-h-[calc(100svh-6rem)] flex-col justify-between"
          initial={
            shouldReduceMotion
              ? false
              : { clipPath: "inset(0 0 22% 0)", y: 70, opacity: 0 }
          }
          whileInView={{ clipPath: "inset(0 0 0% 0)", y: 0, opacity: 1 }}
          viewport={{ once: false, amount: 0.18 }}
          transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="flex items-center justify-between pb-5 text-[0.65rem] font-bold uppercase tracking-[0.18em]">
            <span>DrGsmile · Dental Studio</span>
            <span>Miami · Florida</span>
          </div>

          <h2 className="-ml-[0.04em] py-16 font-[family-name:var(--font-body)] text-[clamp(2.55rem,14.7vw,15rem)] font-black leading-[0.72] tracking-[-0.09em] text-[#609edb]">
            drgsmile.com
          </h2>

          <div className="grid gap-8 pt-7 text-[0.7rem] font-bold uppercase tracking-[0.12em] sm:grid-cols-2 lg:grid-cols-4">
            <p>
              Clínica dental<br />presencial y online
            </p>
            <p>
              Diseño 3D<br />digital smile
            </p>
            <p>
              Primera visita<br />sin compromiso
            </p>
            <p className="sm:text-right">
              Agenda tu cita<br />y empieza tu recorrido
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export { SvgFollowScroll as DrGsmileScrollExperience };
