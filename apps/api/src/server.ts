import http from "http";
import { WebSocketServer } from "ws";
import { app } from "./app";
import { config, getProviderConfig } from "./config";
import { WSHandler } from "./websocket/ws.handler";
import { LLMService } from "./services/llm";
import { getTranslationProvider } from "./services/providers";
import { logger } from "./middleware/logger";

export function createServer() {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  const providerConfig = getProviderConfig();
  const provider = getTranslationProvider(config.provider, providerConfig);
  const llmService = new LLMService(provider);

  wss.on("connection", (socket) => {
    new WSHandler(socket, llmService);
  });

  return server;
}

export function startServer() {
  const server = createServer();
  const port = config.port;

  server.listen(port, () => {
    logger.info(`API Server running on port ${port}`);
    logger.info(`Health check: http://localhost:${port}/api/health`);
  });
}
