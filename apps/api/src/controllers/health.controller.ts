import { Request, Response } from "express";
import { resolveProviderConfig, isProviderConfigured } from "../config";
import { getTranslationProvider } from "../services/providers";

export const healthCheck = async (req: Request, res: Response) => {
  const { provider, model, host, apiKey } = resolveProviderConfig({
    provider: req.query.provider as string | undefined,
    model: req.query.model as string | undefined,
    host: req.query.host as string | undefined,
  });

  if (!isProviderConfigured({ provider, model, host, apiKey })) {
    res.json({
      status: "error",
      connected: false,
      error: "Provider not fully configured. Check model and API key settings.",
    });
    return;
  }

  const translationProvider = getTranslationProvider(provider, {
    host,
    model,
    apiKey,
  });
  const status = await translationProvider.checkHealth();
  res.json(status);
};
