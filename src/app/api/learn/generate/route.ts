import { getAuthenticatedUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { buildKnowledgePrompt } from "@/lib/prompts/knowledge";
import { getGeminiModel, getApiKeyFromRequest } from "@/lib/gemini";
import { NextRequest } from "next/server";
import type { TechTrack } from "@/types";
import { TRACK_PROMPT_DATA } from "@/lib/prompts/tracks-data";

export async function POST(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { track, category, topic } = await request.json();

        if (!track || !topic) {
            return Response.json({ error: "Missing track or topic" }, { status: 400 });
        }

        // Validate track exists
        const trackData = TRACK_PROMPT_DATA[track as TechTrack];
        if (!trackData) {
            return Response.json({ error: "Invalid track" }, { status: 400 });
        }

        const supabase = createAdminClient();

        // Check if article already exists
        const { data: existing } = await supabase
            .from("knowledge_articles")
            .select("*")
            .eq("track", track)
            .eq("topic", topic)
            .single();

        if (existing) {
            return Response.json(existing);
        }

        // Find the real category for this topic
        let resolvedCategory = category || "";
        if (!resolvedCategory) {
            for (const [cat, topics] of Object.entries(trackData.topics)) {
                if (topics.includes(topic)) {
                    resolvedCategory = cat;
                    break;
                }
            }
        }

        // Generate with Gemini
        const prompt = buildKnowledgePrompt(track as TechTrack, resolvedCategory, topic);

        const userApiKey = getApiKeyFromRequest(request);
        const model = getGeminiModel(userApiKey);
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        // Parse the JSON response
        let parsed;
        try {
            const clean = text.replace(/^```json?\n?/i, "").replace(/\n?```$/i, "").trim();
            parsed = JSON.parse(clean);
        } catch {
            console.error("Failed to parse AI response:", text.substring(0, 200));
            return Response.json({ error: "Failed to parse AI response" }, { status: 500 });
        }

        // Store in DB
        const article = {
            track,
            category: resolvedCategory,
            topic,
            title: parsed.title || topic,
            content: parsed.content || "",
            difficulty: parsed.difficulty || "mid",
            key_points: parsed.key_points || [],
            common_questions: parsed.common_questions || [],
        };

        const { data: saved, error } = await supabase
            .from("knowledge_articles")
            .insert(article)
            .select()
            .single();

        if (error) {
            console.error("DB save error:", error);
            return Response.json(article);
        }

        return Response.json(saved);
    } catch (error) {
        console.error("Knowledge generation error:", error);
        return Response.json({ error: "Failed to generate article" }, { status: 500 });
    }
}
