import { API_URL } from "@/shared/config/constats";
import type { Provider } from "../model/types";

const STATUS_ENDPOINT = "/config/status";

export interface ConfigStatus {
  apiKeyConfigured: boolean;
  llmConnected: boolean;
  llmStatus: string;
  provider: string;
  model: string;
}

export interface StatusParams {
  provider: Provider;
  model: string;
  host: string;
}

export async function getConfigStatus(
  params: StatusParams,
): Promise<ConfigStatus> {
  const query = new URLSearchParams({
    provider: params.provider,
    model: params.model,
    host: params.host,
  });
  const response = await fetch(`${API_URL}${STATUS_ENDPOINT}?${query}`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch config status");
  }

  return response.json();
}
