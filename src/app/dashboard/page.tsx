import Navbar from "@/components/layout/Navbar";

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="animate-fade-up">
          <span className="font-mono text-xs text-accent tracking-wide uppercase">
            Dashboard
          </span>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
            I tuoi progressi
          </h1>
          <p className="mt-3 text-text-secondary">
            Panoramica delle tue sessioni di colloquio e aree di miglioramento.
          </p>
        </div>

        {/* Placeholder stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Sessioni", value: "0", sub: "completate" },
            { label: "Punteggio Medio", value: "--", sub: "su 100" },
            { label: "Argomenti", value: "0", sub: "coperti" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-bg-secondary p-6"
            >
              <p className="font-mono text-xs text-text-secondary uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="mt-2 font-display text-4xl font-bold text-text-primary">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-text-muted">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Empty state */}
        <div className="mt-16 flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-16 text-center">
          <div className="h-16 w-16 rounded-full bg-bg-elevated flex items-center justify-center mb-4">
            <span className="font-mono text-2xl text-text-muted">?</span>
          </div>
          <h3 className="font-display text-lg font-semibold text-text-primary">
            Nessuna sessione ancora
          </h3>
          <p className="mt-2 max-w-sm text-sm text-text-secondary">
            Inizia la tua prima simulazione di colloquio per vedere i progressi
            qui.
          </p>
        </div>
      </main>
    </>
  );
}
