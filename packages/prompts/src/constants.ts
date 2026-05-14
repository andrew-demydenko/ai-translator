export const TRANSLATION_FIELDS = [
  { tag: "[FORMALITY]", key: "formality" },
  { tag: "[CONFIDENCE]", key: "confidence" },
  { tag: "[TRANSLATION]", key: "translation" },
  { tag: "[SYNONYMS]", key: "synonyms" },
  { tag: "[ALTERNATIVES]", key: "alternatives" },
  { tag: "[EXAMPLES]", key: "examples" },
  { tag: "[CONTEXT]", key: "contextNote" },
] as const;

export type TranslationFieldKey = (typeof TRANSLATION_FIELDS)[number]["key"];
