"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { HeroBannerReveal } from "./HeroBannerReveal";
import { HeroFeatures } from "./HeroFeatures";
import { TopographicBackground } from "./TopographicBackground";
import { DrGsmileVerifiedBadge } from "./ui/drgsmile-verified-badge";

/** DOF solo sobre retratos de fondo — la imagen principal queda fuera */
const dofOverlay =
  "absolute inset-0 z-10 backdrop-blur-[2px] max-lg:bg-white/10 max-lg:backdrop-blur-none";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const sloganRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      if (sloganRef.current) {
        tl.fromTo(
          sloganRef.current,
          { x: -24, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.82,
            force3D: true,
          },
          0.15
        );
      }
      if (imageRef.current) {
        tl.fromTo(
          imageRef.current,
          { y: 38, scale: 0.985, opacity: 0 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1,
            force3D: true,
          },
          0.05
        );
      }

      return () => tl.kill();
    });

    return () => {
      media.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-light-surface
      className="relative h-screen min-h-[700px] w-full overflow-hidden bg-[#f2f2ea] max-lg:h-[100dvh] max-lg:min-h-[100dvh]"
    >
      <div className="absolute inset-0 bg-white">
        <TopographicBackground lineColor="#cfcfc3" />
      </div>

      {/* Imagen central — grande y anclada abajo */}
      <div
        ref={imageRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[23%] z-[16] flex origin-bottom items-end justify-center will-change-transform lg:top-[10%]"
      >
        {/* Retratos de fondo — desktop */}
        <div className="absolute inset-0 isolate z-[5] max-lg:hidden">
          <Image
            src="/images/1-Photoroom.png"
            alt=""
            width={700}
            height={900}
            loading="lazy"
            className="absolute -left-[6%] bottom-0 z-[7] h-[78%] w-auto max-w-[min(42vw,520px)] object-contain object-left-bottom"
            aria-hidden="true"
          />

          <Image
            src="/images/2-Photoroom.png"
            alt=""
            width={700}
            height={900}
            loading="lazy"
            className="absolute left-[8%] bottom-[-4%] z-[8] h-[78%] w-auto max-w-[min(42vw,520px)] -translate-x-[2%] object-contain object-left-bottom"
            aria-hidden="true"
          />

          <Image
            src="/images/3-Photoroom.png"
            alt=""
            width={700}
            height={900}
            loading="lazy"
            className="absolute left-[20%] bottom-0 z-[6] h-[78%] w-auto max-w-[min(42vw,520px)] translate-x-[5%] object-contain object-bottom"
            aria-hidden="true"
          />

          <Image
            src="/images/6-Photoroom.png"
            alt=""
            width={700}
            height={900}
            loading="lazy"
            className="absolute -right-[4%] bottom-[-4%] z-[7] h-[78%] w-auto max-w-[min(42vw,520px)] translate-x-[2%] object-contain object-right-bottom"
            aria-hidden="true"
          />

          <div className="relative mx-auto flex h-full w-[min(1300px,98vw)] items-end justify-center">
            <Image
              src="/images/4-Photoroom.png"
              alt=""
              width={700}
              height={900}
              loading="lazy"
              className="absolute right-[11%] bottom-0 z-[9] h-[78%] w-auto max-w-[min(42vw,520px)] -translate-x-[6%] object-contain object-bottom"
              aria-hidden="true"
            />

            <Image
              src="/images/5-Photoroom.png"
              alt=""
              width={700}
              height={900}
              loading="lazy"
              className="absolute right-[1%] bottom-0 z-[6] h-[78%] w-auto max-w-[min(42vw,520px)] translate-x-[14%] object-contain object-bottom"
              aria-hidden="true"
            />
          </div>

          <div aria-hidden className={dofOverlay} />
        </div>

        {/* Primer plano — doctor nítido, sin DOF */}
        <div className="relative z-10 flex h-full w-[min(1300px,98vw)] items-end justify-center max-lg:items-start max-lg:justify-center max-lg:pb-[clamp(9rem,calc(13vh+5rem),11.5rem)] max-lg:pt-[6%]">
          <div className="relative h-full w-auto max-w-full max-lg:flex max-lg:h-[72%] max-lg:max-h-[620px] max-lg:w-full max-lg:translate-y-[10%] max-lg:justify-center lg:pointer-events-auto">
            {/* Retratos de fondo — móvil, alineados con imagen principal */}
            <div className="absolute inset-0 z-[5] max-lg:left-1/2 max-lg:w-full max-lg:max-w-none max-lg:-translate-x-1/2 lg:hidden">
              <Image
                src="/images/1-Photoroom.png"
                alt=""
                width={700}
                height={900}
                loading="lazy"
                className="absolute -left-[14%] top-[6%] z-[7] h-[88%] w-auto max-w-[46vw] object-contain object-left-top"
                aria-hidden="true"
              />
              <Image
                src="/images/2-Photoroom.png"
                alt=""
                width={700}
                height={900}
                loading="lazy"
                className="absolute left-[2%] top-[8%] z-[8] h-[86%] w-auto max-w-[44vw] object-contain object-left-top"
                aria-hidden="true"
              />
              <Image
                src="/images/3-Photoroom.png"
                alt=""
                width={700}
                height={900}
                loading="lazy"
                className="absolute left-[18%] top-[10%] z-[6] h-[84%] w-auto max-w-[40vw] object-contain object-top"
                aria-hidden="true"
              />
              <Image
                src="/images/6-Photoroom.png"
                alt=""
                width={700}
                height={900}
                loading="lazy"
                className="absolute -right-[14%] top-[6%] z-[7] h-[88%] w-auto max-w-[46vw] object-contain object-right-top"
                aria-hidden="true"
              />
              <Image
                src="/images/4-Photoroom.png"
                alt=""
                width={700}
                height={900}
                loading="lazy"
                className="absolute right-[8%] top-[10%] z-[9] h-[84%] w-auto max-w-[40vw] object-contain object-top"
                aria-hidden="true"
              />
              <Image
                src="/images/5-Photoroom.png"
                alt=""
                width={700}
                height={900}
                loading="lazy"
                className="absolute right-[0%] top-[12%] z-[6] h-[82%] w-auto max-w-[38vw] object-contain object-top"
                aria-hidden="true"
              />
              <div aria-hidden className={dofOverlay} />
            </div>

            <HeroBannerReveal />
          </div>
        </div>
      </div>

      {/* Capa blanca unificada — difuminado suave imagen → blanco sólido (móvil) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 left-0 right-0 z-[48] h-[clamp(320px,56dvh,520px)] w-full min-w-full translate-y-[2%] lg:hidden"
        style={{
          background:
            "linear-gradient(to top, #ffffff 0%, #ffffff 52%, rgba(255,255,255,0.97) 62%, rgba(255,255,255,0.88) 72%, rgba(255,255,255,0.72) 80%, rgba(255,255,255,0.5) 87%, rgba(255,255,255,0.25) 93%, rgba(255,255,255,0.08) 97%, transparent 100%)",
        }}
      />

      {/* Badge — siempre visible al inicio; se oculta con el morph */}
      <div data-hero-fade className="opacity-100">
        <DrGsmileVerifiedBadge className="absolute bottom-[max(2.75rem,calc(env(safe-area-inset-bottom,0px)+2.75rem))] left-1/2 z-[50] -translate-x-1/2 lg:bottom-12 lg:left-auto lg:right-14 lg:translate-x-0" />
      </div>

      {/* Slogan */}
      <div
        ref={sloganRef}
        data-hero-fade
        className="absolute left-5 right-5 top-[13%] z-[55] w-auto max-w-none bg-white/90 px-3 py-2 text-center opacity-100 will-change-[transform,opacity] lg:left-14 lg:right-auto lg:top-[20%] lg:max-w-[360px] lg:bg-transparent lg:px-0 lg:py-0 lg:text-left"
      >
        <div className="relative pl-1">
          <h1 className="font-[family-name:var(--font-serif)] text-[1.05rem] leading-[1.35] tracking-[0.02em] text-[#1B3022] md:text-[1.25rem] lg:text-[1.45rem]">
            <span className="relative mb-1 inline-block whitespace-nowrap md:mb-0">
              DISEÑAMOS{" "}
              <strong className="font-bold">SONRISAS,</strong>
            </span>
            <span className="block whitespace-nowrap">
              TRANSFORMAMOS <strong className="font-bold">CONFIANZA.</strong>
            </span>
          </h1>
        </div>
      </div>

      {/* Features liquid glass — siempre visibles al inicio */}
      <div data-hero-fade className="opacity-100">
        <HeroFeatures />
      </div>
    </section>
  );
}
