import express, { Express } from "express";
import cors from "cors";
import path from "path";
import { healthCheck } from "./controllers/health.controller";
import { listModels } from "./controllers/model.controller";

const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());

// REST Routes
app.get("/api/health", healthCheck);
app.get("/api/models", listModels);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(process.cwd(), "web/dist");

  app.use(express.static(staticPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

export { app };
