import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataIndicator from "@/components/common/data-indicator";
import { AlertTriangle, AlertCircle, Truck } from "lucide-react";

interface InventoryAlert {
  id: number;
  productId?: number;
  product?: {
    name: string;
  };
  region: string;
  currentStock: number;
  minThreshold: number;
}

interface InventoryAlertsProps {
  lowStock?: InventoryAlert[];
}

export default function InventoryAlerts({ lowStock }: InventoryAlertsProps) {
  const alerts = [
    {
      type: "critical",
      icon: AlertTriangle,
      title: "Critical Stock",
      product: "Premium Memory Foam Queen",
      location: "West Coast: 12 units remaining",
      color: "red",
    },
    {
      type: "warning", 
      icon: AlertCircle,
      title: "Low Stock",
      product: "Cooling Gel King Size",
      location: "Midwest: 47 units remaining",
      color: "yellow",
    },
    {
      type: "info",
      icon: Truck,
      title: "Restock In Transit",
      product: "Hybrid Luxury Models",
      location: "ETA: 6 hours",
      color: "blue",
    },
  ];

  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold text-white">Inventory Alerts</CardTitle>
        <DataIndicator type="realtime" />
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => {
          const Icon = alert.icon;
          const colorClasses = {
            red: "bg-red-900 bg-opacity-30 border-red-500 text-red-300",
            yellow: "bg-yellow-900 bg-opacity-30 border-yellow-500 text-yellow-300", 
            blue: "bg-blue-900 bg-opacity-30 border-blue-500 text-blue-300",
          };
          
          return (
            <div 
              key={index}
              className={`p-3 rounded-lg border ${colorClasses[alert.color as keyof typeof colorClasses]}`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <Icon className={`w-4 h-4 ${
                  alert.color === "red" ? "text-red-400" :
                  alert.color === "yellow" ? "text-yellow-400" :
                  "text-blue-400"
                }`} />
                <span className="font-medium">{alert.title}</span>
              </div>
              <div className="text-sm text-gray-300">{alert.product}</div>
              <div className="text-xs text-gray-400">{alert.location}</div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
