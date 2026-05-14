import React from "react";
import { TranslationResult } from "@ai-translator/shared-types";
import { FormalityBadge } from "./FormalityBadge";
import { AlternativeChip } from "./AlternativeChip";
import { ContextNote } from "./ContextNote";
import { ExamplesSection } from "./ExamplesSection";

interface TranslationResultSectionProps {
  status: string;
  currentTranslation: string;
  streamedResult: Partial<TranslationResult>;
  onReplaceTranslation: (newText: string) => void;
}

export const TranslationResultSection: React.FC<
  TranslationResultSectionProps
> = ({ status, currentTranslation, streamedResult, onReplaceTranslation }) => {
  if (status === "idle" && !currentTranslation) return null;

  const synonyms = streamedResult.synonyms || [];
  const alternatives = streamedResult.alternatives || [];
  const examples = streamedResult.examples || [];

  return (
    <div className="bg-white py-6 rounded-xl shadow-sm border border-slate-200 space-y-6 flex flex-col min-h-[1px]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 px-6">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
          Translation
        </h2>
        {streamedResult.confidence && (
          <span className="text-xs text-slate-400">
            Confidence: {streamedResult.confidence.toFixed(2)}
          </span>
        )}
        {streamedResult.formality && (
          <FormalityBadge level={streamedResult.formality} />
        )}
      </div>

      <div className="overflow-y-auto px-6">
        <div className="min-h-[4rem]">
          {status === "streaming" && !currentTranslation ? (
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-slate-100 rounded w-full"></div>
              <div className="h-6 bg-slate-100 rounded w-2/3"></div>
            </div>
          ) : (
            <div className="relative">
              <p
                className={`text-lg font-semibold text-slate-800 leading-relaxed ${
                  status === "streaming" ? "opacity-70" : ""
                }`}
              >
                {currentTranslation}
                {status === "streaming" && (
                  <span className="inline-block w-1 h-6 ml-1 bg-blue-500 animate-pulse align-middle" />
                )}
              </p>
            </div>
          )}
        </div>

        {alternatives.length && !synonyms.length ? (
          <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Alternatives
            </h3>
            <div className="flex flex-wrap gap-2">
              {alternatives.map((alt, i) => (
                <AlternativeChip
                  key={i}
                  text={alt}
                  onClick={onReplaceTranslation}
                />
              ))}
            </div>
          </div>
        ) : null}

        {synonyms.length > 0 && (
          <div className="mt-6 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Synonyms
            </h3>
            <div className="flex flex-wrap gap-2">
              {synonyms.map((syn, i) => (
                <div
                  key={i}
                  className="text-slate-600"
                >{`${syn}${synonyms.length > i + 1 ? `,` : "."}`}</div>
              ))}
            </div>
          </div>
        )}

        {examples.length > 0 && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-1000">
            <ExamplesSection examples={examples} />
          </div>
        )}
        {streamedResult.contextNote && (
          <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <ContextNote note={streamedResult.contextNote} />
          </div>
        )}
      </div>
    </div>
  );
};
