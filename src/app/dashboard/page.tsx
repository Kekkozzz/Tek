"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import WeakAreas from "@/components/dashboard/WeakAreas";
import ScoreChart from "@/components/dashboard/ScoreChart";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import SkillRadar from "@/components/dashboard/SkillRadar";
import { TECH_TRACKS, type TechTrack } from "@/types";
import { TRACK_PROMPT_DATA } from "@/lib/prompts/tracks-data";
import {
  Globe, Server, Smartphone, Cloud, BrainCircuit,
  Database, ShieldCheck, Puzzle, Network, Wrench,
  ChevronDown, BarChart3, Target, Flame,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TRACK_ICONS: Record<string, LucideIcon> = {
  Globe, Server, Smartphone, Cloud, BrainCircuit,
  Database, ShieldCheck, Puzzle, Network, Wrench,
};

interface Stats {
  total_sessions: number;
  avg_score: number | null;
  best_score: number | null;
  recent_sessions: {
    score: number | null;
    status: string;
    started_at: string;
    type: string;
  }[];
  by_type: Record<string, number>;
  daily_activity?: { date: string; count: number; avg_score: number }[];
}

interface TopicData {
  topic: string;
  category: string;
  mastery_level: number;
  sessions_count: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [topics, setTopics] = useState<TopicData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState<TechTrack | "all">("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const trackParam = selectedTrack !== "all" ? `?track=${selectedTrack}` : "";
        const [statsRes, topicsRes] = await Promise.all([
          fetch(`/api/stats${trackParam}`),
          fetch("/api/topics"),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (topicsRes.ok) setTopics(await topicsRes.json());
      } catch (e) {
        console.error("Failed to load dashboard:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [selectedTrack]);

  // Build radar data from topics, grouped by category
  const radarData = useMemo(() => {
    if (topics.length === 0) return [];
    // Group topics by category and compute average mastery
    const categoryMap = new Map<string, { total: number; count: number }>();
    for (const t of topics) {
      const cat = t.category;
      if (!categoryMap.has(cat)) categoryMap.set(cat, { total: 0, count: 0 });
      const entry = categoryMap.get(cat)!;
      entry.total += t.mastery_level;
      entry.count++;
    }
    return Array.from(categoryMap.entries())
      .map(([label, { total, count }]) => ({
        label,
        value: Math.round(total / count),
      }))
      .slice(0, 8); // Max 8 axes for readability
  }, [topics]);

  const hasData = stats && stats.total_sessions > 0;

  const trackLabel = selectedTrack === "all" ? "Tutte le Track" : TECH_TRACKS[selectedTrack].label;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="animate-fade-up flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="font-mono text-xs text-accent tracking-wide uppercase">
              Dashboard
            </span>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
              I tuoi progressi
            </h1>
            <p className="mt-3 text-text-secondary">
              Panoramica delle tue sessioni di colloquio e aree di miglioramento.
            </p>
          </div>

          {/* Track Filter */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-3 rounded-xl border border-border bg-bg-secondary px-5 py-3 transition-all hover:border-accent/30 hover:bg-bg-elevated"
            >
              <BarChart3 className="h-4 w-4 text-accent" />
              <span className="font-mono text-sm font-semibold text-text-primary">
                {trackLabel}
              </span>
              <ChevronDown className={`h-4 w-4 text-text-muted transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 w-64 max-h-80 overflow-y-auto rounded-xl border border-border bg-bg-secondary p-2 shadow-xl backdrop-blur-xl">
                <button
                  onClick={() => { setSelectedTrack("all"); setDropdownOpen(false); setLoading(true); }}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors ${selectedTrack === "all" ? "bg-accent/10 text-accent" : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                    }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="font-mono text-sm">Tutte le Track</span>
                </button>
                {(Object.entries(TECH_TRACKS) as [TechTrack, (typeof TECH_TRACKS)[TechTrack]][]).map(
                  ([key, config]) => {
                    const Icon = TRACK_ICONS[config.icon];
                    return (
                      <button
                        key={key}
                        onClick={() => { setSelectedTrack(key); setDropdownOpen(false); setLoading(true); }}
                        className={`flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left transition-colors ${selectedTrack === key ? "bg-accent/10 text-accent" : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
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

        {loading ? (
          <div className="mt-16 flex justify-center">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !hasData ? (
          <>
            {/* Placeholder stats */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Sessioni", value: "0", sub: "completate", icon: Target },
                { label: "Punteggio Medio", value: "--", sub: "su 100", icon: BarChart3 },
                { label: "Argomenti", value: "0", sub: "coperti", icon: Flame },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-bg-secondary p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-mono text-xs text-text-secondary uppercase tracking-wide">
                      {stat.label}
                    </p>
                    <stat.icon className="h-4 w-4 text-text-muted" />
                  </div>
                  <p className="mt-2 font-display text-4xl font-bold text-text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-text-muted">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Activity heatmap (empty but visible) */}
            <div className="mt-10">
              <ActivityHeatmap data={stats?.daily_activity ?? []} />
            </div>

            <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-16 text-center">
              <div className="h-16 w-16 rounded-full bg-bg-elevated flex items-center justify-center mb-4">
                <span className="font-mono text-2xl text-text-muted">?</span>
              </div>
              <h3 className="font-display text-lg font-semibold text-text-primary">
                Nessuna sessione ancora
              </h3>
              <p className="mt-2 max-w-sm text-sm text-text-secondary">
                Inizia la tua prima simulazione di colloquio per vedere i progressi
                qui.
              </p>
              <Link
                href="/interview"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide text-bg-primary transition-all hover:brightness-110 glow-border"
              >
                Inizia Intervista
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Real stats */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono text-xs text-text-secondary uppercase tracking-wide">
                    Sessioni
                  </p>
                  <Target className="h-4 w-4 text-text-muted" />
                </div>
                <p className="mt-2 font-display text-4xl font-bold text-text-primary">
                  {stats.total_sessions}
                </p>
                <p className="mt-1 text-sm text-text-muted">completate</p>
              </div>
              <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono text-xs text-text-secondary uppercase tracking-wide">
                    Punteggio Medio
                  </p>
                  <BarChart3 className="h-4 w-4 text-text-muted" />
                </div>
                <p className="mt-2 font-display text-4xl font-bold text-accent">
                  {stats.avg_score ?? "--"}
                </p>
                <p className="mt-1 text-sm text-text-muted">su 100</p>
              </div>
              <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono text-xs text-text-secondary uppercase tracking-wide">
                    Miglior Punteggio
                  </p>
                  <Flame className="h-4 w-4 text-text-muted" />
                </div>
                <p className="mt-2 font-display text-4xl font-bold text-indigo">
                  {stats.best_score ?? "--"}
                </p>
                <p className="mt-1 text-sm text-text-muted">record personale</p>
              </div>
            </div>

            {/* Activity Heatmap */}
            <div className="mt-10">
              <ActivityHeatmap data={stats.daily_activity ?? []} />
            </div>

            {/* Charts row */}
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <ScoreChart sessions={stats.recent_sessions} />
              {radarData.length >= 3 ? (
                <SkillRadar skills={radarData} />
              ) : (
                <WeakAreas topics={topics} />
              )}
            </div>

            {/* Weak Areas (if radar is showing) */}
            {radarData.length >= 3 && (
              <div className="mt-6">
                <WeakAreas topics={topics} />
              </div>
            )}

            {/* Quick action */}
            <div className="mt-10 flex justify-center">
              <Link
                href="/interview"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide text-bg-primary transition-all hover:brightness-110 glow-border"
              >
                Nuova Intervista
              </Link>
            </div>
          </>
        )}
      </main>
    </>
  );
}
