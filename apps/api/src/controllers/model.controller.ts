import { Request, Response } from "express";
import { ollamaService } from "../services/ollama.service";
import { deepseekService } from "../services/deepseek.service";
import { config } from "../config";

export const listModels = async (req: Request, res: Response) => {
  try {
    const models = config.provider === "deepseek"
      ? await deepseekService.listModels()
      : await ollamaService.listModels();
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};
