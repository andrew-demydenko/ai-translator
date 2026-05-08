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
  const [lastTranslatedText, setLastTranslatedText] = useState("");
  const [history, setHistory] = useState<
    { original: string; translated: string }[]
  >([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("translation_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const { translate, status, result, fieldUpdates, error } =
    useTranslationSocket("ws://localhost:3001");

  useEffect(() => {
    if (result) {
      setStreamedResult(result);
      setCurrentTranslation(result.translation);

      // Add to history
      setHistory((prev) => {
        const textToSave = lastTranslatedText || text;
        const newEntry = {
          original: textToSave,
          translated: result.translation,
        };
        // Avoid duplicates if the same thing is translated consecutively
        if (prev.length > 0 && prev[0].original === textToSave) {
          return prev;
        }
        const updatedHistory = [newEntry, ...prev].slice(0, 10);
        localStorage.setItem(
          "translation_history",
          JSON.stringify(updatedHistory),
        );
        return updatedHistory;
      });
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
    setLastTranslatedText(text);
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

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("translation_history");
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
    history,
    // Handlers
    handleTranslate,
    handleSwapLanguages,
    handleReplaceTranslation,
    clearHistory,
  };
};
