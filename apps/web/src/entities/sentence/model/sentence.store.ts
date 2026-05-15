import { GeneratedSentence, Level } from "./types";
import { create } from "zustand";

const SENTENCES_STORAGE_KEY = "ai_translator_generated_sentences";

function loadSentences(): GeneratedSentence[] {
  try {
    const saved = localStorage.getItem(SENTENCES_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to parse sentences", e);
  }
  return [];
}

interface SentenceStore {
  sentences: GeneratedSentence[];
  selectedLevel: Level;
  setSelectedLevel: (level: Level) => void;
  selectedWordCount: string;
  setSelectedWordCount: (count: string) => void;
  addSentence: (sentence: Omit<GeneratedSentence, "id" | "createdAt">) => void;
  deleteSentence: (id: string) => void;
  clearAllSentences: () => void;
}

export const useSentencesStore = create<SentenceStore>((set) => ({
  sentences: loadSentences(),
  selectedLevel: "B1",
  selectedWordCount: "13-16",

  setSelectedLevel: (level) => set({ selectedLevel: level }),

  setSelectedWordCount: (count) => set({ selectedWordCount: count }),

  addSentence: (sentence) =>
    set((state) => {
      const newSentence: GeneratedSentence = {
        ...sentence,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      };
      const updated = [newSentence, ...state.sentences];
      localStorage.setItem(SENTENCES_STORAGE_KEY, JSON.stringify(updated));
      return { sentences: updated };
    }),

  deleteSentence: (id) =>
    set((state) => {
      const updated = state.sentences.filter((s) => s.id !== id);
      localStorage.setItem(SENTENCES_STORAGE_KEY, JSON.stringify(updated));
      return { sentences: updated };
    }),

  clearAllSentences: () => {
    localStorage.removeItem(SENTENCES_STORAGE_KEY);
    set(() => {
      return { sentences: [] };
    });
  },
}));
