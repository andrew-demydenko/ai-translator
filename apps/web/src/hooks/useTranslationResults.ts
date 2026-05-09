import { useState, useEffect } from "react";
import { useTranslationSocket } from "./useTranslationSocket";
import { TranslationResult } from "@ai-translator/shared-types";

export const useTranslationResults = (socketUrl: string = "ws://localhost:3001") => {
  const [currentTranslation, setCurrentTranslation] = useState<string>("");
  const [streamedResult, setStreamedResult] = useState<Partial<TranslationResult>>({});
  
  const { translate, status, result, fieldUpdates, error } = useTranslationSocket(socketUrl);

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

  const resetResults = () => {
    setCurrentTranslation("");
    setStreamedResult({});
  };

  return {
    currentTranslation,
    setCurrentTranslation,
    streamedResult,
    setStreamedResult,
    status,
    error,
    translate,
    result,
    resetResults,
  };
};
