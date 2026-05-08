import {
  buildTranslatePrompt,
  getSystemPromptTemplate,
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
    console.log(buildTranslatePrompt(request));
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
    // 1. Translation
    const transMatch = text.match(/\[TRANSLATION\]\s*([\s\S]*?)(?=\[|$)/i);
    if (transMatch) {
      const val = transMatch[1].trim();
      if (val) onField("translation", val, text.includes("[ALTERNATIVES]"));
    }

    // 2. Alternatives
    const altMatch = text.match(/\[ALTERNATIVES\]\s*([\s\S]*?)(?=\[|$)/i);
    if (altMatch) {
      const val = altMatch[1].trim();
      if (val) {
        const items = val
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean);
        onField("alternatives", items, text.includes("[EXAMPLES]"));
      }
    }

    // 3. Examples
    const exMatch = text.match(/\[EXAMPLES\]\s*([\s\S]*?)(?=\[|$)/i);
    if (exMatch) {
      const val = exMatch[1].trim();
      if (val) {
        const items = val
          .split("|")
          .map((s) => {
            const parts = s.split("->").map((p) => p.trim());
            return { source: parts[0] || "", translated: parts[1] || "" };
          })
          .filter((item) => item.source || item.translated);
        onField("examples", items, text.includes("[CONTEXT]"));
      }
    }

    // 4. Context
    const ctxMatch = text.match(/\[CONTEXT\]\s*([\s\S]*?)(?=\[|$)/i);
    if (ctxMatch) {
      const val = ctxMatch[1].trim();
      if (val) onField("contextNote", val, text.includes("[FORMALITY]"));
    }

    // 5. Formality
    const formMatch = text.match(/\[FORMALITY\]\s*([\s\S]*?)(?=\[|$)/i);
    if (formMatch) {
      const val = formMatch[1].trim().toLowerCase();
      if (val) {
        const valid = ["formal", "neutral", "informal"].includes(val);
        onField(
          "formality",
          valid ? val : "neutral",
          text.includes("[CONFIDENCE]"),
        );
      }
    }

    // 6. Confidence
    const confMatch = text.match(/\[CONFIDENCE\]\s*([\s\S]*?)(?=\[|$)/i);
    if (confMatch) {
      const val = parseFloat(confMatch[1].trim());
      if (!isNaN(val)) onField("confidence", val, true);
    }
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
    };

    this.extractFields(content, (field, value) => {
      result[field] = value;
    });

    return result;
  }
}

export const translationService = new TranslationService();
