"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Treatment = {
  id: string;
  number: string;
  title: string;
  thumbnail: string;
  description: string;
  details: string[];
};

const TREATMENTS: Treatment[] = [
  {
    id: "diagnostico",
    number: "01",
    title: "Diagnóstico digital",
    thumbnail: "/images/fondo10.png",
    description:
      "Empezamos entendiendo tu sonrisa con fotografías, escaneo y una evaluación precisa de cada detalle.",
    details: ["Escaneo 3D", "Evaluación clínica", "Objetivos claros"],
  },
  {
    id: "diseno",
    number: "02",
    title: "Diseño de sonrisa",
    thumbnail: "/images/fondo7.png",
    description:
      "Creamos una propuesta digital personalizada para que puedas visualizar el resultado antes de comenzar.",
    details: ["Plan personalizado", "Prueba visual", "Proporción natural"],
  },
  {
    id: "resultado",
    number: "03",
    title: "Resultado natural",
    thumbnail: "/images/fondo4.png",
    description:
      "Cuidamos forma, color y expresión para lograr una sonrisa que se sienta segura y completamente tuya.",
    details: ["Acabado estético", "Seguimiento", "Confianza duradera"],
  },
];

function TreatmentStory({
  treatment,
  reversed,
  dark,
}: {
  treatment: Treatment;
  reversed: boolean;
  dark: boolean;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
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
    stiffness: 82,
    damping: 25,
    mass: 0.58,
  });
  const clipPath = useTransform(
    progress,
    [0.14, 0.58],
    ["inset(0 0 100% 0)", "inset(0 0 0% 0)"]
  );
  const imageY = useTransform(progress, [0, 1], ["5%", "-5%"]);
  const copyY = useTransform(progress, [0.18, 0.55], [64, 0]);
  const copyOpacity = useTransform(progress, [0.16, 0.38], [0, 1]);

  return (
    <article
      ref={sectionRef}
      id={treatment.id}
      data-black-surface={dark ? "" : undefined}
      data-light-surface={dark ? undefined : ""}
      className={cn(
        "relative w-full lg:h-[175svh]",
        dark
          ? "bg-[#11120f] text-[#f2f2ea]"
          : "bg-[#f2f2ea] text-[#1B3022]"
      )}
    >
      <div className="grid grid-cols-1 overflow-hidden lg:sticky lg:top-0 lg:min-h-svh lg:grid-cols-2">
        <div
          className={cn(
            "relative min-h-[50svh] overflow-hidden lg:min-h-svh",
            reversed && "lg:order-2"
          )}
        >
          <motion.div
            className="absolute -inset-y-[8%] inset-x-0"
            style={{ y: reduceMotion ? 0 : imageY }}
          >
            <Image
              src={treatment.thumbnail}
              alt={treatment.title}
              fill
              className="object-cover grayscale"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            style={{ clipPath: reduceMotion ? "inset(0)" : clipPath }}
          >
            <motion.div
              className="absolute -inset-y-[8%] inset-x-0"
              style={{ y: reduceMotion ? 0 : imageY }}
            >
              <Image
                src={treatment.thumbnail}
                alt=""
                fill
                aria-hidden
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#11120f]/45 via-transparent to-transparent" />
          <span className="absolute bottom-6 left-6 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white md:bottom-10 md:left-10">
            DrGsmile · {treatment.number}
          </span>
        </div>

        <div
          className={cn(
            "relative flex min-h-[56svh] items-center px-6 py-12 sm:px-10 lg:min-h-svh lg:px-[8vw] lg:py-20",
            reversed && "lg:order-1"
          )}
        >
          <motion.div
            className="w-full max-w-xl"
            style={
              reduceMotion || compact
                ? { y: 0, opacity: 1 }
                : { y: copyY, opacity: copyOpacity }
            }
          >
            <div
              className={cn(
                "mb-7 flex items-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.2em]",
                dark ? "text-[#f2f2ea]/65" : "text-[#1B3022]/60"
              )}
            >
              <span
                className={cn(
                  "h-px w-12",
                  dark ? "bg-[#609edb]" : "bg-[#1B3022]"
                )}
              />
              Paso {treatment.number}
            </div>
            <h3 className="max-w-[10ch] font-[family-name:var(--font-body)] text-[clamp(2.55rem,7vw,7.4rem)] font-black uppercase leading-[0.8] tracking-[-0.065em]">
              {treatment.title}
            </h3>
            <p
              className={cn(
                "mt-8 max-w-lg text-base leading-relaxed md:text-lg",
                dark ? "text-[#f2f2ea]/72" : "text-[#1B3022]/72"
              )}
            >
              {treatment.description}
            </p>
            <ul className="mt-10 grid gap-3 border-t border-current/20 pt-6 text-[0.68rem] font-bold uppercase tracking-[0.16em] sm:grid-cols-3">
              {treatment.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            <Link
              href="#agenda"
              className={cn(
                "mt-10 inline-flex items-center gap-3 rounded-full px-6 py-4 text-[0.68rem] font-bold uppercase tracking-[0.16em] transition-transform duration-300 hover:-translate-y-1",
                dark
                  ? "bg-[#609edb] text-[#11120f]"
                  : "bg-[#11120f] text-[#f2f2ea]"
              )}
            >
              Conocer el proceso
              <ArrowUpRight className="size-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </article>
  );
}

function TreatmentCard({ treatment }: { treatment: Treatment }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const setRevealPoint = (clientX: number, clientY: number) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty(
      "--reveal-x",
      `${((clientX - rect.left) / rect.width) * 100}%`
    );
    card.style.setProperty(
      "--reveal-y",
      `${((clientY - rect.top) / rect.height) * 100}%`
    );
    setActive(true);
  };

  return (
    <div
      ref={cardRef}
      className="group relative min-w-[76vw] snap-center overflow-hidden border border-[#1B3022]/20 sm:min-w-[44vw] lg:min-w-0"
      onMouseEnter={(event) => setRevealPoint(event.clientX, event.clientY)}
      onMouseLeave={() => setActive(false)}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        if (touch) setRevealPoint(touch.clientX, touch.clientY);
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-[#11120f]">
        <Image
          src={treatment.thumbnail}
          alt={treatment.title}
          fill
          className="object-cover grayscale"
          sizes="(max-width: 768px) 76vw, 33vw"
        />
        <div
          className="absolute inset-0 transition-[clip-path] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            clipPath: `circle(${active ? "150%" : "0%"} at var(--reveal-x, 50%) var(--reveal-y, 50%))`,
          }}
        >
          <Image
            src={treatment.thumbnail}
            alt=""
            fill
            aria-hidden
            className="object-cover"
            sizes="(max-width: 768px) 76vw, 33vw"
          />
        </div>
      </div>
      <div className="bg-[#f2f2ea] p-5 text-[#1B3022] md:p-7">
        <span className="text-[0.58rem] font-bold uppercase tracking-[0.2em] text-[#1B3022]/50">
          Paso {treatment.number}
        </span>
        <h4 className="mt-3 text-xl font-bold uppercase tracking-[-0.035em]">
          {treatment.title}
        </h4>
      </div>
    </div>
  );
}

export function Component() {
  return (
    <section id="servicios" className="relative w-full">
      <div
        data-light-surface
        className="relative flex min-h-[82svh] items-center justify-center overflow-hidden bg-[#f2f2ea] px-5 py-24 text-center text-[#1B3022]"
      >
        <div className="relative z-10">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.22em]">
            Nuestro proceso
          </span>
          <h2 className="mt-6 font-[family-name:var(--font-body)] text-[clamp(3.7rem,11vw,11rem)] font-black uppercase leading-[0.75] tracking-[-0.08em]">
            Diseñamos
            <span className="block font-[family-name:var(--font-serif)] font-normal italic tracking-[-0.04em] text-[#609edb] normal-case">
              contigo
            </span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-sm font-medium uppercase tracking-[0.08em] md:text-base">
            Tres etapas. Una sonrisa pensada para ti.
          </p>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <ArrowDown className="drg-scroll-cue size-5" />
        </div>
      </div>

      {TREATMENTS.map((treatment, index) => (
        <TreatmentStory
          key={treatment.id}
          treatment={treatment}
          reversed={index % 2 !== 0}
          dark={index % 2 === 0}
        />
      ))}

      <div
        data-light-surface
        className="bg-[#f2f2ea] px-5 py-14 text-[#1B3022] sm:px-8 lg:px-10 lg:py-28"
      >
        <div className="mx-auto max-w-[92rem]">
          <div className="mb-10 flex items-end justify-between border-b border-[#1B3022]/20 pb-5">
            <div>
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em]">
                Resumen
              </span>
              <h3 className="mt-2 text-3xl font-black uppercase tracking-[-0.045em] md:text-5xl">
                Tu recorrido
              </h3>
            </div>
            <Link
              href="#agenda"
              className="hidden items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] sm:flex"
            >
              Agenda tu valoración
              <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-3 lg:overflow-visible">
            {TREATMENTS.map((treatment) => (
              <TreatmentCard key={treatment.id} treatment={treatment} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Component;
