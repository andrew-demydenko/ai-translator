import { Request, Response } from "express";
import { ollamaService } from "../services/ollama.service";
import { deepseekService } from "../services/deepseek.service";
import { config } from "../config";

export const healthCheck = async (req: Request, res: Response) => {
  try {
    const status = config.provider === "deepseek" 
      ? await deepseekService.checkHealth()
      : await ollamaService.checkHealth();
    res.json(status);
  } catch (error) {
    res.status(500).json({ status: "error", error: String(error) });
  }
};
