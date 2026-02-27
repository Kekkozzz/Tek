import { getUserStats } from "@/lib/supabase/queries";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const track = request.nextUrl.searchParams.get("track") || undefined;
    const stats = await getUserStats(user.id, track);
    return Response.json(stats);
  } catch (error) {
    console.error("Stats error:", error);
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
