import { buildTranslatePrompt, SYSTEM_PROMPT } from "@ai-translator/prompts";
import { TranslationRequestDTO } from "../schemas/translation.schema";
import { ollamaService } from "./ollama.service";

export class TranslationService {
  /**
   * Translates text using streaming
   */
  async translateStream(request: TranslationRequestDTO, onChunk: (chunk: string) => void) {
    const stream = await ollamaService.chatStream([
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildTranslatePrompt(request) },
    ]);

    let fullContent = "";

    for await (const chunk of stream) {
      const content = chunk.message.content;
      fullContent += content;
      onChunk(content);
    }

    return this.parseTranslationResult(fullContent);
  }

  /**
   * Parses the raw LLM response (assuming it's JSON)
   */
  private parseTranslationResult(content: string) {
    try {
      // Clean content if needed (e.g. remove markdown code blocks)
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      return JSON.parse(cleanContent);
    } catch (error) {
      console.error("Failed to parse translation result:", content);
      throw new Error("Invalid JSON response from translation engine");
    }
  }
}

export const translationService = new TranslationService();
