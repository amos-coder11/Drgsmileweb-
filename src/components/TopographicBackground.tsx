"use client";

import { useEffect, useRef } from "react";

function makeNoise(seed: number) {
  const hash = (x: number, y: number, z: number) => {
    let h = x * 374761393 + y * 668265263 + z * 2147483647 + seed * 362437;
    h = (h ^ (h >> 13)) * 1274126177;
    h = h ^ (h >> 16);
    return (h >>> 0) / 4294967295;
  };

  const smooth = (t: number) => t * t * (3 - 2 * t);

  const valueNoise = (x: number, y: number, z: number) => {
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const z0 = Math.floor(z);
    const fx = smooth(x - x0);
    const fy = smooth(y - y0);
    const fz = smooth(z - z0);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const c000 = hash(x0, y0, z0);
    const c100 = hash(x0 + 1, y0, z0);
    const c010 = hash(x0, y0 + 1, z0);
    const c110 = hash(x0 + 1, y0 + 1, z0);
    const c001 = hash(x0, y0, z0 + 1);
    const c101 = hash(x0 + 1, y0, z0 + 1);
    const c011 = hash(x0, y0 + 1, z0 + 1);
    const c111 = hash(x0 + 1, y0 + 1, z0 + 1);

    const x00 = lerp(c000, c100, fx);
    const x10 = lerp(c010, c110, fx);
    const x01 = lerp(c001, c101, fx);
    const x11 = lerp(c011, c111, fx);

    const y0i = lerp(x00, x10, fy);
    const y1i = lerp(x01, x11, fy);

    return lerp(y0i, y1i, fz);
  };

  return (x: number, y: number, z: number) => {
    let value = 0;
    let amp = 0.6;
    let freq = 1;
    for (let o = 0; o < 4; o++) {
      value += valueNoise(x * freq, y * freq, z * freq) * amp;
      amp *= 0.5;
      freq *= 2;
    }
    return value;
  };
}

export function TopographicBackground({
  lineColor = "#454540",
  className = "",
  pauseOnLightSurface = false,
}: {
  lineColor?: string;
  className?: string;
  /** Pausa el dibujado cuando el hero claro cubre el viewport (fondos negros fijos) */
  pauseOnLightSurface?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const noise = makeNoise(12345);
    const isCoarse = window.matchMedia("(max-width: 768px)").matches;
    const cell = isCoarse ? 8 : 7;
    const nScale = 0.007;
    const levels = isCoarse ? 9 : 10;
    const speed = 0.06;

    let cols = 0;
    let rows = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let field: Float32Array | null = null;
    let visible = true;
    let tabVisible = !document.hidden;
    let coveredByLight = false;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, isCoarse ? 1.25 : 1.5);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      cols = Math.ceil(w / cell) + 1;
      rows = Math.ceil(h / cell) + 1;
      field = new Float32Array(cols * rows);
    };

    let resizeRaf = 0;
    const scheduleResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
    };

    const checkLightCover = () => {
      if (!pauseOnLightSurface) {
        coveredByLight = false;
        return;
      }
      const sampleY = Math.min(window.innerHeight * 0.45, 320);
      const hit = document.elementFromPoint(window.innerWidth * 0.5, sampleY);
      coveredByLight = Boolean(hit?.closest("[data-light-surface]"));
    };

    const shouldAnimate = () =>
      !reduceMotion && visible && tabVisible && !coveredByLight;

    const render = (t: number) => {
      raf = 0;
      checkLightCover();

      if (!shouldAnimate()) return;

      const z = t * 0.001 * speed;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (!field || field.length !== cols * rows) {
        field = new Float32Array(cols * rows);
      }

      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          field[j * cols + i] = noise(i * nScale, j * nScale, z);
        }
      }

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      for (let l = 1; l < levels; l++) {
        const threshold = l / levels;

        ctx.beginPath();
        for (let j = 0; j < rows - 1; j++) {
          for (let i = 0; i < cols - 1; i++) {
            const tl = field[j * cols + i];
            const tr = field[j * cols + i + 1];
            const br = field[(j + 1) * cols + i + 1];
            const bl = field[(j + 1) * cols + i];

            let idx = 0;
            if (tl > threshold) idx |= 8;
            if (tr > threshold) idx |= 4;
            if (br > threshold) idx |= 2;
            if (bl > threshold) idx |= 1;
            if (idx === 0 || idx === 15) continue;

            const x = i * cell;
            const y = j * cell;

            const lerp = (a: number, b: number) => (threshold - a) / (b - a);

            const top = { x: x + cell * lerp(tl, tr), y };
            const right = { x: x + cell, y: y + cell * lerp(tr, br) };
            const bottom = { x: x + cell * lerp(bl, br), y: y + cell };
            const left = { x, y: y + cell * lerp(tl, bl) };

            const seg = (a: { x: number; y: number }, b: { x: number; y: number }) => {
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
            };

            switch (idx) {
              case 1:
              case 14:
                seg(left, bottom);
                break;
              case 2:
              case 13:
                seg(bottom, right);
                break;
              case 3:
              case 12:
                seg(left, right);
                break;
              case 4:
              case 11:
                seg(top, right);
                break;
              case 5:
                seg(left, top);
                seg(bottom, right);
                break;
              case 6:
              case 9:
                seg(top, bottom);
                break;
              case 7:
              case 8:
                seg(left, top);
                break;
              case 10:
                seg(left, bottom);
                seg(top, right);
                break;
            }
          }
        }
        ctx.stroke();
      }

      raf = requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (raf !== 0) return;
      checkLightCover();
      if (shouldAnimate()) raf = requestAnimationFrame(render);
    };

    const onScroll = () => {
      if (pauseOnLightSurface) startLoop();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) startLoop();
        else cancelAnimationFrame(raf);
      },
      { root: null, threshold: 0, rootMargin: "120px 0px" }
    );

    const onVisibility = () => {
      tabVisible = !document.hidden;
      if (tabVisible) startLoop();
      else cancelAnimationFrame(raf);
    };

    resize();
    startLoop();

    io.observe(canvas);
    document.addEventListener("visibilitychange", onVisibility);
    if (pauseOnLightSurface) {
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    const ro = new ResizeObserver(scheduleResize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (pauseOnLightSurface) {
        window.removeEventListener("scroll", onScroll);
      }
    };
  }, [lineColor, pauseOnLightSurface]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block h-full w-full ${className}`}
    />
  );
}
