import { WebSocket } from "ws";
import type { IncomingMessage } from "http";
import { WSMessage, ProviderPayload } from "@ai-translator/shared-types";
import {
  TranslationRequestSchema,
  TranslationRequestDTO,
} from "../schemas/translation.schema";
import {
  PracticeRequestSchema,
  PracticeRequestDTO,
} from "../schemas/practice.schema";
import { LLMService } from "../services/llm";
import { getTranslationProvider } from "../services/providers";
import {
  isProviderConfigured,
  resolveProviderConfig,
  ResolvedProviderConfig,
} from "../config";
import { logger } from "../middleware/logger";
import { parseCookies } from "../utils/cookies";

const API_KEY_COOKIE = "provider_api_key";

export class WSHandler {
  private providerConfig: ResolvedProviderConfig | null = null;
  private connectedAt: number = Date.now();

  constructor(
    private socket: WebSocket,
    private request: IncomingMessage,
  ) {
    this.init();
  }

  private init() {
    const clientIp =
      this.request.headers["x-forwarded-for"] ||
      this.request.socket.remoteAddress ||
      "unknown";
    logger.info("WS connection established", { clientIp });

    this.socket.on("message", (data) => this.handleMessage(data));
    this.socket.on("close", (code, reason) => {
      const duration = Date.now() - this.connectedAt;
      logger.info("WS connection closed", {
        code,
        reason: reason || "none",
        durationMs: duration,
        clientIp,
      });
    });
    this.socket.on("error", (err) =>
      logger.error("WS socket error", {
        error: err.message,
        clientIp,
      }),
    );
  }

  private validateRequest(payload: {
    generationType: string;
  }): TranslationRequestDTO | PracticeRequestDTO {
    switch (payload.generationType) {
      case "practice":
        return PracticeRequestSchema.parse(payload);
      case "translation":
        return TranslationRequestSchema.parse(payload);
      default:
        throw new Error(`Unknown generationType: ${payload.generationType}`);
    }
  }

  private createLLMService(): LLMService {
    const providerData = resolveProviderConfig(this.providerConfig || {});
    const { provider, model, host, apiKey } = providerData;

    if (!isProviderConfigured({ provider, model, host, apiKey })) {
      if (!model) {
        throw new Error(
          "Model not configured. Set PROVIDER_MODEL env or configure model in UI settings.",
        );
      }
      if (provider === "deepseek" && !apiKey) {
        throw new Error(
          "DeepSeek requires an API key. Set PROVIDER_API_KEY env or save API key in UI settings.",
        );
      }
      throw new Error("Provider not configured.");
    }

    const providerConfig = {
      host,
      model,
      apiKey,
    };

    const translationProvider = getTranslationProvider(
      provider,
      providerConfig,
    );
    return new LLMService(translationProvider);
  }

  private async handleMessage(raw: any) {
    let requestId = "unknown";

    try {
      const msg: WSMessage = JSON.parse(raw.toString());
      requestId = msg.requestId;

      if (msg.type === "configure") {
        const cookies = parseCookies(this.request.headers.cookie);

        this.providerConfig = resolveProviderConfig({
          ...(msg.payload as ProviderPayload),
          apiKey: cookies[API_KEY_COOKIE],
        });
        logger.info("Provider configured", {
          provider: this.providerConfig.provider,
          model: this.providerConfig.model,
        });
        return;
      }

      if (msg.type !== "translate") {
        logger.warn("WS unknown message type", { type: msg.type, requestId });
        return;
      }

      const validated = this.validateRequest(
        msg.payload as { generationType: string },
      );

      const llmService = this.createLLMService();

      const result = await llmService.generateStream(validated, (event) => {
        this.send({
          ...event,
          requestId,
        } as WSMessage<any>);
      });

      this.send({
        type: "done",
        requestId,
        payload: result,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error("WS handler error", { requestId, error: error.message });
      } else {
        logger.error("WS handler error", { requestId, error: String(error) });
      }
      this.send({
        type: "error",
        requestId,
        payload: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private send(message: WSMessage<any>) {
    if (this.socket.readyState === WebSocket.OPEN) {
      logger.debug("WS message sent", {
        type: message.type,
        requestId: message.requestId,
      });
      this.socket.send(JSON.stringify(message));
    } else {
      logger.warn("WS send skipped - socket not open", {
        type: message.type,
        requestId: message.requestId,
        readyState: this.socket.readyState,
      });
    }
  }
}
