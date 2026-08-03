"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RiveAnimation } from "./RiveAnimation";

gsap.registerPlugin(ScrollTrigger);

const features = [
  "Escaneo intraoral 3D sin moldes",
  "Planificación digital de tratamientos",
  "Sedación consciente disponible",
  "Garantía en todos los implantes",
];

export function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      section.querySelector(".about-content"),
      { x: -60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: { trigger: section, start: "top 70%", once: true },
      }
    );

    gsap.fromTo(
      section.querySelector(".about-visual"),
      { x: 60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        scrollTrigger: { trigger: section, start: "top 70%", once: true },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} id="nosotros" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-sky-50/50 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <div className="about-content">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-sky-600">
            Sobre Nosotros
          </span>
          <h2 className="font-[family-name:var(--font-outfit)] text-4xl font-bold md:text-5xl">
            Innovación y <span className="text-gradient">excelencia</span> dental
          </h2>
          <p className="mt-6 leading-relaxed text-slate-600">
            Dr. G Smile nació con la visión de transformar la experiencia dental.
            Combinamos la calidez humana con tecnología de punta — Three.js para
            visualización 3D, animaciones GSAP y Rive para una experiencia digital única.
          </p>
          <p className="mt-4 leading-relaxed text-slate-600">
            Nuestro equipo de especialistas está comprometido con tu bienestar,
            utilizando protocolos internacionales y materiales de la más alta calidad.
          </p>

          <ul className="mt-8 space-y-3">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs text-sky-600">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="about-visual relative flex h-[400px] items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-sky-100 to-cyan-50" />
          <RiveAnimation />
        </div>
      </div>
    </section>
  );
}
