import React from "react";
import { GeneratedSentence } from "../model/types";

interface SentenceCardProps {
  sentence: GeneratedSentence;
  onDelete: (id: string) => void;
}

export const SentenceCard: React.FC<SentenceCardProps> = ({
  sentence,
  onDelete,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group relative">
      <button
        onClick={() => onDelete(sentence.id)}
        className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 transition-colors"
      >
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
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
          {sentence.level}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {sentence.topicName}
        </span>
      </div>
      <p className="text-slate-800 font-medium mb-1">{sentence.source}</p>
      <p className="text-slate-500 text-sm italic">{sentence.translated}</p>
    </div>
  );
};
