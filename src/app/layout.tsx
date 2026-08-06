import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://drgsmile.com"),
  title: "DrGsmile | Diseñamos Sonrisas",
  description:
    "Diseñamos sonrisas, transformamos confianza. Odontología estética con tecnología digital 3D.",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://drgsmile.com",
    siteName: "DrGsmile",
    title: "DrGsmile | Diseñamos Sonrisas",
    description: "Diseñamos sonrisas, transformamos confianza.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "DrGsmile" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
