"use client";

import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import CalendarIcon from "@iconify-react/at-icons/calendar";
import { Menu } from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type ButtonVariant = "agenda" | "menu";

interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  ariaLabel?: string;
  alignWithLogo?: boolean;
  inverted?: boolean;
}

function useLogoAlignedHeight(enabled: boolean) {
  const [sizes, setSizes] = useState({ height: enabled ? 42 : 42, compact: false });

  useEffect(() => {
    if (!enabled) {
      setSizes({ height: 42, compact: false });
      return;
    }

    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) {
        setSizes({ height: 72, compact: false });
      } else if (w >= 480) {
        setSizes({ height: 50, compact: true });
      } else {
        setSizes({ height: 40, compact: true });
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [enabled]);

  return sizes;
}

export function LiquidMetalButton({
  label = "AGENDA",
  onClick,
  variant = "agenda",
  ariaLabel,
  alignWithLogo = false,
  inverted = false,
}: LiquidMetalButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shaderMount = useRef<any>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);

  const isAgenda = variant === "agenda";
  const { height: buttonHeight, compact } = useLogoAlignedHeight(alignWithLogo);
  const scale = buttonHeight / 42;

  const dimensions = useMemo(() => {
    const inset = 4;
    if (isAgenda) {
      const baseWidth = compact ? 104 : 132;
      const width = Math.round(baseWidth * scale);
      return {
        width,
        height: buttonHeight,
        innerWidth: width - inset,
        innerHeight: buttonHeight - inset,
        shaderWidth: width,
        shaderHeight: buttonHeight,
      };
    }
    return {
      width: buttonHeight,
      height: buttonHeight,
      innerWidth: buttonHeight - inset,
      innerHeight: buttonHeight - inset,
      shaderWidth: buttonHeight,
      shaderHeight: buttonHeight,
    };
  }, [isAgenda, buttonHeight, scale, compact]);

  const styles = useMemo(() => {
    if (isAgenda) {
      if (inverted) {
        return {
          innerBg: "linear-gradient(180deg, #ffffff 0%, #f3f3f3 100%)",
          textColor: "#11120f",
          borderRadius: "8px",
          shaderRadius: "8px",
          shaderSpeed: 0.5,
          hoverSpeed: 0.9,
          clickSpeed: 2,
          outerShadow:
            "0px 0px 0px 1px rgba(255, 255, 255, 0.28), 0px 4px 10px rgba(0, 0, 0, 0.28)",
          hoverShadow:
            "0px 0px 0px 1px rgba(255, 255, 255, 0.42), 0px 8px 16px rgba(0, 0, 0, 0.32)",
          shaderOpacity: 0.9,
          rippleBg:
            "radial-gradient(circle, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 70%)",
        };
      }
      return {
        innerBg: "linear-gradient(180deg, #1b1d18 0%, #11120f 100%)",
        textColor: "#ffffff",
        borderRadius: "8px",
        shaderRadius: "8px",
        shaderSpeed: 0.5,
        hoverSpeed: 0.9,
        clickSpeed: 2,
        outerShadow:
          "0px 0px 0px 1px rgba(17, 18, 15, 0.3), 0px 4px 8px rgba(17, 18, 15, 0.14)",
        hoverShadow:
          "0px 0px 0px 1px rgba(17, 18, 15, 0.42), 0px 8px 14px rgba(17, 18, 15, 0.2)",
        shaderOpacity: 0.9,
        rippleBg:
          "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%)",
      };
    }
    if (inverted) {
      return {
        innerBg: "linear-gradient(180deg, #ffffff 0%, #f3f3f3 100%)",
        textColor: "#1B3022",
        borderRadius: "8px",
        shaderRadius: "8px",
        shaderSpeed: 0.4,
        hoverSpeed: 0.8,
        clickSpeed: 1.8,
        outerShadow: "0px 0px 0px 1px rgba(255, 255, 255, 0.28), 0px 4px 10px rgba(0, 0, 0, 0.28)",
        hoverShadow:
          "0px 0px 0px 1px rgba(255, 255, 255, 0.42), 0px 4px 12px rgba(0, 0, 0, 0.32)",
        shaderOpacity: 0.55,
        rippleBg:
          "radial-gradient(circle, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0) 70%)",
      };
    }
    return {
      innerBg: "linear-gradient(180deg, #ffffff 0%, #f8f8f8 100%)",
      textColor: "#1B3022",
      borderRadius: "8px",
      shaderRadius: "8px",
      shaderSpeed: 0.4,
      hoverSpeed: 0.8,
      clickSpeed: 1.8,
      outerShadow: "0px 0px 0px 1px rgba(27, 48, 34, 0.2)",
      hoverShadow: "0px 0px 0px 1px rgba(27, 48, 34, 0.3), 0px 4px 10px rgba(0, 0, 0, 0.06)",
      shaderOpacity: 0.55,
      rippleBg:
        "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%)",
    };
  }, [isAgenda, inverted]);

  useEffect(() => {
    const styleId = "shader-canvas-style-exploded";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .shader-container-exploded canvas {
          width: 100% !important;
          height: 100% !important;
          display: block !important;
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 8px !important;
        }
        @keyframes ripple-animation {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    const loadShader = async () => {
      try {
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
            styles.shaderSpeed
          );
        }
      } catch (error) {
        console.error("Failed to load shader:", error);
      }
    };

    loadShader();

    return () => {
      shaderMount.current?.destroy?.();
      shaderMount.current = null;
    };
  }, [isAgenda, inverted, styles.shaderSpeed]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    shaderMount.current?.setSpeed?.(styles.hoverSpeed);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsPressed(false);
    shaderMount.current?.setSpeed?.(styles.shaderSpeed);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    shaderMount.current?.setSpeed?.(styles.clickSpeed);
    setTimeout(() => {
      shaderMount.current?.setSpeed?.(isHovered ? styles.hoverSpeed : styles.shaderSpeed);
    }, 300);

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = { x, y, id: rippleId.current++ };
      setRipples((prev) => [...prev, ripple]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
      }, 600);
    }

    onClick?.();
  };

  return (
    <div className="relative inline-block">
      <div style={{ perspective: "1000px", perspectiveOrigin: "50% 50%" }}>
        <div
          style={{
            position: "relative",
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            transformStyle: "preserve-3d",
            transition: "all 0.4s ease",
          }}
        >
          {/* Label / icon layer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: isAgenda ? `${Math.round(8 * scale)}px` : 0,
              transform: "translateZ(20px)",
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            {isAgenda ? (
              <>
                <span
                  style={{
                    display: "inline-flex",
                    color: styles.textColor,
                    fontSize: `${Math.round(14 * scale)}px`,
                  }}
                >
                  <CalendarIcon height="1em" />
                </span>
                <span
                  style={{
                    fontSize: `${Math.round((compact ? 9 : 11) * scale)}px`,
                    color: styles.textColor,
                    fontWeight: 700,
                    letterSpacing: compact ? "0.12em" : "0.18em",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </span>
              </>
            ) : (
              <Menu size={Math.round(18 * scale)} strokeWidth={1.8} color={styles.textColor} />
            )}
          </div>

          {/* Inner fill */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateZ(10px) ${isPressed ? "translateY(1px) scale(0.98)" : ""}`,
              zIndex: 20,
            }}
          >
            <div
              style={{
                width: `${dimensions.innerWidth}px`,
                height: `${dimensions.innerHeight}px`,
                margin: "2px",
                borderRadius: styles.borderRadius,
                background: styles.innerBg,
                boxShadow: isPressed ? "inset 0 1px 3px rgba(0,0,0,0.25)" : "none",
                transition: "background 0.35s ease, box-shadow 0.15s ease",
              }}
            />
          </div>

          {/* Shader layer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateZ(0px) ${isPressed ? "translateY(1px) scale(0.98)" : ""}`,
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                borderRadius: styles.borderRadius,
                boxShadow: isHovered ? styles.hoverShadow : styles.outerShadow,
                transition: "box-shadow 0.2s ease",
                background: "transparent",
                opacity: styles.shaderOpacity,
              }}
            >
              <div
                ref={shaderRef}
                className="shader-container-exploded"
                style={{
                  borderRadius: styles.shaderRadius,
                  overflow: "hidden",
                  position: "relative",
                  width: `${dimensions.shaderWidth}px`,
                  height: `${dimensions.shaderHeight}px`,
                }}
              />
            </div>
          </div>

          <button
            ref={buttonRef}
            type="button"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              outline: "none",
              zIndex: 40,
              borderRadius: styles.borderRadius,
              overflow: "hidden",
            }}
            aria-label={ariaLabel ?? label}
          >
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                style={{
                  position: "absolute",
                  left: `${ripple.x}px`,
                  top: `${ripple.y}px`,
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: styles.rippleBg,
                  pointerEvents: "none",
                  animation: "ripple-animation 0.6s ease-out",
                }}
              />
            ))}
          </button>
        </div>
      </div>
    </div>
  );
}
