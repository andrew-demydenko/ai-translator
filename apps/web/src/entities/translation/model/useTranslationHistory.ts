import { useState, useEffect, useCallback } from "react";

export interface HistoryEntry {
  original: string;
  translated: string;
}

const HISTORY_STORAGE_KEY = "translation_history";
const MAX_HISTORY_ITEMS = 10;

export const useTranslationHistory = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const addToHistory = useCallback((original: string, translated: string) => {
    if (!original || !translated) return;

    setHistory((prev) => {
      // Avoid duplicates if the same thing is translated consecutively
      if (prev.length > 0 && prev[0].original === original) {
        return prev;
      }
      
      const newEntry = { original, translated };
      const updatedHistory = [newEntry, ...prev].slice(0, MAX_HISTORY_ITEMS);
      
      localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(updatedHistory),
      );
      
      return updatedHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
  };
};
