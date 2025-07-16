import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, CheckCircle, ArrowUp, ArrowDown } from "lucide-react";
import type { SalesMetrics } from "@shared/schema";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";

interface MetricsTickerProps {
  metrics?: SalesMetrics;
}

export default function MetricsTicker({ metrics }: MetricsTickerProps) {
  if (!metrics) {
    return (
      <Card className="dashboard-card">
        <CardContent className="p-4">
          <div className="text-center text-gray-500">Loading metrics...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="dashboard-card">
      <CardContent className="p-4">
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(metrics.totalSales)}
            </div>
            <div className="text-sm text-gray-500">Total Sales</div>
            <div className="text-xs text-green-600 flex items-center justify-center mt-1">
              <ArrowUp className="w-3 h-3 mr-1" />
              <span>+23.5%</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: '#1b244d' }}>
              {metrics.activeCustomers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Active Customers</div>
            <div className="text-xs text-green-600 flex items-center justify-center mt-1">
              <ArrowUp className="w-3 h-3 mr-1" />
              <span>+15.2%</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              ${(parseFloat(metrics.avgBasketSize) || 0).toFixed(0)}
            </div>
            <div className="text-sm text-gray-500">Avg Basket Size</div>
            <div className="text-xs text-green-600 flex items-center justify-center mt-1">
              <ArrowUp className="w-3 h-3 mr-1" />
              <span>+8.7%</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatPercentage(metrics.conversionRate)}
            </div>
            <div className="text-sm text-gray-500">Conversion Rate</div>
            <div className="text-xs flex items-center justify-center mt-1" style={{ color: '#d63426' }}>
              <ArrowDown className="w-3 h-3 mr-1" />
              <span>-2.1%</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatPercentage(metrics.inventoryHealth)}
            </div>
            <div className="text-sm text-gray-500">Inventory Health</div>
            <div className="text-xs text-green-600 flex items-center justify-center mt-1">
              <CheckCircle className="w-3 h-3 mr-1" />
              <span>Optimal</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
