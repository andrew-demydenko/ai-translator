import ollama from "ollama";
import { config } from "../config";

export class OllamaService {
  /**
   * Check if Ollama is available
   */
  async checkHealth() {
    try {
      await ollama.ps();
      return { status: "ok", connected: true };
    } catch (error) {
      return { status: "error", connected: false, error: String(error) };
    }
  }

  /**
   * List available models
   */
  async listModels() {
    const response = await ollama.list();
    return response.models;
  }

  /**
   * Chat with streaming support
   */
  async chatStream(messages: { role: string; content: string }[]) {
    return await ollama.chat({
      model: config.ollama.model,
      messages,
      stream: true,
    });
  }
}

export const ollamaService = new OllamaService();
