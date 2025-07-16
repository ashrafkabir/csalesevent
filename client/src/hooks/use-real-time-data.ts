import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useRealTimeData<T>(
  queryKey: string[],
  interval: number = 30000, // 30 seconds default
  enabled: boolean = true
) {
  const query = useQuery<T>({
    queryKey,
    enabled,
    refetchInterval: interval,
    refetchIntervalInBackground: true,
    staleTime: 0, // Always consider data stale for real-time updates
  });

  return query;
}

export function useRealTimeMetrics() {
  return useRealTimeData(["/api/live/metrics"], 10000); // Update every 10 seconds
}
