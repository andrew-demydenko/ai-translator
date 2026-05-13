import React from "react";
import { Topic } from "../model/types";
import clsx from "clsx";

interface TopicChipProps {
  topic: Topic;
  onGenerate: (topic: Topic) => void;
  onDelete: (id: string) => void;
  isGenerating: boolean;
  isThisTopicGenerating: boolean;
}

export const TopicChip: React.FC<TopicChipProps> = ({
  topic,
  onGenerate,
  onDelete,
  isGenerating,
  isThisTopicGenerating,
}) => {
  return (
    <div className="group relative flex items-center bg-white border border-slate-200 rounded-lg overflow-hidden transition-all hover:border-blue-300">
      <button
        onClick={() => onGenerate(topic)}
        disabled={isGenerating}
        className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 transition-colors disabled:opacity-50"
      >
        {topic.name}
      </button>
      <button
        disabled={isThisTopicGenerating}
        onClick={() => onDelete(topic.id)}
        className={clsx(
          "p-2 text-slate-400 transition-all border-l border-slate-100",
          {
            "hover:text-red-500 hover:bg-red-50": !isThisTopicGenerating,
          },
        )}
      >
        {isThisTopicGenerating ? (
          <svg
            className="size-4 animate-spin text-blue-400"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              fill="transparent"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        )}
      </button>
    </div>
  );
};
