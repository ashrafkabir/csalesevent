import { useQuery } from "@tanstack/react-query";
import MetricsTicker from "@/components/dashboard/metrics-ticker";
import SalesChart from "@/components/dashboard/sales-chart";
import TopProducts from "@/components/dashboard/top-products";
import RegionalPerformance from "@/components/dashboard/regional-performance";
import AIInsights from "@/components/dashboard/ai-insights";
import { useRealTimeMetrics } from "@/hooks/use-real-time-data";

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useRealTimeMetrics();
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["/api/products"],
  });
  const { data: stores, isLoading: storesLoading } = useQuery({
    queryKey: ["/api/stores"],
  });

  if (metricsLoading || productsLoading || storesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <MetricsTicker metrics={metrics as any} />
      <AIInsights />
      
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <SalesChart />
        </div>
        <div className="col-span-1">
          <TopProducts />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RegionalPerformance />
      </div>
    </div>
  );
}
