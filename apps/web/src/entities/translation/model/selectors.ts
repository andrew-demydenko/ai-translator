import { useTranslationStore } from "./translation.store";

export const useTranslationConfig = () =>
  useTranslationStore((s) => ({
    sourceLang: s.sourceLang,
    targetLang: s.targetLang,
    contextLang: s.contextLang,
    setConfig: s.setConfig,
  }));

export const useTranslationInput = () =>
  useTranslationStore((s) => ({
    text: s.text,
    setText: s.setText,
  }));

export const useTranslationResult = () =>
  useTranslationStore((s) => ({
    status: s.status,
    currentTranslation: s.currentTranslation,
    replaceTranslation: s.replaceTranslation,
    streamedResult: s.streamedResult,
    error: s.error,
  }));

export const useTranslationHistory = () =>
  useTranslationStore((s) => ({
    history: s.history,
    clearHistory: s.clearHistory,
  }));
