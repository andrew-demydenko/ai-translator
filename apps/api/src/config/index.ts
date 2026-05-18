import { dotenvLoad } from "dotenv-mono";
dotenvLoad();

export const config = {
  port: process.env.PORT || 3001,
  model: process.env.PROVIDER_MODEL,
  host: process.env.PROVIDER_HOST || "http://localhost:11434",
  apiKey: process.env.PROVIDER_API_KEY,
  provider: (process.env.PROVIDER || "ollama") as string,
};

export function getProviderConfig() {
  return {
    host: config.host,
    apiKey: config.apiKey,
    model: config.model,
  };
}

export interface ResolvedProviderConfig {
  provider: string;
  model: string;
  host: string;
  apiKey: string;
}

export function resolveProviderConfig(clientParams?: {
  provider?: string;
  model?: string;
  host?: string;
  apiKey?: string;
}): ResolvedProviderConfig {
  if (
    !clientParams ||
    !clientParams.provider ||
    !clientParams.model ||
    !clientParams.host
  ) {
    return {
      provider: config.provider,
      model: config.model ?? "",
      host: config.host,
      apiKey: config.apiKey ?? "",
    };
  } else {
    return {
      provider: clientParams?.provider,
      model: clientParams?.model,
      host: clientParams?.host,
      apiKey: clientParams?.apiKey ?? "",
    };
  }
}

export function isProviderConfigured({
  provider,
  model,
  host,
  apiKey,
}: {
  provider: string;
  model: string;
  host: string;
  apiKey: string;
}): boolean {
  if (!provider || !host || !model) {
    return false;
  }

  if (provider === "deepseek" && !apiKey) {
    return false;
  }

  return true;
}
