"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: "🦷",
    title: "Implantes Dentales",
    description: "Restauración permanente con tecnología 3D de planificación digital.",
  },
  {
    icon: "✨",
    title: "Blanqueamiento",
    description: "Tratamientos profesionales para una sonrisa radiante y natural.",
  },
  {
    icon: "📐",
    title: "Ortodoncia",
    description: "Alineadores invisibles y brackets para corregir tu mordida.",
  },
  {
    icon: "👶",
    title: "Odontopediatría",
    description: "Cuidado dental especializado para los más pequeños del hogar.",
  },
  {
    icon: "🔬",
    title: "Endodoncia",
    description: "Tratamiento de conducto con microscopio y técnicas mínimamente invasivas.",
  },
  {
    icon: "💎",
    title: "Estética Dental",
    description: "Carillas, coronas y diseño de sonrisa personalizado.",
  },
];

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      section.querySelector(".section-title"),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      }
    );

    gsap.fromTo(
      section.querySelectorAll(".service-card"),
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} id="servicios" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="section-title mb-16 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-sky-600">
            Nuestros Servicios
          </span>
          <h2 className="font-[family-name:var(--font-outfit)] text-4xl font-bold md:text-5xl">
            Cuidado integral para tu <span className="text-gradient">sonrisa</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Ofrecemos una gama completa de tratamientos dentales con la más alta tecnología.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="service-card group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-2 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-sky-50 to-cyan-50 text-2xl transition-transform group-hover:scale-110">
                {service.icon}
              </div>
              <h3 className="mb-2 font-[family-name:var(--font-outfit)] text-xl font-semibold">
                {service.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
