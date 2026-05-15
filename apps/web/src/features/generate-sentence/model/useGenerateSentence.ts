import { useState, useEffect, useRef } from "react";
import { TranslationRequest } from "@ai-translator/shared-types";
import { useTranslationStore } from "@/entities/translation";
import { useSentencesStore } from "@/entities/sentence";
import { Topic } from "@/entities/topic";
import { useGenerationSocket } from "@/shared/api";

export function useGenerateSentence() {
  const [generatingTopicId, setGeneratingTopicId] = useState<string | null>(
    null,
  );
  const generatingTopicNameRef = useRef("");
  const generatingTopicIdRef = useRef<string | null>(null);

  useEffect(() => {
    generatingTopicIdRef.current = generatingTopicId;
  }, [generatingTopicId]);

  const { addSentence } = useSentencesStore((s) => ({
    addSentence: s.addSentence,
  }));
  const { sourceLang, targetLang } = useTranslationStore((s) => ({
    sourceLang: s.sourceLang,
    targetLang: s.targetLang,
  }));

  const { generate, status, result } = useGenerationSocket("practice");

  useEffect(() => {
    if (!result) return;

    const topicId = generatingTopicIdRef.current;
    if (!topicId) return;

    const { selectedLevel } = useSentencesStore.getState();

    addSentence({
      topicId,
      source: result.original,
      translated: result.translation,
      level: selectedLevel,
      topicName: generatingTopicNameRef.current,
    });

    setGeneratingTopicId(null);
    generatingTopicNameRef.current = "";
  }, [result, addSentence]);

  const generateSentence = (topic: Topic) => {
    if (status === "streaming") return;

    setGeneratingTopicId(topic.id);
    generatingTopicNameRef.current = topic.name;

    const { selectedLevel, selectedWordCount } = useSentencesStore.getState();

    const request: TranslationRequest = {
      text: `GENERATE_TOPIC:${topic.name}`,
      sourceLang,
      targetLang,
      level: selectedLevel,
      wordCountRange: selectedWordCount,
      generationType: "practice",
    };

    generate(request);
  };

  return {
    generateSentence,
    isGenerating: status === "streaming",
    generatingTopicId,
  };
}
