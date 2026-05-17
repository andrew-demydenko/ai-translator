import React, { useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { TranslationRequest } from "@ai-translator/shared-types";
import { clsx } from "clsx";
import {
  useTranslationStore,
  TRANSLATION_MODES,
  TranslationResultSection,
  useTranslationConfig,
  useTranslationInput,
  useTranslationHistory,
} from "@/entities/translation";
import {
  TranslationForm,
  useTranslationSync,
  useTranslateTextResult,
} from "@/features/translate-text";
import { useConfigStatus } from "@/features/configure-provider";
import { ErrorMessage } from "@/shared/ui";

export const TranslationWidget: React.FC = () => {
  const { mode: modeParam } = useParams<{ mode?: string }>();
  const setMode = useTranslationStore((s) => s.setMode);
  useTranslationSync();
  const { sourceLang, targetLang, contextLang, setConfig } =
    useTranslationConfig();
  const { text, setText } = useTranslationInput();
  const {
    status,
    error,
    currentTranslation,
    replaceTranslation,
    streamedResult,
  } = useTranslateTextResult();
  const { history, clearHistory } = useTranslationHistory();
  const handleTranslate = useTranslationStore((s) => s.handleTranslate);
  const { isLoading, isError, status: configStatus } = useConfigStatus();
  const isBackendReady = !isLoading && !isError && configStatus.llmConnected;

  useEffect(() => {
    const next = modeParam as TranslationRequest["mode"];
    setMode(TRANSLATION_MODES.includes(next) ? next : "standard");
  }, [modeParam]);

  return (
    <div className="space-y-6 flex flex-col min-h-[1px]">
      <nav className="flex gap-2">
        {TRANSLATION_MODES.map((m) => (
          <NavLink
            key={m}
            to={`/translate/${m}`}
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
        targetLang={targetLang}
        contextLang={contextLang}
        onConfigChange={setConfig}
        onTranslate={handleTranslate}
        isStreaming={status === "streaming"}
        isBackendReady={isBackendReady}
        history={history}
        onClearHistory={clearHistory}
      />

      <ErrorMessage error={error} />

      <TranslationResultSection
        status={status}
        currentTranslation={currentTranslation}
        streamedResult={streamedResult}
        onReplaceTranslation={replaceTranslation}
      />
    </div>
  );
};
