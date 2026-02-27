import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

const SITE_URL = "https://tek-three.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "TekInterview — Supera il Colloquio Tecnico con l'AI",
    template: "%s | TekInterview",
  },
  description:
    "Preparati ai colloqui tecnici con un intervistatore AI. 10 aree tech, code editor live, report dettagliati. Gratis.",
  keywords: [
    "colloquio tecnico",
    "mock interview",
    "intervista tecnica",
    "coding interview",
    "AI interview",
    "React",
    "Java",
    "Python",
    "JavaScript",
    "TypeScript",
    "System Design",
    "DevOps",
    "algoritmi",
    "preparazione colloquio",
    "tech interview Italia",
  ],
  authors: [{ name: "TekInterview" }],
  openGraph: {
    title: "TekInterview — Supera il Colloquio Tecnico con l'AI",
    description:
      "Un intervistatore AI ti sfida con domande reali, analizza il tuo codice e ti dice dove migliorare. 10 aree tech, gratis.",
    url: SITE_URL,
    siteName: "TekInterview",
    images: [
      {
        url: "/og-image.png",
        width: 1024,
        height: 1024,
        alt: "TekInterview — Simulazione Colloqui Tecnici con AI",
      },
    ],
    locale: "it_IT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TekInterview — Supera il Colloquio Tecnico con l'AI",
    description:
      "Un intervistatore AI ti sfida con domande reali. 10 aree tech, code editor live, report dettagliati. Gratis.",
    images: ["/og-image.png"],
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
        <Analytics />
      </body>
    </html>
  );
}
