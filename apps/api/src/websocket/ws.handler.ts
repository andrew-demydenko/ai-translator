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
import {
  TranslationService,
  getTranslationProvider,
} from "../services/translation.service";
import { config } from "../config";

export class WSHandler {
  private translationService: TranslationService;

  constructor(private socket: WebSocket) {
    this.translationService = new TranslationService(
      getTranslationProvider(config.provider),
    );
    this.init();
  }

  private init() {
    this.socket.on("message", (data) => this.handleMessage(data));
    this.socket.on("close", (code, reason) => {
      console.log(
        `WS connection closed. Code: ${code}, Reason: ${reason || "none"}`,
      );
    });
    this.socket.on("error", (err) => console.error("WS socket error:", err));
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
    try {
      const msg: WSMessage<TranslationRequest> = JSON.parse(raw.toString());

      if (msg.type !== "translate") return;

      // Validate payload
      const validated = this.validateRequest(msg.payload);

      // Perform translation via service
      const result = await this.translationService.translateStream(
        validated,
        (event) => {
          this.send({
            ...event,
            requestId: msg.requestId,
          } as WSMessage<any>);
        },
      );

      // Send final result
      this.send({
        type: "done",
        requestId: msg.requestId,
        payload: result,
      });
    } catch (error: any) {
      console.error("WS Handler Error:", error);
      this.send({
        type: "error",
        requestId: "unknown",
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
