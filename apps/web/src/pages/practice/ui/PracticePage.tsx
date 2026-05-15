import React from "react";
import { useGenerateSentence } from "@/features/generate-sentence";
import { PracticeSettings } from "@/widgets/practice-settings";
import { TopicManagement } from "@/widgets/topic-management";
import { GenerationHistory } from "@/widgets/generation-history";

export const PracticePage: React.FC = () => {
  const { generateSentence, isGenerating, generatingTopicId } =
    useGenerateSentence();

  return (
    <>
      <div className="flex gap-6">
        <PracticeSettings />
        <TopicManagement
          onGenerate={generateSentence}
          isGenerating={isGenerating}
          generatingTopicId={generatingTopicId}
        />
      </div>

      <GenerationHistory />
    </>
  );
};
