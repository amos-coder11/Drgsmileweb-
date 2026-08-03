"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { LiquidMetal } from "@/components/ui/liquid-metal";
import { LOGO_G_PATH, LOGO_G_TRANSFORM, LOGO_VIEWBOX } from "@/lib/logo-g-path";

interface DrGsmileLogoSvgProps {
  className?: string;
}

function LiquidMetalOverlay({ maskUrl }: { maskUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const { width, height } = container.getBoundingClientRect();
      setSize({ width: Math.round(width), height: Math.round(height) });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0">
      {size.width > 0 && size.height > 0 && (
        <LiquidMetal
          width={size.width}
          height={size.height}
          maskUrl={maskUrl}
          speed={0.6}
          className="h-full w-full"
        />
      )}
    </div>
  );
}

export function DrGsmileLogoSvg({ className = "" }: DrGsmileLogoSvgProps) {
  const gMask = useMemo(() => {
    const { x, y, width, height } = LOGO_VIEWBOX;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${width} ${height}"><path d="${LOGO_G_PATH}" fill="white" transform="${LOGO_G_TRANSFORM}"/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, []);

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/Logo-base.svg"
        alt="Dr Gsmile Odontología"
        className="block h-10 w-auto sm:h-12 md:h-[4.5rem]"
        draggable={false}
      />
      <LiquidMetalOverlay maskUrl={gMask} />
    </div>
  );
}
