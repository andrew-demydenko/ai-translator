import React from "react";
import { useTranslationState } from "./hooks/useTranslationState";
import { Header } from "./components/layout/Header";
import { TranslationForm } from "./components/TranslationForm";
import { TranslationResultSection } from "./components/translationResult/TranslationResultSection";
import { ErrorMessage } from "./components/ErrorMessage";

const App: React.FC = () => {
  const {
    text,
    setText,
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    mode,
    setMode,
    contextLang,
    setContextLang,
    currentTranslation,
    streamedResult,
    status,
    error,
    history,
    handleTranslate,
    handleSwapLanguages,
    handleReplaceTranslation,
    clearHistory,
  } = useTranslationState();

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
