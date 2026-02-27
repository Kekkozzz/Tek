import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Creates a Gemini client using the provided API key or the env fallback.
 * Used by all API routes to support BYOK (Bring Your Own Key).
 */
export function createGeminiClient(apiKey?: string | null) {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY_MISSING");
  }
  return new GoogleGenerativeAI(key);
}

/**
 * Gets a Gemini Flash model instance with optional user API key.
 */
export function getGeminiModel(apiKey?: string | null) {
  const genAI = createGeminiClient(apiKey);
  return genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
}

/**
 * Extracts the user's Gemini API key from the request header.
 */
export function getApiKeyFromRequest(request: Request): string | null {
  return request.headers.get("x-gemini-key") || null;
}

// Legacy exports for backward compatibility
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const geminiFlash = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});

export const geminiPro = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});
