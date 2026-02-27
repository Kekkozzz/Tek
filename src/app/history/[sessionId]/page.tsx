"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import MessageBubble from "@/components/interview/MessageBubble";
import { INTERVIEW_TYPES } from "@/types";
import type { InterviewType, MessageRole } from "@/types";
import { FileDown } from "lucide-react";

interface SessionData {
  id: string;
  type: InterviewType;
  difficulty: string;
  status: string;
  score: number | null;
  strengths: string[] | null;
  improvements: string[] | null;
  summary: string | null;
  started_at: string;
  completed_at: string | null;
}

interface MessageData {
  id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

export default function SessionReviewPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [session, setSession] = useState<SessionData | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"chat" | "report">("report");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data.session);
          setMessages(data.messages);
        }
      } catch (e) {
        console.error("Failed to load session:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sessionId]);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("it-IT", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </main>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-text-primary">
              Sessione non trovata
            </h2>
            <Link href="/history" className="mt-4 inline-block font-mono text-sm text-accent hover:underline">
              ← Torna alla cronologia
            </Link>
          </div>
        </main>
      </>
    );
  }

  const typeConfig = INTERVIEW_TYPES[session.type] || { label: session.type, icon: "?" };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="animate-fade-up">
          <Link href="/history" className="font-mono text-xs text-text-muted hover:text-accent transition-colors">
            ← Cronologia
          </Link>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/10 border border-accent/20 font-mono text-lg font-bold text-accent">
              {typeConfig.icon}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">
                {typeConfig.label}
              </h1>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded bg-bg-elevated px-2 py-0.5 font-mono text-[10px] text-text-muted border border-border">
                  {session.difficulty}
                </span>
                <span className="font-mono text-xs text-text-muted">
                  {formatDate(session.started_at)}
                </span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-3">
              {session.score != null && (
                <a
                  href={`/api/report/${session.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-bg-elevated border border-border px-4 py-2.5 font-mono text-xs font-semibold text-text-secondary transition-all hover:border-accent/30 hover:text-accent"
                >
                  <FileDown className="h-4 w-4" />
                  Scarica Report
                </a>
              )}
              {session.status !== "completed" && (
                <Link
                  href={`/interview/${session.id}?type=${session.type}&difficulty=${session.difficulty}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-mono text-xs font-semibold uppercase tracking-wide text-bg-primary transition-all hover:brightness-110 glow-border"
                >
                  Riprendi Colloquio
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              )}
              {session.score != null && (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent/30 bg-accent/5">
                  <span className="font-display text-2xl font-bold text-accent">
                    {session.score}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 border-b border-border">
          <button
            onClick={() => setTab("report")}
            className={`cursor-pointer px-4 py-3 font-mono text-sm transition-all border-b-2 ${tab === "report"
                ? "text-accent border-accent"
                : "text-text-secondary border-transparent hover:text-text-primary"
              }`}
          >
            Report
          </button>
          <button
            onClick={() => setTab("chat")}
            className={`cursor-pointer px-4 py-3 font-mono text-sm transition-all border-b-2 ${tab === "chat"
                ? "text-accent border-accent"
                : "text-text-secondary border-transparent hover:text-text-primary"
              }`}
          >
            Conversazione ({messages.length})
          </button>
        </div>

        {/* Report Tab */}
        {tab === "report" && session.score != null && (
          <div className="mt-8 space-y-6 animate-fade-up">
            {session.summary && (
              <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wide mb-3">
                  Riepilogo
                </h3>
                <p className="text-sm text-text-primary leading-relaxed">
                  {session.summary}
                </p>
              </div>
            )}

            <div className="grid gap-6 sm:grid-cols-2">
              {session.strengths && session.strengths.length > 0 && (
                <div className="rounded-xl border border-accent/20 bg-accent/5 p-6">
                  <h3 className="font-mono text-xs text-accent uppercase tracking-wide mb-4">
                    Punti di Forza
                  </h3>
                  <ul className="space-y-2">
                    {session.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                        <span className="text-accent mt-0.5">+</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {session.improvements && session.improvements.length > 0 && (
                <div className="rounded-xl border border-warning/20 bg-warning/5 p-6">
                  <h3 className="font-mono text-xs text-warning uppercase tracking-wide mb-4">
                    Da Migliorare
                  </h3>
                  <ul className="space-y-2">
                    {session.improvements.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                        <span className="text-warning mt-0.5">!</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "report" && session.score == null && (
          <div className="mt-8 text-center py-12">
            <p className="text-text-muted font-mono text-sm">
              Nessun report disponibile per questa sessione.
            </p>
          </div>
        )}

        {/* Chat Tab */}
        {tab === "chat" && (
          <div className="mt-8 space-y-4 animate-fade-up">
            {messages.length === 0 ? (
              <p className="text-center text-text-muted font-mono text-sm py-12">
                Nessun messaggio registrato.
              </p>
            ) : (
              messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={{
                    id: msg.id,
                    role: msg.role,
                    content: msg.content,
                    created_at: msg.created_at,
                  }}
                />
              ))
            )}
          </div>
        )}
      </main>
    </>
  );
}
