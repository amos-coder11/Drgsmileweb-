"use client";

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type LiquidGlassDividerProps = {
  className?: string;
  /** Grosor de la línea (px) */
  thickness?: number;
  orientation?: "horizontal" | "vertical";
};

const SHADER_STYLE_ID = "shader-canvas-style-exploded";

function ensureShaderStyles() {
  if (document.getElementById(SHADER_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = SHADER_STYLE_ID;
  style.textContent = `
    .shader-container-exploded canvas {
      width: 100% !important;
      height: 100% !important;
      display: block !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      border-radius: inherit !important;
    }
  `;
  document.head.appendChild(style);
}

export function LiquidGlassDivider({
  className,
  thickness = 5,
  orientation = "horizontal",
}: LiquidGlassDividerProps) {
  const lineRef = useRef<HTMLDivElement>(null);
  const shaderRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shaderMount = useRef<any>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const isVertical = orientation === "vertical";

  useEffect(() => {
    ensureShaderStyles();
  }, []);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const updateSize = () => {
      const { width, height } = line.getBoundingClientRect();
      setSize({ width: Math.round(width), height: Math.round(height) });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(line);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shaderRef.current || size.width === 0 || size.height === 0) return;

    try {
      shaderMount.current?.destroy?.();

      shaderMount.current = new ShaderMount(
        shaderRef.current,
        liquidMetalFragmentShader,
        {
          u_repetition: 4,
          u_softness: 0.4,
          u_shiftRed: 0.3,
          u_shiftBlue: 0.3,
          u_distortion: 0,
          u_contour: 0,
          u_angle: 45,
          u_scale: 6,
          u_shape: 1,
          u_offsetX: 0.1,
          u_offsetY: -0.1,
        },
        undefined,
        0.6
      );
    } catch (error) {
      console.error("Failed to load divider shader:", error);
    }

    return () => {
      shaderMount.current?.destroy?.();
      shaderMount.current = null;
    };
  }, [size.width, size.height]);

  return (
    <div
      ref={lineRef}
      aria-hidden
      className={cn(
        "relative shrink-0 overflow-hidden",
        isVertical ? "self-stretch" : "w-full",
        className
      )}
      style={{
        width: isVertical ? thickness : "100%",
        height: isVertical ? "auto" : thickness,
        background: "linear-gradient(135deg, #252720 0%, #11120f 50%, #1b1d18 100%)",
      }}
    >
      <div ref={shaderRef} className="shader-container-exploded pointer-events-none absolute inset-0" />
    </div>
  );
}
