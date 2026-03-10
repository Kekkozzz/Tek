import { createGeminiClient, getApiKeyFromRequest } from "@/lib/gemini";
import { buildReportPrompt } from "@/lib/prompts/report";
import { updateSession, upsertTopicMastery } from "@/lib/supabase/queries";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import type { TechTrack } from "@/types";

const REPORT_TIMEOUT_MS = 60_000;
const MAX_RETRIES = 2;
const RETRY_BASE_MS = 1_000;

export const maxDuration = 60;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label}: timeout after ${ms}ms`)), ms)
    ),
  ]);
}

function isTransient(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    if (msg.includes("timeout")) return true;
    if (msg.includes("429") || msg.includes("rate")) return true;
    if (msg.includes("503") || msg.includes("500")) return true;
    if (msg.includes("fetch failed") || msg.includes("econnreset") || msg.includes("network")) return true;
  }
  return false;
}

async function withRetry<T>(fn: () => Promise<T>, label: string): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < MAX_RETRIES && isTransient(err)) {
        const delay = RETRY_BASE_MS * Math.pow(2, attempt);
        console.warn(`${label}: attempt ${attempt + 1} failed, retrying in ${delay}ms...`, err);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

function classifyError(error: unknown): { status: number; message: string } {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("timeout")) {
      return { status: 504, message: "Timeout: la generazione del report ha impiegato troppo. Riprova." };
    }
    if (msg.includes("429") || msg.includes("rate")) {
      return { status: 429, message: "Troppi messaggi, riprova tra qualche secondo." };
    }
    if (msg.includes("safety") || msg.includes("block") || msg.includes("recitation")) {
      return { status: 400, message: "Il report non può essere generato per questo contenuto." };
    }
    if (msg.includes("api_key") || msg.includes("key_missing")) {
      return { status: 401, message: "Chiave API Gemini mancante o non valida." };
    }
  }
  return { status: 500, message: "Errore del server nella generazione del report. Riprova." };
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      messages,
      track,
      language,
      sessionId,
      durationSeconds,
    }: {
      messages: { role: string; content: string }[];
      track?: TechTrack;
      language?: string;
      sessionId?: string;
      durationSeconds?: number;
    } = body;

    // Filter out empty/system messages, then format for the report prompt
    const validMessages = messages.filter(
      (m) => m.content?.trim() && m.role !== "system"
    );
    const formattedMessages = validMessages
      .map((m) => {
        const label = m.role === "user" ? "CANDIDATO" : "INTERVISTATORE";
        return `${label}: ${m.content}`;
      })
      .join("\n\n");

    const reportPrompt = buildReportPrompt({
      messages: formattedMessages,
      track: track || "frontend",
      language: language || "react",
    });

    const userApiKey = getApiKeyFromRequest(request);
    const genAI = createGeminiClient(userApiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const result = await withRetry(
      () => withTimeout(
        model.generateContent(reportPrompt),
        REPORT_TIMEOUT_MS,
        "generateReport"
      ),
      "generateReport"
    );
    const responseText = result.response.text();

    // Parse JSON from the response (handle potential markdown code blocks)
    let report;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        report = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      // Fallback report
      report = {
        score: 50,
        strengths: ["Ha partecipato alla sessione"],
        improvements: ["Non e stato possibile generare un report dettagliato"],
        summary: "La sessione si e conclusa. Riprova per un report piu dettagliato.",
        topics_evaluated: [],
      };
    }

    // Save report to Supabase
    if (sessionId) {
      try {
        await updateSession(sessionId, {
          status: "completed",
          score: report.score,
          strengths: report.strengths,
          improvements: report.improvements,
          summary: report.summary,
          topics_evaluated: report.topics_evaluated || [],
          duration_seconds: durationSeconds,
          completed_at: new Date().toISOString(),
        });

        // Update topic mastery if we have topics and a userId
        if (user.id && report.topics_evaluated?.length) {
          try {
            // topics_evaluated can be objects {topic, category, score} or strings
            const topicScores = report.topics_evaluated.map((t: { topic?: string; name?: string; category?: string; score?: number } | string) => {
              if (typeof t === "string") {
                return { topic: t, category: "General", score: report.score };
              }
              const topicName = t.topic || t.name || "Unknown";
              return { topic: topicName, category: t.category || "General", score: t.score ?? report.score };
            }).filter((t: { topic: string }) => t.topic !== "Unknown");

            if (topicScores.length > 0) {
              await upsertTopicMastery(user.id, topicScores);
              console.log(`Saved ${topicScores.length} topic mastery entries for user ${user.id}`);
            }
          } catch (topicError) {
            console.error("Failed to save topic mastery:", topicError);
          }
        }
      } catch (e) {
        console.error("Failed to save report to Supabase:", e);
      }
    }

    return Response.json(report);
  } catch (error) {
    console.error("Interview end API error:", error);
    const { status, message } = classifyError(error);
    return Response.json({ error: message }, { status });
  }
}
