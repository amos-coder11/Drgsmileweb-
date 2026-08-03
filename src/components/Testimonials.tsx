"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "María González",
    role: "Paciente de ortodoncia",
    text: "Increíble experiencia. El equipo es muy profesional y el resultado superó mis expectativas. Mi sonrisa nunca se había visto tan bien.",
    rating: 5,
  },
  {
    name: "Carlos Ruiz",
    role: "Implante dental",
    text: "Después de años con miedo al dentista, encontré en Dr. G Smile un lugar donde me siento cómodo. La tecnología 3D me dio mucha confianza.",
    rating: 5,
  },
  {
    name: "Ana Martínez",
    role: "Blanqueamiento",
    text: "El blanqueamiento fue rápido e indoloro. El personal es amable y las instalaciones son modernas y limpias. 100% recomendado.",
    rating: 5,
  },
];

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.fromTo(
      section.querySelectorAll(".testimonial-card"),
      { y: 50, opacity: 0, rotationY: 5 },
      {
        y: 0,
        opacity: 1,
        rotationY: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} id="testimonios" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-wider text-sky-600">
            Testimonios
          </span>
          <h2 className="font-[family-name:var(--font-outfit)] text-4xl font-bold md:text-5xl">
            Lo que dicen nuestros <span className="text-gradient">pacientes</span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="testimonial-card rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
            >
              <div className="mb-4 flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-amber-400">
                    ★
                  </span>
                ))}
              </div>
              <p className="mb-6 text-sm leading-relaxed text-slate-600">&ldquo;{t.text}&rdquo;</p>
              <div>
                <p className="font-semibold text-slate-800">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
