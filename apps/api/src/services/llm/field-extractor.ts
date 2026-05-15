import { TRANSLATION_FIELDS, PRACTICE_FIELDS } from "@ai-translator/prompts";

type FieldConfig = { tag: string; key: string };

const FIELDS_BY_TYPE: Record<string, readonly FieldConfig[]> = {
  translation: TRANSLATION_FIELDS,
  practice: PRACTICE_FIELDS,
};

function escapeTag(tag: string): string {
  return tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseValue(key: string, raw: string): any {
  if (key === "alternatives" || key === "synonyms") {
    return raw
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  if (key === "examples") {
    return raw
      .split("|")
      .map((s) => {
        const parts = s.split("->").map((p) => p.trim());
        return { source: parts[0] || "", translated: parts[1] || "" };
      })
      .filter((item: any) => item.source || item.translated);
  }

  if (key === "confidence") {
    const val = parseFloat(raw);
    return isNaN(val) ? undefined : val;
  }

  if (key === "formality") {
    const val = raw.toLowerCase();
    if (!["formal", "neutral", "informal"].includes(val)) {
      return "neutral";
    }
    return val;
  }

  return raw;
}

function createDefaultResult(generationType: string): Record<string, any> {
  if (generationType === "practice") {
    return { original: "", translation: "" };
  }
  return {
    translation: "",
    alternatives: [],
    examples: [],
    contextNote: "",
    formality: "neutral",
    confidence: 1,
    synonyms: [],
  };
}

export interface ExtractionResult {
  values: Record<string, any>;
  isFieldComplete: Record<string, boolean>;
  allComplete: boolean;
}

export class FieldExtractor {
  private fields: readonly FieldConfig[];
  private defaultResult: Record<string, any>;

  constructor(generationType: string) {
    this.fields = FIELDS_BY_TYPE[generationType] || TRANSLATION_FIELDS;
    this.defaultResult = createDefaultResult(generationType);
  }

  extract(text: string): ExtractionResult {
    const values: Record<string, any> = {};
    const isFieldComplete: Record<string, boolean> = {};
    let resolvedCount = 0;

    this.fields.forEach((fieldConfig, index) => {
      const { tag, key } = fieldConfig;
      const nextField = this.fields[index + 1];

      const escapedTag = escapeTag(tag);
      const match = text.match(
        new RegExp(`${escapedTag}\\s*([\\s\\S]*?)(?=\\[|$)`, "i"),
      );

      if (match) {
        const raw = match[1].trim();
        if (!raw) return;

        const value = parseValue(key, raw);
        if (value === undefined) return;

        values[key] = value;

        const complete = nextField ? text.includes(nextField.tag) : true;
        isFieldComplete[key] = complete;

        if (complete) {
          resolvedCount++;
        }
      }
    });

    return {
      values: { ...this.defaultResult, ...values },
      isFieldComplete,
      allComplete: resolvedCount >= this.fields.length,
    };
  }
}
