// ══════════════════════════════════════════════════
// TekInterview — Type Definitions
// ══════════════════════════════════════════════════

// ── Tech Tracks ─────────────────────────────────
export type TechTrack =
  | "frontend"
  | "backend"
  | "mobile"
  | "devops"
  | "data-ml"
  | "database"
  | "cybersecurity"
  | "dsa"
  | "system-design"
  | "low-level";

// ── Interview Types ─────────────────────────────
export type InterviewType =
  | "theory"
  | "live-coding"
  | "system-design"
  | "behavioral"
  | "debugging"
  | "architecture";

export type Difficulty = "junior" | "mid" | "senior";

export type SessionStatus = "active" | "completed" | "abandoned";

export type MessageRole = "user" | "assistant" | "system";

// ── Interfaces ──────────────────────────────────

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  target_role: string;
  experience_level: Difficulty;
  created_at: string;
  updated_at: string;
}

export interface InterviewSession {
  id: string;
  user_id: string;
  track: TechTrack;
  type: InterviewType;
  difficulty: Difficulty;
  language: string;
  status: SessionStatus;
  score: number | null;
  strengths: string[] | null;
  improvements: string[] | null;
  summary: string | null;
  duration_seconds: number | null;
  started_at: string;
  completed_at: string | null;
}

export interface Message {
  id: string;
  session_id: string;
  role: MessageRole;
  content: string;
  code_snapshot: string | null;
  created_at: string;
}

export interface TopicMastery {
  id: string;
  user_id: string;
  topic: string;
  category: string;
  mastery_level: number;
  sessions_count: number;
  last_practiced: string | null;
}

export interface InterviewConfig {
  track: TechTrack;
  type: InterviewType;
  difficulty: Difficulty;
  language: string;
}

// ── Track Definitions ───────────────────────────

export interface TrackDefinition {
  label: string;
  description: string;
  icon: string; // lucide-react icon name
  color: string;
  languages: LanguageOption[];
  interviewTypes: InterviewType[];
}

export interface LanguageOption {
  id: string;
  label: string;
  monacoId: string;
}

export const TECH_TRACKS: Record<TechTrack, TrackDefinition> = {
  frontend: {
    label: "Frontend",
    description: "React, Angular, Vue, Svelte, HTML/CSS",
    icon: "Globe",
    color: "#61dafb",
    languages: [
      { id: "react", label: "React / Next.js", monacoId: "typescript" },
      { id: "angular", label: "Angular", monacoId: "typescript" },
      { id: "vue", label: "Vue.js", monacoId: "javascript" },
      { id: "svelte", label: "Svelte", monacoId: "javascript" },
      { id: "html-css", label: "HTML / CSS", monacoId: "html" },
      { id: "javascript", label: "JavaScript", monacoId: "javascript" },
      { id: "typescript", label: "TypeScript", monacoId: "typescript" },
    ],
    interviewTypes: ["theory", "live-coding", "debugging", "system-design", "behavioral"],
  },
  backend: {
    label: "Backend",
    description: "Node.js, Java/Spring, Python/Django, C#/.NET, Go",
    icon: "Server",
    color: "#68a063",
    languages: [
      { id: "nodejs", label: "Node.js", monacoId: "typescript" },
      { id: "java", label: "Java / Spring", monacoId: "java" },
      { id: "python", label: "Python / Django", monacoId: "python" },
      { id: "csharp", label: "C# / .NET", monacoId: "csharp" },
      { id: "go", label: "Go", monacoId: "go" },
      { id: "php", label: "PHP / Laravel", monacoId: "php" },
      { id: "ruby", label: "Ruby / Rails", monacoId: "ruby" },
    ],
    interviewTypes: ["theory", "live-coding", "debugging", "architecture", "system-design", "behavioral"],
  },
  mobile: {
    label: "Mobile",
    description: "Swift, Kotlin, Flutter, React Native",
    icon: "Smartphone",
    color: "#a855f7",
    languages: [
      { id: "swift", label: "Swift / iOS", monacoId: "swift" },
      { id: "kotlin", label: "Kotlin / Android", monacoId: "kotlin" },
      { id: "flutter", label: "Flutter / Dart", monacoId: "dart" },
      { id: "react-native", label: "React Native", monacoId: "typescript" },
    ],
    interviewTypes: ["theory", "live-coding", "debugging", "architecture", "behavioral"],
  },
  devops: {
    label: "DevOps / Cloud",
    description: "Docker, Kubernetes, AWS, Terraform, CI/CD",
    icon: "Cloud",
    color: "#f59e0b",
    languages: [
      { id: "docker", label: "Docker / Compose", monacoId: "dockerfile" },
      { id: "kubernetes", label: "Kubernetes", monacoId: "yaml" },
      { id: "terraform", label: "Terraform", monacoId: "hcl" },
      { id: "bash", label: "Bash / Shell", monacoId: "shell" },
      { id: "aws", label: "AWS", monacoId: "yaml" },
      { id: "cicd", label: "CI/CD (GitHub Actions)", monacoId: "yaml" },
    ],
    interviewTypes: ["theory", "architecture", "debugging", "system-design", "behavioral"],
  },
  "data-ml": {
    label: "Data & ML",
    description: "Python, SQL, Pandas, TensorFlow, Spark",
    icon: "BrainCircuit",
    color: "#10b981",
    languages: [
      { id: "python-data", label: "Python / Pandas", monacoId: "python" },
      { id: "sql-data", label: "SQL", monacoId: "sql" },
      { id: "tensorflow", label: "TensorFlow / PyTorch", monacoId: "python" },
      { id: "spark", label: "Apache Spark", monacoId: "python" },
      { id: "r", label: "R", monacoId: "r" },
    ],
    interviewTypes: ["theory", "live-coding", "debugging", "system-design", "behavioral"],
  },
  database: {
    label: "Database",
    description: "SQL, PostgreSQL, MongoDB, Redis",
    icon: "Database",
    color: "#3b82f6",
    languages: [
      { id: "postgresql", label: "PostgreSQL", monacoId: "sql" },
      { id: "mysql", label: "MySQL", monacoId: "sql" },
      { id: "mongodb", label: "MongoDB", monacoId: "javascript" },
      { id: "redis", label: "Redis", monacoId: "plaintext" },
      { id: "sql-general", label: "SQL (Generale)", monacoId: "sql" },
    ],
    interviewTypes: ["theory", "live-coding", "debugging", "architecture", "behavioral"],
  },
  cybersecurity: {
    label: "Cybersecurity",
    description: "Networking, OWASP, Linux, Pentesting",
    icon: "ShieldCheck",
    color: "#ef4444",
    languages: [
      { id: "security-general", label: "Sicurezza Generale", monacoId: "plaintext" },
      { id: "linux", label: "Linux / Bash", monacoId: "shell" },
      { id: "python-sec", label: "Python (Scripting)", monacoId: "python" },
      { id: "networking", label: "Networking", monacoId: "plaintext" },
    ],
    interviewTypes: ["theory", "debugging", "architecture", "behavioral"],
  },
  dsa: {
    label: "Algoritmi & DSA",
    description: "Strutture dati, algoritmi, problem solving",
    icon: "Puzzle",
    color: "#8b5cf6",
    languages: [
      { id: "python-dsa", label: "Python", monacoId: "python" },
      { id: "javascript-dsa", label: "JavaScript", monacoId: "javascript" },
      { id: "java-dsa", label: "Java", monacoId: "java" },
      { id: "cpp", label: "C++", monacoId: "cpp" },
      { id: "csharp-dsa", label: "C#", monacoId: "csharp" },
      { id: "go-dsa", label: "Go", monacoId: "go" },
    ],
    interviewTypes: ["live-coding", "theory", "debugging", "behavioral"],
  },
  "system-design": {
    label: "System Design",
    description: "Architettura cloud-scale, scalabilità, trade-off",
    icon: "Network",
    color: "#f97316",
    languages: [
      { id: "system-general", label: "Diagrammi & Pseudocode", monacoId: "plaintext" },
      { id: "system-python", label: "Python", monacoId: "python" },
      { id: "system-java", label: "Java", monacoId: "java" },
      { id: "system-go", label: "Go", monacoId: "go" },
    ],
    interviewTypes: ["system-design", "architecture", "theory", "behavioral"],
  },
  "low-level": {
    label: "Low-Level",
    description: "C, C++, Rust, Sistemi Embedded, OS",
    icon: "Wrench",
    color: "#78716c",
    languages: [
      { id: "c", label: "C", monacoId: "c" },
      { id: "cpp-low", label: "C++", monacoId: "cpp" },
      { id: "rust", label: "Rust", monacoId: "rust" },
      { id: "assembly", label: "Assembly", monacoId: "plaintext" },
    ],
    interviewTypes: ["theory", "live-coding", "debugging", "behavioral"],
  },
};

// ── Interview Type Definitions ──────────────────

export const INTERVIEW_TYPES: Record<
  InterviewType,
  { label: string; description: string; icon: string }
> = {
  theory: {
    label: "Domande Teoriche",
    description: "Concetti fondamentali, best practices, pattern",
    icon: "BookOpen",
  },
  "live-coding": {
    label: "Live Coding",
    description: "Scrivi codice in tempo reale con feedback",
    icon: "Code",
  },
  "system-design": {
    label: "System Design",
    description: "Progetta sistemi complessi e scalabili",
    icon: "Network",
  },
  behavioral: {
    label: "Behavioral",
    description: "Soft skills, lavoro in team, problem solving",
    icon: "MessageSquare",
  },
  debugging: {
    label: "Debugging",
    description: "Trova e risolvi bug in codice reale",
    icon: "Bug",
  },
  architecture: {
    label: "Architettura",
    description: "Design patterns, struttura del codice, decisioni tecniche",
    icon: "Blocks",
  },
};

// ── Difficulty Levels ───────────────────────────

export const DIFFICULTY_LEVELS: Record<
  Difficulty,
  { label: string; description: string }
> = {
  junior: {
    label: "Junior",
    description: "0-2 anni di esperienza",
  },
  mid: {
    label: "Mid",
    description: "2-5 anni di esperienza",
  },
  senior: {
    label: "Senior",
    description: "5+ anni di esperienza",
  },
};

