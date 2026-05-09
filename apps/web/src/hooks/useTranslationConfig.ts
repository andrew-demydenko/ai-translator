import { useState } from "react";
import { TranslationRequest } from "@ai-translator/shared-types";

export const useTranslationConfig = () => {
  const [sourceLang, setSourceLang] = useState("rus");
  const [targetLang, setTargetLang] = useState("eng");
  const [mode, setMode] = useState<TranslationRequest["mode"]>("standard");
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
