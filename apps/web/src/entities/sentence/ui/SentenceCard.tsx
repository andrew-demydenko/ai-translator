import React, { useState } from "react";
import { GeneratedSentence } from "../model/types";

interface SentenceCardProps {
  sentence: GeneratedSentence;
  onDelete: (id: string) => void;
}

export const SentenceCard: React.FC<SentenceCardProps> = ({
  sentence,
  onDelete,
}) => {
  const [showTranslation, setShowTranslation] = useState(false);

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

      <div className="mt-2">
        {showTranslation ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTranslation(false)}
              className="text-slate-300 hover:text-slate-500 transition-colors"
              title="Скрыть перевод"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </button>
            <p className="text-slate-500 text-sm italic flex-1">
              {sentence.translated}
            </p>
          </div>
        ) : (
          <button
            onClick={() => setShowTranslation(true)}
            className="flex items-center gap-2 text-blue-500 text-sm hover:text-blue-600 transition-colors font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Show Translation
          </button>
        )}
      </div>
    </div>
  );
};
