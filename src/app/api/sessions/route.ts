import { getUserSessions, createSession } from "@/lib/supabase/queries";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import type { InterviewType, Difficulty } from "@/types";

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") as "active" | "completed" | "abandoned" | null;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const sessions = await getUserSessions(user.id, {
      status: status || undefined,
      limit,
      offset,
    });

    return Response.json(sessions);
  } catch (error) {
    console.error("Sessions GET error:", error);
    return Response.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, type, difficulty }: {
      id: string;
      type: InterviewType;
      difficulty: Difficulty;
    } = body;

    const session = await createSession({ id, user_id: user.id, type, difficulty });
    return Response.json(session);
  } catch (error) {
    console.error("Sessions POST error:", error);
    return Response.json({ error: "Failed to create session" }, { status: 500 });
  }
}
