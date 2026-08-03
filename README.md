# Dr. G Smile Web

Sitio web moderno para clínica dental construido con tecnologías de vanguardia.

## Stack Tecnológico

| Tecnología | Uso |
|---|---|
| **Next.js 15** | Framework JavaScript (React) con App Router |
| **GSAP** | Animaciones de scroll y transiciones |
| **Three.js** | Gráficos 3D interactivos (escena dental) |
| **Rive** | Animaciones vectoriales interactivas |
| **Webpack** | Bundler (configurado en `next.config.ts`) |
| **Open Graph** | Meta tags para compartir en redes sociales |
| **HTTP/3** | Headers Alt-Svc configurados (activo en Vercel/CDN) |
| **Tailwind CSS 4** | Estilos utilitarios |

## Inicio Rápido

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

```
src/
├── app/
│   ├── layout.tsx      # Layout + Open Graph metadata
│   ├── page.tsx        # Página principal
│   └── globals.css     # Estilos globales
└── components/
    ├── Header.tsx       # Navegación con GSAP
    ├── Hero.tsx         # Hero con Three.js
    ├── ToothScene.tsx   # Escena 3D (Three.js + R3F)
    ├── RiveAnimation.tsx # Animaciones Rive
    ├── Stats.tsx        # Contadores animados (GSAP)
    ├── Services.tsx     # Grid de servicios
    ├── About.tsx        # Sección about
    ├── Testimonials.tsx # Testimonios
    ├── Contact.tsx      # Formulario de contacto
    └── Footer.tsx       # Pie de página
```

## Rive Animations

Coloca tu archivo `.riv` en `public/animations/smile.riv` para activar animaciones Rive reales. Sin el archivo, se muestra un fallback SVG animado.

## Open Graph

Edita los metadatos en `src/app/layout.tsx`. Agrega `public/og-image.jpg` (1200×630px) para la imagen de preview social.

## Deploy

Compatible con Vercel (HTTP/3 automático):

```bash
npm run build
```
