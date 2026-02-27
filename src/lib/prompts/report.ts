export function buildReportPrompt(messages: string): string {
  return `Analizza questa sessione di colloquio tecnico e genera un report di valutazione dettagliato.

SESSIONE:
${messages}

Rispondi ESCLUSIVAMENTE in formato JSON valido con questa struttura:
{
  "score": <numero da 0 a 100>,
  "strengths": [<array di 2-4 punti di forza specifici>],
  "improvements": [<array di 2-4 aree di miglioramento specifiche>],
  "summary": "<riassunto di 2-3 frasi della performance complessiva>",
  "topics_evaluated": [
    {"topic": "<nome argomento>", "category": "<React|JavaScript|Next.js|CSS|Testing>", "score": <0-100>}
  ]
}

CRITERI DI VALUTAZIONE:
- Correttezza tecnica delle risposte
- Qualita del codice (se presente): leggibilita, best practices, performance
- Capacita di ragionamento e problem solving
- Chiarezza nella comunicazione
- Conoscenza di React, Next.js, JavaScript, TypeScript

Sii onesto ma costruttivo. Il punteggio deve riflettere realisticamente la performance rispetto al livello di difficolta scelto.`;
}
