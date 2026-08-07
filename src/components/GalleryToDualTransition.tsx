"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { TopographicBackground } from "./TopographicBackground";
import { HeroVelocityBackground } from "./HeroVelocityBackground";
import { cn } from "@/lib/utils";
import { SvgFollowScroll } from "./DrGsmileScrollExperience";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const SCROLL_HEIGHT = "200svh";

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
        "relative flex max-w-[12rem] flex-col lg:max-w-[14.5rem]",
        isLeft ? "items-start text-left" : "items-end text-right",
        className
      )}
    >
      <h2
        className={cn(
          "font-[family-name:var(--font-body)] text-[clamp(1.25rem,3.8vw,3.25rem)] font-bold uppercase leading-[0.95] tracking-[-0.04em] text-[#1B3022]",
          isLeft ? "text-left" : "text-right"
        )}
      >
        {titleAccent ? (
          <>
            <span
              className={cn(
                "mb-0.5 block font-[family-name:var(--font-serif)] text-[1.05em] font-normal leading-none text-[#609edb]",
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
          "mt-2 max-w-[14.5rem] text-[0.78rem] leading-relaxed text-[#1B3022]/80 lg:mt-4 lg:text-[0.95rem]",
          !isLeft && "ml-auto text-right"
        )}
      >
        {description}
      </p>
      <Link
        href={href}
        className="mt-3 inline-flex size-10 items-center justify-center rounded-sm bg-[#609edb] text-[#11120f] transition-transform duration-500 ease-out hover:-translate-y-1 lg:mt-6 lg:size-11"
        aria-label={title}
      >
        <ArrowUpRight className="size-5" strokeWidth={2.25} />
      </Link>
    </div>
  );
}

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

  useEffect(() => {
    let ctx: gsap.Context | undefined;
    let attempts = 0;

    const setup = () => {
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
        attempts += 1;
        if (attempts < 40) requestAnimationFrame(setup);
        return;
      }

      ctx = gsap.context(() => {
        const compact = window.innerWidth < 1024;
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
        const portraitOffset = compact ? "24vw" : "44vw";

        gsap.set(leftPortrait, {
          x: reduceMotion ? 0 : `-${portraitOffset}`,
          opacity: reduceMotion ? 1 : 0,
          scale: reduceMotion ? 1 : 0.96,
          force3D: true,
        });
        gsap.set(rightPortrait, {
          x: reduceMotion ? 0 : portraitOffset,
          opacity: reduceMotion ? 1 : 0,
          scale: reduceMotion ? 1 : 0.96,
          force3D: true,
        });
        gsap.set(leftCol, {
          x: reduceMotion ? 0 : compact ? -20 : -32,
          opacity: reduceMotion ? 1 : 0,
        });
        gsap.set(rightCol, {
          x: reduceMotion ? 0 : compact ? 20 : 32,
          opacity: reduceMotion ? 1 : 0,
        });
        gsap.set(fondo10, { y: "100%", force3D: true });

        if (!reduceMotion) {
          const portraitTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 92%",
              end: "center center",
              scrub: compact ? 0.52 : 0.78,
              invalidateOnRefresh: true,
            },
          });

          portraitTl.to(
            leftPortrait,
            { x: 0, opacity: 1, scale: 1, ease: "power2.out", duration: 1 },
            0
          );
          portraitTl.to(
            rightPortrait,
            { x: 0, opacity: 1, scale: 1, ease: "power2.out", duration: 1 },
            0
          );
          portraitTl.to(
            leftCol,
            { x: 0, opacity: 1, ease: "power2.out", duration: 0.7 },
            0.22
          );
          portraitTl.to(
            rightCol,
            { x: 0, opacity: 1, ease: "power2.out", duration: 0.7 },
            0.22
          );
        }

        // fondo10 sube a pantalla completa
        gsap.fromTo(
          fondo10,
          { y: "100%" },
          {
            y: "0%",
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: compact ? 0.9 : 1.25,
              invalidateOnRefresh: true,
            },
          }
        );

      }, section);

      ScrollTrigger.refresh();
    };

    requestAnimationFrame(setup);

    const debouncedRefresh = () => {
      window.clearTimeout((debouncedRefresh as { t?: number }).t);
      (debouncedRefresh as { t?: number }).t = window.setTimeout(
        () => ScrollTrigger.refresh(),
        150
      );
    };
    window.addEventListener("load", debouncedRefresh);
    window.addEventListener("resize", debouncedRefresh);

    return () => {
      window.removeEventListener("load", debouncedRefresh);
      window.removeEventListener("resize", debouncedRefresh);
      ctx?.revert();
    };
  }, []);

  return (
    <>
      <div
        ref={sectionRef}
        data-light-surface
        className="relative z-30 w-full bg-[#f2f2ea]"
        style={{
          minHeight: SCROLL_HEIGHT,
          marginTop: `calc(-1 * ${creamOverlap})`,
        }}
      >
        <div ref={stickyRef} className="sticky top-0 h-svh w-full overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[#f2f2ea]">
            <TopographicBackground lineColor="#cfcfc3" />
          </div>
          <div className="pointer-events-none absolute inset-0 z-[1]">
            <HeroVelocityBackground variant="light" />
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-[2] bg-[radial-gradient(ellipse_38%_50%_at_50%_52%,#f2f2ea_0%,#f2f2ea_58%,rgba(242,242,234,0.5)_78%,transparent_100%)]"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
            <div
              ref={leftPortraitRef}
              className="absolute bottom-0 left-0 flex h-[min(88svh,880px)] items-end will-change-transform max-lg:h-[54svh]"
            >
              <div className="relative h-full">
                <Image
                  src="/images/Raulizquierda.png"
                  alt=""
                  width={898}
                  height={1984}
                  className="h-full w-auto max-w-[min(44vw,420px)] object-contain object-left-bottom max-lg:max-w-[50vw]"
                  sizes="(max-width: 768px) 54vw, 420px"
                  priority
                  aria-hidden
                />
              </div>
            </div>
            <div
              ref={rightPortraitRef}
              className="absolute bottom-0 right-0 flex h-[min(88svh,880px)] items-end will-change-transform max-lg:h-[54svh]"
            >
              <div className="relative h-full">
                <Image
                  src="/images/Raulderecha.png"
                  alt=""
                  width={898}
                  height={1984}
                  className="h-full w-auto max-w-[min(44vw,420px)] object-contain object-right-bottom max-lg:max-w-[50vw]"
                  sizes="(max-width: 768px) 54vw, 420px"
                  priority
                  aria-hidden
                />
              </div>
            </div>
          </div>
          <div className="relative z-[4] flex h-full items-start justify-center px-4 pb-8 pt-[14svh] lg:items-center lg:pt-24">
            <div className="grid w-full max-w-[36rem] grid-cols-2 gap-6 lg:max-w-[40rem] lg:gap-x-14">
              <div ref={leftColRef} className="flex justify-center will-change-transform lg:justify-end">
                <PortraitColumn
                  side="left"
                  titleAccent="EN"
                  title="CLÍNICA"
                  description="Casos, tratamientos y resultados directamente en consulta."
                  href="#servicios"
                />
              </div>
              <div ref={rightColRef} className="flex justify-center will-change-transform lg:justify-start">
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

        <div
          ref={fondo10Ref}
          data-black-surface
          className="relative h-[100svh] w-full shrink-0 overflow-hidden bg-[#f2f2ea] will-change-transform"
        >
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

      <SvgFollowScroll />
    </>
  );
}
