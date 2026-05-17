import http from "http";
import { WebSocketServer } from "ws";
import { app } from "./app";
import { config } from "./config";
import { WSHandler } from "./websocket/ws.handler";
import { logger } from "./middleware/logger";

export function createServer() {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket, request) => {
    new WSHandler(socket, request);
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
