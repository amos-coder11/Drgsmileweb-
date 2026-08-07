"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";

export interface CardItem {
  imgUrl: string;
  alt?: string;
  linkUrl?: string;
}

interface CardFanCarouselProps {
  cards: CardItem[];
}

const MAX_VISIBLE = 7;
const MOBILE_VISIBLE = MAX_VISIBLE;

const FAN_POSITIONS = [
  { rot: -21, scale: 0.7756, x: -30, y: 0.4, zIndex: 1 },
  { rot: -14, scale: 0.8498, x: -22, y: 0.25, zIndex: 2 },
  { rot: -7, scale: 0.9346, x: -11, y: 0.1, zIndex: 3 },
  { rot: 0, scale: 1, x: 0, y: 0, zIndex: 10 },
  { rot: 7, scale: 0.9346, x: 11, y: 0.1, zIndex: 3 },
  { rot: 14, scale: 0.8498, x: 22, y: 0.25, zIndex: 2 },
  { rot: 21, scale: 0.7756, x: 30, y: 0.4, zIndex: 1 },
];

function getResponsiveMultiplier(width: number) {
  if (width < 480) return 0.42;
  if (width < 640) return 0.46;
  if (width < 768) return 0.5;
  if (width < 1024) return 0.75;
  return 1;
}

function getHeightMultiplier(width: number) {
  const idealPx =
    width < 480
      ? 352
      : width < 640
        ? 416
        : width < 768
          ? 448
          : width < 1024
            ? 544
            : 608;
  return Math.min(1, (window.innerHeight * 0.7) / idealPx);
}

function getSlotConfig(totalCards: number, slot: number) {
  if (totalCards >= MAX_VISIBLE) return FAN_POSITIONS[slot];
  const center = totalCards >> 1;
  const distance = totalCards > 1 ? (slot - center) / center : 0;
  const absDistance = Math.abs(distance);
  return {
    rot: distance * 21,
    scale: 1 - 0.2244 * absDistance * absDistance,
    x: distance * 30,
    y: absDistance * absDistance * 0.4,
    zIndex: 10 - Math.abs(slot - center),
  };
}

export default function CardFanCarousel({ cards }: CardFanCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const firstEntrance = useRef(true);
  const animating = useRef(false);
  const direction = useRef<"left" | "right">("right");
  const previousVisible = useRef<Set<number>>(new Set());
  const [inView, setInView] = useState(false);
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
  const [visibleSlots, setVisibleSlots] = useState(MAX_VISIBLE);
  const [layoutVersion, setLayoutVersion] = useState(0);

  const totalCards = cards.length;
  const paginated = totalCards > visibleSlots;
  const [centerIndex, setCenterIndex] = useState(
    totalCards > MAX_VISIBLE ? MAX_VISIBLE >> 1 : totalCards >> 1
  );

  const visibleMap = useMemo(() => {
    const map = new Map<number, number>();
    if (!paginated) {
      cards.forEach((_, index) => map.set(index, index));
      return map;
    }
    const half = visibleSlots >> 1;
    for (let slot = 0; slot < visibleSlots; slot += 1) {
      const index =
        ((centerIndex + slot - half) % totalCards + totalCards) % totalCards;
      map.set(index, slot);
    }
    return map;
  }, [cards, centerIndex, paginated, totalCards, visibleSlots]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        observer.disconnect();
      },
      { threshold: 0.2 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !inView || !totalCards) return;

    const elements = Array.from(
      container.querySelectorAll<HTMLElement>(".fan-card")
    );
    const multiplier = getResponsiveMultiplier(window.innerWidth);
    const heightMultiplier = getHeightMultiplier(window.innerWidth);
    const slotCount = paginated ? visibleSlots : totalCards;
    const centerSlot = slotCount >> 1;
    const entering = firstEntrance.current;

    elements.forEach((element, cardIndex) => {
      const slot = visibleMap.get(cardIndex);
      const wasVisible = previousVisible.current.has(cardIndex);

      if (slot === undefined) {
        gsap.to(element, {
          x: direction.current === "right" ? "-40rem" : "40rem",
          opacity: 0,
          scale: 0.45,
          duration: 0.42,
          ease: "power2.in",
          overwrite: "auto",
          zIndex: 0,
        });
        return;
      }

      const base = getSlotConfig(slotCount, slot);
      let x = base.x * multiplier;
      let y = base.y * heightMultiplier;
      let rotation = base.rot;
      let scale = base.scale;

      if (hoveredSlot !== null) {
        const distance = Math.abs(slot - hoveredSlot);
        if (slot === hoveredSlot) {
          y -= 1.4 * heightMultiplier;
          scale *= 1.045;
        } else {
          const normalized =
            centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0;
          const push =
            8 *
            (1 - Math.abs(normalized)) *
            (1 + 0.2 * Math.max(0, 3 - distance));
          x += (slot < hoveredSlot ? -push : push) * multiplier;
          rotation += (slot < hoveredSlot ? -3 : 3) / (distance + 1);
        }
      }

      if (entering) {
        gsap.set(element, {
          x: 0,
          y: `${12 * heightMultiplier}rem`,
          rotation: 0,
          scale: 0.5,
          opacity: 0,
        });
      } else if (!wasVisible) {
        gsap.set(element, {
          x: direction.current === "right" ? "40rem" : "-40rem",
          y: `${y}rem`,
          rotation: direction.current === "right" ? 30 : -30,
          scale: 0.5,
          opacity: 0,
        });
      }

      gsap.to(element, {
        x: `${x}rem`,
        y: `${y}rem`,
        rotation,
        scale,
        opacity: 1,
        zIndex: base.zIndex,
        duration: entering ? 1.05 : hoveredSlot !== null ? 0.44 : 0.68,
        delay: entering ? 0.08 + slot * 0.055 : Math.abs(slot - centerSlot) * 0.018,
        ease:
          entering || hoveredSlot !== null ? "power4.out" : "power3.inOut",
        overwrite: "auto",
      });
    });

    previousVisible.current = new Set(visibleMap.keys());
    firstEntrance.current = false;
    const unlock = gsap.delayedCall(entering ? 1.45 : 0.82, () => {
      animating.current = false;
    });

    return () => {
      unlock.kill();
      gsap.killTweensOf(elements);
    };
  }, [hoveredSlot, inView, layoutVersion, paginated, totalCards, visibleMap, visibleSlots]);

  useEffect(() => {
    const onResize = () => {
      setVisibleSlots(window.innerWidth < 640 ? MOBILE_VISIBLE : MAX_VISIBLE);
      setHoveredSlot(null);
      setLayoutVersion((version) => version + 1);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const focusCard = useCallback(
    (index: number) => {
      if (!paginated || animating.current || index === centerIndex) return;
      const forward = (index - centerIndex + totalCards) % totalCards;
      const backward = (centerIndex - index + totalCards) % totalCards;
      animating.current = true;
      direction.current = forward <= backward ? "right" : "left";
      setHoveredSlot(null);
      setCenterIndex(index);
    },
    [centerIndex, paginated, totalCards]
  );

  if (!totalCards) return null;

  return (
    <div className="relative z-20 flex w-full flex-col items-center">
      <div className="flex w-full items-center justify-center">
        <div
          ref={containerRef}
          className="fan-layout relative flex w-full max-w-none items-center justify-center"
          onMouseLeave={() => setHoveredSlot(null)}
        >
          {cards.map((card, index) => {
            const slot = visibleMap.get(index);
            const image = (
              <div className="relative size-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.imgUrl}
                  loading="lazy"
                  alt={card.alt || `Tarjeta ${index + 1}`}
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
            );

            const sharedProps = {
              className: "fan-card",
              onMouseEnter: () => {
                if (!animating.current && slot !== undefined) {
                  setHoveredSlot(slot);
                }
              },
              onFocus: () => {
                if (!animating.current && slot !== undefined) {
                  setHoveredSlot(slot);
                }
              },
            };

            return card.linkUrl ? (
              <a
                {...sharedProps}
                key={card.imgUrl}
                href={card.linkUrl}
                target={card.linkUrl.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                tabIndex={slot === undefined ? -1 : 0}
                aria-hidden={slot === undefined}
              >
                {image}
              </a>
            ) : (
              <button
                {...sharedProps}
                key={card.imgUrl}
                type="button"
                tabIndex={slot === undefined ? -1 : 0}
                aria-hidden={slot === undefined}
                aria-label={`Centrar ${card.alt || `tarjeta ${index + 1}`}`}
                aria-current={index === centerIndex ? "true" : undefined}
                onClick={() => focusCard(index)}
              >
                {image}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
