import ollama from "ollama";
import { config } from "../config";

export class OllamaService {
  async checkHealth() {
    try {
      await ollama.ps();
      return { status: "ok", connected: true };
    } catch (error) {
      return { status: "error", connected: false, error: String(error) };
    }
  }

  async listModels() {
    const response = await ollama.list();
    return response.models;
  }

  async chatStream(messages: { role: string; content: string }[]) {
    if (!config.ollama.model) {
      throw new Error("Ollama model not configured");
    }

    return await ollama.chat({
      model: config.ollama.model,
      messages,
      stream: true,
    });
  }
}

export const ollamaService = new OllamaService();
