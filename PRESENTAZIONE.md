# TekInterview

**La piattaforma AI che trasforma la preparazione ai colloqui tecnici in un'esperienza realistica, personalizzata e misurabile.**

---

## 1. Executive Summary

TekInterview e' una piattaforma web che simula colloqui tecnici reali attraverso un intervistatore AI conversazionale. A differenza delle soluzioni esistenti, non si limita a proporre esercizi di coding: conduce vere sessioni di colloquio interattive, con domande adattive, un code editor professionale integrato, e un sistema di valutazione automatica che traccia i progressi nel tempo.

La piattaforma copre **10 aree tecnologiche**, **300+ argomenti specifici**, **6 tipologie di colloquio** e **3 livelli di difficolta'**, offrendo un'esperienza completa che va dall'onboarding personalizzato fino al coaching AI basato sulle performance storiche.

---

## 2. Il Problema

### Il mercato della preparazione ai colloqui tecnici presenta limiti significativi

| Soluzione attuale | Limite principale |
|---|---|
| **LeetCode / HackerRank** | Solo esercizi di coding isolati. Nessuna simulazione conversazionale. Non coprono system design, teoria, behavioral. |
| **Mock interview con persone** | Costose (50-200$/sessione), difficili da schedulare, non scalabili, qualita' variabile. |
| **Video corsi / libri** | Studio passivo. Nessun feedback personalizzato. Non simulano la pressione del colloquio reale. |
| **ChatGPT generico** | Nessuna struttura, nessun tracking, nessuna valutazione formale, nessun code editor integrato. |

**Il gap fondamentale**: nessuna soluzione combina la conversazione naturale di un intervistatore umano con la scalabilita' e il costo zero di uno strumento digitale, insieme a strumenti professionali per scrivere ed eseguire codice in tempo reale.

---

## 3. La Soluzione: TekInterview

TekInterview colma questo gap unendo cinque capacita' chiave in un'unica piattaforma:

### 3.1 Intervistatore AI Conversazionale e Adattivo

L'AI non pone semplicemente domande da una lista. Conduce una conversazione naturale che si adatta in tempo reale:

- **Analizza le risposte** e formula follow-up pertinenti
- **Legge il codice** scritto nell'editor automaticamente, senza bisogno di "submit"
- **Regola la difficolta'** progressivamente durante la sessione
- **Evita ripetizioni** tenendo traccia degli argomenti gia' trattati
- **Valuta internamente** senza rivelare il punteggio durante il colloquio, esattamente come un intervistatore reale

### 3.2 Code Editor Professionale Integrato

Un editor Monaco (lo stesso engine di VS Code) affiancato alla chat in split-screen:

- **16+ linguaggi** con syntax highlighting completo
- **Esecuzione codice live** tramite Piston API (opzionale) — il candidato puo' testare il proprio codice durante il colloquio
- **L'AI legge il codice in automatico** — ogni modifica e' visibile all'intervistatore senza azioni aggiuntive
- Shortcut professionali: `Ctrl+Enter` per eseguire, auto-indentation, word wrap

### 3.3 Valutazione Strutturata e Tracking Progressi

Al termine di ogni sessione, l'AI genera un report dettagliato:

- **Punteggio 0-100** calcolato su 6 criteri specifici per area tecnologica
- **Punti di forza** identificati con precisione
- **Aree di miglioramento** con indicazioni concrete
- **Topic evaluated**: ogni argomento trattato riceve un punteggio individuale
- **Exponential smoothing** (70% storico + 30% sessione) per un tracking progressi realistico che non oscilla drasticamente

### 3.4 Knowledge Base Generata dall'AI

Una libreria di contenuti educativi che si espande on-demand:

- Articoli generati da Gemini AI al primo accesso, poi memorizzati in cache
- Ogni articolo include: punti chiave, contenuto Markdown con esempi di codice, domande tipiche da colloquio con suggerimenti
- Organizzati per track e categoria, navigabili e collegati direttamente alle sessioni di pratica

### 3.5 Dashboard Analytics Personalizzata

Un hub analitico completo per monitorare la crescita:

- **Activity Heatmap** (6 mesi) — stile GitHub, mostra la costanza dell'allenamento
- **Score Chart** — andamento dei punteggi nel tempo con trend line
- **Skill Radar** — grafico radar delle competenze per categoria
- **AI Coaching** — suggerimenti personalizzati basati sulle performance storiche
- **Aree deboli e forti** — classifica visuale con progress bar

---

## 4. Come Funziona — Flusso Utente Completo

```
ONBOARDING                    CONFIGURAZIONE              SESSIONE LIVE
+-----------------+           +------------------+        +----------------------+
| 1. Obiettivo    |           | 1. Tech Track    |        |  CHAT    |  CODE     |
|    - Colloquio  |    --->   | 2. Tipo          |  --->  |  PANEL   |  EDITOR   |
|    - Skills     |           | 3. Difficolta'   |        |          |           |
|    - Esploraz.  |           | 4. Linguaggio    |        | Domande  | Monaco    |
| 2. Track        |           +------------------+        | adattive | + Run     |
| 3. Esperienza   |                                       +----------------------+
+-----------------+                                               |
                                                                  v
DASHBOARD                     HISTORY                     REPORT
+-----------------+           +------------------+        +----------------------+
| Heatmap         |           | Lista sessioni   |        | Score: 78/100        |
| Score trend     |  <---     | Filtri per stato |  <---  | Strengths: [...]     |
| Skill radar     |           | PDF export       |        | Improvements: [...]  |
| AI suggestions  |           | Conversazione    |        | Topics evaluated     |
+-----------------+           +------------------+        +----------------------+
```

### Step-by-step

1. **Onboarding** (una tantum): l'utente indica il proprio obiettivo (superare un colloquio, migliorare le skills, esplorare nuove aree), seleziona la track tecnologica e il livello di esperienza (Junior/Mid/Senior).

2. **Configurazione colloquio**: scelta della track, del tipo di intervista (teorico, live-coding, system design, behavioral, debugging, architettura), della difficolta' e del linguaggio di programmazione.

3. **Sessione live**: interfaccia split-screen con chat panel a sinistra e code editor a destra. L'AI conduce il colloquio in modo conversazionale, ponendo domande, analizzando le risposte e il codice, e adattando il percorso in tempo reale. Le risposte dell'AI vengono stremate in real-time, carattere per carattere.

4. **Report**: al termine, l'AI analizza l'intera conversazione e genera una valutazione strutturata con punteggio, punti di forza, aree di miglioramento e argomenti specifici valutati. I risultati vengono persistiti nel database e aggiornano il profilo di competenza dell'utente.

5. **Dashboard**: l'utente visualizza i propri progressi aggregati, riceve suggerimenti AI personalizzati e identifica le aree su cui concentrarsi.

---

## 5. Architettura Tecnica

### 5.1 Stack Tecnologico

| Layer | Tecnologia | Motivazione |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server-side rendering, API routes, ottimizzazione automatica |
| **Linguaggio** | TypeScript | Type safety su tutto il codebase |
| **Styling** | Tailwind CSS v4 | Utility-first, CSS custom properties per design tokens |
| **AI Engine** | Google Gemini (`gemini-3-flash-preview`) | Streaming chat, bassa latenza, costo contenuto |
| **Database** | Supabase (PostgreSQL) | Row Level Security, real-time, auth integrata |
| **Auth** | Supabase Auth (GitHub OAuth) | Zero-config, JWT automatico |
| **Code Editor** | Monaco Editor | Stesso engine di VS Code, 16+ linguaggi |
| **Code Execution** | Piston API | Sandboxed execution, 16 linguaggi, timeout configurabili |
| **Charts** | Recharts + Custom SVG | Area chart, radar chart, heatmap personalizzata |
| **Deployment** | Vercel | Edge network, zero-config per Next.js |

### 5.2 Diagramma dei Flussi Dati

```
                         +------------------+
                         |    Frontend      |
                         |   (Next.js 16)   |
                         +--------+---------+
                                  |
                    +-------------+-------------+
                    |             |             |
              +-----v-----+ +----v----+ +-----v------+
              | /api/      | | /api/   | | /api/      |
              | interview/ | | learn/  | | stats/     |
              | message    | | generate| | suggestions|
              +-----+------+ +----+----+ +-----+------+
                    |              |             |
                    v              v             v
              +----------+  +----------+  +----------+
              | Gemini   |  | Gemini   |  | Gemini   |
              | Streaming|  | One-shot |  | One-shot |
              +----------+  +----------+  +----------+
                    |              |             |
                    v              v             v
              +------------------------------------------+
              |           Supabase PostgreSQL             |
              |  +----------------+  +----------------+  |
              |  | interview_     |  | knowledge_     |  |
              |  | sessions       |  | articles       |  |
              |  +----------------+  +----------------+  |
              |  +----------------+  +----------------+  |
              |  | messages       |  | topic_mastery  |  |
              |  +----------------+  +----------------+  |
              +------------------------------------------+
```

### 5.3 Streaming in Tempo Reale

Le risposte dell'intervistatore AI vengono trasmesse in streaming tramite `ReadableStream`, non come risposta singola. Questo significa che l'utente vede il testo apparire progressivamente, esattamente come in una chat reale, riducendo drasticamente il tempo percepito di attesa.

```
Client                    Server                   Gemini AI
  |                         |                         |
  |-- POST /message ------->|                         |
  |                         |-- generateContentStream->|
  |                         |                         |
  |<-- chunk "Ottima" ------|<-- chunk --------------|
  |<-- chunk " risposta" ---|<-- chunk --------------|
  |<-- chunk ", ora..." ----|<-- chunk --------------|
  |                         |                         |
  |<-- [stream end] --------|<-- [done] -------------|
  |                         |                         |
  |                         |-- saveMessage(DB) ----->|
```

### 5.4 Sistema di Prompt Dinamici

L'AI non utilizza un prompt fisso. Ogni sessione genera un system prompt unico combinando:

- **Track**: ruolo specifico (es. "Senior Frontend Developer"), contesto tecnologico
- **Tipo di intervista**: focus su teoria, coding, system design, etc.
- **Difficolta'**: complessita' delle domande, aspettative di profondita'
- **Linguaggio**: framework/tecnologia specifica (React, Python, Go, etc.)
- **Codice corrente**: snapshot del codice nell'editor, analizzato in real-time
- **Argomenti coperti**: lista degli argomenti gia' trattati per evitare ripetizioni

Questo produce un intervistatore che si comporta in modo radicalmente diverso per un "colloquio Frontend Junior su React" rispetto a un "colloquio System Design Senior su architetture distribuite".

### 5.5 BYOK — Bring Your Own Key

L'utente puo' inserire la propria API key di Google Gemini (gratuita nel tier free). Questo modello:

- **Azzera i costi API per l'operatore** della piattaforma
- **Scala infinitamente** senza colli di bottiglia economici
- **Rispetta la privacy**: le conversazioni transitano direttamente dall'utente a Gemini
- **Fallback**: se l'utente non ha una chiave, utilizza quella del server

### 5.6 Sicurezza

- **Row Level Security (RLS)**: ogni utente accede esclusivamente ai propri dati a livello PostgreSQL
- **OAuth**: autenticazione tramite GitHub, nessuna password gestita
- **Input validation**: limiti di dimensione codice (50KB), whitelist linguaggi, timeout su ogni operazione
- **Timeout protection**: 30s per streaming chat, 60s per generazione report, 15s per esecuzione codice

---

## 6. Intelligenza Artificiale — Il Cuore della Piattaforma

### 6.1 Quattro Motori AI Distinti

TekInterview utilizza Gemini AI per quattro funzioni indipendenti:

| Motore | Funzione | Modalita' |
|---|---|---|
| **Intervistatore** | Conduce il colloquio in tempo reale | Streaming chat |
| **Valutatore** | Genera report strutturato con punteggi | One-shot, JSON output |
| **Educatore** | Crea articoli per la Knowledge Base | One-shot, Markdown output |
| **Coach** | Genera suggerimenti personalizzati | One-shot, array output |

### 6.2 Valutazione Multi-Criterio per Track

Ogni track ha **6 criteri di valutazione specifici**. Esempi:

**Frontend**:
1. Correttezza tecnica
2. Qualita' del codice
3. Problem-solving
4. Comunicazione
5. Conoscenza framework
6. Pattern moderni

**Backend**:
1. Correttezza tecnica
2. Struttura del codice
3. Sicurezza
4. Concurrency
5. Architettura
6. Best practice

**System Design**:
1. Scalabilita'
2. Trade-off analysis
3. Conoscenza componenti
4. Comunicazione
5. Resilienza
6. Ottimizzazione costi

### 6.3 Tracking Progressi con Exponential Smoothing

Il punteggio di padronanza di ogni argomento non viene semplicemente sovrascritto. Utilizza una formula di **exponential smoothing**:

```
nuovo_mastery = (0.7 × mastery_precedente) + (0.3 × score_sessione)
```

Questo garantisce che:
- Un singolo risultato negativo non cancelli mesi di pratica
- Il miglioramento reale emerga gradualmente
- I progressi riflettano la competenza consolidata, non le oscillazioni casuali

---

## 7. Le 10 Aree Tecnologiche

| Track | Categorie Principali | Linguaggi/Tecnologie | Tipi di Intervista |
|---|---|---|---|
| **Frontend** | React, JavaScript, TypeScript, CSS, Next.js, Testing, Angular, Vue | JavaScript, TypeScript, React, Angular, Vue | Theory, Live-Coding, System Design |
| **Backend** | Java/Spring, Node.js, Python/Django, C#/.NET, Go, API Design, Architettura | Java, Python, Node.js, Go, C# | Theory, Live-Coding, System Design, Architecture |
| **Mobile** | Swift/iOS, Kotlin/Android, Flutter, React Native | Swift, Kotlin, Flutter, React Native | Theory, Live-Coding |
| **DevOps** | Docker, Kubernetes, AWS, Terraform, CI/CD, Linux | Bash, Python, YAML | Theory, System Design |
| **Data & ML** | Python, Machine Learning, Deep Learning, SQL, Big Data, Statistics | Python, SQL, R | Theory, Live-Coding |
| **Database** | SQL, Database Design, PostgreSQL, MongoDB, Redis, Database Theory | SQL, PostgreSQL, MongoDB | Theory, Live-Coding |
| **Cybersecurity** | Web Security, Networking, Linux, Cryptography, Pentesting | Python, Bash | Theory, Debugging |
| **DSA** | Data Structures, Algorithms, Dynamic Programming, Graphs, Complexity | JavaScript, Python, Java, C++, Go | Live-Coding |
| **System Design** | Scalabilita', Distributed Systems, Messaging, Data Storage, API Design | Pseudo-code, diagrammi | Theory, System Design |
| **Low-Level** | C, C++, Rust, Operating Systems, Hardware, Networking | C, C++, Rust | Theory, Live-Coding |

**Totale: ~300 argomenti specifici** organizzati in categorie tematiche per ogni track.

---

## 8. Design System — "Terminal Luxe"

L'interfaccia adotta un'estetica **dark-mode professionale** chiamata "Terminal Luxe", progettata per comunicare competenza tecnica e immersione:

### Palette Colori

| Elemento | Colore | Utilizzo |
|---|---|---|
| Background primario | `#0a0a0f` | Sfondo principale, profondita' |
| Background elevato | `#1a1a2e` | Card, sezioni interattive |
| Accent (Cyan) | `#00d4aa` | CTA, punteggi, elementi AI |
| Indigo | `#6366f1` | Messaggi utente, badge secondari |
| Warning | `#f59e0b` | Aree di miglioramento, alert |

### Tipografia

- **Fraunces** (serif): titoli e heading — eleganza editoriale
- **JetBrains Mono** (monospace): codice, label, dati — precisione tecnica
- **System sans-serif**: body text — leggibilita' ottimale

### Effetti Visivi

- **Glassmorphism**: backdrop-blur su navbar e modal
- **Glow borders**: bordi luminescenti sugli elementi interattivi
- **Gradient mesh**: sfondo con gradienti radiali sovrapposti (cyan, indigo, amber)
- **Noise texture**: texture SVG fractal per profondita' visiva
- **Stagger animations**: fade-up sequenziale con 5 livelli di delay

---

## 9. Potenziale e Scalabilita'

### 9.1 Architettura Modulare

Aggiungere una nuova track tecnologica richiede esclusivamente:

1. Definire i topic in `tracks-data.ts` (categorie + argomenti)
2. Specificare i criteri di valutazione (6 criteri)
3. Configurare i linguaggi supportati

Nessuna modifica al core dell'applicazione. L'intero sistema di prompt, valutazione e tracking si adatta automaticamente.

### 9.2 Modello Economico Sostenibile

Il pattern BYOK elimina il costo principale di una piattaforma AI:

- **Costi infrastruttura**: Vercel free tier + Supabase free tier = ~$0/mese per MVP
- **Costi AI**: trasferiti all'utente tramite BYOK (Gemini free tier = 15 RPM gratuiti)
- **Scalabilita'**: nessun collo di bottiglia economico — ogni utente porta la propria capacita' computazionale

### 9.3 Possibili Evoluzioni

| Evoluzione | Descrizione | Complessita' |
|---|---|---|
| **Company-Specific Prep** | Template di colloquio personalizzati per azienda (Google, Meta, etc.) | Media |
| **Multiplayer Mock** | Sessioni collaborative dove un utente fa l'intervistatore | Alta |
| **API Enterprise** | Endpoint per integrare TekInterview in piattaforme HR/recruiting | Media |
| **Mobile App** | Versione nativa iOS/Android con offline mode | Alta |
| **Analytics Avanzate** | Confronto con peers, benchmark per ruolo/azienda | Bassa |
| **Integrazione LMS** | Plugin per piattaforme di e-learning aziendali | Media |

---

## 10. Differenziatori Competitivi

| Caratteristica | TekInterview | LeetCode | Pramp | ChatGPT |
|---|---|---|---|---|
| Intervistatore AI conversazionale | Si | No | Parziale (umano) | Parziale |
| Code editor professionale integrato | Si (Monaco) | Si | Si | No |
| Esecuzione codice live | Si (Piston) | Si | No | No |
| 10 aree tecnologiche | Si | Solo coding | Solo coding | Generico |
| System design interviews | Si | No | Si | Parziale |
| Valutazione strutturata automatica | Si | Solo test case | Feedback umano | No |
| Tracking progressi nel tempo | Si | Parziale | No | No |
| Knowledge Base integrata | Si | No | No | No |
| AI coaching personalizzato | Si | No | No | No |
| Costo per l'utente | Gratuito (BYOK) | $35/mese premium | Gratuito (limitato) | $20/mese |

---

## 11. Conclusioni

TekInterview non e' un semplice chatbot che pone domande tecniche. E' una **piattaforma di simulazione completa** che replica fedelmente l'esperienza di un colloquio tecnico reale, dalla conversazione adattiva alla scrittura di codice, dalla valutazione strutturata al tracking dei progressi.

**Tre motivi per cui TekInterview e' rilevante oggi:**

1. **Il mercato e' pronto**: la preparazione ai colloqui tecnici e' un'esigenza universale per milioni di sviluppatori. Le soluzioni esistenti coprono solo frammenti dell'esperienza.

2. **La tecnologia e' matura**: i modelli AI generativi (Gemini) sono ora sufficientemente capaci di condurre conversazioni tecniche strutturate con valutazione coerente. Il pattern BYOK rende il modello economicamente sostenibile.

3. **L'architettura e' scalabile**: l'aggiunta di nuove aree tecnologiche, tipi di colloquio o funzionalita' richiede modifiche minime. La piattaforma e' progettata per crescere.

---

*TekInterview — Preparati come se fosse reale. Perche' lo sara'.*
