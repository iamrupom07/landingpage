import type { Metadata, Viewport } from "next";
import { DM_Sans, Sora, Syne } from "next/font/google";

import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kinetic Business | Business Internet Built For Growth",
  description:
    "Reliable high-speed business internet with predictable pricing, dedicated support, enterprise security, and local specialists.",
  openGraph: {
    title: "Kinetic Business Internet",
    description:
      "Reliable high-speed internet designed for modern businesses. Faster connections, lower downtime, and predictable pricing.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#F8FAFC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} ${sora.className}`}>
        {children}
      </body>
    </html>
  );
}
