"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useUserId } from "@/hooks/useUserId";
import { INTERVIEW_TYPES } from "@/types";
import type { InterviewType } from "@/types";

interface SessionItem {
  id: string;
  type: InterviewType;
  difficulty: string;
  status: string;
  score: number | null;
  summary: string | null;
  started_at: string;
  completed_at: string | null;
}

export default function HistoryPage() {
  const userId = useUserId();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed" | "abandoned">("all");

  useEffect(() => {
    if (!userId) return;
    async function load() {
      try {
        const statusParam = filter !== "all" ? `&status=${filter}` : "";
        const res = await fetch(`/api/sessions?userId=${userId}${statusParam}`);
        if (res.ok) setSessions(await res.json());
      } catch (e) {
        console.error("Failed to load history:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userId, filter]);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="animate-fade-up">
          <span className="font-mono text-xs text-accent tracking-wide uppercase">
            Cronologia
          </span>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
            Le tue sessioni
          </h1>
          <p className="mt-3 text-text-secondary">
            Rivedi le interviste passate e i feedback ricevuti.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-8 flex gap-2">
          {(["all", "active", "completed", "abandoned"] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setLoading(true); setFilter(f); }}
              className={`cursor-pointer px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wide transition-all ${
                filter === f
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-transparent"
              }`}
            >
              {f === "all" ? "Tutte" : f === "completed" ? "Completate" : f === "active" ? "Attive" : "Abbandonate"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-16 text-center">
            <div className="h-16 w-16 rounded-full bg-bg-elevated flex items-center justify-center mb-4">
              <span className="font-mono text-2xl text-text-muted">0</span>
            </div>
            <h3 className="font-display text-lg font-semibold text-text-primary">
              Nessuna sessione trovata
            </h3>
            <p className="mt-2 max-w-sm text-sm text-text-secondary">
              Completa la tua prima simulazione di colloquio per vederla qui.
            </p>
            <Link
              href="/interview"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide text-bg-primary transition-all hover:brightness-110 glow-border"
            >
              Inizia Intervista
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {sessions.map((session) => {
              const typeConfig = INTERVIEW_TYPES[session.type] || { label: session.type, icon: "?" };
              const isResumable = session.status !== "completed";
              const cardHref = isResumable
                ? `/interview/${session.id}?type=${session.type}&difficulty=${session.difficulty}`
                : `/history/${session.id}`;
              return (
                <div
                  key={session.id}
                  className="flex items-center gap-4 rounded-xl border border-border bg-bg-secondary p-5 transition-all duration-200 hover:border-accent/20 hover:bg-bg-elevated group"
                >
                  <Link href={cardHref} className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-bg-elevated border border-border font-mono text-sm font-bold text-text-muted group-hover:text-accent group-hover:border-accent/20 transition-colors">
                      {typeConfig.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display text-base font-semibold text-text-primary">
                          {typeConfig.label}
                        </h3>
                        <span className="rounded bg-bg-elevated px-2 py-0.5 font-mono text-[10px] text-text-muted border border-border">
                          {session.difficulty}
                        </span>
                        <span className={`rounded px-2 py-0.5 font-mono text-[10px] ${
                          session.status === "completed"
                            ? "bg-accent/10 text-accent border border-accent/20"
                            : session.status === "active"
                            ? "bg-indigo/10 text-indigo border border-indigo/20"
                            : "bg-warning/10 text-warning border border-warning/20"
                        }`}>
                          {session.status === "completed" ? "completata" : session.status === "active" ? "attiva" : "abbandonata"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-text-muted truncate">
                        {session.summary || "Nessun riepilogo disponibile"}
                      </p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-4 shrink-0">
                    {isResumable && (
                      <Link
                        href={`/interview/${session.id}?type=${session.type}&difficulty=${session.difficulty}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide text-bg-primary transition-all hover:brightness-110 glow-border"
                      >
                        Riprendi
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    )}
                    <div className="text-right">
                      {session.score != null && (
                        <p className="font-display text-2xl font-bold text-accent">
                          {session.score}
                        </p>
                      )}
                      <p className="font-mono text-[10px] text-text-muted">
                        {formatDate(session.started_at)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
