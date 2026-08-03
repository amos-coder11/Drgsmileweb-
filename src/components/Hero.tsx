"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const ToothScene = dynamic(() => import("./ToothScene").then((m) => m.ToothScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-500" />
    </div>
  ),
});

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (titleRef.current) {
      tl.fromTo(titleRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 });
    }
    if (subtitleRef.current) {
      tl.fromTo(subtitleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.5");
    }
    if (ctaRef.current) {
      tl.fromTo(ctaRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.4");
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden pt-20"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-200/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2">
        <div className="z-10">
          <span className="mb-4 inline-block rounded-full bg-sky-100 px-4 py-1.5 text-sm font-medium text-sky-700">
            ✨ Tecnología dental de vanguardia
          </span>

          <h1
            ref={titleRef}
            className="font-[family-name:var(--font-outfit)] text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl"
          >
            Tu sonrisa,
            <br />
            <span className="text-gradient">nuestra pasión</span>
          </h1>

          <p
            ref={subtitleRef}
            className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600"
          >
            En Dr. G Smile combinamos experiencia clínica con tecnología 3D avanzada
            para ofrecerte tratamientos personalizados y resultados excepcionales.
          </p>

          <div ref={ctaRef} className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contacto"
              className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-sky-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-sky-500/40"
            >
              Reservar Consulta
            </a>
            <a
              href="#servicios"
              className="rounded-full border-2 border-slate-200 px-8 py-4 text-base font-semibold text-slate-700 transition-all hover:border-sky-300 hover:bg-sky-50"
            >
              Ver Servicios
            </a>
          </div>
        </div>

        <div className="relative h-[400px] lg:h-[600px]">
          <ToothScene />
        </div>
      </div>
    </section>
  );
}
