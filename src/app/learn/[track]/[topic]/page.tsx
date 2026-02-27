"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { BookOpen, Lightbulb, MessageSquareQuote, ArrowLeft, Loader2 } from "lucide-react";

interface Article {
    id?: string;
    track: string;
    category: string;
    topic: string;
    title: string;
    content: string;
    difficulty: string;
    key_points: string[];
    common_questions: { question: string; hint: string }[];
}

export default function TopicArticlePage() {
    const params = useParams();
    const track = params.track as string;
    const topic = decodeURIComponent(params.topic as string);

    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                // Try to fetch existing article
                const res = await fetch(`/api/learn?track=${track}&topic=${encodeURIComponent(topic)}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        setArticle(data);
                        setLoading(false);
                        return;
                    }
                }

                // If not found, generate it
                setLoading(false);
                setGenerating(true);

                const genRes = await fetch("/api/learn/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ track, category: "", topic }),
                });

                if (genRes.ok) {
                    const data = await genRes.json();
                    setArticle(data);
                } else {
                    setError("Errore nella generazione dell'articolo.");
                }
            } catch {
                setError("Errore di rete.");
            } finally {
                setLoading(false);
                setGenerating(false);
            }
        }
        load();
    }, [track, topic]);

    const difficultyColors: Record<string, string> = {
        junior: "bg-accent/10 text-accent",
        mid: "bg-indigo/10 text-indigo",
        senior: "bg-warning/10 text-warning",
    };

    return (
        <>
            <Navbar />
            <main className="mx-auto max-w-4xl px-6 py-12">
                <div className="animate-fade-up">
                    <Link
                        href="/learn"
                        className="inline-flex items-center gap-2 font-mono text-xs text-text-muted hover:text-accent transition-colors"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Knowledge Base
                    </Link>
                </div>

                {(loading || generating) && (
                    <div className="mt-16 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="h-8 w-8 text-accent animate-spin" />
                        <p className="font-mono text-sm text-text-muted">
                            {generating ? "Generazione scheda con AI..." : "Caricamento..."}
                        </p>
                        {generating && (
                            <p className="text-xs text-text-muted max-w-sm text-center">
                                La prima volta che accedi a un argomento, il contenuto viene generato automaticamente. Potrebbe richiedere qualche secondo.
                            </p>
                        )}
                    </div>
                )}

                {error && (
                    <div className="mt-16 text-center">
                        <p className="text-text-secondary">{error}</p>
                    </div>
                )}

                {article && !loading && !generating && (
                    <article className="mt-8 animate-fade-up">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-8">
                            <div>
                                <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary">
                                    {article.title}
                                </h1>
                                <div className="mt-3 flex items-center gap-3">
                                    <span className="rounded bg-bg-elevated px-2.5 py-1 font-mono text-[10px] text-text-muted border border-border uppercase">
                                        {article.track}
                                    </span>
                                    {article.category && (
                                        <span className="rounded bg-bg-elevated px-2.5 py-1 font-mono text-[10px] text-text-muted border border-border">
                                            {article.category}
                                        </span>
                                    )}
                                    <span className={`rounded px-2.5 py-1 font-mono text-[10px] uppercase ${difficultyColors[article.difficulty] || "bg-bg-elevated text-text-muted"}`}>
                                        {article.difficulty}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Key Points */}
                        {article.key_points.length > 0 && (
                            <div className="mb-8 rounded-xl border border-accent/20 bg-accent/5 p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Lightbulb className="h-4 w-4 text-accent" />
                                    <h2 className="font-mono text-xs text-accent uppercase tracking-wide">
                                        Punti Chiave
                                    </h2>
                                </div>
                                <ul className="space-y-2">
                                    {article.key_points.map((point, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-text-primary">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent flex-shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Main Content (Markdown rendered as HTML) */}
                        <div className="rounded-xl border border-border bg-bg-secondary p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <BookOpen className="h-4 w-4 text-text-muted" />
                                <h2 className="font-mono text-xs text-text-secondary uppercase tracking-wide">
                                    Contenuto
                                </h2>
                            </div>
                            <div className="prose prose-invert prose-sm max-w-none
                prose-headings:font-display prose-headings:text-text-primary
                prose-p:text-text-secondary prose-p:leading-relaxed
                prose-code:text-accent prose-code:bg-bg-elevated prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                prose-pre:bg-bg-primary prose-pre:border prose-pre:border-border prose-pre:rounded-xl
                prose-strong:text-text-primary
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-li:text-text-secondary
              ">
                                <div dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }} />
                            </div>
                        </div>

                        {/* Common Interview Questions */}
                        {article.common_questions.length > 0 && (
                            <div className="mt-8 rounded-xl border border-border bg-bg-secondary p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <MessageSquareQuote className="h-4 w-4 text-indigo" />
                                    <h2 className="font-mono text-xs text-indigo uppercase tracking-wide">
                                        Domande Tipiche da Colloquio
                                    </h2>
                                </div>
                                <div className="space-y-4">
                                    {article.common_questions.map((q, i) => (
                                        <details key={i} className="group rounded-lg border border-border overflow-hidden">
                                            <summary className="flex cursor-pointer items-center gap-3 px-5 py-4 bg-bg-elevated hover:bg-bg-primary transition-colors">
                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo/10 font-mono text-xs text-indigo">
                                                    {i + 1}
                                                </span>
                                                <span className="text-sm font-medium text-text-primary">{q.question}</span>
                                            </summary>
                                            <div className="px-5 py-4 bg-bg-primary border-t border-border">
                                                <p className="text-sm text-text-secondary leading-relaxed">
                                                    <span className="font-mono text-[10px] text-accent uppercase tracking-wide mr-2">Suggerimento:</span>
                                                    {q.hint}
                                                </p>
                                            </div>
                                        </details>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="mt-10 flex justify-center">
                            <Link
                                href={`/interview?track=${track}`}
                                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-2.5 font-mono text-sm font-semibold uppercase tracking-wide text-bg-primary transition-all hover:brightness-110 glow-border"
                            >
                                Prova un Colloquio su {topic}
                            </Link>
                        </div>
                    </article>
                )}
            </main>
        </>
    );
}

/** Robust Markdown to HTML renderer with styled code blocks */
function renderMarkdown(md: string): string {
    // Normalize line endings
    let text = md.replace(/\r\n/g, "\n");

    // Phase 1: Extract code blocks into placeholders
    const codeBlocks: string[] = [];
    text = text.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, lang: string, code: string) => {
        const escapedCode = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .trimEnd();

        const langLabel = lang || "code";
        const html = `<div class="code-snapshot">
      <div class="code-snapshot-header">
        <div class="code-snapshot-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <span class="code-snapshot-lang">${langLabel}</span>
      </div>
      <pre class="code-snapshot-body"><code>${escapedCode}</code></pre>
    </div>`;

        codeBlocks.push(html);
        return `%%CODEBLOCK_${codeBlocks.length - 1}%%`;
    });

    // Phase 2: Inline markdown transformations
    text = text
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')
        // Headers
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        // Bold and italic
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Unordered lists
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        // Paragraphs (only non-tag, non-placeholder lines)
        .replace(/^(?!<[hluop]|<li|<div|%%CODEBLOCK)(.+)$/gm, '<p>$1</p>');

    // Wrap consecutive <li> in <ul>
    text = text.replace(/(<li>[\s\S]*?<\/li>\n?)+/g, '<ul>$&</ul>');

    // Phase 3: Reinsert code blocks
    text = text.replace(/(?:<p>)?%%CODEBLOCK_(\d+)%%(?:<\/p>)?/g, (_match, idx: string) => {
        return codeBlocks[parseInt(idx)];
    });

    return text;
}
