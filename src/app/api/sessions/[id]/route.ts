import { getSession, getSessionMessages } from "@/lib/supabase/queries";
import { getAuthenticatedUser } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const [session, messages] = await Promise.all([
      getSession(id),
      getSessionMessages(id),
    ]);

    if (session.user_id !== user.id) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json({ session, messages });
  } catch (error) {
    console.error("Session detail error:", error);
    return Response.json({ error: "Session not found" }, { status: 404 });
  }
}
