"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { TECH_TRACKS, type TechTrack } from "@/types";
import { TRACK_PROMPT_DATA } from "@/lib/prompts/tracks-data";
import {
    Globe, Server, Smartphone, Cloud, BrainCircuit,
    Database, ShieldCheck, Puzzle, Network, Wrench,
    ChevronDown, BookOpen, ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TRACK_ICONS: Record<string, LucideIcon> = {
    Globe, Server, Smartphone, Cloud, BrainCircuit,
    Database, ShieldCheck, Puzzle, Network, Wrench,
};

export default function LearnPage() {
    const [selectedTrack, setSelectedTrack] = useState<TechTrack>("frontend");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const categories = useMemo(() => {
        const trackData = TRACK_PROMPT_DATA[selectedTrack];
        if (!trackData) return [];
        return Object.entries(trackData.topics).map(([name, topics]) => ({
            name,
            topics,
        }));
    }, [selectedTrack]);

    const trackConfig = TECH_TRACKS[selectedTrack];
    const TrackIcon = TRACK_ICONS[trackConfig.icon];

    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-7xl px-6 py-12">
                <div className="animate-fade-up flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 relative z-30">
                    <div>
                        <span className="font-mono text-xs text-accent tracking-wide uppercase">
                            Knowledge Base
                        </span>
                        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
                            Studia prima, rispondi meglio
                        </h1>
                        <p className="mt-3 text-text-secondary">
                            Schede generate dall&apos;AI su ogni argomento. Per arrivare preparato.
                        </p>
                    </div>

                    {/* Track Selector */}
                    <div className="relative z-20">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="inline-flex items-center gap-3 rounded-xl border border-border bg-bg-secondary px-5 py-3 transition-all hover:border-accent/30 hover:bg-bg-elevated"
                        >
                            {TrackIcon && (
                                <TrackIcon className="h-5 w-5" style={{ color: trackConfig.color }} />
                            )}
                            <span className="font-mono text-sm font-semibold text-text-primary">
                                {trackConfig.label}
                            </span>
                            <ChevronDown className={`h-4 w-4 text-text-muted transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 top-full z-50 mt-2 w-64 max-h-80 overflow-y-auto rounded-xl border border-border bg-bg-secondary p-2 shadow-xl backdrop-blur-xl">
                                {(Object.entries(TECH_TRACKS) as [TechTrack, (typeof TECH_TRACKS)[TechTrack]][]).map(
                                    ([key, config]) => {
                                        const Icon = TRACK_ICONS[config.icon];
                                        return (
                                            <button
                                                key={key}
                                                onClick={() => { setSelectedTrack(key); setDropdownOpen(false); }}
                                                className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors ${selectedTrack === key
                                                    ? "bg-accent/10 text-accent"
                                                    : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                                                    }`}
                                            >
                                                {Icon && <Icon className="h-4 w-4" style={{ color: config.color }} />}
                                                <span className="font-mono text-sm">{config.label}</span>
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-0">
                    {categories.map((category, i) => (
                        <div
                            key={`${selectedTrack}-${category.name}`}
                            className="animate-fade-up rounded-xl border border-border bg-bg-secondary p-6 transition-all duration-300 hover:border-accent/20 hover:bg-bg-elevated"
                            style={{ animationDelay: `${i * 0.05}s` }}
                        >
                            <div className="flex items-center gap-3 mb-5">
                                <BookOpen className="h-5 w-5 text-accent" />
                                <h2 className="font-display text-xl font-semibold text-text-primary">
                                    {category.name}
                                </h2>
                            </div>
                            <div className="space-y-2">
                                {category.topics.map((topic) => (
                                    <Link
                                        key={topic}
                                        href={`/learn/${selectedTrack}/${encodeURIComponent(topic)}`}
                                        className="flex items-center justify-between group rounded-lg px-3 py-2.5 -mx-3 transition-all hover:bg-accent/5"
                                    >
                                        <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                                            {topic}
                                        </span>
                                        <ArrowRight className="h-3.5 w-3.5 text-text-muted opacity-0 group-hover:opacity-100 group-hover:text-accent transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
}
