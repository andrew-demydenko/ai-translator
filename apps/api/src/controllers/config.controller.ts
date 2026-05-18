import { Request, Response } from "express";
import { AppError } from "../middleware/error-handler";
import { resolveProviderConfig, isProviderConfigured } from "../config";
import { getTranslationProvider } from "../services/providers";
import { logger } from "../middleware/logger";
import { parseCookies } from "../utils/cookies";

const API_KEY_COOKIE = "provider_api_key";
const COOKIE_MAX_AGE_DAYS = 365;

export const setApiKey = async (req: Request, res: Response) => {
  const { apiKey } = req.body;

  if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
    throw new AppError(400, "API key is required");
  }

  res.cookie(API_KEY_COOKIE, apiKey.trim(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.json({ ok: true });
};

export const getStatus = async (req: Request, res: Response) => {
  const cookies = parseCookies(req.headers.cookie);
  const cookieApiKey = cookies[API_KEY_COOKIE];

  const resolved = resolveProviderConfig({
    provider: req.query.provider as string | undefined,
    model: req.query.model as string | undefined,
    host: req.query.host as string | undefined,
    apiKey: cookieApiKey,
  });

  const configured = isProviderConfigured({
    provider: resolved.provider,
    model: resolved.model,
    host: resolved.host,
    apiKey: resolved.apiKey,
  });

  if (!configured) {
    let reason: string;
    if (!resolved.model) {
      reason =
        "Model not configured. Set PROVIDER_MODEL env or configure model in UI settings.";
    } else if (resolved.provider === "deepseek" && !resolved.apiKey) {
      reason =
        "DeepSeek requires an API key. Set PROVIDER_API_KEY env or save API key in UI settings.";
    } else {
      reason = "Provider not configured.";
    }

    res.json({
      apiKeyConfigured: !!resolved.apiKey,
      llmConnected: false,
      llmStatus: `not configured: ${reason}`,
      provider: resolved.provider,
      model: resolved.model,
    });
    return;
  }

  let llmConnected = false;
  let llmStatus = "unknown";

  try {
    const resolvedConfig = {
      host: resolved.host,
      apiKey: resolved.apiKey,
      model: resolved.model,
    };
    const provider = getTranslationProvider(resolved.provider, resolvedConfig);
    const health = await provider.checkHealth();
    llmConnected = health.connected;
    llmStatus = health.status;
  } catch (error) {
    logger.warn("Health check failed for status endpoint", {
      error: error instanceof Error ? error.message : String(error),
    });
    llmConnected = false;
    llmStatus = error instanceof Error ? error.message : String(error);
  }

  res.json({
    apiKeyConfigured: !!resolved.apiKey,
    llmConnected,
    llmStatus,
    provider: resolved.provider,
    model: resolved.model,
  });
};
