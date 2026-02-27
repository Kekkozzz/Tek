# TekInterview

AI-powered technical interview practice platform. Simulate realistic mock interviews with a Gemini-powered interviewer, write code in a live editor, and receive detailed performance reports.

## Features

- **AI Interviewer** — Real-time streaming conversation powered by Google Gemini
- **Live Code Editor** — Monaco Editor (VS Code engine) with syntax highlighting
- **Interview Types** — React, JavaScript, Live Coding, System Design, Behavioral, Debugging
- **Difficulty Levels** — Junior (0-2y), Mid (2-5y), Senior (5+y)
- **Performance Reports** — Score, strengths, areas for improvement, and topics evaluated

## Tech Stack

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **AI:** Google Gemini (`@google/generative-ai`)
- **Database:** Supabase
- **Auth:** NextAuth v5 (Google + GitHub OAuth)
- **Code Editor:** Monaco Editor
- **Animations:** Motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
npm install
```

Create a `.env.local` file with your credentials:

```env
GEMINI_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_ID=
GITHUB_SECRET=
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm run start
```

## Project Structure

```text
src/
├── app/                    # Next.js App Router
│   ├── api/interview/      # AI chat + report generation endpoints
│   ├── interview/           # Setup + active session pages
│   ├── dashboard/           # Progress tracking
│   ├── history/             # Past sessions
│   └── topics/              # Skills map
├── components/
│   ├── interview/           # ChatPanel, CodeEditor, MessageBubble
│   ├── layout/              # Navbar
│   └── ui/                  # Button, Card
├── lib/
│   ├── gemini.ts            # Gemini AI client config
│   ├── prompts/             # System prompt builders
│   └── supabase/            # Database clients
└── types/                   # TypeScript type definitions
```
