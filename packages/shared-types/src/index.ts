export interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
  mode?: "standard" | "formal" | "informal" | "technical";
  contextLanguage?: string;
  level?: string;
  wordCountRange?: string;
  generationType: "practice" | "translation";
}

export interface SentenceExample {
  source: string;
  translated: string;
}

export interface TranslationResult {
  translation: string;
  synonyms: string[]; // 2–4 variants
  alternatives: string[]; // 2–4 variants
  examples: SentenceExample[]; // sentences with context
  contextNote: string; // explanation of differences
  formality: "formal" | "neutral" | "informal";
  confidence: number;
}

export interface PracticeResult {
  original: string;
  translation: string;
}

export type GenerationMode = keyof ResultTypeMap;

interface ResultTypeMap {
  translation: TranslationResult;
  practice: PracticeResult;
}

export type ResultByType<T extends keyof ResultTypeMap> = ResultTypeMap[T];

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
