import express from "express";
import cors from "cors";
import { healthCheck } from "./controllers/health.controller";
import { listModels } from "./controllers/model.controller";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// REST Routes
app.get("/health", healthCheck);
app.get("/models", listModels);

export { app };
