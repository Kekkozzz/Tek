"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TECH_TRACKS, type TechTrack } from "@/types";
import {
  Globe, Server, Smartphone, Cloud, BrainCircuit,
  Database, ShieldCheck, Puzzle, Network, Wrench,
  ArrowRight, Code2, Sparkles, Bot, BarChart3, BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TRACK_ICONS: Record<string, LucideIcon> = {
  Globe, Server, Smartphone, Cloud, BrainCircuit,
  Database, ShieldCheck, Puzzle, Network, Wrench,
};

// Words to cycle through in the typing animation
const TYPING_WORDS = ["Frontend", "Backend", "DevOps", "Mobile", "Data Science", "System Design"];

function useTypingEffect(words: string[], typingSpeed = 80, deleteSpeed = 50, pauseMs = 1800) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");

  useEffect(() => {
    const currentWord = words[wordIndex];

    let delay: number;
    if (phase === "typing") {
      delay = typingSpeed;
    } else if (phase === "pausing") {
      delay = pauseMs;
    } else {
      delay = deleteSpeed;
    }

    const timeout = setTimeout(() => {
      if (phase === "typing") {
        const next = currentWord.slice(0, text.length + 1);
        setText(next);
        if (next.length === currentWord.length) {
          setPhase("pausing");
        }
      } else if (phase === "pausing") {
        setPhase("deleting");
      } else {
        const next = currentWord.slice(0, text.length - 1);
        setText(next);
        if (next.length === 0) {
          setWordIndex((prev) => (prev + 1) % words.length);
          setPhase("typing");
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, phase, wordIndex, words, typingSpeed, deleteSpeed, pauseMs]);

  return text;
}

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Small delay before starting
    const delay = setTimeout(() => setStarted(true), 500);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [started, target, duration]);

  return count;
}

export default function Home() {
  const typedText = useTypingEffect(TYPING_WORDS);
  const topicCount = useCountUp(80);

  return (
    <div className="relative min-h-screen bg-bg-primary gradient-mesh bg-grid overflow-hidden">
      {/* Hero Section */}
      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-20 md:pt-32">
        <div className="grid gap-16 md:grid-cols-2 lg:gap-8 items-center">

          {/* Left Column: Copy & CTA */}
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="animate-fade-up stagger-1 mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary/50 px-4 py-1.5 backdrop-blur-sm">
              <Bot className="h-3.5 w-3.5 text-accent" />
              <span className="font-mono text-xs text-text-secondary tracking-wide">
                POWERED BY GEMINI AI
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up stagger-2 font-display text-5xl sm:text-6xl font-bold leading-[1.1] tracking-tight lg:text-7xl">
              Il tuo prossimo
              <br />
              colloquio?
              <br />
              <span className="text-accent">{typedText}</span>
              <span className="animate-blink text-accent">|</span>
              <br />
              <span className="text-text-secondary">Superato.</span>
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-up stagger-3 mt-6 text-lg leading-relaxed text-text-secondary">
              Preparati come nessun corso può fare. Un <strong className="text-text-primary">intervistatore AI</strong> ti
              sfida con domande reali, analizza il tuo codice live e ti dice esattamente dove migliorare — in 10 aree tech diverse.
            </p>

            {/* CTA */}
            <div className="animate-fade-up stagger-4 mt-10 flex flex-wrap gap-4">
              <Link
                href="/interview"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3.5 font-mono text-sm font-semibold uppercase tracking-wide text-bg-primary transition-all duration-200 hover:brightness-110 glow-border"
              >
                Prova il Tuo Primo Colloquio
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-secondary/80 px-8 py-3.5 font-mono text-sm tracking-wide text-text-secondary transition-all duration-200 hover:border-accent/50 hover:text-text-primary backdrop-blur-sm"
              >
                <BookOpen className="h-4 w-4" />
                Knowledge Base
              </Link>
            </div>

            {/* Social Proof Stats */}
            <div className="animate-fade-up stagger-5 mt-10 flex items-center gap-6 text-sm text-text-muted font-mono">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-accent/70" />
                <span><strong className="text-text-primary">10</strong> Aree Tech</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-accent/70" />
                <span><strong className="text-text-primary">{topicCount}+</strong> argomenti</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Tech Track Grid */}
          <div className="animate-fade-up stagger-4 relative">
            <div className="absolute -inset-4 rounded-3xl bg-accent/5 blur-2xl md:-inset-10" />
            <div className="relative grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 p-4 lg:p-0">
              {(Object.entries(TECH_TRACKS) as [TechTrack, (typeof TECH_TRACKS)[TechTrack]][]).map(
                ([key, config]) => {
                  const IconComponent = TRACK_ICONS[config.icon];
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
              {/* Coming Soon Cards */}
              {[1, 2].map((n) => (
                <div key={n} className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/60 bg-bg-secondary/20 p-6 backdrop-blur-md opacity-60 cursor-not-allowed">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bg-elevated/30 border border-border/30">
                    <Sparkles className="h-5 w-5 text-text-muted" />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-text-muted text-center uppercase tracking-widest">
                    Coming Soon
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature cards below */}
        <div className="animate-fade-up stagger-5 mt-32 grid gap-6 sm:grid-cols-3 relative z-10">
          {[
            {
              icon: Bot,
              title: "Colloqui che Sembrano Veri",
              desc: "Un AI senior ti fa domande, ti mette alla prova e adatta la difficoltà in tempo reale. Come un vero colloquio, senza l'ansia.",
              color: "accent",
            },
            {
              icon: Code2,
              title: "Scrivi Codice, Non Solo Risposte",
              desc: "Editor VS Code integrato con 16+ linguaggi. L'AI analizza il tuo codice in tempo reale e ti guida verso la soluzione.",
              color: "indigo",
            },
            {
              icon: BarChart3,
              title: "Scopri Dove Migliorare",
              desc: "Dopo ogni sessione ricevi un report con punteggio, punti di forza e le aree esatte su cui lavorare. Zero sorprese al colloquio reale.",
              color: "warning",
            },
          ].map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-border bg-bg-secondary/50 p-8 backdrop-blur-sm transition-all duration-300 hover:border-accent/30 hover:bg-bg-elevated/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-${feature.color}/10 border border-${feature.color}/20`}>
                    <FeatureIcon className={`h-5 w-5 text-${feature.color}`} />
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-base leading-relaxed text-text-secondary">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-primary via-bg-primary/80 to-transparent pointer-events-none" />
    </div>
  );
}
