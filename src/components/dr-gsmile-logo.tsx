"use client";

import { useEffect, useMemo, useState } from "react";
import { LiquidMetal } from "@/components/ui/liquid-metal";

const FONT_FAMILY = "var(--font-serif), Cormorant Garamond, Georgia, serif";
const FONT_WEIGHT = 700;

interface DrGsmileLogoProps {
  fontSize?: number;
  showSubtitle?: boolean;
}

function measureWidth(text: string, fontSize: number) {
  if (typeof document === "undefined") return fontSize;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return fontSize;
  ctx.font = `${FONT_WEIGHT} ${fontSize}px Cormorant Garamond, Georgia, serif`;
  return ctx.measureText(text).width;
}

export function DrGsmileLogo({ fontSize = 36, showSubtitle = true }: DrGsmileLogoProps) {
  const [gWidth, setGWidth] = useState(fontSize * 0.75);

  useEffect(() => {
    setGWidth(measureWidth("G", fontSize));
  }, [fontSize]);

  const boxHeight = fontSize;
  const baseline = fontSize * 0.82;

  const gMask = useMemo(() => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${gWidth}" height="${boxHeight}" viewBox="0 0 ${gWidth} ${boxHeight}"><text x="0" y="${baseline}" font-family="Cormorant Garamond, Georgia, serif" font-weight="${FONT_WEIGHT}" font-size="${fontSize}" fill="white">G</text></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [gWidth, boxHeight, baseline, fontSize]);

  const swooshWidth = fontSize * 2.45;
  const swooshHeight = fontSize * 0.55;
  const swooshMask = useMemo(() => {
    const w = swooshWidth;
    const h = swooshHeight;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="M ${w * 0.02} ${h * 0.62} C ${w * 0.28} ${h * 0.02}, ${w * 0.62} ${h * 0.05}, ${w * 0.98} ${h * 0.34} C ${w * 0.64} ${h * 0.24}, ${w * 0.3} ${h * 0.22}, ${w * 0.06} ${h * 0.9} Z" fill="white"/></svg>`;
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [swooshWidth, swooshHeight]);

  return (
    <div className="inline-block">
      <div
        style={{
          display: "inline-flex",
          alignItems: "flex-end",
          fontFamily: FONT_FAMILY,
          fontWeight: FONT_WEIGHT,
          fontSize: `${fontSize}px`,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: "#1B3022",
          position: "relative",
          userSelect: "none",
        }}
      >
        <span>Dr&nbsp;</span>

        <LiquidMetal
          width={gWidth}
          height={boxHeight}
          maskUrl={gMask}
          speed={0.6}
          style={{
            verticalAlign: "baseline",
            marginBottom: `-${fontSize * 0.1}px`,
            transform: `translateY(-${fontSize * 0.07}px)`,
          }}
        />

        <span style={{ position: "relative", display: "inline-block" }}>
          smile
          <LiquidMetal
            width={swooshWidth}
            height={swooshHeight}
            maskUrl={swooshMask}
            speed={0.6}
            style={{
              position: "absolute",
              left: `-${fontSize * 0.33}px`,
              top: `-${fontSize * 0.16}px`,
              pointerEvents: "none",
            }}
          />
        </span>
      </div>

      {showSubtitle && (
        <div
          className="font-[family-name:var(--font-body)] font-medium tracking-[0.35em] text-[#1B3022]/80"
          style={{ fontSize: `${Math.max(fontSize * 0.17, 8)}px`, marginTop: `${fontSize * 0.08}px` }}
        >
          ODONTOLOGÍA
        </div>
      )}
    </div>
  );
}
