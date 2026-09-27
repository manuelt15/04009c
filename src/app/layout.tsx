import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Bebas_Neue, DM_Sans } from "next/font/google";
import Providers from "@/components/shared/Providers";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "House of Access | 04009c",
  description: "Un universo experimental y disruptivo. Acceso exclusivo a diseñadores de todo el mundo: moda, arte y más allá.",
  openGraph: {
    title: "House of Access | 04009c",
    description: "Un universo experimental y disruptivo. Acceso exclusivo a diseñadores de todo el mundo: moda, arte y más allá.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "House of Access | 04009c",
    description: "Un universo experimental y disruptivo. Acceso exclusivo a diseñadores de todo el mundo: moda, arte y más allá.",
    images: ["/og-image.png"],
  },
};

// viewport-fit=cover para poder usar env(safe-area-inset-*) con la barra y la muesca del iPhone
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${ibmPlexMono.variable} ${bebasNeue.variable} ${dmSans.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
