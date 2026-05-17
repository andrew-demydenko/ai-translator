import React from "react";
import { useGenerateSentence } from "@/features/generate-sentence";
import { useConfigStatus } from "@/features/configure-provider";
import { PracticeSettings } from "@/widgets/practice-settings";
import { TopicManagement } from "@/widgets/topic-management";
import { GenerationHistory } from "@/widgets/generation-history";

export const PracticePage: React.FC = () => {
  const { generateSentence, isGenerating, generatingTopicId } =
    useGenerateSentence();
  const { isLoading, isError, status: configStatus } = useConfigStatus();
  const isBackendReady = !isLoading && !isError && configStatus.llmConnected;

  return (
    <>
      <div className="flex gap-6">
        <PracticeSettings />
        <TopicManagement
          onGenerate={generateSentence}
          isGenerating={isGenerating}
          generatingTopicId={generatingTopicId}
          isBackendReady={isBackendReady}
        />
      </div>

      <GenerationHistory />
    </>
  );
};
