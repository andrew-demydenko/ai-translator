import React from "react";
import { Topic, TopicChip } from "@/entities/topic";
import { AddTopicForm } from "@/features/add-topic";

interface TopicManagementProps {
  topics: Topic[];
  addTopic: (name: string) => void;
  deleteTopic: (id: string) => void;
  onGenerate: (topic: Topic) => void;
  isGenerating: boolean;
  generatingTopicId: string | null;
}

export const TopicManagement: React.FC<TopicManagementProps> = ({
  topics,
  addTopic,
  deleteTopic,
  onGenerate,
  isGenerating,
  generatingTopicId,
}) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Topics</h2>
      </div>
      
      <AddTopicForm onAdd={addTopic} />

      <div className="flex flex-wrap gap-2">
        {topics.length === 0 && (
          <p className="text-slate-400 text-sm italic">Topic list is empty</p>
        )}
        {topics.map((topic) => (
          <TopicChip
            key={topic.id}
            topic={topic}
            onGenerate={onGenerate}
            onDelete={deleteTopic}
            isGenerating={isGenerating}
            isThisTopicGenerating={generatingTopicId === topic.id}
          />
        ))}
      </div>
    </section>
  );
};
