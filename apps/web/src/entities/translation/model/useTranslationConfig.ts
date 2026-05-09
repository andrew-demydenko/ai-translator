import { useState, useEffect } from "react";
import { TranslationRequest } from "@ai-translator/shared-types";

export const useTranslationConfig = (
  initialMode: TranslationRequest["mode"] = "standard",
) => {
  const [sourceLang, setSourceLang] = useState("rus");
  const [targetLang, setTargetLang] = useState("eng");
  const [mode, setMode] = useState<TranslationRequest["mode"]>(initialMode);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);
  const [contextLang, setContextLang] = useState<"русский" | "english">(
    "русский",
  );

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  return {
    sourceLang,
    setSourceLang,
    targetLang,
    setTargetLang,
    mode,
    setMode,
    contextLang,
    setContextLang,
    handleSwapLanguages,
  };
};
