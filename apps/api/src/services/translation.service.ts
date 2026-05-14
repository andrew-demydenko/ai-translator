import {
  buildTranslatePrompt,
  getSystemPromptTemplate,
  TRANSLATION_FIELDS,
} from "@ai-translator/prompts";
import { TranslationRequestDTO } from "../schemas/translation.schema";
import { ollamaService } from "./ollama.service";
import { WSMessage, FieldUpdatePayload } from "@ai-translator/shared-types";

export class TranslationService {
  /**
   * Translates text using streaming and emits field updates
   */
  async translateStream(
    request: TranslationRequestDTO,
    onEvent: (event: Omit<WSMessage<any>, "requestId">) => void,
  ) {
    const stream = await ollamaService.chatStream([
      { role: "system", content: getSystemPromptTemplate(request) },
      { role: "user", content: buildTranslatePrompt(request) },
    ]);

    let fullContent = "";
    const lastEmitted: Record<string, any> = {};

    for await (const chunk of stream) {
      const content = chunk.message.content;
      fullContent += content;

      // Always send the raw chunk for backward compatibility or debugging
      onEvent({ type: "chunk", payload: content });

      // Try to extract fields and emit updates
      this.extractFields(fullContent, (field, value, isComplete) => {
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

    return this.parseTranslationResult(fullContent);
  }

  /**
   * Extracts fields from partial response string using delimited format
   */
  private extractFields(
    text: string,
    onField: (field: string, value: any, isComplete: boolean) => void,
  ) {
    TRANSLATION_FIELDS.forEach((fieldConfig, index) => {
      const { tag, key } = fieldConfig;
      const nextField = TRANSLATION_FIELDS[index + 1];
      const isComplete = nextField ? text.includes(nextField.tag) : true;

      // Escape special characters in tag for regex
      const escapedTag = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const match = text.match(
        new RegExp(`${escapedTag}\\s*([\\s\\S]*?)(?=\\[|$)`, "i"),
      );

      if (match) {
        let val: any = match[1].trim();
        if (!val) return;

        // Specialized parsing logic per key
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

  /**
   * Parses the raw LLM response in delimited format
   */
  private parseTranslationResult(content: string) {
    const result: any = {
      translation: "",
      alternatives: [],
      examples: [],
      contextNote: "",
      formality: "neutral",
      confidence: 1,
      synonyms: [],
    };

    this.extractFields(content, (field, value) => {
      result[field] = value;
    });

    return result;
  }
}

export const translationService = new TranslationService();
