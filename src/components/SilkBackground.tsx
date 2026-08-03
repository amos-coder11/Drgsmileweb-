"use client";

import { useEffect, useRef } from "react";
import { InspiraShaderToy } from "@/lib/inspira/InspiraShaderToy";
import { SILK_SHADER } from "@/lib/inspira/silk-shader";

export interface SilkBackgroundProps {
  className?: string;
  hue?: number;
  saturation?: number;
  brightness?: number;
  speed?: number;
  mouseSensitivity?: number;
  damping?: number;
}

export function SilkBackground({
  className = "",
  hue = 0,
  saturation = 0.06,
  brightness = 0.38,
  speed = 0.6,
  mouseSensitivity = 0.8,
  damping = 0.92,
}: SilkBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let shader: InspiraShaderToy | undefined;

    try {
      shader = new InspiraShaderToy(container, "hover", 60, Math.min(window.devicePixelRatio, 1.5));
      shader.setHSV({ hue, saturation, brightness });
      shader.setSpeed(speed);
      shader.setMouseSensitivity(mouseSensitivity);
      shader.setMouseDamping(damping);
      shader.setShader({ source: SILK_SHADER });
      shader.play();
    } catch (error) {
      console.error("SilkBackground init failed:", error);
    }

    return () => {
      shader?.dispose();
    };
  }, [hue, saturation, brightness, speed, mouseSensitivity, damping]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden [&>canvas]:block [&>canvas]:h-full [&>canvas]:w-full ${className}`}
      aria-hidden="true"
    />
  );
}
