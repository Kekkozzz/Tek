import type { TechTrack } from "@/types";
import { TECH_TRACKS } from "@/types";
import { TRACK_PROMPT_DATA } from "./tracks-data";

export function buildReportPrompt(config: {
  messages: string;
  track: TechTrack;
  language: string;
}): string {
  const { messages, track, language } = config;

  const trackData = TECH_TRACKS[track];
  const promptData = TRACK_PROMPT_DATA[track];
  const langLabel = trackData.languages.find((l) => l.id === language)?.label ?? language;

  // Build topics section dynamically from track data
  const topicsSection = Object.entries(promptData.topics)
    .map(([category, topics]) => `- ${category}: ${topics.join(", ")}`)
    .join("\n");

  // Build categories list for the JSON schema
  const categories = Object.keys(promptData.topics).join("|");

  // Build evaluation criteria
  const criteriaSection = promptData.evaluationCriteria
    .map((c) => `- ${c}`)
    .join("\n");

  return `Analizza questa sessione di colloquio tecnico e genera un report di valutazione dettagliato.

CONTESTO:
- Area tecnica: ${trackData.label}
- Linguaggio/Tecnologia: ${langLabel}
- Ruolo: ${promptData.roleDescription}

SESSIONE:
${messages}

Rispondi ESCLUSIVAMENTE in formato JSON valido con questa struttura:
{
  "score": <numero da 0 a 100>,
  "strengths": [<array di 2-4 punti di forza specifici>],
  "improvements": [<array di 2-4 aree di miglioramento specifiche>],
  "summary": "<riassunto di 2-3 frasi della performance complessiva>",
  "topics_evaluated": [
    {"topic": "<DEVE essere uno dei nomi dalla lista sotto>", "category": "<${categories}>", "score": <0-100>}
  ]
}

NOMI TOPIC VALIDI (usa SOLO questi nomi esatti):
${topicsSection}

CRITERI DI VALUTAZIONE:
${criteriaSection}

Sii onesto ma costruttivo. Il punteggio deve riflettere realisticamente la performance rispetto al livello di difficolta scelto.`;
}
