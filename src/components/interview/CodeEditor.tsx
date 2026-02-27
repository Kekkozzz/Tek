"use client";

import { useRef, useCallback, useState, Suspense, lazy } from "react";
import type { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { Play, Square, Terminal, X } from "lucide-react";

const Editor = lazy(() => import("@monaco-editor/react"));

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
}

interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  error?: string;
}

function EditorLoading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-3 h-6 w-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-xs text-text-muted">Caricamento editor...</p>
      </div>
    </div>
  );
}

export default function CodeEditor({
  code,
  onChange,
  language = "typescriptreact",
}: CodeEditorProps) {
  const codeExecutionEnabled = process.env.NEXT_PUBLIC_CODE_EXECUTION_ENABLED === "true";
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [showOutput, setShowOutput] = useState(false);

  const handleEditorMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
    editor.focus();

    // Ctrl+Enter shortcut to run code (only if enabled)
    if (codeExecutionEnabled) {
      editor.addAction({
        id: "run-code",
        label: "Run Code",
        keybindings: [2048 /* CtrlCmd */ | 3 /* Enter */],
        run: () => {
          handleRunCode();
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeExecutionEnabled]);

  const handleRunCode = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setShowOutput(true);
    setResult(null);

    try {
      const res = await fetch("/api/code/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        stdout: "",
        stderr: "Errore di rete durante l'esecuzione.",
        exitCode: 1,
        error: "network_error",
      });
    } finally {
      setRunning(false);
    }
  }, [running, language, code]);

  const langLabel =
    language === "typescriptreact"
      ? "TSX"
      : language === "javascript"
        ? "JS"
        : language.toUpperCase();

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-text-secondary uppercase tracking-wide">
            Editor
          </span>
          <span className="rounded bg-bg-elevated px-2 py-0.5 font-mono text-[10px] text-text-muted border border-border">
            {langLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {codeExecutionEnabled && (
            <button
              onClick={handleRunCode}
              disabled={running}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-accent/10 border border-accent/20 px-3 py-1.5 font-mono text-[11px] font-semibold text-accent transition-all hover:bg-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {running ? (
                <>
                  <Square className="h-3 w-3 animate-pulse" />
                  Esecuzione...
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  Run
                  <kbd className="ml-1 rounded bg-accent/10 px-1 py-0.5 text-[9px] text-accent/60">
                    Ctrl+↵
                  </kbd>
                </>
              )}
            </button>
          )}
          <button
            onClick={() => onChange("")}
            className="cursor-pointer font-mono text-[10px] text-text-muted hover:text-text-secondary transition-colors px-2 py-1 rounded border border-border hover:border-border"
          >
            Reset
          </button>
        </div>
      </div>

      {/* AI reads code hint */}
      <div className="flex items-center gap-2 border-b border-border bg-accent/5 px-5 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        <span className="font-mono text-[11px] text-accent/80">
          L&apos;AI legge il tuo codice in automatico — scrivi e rispondi in chat, nessun invio necessario
        </span>
      </div>

      {/* Monaco Editor */}
      <div className={`overflow-hidden ${showOutput ? "flex-1 min-h-0" : "flex-1"}`}>
        <Suspense fallback={<EditorLoading />}>
          <Editor
            height="100%"
            defaultLanguage={language}
            value={code}
            onChange={(value) => onChange(value ?? "")}
            onMount={handleEditorMount}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              lineHeight: 22,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
              renderLineHighlight: "none",
              overviewRulerBorder: false,
              hideCursorInOverviewRuler: true,
              scrollbar: {
                verticalScrollbarSize: 6,
                horizontalScrollbarSize: 6,
              },
              tabSize: 2,
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </Suspense>
      </div>

      {/* Output Panel */}
      {showOutput && (
        <div className="border-t border-border bg-bg-primary">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border">
            <div className="flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5 text-text-muted" />
              <span className="font-mono text-[10px] text-text-secondary uppercase tracking-wide">
                Output
              </span>
              {result && (
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[9px] ${result.exitCode === 0
                    ? "bg-accent/10 text-accent"
                    : "bg-danger/10 text-danger"
                    }`}
                >
                  {result.exitCode === 0 ? "OK" : `Exit ${result.exitCode}`}
                </span>
              )}
            </div>
            <button
              onClick={() => { setShowOutput(false); setResult(null); }}
              className="cursor-pointer text-text-muted hover:text-text-secondary transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="max-h-40 overflow-y-auto px-4 py-3">
            {running ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-xs text-text-muted">Esecuzione in corso...</span>
              </div>
            ) : result ? (
              <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {result.stdout && (
                  <span className="text-text-primary">{result.stdout}</span>
                )}
                {result.stderr && (
                  <span className="text-danger">{result.stderr}</span>
                )}
                {!result.stdout && !result.stderr && (
                  <span className="text-text-muted">(nessun output)</span>
                )}
              </pre>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
