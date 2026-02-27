import { getSession, getSessionMessages } from "@/lib/supabase/queries";
import { getAuthenticatedUser } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const user = await getAuthenticatedUser();
        if (!user) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { sessionId } = await params;
        const session = await getSession(sessionId);

        if (!session || session.user_id !== user.id) {
            return Response.json({ error: "Not found" }, { status: 404 });
        }

        if (session.status !== "completed" || session.score == null) {
            return Response.json({ error: "Report not available" }, { status: 400 });
        }

        const formatDate = (d: string) =>
            new Date(d).toLocaleDateString("it-IT", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });

        const strengths = Array.isArray(session.strengths) ? session.strengths : [];
        const improvements = Array.isArray(session.improvements) ? session.improvements : [];

        const html = `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <title>TekInterview Report - ${session.type}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      background: #0a0a0f; color: #e8e6e3;
      padding: 48px; max-width: 800px; margin: 0 auto;
    }
    @media print {
      body { background: white; color: #1a1a2e; padding: 24px; }
      .header { border-color: #e0e0e0 !important; }
      .section { border-color: #e0e0e0 !important; background: #f8f8f8 !important; }
      .accent { color: #00876b !important; }
      .warning-text { color: #b87a00 !important; }
      .muted { color: #666 !important; }
    }
    .header {
      border-bottom: 2px solid #1e1e30; padding-bottom: 32px; margin-bottom: 32px;
    }
    .logo { font-family: monospace; font-size: 14px; color: #00d4aa; letter-spacing: 2px; text-transform: uppercase; }
    h1 { font-size: 32px; font-weight: 700; margin-top: 12px; }
    .meta { font-family: monospace; font-size: 12px; color: #7a7a8e; margin-top: 8px; }
    .score-box {
      display: inline-flex; align-items: center; justify-content: center;
      width: 80px; height: 80px; border-radius: 50%;
      border: 3px solid #00d4aa40; background: #00d4aa10;
      font-size: 36px; font-weight: 700; color: #00d4aa;
      float: right; margin-top: -60px;
    }
    .section {
      border: 1px solid #1e1e30; border-radius: 12px;
      background: #12121a; padding: 24px; margin-bottom: 20px;
    }
    .section-title {
      font-family: monospace; font-size: 11px; color: #7a7a8e;
      text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 16px;
    }
    .accent { color: #00d4aa; }
    .warning-text { color: #f59e0b; }
    .muted { color: #7a7a8e; }
    .summary { font-size: 15px; line-height: 1.7; }
    ul { list-style: none; padding: 0; }
    li { font-size: 14px; line-height: 1.6; padding: 4px 0; padding-left: 20px; position: relative; }
    li::before { position: absolute; left: 0; }
    .strength li::before { content: '+'; color: #00d4aa; font-weight: 700; }
    .improve li::before { content: '!'; color: #f59e0b; font-weight: 700; }
    .footer {
      margin-top: 48px; padding-top: 24px; border-top: 1px solid #1e1e30;
      font-family: monospace; font-size: 11px; color: #4a4a5e; text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">TekInterview</div>
    <h1>Report Intervista</h1>
    <div class="meta">
      Tipo: ${session.type} · Difficoltà: ${session.difficulty} · Data: ${formatDate(session.started_at)}
      ${session.track ? ` · Track: ${session.track}` : ""}
    </div>
    <div class="score-box accent">${session.score}</div>
  </div>

  ${session.summary ? `
  <div class="section">
    <div class="section-title">Riepilogo</div>
    <p class="summary">${session.summary}</p>
  </div>
  ` : ""}

  ${strengths.length > 0 ? `
  <div class="section strength">
    <div class="section-title accent">Punti di Forza</div>
    <ul>${strengths.map((s: string) => `<li>${s}</li>`).join("")}</ul>
  </div>
  ` : ""}

  ${improvements.length > 0 ? `
  <div class="section improve">
    <div class="section-title warning-text">Aree di Miglioramento</div>
    <ul>${improvements.map((s: string) => `<li>${s}</li>`).join("")}</ul>
  </div>
  ` : ""}

  <div class="footer">
    Generato da TekInterview · ${formatDate(new Date().toISOString())} · tekinterview.it
  </div>
</body>
</html>`;

        return new Response(html, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Content-Disposition": `inline; filename="tekinterview-report-${sessionId.slice(0, 8)}.html"`,
            },
        });
    } catch (error) {
        console.error("PDF generation error:", error);
        return Response.json({ error: "Failed to generate report" }, { status: 500 });
    }
}
