"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";

interface Suggestion {
    title: string;
    description: string;
    action?: string;
    actionLabel?: string;
    priority: "high" | "medium" | "low";
}

export default function AISuggestions() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/stats/suggestions");
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data.suggestions || []);
                }
            } catch {
                // silently fail
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const priorityColors = {
        high: "border-accent/30 bg-accent/5",
        medium: "border-indigo/30 bg-indigo/5",
        low: "border-border bg-bg-elevated",
    };

    const dotColors = {
        high: "bg-accent",
        medium: "bg-indigo",
        low: "bg-text-muted",
    };

    if (loading) {
        return (
            <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wide">
                        Suggerimenti AI
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 text-text-muted animate-spin" />
                    <span className="text-sm text-text-muted">Analisi in corso...</span>
                </div>
            </div>
        );
    }

    if (suggestions.length === 0) return null;

    return (
        <div className="rounded-xl border border-border bg-bg-secondary p-6">
            <div className="flex items-center gap-2 mb-5">
                <Sparkles className="h-4 w-4 text-accent" />
                <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wide">
                    Suggerimenti AI
                </h3>
            </div>
            <div className="space-y-3">
                {suggestions.map((s, i) => (
                    <div
                        key={i}
                        className={`rounded-lg border p-4 transition-all ${priorityColors[s.priority]}`}
                    >
                        <div className="flex items-start gap-3">
                            <span className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${dotColors[s.priority]}`} />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-text-primary">{s.title}</p>
                                <p className="mt-1 text-xs text-text-secondary leading-relaxed">
                                    {s.description}
                                </p>
                                {s.action && (
                                    <Link
                                        href={s.action}
                                        className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] text-accent hover:underline"
                                    >
                                        {s.actionLabel || "Vai"}
                                        <ArrowRight className="h-3 w-3" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
