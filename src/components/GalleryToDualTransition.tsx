"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { TopographicBackground } from "./TopographicBackground";
import { HeroVelocityBackground } from "./HeroVelocityBackground";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SCROLL_HEIGHT = "320vh";

function PortraitColumn({
  side,
  title,
  titleAccent,
  description,
  href,
  className,
}: {
  side: "left" | "right";
  title: string;
  titleAccent?: string;
  description: string;
  href: string;
  className?: string;
}) {
  const isLeft = side === "left";

  return (
    <div
      className={cn(
        "relative flex max-w-[13.5rem] flex-col md:max-w-[14.5rem]",
        isLeft ? "items-start text-left" : "items-end text-right",
        className
      )}
    >
      <h2
        className={cn(
          "font-[family-name:var(--font-body)] text-[clamp(1.65rem,3.8vw,3.25rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-[#1B3022]",
          isLeft ? "text-left" : "text-right"
        )}
      >
        {titleAccent ? (
          <>
            <span
              className={cn(
                "mb-0.5 block font-[family-name:var(--font-serif)] text-[1.05em] font-normal leading-none text-[#1a56db]",
                !isLeft && "text-right"
              )}
            >
              {titleAccent}
            </span>
            <span className="block">{title}</span>
          </>
        ) : (
          title
        )}
      </h2>
      <p
        className={cn(
          "mt-3 max-w-[14.5rem] text-[0.9rem] leading-relaxed text-[#1B3022]/80 md:mt-4 md:text-[0.95rem]",
          !isLeft && "ml-auto text-right"
        )}
      >
        {description}
      </p>
      <Link
        href={href}
        className="mt-5 inline-flex size-10 items-center justify-center rounded-sm bg-[#DFFF00] text-[#1B3022] shadow-sm transition-transform hover:scale-105 md:mt-6 md:size-11"
        aria-label={title}
      >
        <ArrowUpRight className="size-5" strokeWidth={2.25} />
      </Link>
    </div>
  );
}

/**
 * Tras la galería: fondo blanco + textos en movimiento + Raúl entra desde los lados.
 */
export function GalleryToDualTransition({
  creamOverlap = "min(28vh, 260px)",
}: {
  creamOverlap?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const leftPortraitRef = useRef<HTMLDivElement>(null);
  const rightPortraitRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const fondo10Ref = useRef<HTMLDivElement>(null);
  const [overlayReady, setOverlayReady] = useState(false);

  useEffect(() => {
    setOverlayReady(true);
  }, []);

  useEffect(() => {
    if (!overlayReady) return;

    const section = sectionRef.current;
    const leftPortrait = leftPortraitRef.current;
    const rightPortrait = rightPortraitRef.current;
    const leftCol = leftColRef.current;
    const rightCol = rightColRef.current;
    const fondo10 = fondo10Ref.current;

    if (
      !section ||
      !leftPortrait ||
      !rightPortrait ||
      !leftCol ||
      !rightCol ||
      !fondo10
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(leftPortrait, { x: "-58vw", opacity: 0 });
      gsap.set(rightPortrait, { x: "58vw", opacity: 0 });
      gsap.set(leftCol, { x: -40, opacity: 0 });
      gsap.set(rightCol, { x: 40, opacity: 0 });
      gsap.set(fondo10, { y: "100%", force3D: true });

      const portraitTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "center center",
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      });

      portraitTl.to(
        leftPortrait,
        { x: 0, opacity: 1, ease: "power3.out", duration: 1 },
        0
      );
      portraitTl.to(
        rightPortrait,
        { x: 0, opacity: 1, ease: "power3.out", duration: 1 },
        0
      );
      portraitTl.to(
        leftCol,
        { x: 0, opacity: 1, ease: "power2.out", duration: 0.65 },
        0.32
      );
      portraitTl.to(
        rightCol,
        { x: 0, opacity: 1, ease: "power2.out", duration: 0.65 },
        0.32
      );

      // fondo10 — sube por encima de header y todo el viewport
      gsap.to(fondo10, {
        y: "0%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "45% top",
          end: "bottom bottom",
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    let refreshTimer = 0;
    const debouncedRefresh = () => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(refresh, 150);
    };
    window.addEventListener("load", debouncedRefresh);
    window.addEventListener("resize", debouncedRefresh);
    debouncedRefresh();

    return () => {
      window.clearTimeout(refreshTimer);
      window.removeEventListener("load", debouncedRefresh);
      window.removeEventListener("resize", debouncedRefresh);
      ctx.revert();
    };
  }, [overlayReady]);

  return (
    <>
    <div
      ref={sectionRef}
      data-light-surface
      className="relative z-30 w-full bg-[#f2f2ea]"
      style={{ minHeight: SCROLL_HEIGHT, marginTop: `calc(-1 * ${creamOverlap})` }}
    >
      <div ref={stickyRef} className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Fondo blanco + topográfico */}
        <div className="absolute inset-0 z-0 bg-[#f2f2ea]">
          <TopographicBackground lineColor="#cfcfc3" />
        </div>

        {/* Textos en movimiento */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <HeroVelocityBackground variant="light" />
        </div>

        {/* Velo suave en el centro — mejora legibilidad del copy */}
        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_38%_50%_at_50%_52%,#f2f2ea_0%,#f2f2ea_58%,rgba(242,242,234,0.5)_78%,transparent_100%)]"
          aria-hidden
        />

        {/* Retratos — anclados abajo, entran desde los lados */}
        <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
          <div
            ref={leftPortraitRef}
            className="absolute bottom-0 left-0 flex h-[min(88svh,880px)] items-end will-change-transform max-md:h-[68svh]"
          >
            <div className="relative h-full">
              <Image
                src="/images/Raulizquierda.png"
                alt=""
                width={898}
                height={1984}
                className="h-full w-auto max-w-[min(44vw,420px)] object-contain object-left-bottom max-md:max-w-[54vw]"
                sizes="(max-width: 768px) 54vw, 420px"
                priority
                aria-hidden
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[min(18vh,140px)] bg-gradient-to-t from-[#f2f2ea] via-[#f2f2ea]/80 to-transparent"
              />
            </div>
          </div>
          <div
            ref={rightPortraitRef}
            className="absolute bottom-0 right-0 flex h-[min(88svh,880px)] items-end will-change-transform max-md:h-[68svh]"
          >
            <div className="relative h-full">
              <Image
                src="/images/Raulderecha.png"
                alt=""
                width={898}
                height={1984}
                className="h-full w-auto max-w-[min(44vw,420px)] object-contain object-right-bottom max-md:max-w-[54vw]"
                sizes="(max-width: 768px) 54vw, 420px"
                priority
                aria-hidden
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-[min(18vh,140px)] bg-gradient-to-t from-[#f2f2ea] via-[#f2f2ea]/80 to-transparent"
              />
            </div>
          </div>
        </div>

        {/* Copy — agrupado en el centro */}
        <div className="relative z-[4] flex h-full items-center justify-center px-4 pt-20 pb-8 md:pt-24">
          <div className="grid w-full max-w-[min(22rem,88vw)] grid-cols-1 gap-10 sm:max-w-[28rem] md:max-w-[36rem] md:grid-cols-2 md:gap-x-10 lg:max-w-[40rem] lg:gap-x-14">
            <div ref={leftColRef} className="flex justify-center md:justify-end">
              <PortraitColumn
                side="left"
                titleAccent="EN"
                title="CLÍNICA"
                description="Casos, tratamientos y resultados directamente en consulta."
                href="#servicios"
              />
            </div>
            <div ref={rightColRef} className="flex justify-center md:justify-start">
              <PortraitColumn
                side="right"
                title="DE CLÍNICA"
                titleAccent="FUERA"
                description="Comunidad, eventos y contenido para pacientes y seguidores."
                href="#testimonios"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cola de scroll — permite terminar la subida de fondo10 a pantalla completa */}
      <div aria-hidden className="h-[100svh] w-full shrink-0" />
    </div>

    {/* Clip fijo en body — encima de Raúl, detrás del header (logo + agenda) */}
    {overlayReady &&
      createPortal(
        <div
          className="pointer-events-none fixed inset-0 z-[150] overflow-hidden"
          aria-hidden
        >
          <div
            ref={fondo10Ref}
            data-black-surface
            className="absolute inset-x-0 top-0 h-[100dvh] min-h-[100svh] w-full will-change-transform"
          >
            <div className="relative h-full w-full bg-black">
              <Image
                src="/images/fondo10.png"
                alt="Dr. Raúl — momentos destacados"
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
