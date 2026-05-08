import React from "react";
import { TranslationRequest } from "@ai-translator/shared-types";

interface HeaderProps {
  mode: TranslationRequest["mode"];
  setMode: (mode: TranslationRequest["mode"]) => void;
}

const modes: TranslationRequest["mode"][] = [
  "standard",
  "formal",
  "informal",
  "technical",
];

export const Header: React.FC<HeaderProps> = ({ mode, setMode }) => {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Translator
        </h1>
      </div>
      <div className="flex gap-2">
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded-md text-sm font-semibold capitalize transition-all ${
              mode === m
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {m}
          </button>
        ))}
      </div>
    </header>
  );
};
