"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { TECH_TRACKS, type TechTrack } from "@/types";
import { TRACK_PROMPT_DATA } from "@/lib/prompts/tracks-data";
import {
  Globe, Server, Smartphone, Cloud, BrainCircuit,
  Database, ShieldCheck, Puzzle, Network, Wrench,
  ChevronDown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TRACK_ICONS: Record<string, LucideIcon> = {
  Globe, Server, Smartphone, Cloud, BrainCircuit,
  Database, ShieldCheck, Puzzle, Network, Wrench,
};

interface TopicData {
  topic: string;
  category: string;
  mastery_level: number;
  sessions_count: number;
  last_practiced: string | null;
}

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
  const [error, setError] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<TechTrack>("frontend");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/topics");
        if (res.status === 401) {
          setError("login");
          return;
        }
        if (!res.ok) {
          setError("server");
          return;
        }
        const data = await res.json();
        setTopicData(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load topics:", e);
        setError("network");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Build dynamic categories from the selected track
  const categories = useMemo(() => {
    const trackData = TRACK_PROMPT_DATA[selectedTrack];
    if (!trackData) return [];
    return Object.entries(trackData.topics).map(([name, topics]) => ({
      name,
      topics,
    }));
  }, [selectedTrack]);

  // Build a lookup map from real data (case-insensitive matching)
  const masteryMap = useMemo(() => {
    const map = new Map<string, TopicData>();
    for (const t of topicData) {
      map.set(t.topic, t);
      map.set(t.topic.toLowerCase(), t);
    }
    return map;
  }, [topicData]);

  function findTopicData(topic: string): TopicData | undefined {
    return masteryMap.get(topic) || masteryMap.get(topic.toLowerCase());
  }

  const trackConfig = TECH_TRACKS[selectedTrack];
  const TrackIcon = TRACK_ICONS[trackConfig.icon];

  // Cycle through some colors for categories
  const categoryColors = ["accent", "indigo", "warning", "danger", "accent", "indigo", "warning", "danger"];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="animate-fade-up flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 relative z-30">
          <div>
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
              <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-xl border border-border bg-bg-secondary p-2 shadow-xl backdrop-blur-xl">
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

        {loading ? (
          <div className="mt-16 flex justify-center">
            <div className="h-8 w-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error === "login" ? (
          <div className="mt-16 text-center">
            <p className="text-text-secondary mb-4">Effettua il login per vedere i tuoi progressi.</p>
            <Link href="/login" className="inline-flex items-center gap-2 rounded-lg bg-accent/10 border border-accent/20 px-6 py-3 font-mono text-sm text-accent hover:bg-accent/20 transition-colors">
              Accedi
            </Link>
          </div>
        ) : error ? (
          <div className="mt-16 text-center">
            <p className="text-text-secondary">Errore nel caricamento dei dati. Riprova più tardi.</p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 relative z-0">
            {categories.map((category, i) => (
              <div
                key={`${selectedTrack}-${category.name}`}
                className="animate-fade-up rounded-xl border border-border bg-bg-secondary p-6 transition-all duration-300 hover:border-accent/20 hover:bg-bg-elevated"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <h2 className="font-display text-xl font-semibold text-text-primary mb-4">
                  {category.name}
                </h2>
                <div className="space-y-3">
                  {category.topics.map((topic) => {
                    const data = findTopicData(topic);
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
