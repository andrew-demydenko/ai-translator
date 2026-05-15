import React from "react";
import { LEVELS, WORD_COUNT_RANGES, Level } from "@/entities/sentence";
import { LanguageSelect } from "@/features/select-language";
import { useTranslationStore } from "@/entities/translation";
import { useSentencesStore } from "@/entities/sentence";

export const PracticeSettings: React.FC = () => {
  const {
    selectedLevel,
    setSelectedLevel,
    selectedWordCount,
    setSelectedWordCount,
  } = useSentencesStore((s) => ({
    selectedLevel: s.selectedLevel,
    setSelectedLevel: s.setSelectedLevel,
    selectedWordCount: s.selectedWordCount,
    setSelectedWordCount: s.setSelectedWordCount,
  }));
  const { sourceLang, targetLang, setConfig } = useTranslationStore((s) => ({
    sourceLang: s.sourceLang,
    targetLang: s.targetLang,
    setConfig: s.setConfig,
  }));

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6 w-[350px]">
      <LanguageSelect
        sourceLang={sourceLang}
        targetLang={targetLang}
        onConfigChange={setConfig}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Difficulty Level
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as Level)}
            className="w-full bg-slate-50 border-0 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          >
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Word Count
          </label>
          <select
            value={selectedWordCount}
            onChange={(e) => setSelectedWordCount(e.target.value)}
            className="w-full bg-slate-50 border-0 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
          >
            {WORD_COUNT_RANGES.map((range) => (
              <option key={range} value={range}>
                {range} words
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};
