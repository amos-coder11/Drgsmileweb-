"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  DitheringShapes,
  DitheringTypes,
  ditheringFragmentShader,
  ShaderMount,
} from "@paper-design/shaders";
import { CalendarDays, MapPin } from "lucide-react";
import { useReducedMotion } from "motion/react";

const DESIGN_WIDTH = 741;
const DESIGN_HEIGHT = 302;
const STUB_START = 0.755;

function ticketPath(width: number, height: number) {
  const radius = Math.max(11, width * 0.021);
  const corner = Math.max(14, width * 0.03);
  const stubX = width * STUB_START;

  return [
    `M ${corner} 0`,
    `H ${stubX - radius}`,
    `A ${radius} ${radius} 0 0 0 ${stubX + radius} 0`,
    `H ${width - corner}`,
    `Q ${width} 0 ${width} ${corner}`,
    `V ${height - corner}`,
    `Q ${width} ${height} ${width - corner} ${height}`,
    `H ${stubX + radius}`,
    `A ${radius} ${radius} 0 0 0 ${stubX - radius} ${height}`,
    `H ${corner}`,
    `Q 0 ${height} 0 ${height - corner}`,
    `V ${corner}`,
    `Q 0 0 ${corner} 0`,
    "Z",
  ].join(" ");
}

function TicketTexture({ paused }: { paused: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    const shader = new ShaderMount(
      host,
      ditheringFragmentShader,
      {
        u_fit: 2,
        u_scale: 1.35,
        u_rotation: 12,
        u_offsetX: 0,
        u_offsetY: 0,
        u_originX: 0.5,
        u_originY: 0.5,
        u_worldWidth: 0,
        u_worldHeight: 0,
        u_colorBack: [17 / 255, 18 / 255, 15 / 255, 1],
        u_colorFront: [96 / 255, 158 / 255, 219 / 255, 1],
        u_shape: DitheringShapes.warp,
        u_type: DitheringTypes["4x4"],
        u_pxSize: 1.35,
      },
      { alpha: true, antialias: false },
      paused ? 0 : 0.2,
      0,
      1,
      1920 * 1080,
    );

    return () => shader.dispose();
  }, [paused]);

  return (
    <div
      ref={mountRef}
      className="ticket-shader absolute inset-0 z-0 [&>canvas]:!absolute [&>canvas]:!inset-0 [&>canvas]:!z-0 [&>canvas]:!h-full [&>canvas]:!w-full"
    />
  );
}

type TicketContent = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  location?: string;
  date?: string;
  stub?: string;
};

export function AdmitOneTicket({
  eyebrow = "DRGSMILE PRESENTA",
  title = "TU NUEVA SONRISA",
  subtitle = "EXPERIENCIA DIGITAL",
  location = "MIAMI · FLORIDA",
  date = "VALORACIÓN PERSONAL",
  stub = "TU CITA",
}: TicketContent) {
  const hostRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [width, setWidth] = useState(DESIGN_WIDTH);

  useLayoutEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const updateWidth = () =>
      setWidth(Math.min(DESIGN_WIDTH, Math.max(280, host.clientWidth)));
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  const height = width * (DESIGN_HEIGHT / DESIGN_WIDTH);
  const scale = width / DESIGN_WIDTH;

  const resetTilt = useCallback(() => {
    if (!cardRef.current || !glareRef.current) return;
    cardRef.current.style.transform =
      "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)";
    glareRef.current.style.opacity = "0";
  }, []);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (reducedMotion || event.pointerType === "touch") return;
      const card = cardRef.current;
      const glare = glareRef.current;
      if (!card || !glare) return;

      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * 10;
      const rotateX = (0.5 - y) * 8;

      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
      glare.style.opacity = "0.35";
      glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,.5), transparent 42%)`;
    },
    [reducedMotion],
  );

  const path = ticketPath(width, height);
  const cardStyle = {
    width,
    height,
    clipPath: `path("${path}")`,
    WebkitClipPath: `path("${path}")`,
    transition: "transform 320ms cubic-bezier(0.22, 1, 0.36, 1)",
  } satisfies CSSProperties;

  return (
    <div ref={hostRef} className="mx-auto w-full max-w-[741px]">
      <div
        ref={cardRef}
        className="relative isolate overflow-hidden bg-[#11120f] text-[#f2f0e8]"
        style={cardStyle}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
      >
        <TicketTexture paused={Boolean(reducedMotion)} />
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 opacity-0 mix-blend-screen transition-opacity duration-500"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(120deg,rgba(255,255,255,.08),transparent_34%,rgba(17,18,15,.22)_68%,rgba(255,255,255,.06))]"
        />

        <div
          className="absolute z-10 flex flex-col"
          style={{
            inset: `${28 * scale}px auto ${24 * scale}px ${34 * scale}px`,
            width: `${500 * scale}px`,
          }}
        >
          <p
            className="font-sans font-semibold uppercase"
            style={{
              fontSize: `${11 * scale}px`,
              letterSpacing: `${3.2 * scale}px`,
            }}
          >
            {eyebrow}
          </p>
          <h3
            className="mt-auto max-w-[9ch] font-sans font-black uppercase leading-[0.78] tracking-[-0.065em]"
            style={{ fontSize: `${68 * scale}px` }}
          >
            {title}
          </h3>

          <div
            className="mt-auto grid grid-cols-2 border-t border-[#f2f0e8]/55 pt-3 font-sans uppercase"
            style={{
              gap: `${14 * scale}px`,
              fontSize: `${10 * scale}px`,
              letterSpacing: `${1.35 * scale}px`,
            }}
          >
            <span className="flex items-center gap-2">
              <MapPin size={13 * scale} strokeWidth={1.8} />
              {location}
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays size={13 * scale} strokeWidth={1.8} />
              {date}
            </span>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute z-10 border-l border-dashed border-[#f2f0e8]/65"
          style={{
            left: `${DESIGN_WIDTH * STUB_START * scale}px`,
            top: `${21 * scale}px`,
            bottom: `${21 * scale}px`,
          }}
        />

        <div
          className="absolute right-0 top-0 z-10 flex h-full flex-col items-center justify-between py-7 text-center"
          style={{ width: `${DESIGN_WIDTH * (1 - STUB_START) * scale}px` }}
        >
          <span
            className="font-sans font-bold uppercase"
            style={{
              fontSize: `${10 * scale}px`,
              letterSpacing: `${2.2 * scale}px`,
            }}
          >
            {subtitle}
          </span>
          <span
            aria-hidden="true"
            className="font-serif italic leading-none text-[#f2f0e8]/20"
            style={{ fontSize: `${70 * scale}px` }}
          >
            DrG
          </span>
          <span
            className="font-sans font-black uppercase"
            style={{
              fontSize: `${22 * scale}px`,
              letterSpacing: `${1.2 * scale}px`,
            }}
          >
            {stub}
          </span>
        </div>
      </div>
    </div>
  );
}

export default AdmitOneTicket;
