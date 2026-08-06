"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/** Imagen principal del hero — solo el doctor, ajustada al slot 16:9 */
export function HeroMainPhoto({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-white",
        className
      )}
    >
      <Image
        src="/images/banner-eleven-1.png"
        alt="Drgsmile"
        fill
        priority
        sizes="(max-width: 768px) 95vw, 720px"
        className="object-contain object-bottom"
      />
    </div>
  );
}
