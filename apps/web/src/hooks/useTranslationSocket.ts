import { useState, useRef, useEffect, useCallback } from "react";
import {
  WSMessage,
  TranslationRequest,
  TranslationResult,
  FieldUpdatePayload,
} from "@ai-translator/shared-types";

interface TranslationState {
  status: "idle" | "streaming" | "done" | "error";
  chunks: string;
  result: TranslationResult | null;
  fieldUpdates: Partial<TranslationResult>;
  error: string | null;
}

export function useTranslationSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [state, setState] = useState<TranslationState>({
    status: "idle",
    chunks: "",
    result: null,
    fieldUpdates: {},
    error: null,
  });

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected to", url);
      setState((s) => ({ ...s, error: null }));
    };

    ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data);
        console.log("WS Received:", msg.type, msg.payload);

        if (msg.type === "chunk") {
          setState((s) => ({
            ...s,
            status: "streaming",
            chunks: s.chunks + (msg.payload as string),
          }));
        } else if (msg.type === "field_update") {
          const { field, value } = msg.payload as FieldUpdatePayload;
          setState((s) => ({
            ...s,
            status: "streaming",
            fieldUpdates: {
              ...s.fieldUpdates,
              [field]: value,
            },
          }));
        } else if (msg.type === "done") {
          setState({
            status: "done",
            chunks: "",
            fieldUpdates: {},
            result: msg.payload as TranslationResult,
            error: null,
          });
        } else if (msg.type === "error") {
          setState((s) => ({
            ...s,
            status: "error",
            error: msg.payload as string,
          }));
        }
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
      setState((s) => ({
        ...s,
        status: "error",
        error: "WebSocket connection error",
      }));
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      if (!event.wasClean) {
        setState((s) => ({
          ...s,
          status: "error",
          error: `Connection closed unexpectedly (${event.code})`,
        }));
      }
    };

    return () => {
      console.log("Cleaning up WebSocket...");
      ws.close();
    };
  }, [url]);

  const translate = useCallback(
    (req: TranslationRequest) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        // Re-attempting to open if closed
        const ws = new WebSocket(url);
        wsRef.current = ws;
        // Note: In a real app, you'd wait for 'open' event
        setState((s) => ({
          ...s,
          status: "error",
          error: "Connection not ready. Please try again.",
        }));
        return;
      }

      setState({
        status: "streaming",
        chunks: "",
        result: null,
        fieldUpdates: {},
        error: null,
      });
      wsRef.current.send(
        JSON.stringify({
          type: "translate",
          requestId: crypto.randomUUID(),
          payload: req,
        }),
      );
    },
    [url],
  );

  return { translate, ...state };
}
