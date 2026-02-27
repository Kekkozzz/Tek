"use client";

interface TopicData {
  topic: string;
  category: string;
  mastery_level: number;
  sessions_count: number;
}

interface WeakAreasProps {
  topics: TopicData[];
}

export default function WeakAreas({ topics }: WeakAreasProps) {
  const weak = [...topics]
    .sort((a, b) => a.mastery_level - b.mastery_level)
    .slice(0, 5);

  const strong = [...topics]
    .sort((a, b) => b.mastery_level - a.mastery_level)
    .slice(0, 5);

  if (topics.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-bg-secondary p-6">
        <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wide mb-4">
          Aree da migliorare
        </h3>
        <p className="text-sm text-text-muted">
          Completa qualche sessione per vedere le tue aree di forza e debolezza.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-6">
      <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wide mb-4">
        Competenze
      </h3>
      <div className="space-y-5">
        {/* Weak areas */}
        {weak.length > 0 && (
          <div>
            <p className="font-mono text-[10px] text-warning uppercase tracking-wider mb-2">
              Da migliorare
            </p>
            <div className="space-y-2">
              {weak.map((t) => (
                <div key={t.topic} className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary flex-1 truncate">
                    {t.topic}
                  </span>
                  <div className="h-1.5 w-20 rounded-full bg-bg-elevated overflow-hidden">
                    <div
                      className="h-full rounded-full bg-warning transition-all duration-500"
                      style={{ width: `${t.mastery_level}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-text-muted w-8 text-right">
                    {t.mastery_level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Strong areas */}
        {strong.length > 0 && (
          <div>
            <p className="font-mono text-[10px] text-accent uppercase tracking-wider mb-2">
              Punti di forza
            </p>
            <div className="space-y-2">
              {strong.map((t) => (
                <div key={t.topic} className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary flex-1 truncate">
                    {t.topic}
                  </span>
                  <div className="h-1.5 w-20 rounded-full bg-bg-elevated overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${t.mastery_level}%` }}
                    />
                  </div>
                  <span className="font-mono text-xs text-text-muted w-8 text-right">
                    {t.mastery_level}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
