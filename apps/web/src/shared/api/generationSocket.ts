import { useCallback, useSyncExternalStore } from "react";
import type {
  WSMessage,
  TranslationRequest,
  TranslationResult,
  PracticeResult,
  FieldUpdatePayload,
  GenerationMode,
  ResultByType,
} from "@ai-translator/shared-types";
import { WS_URL } from "@/shared/config/ws";

type Result = TranslationResult | PracticeResult;

interface TranslationState {
  status: "idle" | "streaming" | "done" | "error";
  chunks: string;
  result: Result | null;
  fieldUpdates: Partial<TranslationResult>;
  error: string | null;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const BASE_RECONNECT_DELAY_MS = 1000;

type Listener = () => void;

class GenerationSocket {
  private wsRef: WebSocket | null = null;
  private pendingRequestRef: TranslationRequest | null = null;
  private reconnectAttempts = 0;
  private cleanupTimeout: ReturnType<typeof setTimeout> | null = null;
  private isCleanedUp = false;

  currentType: GenerationMode | null = null;

  private state: TranslationState = {
    status: "idle",
    chunks: "",
    result: null,
    fieldUpdates: {},
    error: null,
  };

  private listeners = new Set<Listener>();

  private emitChange(): void {
    this.listeners.forEach((l) => l());
  }

  private connect(): void {
    if (this.isCleanedUp) return;
    if (
      this.wsRef?.readyState === WebSocket.CONNECTING ||
      this.wsRef?.readyState === WebSocket.OPEN
    )
      return;

    const ws = new WebSocket(WS_URL);
    this.wsRef = ws;

    ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.state = { ...this.state, error: null };
      this.emitChange();

      if (this.pendingRequestRef) {
        const req = this.pendingRequestRef;
        this.pendingRequestRef = null;
        this.sendTranslateRequest(req);
      }
    };

    ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data);

        if (msg.type === "chunk") {
          this.state = {
            ...this.state,
            status: "streaming",
            chunks: this.state.chunks + (msg.payload as string),
          };
          this.emitChange();
        } else if (msg.type === "field_update") {
          const { field, value } = msg.payload as FieldUpdatePayload;
          this.state = {
            ...this.state,
            status: "streaming",
            fieldUpdates: { ...this.state.fieldUpdates, [field]: value },
          };
          this.emitChange();
        } else if (msg.type === "done") {
          this.state = {
            ...this.state,
            status: "done",
            chunks: "",
            result: msg.payload as Result,
            error: null,
          };
          this.emitChange();
        } else if (msg.type === "error") {
          this.state = {
            ...this.state,
            status: "error",
            error: msg.payload as string,
          };
          this.emitChange();
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    };

    ws.onclose = () => {
      if (this.isCleanedUp) return;

      this.reconnectAttempts += 1;

      if (this.reconnectAttempts > MAX_RECONNECT_ATTEMPTS) {
        this.pendingRequestRef = null;
        this.state = {
          ...this.state,
          status: "error",
          error: "Сервер недоступен. Попробуйте позже.",
        };
        this.emitChange();
        return;
      }

      const delay = BASE_RECONNECT_DELAY_MS * 2 ** (this.reconnectAttempts - 1);
      this.cleanupTimeout = setTimeout(() => this.connect(), delay);
    };

    ws.onerror = () => {};
  }

  private sendTranslateRequest(req: TranslationRequest): void {
    if (this.wsRef?.readyState === WebSocket.OPEN) {
      this.state = {
        status: "streaming",
        chunks: "",
        result: null,
        fieldUpdates: {},
        error: null,
      };
      this.emitChange();
      this.wsRef.send(
        JSON.stringify({
          type: "translate",
          requestId: crypto.randomUUID(),
          payload: req,
        }),
      );
    } else {
      this.pendingRequestRef = req;
    }
  }

  generate(req: TranslationRequest, type: GenerationMode): void {
    if (type !== this.currentType) {
      this.currentType = type;
      this.state = {
        status: "idle",
        chunks: "",
        result: null,
        fieldUpdates: {},
        error: null,
      };
      this.emitChange();
    }

    if (this.wsRef?.readyState === WebSocket.OPEN) {
      this.sendTranslateRequest(req);
      return;
    }

    this.pendingRequestRef = req;
    this.reconnectAttempts = 0;

    if (this.wsRef?.readyState !== WebSocket.CONNECTING) {
      this.connect();
    }
  }

  getSnapshot(): TranslationState {
    return this.state;
  }

  subscribe(cb: Listener): () => void {
    this.listeners.add(cb);

    if (!this.wsRef && !this.isCleanedUp) {
      this.connect();
    }

    return () => {
      this.listeners.delete(cb);
    };
  }

  cleanup(): void {
    this.isCleanedUp = true;
    if (this.cleanupTimeout) clearTimeout(this.cleanupTimeout);
    this.wsRef?.close();
    this.wsRef = null;
    this.listeners.clear();
  }
}

let instance: GenerationSocket | null = null;

function getInstance(): GenerationSocket {
  if (!instance) {
    instance = new GenerationSocket();
  }
  return instance;
}

const IDLE_STATE: TranslationState = {
  status: "idle",
  chunks: "",
  result: null,
  fieldUpdates: {},
  error: null,
};

export function useGenerationSocket<T extends GenerationMode>(type: T) {
  const socket = getInstance();

  const subscribe = useCallback((cb: Listener) => socket.subscribe(cb), []);
  const getSnapshot = useCallback(() => socket.getSnapshot(), []);

  const rawState = useSyncExternalStore(subscribe, getSnapshot);

  const state = socket.currentType === type ? rawState : IDLE_STATE;

  const generateRequest = useCallback(
    (req: TranslationRequest) => {
      socket.generate(req, type);
    },
    [type],
  );

  return {
    generate: generateRequest,
    ...state,
    result: state.result as ResultByType<T> | null,
  };
}
export function cleanupGenerationSocket(): void {
  instance?.cleanup();
  instance = null;
}
