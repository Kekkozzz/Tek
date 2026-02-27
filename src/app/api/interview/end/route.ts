import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildReportPrompt } from "@/lib/prompts/report";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages }: { messages: { role: string; content: string }[] } =
      body;

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

    const result = await model.generateContent(reportPrompt);
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

    return Response.json(report);
  } catch (error) {
    console.error("Interview end API error:", error);
    return Response.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
