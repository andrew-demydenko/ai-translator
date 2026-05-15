import { useGenerationSocket } from "@/shared/api";
import { useTranslationResult } from "@/entities/translation";

interface UseTranslateTextResultReturn {
  status: string;
  currentTranslation: string;
  streamedResult: Record<string, unknown>;
  error: string | null;
  replaceTranslation: (translation: string) => void;
}

export function useTranslateTextResult(): UseTranslateTextResultReturn {
  const {
    status: socketStatus,
    fieldUpdates,
    error: socketError,
  } = useGenerationSocket("translation");

  const {
    status: storeStatus,
    currentTranslation: storeTranslation,
    streamedResult: storeStreamedResult,
    error: storeError,
    replaceTranslation,
  } = useTranslationResult();

  if (socketStatus === "streaming") {
    return {
      status: socketStatus,
      currentTranslation: (fieldUpdates.translation as string) ?? "",
      streamedResult: fieldUpdates,
      error: socketError,
      replaceTranslation,
    };
  }

  return {
    status: storeStatus,
    currentTranslation: storeTranslation,
    streamedResult: storeStreamedResult,
    error: storeError,
    replaceTranslation,
  };
}
