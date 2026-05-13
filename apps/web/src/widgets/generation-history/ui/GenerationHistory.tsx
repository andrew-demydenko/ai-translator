import React from "react";
import { GeneratedSentence, SentenceCard } from "@/entities/sentence";

interface GenerationHistoryProps {
  sentences: GeneratedSentence[];
  deleteSentence: (id: string) => void;
  clearAllSentences: () => void;
}

export const GenerationHistory: React.FC<GenerationHistoryProps> = ({
  sentences,
  deleteSentence,
  clearAllSentences,
}) => {
  return (
    <section className="space-y-4 flex min-h-[1px] flex-col">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Generation History</h2>
        {sentences.length > 0 && (
          <button
            onClick={clearAllSentences}
            className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors"
          >
            Delete All
          </button>
        )}
      </div>

      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {sentences.length === 0 && (
          <p className="text-slate-400 text-sm italic">History is empty</p>
        )}
        {sentences.map((s) => (
          <SentenceCard key={s.id} sentence={s} onDelete={deleteSentence} />
        ))}
      </div>
    </section>
  );
};
