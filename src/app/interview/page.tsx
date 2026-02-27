"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Button from "@/components/ui/Button";
import {
  TECH_TRACKS,
  INTERVIEW_TYPES,
  DIFFICULTY_LEVELS,
  type TechTrack,
  type InterviewType,
  type Difficulty,
} from "@/types";
import {
  Globe,
  Server,
  Smartphone,
  Cloud,
  BrainCircuit,
  Database,
  ShieldCheck,
  Puzzle,
  Network,
  Wrench,
  BookOpen,
  Code,
  MessageSquare,
  Bug,
  Blocks,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Icon Maps ───────────────────────────────────

const TRACK_ICONS: Record<string, LucideIcon> = {
  Globe, Server, Smartphone, Cloud, BrainCircuit,
  Database, ShieldCheck, Puzzle, Network, Wrench,
};

const TYPE_ICONS: Record<string, LucideIcon> = {
  BookOpen, Code, Network, MessageSquare, Bug, Blocks,
};

// ── Component ───────────────────────────────────

export default function InterviewSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState<TechTrack | null>(null);
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("mid");

  const trackData = selectedTrack ? TECH_TRACKS[selectedTrack] : null;

  function handleStart() {
    if (!selectedTrack || !selectedType || !selectedLanguage) return;
    const sessionId = crypto.randomUUID();
    router.push(
      `/interview/${sessionId}?track=${selectedTrack}&type=${selectedType}&difficulty=${selectedDifficulty}&lang=${selectedLanguage}`
    );
  }

  function goNext() {
    if (step === 1 && selectedTrack) {
      // Auto-select first language if only one
      if (trackData && trackData.languages.length === 1) {
        setSelectedLanguage(trackData.languages[0].id);
      }
      // Auto-select first interview type
      if (trackData && !selectedType) {
        setSelectedType(trackData.interviewTypes[0]);
      }
      setStep(2);
    } else if (step === 2 && selectedType && selectedLanguage) {
      setStep(3);
    }
  }

  function goBack() {
    if (step === 2) {
      setStep(1);
      setSelectedType(null);
      setSelectedLanguage(null);
    } else if (step === 3) {
      setStep(2);
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="animate-fade-up">
          <span className="font-mono text-xs text-accent tracking-wide uppercase">
            Nuovo Colloquio
          </span>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
            {step === 1 && "Su cosa vuoi prepararti?"}
            {step === 2 && "Personalizza il colloquio"}
            {step === 3 && "Scegli la sfida"}
          </h1>
          <p className="mt-3 text-text-secondary">
            {step === 1 && "Seleziona l'area tech — ti prepareremo domande specifiche."}
            {step === 2 && "Scegli il formato e il linguaggio con cui ti senti più a tuo agio."}
            {step === 3 && "Junior, Mid o Senior? L'AI calibrerà le domande di conseguenza."}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mt-8 flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs font-bold transition-all
                  ${s < step ? "bg-accent text-bg-primary" : ""}
                  ${s === step ? "bg-accent/20 text-accent border border-accent/40" : ""}
                  ${s > step ? "bg-bg-elevated text-text-muted border border-border" : ""}
                `}
              >
                {s < step ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`h-px w-8 transition-all ${s < step ? "bg-accent" : "bg-border"
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Track Selection ─────────────── */}
        {step === 1 && (
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(Object.entries(TECH_TRACKS) as [TechTrack, (typeof TECH_TRACKS)[TechTrack]][]).map(
              ([key, config]) => {
                const IconComponent = TRACK_ICONS[config.icon];
                const isSelected = selectedTrack === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedTrack(key)}
                    className={`
                      cursor-pointer text-left rounded-xl border p-5 transition-all duration-200
                      ${isSelected
                        ? "border-accent/40 bg-accent/5 glow-border"
                        : "border-border bg-bg-secondary hover:border-accent/20 hover:bg-bg-elevated"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`
                          inline-flex h-10 w-10 items-center justify-center rounded-lg
                          ${isSelected ? "bg-accent/20 text-accent" : "bg-bg-elevated text-text-muted"}
                        `}
                        style={isSelected ? { color: config.color } : undefined}
                      >
                        {IconComponent && <IconComponent className="h-5 w-5" />}
                      </span>
                      <h3 className="font-display text-base font-semibold text-text-primary">
                        {config.label}
                      </h3>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {config.description}
                    </p>
                  </button>
                );
              }
            )}
          </div>
        )}

        {/* ── Step 2: Interview Type + Language ──── */}
        {step === 2 && trackData && (
          <div className="mt-10 space-y-10">
            {/* Interview Type */}
            <div>
              <h2 className="font-mono text-xs text-text-secondary uppercase tracking-wide mb-4">
                Tipo di Intervista
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {trackData.interviewTypes.map((typeKey) => {
                  const config = INTERVIEW_TYPES[typeKey];
                  const IconComponent = TYPE_ICONS[config.icon];
                  const isSelected = selectedType === typeKey;
                  return (
                    <button
                      key={typeKey}
                      onClick={() => setSelectedType(typeKey)}
                      className={`
                        cursor-pointer text-left rounded-xl border p-5 transition-all duration-200
                        ${isSelected
                          ? "border-accent/40 bg-accent/5 glow-border"
                          : "border-border bg-bg-secondary hover:border-accent/20 hover:bg-bg-elevated"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`
                            inline-flex h-8 w-8 items-center justify-center rounded-lg
                            ${isSelected ? "bg-accent/20 text-accent" : "bg-bg-elevated text-text-muted"}
                          `}
                        >
                          {IconComponent && <IconComponent className="h-4 w-4" />}
                        </span>
                        <h3 className="font-display text-sm font-semibold text-text-primary">
                          {config.label}
                        </h3>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        {config.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Language */}
            <div>
              <h2 className="font-mono text-xs text-text-secondary uppercase tracking-wide mb-4">
                Linguaggio / Tecnologia
              </h2>
              <div className="flex flex-wrap gap-2">
                {trackData.languages.map((lang) => {
                  const isSelected = selectedLanguage === lang.id;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => setSelectedLanguage(lang.id)}
                      className={`
                        cursor-pointer rounded-lg border px-4 py-2.5 font-mono text-sm transition-all duration-200
                        ${isSelected
                          ? "border-indigo/40 bg-indigo/5 text-text-primary glow-indigo"
                          : "border-border bg-bg-secondary text-text-secondary hover:border-indigo/20 hover:text-text-primary"
                        }
                      `}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Difficulty ──────────────────── */}
        {step === 3 && (
          <div className="mt-10">
            <div className="flex gap-3">
              {(Object.entries(DIFFICULTY_LEVELS) as [Difficulty, (typeof DIFFICULTY_LEVELS)[Difficulty]][]).map(
                ([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedDifficulty(key)}
                    className={`
                      cursor-pointer flex-1 rounded-xl border p-6 text-center transition-all duration-200
                      ${selectedDifficulty === key
                        ? "border-indigo/40 bg-indigo/5 glow-indigo"
                        : "border-border bg-bg-secondary hover:border-indigo/20 hover:bg-bg-elevated"
                      }
                    `}
                  >
                    <p className="font-display text-lg font-semibold text-text-primary">
                      {config.label}
                    </p>
                    <p className="mt-1 font-mono text-xs text-text-muted">
                      {config.description}
                    </p>
                  </button>
                )
              )}
            </div>

            {/* Summary */}
            {selectedTrack && selectedType && selectedLanguage && (
              <div className="mt-8 rounded-xl border border-border bg-bg-secondary/50 p-6">
                <h3 className="font-mono text-xs text-text-muted uppercase tracking-wide mb-3">
                  Riepilogo
                </h3>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-lg bg-accent/10 border border-accent/20 px-3 py-1.5 font-mono text-sm text-accent">
                    {TECH_TRACKS[selectedTrack].label}
                  </span>
                  <span className="rounded-lg bg-bg-elevated border border-border px-3 py-1.5 font-mono text-sm text-text-primary">
                    {INTERVIEW_TYPES[selectedType].label}
                  </span>
                  <span className="rounded-lg bg-indigo/10 border border-indigo/20 px-3 py-1.5 font-mono text-sm text-indigo">
                    {TECH_TRACKS[selectedTrack].languages.find((l) => l.id === selectedLanguage)?.label}
                  </span>
                  <span className="rounded-lg bg-bg-elevated border border-border px-3 py-1.5 font-mono text-sm text-text-muted">
                    {DIFFICULTY_LEVELS[selectedDifficulty].label}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Navigation Buttons ──────────────────── */}
        <div className="mt-12 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                onClick={goBack}
                className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-border bg-bg-secondary px-5 py-3 font-mono text-sm text-text-secondary transition-all hover:border-accent/30 hover:text-text-primary"
              >
                <ArrowLeft className="h-4 w-4" />
                Indietro
              </button>
            )}
          </div>
          <div>
            {step < 3 ? (
              <Button
                size="lg"
                disabled={
                  (step === 1 && !selectedTrack) ||
                  (step === 2 && (!selectedType || !selectedLanguage))
                }
                onClick={goNext}
              >
                Avanti
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button size="lg" onClick={handleStart}>
                Inizia Colloquio
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
