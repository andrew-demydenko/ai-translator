import React, { useState, useEffect } from "react";
import { useTopics, Topic } from "@/entities/topic";
import { useSentences } from "@/entities/sentence";
import {
  useTranslationResults,
  useTranslationConfig,
} from "@/entities/translation";
import { TranslationRequest } from "@ai-translator/shared-types";
import { PracticeSettings } from "@/widgets/practice-settings";
import { TopicManagement } from "@/widgets/topic-management";
import { GenerationHistory } from "@/widgets/generation-history";

export const PracticePage: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState("B1");
  const [selectedWordCount, setSelectedWordCount] = useState("13-16");
  const [generatingTopicId, setGeneratingTopicId] = useState<string | null>(
    null,
  );

  const { topics, addTopic, deleteTopic } = useTopics();
  const { sentences, addSentence, deleteSentence, clearAllSentences } =
    useSentences();
  const {
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    mode,
    contextLang,
  } = useTranslationConfig("standard");

  const { status, translate, result, resetResults } = useTranslationResults();

  // Handle adding generated sentence to history
  useEffect(() => {
    if (result && generatingTopicId) {
      const topic = topics.find((t) => t.id === generatingTopicId);
      if (topic) {
        addSentence({
          topicId: topic.id,
          topicName: topic.name,
          source: result.originalText || result.translation,
          translated: result.translation,
          level: selectedLevel,
        });
      }
      setGeneratingTopicId(null);
    }
  }, [result, generatingTopicId, topics, addSentence, selectedLevel]);

  const handleGenerate = (topic: Topic) => {
    if (status === "streaming") return;

    setGeneratingTopicId(topic.id);
    resetResults();

    const request: TranslationRequest = {
      text: `GENERATE_TOPIC:${topic.name}`,
      sourceLang,
      targetLang,
      mode,
      contextLanguage: contextLang,
      level: selectedLevel,
      wordCountRange: selectedWordCount,
    };

    translate(request);
  };

  return (
    <>
      <PracticeSettings
        sourceLang={sourceLang}
        setSourceLang={setSourceLang}
        targetLang={targetLang}
        setTargetLang={setTargetLang}
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        selectedWordCount={selectedWordCount}
        setSelectedWordCount={setSelectedWordCount}
      />

      <TopicManagement
        topics={topics}
        addTopic={addTopic}
        deleteTopic={deleteTopic}
        onGenerate={handleGenerate}
        isGenerating={status === "streaming"}
        generatingTopicId={generatingTopicId}
      />

      <GenerationHistory
        sentences={sentences}
        deleteSentence={deleteSentence}
        clearAllSentences={clearAllSentences}
      />
    </>
  );
};
