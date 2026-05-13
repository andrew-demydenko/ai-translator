import { useState, useEffect, useCallback } from "react";
import { Topic } from "./types";

const TOPICS_STORAGE_KEY = "ai_translator_topics";

export const useTopics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(TOPICS_STORAGE_KEY);
    if (saved) {
      try {
        setTopics(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse topics", e);
      }
    }
  }, []);

  const addTopic = useCallback((name: string) => {
    if (!name.trim()) return;
    
    setTopics((prev) => {
      const newTopic: Topic = {
        id: crypto.randomUUID(),
        name: name.trim(),
        createdAt: Date.now(),
      };
      const updated = [newTopic, ...prev];
      localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteTopic = useCallback((id: string) => {
    setTopics((prev) => {
      const updated = prev.filter((t) => t.id !== id);
      localStorage.setItem(TOPICS_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return {
    topics,
    addTopic,
    deleteTopic,
  };
};
