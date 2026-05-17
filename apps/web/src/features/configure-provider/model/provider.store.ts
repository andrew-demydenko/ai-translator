import { create } from "zustand";
import type { Provider } from "./types";

const PROVIDER_STORAGE_KEY = "ai_translator_provider_config";

interface ProviderStore {
  provider: Provider;
  model: string;
  host: string;
  setProvider: (provider: Provider) => void;
  setModel: (model: string) => void;
  setHost: (host: string) => void;
}

function loadConfig(): { provider: Provider; model: string; host: string } {
  try {
    const saved = localStorage.getItem(PROVIDER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        provider: parsed.provider ?? "ollama",
        model: parsed.model ?? "",
        host: parsed.host ?? "",
      };
    }
  } catch {
    console.error("Failed to parse provider config");
  }
  return { provider: "ollama", model: "", host: "" };
}

function saveConfig(provider: Provider, model: string, host: string) {
  localStorage.setItem(
    PROVIDER_STORAGE_KEY,
    JSON.stringify({ provider, model, host }),
  );
}

export const useProviderStore = create<ProviderStore>((set) => ({
  ...loadConfig(),

  setProvider: (provider) =>
    set((state) => {
      saveConfig(provider, state.model, state.host);
      return { provider };
    }),

  setModel: (model) =>
    set((state) => {
      saveConfig(state.provider, model, state.host);
      return { model };
    }),

  setHost: (host) =>
    set((state) => {
      saveConfig(state.provider, state.model, host);
      return { host };
    }),
}));
