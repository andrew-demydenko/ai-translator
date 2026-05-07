export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
  mode: "standard" | "formal" | "informal" | "technical";
}

export interface SentenceExample {
  source: string;
  translated: string;
}

export interface TranslationResult {
  translation: string;
  alternatives: string[]; // 2–4 variants
  examples: SentenceExample[]; // sentences with context
  contextNote: string; // explanation of differences
  formality: "formal" | "neutral" | "informal";
  confidence: number;
}

export interface WSMessage<T = unknown> {
  type: "translate" | "chunk" | "done" | "error";
  requestId: string;
  payload: T;
}
