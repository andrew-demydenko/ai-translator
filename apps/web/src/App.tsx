import React, { useEffect, useCallback } from "react";
import { useTranslationState } from "./hooks/useTranslationState";
import { useTranslationConfig } from "./hooks/useTranslationConfig";
import { useTranslationHistory } from "./hooks/useTranslationHistory";
import { useTranslationResults } from "./hooks/useTranslationResults";
import { Header } from "./components/layout/Header";
import { TranslationForm } from "./components/TranslationForm";
import { TranslationResultSection } from "./components/translationResult/TranslationResultSection";
import { ErrorMessage } from "./components/ErrorMessage";

const App: React.FC = () => {
  const {
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    mode,
    setMode,
    contextLang,
    setContextLang,
    handleSwapLanguages,
  } = useTranslationConfig();

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
    <div className="h-screen bg-slate-50 p-4 md:p-8 flex flex-col">
      <div className="flex-1 max-w-4xl mx-auto space-y-6 w-full flex flex-col min-h-[1px]">
        <Header mode={mode} setMode={setMode} />

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
          onSwapLanguages={handleSwapLanguages}
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
    </div>
  );
};

export default App;
