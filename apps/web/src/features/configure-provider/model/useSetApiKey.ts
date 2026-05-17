import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setApiKey } from "../api/setApiKey";
import { reconnectGenerationSocket } from "@/shared/api/generationSocket";

export function useSetApiKey(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (key: string) => setApiKey(key),
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["config-status"] });
      reconnectGenerationSocket();
    },
  });

  return mutation;
}
