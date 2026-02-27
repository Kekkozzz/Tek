import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen gradient-mesh overflow-hidden">
      {/* Hero */}
      <div className="relative mx-auto max-w-5xl px-6 pt-32 pb-20">
        {/* Badge */}
        <div className="animate-fade-up stagger-1 mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-bg-secondary/50 px-4 py-1.5 backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs text-text-secondary tracking-wide">
            AI-POWERED INTERVIEW PREP
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up stagger-2 font-display text-6xl font-bold leading-[1.1] tracking-tight md:text-7xl lg:text-8xl">
          Supera il tuo
          <br />
          <span className="text-accent">colloquio</span>
          <br />
          <span className="text-text-secondary">tecnico.</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-up stagger-3 mt-8 max-w-xl text-lg leading-relaxed text-text-secondary">
          Simulazioni di colloquio realistiche con AI. Scrivi codice, rispondi a
          domande tecniche e ricevi feedback dettagliato — come un vero
          intervistatore senior.
        </p>

        {/* CTA */}
        <div className="animate-fade-up stagger-4 mt-10 flex flex-wrap gap-4">
          <Link
            href="/interview"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3 font-mono text-sm font-semibold uppercase tracking-wide text-bg-primary transition-all duration-200 hover:brightness-110 glow-border"
          >
            Inizia Intervista
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-bg-secondary px-7 py-3 font-mono text-sm tracking-wide text-text-secondary transition-all duration-200 hover:border-accent/30 hover:text-text-primary"
          >
            Dashboard
          </Link>
        </div>

        {/* Feature cards */}
        <div className="animate-fade-up stagger-5 mt-24 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: "01",
              title: "Mock Interview",
              desc: "Chat in tempo reale con un intervistatore AI che adatta le domande al tuo livello",
            },
            {
              icon: "02",
              title: "Live Code Editor",
              desc: "Scrivi codice React/JS in un editor professionale mentre l'AI analizza il tuo approccio",
            },
            {
              icon: "03",
              title: "Report Dettagliato",
              desc: "Punteggio, punti di forza e aree di miglioramento dopo ogni sessione",
            },
          ].map((feature) => (
            <div
              key={feature.icon}
              className="group rounded-xl border border-border bg-bg-secondary/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent/20 hover:bg-bg-elevated/50"
            >
              <span className="inline-block font-mono text-xs text-accent/60 mb-3">
                {feature.icon}
              </span>
              <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent" />
    </div>
  );
}
