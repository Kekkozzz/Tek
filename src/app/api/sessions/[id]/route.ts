import { getSession, getSessionMessages } from "@/lib/supabase/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [session, messages] = await Promise.all([
      getSession(id),
      getSessionMessages(id),
    ]);

    return Response.json({ session, messages });
  } catch (error) {
    console.error("Session detail error:", error);
    return Response.json({ error: "Session not found" }, { status: 404 });
  }
}
