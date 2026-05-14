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

const MAX_RECONNECT_ATTEMPTS = 5;
const BASE_RECONNECT_DELAY_MS = 1000;

export function useTranslationSocket(url: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const pendingRequestRef = useRef<TranslationRequest | null>(null);
  const connectRef = useRef<(() => void) | null>(null);
  const setStateRef = useRef<React.Dispatch<
    React.SetStateAction<TranslationState>
  > | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const [state, setState] = useState<TranslationState>({
    status: "idle",
    chunks: "",
    result: null,
    fieldUpdates: {},
    error: null,
  });

  setStateRef.current = setState;

  const sendTranslateRequest = useCallback((req: TranslationRequest) => {
    const ws = wsRef.current;
    if (ws?.readyState === WebSocket.OPEN) {
      setStateRef.current?.({
        status: "streaming",
        chunks: "",
        result: null,
        fieldUpdates: {},
        error: null,
      });
      ws.send(
        JSON.stringify({
          type: "translate",
          requestId: crypto.randomUUID(),
          payload: req,
        }),
      );
    } else {
      pendingRequestRef.current = req;
    }
  }, []);

  useEffect(() => {
    let cleanup = false;
    let reconnectTimeout: number;

    const connect = () => {
      if (cleanup) return;
      if (wsRef.current?.readyState === WebSocket.CONNECTING) return;

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected to", url);
        // Reset reconnect attempts on successful connection
        reconnectAttemptsRef.current = 0;
        setStateRef.current?.((s) => ({ ...s, error: null }));

        if (pendingRequestRef.current) {
          const req = pendingRequestRef.current;
          pendingRequestRef.current = null;
          sendTranslateRequest(req);
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg: WSMessage = JSON.parse(event.data);

          if (msg.type === "chunk") {
            setStateRef.current?.((s) => ({
              ...s,
              status: "streaming",
              chunks: s.chunks + (msg.payload as string),
            }));
          } else if (msg.type === "field_update") {
            const { field, value } = msg.payload as FieldUpdatePayload;
            setStateRef.current?.((s) => ({
              ...s,
              status: "streaming",
              fieldUpdates: { ...s.fieldUpdates, [field]: value },
            }));
          } else if (msg.type === "done") {
            setStateRef.current?.({
              status: "done",
              chunks: "",
              fieldUpdates: {},
              result: msg.payload as TranslationResult,
              error: null,
            });
          } else if (msg.type === "error") {
            setStateRef.current?.((s) => ({
              ...s,
              status: "error",
              error: msg.payload as string,
            }));
          }
        } catch (error) {
          console.error("Error parsing message:", error);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        if (cleanup) return;

        reconnectAttemptsRef.current += 1;

        if (reconnectAttemptsRef.current > MAX_RECONNECT_ATTEMPTS) {
          console.warn("WebSocket: превышен лимит попыток переподключения");
          pendingRequestRef.current = null;
          setStateRef.current?.((s) => ({
            ...s,
            status: "error",
            error: "Сервер недоступен. Попробуйте позже.",
          }));
          return;
        }

        // Exponential retry backoff: 1с, 2с, 4с, 8с, 16с
        const delay =
          BASE_RECONNECT_DELAY_MS * 2 ** (reconnectAttemptsRef.current - 1);
        console.log(
          `WebSocket: retrying ${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms`,
        );
        reconnectTimeout = setTimeout(connect, delay);
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
      };
    };

    connectRef.current = connect;
    connect();

    return () => {
      cleanup = true;
      clearTimeout(reconnectTimeout);
      wsRef.current?.close();
    };
  }, [url, sendTranslateRequest]);

  const translate = useCallback(
    (req: TranslationRequest) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        sendTranslateRequest(req);
        return;
      }

      pendingRequestRef.current = req;

      // Reset reconnect attempts on manual call
      reconnectAttemptsRef.current = 0;

      if (wsRef.current?.readyState !== WebSocket.CONNECTING) {
        connectRef.current?.();
      }
    },
    [sendTranslateRequest],
  );

  return { translate, ...state };
}
