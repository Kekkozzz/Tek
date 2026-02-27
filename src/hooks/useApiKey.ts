"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "gemini_api_key";

/**
 * Hook for managing the user's Gemini API key in localStorage.
 */
export function useApiKey() {
    const [apiKey, setApiKeyState] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        setApiKeyState(stored);
        setLoaded(true);

        const handleKeyChange = (e: Event) => {
            const customEvent = e as CustomEvent;
            setApiKeyState(customEvent.detail);
        };

        window.addEventListener("gemini_api_key_changed", handleKeyChange);
        return () => window.removeEventListener("gemini_api_key_changed", handleKeyChange);
    }, []);

    const setApiKey = useCallback((key: string) => {
        localStorage.setItem(STORAGE_KEY, key);
        setApiKeyState(key);
        window.dispatchEvent(new CustomEvent("gemini_api_key_changed", { detail: key }));
    }, []);

    const clearApiKey = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setApiKeyState(null);
        window.dispatchEvent(new CustomEvent("gemini_api_key_changed", { detail: null }));
    }, []);

    return {
        apiKey,
        hasKey: !!apiKey,
        loaded,
        setApiKey,
        clearApiKey,
    };
}

/**
 * Returns the stored API key from localStorage (for use outside React components).
 */
export function getStoredApiKey(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(STORAGE_KEY);
}

/**
 * Wrapper around fetch() that automatically adds the x-gemini-key header.
 */
export async function fetchWithKey(
    url: string,
    options: RequestInit = {}
): Promise<Response> {
    const apiKey = getStoredApiKey();
    const headers = new Headers(options.headers);

    if (apiKey) {
        headers.set("x-gemini-key", apiKey);
    }

    return fetch(url, { ...options, headers });
}
