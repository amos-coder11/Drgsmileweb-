"use client";

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import type React from "react";
import { useEffect, useRef, useState } from "react";

type FrameVariant = "light" | "dark";

interface LiquidGlassFrameProps {
  children: React.ReactNode;
  className?: string;
  variant?: FrameVariant;
  borderRadius?: number;
  borderWidth?: number;
}

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
    @keyframes ripple-animation {
      0% { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
      100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

export function LiquidGlassFrame({
  children,
  className = "",
  variant = "light",
  borderRadius = 20,
  borderWidth = 5,
}: LiquidGlassFrameProps) {
  const [isHovered, setIsHovered] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const shaderRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shaderMount = useRef<any>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const isLight = variant === "light";
  const innerBg = isLight ? "#ffffff" : "#0a0a0a";
  const innerRadius = Math.max(borderRadius - borderWidth, 4);
  const shaderSpeed = isLight ? 0.6 : 0.5;
  const hoverSpeed = isLight ? 1.1 : 0.9;

  const outerShadow = isHovered
    ? "0 0 0 1px rgba(0,0,0,0.3), 0 10px 28px rgba(0,0,0,0.14)"
    : "0 0 0 1px rgba(0,0,0,0.22), 0 6px 20px rgba(0,0,0,0.1)";

  useEffect(() => {
    ensureShaderStyles();
  }, []);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const updateSize = () => {
      const { width, height } = frame.getBoundingClientRect();
      setSize({ width: Math.round(width), height: Math.round(height) });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(frame);
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
        shaderSpeed
      );
    } catch (error) {
      console.error("Failed to load shader:", error);
    }

    return () => {
      shaderMount.current?.destroy?.();
      shaderMount.current = null;
    };
  }, [size.width, size.height, shaderSpeed]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    shaderMount.current?.setSpeed?.(hoverSpeed);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    shaderMount.current?.setSpeed?.(shaderSpeed);
  };

  return (
    <div
      ref={frameRef}
      className={`relative inline-block ${className}`}
      style={{
        borderRadius: `${borderRadius}px`,
        padding: `${borderWidth}px`,
        boxShadow: outerShadow,
        transition: "box-shadow 0.25s ease",
        background: "linear-gradient(135deg, #2a2a2a 0%, #0a0a0a 50%, #1f1f1f 100%)",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Shader fills the entire outer frame — visible in the padding ring */}
      <div
        ref={shaderRef}
        className="shader-container-exploded pointer-events-none absolute inset-0 overflow-hidden"
        style={{ borderRadius: `${borderRadius}px` }}
      />

      {/* Inner panel covers center, exposing shader in padding area on all sides */}
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: `${innerRadius}px`,
          background: innerBg,
        }}
      >
        {children}
      </div>
    </div>
  );
}
