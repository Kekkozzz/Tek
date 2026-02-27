import { getUserTopics } from "@/lib/supabase/queries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "userId required" }, { status: 400 });
    }

    const topics = await getUserTopics(userId);
    return Response.json(topics);
  } catch (error) {
    console.error("Topics error:", error);
    return Response.json({ error: "Failed to fetch topics" }, { status: 500 });
  }
}
