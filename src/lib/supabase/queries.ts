import { createAdminClient } from "./server";
import type {
  InterviewType,
  Difficulty,
  SessionStatus,
} from "@/types";

// ── Sessions ──

export async function createSession(data: {
  id: string;
  user_id: string;
  type: InterviewType;
  difficulty: Difficulty;
}) {
  const supabase = createAdminClient();
  const { data: session, error } = await supabase
    .from("interview_sessions")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return session;
}

export async function getSession(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_sessions")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateSession(
  id: string,
  updates: {
    status?: SessionStatus;
    score?: number;
    strengths?: string[];
    improvements?: string[];
    summary?: string;
    topics_evaluated?: string[];
    duration_seconds?: number;
    completed_at?: string;
  }
) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("interview_sessions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getUserSessions(
  userId: string,
  options?: { status?: SessionStatus; limit?: number; offset?: number }
) {
  const supabase = createAdminClient();
  let query = supabase
    .from("interview_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (options?.status) query = query.eq("status", options.status);
  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 10) - 1);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

// ── Messages ──

export async function saveMessage(data: {
  session_id: string;
  role: string;
  content: string;
  code_snapshot?: string;
}) {
  const supabase = createAdminClient();
  const { data: message, error } = await supabase
    .from("messages")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return message;
}

export async function getSessionMessages(sessionId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// ── Stats ──

export async function getUserStats(userId: string) {
  const supabase = createAdminClient();
  const { data: sessions, error } = await supabase
    .from("interview_sessions")
    .select("score, status, started_at, type")
    .eq("user_id", userId);
  if (error) throw error;

  const completed = (sessions ?? []).filter((s) => s.status === "completed");
  const scores = completed.filter((s) => s.score != null).map((s) => s.score as number);

  return {
    total_sessions: completed.length,
    avg_score: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
    best_score: scores.length ? Math.max(...scores) : null,
    recent_sessions: completed.slice(0, 10),
    by_type: completed.reduce(
      (acc, s) => {
        acc[s.type] = (acc[s.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
  };
}

// ── Topic Mastery ──

export async function getUserTopics(userId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("topic_mastery")
    .select("*")
    .eq("user_id", userId)
    .order("category", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

const VALID_TOPICS: Record<string, string> = {
  "hooks": "Hooks", "state management": "State Management", "component patterns": "Component Patterns",
  "performance": "Performance", "context api": "Context API", "server components": "Server Components",
  "closures": "Closures", "promises & async": "Promises & Async", "promises and async": "Promises & Async",
  "prototypes": "Prototypes", "es6+": "ES6+", "es6": "ES6+", "event loop": "Event Loop",
  "type coercion": "Type Coercion", "app router": "App Router", "server actions": "Server Actions",
  "middleware": "Middleware", "ssr/ssg/isr": "SSR/SSG/ISR", "ssr": "SSR/SSG/ISR", "ssg": "SSR/SSG/ISR",
  "api routes": "API Routes", "caching": "Caching", "flexbox": "Flexbox", "grid": "Grid",
  "responsive design": "Responsive Design", "animations": "Animations", "tailwind": "Tailwind",
  "css-in-js": "CSS-in-JS", "unit testing": "Unit Testing", "react testing library": "React Testing Library",
  "e2e (playwright)": "E2E (Playwright)", "e2e": "E2E (Playwright)", "playwright": "E2E (Playwright)",
  "mocking": "Mocking", "test patterns": "Test Patterns",
};

function normalizeTopicName(name: string): string {
  return VALID_TOPICS[name.toLowerCase()] || name;
}

export async function upsertTopicMastery(
  userId: string,
  topics: { topic: string; category: string; score: number }[]
) {
  const supabase = createAdminClient();
  for (const t of topics) {
    const topicName = normalizeTopicName(t.topic);
    const { data: existing } = await supabase
      .from("topic_mastery")
      .select("*")
      .eq("user_id", userId)
      .eq("topic", topicName)
      .single();

    if (existing) {
      const newLevel = Math.round(
        existing.mastery_level * 0.7 + t.score * 0.3
      );
      await supabase
        .from("topic_mastery")
        .update({
          mastery_level: Math.min(100, Math.max(0, newLevel)),
          sessions_count: existing.sessions_count + 1,
          last_practiced: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("topic_mastery").insert({
        user_id: userId,
        topic: topicName,
        category: t.category,
        mastery_level: Math.min(100, Math.max(0, t.score)),
        sessions_count: 1,
        last_practiced: new Date().toISOString(),
      });
    }
  }
}
