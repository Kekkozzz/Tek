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
- **AI:** Google Gemini (`gemini-3-flash-preview`) via `@google/generative-ai` — streaming chat + one-shot report generation
- **Database:** Supabase (client + server clients configured, schema not yet deployed)
- **Auth:** NextAuth v5 beta (Google + GitHub OAuth configured, not yet wired)
- **Code Editor:** Monaco Editor (`@monaco-editor/react`)
- **Animations:** Motion library + custom CSS keyframes
- **Charts:** Recharts (imported, not yet used)

### App Router Structure
- `/` — Landing page
- `/interview` — Setup: select interview type + difficulty, generates UUID session
- `/interview/[sessionId]` — Active session with three states: pre-session → active (chat + code editor split) → report display
- `/dashboard`, `/history`, `/topics` — Placeholder pages pending Supabase integration

### API Routes
- `POST /api/interview/message` — Streams AI interviewer responses via `ReadableStream`. Accepts message history, type, difficulty, and current code. Uses `startChat().sendMessageStream()` for multi-turn conversation.
- `POST /api/interview/end` — Generates JSON evaluation report (score, strengths, improvements, topics). Non-streaming, single Gemini call with JSON parsing + fallback.

### Key Patterns
- **Client vs Server:** Most pages use `"use client"`. Root layout and API routes are server-side.
- **State:** React hooks only (useState, useCallback). No external state library. Interview type/difficulty passed via URL query params.
- **AI Prompts:** Dynamic system prompts built by `src/lib/prompts/interviewer.ts` and `report.ts` — configurable by interview type, difficulty, and context.
- **Streaming:** Chat API returns chunked text via ReadableStream, consumed with `fetch().body.getReader()` on client.
- **Types:** All domain types in `src/types/index.ts` — `InterviewType`, `Difficulty`, `SessionStatus`, `Message`, `InterviewSession`, `Profile`, `TopicMastery`.

### Design System — "Terminal Luxe"
Dark-mode-only aesthetic defined in `src/globals.css` using CSS custom properties:
- **Backgrounds:** `--bg-primary` (#0a0a0f) through `--bg-elevated` (#1a1a2e)
- **Accent:** `--accent` (#00d4aa cyan), `--indigo` (#6366f1)
- **Fonts:** Fraunces (display/serif), system sans-serif (body), JetBrains Mono (code)
- **Effects:** Glassmorphism (backdrop-blur), glow borders, gradient mesh backgrounds, noise texture overlay, stagger fade-up animations

### Path Alias
`@/*` maps to `./src/*` (configured in tsconfig.json).

## Environment Variables

Required in `.env.local`:
- `GEMINI_API_KEY` — Google Gemini API key
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_SERVICE_ROLE_KEY`
- `NEXTAUTH_URL` / `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (OAuth)
- `GITHUB_ID` / `GITHUB_SECRET` (OAuth)
