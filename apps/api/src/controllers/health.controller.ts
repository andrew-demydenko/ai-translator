import { Request, Response } from "express";
import { config, getProviderConfig } from "../config";
import { getTranslationProvider } from "../services/providers";

export const healthCheck = async (_req: Request, res: Response) => {
  const provider = getTranslationProvider(config.provider, getProviderConfig());
  const status = await provider.checkHealth();
  res.json(status);
};
