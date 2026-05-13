import React, { useEffect, useCallback } from "react";
import { useParams, NavLink } from "react-router-dom";
import { clsx } from "clsx";
import { TranslationRequest } from "@ai-translator/shared-types";
import {
  useTranslationState,
  useTranslationConfig,
  useTranslationHistory,
  useTranslationResults,
  TranslationResultSection,
} from "@/entities/translation";
import { TranslationForm } from "@/features/translate-text";
import { ErrorMessage } from "@/shared/ui";

export const modes: TranslationRequest["mode"][] = [
  "standard",
  "formal",
  "informal",
  "technical",
];

export const TranslationWidget: React.FC = () => {
  const { mode: modeParam } = useParams<{ mode?: string }>();
  const mode = (modeParam as TranslationRequest["mode"]) || "standard";

  const {
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    contextLang,
    setContextLang,
  } = useTranslationConfig(mode);

  const {
    currentTranslation,
    setCurrentTranslation,
    streamedResult,
    status,
    error,
    translate,
    result,
    resetResults,
  } = useTranslationResults();

  const { history, addToHistory, clearHistory } = useTranslationHistory();

  const { text, setText, handleTranslate } = useTranslationState({
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    mode,
    contextLang,
    translate,
    resetResults,
  });

  // Handle history updates when translation is finished
  useEffect(() => {
    if (result) {
      addToHistory(text, result.translation);
    }
  }, [result, addToHistory, text]);

  const handleReplaceTranslation = useCallback(
    (newText: string) => {
      setCurrentTranslation(newText);
    },
    [setCurrentTranslation],
  );

  return (
    <div className="space-y-6 flex flex-col min-h-[1px]">
      <nav className="flex gap-2">
        {modes.map((m) => (
          <NavLink
            key={m}
            to={m === "standard" ? "/" : `/${m}`}
            className={({ isActive }) =>
              clsx(
                "px-3 py-1 rounded-md text-sm font-semibold capitalize transition-all",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200",
              )
            }
          >
            {m}
          </NavLink>
        ))}
      </nav>

      <TranslationForm
        text={text}
        setText={setText}
        sourceLang={sourceLang}
        setSourceLang={setSourceLang}
        targetLang={targetLang}
        setTargetLang={setTargetLang}
        contextLang={contextLang}
        setContextLang={setContextLang}
        onTranslate={handleTranslate}
        isStreaming={status === "streaming"}
        history={history}
        onClearHistory={clearHistory}
      />

      <ErrorMessage error={error} />

      <TranslationResultSection
        status={status}
        currentTranslation={currentTranslation}
        streamedResult={streamedResult}
        onReplaceTranslation={handleReplaceTranslation}
      />
    </div>
  );
};
