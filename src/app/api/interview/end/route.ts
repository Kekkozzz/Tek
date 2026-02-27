import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildReportPrompt } from "@/lib/prompts/report";
import { updateSession, upsertTopicMastery } from "@/lib/supabase/queries";
import { getAuthenticatedUser } from "@/lib/supabase/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const REPORT_TIMEOUT_MS = 60_000;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label}: timeout after ${ms}ms`)), ms)
    ),
  ]);
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
      sessionId,
      durationSeconds,
    }: {
      messages: { role: string; content: string }[];
      sessionId?: string;
      durationSeconds?: number;
    } = body;

    // Format messages for the report prompt
    const formattedMessages = messages
      .map((m) => {
        const label = m.role === "user" ? "CANDIDATO" : "INTERVISTATORE";
        return `${label}: ${m.content}`;
      })
      .join("\n\n");

    const reportPrompt = buildReportPrompt(formattedMessages);

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
    });

    const result = await withTimeout(
      model.generateContent(reportPrompt),
      REPORT_TIMEOUT_MS,
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
          // topics_evaluated can be objects {topic, category, score} or strings
          const topicScores = report.topics_evaluated.map((t: { topic: string; category: string; score: number } | string) => {
            if (typeof t === "string") {
              return { topic: t, category: "General", score: report.score };
            }
            return { topic: t.topic, category: t.category || "General", score: t.score ?? report.score };
          });
          await upsertTopicMastery(user.id, topicScores);
        }
      } catch (e) {
        console.error("Failed to save report to Supabase:", e);
      }
    }

    return Response.json(report);
  } catch (error) {
    console.error("Interview end API error:", error);
    return Response.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
