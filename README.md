<div align="center">

# 🎯 TekInterview

### Piattaforma di Simulazione Colloqui Tecnici con AI

[![Live Demo](https://img.shields.io/badge/▶_Demo_Live-tek--three.vercel.app-00d4aa?style=for-the-badge&logo=vercel&logoColor=white)](https://tek-three.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

---

Simulazioni di colloquio realistiche con AI per **ogni ambito tech**. Scrivi codice, rispondi a domande tecniche e ricevi feedback dettagliato — come da un vero intervistatore senior.

[Prova ora →](https://tek-three.vercel.app/) · [Segnala un bug](../../issues) · [Richiedi una feature](../../issues)

</div>

---

## ✨ Funzionalità

<table>
<tr>
<td width="50%">

### 🤖 Intervistatore AI
Conversazione in streaming in tempo reale con **Google Gemini**. L'intervistatore adatta le domande al tuo livello, fornisce suggerimenti progressivi e analizza il tuo codice live.

</td>
<td width="50%">

### 💻 Editor di Codice Live
Editor **Monaco** (lo stesso motore di VS Code) con syntax highlighting per **16+ linguaggi** — Java, Python, C++, Go, Rust, SQL e molti altri.

</td>
</tr>
<tr>
<td width="50%">

### 📚 Knowledge Base
Schede formative generate **automaticamente dall'AI** per ogni argomento. Punti chiave, esempi di codice e domande tipiche da colloquio.

</td>
<td width="50%">

### 📊 Dashboard & Analytics
Heatmap attività (6 mesi), radar chart competenze, andamento punteggi e **suggerimenti AI personalizzati** su come migliorare.

</td>
</tr>
</table>

## 🌐 Aree Tech

10 aree tecnologiche con argomenti, prompt e linguaggi dedicati:

| Area | Linguaggi/Tool | Esempio |
|:--|:--|:--|
| ⚛️ **Frontend** | React, Angular, Vue, Svelte, CSS | *"Implementa virtual scrolling"* |
| 🖥️ **Backend** | Node.js, Java/Spring, Python/Django, Go | *"Progetta un rate limiter"* |
| 📱 **Mobile** | Swift, Kotlin, Flutter, React Native | *"Gestisci il lifecycle Android"* |
| ☁️ **DevOps** | Docker, Kubernetes, AWS, Terraform | *"Pipeline CI/CD per microservizi"* |
| 🧠 **Data/ML** | Python, SQL, Pandas, TensorFlow | *"Ottimizza query su milioni di righe"* |
| 🗄️ **Database** | PostgreSQL, MongoDB, Redis | *"Spiega gli isolation levels"* |
| 🔒 **Cybersecurity** | OWASP, Networking, Linux | *"Trova vulnerabilità REST"* |
| 🧩 **Algoritmi & DSA** | Qualsiasi linguaggio | *"Risolvi con dynamic programming"* |
| 🌐 **System Design** | Architettura cloud-scale | *"Progetta WhatsApp da zero"* |
| 🔧 **Low-Level** | C, C++, Rust, Embedded | *"Implementa memory allocator"* |

## 🎭 Tipi di Intervista

| Tipo | Descrizione |
|:--:|:--|
| 💡 **Concettuale** | Domande teoriche sulla tecnologia scelta |
| ⌨️ **Live Coding** | Costruisci funzioni e componenti in tempo reale |
| 🏗️ **System Design** | Architettura, scalabilità, trade-off |
| 🗣️ **Behavioral** | Soft skills, lavoro in team, problem solving |
| 🐛 **Debugging** | Trova e risolvi bug nel codice |
| 🔀 **Mixed** | Combinazione di tutti i tipi |

## 📈 Livelli di Difficoltà

```
┌──────────────────────────────────────────────────────────────┐
│  🟢 Junior (0-2 anni)    Fondamenti e concetti base         │
│  🟡 Mid    (2-5 anni)    Pattern avanzati e best practices  │
│  🔴 Senior (5+ anni)     Architettura e decisioni di design │
└──────────────────────────────────────────────────────────────┘
```

## 🛠️ Stack Tecnologico

| Livello | Tecnologia |
|:--|:--|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) + [React 19](https://react.dev/) |
| **Linguaggio** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Stile** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Motore AI** | [Google Gemini](https://ai.google.dev/) (`gemini-3-flash-preview`) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **Autenticazione** | Supabase Auth (GitHub OAuth) |
| **Editor Codice** | [Monaco Editor](https://microsoft.github.io/monaco-editor/) |
| **Grafici** | [Recharts](https://recharts.org/) |
| **Deploy** | [Vercel](https://vercel.com/) |

## 🚀 Per Iniziare

### Prerequisiti

- **Node.js** 18+
- **npm** (o il tuo package manager preferito)
- Un progetto **Supabase** con le tabelle richieste (vedi SQL sotto)

### 1. Clona e Installa

```bash
git clone https://github.com/Kekkozzz/Tek.git
cd Tek
npm install
```

### 2. Variabili d'Ambiente

Crea un file `.env.local` nella root del progetto:

```env
# AI
GEMINI_API_KEY=la_tua_api_key_gemini

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://il-tuo-progetto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=la_tua_anon_key
SUPABASE_SERVICE_ROLE_KEY=la_tua_service_role_key

# Opzionale — Esecuzione codice (richiede istanza Piston API)
# PISTON_API_URL=http://localhost:2000/api/v2/piston
# NEXT_PUBLIC_CODE_EXECUTION_ENABLED=true
```

### 3. Setup Database

Esegui questo SQL nel SQL Editor di Supabase:

```sql
-- Sessioni di intervista
CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  track TEXT DEFAULT 'frontend',
  language TEXT DEFAULT 'typescriptreact',
  status TEXT DEFAULT 'active',
  score INTEGER,
  report JSONB,
  messages JSONB DEFAULT '[]',
  code TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ
);

-- Articoli Knowledge Base
CREATE TABLE IF NOT EXISTS knowledge_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track TEXT NOT NULL,
  category TEXT NOT NULL,
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  difficulty TEXT DEFAULT 'medium',
  key_points JSONB DEFAULT '[]',
  common_questions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_knowledge_track_topic
  ON knowledge_articles(track, topic);
```

### 4. Avvia

```bash
npm run dev
```

Apri **[http://localhost:3000](http://localhost:3000)** e inizia a esercitarti!

## 📁 Struttura del Progetto

```
src/
├── app/                              # Next.js App Router
│   ├── api/
│   │   ├── interview/message/        # Chat AI in streaming
│   │   ├── interview/end/            # Generazione report
│   │   ├── learn/                    # Knowledge Base CRUD
│   │   ├── learn/generate/           # Generazione articoli AI
│   │   ├── stats/                    # Statistiche utente
│   │   ├── stats/suggestions/        # Suggerimenti AI coaching
│   │   ├── code/execute/             # Esecuzione codice (Piston)
│   │   └── report/[sessionId]/       # Export report PDF
│   ├── interview/                    # Flusso intervista
│   ├── learn/                        # Knowledge Base
│   │   └── [track]/[topic]/          # Pagine articoli generati da AI
│   ├── dashboard/                    # Progressi e analytics
│   ├── history/                      # Sessioni passate
│   ├── onboarding/                   # Personalizzazione 3 step
│   ├── topics/                       # Mappa competenze
│   └── login/                        # Autenticazione
├── components/
│   ├── interview/                    # Chat, CodeEditor, MessageBubble
│   ├── dashboard/                    # ScoreChart, SkillRadar, Heatmap,
│   │                                 # WeakAreas, AISuggestions
│   └── layout/Navbar.tsx             # Navigazione
├── lib/
│   ├── gemini.ts                     # Client Gemini AI
│   ├── prompts/                      # Prompt di sistema dinamici
│   │   ├── interviewer.ts            # Conduttore intervista
│   │   ├── report.ts                 # Generazione report
│   │   ├── knowledge.ts              # Generazione articoli
│   │   └── tracks-data.ts            # Argomenti e criteri per track
│   └── supabase/                     # Client DB e query
└── types/index.ts                    # Tipi TypeScript + config TECH_TRACKS
```

## 📜 Script Disponibili

| Comando | Descrizione |
|:--|:--|
| `npm run dev` | Avvia server di sviluppo su `localhost:3000` |
| `npm run build` | Build di produzione ottimizzata |
| `npm run start` | Servi la build di produzione |
| `npm run lint` | Controllo ESLint |

## 📄 Licenza

Questo progetto è open source e disponibile sotto la [Licenza MIT](LICENSE).

---

<div align="center">

Costruito con ☕ e curiosità

**[⬆ Torna in cima](#-tekinterview)**

</div>
