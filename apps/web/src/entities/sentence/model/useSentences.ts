import { useState, useEffect, useCallback } from "react";
import { GeneratedSentence } from "./types";

const SENTENCES_STORAGE_KEY = "ai_translator_generated_sentences";

export const useSentences = () => {
  const [sentences, setSentences] = useState<GeneratedSentence[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(SENTENCES_STORAGE_KEY);
    if (saved) {
      try {
        setSentences(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse sentences", e);
      }
    }
  }, []);

  const addSentence = useCallback((sentence: Omit<GeneratedSentence, "id" | "createdAt">) => {
    setSentences((prev) => {
      const newSentence: GeneratedSentence = {
        ...sentence,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      const updated = [newSentence, ...prev];
      localStorage.setItem(SENTENCES_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteSentence = useCallback((id: string) => {
    setSentences((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      localStorage.setItem(SENTENCES_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearAllSentences = useCallback(() => {
    setSentences([]);
    localStorage.removeItem(SENTENCES_STORAGE_KEY);
  }, []);

  return {
    sentences,
    addSentence,
    deleteSentence,
    clearAllSentences,
  };
};
