import "dotenv/config";
import http from "http";
import { WebSocketServer } from "ws";
import { app } from "./app";
import { config } from "./config";
import { WSHandler } from "./websocket/ws.handler";

export function createServer() {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket) => {
    new WSHandler(socket);
  });

  return server;
}

export function startServer() {
  const server = createServer();
  const port = config.port;

  server.listen(port, () => {
    console.log(`🚀 API Server running on port ${port}`);
    console.log(`🔗 Health check: http://localhost:${port}/health`);
  });
}
