import { WebSocket } from "ws";
import { WSMessage, TranslationRequest } from "@ai-translator/shared-types";
import {
  TranslationRequestSchema,
  TranslationRequestDTO,
} from "../schemas/translation.schema";
import {
  PracticeRequestSchema,
  PracticeRequestDTO,
} from "../schemas/practice.schema";
import { LLMService } from "../services/llm";
import { logger } from "../middleware/logger";

export class WSHandler {
  constructor(
    private socket: WebSocket,
    private llmService: LLMService,
  ) {
    this.init();
  }

  private init() {
    this.socket.on("message", (data) => this.handleMessage(data));
    this.socket.on("close", (code, reason) => {
      logger.info("WS connection closed", { code, reason: reason || "none" });
    });
    this.socket.on("error", (err) =>
      logger.error("WS socket error", { error: err.message }),
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

  private async handleMessage(raw: any) {
    let requestId = "unknown";

    try {
      const msg: WSMessage<TranslationRequest> = JSON.parse(raw.toString());
      requestId = msg.requestId;

      if (msg.type !== "translate") return;

      const validated = this.validateRequest(msg.payload);

      const result = await this.llmService.generateStream(
        validated,
        (event) => {
          this.send({
            ...event,
            requestId,
          } as WSMessage<any>);
        },
      );

      this.send({
        type: "done",
        requestId,
        payload: result,
      });
    } catch (error: any) {
      logger.error("WS handler error", { requestId, error: error.message });
      this.send({
        type: "error",
        requestId,
        payload: error instanceof Error ? error.message : String(error),
      });
    }
  }

  private send(message: WSMessage<any>) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    }
  }
}
