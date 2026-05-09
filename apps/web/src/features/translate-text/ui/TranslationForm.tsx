import React from "react";
import { HistoryPopover } from "../../view-history";

interface TranslationFormProps {
  text: string;
  setText: (text: string) => void;
  sourceLang: string;
  setSourceLang: (lang: string) => void;
  targetLang: string;
  setTargetLang: (lang: string) => void;
  contextLang: "русский" | "english";
  setContextLang: (lang: "русский" | "english") => void;
  onTranslate: () => void;
  onSwapLanguages: () => void;
  isStreaming: boolean;
  history: { original: string; translated: string }[];
  onClearHistory: () => void;
}

export const TranslationForm: React.FC<TranslationFormProps> = ({
  text,
  setText,
  sourceLang,
  setSourceLang,
  targetLang,
  setTargetLang,
  contextLang,
  setContextLang,
  onTranslate,
  onSwapLanguages,
  isStreaming,
  history,
  onClearHistory,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
      <div className="flex gap-4 items-center border-b border-slate-100 pb-4">
        <div className="flex-1">
          <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
            From
          </label>
          <input
            type="text"
            placeholder="English"
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full border-0 p-0 text-lg font-medium focus:ring-0 placeholder:text-slate-300"
          />
        </div>

        <button
          onClick={onSwapLanguages}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-blue-600"
          title="Swap Languages"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m7 21-4-4 4-4" />
            <path d="M3 17h18" />
            <path d="m17 3 4 4-4 4" />
            <path d="M21 7H3" />
          </svg>
        </button>

        <div className="flex-1 text-right">
          <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
            To
          </label>
          <div className="flex items-center justify-end gap-2">
            <input
              type="text"
              placeholder="Ukrainian"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full border-0 p-0 text-lg font-medium focus:ring-0 text-right placeholder:text-slate-300"
            />
          </div>
        </div>
      </div>

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
              onClick={() => setContextLang("english")}
              disabled={contextLang === "english"}
              className="border border-gray-600 text-slate-600 px-3 py-1 text-sm rounded-md disabled:bg-gray-200 hover:bg-gray-100 transition-all shadow-lg shadow-gray-200"
            >
              Eng
            </button>
            <button
              disabled={contextLang === "русский"}
              onClick={() => setContextLang("русский")}
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
