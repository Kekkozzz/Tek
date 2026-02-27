import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildInterviewerPrompt } from "@/lib/prompts/interviewer";
import { saveMessage } from "@/lib/supabase/queries";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import type { InterviewType, Difficulty } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const GEMINI_TIMEOUT_MS = 30_000;

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

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      messages,
      type,
      difficulty,
      currentCode,
      sessionId,
    }: {
      messages: { role: string; content: string }[];
      type: InterviewType;
      difficulty: Difficulty;
      currentCode: string;
      sessionId?: string;
    } = body;

    // Save user message to Supabase (fire-and-forget to not block AI response)
    if (sessionId && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === "user") {
        saveMessage({
          session_id: sessionId,
          role: "user",
          content: lastMsg.content,
          code_snapshot: currentCode || undefined,
        }).catch((e) => console.error("Failed to save user message:", e));
      }
    }

    const systemPrompt = buildInterviewerPrompt({
      type,
      difficulty,
      currentCode: currentCode || undefined,
    });

    const model = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview",
      systemInstruction: systemPrompt,
    });

    // Convert messages to Gemini format
    const geminiHistory = messages.map((msg) => ({
      role: msg.role === "assistant" ? ("model" as const) : ("user" as const),
      parts: [{ text: msg.content }],
    }));

    // If no messages, start the interview
    if (geminiHistory.length === 0) {
      const result = await withTimeout(
        model.generateContentStream(
          "Inizia il colloquio tecnico. Presentati brevemente e poni la prima domanda."
        ),
        GEMINI_TIMEOUT_MS,
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
            // Save assistant message to Supabase
            if (sessionId && fullResponse) {
              saveMessage({
                session_id: sessionId,
                role: "assistant",
                content: fullResponse,
              }).catch((e) => console.error("Failed to save assistant message:", e));
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
    const result = await withTimeout(
      chat.sendMessageStream(lastMessage.parts[0].text),
      GEMINI_TIMEOUT_MS,
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
          // Save assistant message to Supabase
          if (sessionId && fullResponse) {
            saveMessage({
              session_id: sessionId,
              role: "assistant",
              content: fullResponse,
            }).catch((e) => console.error("Failed to save assistant message:", e));
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
    return Response.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
