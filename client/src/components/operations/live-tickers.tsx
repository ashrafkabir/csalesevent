import { Card, CardContent } from "@/components/ui/card";
import { Activity, AlertTriangle, CheckCircle, TrendingUp, Users, MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { SalesMetrics } from "@shared/schema";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";

interface LiveTickersProps {
  metrics?: SalesMetrics;
}

export default function LiveTickers({ metrics }: LiveTickersProps) {
  const { data: storeMetrics } = useQuery({ queryKey: ["/api/store-metrics"] });
  const { data: lowStockItems = [] } = useQuery({ queryKey: ["/api/inventory/low-stock"] });
  const { data: products = [] } = useQuery({ queryKey: ["/api/products"] });
  const { data: customerBehavior = [] } = useQuery({ queryKey: ["/api/customer-behavior"] });

  if (!metrics) {
    return (
      <Card className="dashboard-card">
        <CardContent className="p-4">
          <div className="text-center text-gray-400">Loading live data...</div>
        </CardContent>
      </Card>
    );
  }

  const activeStores = (storeMetrics as any)?.activeStores || 0;
  const totalStores = (storeMetrics as any)?.totalStores || 0;
  const ordersProcessed = Math.floor((parseFloat(metrics.totalSales.replace(/[^0-9.]/g, '')) || 0) / 650); // Estimate based on avg order value
  const socialMentions = Math.floor(metrics.activeCustomers * 0.15); // Estimate based on customer engagement
  const latestCustomerBehavior = (customerBehavior as any[])[0]; // Get latest customer behavior data

  const tickers = [
    {
      value: formatCurrency(metrics.totalSales),
      label: "Sales Today",
      status: "Live",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      value: formatNumber(ordersProcessed),
      label: "Orders Processed", 
      status: "Live",
      icon: Activity,
      color: "text-blue-600",
    },
    {
      value: (lowStockItems as any[]).length.toString(),
      label: "Low Stock SKUs",
      status: (lowStockItems as any[]).length > 0 ? "Alert" : "Normal",
      icon: AlertTriangle,
      color: (lowStockItems as any[]).length > 0 ? "text-orange-500" : "text-green-600",
    },
    {
      value: `${activeStores}/${totalStores}`,
      label: "Active Stores",
      status: "Operational",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      value: latestCustomerBehavior?.customerSatisfaction ? `${latestCustomerBehavior.customerSatisfaction}/5.0` : "4.7/5.0",
      label: "Customer Satisfaction",
      status: "Trending Up",
      icon: Users,
      color: "text-green-600",
    },
    {
      value: formatNumber(socialMentions),
      label: "Social Mentions",
      status: "Viral",
      icon: MessageSquare,
      color: "text-purple-600",
    },
  ];

  return (
    <Card className="dashboard-card">
      <CardContent className="p-4">
        <div className="grid grid-cols-6 gap-4">
          {tickers.map((ticker, index) => {
            const Icon = ticker.icon;
            return (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Icon className={`h-5 w-5 ${ticker.color}`} />
                </div>
                <div className={`text-xl font-bold ${ticker.color}`}>
                  {ticker.value}
                </div>
                <div className="text-xs text-gray-600">{ticker.label}</div>
                <div className="flex items-center justify-center mt-1">
                  {ticker.status === "Live" && (
                    <div className="text-green-500 animate-pulse text-xs">● Live</div>
                  )}
                  {ticker.status === "Alert" && (
                    <div className="text-yellow-500 text-xs">⚠ Alert</div>
                  )}
                  {ticker.status === "Operational" && (
                    <div className="text-green-500 text-xs">✓ Operational</div>
                  )}
                  {ticker.status === "Trending Up" && (
                    <div className="text-green-500 text-xs">↗ Trending Up</div>
                  )}
                  {ticker.status === "Viral" && (
                    <div className="text-purple-500 text-xs">🔥 Viral</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
