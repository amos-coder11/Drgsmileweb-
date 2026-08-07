"use client";

import { useEffect, useState } from "react";

const BREAKPOINTS = {
  sm: 0,
  md: 600,
  lg: 960,
  xl: 1200,
} as const;

export type ResponsiveValue<T> = {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
};

function resolveResponsive<T>(
  value: T | ResponsiveValue<T>,
  width?: number
): T | undefined {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    return value as T;
  }

  const responsive = value as ResponsiveValue<T>;
  let resolved = responsive.sm;
  const viewportWidth = width ?? 0;

  (Object.keys(BREAKPOINTS) as Array<keyof typeof BREAKPOINTS>).forEach(
    (breakpoint) => {
      if (
        viewportWidth >= BREAKPOINTS[breakpoint] &&
        responsive[breakpoint] !== undefined
      ) {
        resolved = responsive[breakpoint];
      }
    }
  );

  return resolved;
}

export function useResponsive<T>(value: T | ResponsiveValue<T>) {
  const [resolved, setResolved] = useState<T | undefined>(() =>
    resolveResponsive(value)
  );

  useEffect(() => {
    const update = () => {
      setResolved(resolveResponsive(value, window.innerWidth));
    };

    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, [value]);

  return resolved;
}
