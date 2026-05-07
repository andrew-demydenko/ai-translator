import { WebSocket } from "ws";
import { WSMessage, TranslationRequest } from "@ai-translator/shared-types";
import { TranslationRequestSchema } from "../schemas/translation.schema";
import { translationService } from "../services/translation.service";

export class WSHandler {
  constructor(private socket: WebSocket) {
    this.init();
  }

  private init() {
    this.socket.on("message", (data) => this.handleMessage(data));
    this.socket.on("close", () => console.log("WS connection closed"));
    this.socket.on("error", (err) => console.error("WS socket error:", err));
  }

  private async handleMessage(raw: any) {
    try {
      const msg: WSMessage<TranslationRequest> = JSON.parse(raw.toString());

      if (msg.type !== "translate") return;

      // Validate payload
      const validated = TranslationRequestSchema.parse(msg.payload);

      // Perform translation via service
      const result = await translationService.translateStream(validated, (chunk) => {
        this.send({
          type: "chunk",
          requestId: msg.requestId,
          payload: chunk,
        });
      });

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
