import express, { Express } from "express";
import cors from "cors";
import path from "path";
import { healthRouter, modelRouter } from "./routes";
import { errorHandler } from "./middleware/error-handler";

const app: Express = express();

app.use(cors());
app.use(express.json());

app.use("/api", healthRouter);
app.use("/api", modelRouter);

if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(process.cwd(), "web/dist");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

app.use(errorHandler);

export { app };
