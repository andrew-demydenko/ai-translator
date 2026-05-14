import { useState, useEffect } from "react";
import { useTranslationSocket } from "../api/useTranslationSocket";
import { TranslationResult } from "@ai-translator/shared-types";

const protocol = window.location.protocol === "https:" ? "wss" : "ws";
const WS_URL =
  import.meta.env.VITE_WS_URL || `${protocol}://${window.location.host}`;

export const useTranslationResults = (socketUrl: string = WS_URL) => {
  const [currentTranslation, setCurrentTranslation] = useState<string>("");
  const [streamedResult, setStreamedResult] = useState<
    Partial<TranslationResult>
  >({});

  const { translate, status, result, fieldUpdates, error } =
    useTranslationSocket(socketUrl);

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
