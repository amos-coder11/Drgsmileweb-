"use client";

import { cn } from "@/lib/utils";

export type FlipLinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

type FlipLinksProps = {
  links?: FlipLinkItem[];
  className?: string;
};

const DEFAULT_LINKS: FlipLinkItem[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/drgsmile/?hl=es",
    external: true,
  },
  { label: "Tratamientos", href: "#servicios" },
  { label: "Sonrisas", href: "#sonrisas" },
  { label: "Agenda", href: "#agenda" },
];

function FlipLink({ label, href, external }: FlipLinkItem) {
  const letters = label.split("");

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      aria-label={label}
      className="group relative block overflow-hidden whitespace-nowrap font-[family-name:var(--font-body)] text-[clamp(2.1rem,10.5vw,10.5rem)] font-black uppercase leading-[0.8] tracking-[-0.07em] text-[#f2f2ea] outline-none transition-colors duration-300 hover:text-[#609edb] focus-visible:text-[#609edb]"
    >
      <span className="flex" aria-hidden>
        {letters.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.2,0.75,0.25,1)] group-hover:-translate-y-[110%] group-focus-visible:-translate-y-[110%]"
            style={{ transitionDelay: `${index * 24}ms` }}
          >
            {letter === " " ? "\u00a0" : letter}
          </span>
        ))}
      </span>
      <span className="absolute inset-0 flex" aria-hidden>
        {letters.map((letter, index) => (
          <span
            key={`${letter}-copy-${index}`}
            className="inline-block translate-y-[110%] transition-transform duration-500 ease-[cubic-bezier(0.2,0.75,0.25,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
            style={{ transitionDelay: `${index * 24}ms` }}
          >
            {letter === " " ? "\u00a0" : letter}
          </span>
        ))}
      </span>
    </a>
  );
}

export function Component({ links = DEFAULT_LINKS, className }: FlipLinksProps) {
  return (
    <section
      id="conecta"
      data-black-surface
      className={cn(
        "relative grid min-h-svh w-full place-content-center overflow-hidden bg-[#11120f] px-5 py-24 text-[#f2f2ea] md:px-10 md:py-32",
        className
      )}
      aria-labelledby="conecta-title"
    >
      <div className="absolute inset-x-5 top-8 flex items-center justify-between border-b border-[#f2f2ea]/20 pb-4 text-[0.62rem] font-bold uppercase tracking-[0.2em] md:inset-x-10 md:top-10">
        <span id="conecta-title">Conecta con DrGsmile</span>
        <span>Miami · Florida</span>
      </div>

      <div className="grid gap-2 md:gap-3">
        {links.map((link) => (
          <FlipLink key={link.label} {...link} />
        ))}
      </div>

      <p className="absolute inset-x-5 bottom-8 text-right text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#f2f2ea]/55 md:inset-x-10 md:bottom-10">
        Pasa el cursor para descubrir
      </p>
    </section>
  );
}

export default Component;
