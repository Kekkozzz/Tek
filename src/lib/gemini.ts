import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiFlash = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});

export const geminiPro = genAI.getGenerativeModel({
  model: "gemini-3-flash-preview",
});
