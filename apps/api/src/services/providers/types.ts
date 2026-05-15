export interface StreamChunk {
  message: { content: string };
}

export interface ProviderConfig {
  host: string;
  apiKey?: string;
  model: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  owned_by?: string;
}

export interface TranslationProvider {
  chatStream(
    messages: { role: "system" | "user" | "assistant"; content: string }[],
  ): Promise<AsyncIterable<StreamChunk>>;
  checkHealth(): Promise<{
    status: string;
    connected: boolean;
    error?: string;
  }>;
  listModels(): Promise<ModelInfo[]>;
}
