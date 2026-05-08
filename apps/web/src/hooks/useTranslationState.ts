import { useState, useEffect } from "react";
import { useTranslationSocket } from "./useTranslationSocket";
import {
  TranslationRequest,
  TranslationResult,
} from "@ai-translator/shared-types";

export const useTranslationState = () => {
  const [text, setText] = useState("");
  const [sourceLang, setSourceLang] = useState("rus");
  const [targetLang, setTargetLang] = useState("eng");
  const [mode, setMode] = useState<TranslationRequest["mode"]>("standard");
  const [contextLang, setContextLang] = useState<"русский" | "english">(
    "русский",
  );
  const [currentTranslation, setCurrentTranslation] = useState<string>("");
  const [streamedResult, setStreamedResult] = useState<
    Partial<TranslationResult>
  >({});

  const { translate, status, result, fieldUpdates, error } =
    useTranslationSocket("ws://localhost:3001");

  useEffect(() => {
    if (result) {
      setStreamedResult(result);
      setCurrentTranslation(result.translation);
    } else if (status === "streaming") {
      setStreamedResult(fieldUpdates);
      if (fieldUpdates.translation) {
        setCurrentTranslation(fieldUpdates.translation);
      }
    }
  }, [result, status, fieldUpdates]);

  const handleTranslate = () => {
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

    setCurrentTranslation("");
    setStreamedResult({});
    translate({
      text,
      sourceLang: currentSource,
      targetLang: currentTarget,
      mode,
      contextLanguage: contextLang,
    });
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  const handleReplaceTranslation = (newText: string) => {
    setCurrentTranslation(newText);
  };

  return {
    // State
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
    // Handlers
    handleTranslate,
    handleSwapLanguages,
    handleReplaceTranslation,
  };
};
