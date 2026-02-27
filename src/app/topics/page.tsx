"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";

interface TopicData {
  topic: string;
  category: string;
  mastery_level: number;
  sessions_count: number;
  last_practiced: string | null;
}

const TOPIC_CATEGORIES = [
  {
    name: "React",
    color: "accent",
    topics: [
      "Hooks",
      "State Management",
      "Component Patterns",
      "Performance",
      "Context API",
      "Server Components",
    ],
  },
  {
    name: "JavaScript",
    color: "indigo",
    topics: [
      "Closures",
      "Promises & Async",
      "Prototypes",
      "ES6+",
      "Event Loop",
      "Type Coercion",
    ],
  },
  {
    name: "Next.js",
    color: "warning",
    topics: [
      "App Router",
      "Server Actions",
      "Middleware",
      "SSR/SSG/ISR",
      "API Routes",
      "Caching",
    ],
  },
  {
    name: "CSS",
    color: "danger",
    topics: [
      "Flexbox",
      "Grid",
      "Responsive Design",
      "Animations",
      "Tailwind",
      "CSS-in-JS",
    ],
  },
  {
    name: "Testing",
    color: "accent",
    topics: [
      "Unit Testing",
      "React Testing Library",
      "E2E (Playwright)",
      "Mocking",
      "Test Patterns",
    ],
  },
];

function getMasteryColor(level: number): string {
  if (level >= 80) return "bg-accent";
  if (level >= 60) return "bg-indigo";
  if (level >= 40) return "bg-warning";
  if (level > 0) return "bg-danger";
  return "bg-text-muted";
}

function getMasteryLabel(level: number): string {
  if (level >= 80) return "Ottimo";
  if (level >= 60) return "Buono";
  if (level >= 40) return "Medio";
  if (level > 0) return "Base";
  return "--";
}

export default function TopicsPage() {
  const [topicData, setTopicData] = useState<TopicData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/topics");
        if (res.ok) setTopicData(await res.json());
      } catch (e) {
        console.error("Failed to load topics:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Build a lookup map from real data
  const masteryMap = new Map(topicData.map((t) => [t.topic, t]));

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="animate-fade-up">
          <span className="font-mono text-xs text-accent tracking-wide uppercase">
            Argomenti
          </span>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
            Mappa delle competenze
          </h1>
          <p className="mt-3 text-text-secondary">
            Traccia la tua padronanza su ogni argomento tecnico.
          </p>
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOPIC_CATEGORIES.map((category, i) => (
              <div
                key={category.name}
                className={`animate-fade-up rounded-xl border border-border bg-bg-secondary p-6 transition-all duration-300 hover:border-accent/20 hover:bg-bg-elevated`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <h2 className="font-display text-xl font-semibold text-text-primary mb-4">
                  {category.name}
                </h2>
                <div className="space-y-3">
                  {category.topics.map((topic) => {
                    const data = masteryMap.get(topic);
                    const level = data?.mastery_level ?? 0;
                    return (
                      <div key={topic} className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{topic}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-bg-elevated overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getMasteryColor(level)} transition-all duration-700`}
                              style={{ width: `${level}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs text-text-muted w-10 text-right">
                            {level > 0 ? getMasteryLabel(level) : "--"}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
