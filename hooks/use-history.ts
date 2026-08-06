import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchHistory, clearHistory } from "../services/api";
import { HistoryResponse } from "../types/api";

export function useHistory() {
  const queryClient = useQueryClient();

  const query = useQuery<HistoryResponse, Error>({
    queryKey: ["history"],
    queryFn: fetchHistory,
  });

  const clearMutation = useMutation<void, Error, void>({
    mutationFn: clearHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });

  return {
    history: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    clearHistory: clearMutation.mutate,
    isClearing: clearMutation.isPending,
  };
}
