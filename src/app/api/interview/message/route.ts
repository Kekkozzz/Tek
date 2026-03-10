import { createGeminiClient, getApiKeyFromRequest } from "@/lib/gemini";
import { buildInterviewerPrompt } from "@/lib/prompts/interviewer";
import { saveMessage } from "@/lib/supabase/queries";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import type { InterviewType, Difficulty, TechTrack } from "@/types";

export const maxDuration = 60;

const GEMINI_TIMEOUT_MS = 45_000;
const MAX_RETRIES = 2;
const RETRY_BASE_MS = 1_000;

type GeminiMessage = { role: "user" | "model"; parts: { text: string }[] };

/** Merge consecutive messages with the same role (Gemini requires strict user/model alternation) */
function mergeConsecutiveRoles(history: GeminiMessage[]): GeminiMessage[] {
  return history.reduce<GeminiMessage[]>((acc, msg) => {
    const last = acc[acc.length - 1];
    if (last && last.role === msg.role) {
      last.parts[0].text += "\n\n" + msg.parts[0].text;
    } else {
      acc.push({ role: msg.role, parts: [{ text: msg.parts[0].text }] });
    }
    return acc;
  }, []);
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label}: timeout after ${ms}ms`)), ms)
    ),
  ]);
}

/** Check if an error is transient and worth retrying */
function isTransient(err: unknown): boolean {
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    // Retry on timeouts, rate limits, server errors, network failures
    if (msg.includes("timeout")) return true;
    if (msg.includes("429") || msg.includes("rate")) return true;
    if (msg.includes("503") || msg.includes("500")) return true;
    if (msg.includes("fetch failed") || msg.includes("econnreset") || msg.includes("network")) return true;
  }
  return false;
}

/** Retry a function on transient failures with exponential backoff */
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

/** Classify an error into a user-facing response */
function classifyError(error: unknown): { status: number; message: string } {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("timeout")) {
      return { status: 504, message: "Timeout: l'AI non ha risposto in tempo. Riprova." };
    }
    if (msg.includes("429") || msg.includes("rate")) {
      return { status: 429, message: "Troppi messaggi, riprova tra qualche secondo." };
    }
    if (msg.includes("safety") || msg.includes("block") || msg.includes("recitation")) {
      return { status: 400, message: "Il messaggio non può essere elaborato dall'AI." };
    }
    if (msg.includes("api_key") || msg.includes("key_missing")) {
      return { status: 401, message: "Chiave API Gemini mancante o non valida." };
    }
  }
  return { status: 500, message: "Errore del server, riprova." };
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
      type,
      difficulty,
      language,
      currentCode,
      sessionId,
    }: {
      messages: { role: string; content: string }[];
      track: TechTrack;
      type: InterviewType;
      difficulty: Difficulty;
      language: string;
      currentCode: string;
      sessionId?: string;
    } = body;

    // Save user message to Supabase securely
    if (sessionId && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "user") {
        try {
          await saveMessage({
            session_id: sessionId,
            role: "user",
            content: lastMsg.content,
            code_snapshot: currentCode || undefined,
          });
        } catch (e) {
          console.error("Failed to save user message:", e);
        }
      }
    }

    const userApiKey = getApiKeyFromRequest(request);

    const systemPrompt = buildInterviewerPrompt({
      track: track || "frontend",
      type,
      difficulty,
      language: language || "react",
      currentCode: currentCode || undefined,
    });

    const genAI = createGeminiClient(userApiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: systemPrompt,
    });

    // Filter out invalid messages (empty content, system role) before sending to Gemini
    const validMessages = messages.filter(
      (msg) => msg.content?.trim() && msg.role !== "system"
    );

    // Convert messages to Gemini format
    const geminiHistory = validMessages.map((msg) => ({
      role: msg.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: msg.content }],
    }));

    // If no messages, start the interview
    if (geminiHistory.length === 0) {
      const result = await withRetry(
        () => withTimeout(
          model.generateContentStream(
            "Inizia il colloquio tecnico. Presentati brevemente e poni la prima domanda."
          ),
          GEMINI_TIMEOUT_MS,
          "generateContentStream"
        ),
        "generateContentStream"
      );

      let fullResponse = "";
      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) {
                fullResponse += text;
                controller.enqueue(new TextEncoder().encode(text));
              }
            }
            if (sessionId && fullResponse) {
              try { await saveMessage({ session_id: sessionId, role: "assistant", content: fullResponse }); }
              catch (e) { console.error("Failed to save assistant message:", e); }
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // Gemini requires history to start with a "user" role message.
    // Prepend the initial prompt that started the interview, then merge
    // consecutive same-role messages (e.g. after page refresh + re-send).
    const rawHistory: GeminiMessage[] = [
      { role: "user", parts: [{ text: "Inizia il colloquio tecnico. Presentati brevemente e poni la prima domanda." }] },
      ...geminiHistory.slice(0, -1),
    ];
    const fullHistory = mergeConsecutiveRoles(rawHistory);

    const chat = model.startChat({
      history: fullHistory,
    });

    const lastMessage = geminiHistory[geminiHistory.length - 1];
    const result = await withRetry(
      () => withTimeout(
        chat.sendMessageStream(lastMessage.parts[0].text),
        GEMINI_TIMEOUT_MS,
        "sendMessageStream"
      ),
      "sendMessageStream"
    );

    let fullResponse = "";
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              fullResponse += text;
              controller.enqueue(new TextEncoder().encode(text));
            }
          }
          if (sessionId && fullResponse) {
            try { await saveMessage({ session_id: sessionId, role: "assistant", content: fullResponse }); }
            catch (e) { console.error("Failed to save assistant message:", e); }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Interview message API error:", error);
    const { status, message } = classifyError(error);
    return Response.json({ error: message }, { status });
  }
}
