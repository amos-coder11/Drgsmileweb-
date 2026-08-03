"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { TopographicBackground } from "./TopographicBackground";
import { DrGsmileVerifiedBadge } from "./ui/drgsmile-verified-badge";

const HeroFeatures = dynamic(
  () => import("./HeroFeatures").then((m) => m.HeroFeatures),
  { ssr: false }
);

const LiquidMetalButton = dynamic(
  () => import("./ui/liquid-metal-button").then((m) => m.LiquidMetalButton),
  { ssr: false }
);

const DrGsmileLogoSvg = dynamic(
  () => import("./dr-gsmile-logo-svg").then((m) => m.DrGsmileLogoSvg),
  { ssr: false }
);

/** DOF solo sobre retratos de fondo — la imagen principal queda fuera */
const dofOverlay = "absolute inset-0 z-10 backdrop-blur-[2px]";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const sloganRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (headerRef.current) {
      tl.fromTo(headerRef.current, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 });
    }
    if (sloganRef.current) {
      tl.fromTo(
        sloganRef.current,
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 1 },
        "-=0.4"
      );
    }
    if (imageRef.current) {
      tl.fromTo(
        imageRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        "-=0.8"
      );
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen min-h-[700px] w-full overflow-hidden bg-[#f2f2ea] max-md:h-[100dvh] max-md:min-h-[100dvh]"
    >
      <div className="absolute inset-0 bg-white">
        <TopographicBackground lineColor="#cfcfc3" />
      </div>

      {/* Header */}
      <header
        ref={headerRef}
        className="absolute top-0 right-0 left-0 z-50 px-4 py-3 max-md:pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-6 sm:py-4 md:px-10 md:py-5 lg:px-14"
      >
        <div className="relative mx-auto flex max-w-[1600px] items-center justify-between gap-2 sm:gap-3 md:gap-4">
          <Link
            href="/"
            className="z-10 min-w-0 flex-1 overflow-hidden pr-1 sm:flex-none sm:overflow-visible sm:pr-0"
          >
            <DrGsmileLogoSvg />
          </Link>

          <div className="z-10 flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
            <LiquidMetalButton
              variant="agenda"
              label="AGENDA"
              alignWithLogo
              onClick={() => {
                window.location.hash = "agenda";
              }}
            />
            <LiquidMetalButton
              variant="menu"
              ariaLabel="Menú"
              alignWithLogo
              onClick={() => setMenuOpen(!menuOpen)}
            />
          </div>
        </div>

        {menuOpen && (
          <nav className="absolute top-full right-4 left-4 z-50 mt-2 rounded-lg border border-[#1B3022]/10 bg-white p-6 shadow-xl sm:right-6 sm:left-6 md:right-10 md:left-auto md:w-64">
            {["Servicios", "Nosotros", "Testimonios", "Contacto"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block border-b border-gray-100 py-3 text-sm font-medium tracking-wide text-[#1B3022] last:border-0"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </nav>
        )}
      </header>

      {/* Imagen central — grande y anclada abajo */}
      <div
        ref={imageRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[16%] z-[16] flex items-end justify-center md:top-[10%]"
      >
        {/* Retratos de fondo — desktop */}
        <div className="absolute inset-0 isolate z-[5] max-md:hidden">
          <Image
            src="/images/1-Photoroom.png"
            alt=""
            width={700}
            height={900}
            className="absolute -left-[6%] bottom-0 z-[7] h-[78%] w-auto max-w-[min(42vw,520px)] object-contain object-left-bottom"
            aria-hidden="true"
          />

          <Image
            src="/images/2-Photoroom.png"
            alt=""
            width={700}
            height={900}
            className="absolute left-[8%] bottom-[-4%] z-[8] h-[78%] w-auto max-w-[min(42vw,520px)] -translate-x-[2%] object-contain object-left-bottom"
            aria-hidden="true"
          />

          <Image
            src="/images/3-Photoroom.png"
            alt=""
            width={700}
            height={900}
            className="absolute left-[20%] bottom-0 z-[6] h-[78%] w-auto max-w-[min(42vw,520px)] translate-x-[5%] object-contain object-bottom"
            aria-hidden="true"
          />

          <Image
            src="/images/6-Photoroom.png"
            alt=""
            width={700}
            height={900}
            className="absolute -right-[4%] bottom-[-4%] z-[7] h-[78%] w-auto max-w-[min(42vw,520px)] translate-x-[2%] object-contain object-right-bottom"
            aria-hidden="true"
          />

          <div className="relative mx-auto flex h-full w-[min(1300px,98vw)] items-end justify-center">
            <Image
              src="/images/4-Photoroom.png"
              alt=""
              width={700}
              height={900}
              className="absolute right-[11%] bottom-0 z-[9] h-[78%] w-auto max-w-[min(42vw,520px)] -translate-x-[6%] object-contain object-bottom"
              aria-hidden="true"
            />

            <Image
              src="/images/5-Photoroom.png"
              alt=""
              width={700}
              height={900}
              className="absolute right-[1%] bottom-0 z-[6] h-[78%] w-auto max-w-[min(42vw,520px)] translate-x-[14%] object-contain object-bottom"
              aria-hidden="true"
            />
          </div>

          <div aria-hidden className={dofOverlay} />
        </div>

        {/* Primer plano — doctor nítido, sin DOF */}
        <div className="relative z-10 flex h-full w-[min(1300px,98vw)] items-end justify-center max-md:items-start max-md:justify-center max-md:pb-[clamp(9rem,calc(13vh+5rem),11.5rem)] max-md:pt-[18%]">
          <div className="relative h-full w-auto max-w-full max-md:flex max-md:h-[72%] max-md:max-h-[520px] max-md:w-full max-md:translate-y-[10%] max-md:justify-center">
            {/* Retratos de fondo — móvil, alineados con imagen principal */}
            <div className="absolute inset-0 z-[5] max-md:left-1/2 max-md:w-full max-md:max-w-none max-md:-translate-x-1/2 md:hidden">
              <Image
                src="/images/1-Photoroom.png"
                alt=""
                width={700}
                height={900}
                className="absolute -left-[14%] top-[6%] z-[7] h-[88%] w-auto max-w-[46vw] object-contain object-left-top"
                aria-hidden="true"
              />
              <Image
                src="/images/2-Photoroom.png"
                alt=""
                width={700}
                height={900}
                className="absolute left-[2%] top-[8%] z-[8] h-[86%] w-auto max-w-[44vw] object-contain object-left-top"
                aria-hidden="true"
              />
              <Image
                src="/images/3-Photoroom.png"
                alt=""
                width={700}
                height={900}
                className="absolute left-[18%] top-[10%] z-[6] h-[84%] w-auto max-w-[40vw] object-contain object-top"
                aria-hidden="true"
              />
              <Image
                src="/images/6-Photoroom.png"
                alt=""
                width={700}
                height={900}
                className="absolute -right-[14%] top-[6%] z-[7] h-[88%] w-auto max-w-[46vw] object-contain object-right-top"
                aria-hidden="true"
              />
              <Image
                src="/images/4-Photoroom.png"
                alt=""
                width={700}
                height={900}
                className="absolute right-[8%] top-[10%] z-[9] h-[84%] w-auto max-w-[40vw] object-contain object-top"
                aria-hidden="true"
              />
              <Image
                src="/images/5-Photoroom.png"
                alt=""
                width={700}
                height={900}
                className="absolute right-[0%] top-[12%] z-[6] h-[82%] w-auto max-w-[38vw] object-contain object-top"
                aria-hidden="true"
              />
              <div aria-hidden className={dofOverlay} />
            </div>

            <Image
              src="/images/banner-eleven-1.png"
              alt="Drgsmile"
              width={900}
              height={1200}
              className="relative z-10 mx-auto h-full w-auto max-w-full translate-y-[2%] object-contain object-bottom max-md:translate-y-0 max-md:scale-[1.08] max-md:object-[center_top]"
              priority
              sizes="(max-width: 1100px) 95vw, 1100px"
            />
          </div>
        </div>
      </div>

      {/* Capa blanca unificada — difuminado suave imagen → blanco sólido (móvil) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 left-0 right-0 z-[48] h-[clamp(320px,56dvh,450px)] w-full min-w-full translate-y-[2%] md:hidden"
        style={{
          background:
            "linear-gradient(to top, #ffffff 0%, #ffffff 52%, rgba(255,255,255,0.97) 62%, rgba(255,255,255,0.88) 72%, rgba(255,255,255,0.72) 80%, rgba(255,255,255,0.5) 87%, rgba(255,255,255,0.25) 93%, rgba(255,255,255,0.08) 97%, transparent 100%)",
        }}
      />

      {/* Badge Instagram — visible y clicable en móvil y desktop */}
      <DrGsmileVerifiedBadge className="absolute bottom-[max(2.75rem,calc(env(safe-area-inset-bottom,0px)+2.75rem))] left-1/2 z-[50] -translate-x-1/2 md:bottom-8 md:left-auto md:right-10 md:translate-x-0 lg:bottom-12 lg:right-14" />

      {/* Slogan */}
      <div
        ref={sloganRef}
        className="absolute top-[16%] left-5 z-20 max-w-[280px] md:top-[20%] md:left-10 md:max-w-[320px] lg:left-14 lg:max-w-[360px]"
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

      <HeroFeatures />
    </section>
  );
}
