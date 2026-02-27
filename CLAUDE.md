# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint (flat config, ESLint 9+)
```

No test runner is configured.

## Architecture

TekInterview is an AI-powered technical interview practice platform built with Next.js 16 (App Router), TypeScript, and Tailwind CSS v4.

### Tech Stack
- **AI:** Google Gemini (`gemini-3-flash-preview`) via `@google/generative-ai` — streaming chat, one-shot report generation, knowledge article generation
- **Database:** Supabase (PostgreSQL) — `interview_sessions`, `knowledge_articles` tables with RLS
- **Auth:** Supabase Auth (GitHub OAuth)
- **Code Editor:** Monaco Editor (`@monaco-editor/react`) — dynamic language per track
- **Code Execution:** Piston API (optional, gated by `NEXT_PUBLIC_CODE_EXECUTION_ENABLED`)
- **Charts:** Recharts (score trends, skill radar, activity heatmap)

### Tech Tracks
The platform supports **10 tech tracks** defined in `src/types/index.ts` (`TECH_TRACKS`) and `src/lib/prompts/tracks-data.ts` (`TRACK_PROMPT_DATA`). Each track has:
- Dedicated AI system prompts and evaluation criteria
- Topic categories with specific subtopics
- Monaco Editor language configuration
- Color and icon for UI

Tracks: `frontend`, `backend`, `mobile`, `devops`, `data`, `database`, `security`, `dsa`, `system_design`, `low_level`.

### App Router Structure
- `/` — Landing page (typing animation, track grid, feature cards)
- `/onboarding` — 3-step personalization flow (goal → track → experience)
- `/interview` — Setup: select track + type + difficulty, generates UUID session
- `/interview/[sessionId]` — Active session: pre-session → active (chat + code editor split) → report
- `/learn` — Knowledge Base index with track filter
- `/learn/[track]/[topic]` — AI-generated article with key points, code snapshots, interview questions
- `/dashboard` — Stats, heatmap (6 months), score chart, skill radar, AI suggestions
- `/history` — Past sessions list
- `/history/[sessionId]` — Session detail with report + PDF export
- `/topics` — Skills mastery grid by track

### API Routes
- `POST /api/interview/message` — Streams AI interviewer responses via `ReadableStream`
- `POST /api/interview/end` — Generates JSON evaluation report (score, strengths, improvements, topics)
- `GET /api/learn` — List/fetch knowledge articles (filtered by track/topic)
- `POST /api/learn/generate` — Generate knowledge article on-demand via Gemini, caches in DB
- `GET /api/stats` — User statistics (sessions, scores, daily activity, topic mastery)
- `GET /api/stats/suggestions` — AI-generated coaching suggestions based on user history
- `POST /api/code/execute` — Execute code via Piston API (requires `NEXT_PUBLIC_CODE_EXECUTION_ENABLED=true`)
- `GET /api/report/[sessionId]` — Generate PDF report for a session

### Key Patterns
- **Client vs Server:** Most pages use `"use client"`. Root layout and API routes are server-side.
- **State:** React hooks only (useState, useCallback, useEffect). No external state library.
- **AI Prompts:** Dynamic system prompts in `src/lib/prompts/` — configurable by track, interview type, difficulty.
- **Streaming:** Chat API returns chunked text via ReadableStream, consumed with `fetch().body.getReader()`.
- **Types:** All domain types in `src/types/index.ts` — `TechTrack`, `InterviewType`, `Difficulty`, `SessionStatus`, `Message`, `InterviewSession`, `TECH_TRACKS`.
- **Gemini Client:** Shared client in `src/lib/gemini.ts` — exports `geminiFlash` and `geminiPro` models.
- **Knowledge Base:** Articles generated on first access via Gemini, then cached in `knowledge_articles` table. Markdown rendered client-side with code snapshot styling.

### Design System — "Terminal Luxe"
Dark-mode-only aesthetic defined in `src/app/globals.css` using CSS custom properties:
- **Backgrounds:** `--bg-primary` (#0a0a0f) through `--bg-elevated` (#1a1a2e)
- **Accent:** `--accent` (#00d4aa cyan), `--indigo` (#6366f1), `--warning` (#f59e0b)
- **Fonts:** Fraunces (display/serif), system sans-serif (body), JetBrains Mono (code)
- **Effects:** Glassmorphism, glow borders, gradient mesh, noise texture, stagger fade-up animations
- **Code Snapshots:** macOS-style code blocks with colored dots and language label (`.code-snapshot` class)

### Path Alias
`@/*` maps to `./src/*` (configured in tsconfig.json).

## Environment Variables

Required in `.env.local`:
- `GEMINI_API_KEY` — Google Gemini API key
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`

Optional:
- `PISTON_API_URL` — Piston API endpoint for code execution
- `NEXT_PUBLIC_CODE_EXECUTION_ENABLED` — Set to `true` to show the Run button in the code editor
