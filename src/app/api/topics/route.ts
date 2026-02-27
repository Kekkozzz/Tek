import { getUserTopics } from "@/lib/supabase/queries";
import { getAuthenticatedUser } from "@/lib/supabase/server";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const topics = await getUserTopics(user.id);
    return Response.json(topics);
  } catch (error) {
    console.error("Topics error:", error);
    return Response.json({ error: "Failed to fetch topics" }, { status: 500 });
  }
}
