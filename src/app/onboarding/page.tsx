"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { TECH_TRACKS, type TechTrack } from "@/types";
import {
    Globe, Server, Smartphone, Cloud, BrainCircuit,
    Database, ShieldCheck, Puzzle, Network, Wrench,
    ArrowRight, ArrowLeft, Target, Briefcase, GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TRACK_ICONS: Record<string, LucideIcon> = {
    Globe, Server, Smartphone, Cloud, BrainCircuit,
    Database, ShieldCheck, Puzzle, Network, Wrench,
};

const GOALS = [
    { id: "interview", label: "Superare un colloquio", icon: Target, desc: "Mi sto preparando per un colloquio specifico" },
    { id: "improve", label: "Migliorare le competenze", icon: GraduationCap, desc: "Voglio rafforzare le mie skills tecniche" },
    { id: "explore", label: "Esplorare nuove aree", icon: Briefcase, desc: "Voglio scoprire nuovi ambiti tech" },
];

const EXPERIENCE_LEVELS = [
    { id: "junior", label: "Junior", desc: "0-2 anni di esperienza", color: "accent" },
    { id: "mid", label: "Mid Level", desc: "2-5 anni di esperienza", color: "indigo" },
    { id: "senior", label: "Senior", desc: "5+ anni di esperienza", color: "warning" },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [goal, setGoal] = useState("");
    const [selectedTrack, setSelectedTrack] = useState<TechTrack | "">("");
    const [experience, setExperience] = useState("");

    function handleFinish() {
        // Store preferences in localStorage for now
        if (typeof window !== "undefined") {
            localStorage.setItem("tek_onboarding", JSON.stringify({
                goal,
                track: selectedTrack,
                experience,
                completedAt: new Date().toISOString(),
            }));
        }
        router.push("/dashboard");
    }

    const steps = [
        // Step 1: Goal
        <div key="goal" className="animate-fade-up">
            <h2 className="font-display text-3xl font-bold text-text-primary">
                Qual è il tuo obiettivo?
            </h2>
            <p className="mt-2 text-text-secondary">
                Ci aiuterà a personalizzare la tua esperienza.
            </p>
            <div className="mt-8 space-y-3">
                {GOALS.map((g) => {
                    const Icon = g.icon;
                    return (
                        <button
                            key={g.id}
                            onClick={() => { setGoal(g.id); setStep(1); }}
                            className={`flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-all ${goal === g.id
                                    ? "border-accent/40 bg-accent/5"
                                    : "border-border bg-bg-secondary hover:border-accent/20 hover:bg-bg-elevated"
                                }`}
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                                <Icon className="h-5 w-5 text-accent" />
                            </div>
                            <div>
                                <p className="font-semibold text-text-primary">{g.label}</p>
                                <p className="text-sm text-text-muted">{g.desc}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>,

        // Step 2: Tech Track
        <div key="track" className="animate-fade-up">
            <h2 className="font-display text-3xl font-bold text-text-primary">
                Su quale area ti concentri?
            </h2>
            <p className="mt-2 text-text-secondary">
                Seleziona la tua area tech principale.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
                {(Object.entries(TECH_TRACKS) as [TechTrack, (typeof TECH_TRACKS)[TechTrack]][]).map(
                    ([key, config]) => {
                        const Icon = TRACK_ICONS[config.icon];
                        return (
                            <button
                                key={key}
                                onClick={() => { setSelectedTrack(key); setStep(2); }}
                                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${selectedTrack === key
                                        ? "border-accent/40 bg-accent/5"
                                        : "border-border bg-bg-secondary hover:border-accent/20 hover:bg-bg-elevated"
                                    }`}
                            >
                                {Icon && <Icon className="h-5 w-5 flex-shrink-0" style={{ color: config.color }} />}
                                <span className="font-mono text-sm text-text-primary">{config.label}</span>
                            </button>
                        );
                    }
                )}
            </div>
        </div>,

        // Step 3: Experience
        <div key="experience" className="animate-fade-up">
            <h2 className="font-display text-3xl font-bold text-text-primary">
                Quanta esperienza hai?
            </h2>
            <p className="mt-2 text-text-secondary">
                Adatteremo la difficoltà delle domande al tuo livello.
            </p>
            <div className="mt-8 space-y-3">
                {EXPERIENCE_LEVELS.map((level) => (
                    <button
                        key={level.id}
                        onClick={() => { setExperience(level.id); handleFinish(); }}
                        className={`flex w-full items-center gap-4 rounded-xl border p-5 text-left transition-all ${experience === level.id
                                ? "border-accent/40 bg-accent/5"
                                : "border-border bg-bg-secondary hover:border-accent/20 hover:bg-bg-elevated"
                            }`}
                    >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${level.color}/10`}>
                            <span className={`font-mono text-sm font-bold text-${level.color}`}>
                                {level.id === "junior" ? "Jr" : level.id === "mid" ? "Mid" : "Sr"}
                            </span>
                        </div>
                        <div>
                            <p className="font-semibold text-text-primary">{level.label}</p>
                            <p className="text-sm text-text-muted">{level.desc}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>,
    ];

    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-lg px-6 py-16">
                {/* Progress Indicator */}
                <div className="mb-10 flex items-center gap-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-accent" : "bg-bg-elevated"
                                }`}
                        />
                    ))}
                </div>

                {/* Step Content */}
                {steps[step]}

                {/* Back Button */}
                {step > 0 && (
                    <button
                        onClick={() => setStep(step - 1)}
                        className="mt-8 inline-flex items-center gap-2 font-mono text-xs text-text-muted hover:text-accent transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Indietro
                    </button>
                )}

                {/* Skip */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="font-mono text-xs text-text-muted hover:text-text-secondary transition-colors"
                    >
                        Salta per ora →
                    </button>
                </div>
            </main>
        </>
    );
}
