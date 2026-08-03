import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 text-lg font-bold text-white">
                G
              </div>
              <span className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white">
                Dr. G Smile
              </span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">
              Clínica dental de excelencia con tecnología de vanguardia.
              Transformamos sonrisas con pasión y profesionalismo.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#servicios" className="transition-colors hover:text-sky-400">Servicios</a></li>
              <li><a href="#nosotros" className="transition-colors hover:text-sky-400">Nosotros</a></li>
              <li><a href="#testimonios" className="transition-colors hover:text-sky-400">Testimonios</a></li>
              <li><a href="#contacto" className="transition-colors hover:text-sky-400">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Tecnología</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Next.js</li>
              <li>Three.js + GSAP</li>
              <li>Rive Animations</li>
              <li>HTTP/3 Ready</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 md:flex-row">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Dr. G Smile. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <Link href="#" className="hover:text-sky-400">Privacidad</Link>
            <Link href="#" className="hover:text-sky-400">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
