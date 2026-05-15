import OpenAI from "openai";
import type { ChatCompletionCreateParamsStreaming } from "openai/resources/chat/completions";
import { TranslationProvider, ProviderConfig } from "./types";

type DeepSeekChatParams = ChatCompletionCreateParamsStreaming & {
  thinking?: { type: "enabled" | "disabled" };
};

export class DeepSeekService implements TranslationProvider {
  private provider: OpenAI;
  private config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.provider = new OpenAI({
      baseURL: config.host,
      apiKey: config.apiKey,
    });
  }

  async checkHealth() {
    try {
      if (!this.config.apiKey) {
        throw new Error("Provider API key not configured");
      }
      return { status: "ok", connected: true };
    } catch (error) {
      return { status: "error", connected: false, error: String(error) };
    }
  }

  async listModels() {
    const page = await this.provider.models.list();
    return page.data.map((m) => ({
      id: m.id,
      name: m.id,
      owned_by: m.owned_by,
    }));
  }

  async chatStream(
    messages: { role: "system" | "user" | "assistant"; content: string }[],
  ) {
    if (!this.config.apiKey) {
      throw new Error("Provider API key not configured");
    }

    if (!this.config.model) {
      throw new Error("Provider model not configured");
    }

    const params: DeepSeekChatParams = {
      model: this.config.model,
      messages,
      stream: true,
      thinking: { type: "disabled" },
    };
    const response = await this.provider.chat.completions.create(params);

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
