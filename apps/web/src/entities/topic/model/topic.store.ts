import { create } from "zustand";
import { Topic } from "./types";

const TOPICS_STORAGE_KEY = "ai_translator_topics";

function loadTopics(): Topic[] {
  try {
    const saved = localStorage.getItem(TOPICS_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to parse topics", e);
  }
  return [];
}

interface TopicStore {
  topics: Topic[];
  addTopic: (name: string) => void;
  deleteTopic: (id: string) => void;
}

export const useTopicStore = create<TopicStore>((set) => ({
  topics: loadTopics(),

  addTopic: (name) =>
    set((state) => {
      if (!name.trim()) return state;

      const newTopic: Topic = {
        id: crypto.randomUUID(),
        name: name.trim(),
        createdAt: Date.now(),
      };
      const updated = [newTopic, ...state.topics];
      localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(updated));
      return { topics: updated };
    }),

  deleteTopic: (id) =>
    set((state) => {
      const updated = state.topics.filter((t) => t.id !== id);
      localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(updated));
      return { topics: updated };
    }),
}));
