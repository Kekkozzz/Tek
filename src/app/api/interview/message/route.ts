import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildInterviewerPrompt } from "@/lib/prompts/interviewer";
import type { InterviewType, Difficulty } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      messages,
      type,
      difficulty,
      currentCode,
    }: {
      messages: { role: string; content: string }[];
      type: InterviewType;
      difficulty: Difficulty;
      currentCode: string;
    } = body;

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
      const result = await model.generateContentStream(
        "Inizia il colloquio tecnico. Presentati brevemente e poni la prima domanda."
      );

      const stream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) {
                controller.enqueue(new TextEncoder().encode(text));
              }
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
    // Prepend the initial prompt that started the interview.
    const fullHistory = [
      { role: "user" as const, parts: [{ text: "Inizia il colloquio tecnico. Presentati brevemente e poni la prima domanda." }] },
      ...geminiHistory.slice(0, -1),
    ];

    const chat = model.startChat({
      history: fullHistory,
    });

    const lastMessage = geminiHistory[geminiHistory.length - 1];
    const result = await chat.sendMessageStream(lastMessage.parts[0].text);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(new TextEncoder().encode(text));
            }
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
