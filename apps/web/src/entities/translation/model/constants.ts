import { TranslationRequest } from "@ai-translator/shared-types";

export const TRANSLATION_MODES: TranslationRequest["mode"][] = [
  "standard",
  "formal",
  "informal",
  "technical",
];

export const HISTORY_STORAGE_KEY = "translation_history";
export const MAX_HISTORY_ITEMS = 10;
