import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TekInterview — AI Mock Interview",
  description:
    "Preparati ai colloqui tecnici frontend con simulazioni di intervista AI-powered. React, Next.js, TypeScript.",
  keywords: ["interview", "mock interview", "frontend", "React", "Next.js", "TypeScript", "AI", "coding interview"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "TekInterview — AI Mock Interview",
    description: "Simulazioni di colloquio tecnico AI-powered per sviluppatori frontend.",
    type: "website",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="dark">
      <body
        className={`${fraunces.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
