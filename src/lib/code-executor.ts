/**
 * Piston API client for server-side code execution
 * https://github.com/engineer-man/piston
 *
 * Uses the public Piston API by default. Set PISTON_API_URL env var to use your own instance.
 */

const PISTON_API_URL = process.env.PISTON_API_URL || "https://emkc.org/api/v2/piston";
const PISTON_API_KEY = process.env.PISTON_API_KEY || "";

/** Map our internal language IDs to Piston language/version */
const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
    // Frontend
    javascript: { language: "javascript", version: "18.15.0" },
    typescript: { language: "typescript", version: "5.0.3" },

    // Backend
    java: { language: "java", version: "15.0.2" },
    python: { language: "python", version: "3.10.0" },
    csharp: { language: "csharp", version: "6.12.0" },
    go: { language: "go", version: "1.16.2" },
    php: { language: "php", version: "8.2.3" },

    // Low-level
    c: { language: "c", version: "10.2.0" },
    cpp: { language: "c++", version: "10.2.0" },
    rust: { language: "rust", version: "1.68.2" },

    // Data
    sql: { language: "sqlite3", version: "3.36.0" },

    // Scripting
    ruby: { language: "ruby", version: "3.0.1" },
    bash: { language: "bash", version: "5.2.0" },
    swift: { language: "swift", version: "5.3.3" },
    kotlin: { language: "kotlin", version: "1.8.20" },
    dart: { language: "dart", version: "2.19.6" },
};

export interface CodeExecutionResult {
    stdout: string;
    stderr: string;
    exitCode: number;
    executionTime: number;
    language: string;
    error?: string;
}

export interface CodeExecutionRequest {
    language: string;
    code: string;
    stdin?: string;
}

/**
 * Resolve our internal language ID to a Piston-compatible language.
 * Falls back to using the language ID directly if not in the map.
 */
export function resolvePistonLanguage(langId: string): { language: string; version: string } | null {
    return LANGUAGE_MAP[langId.toLowerCase()] ?? null;
}

/**
 * Get all supported languages for code execution
 */
export function getSupportedLanguages(): string[] {
    return Object.keys(LANGUAGE_MAP);
}

/**
 * Execute code using the Piston API
 */
export async function executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResult> {
    const pistonLang = resolvePistonLanguage(request.language);

    if (!pistonLang) {
        return {
            stdout: "",
            stderr: `Linguaggio "${request.language}" non supportato per l'esecuzione.`,
            exitCode: 1,
            executionTime: 0,
            language: request.language,
            error: "unsupported_language",
        };
    }

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000); // 15s timeout

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };
        if (PISTON_API_KEY) {
            headers["Authorization"] = PISTON_API_KEY;
        }

        const response = await fetch(`${PISTON_API_URL}/execute`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                language: pistonLang.language,
                version: pistonLang.version,
                files: [
                    {
                        name: `main`,
                        content: request.code,
                    },
                ],
                stdin: request.stdin || "",
                run_timeout: 10000, // 10s max execution
                compile_timeout: 10000,
                compile_memory_limit: 256000000, // 256MB
                run_memory_limit: 256000000,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const errorText = await response.text().catch(() => "Unknown error");
            return {
                stdout: "",
                stderr: `Errore Piston API: ${response.status} — ${errorText}`,
                exitCode: 1,
                executionTime: 0,
                language: request.language,
                error: "api_error",
            };
        }

        const result = await response.json();

        // Piston returns { run: { stdout, stderr, code, signal, output }, compile?: { ... } }
        const run = result.run || {};
        const compile = result.compile || {};

        // If compilation failed, show compile errors
        if (compile.stderr) {
            return {
                stdout: compile.stdout || "",
                stderr: compile.stderr,
                exitCode: compile.code ?? 1,
                executionTime: 0,
                language: request.language,
                error: "compilation_error",
            };
        }

        return {
            stdout: run.stdout || "",
            stderr: run.stderr || "",
            exitCode: run.code ?? 0,
            executionTime: 0, // Piston doesn't return precise timing
            language: request.language,
        };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";

        if (message.includes("abort")) {
            return {
                stdout: "",
                stderr: "Timeout: l'esecuzione ha superato il limite di 15 secondi.",
                exitCode: 1,
                executionTime: 15000,
                language: request.language,
                error: "timeout",
            };
        }

        return {
            stdout: "",
            stderr: `Errore di esecuzione: ${message}`,
            exitCode: 1,
            executionTime: 0,
            language: request.language,
            error: "execution_error",
        };
    }
}
