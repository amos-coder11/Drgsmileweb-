"use client";

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { useEffect, useRef } from "react";
import type React from "react";

interface LiquidMetalProps {
  width: number;
  height: number;
  maskUrl: string;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function LiquidMetal({
  width,
  height,
  maskUrl,
  speed = 0.6,
  className,
  style,
}: LiquidMetalProps) {
  const shaderRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shaderMount = useRef<any>(null);

  useEffect(() => {
    const styleId = "liquid-metal-canvas-style";
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement("style");
      styleEl.id = styleId;
      styleEl.textContent = `
        .liquid-metal-shader canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
        }
      `;
      document.head.appendChild(styleEl);
    }

    if (shaderRef.current) {
      shaderMount.current?.destroy?.();

      shaderMount.current = new ShaderMount(
        shaderRef.current,
        liquidMetalFragmentShader,
        {
          u_repetition: 4,
          u_softness: 0.5,
          u_shiftRed: 0.3,
          u_shiftBlue: 0.3,
          u_distortion: 0,
          u_contour: 0,
          u_angle: 45,
          u_scale: 8,
          u_shape: 1,
          u_offsetX: 0.1,
          u_offsetY: -0.1,
        },
        undefined,
        speed
      );
    }

    return () => {
      shaderMount.current?.destroy?.();
      shaderMount.current = null;
    };
  }, [speed]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: `${width}px`,
        height: `${height}px`,
        display: "inline-block",
        WebkitMaskImage: `url("${maskUrl}")`,
        maskImage: `url("${maskUrl}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "100% 100%",
        maskSize: "100% 100%",
        ...style,
      }}
    >
      <div
        ref={shaderRef}
        className="liquid-metal-shader"
        style={{ position: "absolute", inset: 0, overflow: "hidden" }}
      />
    </div>
  );
}
