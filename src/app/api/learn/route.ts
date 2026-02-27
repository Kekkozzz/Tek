import { getAuthenticatedUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = createAdminClient();
        const track = request.nextUrl.searchParams.get("track");
        const topic = request.nextUrl.searchParams.get("topic");

        // Single article by track + topic
        if (track && topic) {
            const { data, error } = await supabase
                .from("knowledge_articles")
                .select("*")
                .eq("track", track)
                .eq("topic", topic)
                .single();

            if (error && error.code !== "PGRST116") throw error;
            return Response.json(data || null);
        }

        // List articles, optionally filtered by track
        let query = supabase
            .from("knowledge_articles")
            .select("id, track, category, topic, title, difficulty, created_at")
            .order("category")
            .order("topic");

        if (track) {
            query = query.eq("track", track);
        }

        const { data, error } = await query;
        if (error) throw error;

        return Response.json(data ?? []);
    } catch (error) {
        console.error("Learn API error:", error);
        return Response.json({ error: "Failed to fetch articles" }, { status: 500 });
    }
}
