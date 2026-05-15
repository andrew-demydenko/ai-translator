import { TranslationProvider, ProviderConfig } from "./types";
import { OllamaService } from "./ollama";
import { DeepSeekService } from "./deepseek";

const providerConstructors: Record<
  string,
  new (config: ProviderConfig) => TranslationProvider
> = {
  ollama: OllamaService,
  deepseek: DeepSeekService,
};

export function getTranslationProvider(
  provider: string,
  config: ProviderConfig,
): TranslationProvider {
  const Constructor = providerConstructors[provider];
  if (!Constructor) {
    throw new Error(
      `Unknown provider: ${provider}. Available: ${Object.keys(providerConstructors).join(", ")}`,
    );
  }
  return new Constructor(config);
}
