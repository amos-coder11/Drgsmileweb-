"use client";

import { ArrowUpRight, ScanLine, ShieldCheck, Smile } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Book } from "@/components/ui/book";
import { TopographicBackground } from "./TopographicBackground";

const books = [
  {
    title: "Tu nueva sonrisa, paso a paso",
    eyebrow: "Guía 01",
    color: "#609edb",
    textColor: "#11120f",
    variant: "stripe" as const,
    icon: <Smile className="size-[30cqw]" strokeWidth={1.25} />,
    width: { sm: 166, md: 218, lg: 270 },
  },
  {
    title: "Diseño digital 3D",
    eyebrow: "Guía 02",
    color: "#11120f",
    textColor: "#f2f2ea",
    variant: "simple" as const,
    icon: <ScanLine className="size-[25cqw]" strokeWidth={1.2} />,
    width: { sm: 150, md: 194, lg: 228 },
  },
  {
    title: "Cuidados que hacen durar tu sonrisa",
    eyebrow: "Guía 03",
    color: "#dce9f5",
    textColor: "#11120f",
    variant: "stripe" as const,
    icon: <ShieldCheck className="size-[27cqw]" strokeWidth={1.2} />,
    width: { sm: 158, md: 204, lg: 244 },
  },
];

export function SmileBookSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="biblioteca"
      data-light-surface
      className="relative overflow-hidden bg-[#f2f2ea] px-5 pb-10 pt-14 text-[#1B3022] sm:px-8 lg:px-10 lg:py-32"
      aria-labelledby="biblioteca-title"
    >
      <div className="absolute inset-0 opacity-70">
        <TopographicBackground lineColor="#c9cec2" />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-[46%] h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#609edb]/10 blur-3xl"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-[92rem]">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3 text-[0.65rem] font-bold uppercase tracking-[0.2em]">
            <span className="h-px w-10 bg-[#1B3022]/60" />
            Biblioteca DrGsmile
            <span className="h-px w-10 bg-[#1B3022]/60" />
          </div>
          <h2
            id="biblioteca-title"
            className="uppercase leading-[0.8] tracking-[-0.065em]"
          >
            <span className="block font-[family-name:var(--font-body)] text-[clamp(2.45rem,7vw,7.5rem)] font-black">
              Conoce tu
            </span>
            <span className="block font-[family-name:var(--font-serif)] text-[clamp(3.25rem,8.8vw,9rem)] font-normal italic tracking-[-0.035em] text-[#609edb] normal-case">
              sonrisa
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-balance text-sm leading-relaxed text-[#1B3022]/72 md:text-base">
            Guías claras para entender cada etapa, cuidar tus resultados y
            tomar decisiones con confianza.
          </p>
        </div>

        <div className="book-shelf mt-8 flex items-end gap-7 overflow-visible px-0 pb-8 pt-4 lg:mx-auto lg:mt-20 lg:justify-center lg:gap-16 lg:px-0 lg:pb-14 lg:pt-6">
          {books.map((book, index) => (
            <motion.div
              key={book.title}
              className="shrink-0 snap-center"
              initial={
                shouldReduceMotion
                  ? false
                  : {
                      y: 70 + index * 12,
                      opacity: 0,
                      rotate: index === 0 ? -4 : index === 2 ? 4 : 0,
                    }
              }
              whileInView={{ y: 0, opacity: 1, rotate: 0 }}
              viewport={{ once: false, amount: 0.35 }}
              transition={{
                duration: 0.82,
                delay: index * 0.055,
                ease: [0.19, 1, 0.22, 1],
              }}
            >
              <Book
                title={book.title}
                eyebrow={book.eyebrow}
                variant={book.variant}
                width={book.width}
                color={book.color}
                textColor={book.textColor}
                illustration={book.icon}
                textured
              />
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <a
            href="#agenda"
            className="group inline-flex items-center gap-3 rounded-md bg-[#11120f] px-6 py-4 text-xs font-black uppercase tracking-[0.1em] text-[#f2f2ea] shadow-[0_14px_34px_rgba(17,18,15,0.2)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_42px_rgba(17,18,15,0.28)]"
          >
            Agenda tu valoración
            <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
