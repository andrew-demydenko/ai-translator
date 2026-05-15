import { Request, Response } from "express";
import { config, getProviderConfig } from "../config";
import { getTranslationProvider } from "../services/providers";

export const listModels = async (_req: Request, res: Response) => {
  const provider = getTranslationProvider(config.provider, getProviderConfig());
  const models = await provider.listModels();
  res.json(models);
};
