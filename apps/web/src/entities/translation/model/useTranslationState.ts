import { useState, useCallback } from "react";

interface UseTranslationStateProps {
  sourceLang: string;
  setSourceLang: (lang: string) => void;
  targetLang: string;
  setTargetLang: (lang: string) => void;
  mode: any;
  contextLang: string;
  translate: (params: any) => void;
  resetResults: () => void;
}

export const useTranslationState = ({
  sourceLang,
  setSourceLang,
  targetLang,
  setTargetLang,
  mode,
  contextLang,
  translate,
  resetResults,
}: UseTranslationStateProps) => {
  const [text, setText] = useState("");

  const handleTranslate = useCallback(() => {
    if (!text.trim()) return;

    // Auto-swap detection
    const isCyrillic = /[а-яё]/i.test(text);
    const isLatin = /[a-z]/i.test(text);

    let currentSource = sourceLang;
    let currentTarget = targetLang;

    // If source is Russian but text is Latin (and no Cyrillic), swap
    if (sourceLang.toLowerCase().includes("rus") && isLatin && !isCyrillic) {
      currentSource = targetLang;
      currentTarget = sourceLang;
      setSourceLang(currentSource);
      setTargetLang(currentTarget);
    }
    // If source is English but text is Cyrillic (and no Latin), swap
    else if (
      sourceLang.toLowerCase().includes("eng") &&
      isCyrillic &&
      !isLatin
    ) {
      currentSource = targetLang;
      currentTarget = sourceLang;
      setSourceLang(currentSource);
      setTargetLang(currentTarget);
    }

    resetResults();
    translate({
      text,
      sourceLang: currentSource,
      targetLang: currentTarget,
      mode,
      contextLanguage: contextLang,
    });
  }, [
    text,
    sourceLang,
    targetLang,
    mode,
    contextLang,
    setSourceLang,
    setTargetLang,
    translate,
    resetResults,
  ]);

  return {
    text,
    setText,
    handleTranslate,
  };
};
