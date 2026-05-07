import { useState, useRef, useEffect, useCallback } from "react";
import {
  WSMessage,
  TranslationRequest,
  TranslationResult,
} from "@ai-translator/shared-types";

interface TranslationState {
  status: "idle" | "streaming" | "done" | "error";
  chunks: string;
  result: TranslationResult | null;
  error: string | null;
}

export function useTranslationSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [state, setState] = useState<TranslationState>({
    status: "idle",
    chunks: "",
    result: null,
    error: null,
  });

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data);

        if (msg.type === "chunk") {
          setState((s) => ({
            ...s,
            status: "streaming",
            chunks: s.chunks + (msg.payload as string),
          }));
        } else if (msg.type === "done") {
          setState({
            status: "done",
            chunks: "",
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
      console.error("WebSocket error", err);
      setState((s) => ({
        ...s,
        status: "error",
        error: "WebSocket connection error",
      }));
    };

    return () => {
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

      setState({ status: "streaming", chunks: "", result: null, error: null });
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
