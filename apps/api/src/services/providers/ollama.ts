import { Ollama } from "ollama";
import { TranslationProvider, ProviderConfig } from "./types";

export class OllamaService implements TranslationProvider {
  private ollama: Ollama;
  private config: ProviderConfig;

  constructor(config: ProviderConfig) {
    this.config = config;
    this.ollama = new Ollama({
      host: config.host,
      ...(config.apiKey && {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
        },
      }),
    });
  }

  async checkHealth() {
    try {
      const list = await this.ollama.list();
      if (!list.models || list.models.length === 0) {
        throw new Error("Ollama models not found");
      }
      return { status: "ok", connected: true };
    } catch (error) {
      return { status: "error", connected: false, error: String(error) };
    }
  }

  async listModels() {
    const response = await this.ollama.list();
    return response.models.map((m) => ({
      id: m.model,
      name: m.name,
    }));
  }

  async chatStream(
    messages: { role: "system" | "user" | "assistant"; content: string }[],
  ) {
    if (!this.config.model) {
      throw new Error("Ollama model not configured");
    }

    return this.ollama.chat({
      model: this.config.model,
      messages,
      stream: true,
    });
  }
}
