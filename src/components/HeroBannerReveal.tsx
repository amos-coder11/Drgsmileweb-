"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";

type Drop = {
  id: number;
  nx: number;
  ny: number;
  r: number;
  vx: number;
  vy: number;
  born: number;
  life: number;
};

type Point = { nx: number; ny: number };

const W = 900;
const H = 1200;

const BANNER_1 = "/images/banner-eleven-1.png";
const BANNER_2 = "/images/banner-eleven-2.png";

const POINTER_LERP = 0.22;
const SPAWN_INTERVAL = 40;
const MAX_DROPS = 36;

const sharedImageClass =
  "block h-full w-auto max-w-full object-contain object-bottom max-md:object-[center_top]";

const wrapperClass =
  "relative h-full w-fit max-w-full translate-y-[2%] max-md:origin-top max-md:scale-[1.08] max-md:translate-y-0";

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export function HeroBannerReveal() {
  const uid = useId().replace(/:/g, "");
  const filterId = `goo-mask-${uid}`;
  const maskId = `reveal-${uid}`;

  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [pointer, setPointer] = useState<Point>({ nx: 0.5, ny: 0.5 });
  const [drops, setDrops] = useState<Drop[]>([]);
  const [now, setNow] = useState(0);

  const targetPointerRef = useRef<Point>({ nx: 0.5, ny: 0.5 });
  const smoothPointerRef = useRef<Point>({ nx: 0.5, ny: 0.5 });
  const dropsRef = useRef<Drop[]>([]);
  const idRef = useRef(0);
  const lastSpawn = useRef(0);
  const hoveringRef = useRef(false);

  const toLocal = useCallback((clientX: number, clientY: number): Point => {
    const el = wrapRef.current;
    if (!el) return { nx: 0.5, ny: 0.5 };
    const rect = el.getBoundingClientRect();
    return {
      nx: (clientX - rect.left) / rect.width,
      ny: (clientY - rect.top) / rect.height,
    };
  }, []);

  useEffect(() => {
    let rafRef: number | null = null;

    const tick = (t: number) => {
      const target = targetPointerRef.current;
      const smooth = smoothPointerRef.current;
      smooth.nx += (target.nx - smooth.nx) * POINTER_LERP;
      smooth.ny += (target.ny - smooth.ny) * POINTER_LERP;

      if (hoveringRef.current && t - lastSpawn.current > SPAWN_INTERVAL) {
        lastSpawn.current = t;
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.0018 + Math.random() * 0.005;
        idRef.current += 1;
        dropsRef.current = [
          ...dropsRef.current.slice(-MAX_DROPS),
          {
            id: idRef.current,
            nx: smooth.nx + (Math.random() - 0.5) * 0.06,
            ny: smooth.ny + (Math.random() - 0.5) * 0.06,
            r: 0.045 + Math.random() * 0.075,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed + 0.008,
            born: t,
            life: 1100 + Math.random() * 900,
          },
        ];
      }

      dropsRef.current = dropsRef.current
        .map((d) => ({
          ...d,
          nx: d.nx + d.vx,
          ny: d.ny + d.vy,
          vx: d.vx * 0.985,
          vy: d.vy * 0.985 + 0.0011,
        }))
        .filter((d) => t - d.born < d.life);

      const active =
        hoveringRef.current || dropsRef.current.length > 0;

      if (active) {
        setPointer({ nx: smooth.nx, ny: smooth.ny });
        setDrops([...dropsRef.current]);
        setNow(t);
        rafRef = requestAnimationFrame(tick);
      } else {
        rafRef = null;
      }
    };

    const startLoop = () => {
      if (rafRef === null) rafRef = requestAnimationFrame(tick);
    };

    const onEnter = (e: PointerEvent) => {
      const p = toLocal(e.clientX, e.clientY);
      targetPointerRef.current = p;
      smoothPointerRef.current = { ...p };
      hoveringRef.current = true;
      setHovering(true);
      startLoop();
    };

    const onLeave = () => {
      hoveringRef.current = false;
      setHovering(false);
      dropsRef.current = [];
      setDrops([]);
    };

    const onMove = (e: PointerEvent) => {
      targetPointerRef.current = toLocal(e.clientX, e.clientY);
      startLoop();
    };

    const el = wrapRef.current;
    if (el) {
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
      el.addEventListener("pointermove", onMove);
    }

    return () => {
      if (rafRef !== null) cancelAnimationFrame(rafRef);
      if (el) {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
        el.removeEventListener("pointermove", onMove);
      }
    };
  }, [toLocal]);

  return (
    <div className="relative inline-flex h-full w-auto max-w-full justify-center max-md:mx-auto">
      <Image
        src={BANNER_1}
        alt="Drgsmile"
        width={W}
        height={H}
        className={`relative z-10 md:hidden ${sharedImageClass} translate-y-[2%] max-md:translate-y-0 max-md:scale-[1.08]`}
        priority
        sizes="(max-width: 1100px) 95vw, 1100px"
      />

      <div
        ref={wrapRef}
        className={`${wrapperClass} hidden select-none touch-none md:block md:cursor-crosshair`}
        aria-label="Pasa el cursor para descubrir la imagen"
      >
        <Image
          src={BANNER_1}
          alt="Drgsmile"
          width={W}
          height={H}
          className={`relative z-10 ${sharedImageClass}`}
          priority
          sizes="(max-width: 1100px) 95vw, 1100px"
        />

        <svg width="0" height="0" className="absolute" aria-hidden>
          <defs>
            <filter id={filterId}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="0.055" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -11"
              />
            </filter>

            <mask
              id={maskId}
              maskUnits="objectBoundingBox"
              maskContentUnits="objectBoundingBox"
            >
              <g filter={`url(#${filterId})`}>
                {hovering && (
                  <circle cx={pointer.nx} cy={pointer.ny} r={0.155} fill="#fff" />
                )}
                {drops.map((d) => {
                  const age = Math.min(1, (now - d.born) / d.life);
                  const scale = easeOutCubic(1 - age);
                  return (
                    <circle
                      key={d.id}
                      cx={d.nx}
                      cy={d.ny}
                      r={Math.max(0, d.r * scale)}
                      fill="#fff"
                    />
                  );
                })}
              </g>
            </mask>
          </defs>
        </svg>

        <div
          className="absolute inset-0 z-20 overflow-hidden"
          style={{
            WebkitMaskImage: `url(#${maskId})`,
            maskImage: `url(#${maskId})`,
          }}
        >
          <Image
            src={BANNER_2}
            alt=""
            width={W}
            height={H}
            aria-hidden
            className={sharedImageClass}
            sizes="(max-width: 1100px) 95vw, 1100px"
          />
        </div>
      </div>
    </div>
  );
}
