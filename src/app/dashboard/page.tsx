"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useUserId } from "@/hooks/useUserId";
import WeakAreas from "@/components/dashboard/WeakAreas";
import ScoreChart from "@/components/dashboard/ScoreChart";

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
}

export default function DashboardPage() {
  const userId = useUserId();
  const [stats, setStats] = useState<Stats | null>(null);
  const [topics, setTopics] = useState<{ topic: string; category: string; mastery_level: number; sessions_count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    async function load() {
      try {
        const [statsRes, topicsRes] = await Promise.all([
          fetch(`/api/stats?userId=${userId}`),
          fetch(`/api/topics?userId=${userId}`),
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
  }, [userId]);

  const hasData = stats && stats.total_sessions > 0;

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="animate-fade-up">
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

        {loading ? (
          <div className="mt-16 flex justify-center">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !hasData ? (
          <>
            {/* Placeholder stats */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { label: "Sessioni", value: "0", sub: "completate" },
                { label: "Punteggio Medio", value: "--", sub: "su 100" },
                { label: "Argomenti", value: "0", sub: "coperti" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-bg-secondary p-6"
                >
                  <p className="font-mono text-xs text-text-secondary uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-display text-4xl font-bold text-text-primary">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-text-muted">{stat.sub}</p>
                </div>
              ))}
            </div>
            <div className="mt-16 flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-16 text-center">
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
                <p className="font-mono text-xs text-text-secondary uppercase tracking-wide">
                  Sessioni
                </p>
                <p className="mt-2 font-display text-4xl font-bold text-text-primary">
                  {stats.total_sessions}
                </p>
                <p className="mt-1 text-sm text-text-muted">completate</p>
              </div>
              <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <p className="font-mono text-xs text-text-secondary uppercase tracking-wide">
                  Punteggio Medio
                </p>
                <p className="mt-2 font-display text-4xl font-bold text-accent">
                  {stats.avg_score ?? "--"}
                </p>
                <p className="mt-1 text-sm text-text-muted">su 100</p>
              </div>
              <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <p className="font-mono text-xs text-text-secondary uppercase tracking-wide">
                  Miglior Punteggio
                </p>
                <p className="mt-2 font-display text-4xl font-bold text-indigo">
                  {stats.best_score ?? "--"}
                </p>
                <p className="mt-1 text-sm text-text-muted">record personale</p>
              </div>
            </div>

            {/* Chart + Weak Areas */}
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <ScoreChart sessions={stats.recent_sessions} />
              <WeakAreas topics={topics} />
            </div>

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
