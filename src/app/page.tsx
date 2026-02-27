import Link from "next/link";
import { TECH_TRACKS, type TechTrack } from "@/types";
import {
  Globe, Server, Smartphone, Cloud, BrainCircuit,
  Database, ShieldCheck, Puzzle, Network, Wrench,
  ArrowRight,
  Code2,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TRACK_ICONS: Record<string, LucideIcon> = {
  Globe, Server, Smartphone, Cloud, BrainCircuit,
  Database, ShieldCheck, Puzzle, Network, Wrench,
};

export default function Home() {
  return (
    <div className="relative min-h-screen bg-bg-primary gradient-mesh bg-grid overflow-hidden">
      {/* Hero Section */}
      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-20 md:pt-32">
        <div className="grid gap-16 md:grid-cols-2 lg:gap-8 items-center">

          {/* Left Column: Copy & CTA */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="animate-fade-up stagger-1 mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary/50 px-4 py-1.5 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono text-xs text-text-secondary tracking-wide">
                LA PIATTAFORMA ITALIANA #1 PER MOCK INTERVIEW
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up stagger-2 font-display text-5xl sm:text-6xl font-bold leading-[1.1] tracking-tight lg:text-7xl">
              Supera il tuo
              <br />
              <span className="text-accent">colloquio</span>
              <br />
              <span className="text-text-secondary">tecnico.</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-up stagger-3 mt-6 text-lg leading-relaxed text-text-secondary">
              Simulazioni di colloquio realistiche con AI per <strong className="text-text-primary">ogni ambito tech</strong>.
              Da Frontend a DevOps, da Python a Rust — ricevi esercitazioni pratiche e feedback dettagliato come da un vero intervistatore senior.
            </p>

            {/* CTA */}
            <div className="animate-fade-up stagger-4 mt-10 flex flex-wrap gap-4">
              <Link
                href="/interview"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 font-mono text-sm font-semibold uppercase tracking-wide text-bg-primary transition-all duration-200 hover:brightness-110 glow-border"
              >
                Inizia Esercitazione
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-secondary/80 px-8 py-3.5 font-mono text-sm tracking-wide text-text-secondary transition-all duration-200 hover:border-accent/50 hover:text-text-primary backdrop-blur-sm"
              >
                Dashboard
              </Link>
            </div>

            {/* Social Proof / Stats */}
            <div className="animate-fade-up stagger-5 mt-10 flex items-center gap-6 text-sm text-text-muted font-mono">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-accent/70" />
                <span>10 Aree Tech</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-accent/70" />
                <span>50+ Tecnologie</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Tech Track Grid */}
          <div className="animate-fade-up stagger-4 relative">
            <div className="absolute -inset-4 rounded-3xl bg-accent/5 blur-2xl md:-inset-10" />
            <div className="relative grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 p-4 lg:p-0">
              {(Object.entries(TECH_TRACKS) as [TechTrack, (typeof TECH_TRACKS)[TechTrack]][]).map(
                ([key, config], i) => {
                  const IconComponent = TRACK_ICONS[config.icon];
                  // Make some tiles span 2 columns dynamically for a bento-box feel or just keep them uniform. Uniform is cleaner.
                  return (
                    <Link
                      key={key}
                      href={`/interview?track=${key}`}
                      className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-bg-secondary/40 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:bg-bg-elevated/60 hover:shadow-[0_0_20px_rgba(var(--color-accent-rgb),0.15)]"
                    >
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-elevated border border-border/50 transition-colors group-hover:border-current"
                        style={{ color: config.color }}
                      >
                        {IconComponent && <IconComponent className="h-6 w-6" />}
                      </div>
                      <span className="font-mono text-xs font-semibold text-text-primary text-center">
                        {config.label}
                      </span>
                    </Link>
                  );
                }
              )}
              {/* Coming Soon Cards to balance the 3-column grid (10 + 2 = 12) */}
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-bg-secondary/20 p-6 backdrop-blur-md opacity-60 cursor-not-allowed">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-elevated/30 border border-border/30">
                  <Sparkles className="h-5 w-5 text-text-muted" />
                </div>
                <span className="font-mono text-[10px] font-bold text-text-muted text-center uppercase tracking-widest">
                  Coming Soon
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-bg-secondary/20 p-6 backdrop-blur-md opacity-60 cursor-not-allowed">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-elevated/30 border border-border/30">
                  <Sparkles className="h-5 w-5 text-text-muted" />
                </div>
                <span className="font-mono text-[10px] font-bold text-text-muted text-center uppercase tracking-widest">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature cards below */}
        <div className="animate-fade-up stagger-5 mt-32 grid gap-6 sm:grid-cols-3 relative z-10">
          {[
            {
              icon: "01",
              title: "Mock Interview AI",
              desc: "Chat in tempo reale con un intervistatore AI che adatta le domande e la difficoltà alla tua area tech selezionata.",
            },
            {
              icon: "02",
              title: "Code Editor Integrato",
              desc: "Editor stile VS Code con syntax highlighting per Java, Python, C++, Go, Rust, SQL e decine di altri linguaggi.",
            },
            {
              icon: "03",
              title: "Report & Analytics",
              desc: "Feedback dettagliato al termine di ogni sessione: punteggio, punti di forza e aree specifiche da approfondire.",
            },
          ].map((feature) => (
            <div
              key={feature.icon}
              className="group rounded-2xl border border-border bg-bg-secondary/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:bg-bg-elevated/50"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 font-mono text-sm font-bold text-accent">
                  {feature.icon}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-base leading-relaxed text-text-secondary">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent pointer-events-none" />
    </div>
  );
}
