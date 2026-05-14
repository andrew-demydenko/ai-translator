export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
  mode: "standard" | "formal" | "informal" | "technical";
  contextLanguage: string;
  level?: string;
  wordCountRange?: string;
}

export interface SentenceExample {
  source: string;
  translated: string;
}

export interface TranslationResult {
  translation: string;
  originalText?: string; // For generated sentences
  synonyms: string[]; // 2–4 variants
  alternatives: string[]; // 2–4 variants
  examples: SentenceExample[]; // sentences with context
  contextNote: string; // explanation of differences
  formality: "formal" | "neutral" | "informal";
  confidence: number;
}

export interface WSMessage<T = unknown> {
  type: "translate" | "chunk" | "done" | "error" | "field_update";
  requestId: string;
  payload: T;
}

export interface FieldUpdatePayload {
  field: keyof TranslationResult;
  value: any;
  isComplete: boolean;
}
