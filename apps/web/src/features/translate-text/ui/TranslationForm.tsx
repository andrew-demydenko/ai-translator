import React from "react";
import { HistoryPopover } from "@/features/view-history";
import { LanguageSelect } from "@/features/select-language";

interface TranslationFormProps {
  text: string;
  setText: (text: string) => void;
  sourceLang: string;
  targetLang: string;
  contextLang: "русский" | "english";
  onConfigChange: (config: {
    sourceLang?: string;
    targetLang?: string;
    contextLang?: "русский" | "english";
  }) => void;
  onTranslate: () => void;
  isStreaming: boolean;
  history: { original: string; translated: string }[];
  onClearHistory: () => void;
}

export const TranslationForm: React.FC<TranslationFormProps> = ({
  text,
  setText,
  sourceLang,
  targetLang,
  contextLang,
  onConfigChange,
  onTranslate,
  isStreaming,
  history,
  onClearHistory,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
      <LanguageSelect
        sourceLang={sourceLang}
        targetLang={targetLang}
        onConfigChange={onConfigChange}
      />

      <textarea
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onTranslate();
          }
        }}
        className="w-full h-28 rounded-md p-3 border-0 text-xl resize-none focus:ring-0 placeholder:text-slate-300"
        placeholder="Type to translate..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="flex justify-between gap-6 max-sm:flex-col">
        <div className="flex items-center gap-4 bg-slate-50 p-1 px-3 rounded-lg border border-slate-100 flex-1">
          <div className="flex-1 flex gap-3 items-center">
            <label className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap sm:hidden">
              Expl. Lang.:
            </label>
            <label className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap max-sm:hidden">
              Explanations Language:
            </label>
            <button
              onClick={() => onConfigChange({ contextLang: "english" })}
              disabled={contextLang === "english"}
              className="border border-gray-600 text-slate-600 px-3 py-1 text-sm rounded-md disabled:bg-gray-200 hover:bg-gray-100 transition-all shadow-lg shadow-gray-200"
            >
              Eng
            </button>
            <button
              disabled={contextLang === "русский"}
              onClick={() => onConfigChange({ contextLang: "русский" })}
              className="border border-gray-600 text-slate-600 px-3 py-1 text-sm rounded-md disabled:bg-gray-200 hover:bg-gray-100 transition-all shadow-lg shadow-gray-200"
            >
              Рус
            </button>
          </div>
          <HistoryPopover history={history} onClear={onClearHistory} />
        </div>

        <button
          onClick={onTranslate}
          disabled={isStreaming || !text.trim()}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300 transition-all shadow-lg shadow-blue-200"
        >
          {isStreaming ? "Translating..." : "Translate"}
        </button>
      </div>
    </div>
  );
};
