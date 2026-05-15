import OpenAI from "openai";
import type { ChatCompletionCreateParamsStreaming } from "openai/resources/chat/completions";
import { config } from "../config";

type DeepSeekChatParams = ChatCompletionCreateParamsStreaming & {
  thinking?: { type: "enabled" | "disabled" };
};

export class DeepSeekService {
  private provider: OpenAI;

  constructor() {
    this.provider = new OpenAI({
      baseURL: config.host,
      apiKey: config.apiKey,
    });
  }

  async checkHealth() {
    try {
      // Simple check to see if we can reach the API
      // Note: DeepSeek might not have a /health endpoint, so we just check if the client is initialized
      if (!config.apiKey) {
        throw new Error("Provider API key not configured");
      }
      return { status: "ok", connected: true };
    } catch (error) {
      return { status: "error", connected: false, error: String(error) };
    }
  }

  async listModels() {
    const list = await this.provider.models.list();
    return list;
  }

  async chatStream(
    messages: { role: "system" | "user" | "assistant"; content: string }[],
  ) {
    if (!config.apiKey) {
      throw new Error("Provider API key not configured");
    }

    if (!config.model) {
      throw new Error("Provider model not configured");
    }

    const params: DeepSeekChatParams = {
      model: config.model,
      messages,
      stream: true,
      thinking: { type: "disabled" },
    };
    const response = await this.provider.chat.completions.create(params);

    // Adapt OpenAI stream to match the expected format in TranslationService
    // TranslationService expects an async iterable that yields { message: { content: string } }
    return (async function* () {
      for await (const chunk of response) {
        const content = chunk?.choices[0]?.delta?.content || "";
        if (content) {
          yield { message: { content } };
        }
      }
    })();
  }
}

export const deepseekService = new DeepSeekService();
