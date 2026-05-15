import { useEffect } from "react";
import { useTranslationStore } from "@/entities/translation";
import { useGenerationSocket } from "@/shared/api";

export function useTranslationSync() {
  const registerTransport = useTranslationStore((s) => s.registerTransport);
  const syncSocketState = useTranslationStore((s) => s.syncSocketState);

  const { generate, status, result, fieldUpdates, error } =
    useGenerationSocket("translation");

  useEffect(() => {
    registerTransport(generate);
  }, [generate]);

  useEffect(() => {
    if (status !== "done" && status !== "error") return;

    syncSocketState({ status, error, result, fieldUpdates });
  }, [status, result, fieldUpdates, error, syncSocketState]);
}
