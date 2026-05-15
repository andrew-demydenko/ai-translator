import { Ollama } from "ollama";
import { config } from "../config";

export class OllamaService {
  private ollama: Ollama;

  constructor() {
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
      await this.ollama.ps();
      return { status: "ok", connected: true };
    } catch (error) {
      return { status: "error", connected: false, error: String(error) };
    }
  }

  async listModels() {
    const response = await this.ollama.list();
    return response.models;
  }

  async chatStream(messages: { role: string; content: string }[]) {
    if (!config.model) {
      throw new Error("Ollama model not configured");
    }

    return await this.ollama.chat({
      model: config.model,
      messages,
      stream: true,
    });
  }
}

export const ollamaService = new OllamaService();
