"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import ChatPanel, { type ChatMessage } from "@/components/interview/ChatPanel";
import CodeEditor from "@/components/interview/CodeEditor";
import type { InterviewType, Difficulty } from "@/types";

export default function InterviewSessionPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") as InterviewType) || "react";
  const difficulty =
    (searchParams.get("difficulty") as Difficulty) || "mid";
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [code, setCode] = useState<string>(
    "// Scrivi il tuo codice qui...\n"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [report, setReport] = useState<{
    score: number;
    strengths: string[];
    improvements: string[];
    summary: string;
  } | null>(null);
  const sessionCreatedRef = useRef(false);
  const startTimeRef = useRef<number>(Date.now());

  // Restore session from Supabase on mount
  useEffect(() => {
    if (!sessionId) return;
    async function restore() {
      try {
        const res = await fetch(`/api/sessions/${sessionId}`);
        if (!res.ok) {
          setIsRestoring(false);
          return;
        }
        const { session, messages: dbMessages } = await res.json();

        if (session && dbMessages?.length > 0) {
          const restored: ChatMessage[] = dbMessages.map((m: { id: string; role: string; content: string; created_at: string }) => ({
            id: m.id,
            role: m.role as ChatMessage["role"],
            content: m.content,
            created_at: m.created_at,
          }));
          setMessages(restored);
          setSessionStarted(true);
          sessionCreatedRef.current = true;
          startTimeRef.current = new Date(session.started_at).getTime();

          if (session.status === "completed" && session.score != null) {
            setSessionEnded(true);
            setReport({
              score: session.score,
              strengths: session.strengths || [],
              improvements: session.improvements || [],
              summary: session.summary || "",
            });
          }
        }
      } catch (e) {
        console.error("Failed to restore session:", e);
      } finally {
        setIsRestoring(false);
      }
    }
    restore();
  }, [sessionId]);

  // Create session in Supabase
  const ensureSessionCreated = useCallback(async () => {
    if (sessionCreatedRef.current) return;
    sessionCreatedRef.current = true;
    try {
      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: sessionId,
          type,
          difficulty,
        }),
      });
    } catch (e) {
      console.error("Failed to create session:", e);
      sessionCreatedRef.current = false;
    }
  }, [sessionId, type, difficulty]);

  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (isLoading) return;

      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: userMessage,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const response = await fetch("/api/interview/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            type,
            difficulty,
            currentCode: code,
            sessionId,
          }),
        });

        if (!response.ok) throw new Error("API error");

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "",
          created_at: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMsg]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            assistantMsg.content += chunk;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsg.id
                  ? { ...m, content: assistantMsg.content }
                  : m
              )
            );
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "system",
          content: "Errore di connessione. Riprova.",
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, code, type, difficulty, isLoading, sessionId]
  );

  const startSession = useCallback(async () => {
    setSessionStarted(true);
    setIsLoading(true);
    startTimeRef.current = Date.now();

    await ensureSessionCreated();

    try {
      const response = await fetch("/api/interview/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [],
          type,
          difficulty,
          currentCode: "",
          sessionId,
        }),
      });

      if (!response.ok) throw new Error("API error");

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
      };

      setMessages([assistantMsg]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          assistantMsg.content += chunk;
          setMessages([{ ...assistantMsg, content: assistantMsg.content }]);
        }
      }
    } catch (error) {
      console.error("Error starting session:", error);
    } finally {
      setIsLoading(false);
    }
  }, [type, difficulty, sessionId, ensureSessionCreated]);

  const endSession = useCallback(async () => {
    if (messages.length < 2) return;
    setSessionEnded(true);
    setIsLoading(true);

    const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);

    try {
      const response = await fetch("/api/interview/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          sessionId,
          durationSeconds,
        }),
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error("Error ending session:", error);
    } finally {
      setIsLoading(false);
    }
  }, [messages, sessionId]);

  // Loading state while restoring
  if (isRestoring) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <div className="text-center animate-fade-up">
            <div className="mx-auto mb-4 h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-sm text-text-secondary">Caricamento sessione...</p>
          </div>
        </main>
      </>
    );
  }

  // Pre-session start screen
  if (!sessionStarted) {
    return (
      <>
        <Navbar />
        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center">
          <div className="text-center animate-fade-up">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10 border border-accent/20">
              <span className="font-mono text-2xl text-accent">AI</span>
            </div>
            <h1 className="font-display text-3xl font-bold">
              Pronto per il colloquio?
            </h1>
            <p className="mt-3 text-text-secondary max-w-md mx-auto">
              Tipo:{" "}
              <span className="text-accent font-mono text-sm">{type}</span>
              {" · "}Difficolta:{" "}
              <span className="text-indigo font-mono text-sm">
                {difficulty}
              </span>
            </p>
            <button
              onClick={startSession}
              className="cursor-pointer mt-8 inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 font-mono text-sm font-semibold uppercase tracking-wide text-bg-primary transition-all hover:brightness-110 glow-border"
            >
              Inizia
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </main>
      </>
    );
  }

  // Post-session report screen
  if (sessionEnded && report) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-3xl px-6 py-12">
          <div className="animate-fade-up text-center mb-10">
            <span className="font-mono text-xs text-accent tracking-wide uppercase">
              Report Sessione
            </span>
            <h1 className="mt-2 font-display text-4xl font-bold">
              Risultato
            </h1>
          </div>

          {/* Score */}
          <div className="animate-fade-up stagger-1 flex justify-center mb-10">
            <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-accent/30 bg-accent/5">
              <span className="font-display text-5xl font-bold text-accent">
                {report.score}
              </span>
            </div>
          </div>

          {/* Summary */}
          <p className="animate-fade-up stagger-2 text-center text-text-secondary max-w-xl mx-auto mb-10">
            {report.summary}
          </p>

          {/* Strengths & Improvements */}
          <div className="animate-fade-up stagger-3 grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-6">
              <h3 className="font-mono text-xs text-accent uppercase tracking-wide mb-4">
                Punti di Forza
              </h3>
              <ul className="space-y-2">
                {report.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-text-primary"
                  >
                    <span className="text-accent mt-0.5">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-warning/20 bg-warning/5 p-6">
              <h3 className="font-mono text-xs text-warning uppercase tracking-wide mb-4">
                Da Migliorare
              </h3>
              <ul className="space-y-2">
                {report.improvements.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-text-primary"
                  >
                    <span className="text-warning mt-0.5">!</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="animate-fade-up stagger-4 mt-10 flex justify-center gap-4">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wide text-bg-primary transition-all hover:brightness-110 glow-border"
            >
              Dashboard
            </a>
            <a
              href="/history"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-secondary px-6 py-3 font-mono text-sm tracking-wide text-text-secondary transition-all hover:border-accent/30 hover:text-text-primary"
            >
              Cronologia
            </a>
          </div>
        </main>
      </>
    );
  }

  // Active interview session
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        {/* Chat Panel */}
        <div className="flex flex-col border-b md:border-b-0 md:border-r border-border bg-bg-secondary h-1/2 md:h-auto md:w-1/2">
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
            onEndSession={endSession}
          />
        </div>

        {/* Code Editor */}
        <div className="flex flex-col bg-bg-primary h-1/2 md:h-auto md:w-1/2">
          <CodeEditor code={code} onChange={setCode} />
        </div>
      </div>
    </div>
  );
}
