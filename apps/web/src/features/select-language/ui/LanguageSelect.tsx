import React from "react";
import { clsx } from "clsx";

interface LanguageSelectProps {
  sourceLang: string;
  targetLang: string;
  onConfigChange: (config: { sourceLang?: string; targetLang?: string }) => void;
  className?: string;
  swapClassName?: string;
}

export const LanguageSelect: React.FC<LanguageSelectProps> = ({
  sourceLang,
  targetLang,
  onConfigChange,
  swapClassName,
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex gap-4 items-center border-b border-slate-100 pb-4",
        className,
      )}
    >
      <div className="flex-1">
        <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
          From
        </label>
        <input
          type="text"
          placeholder="English"
          value={sourceLang}
          onChange={(e) => onConfigChange({ sourceLang: e.target.value })}
          className="w-full border-0 p-0 text-lg font-medium focus:ring-0 placeholder:text-slate-300 bg-transparent"
        />
      </div>

      <button
        onClick={() => {
          onConfigChange({ sourceLang: targetLang, targetLang: sourceLang });
        }}
        className={clsx(
          "p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-blue-600",
          swapClassName,
        )}
        title="Swap languages"
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
            onChange={(e) => onConfigChange({ targetLang: e.target.value })}
            className="w-full border-0 p-0 text-lg font-medium focus:ring-0 text-right placeholder:text-slate-300 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
};
