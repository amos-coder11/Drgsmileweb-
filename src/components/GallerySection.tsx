"use client";

import { forwardRef, useImperativeHandle, useRef, type CSSProperties } from "react";
import {
  ContainerScroll,
  ContainerSticky,
  GalleryCol,
  GalleryContainer,
} from "@/components/ui/animated-gallery";
import { cn } from "@/lib/utils";
import { HeroMainPhoto } from "@/components/HeroMainPhoto";

const IMAGES_1 = [
  "/images/fondo2.png",
  "/images/fondo5.png",
  "/images/fondo9.png",
  "/images/fondo12.png",
];

const IMAGES_2 = [
  "/images/fondo3.png",
  "/images/fondo8.png",
  "/images/fondo11.png",
];

const IMAGES_3 = [
  "/images/fondo4.png",
  "/images/fondo6.png",
  "/images/fondo7.png",
  "/images/fondo10.png",
];

export type GallerySectionHandle = {
  /** Layout box del slot principal (equipo), for morph landing */
  getFondo1Element: () => HTMLElement | null;
};

type GallerySectionProps = {
  /** scroll = animación real; measure = layout invisible para el morph */
  mode?: "scroll" | "measure";
  className?: string;
};

const GALLERY_FADE_HEIGHT = "min(50vh, 520px)";

const galleryBottomFadeStyle: CSSProperties = {
  background: [
    "linear-gradient(to bottom,",
    "transparent 0%,",
    "rgba(242,242,234,0.04) 12%,",
    "rgba(242,242,234,0.18) 28%,",
    "rgba(242,242,234,0.42) 46%,",
    "rgba(242,242,234,0.68) 62%,",
    "rgba(242,242,234,0.88) 78%,",
    "#f2f2ea 100%)",
  ].join(" "),
};

/** Altura del tramo crema tras el carrusel — debe coincidir con el -mt de la 3ª sección */
export const GALLERY_CREAM_TAIL = "min(28vh, 260px)";

function GalleryBottomFade({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-x-0 bottom-0 z-30", className)}
      style={{
        height: GALLERY_FADE_HEIGHT,
        ...galleryBottomFadeStyle,
      }}
    />
  );
}

function MeasureSlot() {
  return (
    <div
      className="aspect-video block h-auto w-full rounded-md"
      aria-hidden
    />
  );
}

function HeroTeamSlot({
  slotRef,
  priority = false,
}: {
  slotRef?: React.Ref<HTMLDivElement>;
  priority?: boolean;
}) {
  return (
    <div
      ref={slotRef}
      className="aspect-video relative block h-auto w-full overflow-hidden rounded-md bg-white shadow-md"
    >
      <HeroMainPhoto className="absolute inset-0" />
    </div>
  );
}

function GalleryImage({
  src,
  alt,
  imageRef,
  priority = false,
}: {
  src: string;
  alt: string;
  imageRef?: React.Ref<HTMLImageElement>;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imageRef}
      className="aspect-video block h-auto max-h-full w-full rounded-md object-cover shadow-md"
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}

export const GallerySection = forwardRef<
  GallerySectionHandle,
  GallerySectionProps
>(function GallerySection({ mode = "scroll", className }, ref) {
  const teamSlotRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getFondo1Element: () => teamSlotRef.current,
  }));

  // Flat 16:9 layout matching the gallery grid (no 3D) — only for morph target
  if (mode === "measure") {
    return (
      <section
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0",
          className
        )}
        aria-hidden
      >
        <div className="flex h-svh items-start justify-center px-4 pt-[4vh] md:px-8 md:pt-[6vh]">
          <div className="w-full max-w-[1600px]">
            <div className="relative grid size-full grid-cols-3 gap-2">
              <div className="relative -mt-2 flex w-full flex-col gap-2">
                {IMAGES_1.map((_, i) => (
                  <MeasureSlot key={`m1-${i}`} />
                ))}
              </div>
              <div className="relative mt-[-50%] flex w-full flex-col gap-2">
                <HeroTeamSlot slotRef={teamSlotRef} priority />
                {IMAGES_2.map((src, i) => (
                  <MeasureSlot key={`m2-${i}`} />
                ))}
              </div>
              <div className="relative -mt-2 flex w-full flex-col gap-2">
                {IMAGES_3.map((_, i) => (
                  <MeasureSlot key={`m3-${i}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={ref}
      data-black-surface
      className={cn("relative bg-black", className)}
      aria-label="Galería de sonrisas"
    >
      <ContainerScroll className="relative z-10 h-[260vh]">
        <ContainerSticky className="flex h-svh items-start justify-center px-4 pt-[4vh] md:px-8 md:pt-[6vh]">
          <GalleryContainer>
            <GalleryCol yRange={["-10%", "2%"]} className="-mt-2">
              {IMAGES_1.map((src, i) => (
                <GalleryImage
                  key={`s1-${i}`}
                  src={src}
                  alt="Caso clínico odontológico"
                />
              ))}
            </GalleryCol>
            <GalleryCol className="mt-[-50%]" yRange={["15%", "5%"]}>
              <HeroTeamSlot priority />
              {IMAGES_2.map((src, i) => (
                <GalleryImage
                  key={`s2-${i}`}
                  src={src}
                  alt="Tratamiento dental"
                />
              ))}
            </GalleryCol>
            <GalleryCol yRange={["-10%", "2%"]} className="-mt-2">
              {IMAGES_3.map((src, i) => (
                <GalleryImage
                  key={`s3-${i}`}
                  src={src}
                  alt="Resultado estético dental"
                />
              ))}
            </GalleryCol>
          </GalleryContainer>
          <GalleryBottomFade />
        </ContainerSticky>
      </ContainerScroll>

      {/* Tramo crema sólido — sin franja negra, enlaza con la 3ª sección */}
      <div
        aria-hidden
        className="relative z-10 w-full bg-[#f2f2ea]"
        style={{ height: GALLERY_CREAM_TAIL }}
      />
    </section>
  );
});
