export type Provider = "ollama" | "deepseek";

export interface ProviderConfig {
  provider: Provider;
  model: string;
  host: string;
}
