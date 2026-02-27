"use client";

import { useRef, useCallback, Suspense, lazy } from "react";
import type { OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

const Editor = lazy(() => import("@monaco-editor/react"));

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
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
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
    editor.focus();
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-text-secondary uppercase tracking-wide">
            Editor
          </span>
          <span className="rounded bg-bg-elevated px-2 py-0.5 font-mono text-[10px] text-text-muted border border-border">
            {language === "typescriptreact"
              ? "TSX"
              : language === "javascript"
                ? "JS"
                : language.toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => onChange("")}
          className="cursor-pointer font-mono text-[10px] text-text-muted hover:text-text-secondary transition-colors px-2 py-1 rounded border border-border hover:border-border"
        >
          Reset
        </button>
      </div>

      {/* AI reads code hint */}
      <div className="flex items-center gap-2 border-b border-border bg-accent/5 px-5 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
        <span className="font-mono text-[11px] text-accent/80">
          L&apos;AI legge il tuo codice in automatico — scrivi e rispondi in chat, nessun invio necessario
        </span>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
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
    </div>
  );
}
