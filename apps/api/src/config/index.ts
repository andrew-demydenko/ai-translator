import { dotenvLoad } from "dotenv-mono";
dotenvLoad();

export const config = {
  port: process.env.PORT || 3001,
  model: process.env.PROVIDER_MODEL,
  host: process.env.PROVIDER_HOST || "http://localhost:11434",
  apiKey: process.env.PROVIDER_API_KEY,
  provider: process.env.PROVIDER || "ollama",
};

export function getProviderConfig() {
  if (!config.model) {
    throw new Error(
      "PROVIDER_MODEL environment variable is required. Example: PROVIDER_MODEL=llama3.2",
    );
  }
  return {
    host: config.host,
    apiKey: config.apiKey,
    model: config.model,
  };
}
