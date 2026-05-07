import { Request, Response } from "express";
import { ollamaService } from "../services/ollama.service";

export const listModels = async (req: Request, res: Response) => {
  try {
    const models = await ollamaService.listModels();
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
};
