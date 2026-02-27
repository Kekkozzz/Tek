<div align="center">

# 🎯 TekInterview

### AI-Powered Technical Interview Practice Platform

[![Live Demo](https://img.shields.io/badge/▶_Live_Demo-tek--three.vercel.app-00d4aa?style=for-the-badge&logo=vercel&logoColor=white)](https://tek-three.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

---

Simulazioni di colloquio realistiche con AI. Scrivi codice, rispondi a domande tecniche e ricevi feedback dettagliato — come un vero intervistatore senior.

[Prova ora →](https://tek-three.vercel.app/) · [Segnala un bug](../../issues) · [Richiedi una feature](../../issues)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🤖 AI Interviewer
Conversazione in streaming in tempo reale con **Google Gemini**. L'intervistatore adatta le domande al tuo livello, fornisce hint progressivi se sei bloccato e analizza il tuo codice live.

</td>
<td width="50%">

### 💻 Live Code Editor
Editor **Monaco** (lo stesso motore di VS Code) integrato direttamente nella sessione. Scrivi codice React/JS con syntax highlighting completo mentre l'AI valuta il tuo approccio.

</td>
</tr>
<tr>
<td width="50%">

### 📊 Report Dettagliato
Al termine di ogni sessione ricevi un report completo: **punteggio**, punti di forza, aree di miglioramento e argomenti valutati — generato automaticamente dall'AI.

</td>
<td width="50%">

### 🎨 Terminal Luxe Design
Interfaccia dark-mode con estetica cyberpunk: glassmorphism, glow borders, gradient mesh e animazioni fluide. Pensata per chi vive nel terminale.

</td>
</tr>
</table>

## 🎭 Interview Types

| Tipo | Descrizione | Esempio |
|:--:|:--|:--|
| ⚛️ **React** | Hooks, state management, patterns, lifecycle | *"Implementa un custom hook per il debounce"* |
| 📜 **JavaScript** | Closures, promises, prototypes, ES6+ | *"Spiega l'event loop e la task queue"* |
| ⌨️ **Live Coding** | Costruisci componenti e funzioni in tempo reale | *"Crea un componente TodoList con filtri"* |
| 🏗️ **System Design** | Architettura frontend, scalabilità, performance | *"Progetta un feed social con infinite scroll"* |
| 🗣️ **Behavioral** | Soft skills, lavoro in team, problem solving | *"Racconta di un conflitto tecnico nel team"* |
| 🐛 **Debugging** | Trova e risolvi bug in codice React/JS | *"Perché questo useEffect causa un loop infinito?"* |

## 📈 Difficulty Levels

```
┌──────────────────────────────────────────────────────────────┐
│  🟢 Junior (0-2 anni)    Fondamenti e concetti base         │
│  🟡 Mid    (2-5 anni)    Pattern avanzati e best practices  │
│  🔴 Senior (5+ anni)     Architettura e decisioni di design │
└──────────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

| Layer | Tecnologia |
|:--|:--|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **AI Engine** | [Google Gemini](https://ai.google.dev/) (`gemini-3-flash-preview`) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **Auth** | [NextAuth v5](https://authjs.dev/) (Google + GitHub OAuth) |
| **Code Editor** | [Monaco Editor](https://microsoft.github.io/monaco-editor/) |
| **Animations** | [Motion](https://motion.dev/) + CSS keyframes |
| **Charts** | [Recharts](https://recharts.org/) |
| **Deploy** | [Vercel](https://vercel.com/) |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (React 19)                       │
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐  ┌──────────┐  │
│  │ Landing  │  │   Interview  │  │ Dashboard  │  │ History  │  │
│  │  Page    │  │   Session    │  │  & Stats   │  │ & Topics │  │
│  └──────────┘  └──────┬───────┘  └────────────┘  └──────────┘  │
│                       │                                         │
│            ┌──────────┴──────────┐                              │
│            │    Split View UI    │                              │
│            │  Chat  │  Monaco   │                              │
│            │  Panel │  Editor   │                              │
│            └────────┴───────────┘                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │ fetch + ReadableStream
┌──────────────────────┴──────────────────────────────────────────┐
│                     API ROUTES (Next.js)                        │
│  ┌──────────────────────┐  ┌─────────────────────────────────┐  │
│  │ POST /api/interview  │  │ POST /api/interview/end         │  │
│  │      /message        │  │ Generate JSON evaluation report │  │
│  │ Streaming AI chat    │  │ Score + strengths + improvements│  │
│  └──────────┬───────────┘  └──────────────┬──────────────────┘  │
└─────────────┼─────────────────────────────┼─────────────────────┘
              │                             │
┌─────────────┴─────────────────────────────┴─────────────────────┐
│              SERVICES                                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐   │
│  │   Google Gemini  │  │    Supabase      │  │   NextAuth   │   │
│  │   (AI Engine)    │  │   (Database)     │  │   (OAuth)    │   │
│  └──────────────────┘  └──────────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** (or your preferred package manager)

### 1. Clone & Install

```bash
git clone https://github.com/Kekkozzz/Tek.git
cd Tek
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
# AI
GEMINI_API_KEY=your_gemini_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
```

### 3. Run

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** and start practicing!

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/interview/            # API endpoints
│   │   ├── message/route.ts      #   ↳ Streaming AI chat
│   │   └── end/route.ts          #   ↳ Report generation
│   ├── interview/                # Interview flow
│   │   ├── page.tsx              #   ↳ Type & difficulty selection
│   │   └── [sessionId]/page.tsx  #   ↳ Active session (chat + editor)
│   ├── dashboard/                # Progress & statistics
│   ├── history/                  # Past interview sessions
│   ├── topics/                   # Skills & mastery map
│   └── login/                    # Authentication
├── components/
│   ├── interview/                # Session UI
│   │   ├── ChatPanel.tsx         #   ↳ AI conversation panel
│   │   ├── CodeEditor.tsx        #   ↳ Monaco editor wrapper
│   │   └── MessageBubble.tsx     #   ↳ Chat message rendering
│   ├── dashboard/                # Dashboard widgets
│   │   ├── ScoreChart.tsx        #   ↳ Performance chart
│   │   └── WeakAreas.tsx         #   ↳ Improvement areas
│   ├── layout/Navbar.tsx         # Navigation bar
│   └── ui/                       # Reusable components
├── lib/
│   ├── gemini.ts                 # Gemini AI client config
│   ├── prompts/                  # Dynamic system prompts
│   │   ├── interviewer.ts        #   ↳ Interview conductor prompt
│   │   └── report.ts             #   ↳ Report generation prompt
│   └── supabase/                 # Database client setup
└── types/index.ts                # TypeScript domain types
```

## 📜 Available Scripts

| Command | Description |
|:--|:--|
| `npm run dev` | Start development server on `localhost:3000` |
| `npm run build` | Create optimized production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint checks |

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Built with ☕ and curiosity

**[⬆ Back to top](#-tekinterview)**

</div>
