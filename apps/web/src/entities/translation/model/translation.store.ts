import { create } from "zustand";
import {
  TranslationRequest,
  TranslationResult,
} from "@ai-translator/shared-types";
import { HISTORY_STORAGE_KEY, MAX_HISTORY_ITEMS } from "./constants";

export interface HistoryEntry {
  original: string;
  translated: string;
}

type TranslateFn = (params: TranslationRequest) => void;

export interface SocketStatePayload {
  status: "idle" | "streaming" | "done" | "error";
  error: string | null;
  result: TranslationResult | null;
  fieldUpdates: Partial<TranslationResult>;
}

export interface TranslationState {
  // Config
  sourceLang: string;
  targetLang: string;
  mode: TranslationRequest["mode"];
  contextLang: "русский" | "english";

  // State
  text: string;
  currentTranslation: string;
  streamedResult: Partial<TranslationResult>;
  status: "idle" | "streaming" | "done" | "error";
  error: string | null;
  result: TranslationResult | null;

  // History
  history: HistoryEntry[];
  _transport: TranslateFn | null;

  // Actions
  setConfig: (
    config: Partial<
      Pick<TranslationState, "sourceLang" | "targetLang" | "contextLang">
    >,
  ) => void;
  setMode: (mode: TranslationRequest["mode"]) => void;
  setText: (text: string) => void;
  replaceTranslation: (translation: string) => void;
  syncSocketState: (payload: SocketStatePayload) => void;
  resetResults: () => void;
  addToHistory: (original: string, translated: string) => void;
  clearHistory: () => void;
  handleTranslate: () => void;
  registerTransport: (fn: TranslateFn) => void;
}

export const useTranslationStore = create<TranslationState>((set, get) => ({
  // Config Defaults
  sourceLang: "rus",
  targetLang: "eng",
  mode: "standard",
  contextLang: "русский",

  // State Defaults
  text: "",
  currentTranslation: "",
  streamedResult: {},
  status: "idle",
  error: null,
  result: null,
  _transport: null,

  // History Defaults
  history: (() => {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    return [];
  })(),

  // Actions
  setConfig: (config) => set(config),
  setMode: (mode) => set({ mode }),
  setText: (text) => set({ text }),
  replaceTranslation: (currentTranslation) => set({ currentTranslation }),

  syncSocketState: (payload) => {
    const { status, error, result, fieldUpdates } = payload;

    set({
      status,
      error,
      result,
      streamedResult: fieldUpdates,
      currentTranslation:
        result?.translation ??
        (status === "streaming" ? (fieldUpdates.translation ?? "") : ""),
    });

    if (result) {
      const { text } = get();
      if (text) {
        get().addToHistory(text, result.translation);
      }
    }
  },

  registerTransport: (fn) => set({ _transport: fn }),

  resetResults: () => {
    set({
      currentTranslation: "",
      streamedResult: {},
      result: null,
      error: null,
      status: "idle",
    });
  },

  addToHistory: (original, translated) => {
    if (!original || !translated) return;

    set((state) => {
      if (
        state.history.length > 0 &&
        state.history.some(
          (entry) =>
            entry.original === original && entry.translated === translated,
        )
      ) {
        return state;
      }

      const newEntry = { original, translated };
      const updatedHistory = [newEntry, ...state.history].slice(
        0,
        MAX_HISTORY_ITEMS,
      );

      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      return { history: updatedHistory };
    });
  },

  clearHistory: () => {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    set({ history: [] });
  },

  handleTranslate: () => {
    const {
      text,
      sourceLang,
      targetLang,
      mode,
      contextLang,
      resetResults,
      _transport,
    } = get();

    if (!text.trim()) return;

    // Auto-swap detection
    const isCyrillic = /[а-яё]/i.test(text);
    const isLatin = /[a-z]/i.test(text);

    let currentSource = sourceLang;
    let currentTarget = targetLang;

    // If source is Russian but text is Latin (and no Cyrillic), swap
    if (sourceLang.toLowerCase().includes("rus") && isLatin && !isCyrillic) {
      currentSource = targetLang;
      currentTarget = sourceLang;
      set({ sourceLang: currentSource, targetLang: currentTarget });
    }
    // If source is English but text is Cyrillic (and no Latin), swap
    else if (
      sourceLang.toLowerCase().includes("eng") &&
      isCyrillic &&
      !isLatin
    ) {
      currentSource = targetLang;
      currentTarget = sourceLang;
      set({ sourceLang: currentSource, targetLang: currentTarget });
    }

    resetResults();

    if (_transport) {
      _transport({
        text,
        sourceLang: currentSource,
        targetLang: currentTarget,
        mode,
        contextLanguage: contextLang,
        generationType: "translation",
      });
    }
  },
}));
