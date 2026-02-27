import { getApiKeyFromRequest, createGeminiClient } from "@/lib/gemini";

export async function POST(request: Request) {
    try {
        const { apiKey } = await request.json();

        if (!apiKey || typeof apiKey !== "string" || apiKey.trim().length < 10) {
            return Response.json(
                { valid: false, error: "Chiave non valida. Deve essere una stringa valida." },
                { status: 400 }
            );
        }

        // Test the key with a minimal request
        try {
            const genAI = createGeminiClient(apiKey.trim());
            const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
            const result = await model.generateContent("Rispondi solo: OK");
            const text = result.response.text();

            if (text) {
                return Response.json({ valid: true });
            }
            return Response.json(
                { valid: false, error: "La chiave non ha prodotto risposta." },
                { status: 400 }
            );
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : "Errore sconosciuto";
            const isAuthError = message.includes("API_KEY_INVALID") || message.includes("401") || message.includes("403");
            return Response.json(
                {
                    valid: false,
                    error: isAuthError
                        ? "Chiave API non valida. Verifica di averla copiata correttamente."
                        : `Errore durante la verifica: ${message}`,
                },
                { status: 400 }
            );
        }
    } catch {
        return Response.json(
            { valid: false, error: "Richiesta non valida." },
            { status: 400 }
        );
    }
}
