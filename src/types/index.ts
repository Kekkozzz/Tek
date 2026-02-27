// ══════════════════════════════════════════════════
// TekInterview — Type Definitions
// ══════════════════════════════════════════════════

export type InterviewType =
  | "react"
  | "javascript"
  | "live-coding"
  | "system-design"
  | "behavioral"
  | "debugging";

export type Difficulty = "junior" | "mid" | "senior";

export type SessionStatus = "active" | "completed" | "abandoned";

export type MessageRole = "user" | "assistant" | "system";

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
  type: InterviewType;
  difficulty: Difficulty;
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
  type: InterviewType;
  difficulty: Difficulty;
}

export const INTERVIEW_TYPES: Record<
  InterviewType,
  { label: string; description: string; icon: string }
> = {
  react: {
    label: "React",
    description: "Hooks, state management, patterns, lifecycle",
    icon: "R",
  },
  javascript: {
    label: "JavaScript",
    description: "Closures, promises, prototypes, ES6+",
    icon: "JS",
  },
  "live-coding": {
    label: "Live Coding",
    description: "Costruisci componenti e funzioni in tempo reale",
    icon: "</>",
  },
  "system-design": {
    label: "System Design",
    description: "Architettura frontend, scalabilita, performance",
    icon: "SD",
  },
  behavioral: {
    label: "Behavioral",
    description: "Soft skills, lavoro in team, problem solving",
    icon: "BH",
  },
  debugging: {
    label: "Debugging",
    description: "Trova e risolvi bug in codice React/JS",
    icon: "BG",
  },
};

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
