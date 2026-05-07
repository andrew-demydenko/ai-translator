import { Request, Response } from "express";
import { ollamaService } from "../services/ollama.service";

export const healthCheck = async (req: Request, res: Response) => {
  try {
    const status = await ollamaService.checkHealth();
    res.json(status);
  } catch (error) {
    res.status(500).json({ status: "error", error: String(error) });
  }
};
