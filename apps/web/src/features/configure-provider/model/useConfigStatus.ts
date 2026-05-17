import { useQuery } from "@tanstack/react-query";
import { getConfigStatus, ConfigStatus, StatusParams } from "../api/getStatus";
import { useProviderStore } from "./provider.store";

const DEFAULT_STATUS: ConfigStatus = {
  apiKeyConfigured: false,
  llmConnected: false,
  llmStatus: "checking",
  provider: "",
  model: "",
};

export function useConfigStatus() {
  const provider = useProviderStore((s) => s.provider);
  const model = useProviderStore((s) => s.model);
  const host = useProviderStore((s) => s.host);

  const params: StatusParams = { provider, model, host };

  const query = useQuery<ConfigStatus>({
    queryKey: ["config-status", provider, model, host],
    queryFn: () => getConfigStatus(params),
    refetchInterval: 30_000,
    retry: 2,
    retryDelay: 2000,
    staleTime: 10_000,
  });

  return {
    status: query.data ?? DEFAULT_STATUS,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
