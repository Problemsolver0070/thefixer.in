import type { Metadata } from "next";
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
