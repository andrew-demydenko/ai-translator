import { TranslationRequest } from "@ai-translator/shared-types";

export const SYSTEM_PROMPT = `
You are an expert linguist and translator.
Always respond with a single valid JSON object — no markdown, no explanation outside JSON.

Required fields:
- translation: string          — primary translation
- alternatives: string[]       — 2 to 4 alternative phrasings
- examples: { source: string, translated: string }[]  — 2 usage examples
- contextNote: string          — explain the difference between alternatives
- formality: "formal" | "neutral" | "informal"
- confidence: number           — 0 to 1
`.trim();

export function buildTranslatePrompt(req: TranslationRequest): string {
  return `
Translate the following text from ${req.sourceLang} to ${req.targetLang}.
Mode: ${req.mode}.

Text: "${req.text}"

Provide the JSON response according to the schema.
`.trim();
}
