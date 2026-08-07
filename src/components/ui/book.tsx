"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import {
  type ResponsiveValue,
  useResponsive,
} from "@/components/ui/use-responsive";

const DefaultIllustration = (
  <svg
    fill="none"
    height="56"
    viewBox="0 0 36 56"
    width="36"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <path
      d="M3.03 28C6.26 23.18 11.76 20 18 20s11.74 3.18 14.97 8C29.74 32.82 24.24 36 18 36S6.26 32.82 3.03 28Z"
      fill="#609edb"
    />
    <path
      d="M32.97 28A17.92 17.92 0 0 0 36 18C36 8.06 27.94 0 18 0S0 8.06 0 18c0 3.7 1.12 7.14 3.03 10C6.26 23.18 11.76 20 18 20s11.74 3.18 14.97 8Z"
      fill="#f2f2ea"
    />
    <path
      d="M32.97 28C29.74 32.82 24.24 36 18 36S6.26 32.82 3.03 28A17.92 17.92 0 0 0 0 38c0 9.94 8.06 18 18 18s18-8.06 18-18c0-3.7-1.12-7.14-3.03-10Z"
      fill="#11120f"
    />
  </svg>
);

export type BookProps = {
  title: string;
  eyebrow?: string;
  variant?: "simple" | "stripe";
  width?: number | ResponsiveValue<number>;
  color?: string;
  textColor?: string;
  illustration?: ReactNode;
  textured?: boolean;
  className?: string;
};

export function Book({
  title,
  eyebrow,
  variant = "stripe",
  width = 196,
  color,
  textColor = "#11120f",
  illustration,
  textured = false,
  className,
}: BookProps) {
  const resolvedWidth = useResponsive(width) ?? 196;
  const coverColor =
    color ?? (variant === "simple" ? "#f2f2ea" : "#609edb");
  const coverIllustration = illustration ?? DefaultIllustration;

  return (
    <article
      className={clsx("inline-block w-fit", className)}
      style={{ perspective: 1000 }}
      aria-label={title}
    >
      <div
        className="book-rotate relative aspect-[49/60] w-fit transition-[transform,filter] duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
        style={{
          minWidth: resolvedWidth,
          transformStyle: "preserve-3d",
          containerType: "inline-size",
        }}
      >
        <div
          className="shadow-book relative flex h-full translate-x-0 flex-col overflow-hidden rounded-l-md rounded-r bg-background-200 after:absolute after:inset-0 after:rounded-l-md after:rounded-r after:border after:border-gray-alpha-400 after:shadow-book-border"
          style={{ width: resolvedWidth, transform: "translateZ(0)" }}
        >
          <div
            className={clsx(
              "relative w-full overflow-hidden",
              variant === "stripe" && "flex-1"
            )}
            style={{ background: coverColor }}
          >
            {variant === "stripe" && (
              <div className="absolute inset-0 flex items-center justify-center text-[#11120f]">
                {coverIllustration}
              </div>
            )}
            <div
              className="absolute h-full w-[8.2%] mix-blend-overlay"
              style={{ background: "var(--ds-book-bind)" }}
            />
          </div>

          <div
            className={clsx(
              "relative flex-1",
              (variant === "stripe" ||
                (variant === "simple" && color === undefined)) &&
                "bg-book-gradient"
            )}
            style={{
              background:
                variant === "simple" && color !== undefined
                  ? coverColor
                  : undefined,
            }}
          >
            <div
              className="absolute h-full w-[8.2%] opacity-20"
              style={{ background: "var(--ds-book-bind)" }}
            />
            <div
              className={clsx(
                "flex h-full w-full flex-col p-[6.1%] pl-[14.3%]",
                variant === "simple" ? "gap-4" : "justify-between"
              )}
              style={{
                containerType: "inline-size",
                gap: `calc((24px / 196) * ${resolvedWidth})`,
              }}
            >
              <div>
                {eyebrow ? (
                  <span
                    className="mb-[3cqw] block text-[4cqw] font-bold uppercase tracking-[0.16em] opacity-60"
                    style={{ color: textColor }}
                  >
                    {eyebrow}
                  </span>
                ) : null}
                <span
                  className={clsx(
                    "block text-balance font-semibold leading-[1.02] tracking-[-0.045em]",
                    variant === "simple" ? "text-[12cqw]" : "text-[10.5cqw]"
                  )}
                  style={{ color: textColor }}
                >
                  {title}
                </span>
              </div>

              {variant === "stripe" ? (
                <svg
                  className="-mb-1 -ml-1 scale-75"
                  height="24"
                  width="24"
                  viewBox="0 0 24 24"
                  style={{ fill: textColor }}
                  aria-hidden
                >
                  <path d="M21 21H3L12 3Z" />
                </svg>
              ) : (
                <div className="mt-auto">{coverIllustration}</div>
              )}
            </div>
          </div>

          {textured ? (
            <div
              className="pointer-events-none absolute inset-0 rounded-l-md rounded-r opacity-30 mix-blend-soft-light"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(18deg, rgba(255,255,255,.18) 0 1px, transparent 1px 4px)",
              }}
            />
          ) : null}
        </div>

        <div
          className="absolute top-[3px] h-[calc(100%_-_6px)] w-[calc(29cqw_-_2px)]"
          style={{
            background:
              "linear-gradient(90deg, #e8e8e4, transparent 70%), linear-gradient(#fff, #f6f6f2)",
            transform: `translateX(calc(${resolvedWidth}px - 29cqw / 2 - 3px)) rotateY(90deg) translateX(calc(29cqw / 2))`,
          }}
          aria-hidden
        />
      </div>
    </article>
  );
}
