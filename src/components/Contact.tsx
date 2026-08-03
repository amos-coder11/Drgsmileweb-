"use client";

import { useEffect, useRef, FormEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      section.querySelector(".contact-form"),
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      }
    );
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <section ref={sectionRef} id="contacto" className="relative py-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sky-50/80 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-sky-600">
              Contacto
            </span>
            <h2 className="font-[family-name:var(--font-outfit)] text-4xl font-bold md:text-5xl">
              Agenda tu <span className="text-gradient">cita</span>
            </h2>
            <p className="mt-4 text-slate-600">
              Estamos listos para cuidar de tu sonrisa. Completa el formulario y nos
              pondremos en contacto contigo en menos de 24 horas.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                  📍
                </div>
                <div>
                  <p className="font-medium">Ubicación</p>
                  <p className="text-sm text-slate-600">Av. Principal 123, Ciudad</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                  📞
                </div>
                <div>
                  <p className="font-medium">Teléfono</p>
                  <p className="text-sm text-slate-600">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                  🕐
                </div>
                <div>
                  <p className="font-medium">Horario</p>
                  <p className="text-sm text-slate-600">Lun - Vie: 8:00 - 18:00</p>
                </div>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="contact-form glass rounded-2xl p-8 shadow-xl"
          >
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Nombre completo
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Servicio de interés
                </label>
                <select
                  id="service"
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="">Seleccionar servicio</option>
                  <option value="implantes">Implantes Dentales</option>
                  <option value="blanqueamiento">Blanqueamiento</option>
                  <option value="ortodoncia">Ortodoncia</option>
                  <option value="general">Consulta General</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm outline-none transition-colors focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 py-4 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                Enviar Solicitud
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
