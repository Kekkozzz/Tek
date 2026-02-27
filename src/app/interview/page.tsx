"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import {
  INTERVIEW_TYPES,
  DIFFICULTY_LEVELS,
  type InterviewType,
  type Difficulty,
} from "@/types";

export default function InterviewSetupPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<InterviewType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("mid");

  function handleStart() {
    if (!selectedType) return;
    // For now, generate a simple session ID
    const sessionId = crypto.randomUUID();
    router.push(
      `/interview/${sessionId}?type=${selectedType}&difficulty=${selectedDifficulty}`
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="animate-fade-up">
          <span className="font-mono text-xs text-accent tracking-wide uppercase">
            Nuova Intervista
          </span>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
            Scegli il tipo di colloquio
          </h1>
          <p className="mt-3 text-text-secondary">
            Seleziona l&apos;area tecnica e il livello di difficolta.
          </p>
        </div>

        {/* Interview Type Selection */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.entries(INTERVIEW_TYPES) as [InterviewType, (typeof INTERVIEW_TYPES)[InterviewType]][]).map(
            ([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedType(key)}
                className={`
                  cursor-pointer text-left rounded-xl border p-5 transition-all duration-200
                  ${
                    selectedType === key
                      ? "border-accent/40 bg-accent/5 glow-border"
                      : "border-border bg-bg-secondary hover:border-accent/20 hover:bg-bg-elevated"
                  }
                `}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`
                      inline-flex h-10 w-10 items-center justify-center rounded-lg font-mono text-xs font-bold
                      ${
                        selectedType === key
                          ? "bg-accent/20 text-accent"
                          : "bg-bg-elevated text-text-muted"
                      }
                    `}
                  >
                    {config.icon}
                  </span>
                  <h3 className="font-display text-base font-semibold text-text-primary">
                    {config.label}
                  </h3>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {config.description}
                </p>
              </button>
            )
          )}
        </div>

        {/* Difficulty Selection */}
        <div className="mt-10">
          <h2 className="font-mono text-xs text-text-secondary uppercase tracking-wide mb-4">
            Difficolta
          </h2>
          <div className="flex gap-3">
            {(Object.entries(DIFFICULTY_LEVELS) as [Difficulty, (typeof DIFFICULTY_LEVELS)[Difficulty]][]).map(
              ([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedDifficulty(key)}
                  className={`
                    cursor-pointer flex-1 rounded-xl border p-4 text-center transition-all duration-200
                    ${
                      selectedDifficulty === key
                        ? "border-indigo/40 bg-indigo/5 glow-indigo"
                        : "border-border bg-bg-secondary hover:border-indigo/20 hover:bg-bg-elevated"
                    }
                  `}
                >
                  <p className="font-display text-base font-semibold text-text-primary">
                    {config.label}
                  </p>
                  <p className="mt-1 font-mono text-xs text-text-muted">
                    {config.description}
                  </p>
                </button>
              )
            )}
          </div>
        </div>

        {/* Start Button */}
        <div className="mt-12 flex justify-end">
          <Button
            size="lg"
            disabled={!selectedType}
            onClick={handleStart}
          >
            Inizia Colloquio
          </Button>
        </div>
      </main>
    </>
  );
}
