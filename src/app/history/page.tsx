import Navbar from "@/components/layout/Navbar";

export default function HistoryPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="animate-fade-up">
          <span className="font-mono text-xs text-accent tracking-wide uppercase">
            Cronologia
          </span>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
            Le tue sessioni
          </h1>
          <p className="mt-3 text-text-secondary">
            Rivedi le interviste passate e i feedback ricevuti.
          </p>
        </div>

        {/* Empty state */}
        <div className="mt-16 flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-16 text-center">
          <div className="h-16 w-16 rounded-full bg-bg-elevated flex items-center justify-center mb-4">
            <span className="font-mono text-2xl text-text-muted">0</span>
          </div>
          <h3 className="font-display text-lg font-semibold text-text-primary">
            Nessuna sessione completata
          </h3>
          <p className="mt-2 max-w-sm text-sm text-text-secondary">
            Completa la tua prima simulazione di colloquio per vederla qui.
          </p>
        </div>
      </main>
    </>
  );
}
