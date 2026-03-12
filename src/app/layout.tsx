import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { BottomNav } from "@/components/bottom-nav";
import { ConsentBanner } from "@/components/consent-banner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Santa Cruz Suites — Acceso y Guía Local",
    template: "%s | Santa Cruz Suites",
  },
  description:
    "Acceso al estacionamiento y guía de restaurantes y experiencias locales en La Paz, Baja California Sur.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Santa Cruz",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#1a1a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className="bg-surface font-sans antialiased">
        {children}
        <BottomNav />
        <ConsentBanner />
      </body>
    </html>
  );
}
