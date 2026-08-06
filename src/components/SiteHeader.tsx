"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const LiquidMetalButton = dynamic(
  () => import("./ui/liquid-metal-button").then((m) => m.LiquidMetalButton),
  { ssr: false }
);

const DrGsmileLogoSvg = dynamic(
  () => import("./dr-gsmile-logo-svg").then((m) => m.DrGsmileLogoSvg),
  { ssr: false }
);

type SiteHeaderProps = {
  morphPinRef?: React.RefObject<HTMLElement | null>;
  bridgeRef?: React.RefObject<HTMLElement | null>;
  galleryRef?: React.RefObject<HTMLElement | null>;
};

export function SiteHeader({
  morphPinRef,
  bridgeRef,
  galleryRef,
}: SiteHeaderProps) {
  const headerRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  /** Solo true cuando el fondo negro cubre el header — en blanco = look de la 1ª sección */
  const [onBlack, setOnBlack] = useState(false);

  const isVisibleSurface = (el: Element | null) => {
    let node: Element | null = el;
    while (node && node !== document.documentElement) {
      const style = window.getComputedStyle(node);
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        Number(style.opacity) === 0
      ) {
        return false;
      }
      node = node.parentElement;
    }
    return true;
  };

  const isBlackBehind = useCallback((headerEl: HTMLElement, x: number, y: number) => {
    headerEl.style.pointerEvents = "none";
    const hit = document.elementFromPoint(x, y);
    headerEl.style.pointerEvents = "";
    if (!hit) return false;

    const light = hit.closest("[data-light-surface]");
    if (light && isVisibleSurface(light)) return false;

    const black = hit.closest("[data-black-surface]");
    return Boolean(black && isVisibleSurface(black));
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    let rafId = 0;
    let pending = false;

    const updateTheme = () => {
      pending = false;
      const sampleY = Math.min(headerEl.offsetHeight * 0.55, 40);
      const sampleX = Math.min(
        Math.max(window.innerWidth * 0.5, 80),
        window.innerWidth - 80
      );

      setOnBlack((prev) => {
        const next = isBlackBehind(headerEl, sampleX, sampleY);
        return prev === next ? prev : next;
      });
    };

    const scheduleThemeUpdate = () => {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(updateTheme);
    };

    const triggers: ScrollTrigger[] = [];

    if (morphPinRef?.current) {
      triggers.push(
        ScrollTrigger.create({
          trigger: morphPinRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: scheduleThemeUpdate,
        })
      );
    }

    if (bridgeRef?.current) {
      triggers.push(
        ScrollTrigger.create({
          trigger: bridgeRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: scheduleThemeUpdate,
          onEnter: scheduleThemeUpdate,
          onLeave: scheduleThemeUpdate,
          onEnterBack: scheduleThemeUpdate,
          onLeaveBack: scheduleThemeUpdate,
        })
      );
    }

    if (galleryRef?.current) {
      triggers.push(
        ScrollTrigger.create({
          trigger: galleryRef.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: scheduleThemeUpdate,
          onEnter: scheduleThemeUpdate,
          onLeave: scheduleThemeUpdate,
          onEnterBack: scheduleThemeUpdate,
          onLeaveBack: scheduleThemeUpdate,
        })
      );
    }

    window.addEventListener("scroll", scheduleThemeUpdate, { passive: true });
    window.addEventListener("resize", scheduleThemeUpdate, { passive: true });
    scheduleThemeUpdate();

    return () => {
      cancelAnimationFrame(rafId);
      triggers.forEach((tr) => tr.kill());
      window.removeEventListener("scroll", scheduleThemeUpdate);
      window.removeEventListener("resize", scheduleThemeUpdate);
    };
  }, [morphPinRef, bridgeRef, galleryRef, isBlackBehind]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed top-0 right-0 left-0 z-[200] px-4 py-3",
        "max-md:pt-[max(0.75rem,env(safe-area-inset-top))]",
        "sm:px-6 sm:py-4 md:px-10 md:py-5 lg:px-14"
      )}
    >
      <div className="relative mx-auto flex max-w-[1600px] items-center justify-between gap-2 sm:gap-3 md:gap-4">
        <Link
          href="/"
          className="z-10 min-w-0 flex-1 overflow-hidden pr-1 sm:flex-none sm:overflow-visible sm:pr-0"
        >
          <DrGsmileLogoSvg inverted={onBlack} />
        </Link>

        <div className="z-10 flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          <LiquidMetalButton
            variant="agenda"
            label="AGENDA"
            alignWithLogo
            inverted={onBlack}
            onClick={() => {
              window.location.hash = "agenda";
            }}
          />
          {/* Menú: siempre el look original de la 1ª sección (blanco + liquid glass) */}
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
  );
}
