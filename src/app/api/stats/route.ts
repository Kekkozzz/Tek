import { getUserStats } from "@/lib/supabase/queries";
import { getAuthenticatedUser } from "@/lib/supabase/server";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getUserStats(user.id);
    return Response.json(stats);
  } catch (error) {
    console.error("Stats error:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
