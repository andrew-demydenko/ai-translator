import { Request, Response } from "express";
import { AppError } from "../middleware/error-handler";
import { config } from "../config";
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
  const envApiKey = config.apiKey;
  const hasApiKey = !!(cookieApiKey || envApiKey);

  const clientProvider = (req.query.provider as string) || config.provider;
  const clientModel = (req.query.model as string) || config.model || "";
  const clientHost = (req.query.host as string) || config.host;
  const envFallbackModel = config.model || "";

  const resolvedModel = clientModel || envFallbackModel;
  const resolvedProvider = clientProvider;

  let llmConnected = false;
  let llmStatus = "unknown";

  try {
    if (!resolvedModel) {
      throw new Error(
        "PROVIDER_MODEL environment variable is required. Example: PROVIDER_MODEL=llama3.2",
      );
    }

    const resolvedConfig = {
      host: clientHost,
      apiKey: cookieApiKey || envApiKey || "",
      model: resolvedModel,
    };
    const provider = getTranslationProvider(resolvedProvider, resolvedConfig);
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
    apiKeyConfigured: hasApiKey,
    llmConnected,
    llmStatus,
    provider: resolvedProvider,
    model: resolvedModel,
  });
};
