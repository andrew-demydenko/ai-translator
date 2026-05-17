import { getSystemPromptTemplate, buildPrompt } from "@ai-translator/prompts";
import { TranslationRequestDTO } from "../../schemas/translation.schema";
import { PracticeRequestDTO } from "../../schemas/practice.schema";
import { WSMessage, FieldUpdatePayload } from "@ai-translator/shared-types";
import { TranslationProvider } from "../providers/types";
import { FieldExtractor } from "./field-extractor";

export class LLMService {
  private provider: TranslationProvider;

  constructor(provider: TranslationProvider) {
    this.provider = provider;
  }

  async generateStream(
    request: TranslationRequestDTO | PracticeRequestDTO,
    onEvent: (event: Omit<WSMessage<any>, "requestId">) => void,
  ) {
    const messages = [
      { role: "system" as const, content: getSystemPromptTemplate(request) },
      { role: "user" as const, content: buildPrompt(request) },
    ];

    const stream = await this.provider.chatStream(messages);

    const extractor = new FieldExtractor(request.generationType);
    let fullContent = "";
    const lastEmitted: Record<string, string> = {};
    let lastResult: Record<string, {} | null> = {};

    for await (const chunk of stream) {
      const content = chunk.message.content;
      fullContent += content;

      onEvent({ type: "chunk", payload: content });

      const extraction = extractor.extract(fullContent);
      lastResult = extraction.values;

      for (const field of Object.keys(extraction.values)) {
        const valueStr = JSON.stringify(extraction.values[field]);
        if (lastEmitted[field] !== valueStr) {
          lastEmitted[field] = valueStr;
          onEvent({
            type: "field_update",
            payload: {
              field,
              value: extraction.values[field],
              isComplete: extraction.isFieldComplete[field] ?? false,
            } as FieldUpdatePayload,
          });
        }
      }
    }

    return lastResult;
  }
}
