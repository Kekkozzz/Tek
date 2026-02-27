import { getAuthenticatedUser } from "@/lib/supabase/server";
import { getUserStats } from "@/lib/supabase/queries";
import { geminiFlash } from "@/lib/gemini";

export async function GET() {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const stats = await getUserStats(user.id);

        if (stats.total_sessions === 0) {
            return Response.json({
                suggestions: [
                    {
                        title: "Inizia il tuo primo colloquio",
                        description: "Fai una sessione di prova per cominciare a raccogliere dati sui tuoi progressi.",
                        action: "/interview",
                        actionLabel: "Inizia ora",
                        priority: "high",
                    },
                ],
            });
        }

        // Build context for AI
        const context = `L'utente ha completato ${stats.total_sessions} sessioni.
Punteggio medio: ${stats.avg_score ?? "N/A"}/100.
Miglior punteggio: ${stats.best_score ?? "N/A"}/100.
Tipi di intervista usati: ${Object.entries(stats.by_type).map(([t, c]) => `${t}: ${c}`).join(", ")}.`;

        const prompt = `Sei un coach per colloqui tecnici. Analizza questi dati di un candidato e suggerisci 3 azioni concrete per migliorare.

${context}

Rispondi ESCLUSIVAMENTE con un JSON array (senza markdown, senza backtick):
[
  {"title": "Titolo breve", "description": "Cosa fare e perché (max 2 frasi)", "priority": "high|medium|low"},
  ...
]

Rispondi in ITALIANO. Sii specifico e actionable.`;

        const result = await geminiFlash.generateContent(prompt);
        const text = result.response.text().trim();

        let suggestions;
        try {
            const clean = text.replace(/^```json?\n?/i, "").replace(/\n?```$/i, "").trim();
            suggestions = JSON.parse(clean);
        } catch {
            suggestions = [
                {
                    title: "Continua a esercitarti",
                    description: "Completa più sessioni per ottenere insights personalizzati.",
                    priority: "medium",
                },
            ];
        }

        return Response.json({ suggestions });
    } catch (error) {
        console.error("Suggestions error:", error);
        return Response.json({ error: "Failed to generate suggestions" }, { status: 500 });
    }
}
