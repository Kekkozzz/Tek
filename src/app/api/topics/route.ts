import { getUserTopics, getUserSessions } from "@/lib/supabase/queries";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import type { SessionStatus } from "@/types";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let topics: Awaited<ReturnType<typeof getUserTopics>> = [];
    try {
      topics = await getUserTopics(user.id);
    } catch (e) {
      console.error("getUserTopics failed (table may not exist):", e);
    }

    // If no topic_mastery rows yet, reconstruct from completed sessions
    if (!topics || topics.length === 0) {
      topics = await reconstructTopicsFromSessions(user.id);
    }

    return Response.json(topics);
  } catch (error) {
    console.error("Topics error:", error);
    return Response.json({ error: "Failed to fetch topics" }, { status: 500 });
  }
}

async function reconstructTopicsFromSessions(userId: string) {
  try {
    const sessions = await getUserSessions(userId, { status: "completed" as SessionStatus });
    const topicMap = new Map<string, { topic: string; category: string; mastery_level: number; sessions_count: number; last_practiced: string | null }>();

    for (const session of sessions) {
      if (!session.topics_evaluated || !Array.isArray(session.topics_evaluated)) continue;
      for (const t of session.topics_evaluated) {
        const topic = typeof t === "string" ? t : t?.topic;
        const category = typeof t === "string" ? "General" : (t?.category || "General");
        const score = typeof t === "string" ? (session.score ?? 50) : (t?.score ?? session.score ?? 50);
        if (!topic) continue;

        const key = topic.toLowerCase();
        const existing = topicMap.get(key);
        if (existing) {
          existing.mastery_level = Math.round(existing.mastery_level * 0.7 + score * 0.3);
          existing.sessions_count += 1;
          existing.last_practiced = session.completed_at || session.started_at;
        } else {
          topicMap.set(key, {
            topic,
            category,
            mastery_level: score,
            sessions_count: 1,
            last_practiced: session.completed_at || session.started_at,
          });
        }
      }
    }

    return Array.from(topicMap.values());
  } catch (e) {
    console.error("Failed to reconstruct topics from sessions:", e);
    return [];
  }
}
