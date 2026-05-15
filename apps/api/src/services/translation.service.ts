import {
  buildTranslatePrompt,
  getSystemPromptTemplate,
  TRANSLATION_FIELDS,
  PRACTICE_FIELDS,
} from "@ai-translator/prompts";
import { TranslationRequestDTO } from "../schemas/translation.schema";
import { PracticeRequestDTO } from "../schemas/practice.schema";
import { OllamaService, ollamaService } from "./ollama.service";
import { DeepSeekService, deepseekService } from "./deepseek.service";
import { WSMessage, FieldUpdatePayload } from "@ai-translator/shared-types";

export type TranslationProvider = OllamaService | DeepSeekService;

const translationProviders: Record<string, TranslationProvider> = {
  ollama: ollamaService,
  deepseek: deepseekService,
};

export function getTranslationProvider(provider: string) {
  return translationProviders[provider];
}

type FieldConfig = { tag: string; key: string };

export class TranslationService {
  provider: TranslationProvider;
  constructor(provider: TranslationProvider) {
    this.provider = provider;
  }

  async translateStream(
    request: TranslationRequestDTO | PracticeRequestDTO,
    onEvent: (event: Omit<WSMessage<any>, "requestId">) => void,
  ) {
    const messages = [
      { role: "system" as const, content: getSystemPromptTemplate(request) },
      { role: "user" as const, content: buildTranslatePrompt(request) },
    ];

    const stream = await this.provider.chatStream(messages);

    let fullContent = "";
    const lastEmitted: Record<string, any> = {};
    const fields =
      request.generationType === "practice"
        ? PRACTICE_FIELDS
        : TRANSLATION_FIELDS;

    for await (const chunk of stream) {
      const content = chunk.message.content;
      fullContent += content;

      onEvent({ type: "chunk", payload: content });

      this.extractFields(fullContent, fields, (field, value, isComplete) => {
        const valueStr = JSON.stringify(value);
        if (lastEmitted[field] !== valueStr) {
          lastEmitted[field] = valueStr;
          onEvent({
            type: "field_update",
            payload: { field, value, isComplete } as FieldUpdatePayload,
          });
        }
      });
    }

    return this.parseResult(fullContent, request);
  }

  private extractFields(
    text: string,
    fields: readonly FieldConfig[],
    onField: (field: string, value: any, isComplete: boolean) => void,
  ) {
    fields.forEach((fieldConfig, index) => {
      const { tag, key } = fieldConfig;
      const nextField = fields[index + 1];
      const isComplete = nextField ? text.includes(nextField.tag) : true;

      const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const match = text.match(
        new RegExp(`${escapedTag}\\s*([\\s\\S]*?)(?=\\[|$)`, "i"),
      );

      if (match) {
        let val: any = match[1].trim();
        if (!val) return;

        if (key === "alternatives" || key === "synonyms") {
          val = val
            .split("|")
            .map((s: string) => s.trim())
            .filter(Boolean);
        } else if (key === "examples") {
          val = val
            .split("|")
            .map((s: string) => {
              const parts = s.split("->").map((p) => p.trim());
              return { source: parts[0] || "", translated: parts[1] || "" };
            })
            .filter((item: any) => item.source || item.translated);
        } else if (key === "confidence") {
          val = parseFloat(val);
          if (isNaN(val)) return;
        } else if (key === "formality") {
          val = val.toLowerCase();
          if (!["formal", "neutral", "informal"].includes(val)) {
            val = "neutral";
          }
        }

        onField(key, val, isComplete);
      }
    });
  }

  private parseTranslationResult(content: string) {
    const result: Record<string, any> = {
      translation: "",
      alternatives: [],
      examples: [],
      contextNote: "",
      formality: "neutral",
      confidence: 1,
      synonyms: [],
    };

    this.extractFields(content, TRANSLATION_FIELDS, (field, value) => {
      result[field] = value;
    });

    return result;
  }

  private parsePracticeResult(content: string) {
    const result: Record<string, any> = {
      original: "",
      translation: "",
    };

    this.extractFields(content, PRACTICE_FIELDS, (field, value) => {
      result[field] = value;
    });

    return result;
  }

  private parseResult(
    content: string,
    request: TranslationRequestDTO | PracticeRequestDTO,
  ) {
    if (request.generationType === "practice") {
      return this.parsePracticeResult(content);
    } else if (request.generationType === "translation") {
      return this.parseTranslationResult(content);
    }
  }
}

export default TranslationService;
