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
    handleTranslate,
    handleSwapLanguages,
    handleReplaceTranslation,
  } = useTranslationState();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
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
