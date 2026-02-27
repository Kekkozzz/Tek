"use client";

import { useState, useEffect } from "react";
import { useApiKey } from "@/hooks/useApiKey";
import { X, Key, ExternalLink, Check, AlertCircle, Loader2, Eye, EyeOff, Trash2, Lightbulb } from "lucide-react";

interface ApiKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
    const { apiKey, setApiKey, clearApiKey, hasKey } = useApiKey();
    const [inputKey, setInputKey] = useState("");
    const [showKey, setShowKey] = useState(false);
    const [validating, setValidating] = useState(false);
    const [result, setResult] = useState<{ valid: boolean; error?: string } | null>(null);
    const [step, setStep] = useState<"guide" | "input">(hasKey ? "input" : "guide");

    useEffect(() => {
        if (isOpen) {
            setInputKey("");
            setResult(null);
            setStep(hasKey ? "input" : "guide");
        }
    }, [isOpen, hasKey]);

    async function handleValidate() {
        const key = inputKey.trim();
        if (!key) return;

        setValidating(true);
        setResult(null);

        try {
            const res = await fetch("/api/validate-key", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ apiKey: key }),
            });
            const data = await res.json();

            if (data.valid) {
                setApiKey(key);
                setResult({ valid: true });
            } else {
                setResult({ valid: false, error: data.error });
            }
        } catch {
            setResult({ valid: false, error: "Errore di rete. Riprova." });
        } finally {
            setValidating(false);
        }
    }

    function handleRemoveKey() {
        clearApiKey();
        setInputKey("");
        setResult(null);
        setStep("guide");
    }

    function maskedKey(key: string) {
        if (key.length <= 8) return "••••••••";
        return key.slice(0, 4) + "••••••••" + key.slice(-4);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-lg rounded-2xl border border-border bg-bg-secondary shadow-2xl animate-fade-up">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10">
                            <Key className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                            <h2 className="font-display text-lg font-bold text-text-primary">
                                Chiave API Gemini
                            </h2>
                            <p className="text-xs text-text-muted">
                                {hasKey ? "Chiave configurata" : "Configura la tua chiave"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="cursor-pointer rounded-lg p-2 text-text-muted hover:bg-bg-elevated hover:text-text-primary transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5">
                    {/* Current key status */}
                    {hasKey && (
                        <div className="flex items-center justify-between rounded-xl border border-accent/20 bg-accent/5 p-4">
                            <div className="flex items-center gap-3">
                                <Check className="h-4 w-4 text-accent" />
                                <div>
                                    <p className="text-sm font-semibold text-text-primary">Chiave attiva</p>
                                    <p className="font-mono text-xs text-text-muted">{maskedKey(apiKey!)}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleRemoveKey}
                                className="cursor-pointer flex items-center gap-1.5 rounded-lg border border-danger/20 bg-danger/5 px-3 py-1.5 font-mono text-xs text-danger hover:bg-danger/10 transition-colors"
                            >
                                <Trash2 className="h-3 w-3" />
                                Rimuovi
                            </button>
                        </div>
                    )}

                    {/* Guide */}
                    {step === "guide" && !hasKey && (
                        <div className="space-y-4">
                            <div className="rounded-xl border border-border bg-bg-elevated p-4 space-y-3">
                                <h3 className="font-display text-base font-semibold text-text-primary">
                                    Come ottenere la chiave
                                </h3>
                                <ol className="space-y-2.5 text-sm text-text-secondary">
                                    <li className="flex gap-3">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-bold text-accent">1</span>
                                        <span>
                                            Vai su{" "}
                                            <a
                                                href="https://aistudio.google.com/apikey"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-accent hover:underline"
                                            >
                                                Google AI Studio <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-bold text-accent">2</span>
                                        <span>Accedi con il tuo account Google</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-bold text-accent">3</span>
                                        <span>Clicca <strong>&quot;Create API Key&quot;</strong> e copia la chiave generata</span>
                                    </li>
                                </ol>

                                <div className="rounded-lg bg-bg-primary/50 border border-border px-3 py-2 flex items-start gap-2">
                                    <Lightbulb className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                                    <p className="text-xs text-text-muted">
                                        Il piano gratuito di Gemini include generose quote giornaliere. La tua chiave resta salvata solo nel tuo browser.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep("input")}
                                className="cursor-pointer w-full rounded-lg bg-accent px-4 py-3 font-mono text-sm font-semibold uppercase tracking-wide text-bg-primary transition-all hover:brightness-110 glow-border"
                            >
                                Ho la chiave, inseriscila
                            </button>
                        </div>
                    )}

                    {/* Input */}
                    {(step === "input" || hasKey) && (
                        <div className="space-y-3">
                            {!hasKey && (
                                <button
                                    onClick={() => setStep("guide")}
                                    className="cursor-pointer text-xs text-accent hover:underline"
                                >
                                    ← Come ottenere la chiave
                                </button>
                            )}

                            <div>
                                <label className="block font-mono text-xs text-text-muted uppercase tracking-wide mb-2">
                                    {hasKey ? "Sostituisci chiave" : "Inserisci la tua API Key"}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showKey ? "text" : "password"}
                                        value={inputKey}
                                        onChange={(e) => { setInputKey(e.target.value); setResult(null); }}
                                        placeholder="AIza..."
                                        className="w-full rounded-lg border border-border bg-bg-elevated px-4 py-3 pr-10 font-mono text-sm text-text-primary placeholder:text-text-muted focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/20 transition-colors"
                                    />
                                    <button
                                        onClick={() => setShowKey(!showKey)}
                                        className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                                    >
                                        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Validation result */}
                            {result && (
                                <div
                                    className={`flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${result.valid
                                        ? "border-accent/20 bg-accent/5 text-accent"
                                        : "border-danger/20 bg-danger/5 text-danger"
                                        }`}
                                >
                                    {result.valid ? (
                                        <Check className="h-4 w-4 mt-0.5 shrink-0" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                                    )}
                                    <span>{result.valid ? "Chiave verificata e salvata!" : result.error}</span>
                                </div>
                            )}

                            <button
                                onClick={handleValidate}
                                disabled={validating || !inputKey.trim()}
                                className="cursor-pointer w-full rounded-lg bg-accent px-4 py-3 font-mono text-sm font-semibold uppercase tracking-wide text-bg-primary transition-all hover:brightness-110 glow-border disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {validating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Verifica in corso...
                                    </>
                                ) : (
                                    "Verifica e Salva"
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
