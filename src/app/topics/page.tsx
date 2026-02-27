import Navbar from "@/components/layout/Navbar";

const TOPIC_CATEGORIES = [
  {
    name: "React",
    color: "accent",
    topics: [
      "Hooks",
      "State Management",
      "Component Patterns",
      "Performance",
      "Context API",
      "Server Components",
    ],
  },
  {
    name: "JavaScript",
    color: "indigo",
    topics: [
      "Closures",
      "Promises & Async",
      "Prototypes",
      "ES6+",
      "Event Loop",
      "Type Coercion",
    ],
  },
  {
    name: "Next.js",
    color: "warning",
    topics: [
      "App Router",
      "Server Actions",
      "Middleware",
      "SSR/SSG/ISR",
      "API Routes",
      "Caching",
    ],
  },
  {
    name: "CSS",
    color: "danger",
    topics: [
      "Flexbox",
      "Grid",
      "Responsive Design",
      "Animations",
      "Tailwind",
      "CSS-in-JS",
    ],
  },
  {
    name: "Testing",
    color: "accent",
    topics: [
      "Unit Testing",
      "React Testing Library",
      "E2E (Playwright)",
      "Mocking",
      "Test Patterns",
    ],
  },
];

export default function TopicsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="animate-fade-up">
          <span className="font-mono text-xs text-accent tracking-wide uppercase">
            Argomenti
          </span>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
            Mappa delle competenze
          </h1>
          <p className="mt-3 text-text-secondary">
            Traccia la tua padronanza su ogni argomento tecnico.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOPIC_CATEGORIES.map((category, i) => (
            <div
              key={category.name}
              className={`animate-fade-up stagger-${i + 1} rounded-xl border border-border bg-bg-secondary p-6`}
            >
              <h2 className="font-display text-xl font-semibold text-text-primary mb-4">
                {category.name}
              </h2>
              <div className="space-y-3">
                {category.topics.map((topic) => (
                  <div key={topic} className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">{topic}</span>
                    <div className="flex items-center gap-2">
                      {/* Mastery bar placeholder */}
                      <div className="h-1.5 w-16 rounded-full bg-bg-elevated overflow-hidden">
                        <div
                          className="h-full rounded-full bg-text-muted"
                          style={{ width: "0%" }}
                        />
                      </div>
                      <span className="font-mono text-xs text-text-muted">
                        --
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
