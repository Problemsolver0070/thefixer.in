import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import LenisProvider from "@/components/providers/LenisProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1a1625",
};

export const metadata: Metadata = {
  title: "The Fixer — AI & Software Consultancy",
  description:
    "Elite AI agentic solutions and software development consultancy. We solve what others can't.",
  keywords: [
    "AI consultancy",
    "software development",
    "systems design",
    "agentic AI",
  ],
  openGraph: {
    title: "The Fixer — AI & Software Consultancy",
    description:
      "You've exhausted every option. That's why you're here. Elite AI agentic solutions and software development.",
    url: "https://thefixer.in",
    siteName: "The Fixer",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Fixer — AI & Software Consultancy",
    description:
      "You've exhausted every option. That's why you're here. Elite AI agentic solutions and software development.",
  },
  metadataBase: new URL("https://thefixer.in"),
  appleWebApp: {
    title: "The Fixer",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
