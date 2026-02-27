import type { TechTrack } from "@/types";
import { TRACK_PROMPT_DATA } from "./tracks-data";

/**
 * Builds a prompt for Gemini to generate a comprehensive knowledge article
 * for a specific topic within a tech track.
 */
export function buildKnowledgePrompt(track: TechTrack, category: string, topic: string): string {
    const trackData = TRACK_PROMPT_DATA[track];
    if (!trackData) throw new Error(`Unknown track: ${track}`);

    return `Sei un esperto ${trackData.roleDescription} italiano. 
Genera una scheda formativa completa sull'argomento "${topic}" (categoria: ${category}).

La scheda deve essere pensata per preparare un candidato a un colloquio tecnico.

Rispondi ESCLUSIVAMENTE con un JSON valido (senza markdown, senza backtick) con questa struttura:

{
  "title": "Titolo della scheda",
  "content": "Contenuto in Markdown con spiegazione chiara, esempi di codice, best practices. Usa ## per le sezioni. Almeno 500 parole.",
  "key_points": ["Punto chiave 1", "Punto chiave 2", "...fino a 5 punti"],
  "common_questions": [
    {"question": "Domanda tipica da colloquio?", "hint": "Suggerimento per rispondere"},
    {"question": "Altra domanda?", "hint": "Suggerimento"}
  ],
  "difficulty": "junior|mid|senior"
}

Requisiti:
- Scrivi in ITALIANO
- Il contenuto deve includere almeno 2 esempi di codice
- I key_points devono essere concisi e memorizzabili
- Le common_questions devono essere domande REALI da colloqui tecnici
- Usa un tono professionale ma accessibile
- Indica la difficoltà come "junior", "mid", o "senior"`;
}
