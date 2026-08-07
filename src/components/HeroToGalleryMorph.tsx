"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HeroSection } from "./HeroSection";
import { GallerySection, GALLERY_CREAM_TAIL, type GallerySectionHandle } from "./GallerySection";
import { SiteHeader } from "./SiteHeader";
import { TopographicBackground } from "./TopographicBackground";
import { YouCanScroll } from "./ui/you-can-scroll";
import { Fondo1RaulOverlay, SIGNATURE_DRAW_END, SIGNATURE_DRAW_START } from "./Fondo1RaulOverlay";
import { HeroMainPhoto } from "./HeroMainPhoto";
import { HeroVelocityBackground } from "./HeroVelocityBackground";
import { GalleryToDualTransition } from "./GalleryToDualTransition";

function BlackLinesBackground({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[1] bg-[#11120f] ${className}`}
      aria-hidden
    >
      <TopographicBackground lineColor="#cfcfc3" pauseOnLightSurface />
    </div>
  );
}

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ASPECT = 16 / 9;

const MORPH_PHASE2_START = SIGNATURE_DRAW_END + 0.06;

const photoBottom = (top: number, height: number, gap = 12) => top + height + gap;

/**
 * 1) Hero shrinks to a 16:9 photo (fondo1)
 * 2) Lands on the fondo1 slot
 * 3) Hands off — GallerySection runs exactly as before
 */
export function HeroToGalleryMorph() {
  const pinRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const heroLayerRef = useRef<HTMLDivElement>(null);
  const fotoLayerRef = useRef<HTMLDivElement>(null);
  const signatureLayerRef = useRef<HTMLDivElement>(null);
  const velocityBgRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<GallerySectionHandle>(null);

  useEffect(() => {
    let timer = 0;

    const alignHashTarget = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;

      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        ScrollTrigger.refresh();
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ block: "start" });
        });
      }, 280);
    };

    alignHashTarget();
    window.addEventListener("hashchange", alignHashTarget);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("hashchange", alignHashTarget);
    };
  }, []);

  useEffect(() => {
    const pin = pinRef.current;
    const sticky = stickyRef.current;
    const frame = frameRef.current;
    const heroLayer = heroLayerRef.current;
    const fotoLayer = fotoLayerRef.current;
    const signatureLayer = signatureLayerRef.current;
    const velocityBg = velocityBgRef.current;
    const bridge = bridgeRef.current;
    if (
      !pin ||
      !sticky ||
      !frame ||
      !heroLayer ||
      !fotoLayer ||
      !signatureLayer ||
      !velocityBg ||
      !bridge
    ) {
      return;
    }

    const fadeEls = heroLayer.querySelectorAll("[data-hero-fade]");

    /** Always 16:9 — width from target slot, height = width / (16/9) */
    const getTarget16x9 = () => {
      const el = measureRef.current?.getFondo1Element();
      const stickyRect = sticky.getBoundingClientRect();

      if (el) {
        const r = el.getBoundingClientRect();
        if (r.width > 2) {
          const width = r.width;
          const height = width / ASPECT;
          return {
            width,
            height,
            left: r.left - stickyRect.left,
            top: r.top - stickyRect.top,
          };
        }
      }

      // Fallback: center column ≈ 1/3 of content width
      const pad = window.innerWidth >= 1024 ? 32 : 16;
      const contentW = Math.min(1600, sticky.clientWidth - pad * 2);
      const gap = 8;
      const colW = (contentW - gap * 2) / 3;
      const width = colW;
      const height = width / ASPECT;
      const left = (sticky.clientWidth - contentW) / 2 + colW + gap;
      const top = sticky.clientHeight * 0.04 + height * 0.15;
      return { width, height, left, top };
    };

    const midPhoto = () => {
      const t = getTarget16x9();
      const compact = window.innerWidth < 1024;
      const width = Math.min(
        t.width * (compact ? 2.65 : 1.75),
        window.innerWidth * (compact ? 0.86 : 0.72)
      );
      const height = width / ASPECT;
      return {
        width,
        height,
        left: (sticky.clientWidth - width) / 2,
        top: (sticky.clientHeight - height) / 2,
      };
    };

    const ctx = gsap.context(() => {
      const frameBase = {
        position: "absolute" as const,
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        borderRadius: 0,
        force3D: true,
      };

      gsap.set(frame, {
        ...frameBase,
        overflow: "hidden",
        opacity: 1,
        zIndex: 30,
      });
      gsap.set(signatureLayer, {
        ...frameBase,
        overflow: "visible",
        opacity: 0,
        zIndex: 150,
        pointerEvents: "none",
      });
      gsap.set(velocityBg, {
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        opacity: 0,
        zIndex: 5,
        pointerEvents: "none",
        force3D: true,
      });
      gsap.set(bridge, {
        position: "absolute",
        left: 0,
        width: "100%",
        zIndex: 25,
        opacity: 0,
        pointerEvents: "none",
        top: () => photoBottom(midPhoto().top, midPhoto().height),
      });
      gsap.set(fotoLayer, { opacity: 0, pointerEvents: "none", filter: "grayscale(0)" });
      gsap.set(heroLayer, { opacity: 1, pointerEvents: "auto" });
      // Contenedores del hero visibles desde el frame 0 (no ocultarlos al init)
      gsap.set(fadeEls, { autoAlpha: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: "bottom bottom",
          scrub: window.innerWidth < 1024 ? 0.58 : 0.82,
          invalidateOnRefresh: true,
        },
      });

      const morphTargets = (getRect: () => ReturnType<typeof midPhoto>) => ({
        width: () => getRect().width,
        height: () => getRect().height,
        left: () => getRect().left,
        top: () => getRect().top,
        force3D: true,
      });

      const velocityVerticalTargets = (
        getRect: () => ReturnType<typeof midPhoto>
      ) => ({
        top: () => getRect().top,
        height: () => getRect().height,
        force3D: true,
      });

      // Phase 1 — shrink to centered 16:9 photo, black around
      tl.to(
        [frame, signatureLayer],
        { ...morphTargets(midPhoto), duration: 0.5 },
        0
      );
      tl.to(
        velocityBg,
        { ...velocityVerticalTargets(midPhoto), duration: 0.5 },
        0
      );
      tl.to(frame, { borderRadius: 10, duration: 0.5 }, 0);
      // Ocultar features/badge/slogan solo cuando ya empezó a encoger (no al cargar)
      tl.to(
        fadeEls,
        {
          autoAlpha: 0,
          y: -22,
          duration: 0.2,
        },
        0.1
      );
      // Hero fuera primero; luego aparece solo banner-eleven-1 (sin crossfade con el equipo)
      tl.to(
        heroLayer,
        { opacity: 0, pointerEvents: "none", duration: 0.2 },
        0.2
      );
      tl.set(fotoLayer, { opacity: 1 }, 0.2);
      tl.fromTo(
        fotoLayer,
        { scale: 1.045 },
        { scale: 1, duration: 0.42 },
        0.2
      );
      tl.fromTo(
        signatureLayer,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.2 },
        0.21
      );
      tl.to(velocityBg, { opacity: 1, duration: 0.15 }, 0.22);

      // B/N progresivo mientras se dibuja la firma — completo al terminar el trazo
      tl.fromTo(
        fotoLayer,
        { filter: "grayscale(0)" },
        {
          filter: "grayscale(1)",
          duration: SIGNATURE_DRAW_END - SIGNATURE_DRAW_START,
        },
        SIGNATURE_DRAW_START
      );

      // Puente pegado bajo la foto — aparece cuando la foto ya está centrada
      tl.fromTo(
        bridge,
        { opacity: 0, clipPath: "inset(0 0 100% 0)" },
        {
          opacity: 1,
          clipPath: "inset(0 0 0% 0)",
          pointerEvents: "auto",
          duration: 0.2,
        },
        0.46
      );
      tl.to(
        bridge,
        {
          top: () => photoBottom(midPhoto().top, midPhoto().height),
          duration: 0.04,
        },
        0.5
      );

      // Phase 2 — sube hacia la galería sin cambiar tamaño (foto + puente + textos juntos)
      tl.to(
        [frame, signatureLayer],
        {
          width: () => midPhoto().width,
          height: () => midPhoto().height,
          left: () => midPhoto().left,
          top: () => getTarget16x9().top,
          force3D: true,
          duration: 0.28,
        },
        MORPH_PHASE2_START
      );
      tl.to(
        velocityBg,
        {
          ...velocityVerticalTargets(() => ({
            ...midPhoto(),
            top: getTarget16x9().top,
          })),
          duration: 0.28,
        },
        MORPH_PHASE2_START
      );
      tl.to(
        bridge,
        {
          top: () =>
            photoBottom(getTarget16x9().top, midPhoto().height),
          duration: 0.28,
        },
        MORPH_PHASE2_START
      );
      tl.to(frame, { borderRadius: 10, duration: 0.28 }, MORPH_PHASE2_START);
    }, pin);

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
  }, []);

  return (
    <div className="relative w-full bg-[#11120f]">
      <BlackLinesBackground />
      <SiteHeader
        morphPinRef={pinRef}
        bridgeRef={bridgeRef}
        galleryRef={galleryRef}
      />

      {/* Morph: hero → 16:9 → fondo1 slot */}
      <div
        ref={pinRef}
        data-morph-pin
        className="relative z-20 h-[125svh] w-full lg:h-[200vh]"
      >
        <div
          ref={stickyRef}
          data-black-surface
          className="sticky top-0 h-svh w-full overflow-visible"
        >
          {/* Invisible measure grid (flat 16:9 positions) */}
          <GallerySection ref={measureRef} mode="measure" className="z-0" />

          <div
            ref={velocityBgRef}
            className="pointer-events-none absolute left-0 top-0 z-[5] w-full opacity-0"
            aria-hidden
          >
            <HeroVelocityBackground />
          </div>

          <div
            ref={frameRef}
            className="relative z-10 will-change-[left,top,width,height,border-radius,opacity]"
          >
            <div ref={heroLayerRef} className="absolute inset-0">
              <HeroSection />
            </div>
            <div
              ref={fotoLayerRef}
              className="pointer-events-none absolute inset-0 overflow-hidden opacity-0"
              aria-hidden
            >
              <HeroMainPhoto className="h-full w-full" />
            </div>
          </div>
          {/* Firma — misma posición que el frame, sube junto con la foto */}
          <div
            ref={signatureLayerRef}
            className="pointer-events-none absolute left-0 top-0 z-[150] overflow-visible opacity-0"
            aria-hidden
          >
            <Fondo1RaulOverlay scrollTargetRef={pinRef} />
          </div>
          {/* Puente — pegado bajo la foto, sube con ella al scrollear */}
          <div ref={bridgeRef} data-black-surface className="absolute left-0 w-full opacity-0">
            <YouCanScroll compactIntro />
          </div>
        </div>
      </div>

      {/* Segunda sección — galería 3D */}
      <div ref={galleryRef}>
        <GallerySection mode="scroll" />
      </div>

      {/* Tercera sección (+ fondo10 sube encima al final del scroll) */}
      <GalleryToDualTransition creamOverlap={GALLERY_CREAM_TAIL} />
    </div>
  );
}
