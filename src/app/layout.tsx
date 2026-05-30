import type { Metadata } from "next";
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
  description: "An experimental, disruptive universe. Exclusive access to designers from around the world — fashion, art, and beyond.",
  openGraph: {
    title: "House of Access | 04009c",
    description: "An experimental, disruptive universe. Exclusive access to designers from around the world — fashion, art, and beyond.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "House of Access | 04009c",
    description: "An experimental, disruptive universe. Exclusive access to designers from around the world — fashion, art, and beyond.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexMono.variable} ${bebasNeue.variable} ${dmSans.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
