import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataIndicator from "@/components/common/data-indicator";
import { Circle } from "lucide-react";
import type { SystemComponent } from "@shared/schema";

interface SystemStatusProps {
  components?: SystemComponent[];
}

export default function SystemStatus({ components }: SystemStatusProps) {
  // Mock data for system components when API returns empty
  const mockComponents = [
    { id: 1, name: "Web Frontend", status: "operational", responseTime: 156, lastCheck: new Date() },
    { id: 2, name: "Payment Gateway", status: "degraded", responseTime: 2100, lastCheck: new Date() },
    { id: 3, name: "Inventory API", status: "operational", responseTime: 89, lastCheck: new Date() },
    { id: 4, name: "Authentication", status: "operational", responseTime: 45, lastCheck: new Date() },
    { id: 5, name: "Search Service", status: "degraded", responseTime: 1200, lastCheck: new Date() },
    { id: 6, name: "Email Service", status: "operational", responseTime: null, lastCheck: new Date() },
  ];

  const displayComponents = (components && components.length > 0) ? components : mockComponents;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-600";
      case "degraded":
        return "text-yellow-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500";
      case "degraded":
        return "bg-yellow-500";
      case "down":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatResponseTime = (responseTime: number | null) => {
    if (!responseTime) return "N/A";
    if (responseTime > 1000) {
      return `${(responseTime / 1000).toFixed(1)}s`;
    }
    return `${responseTime}ms`;
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold" style={{ color: '#1b244d' }}>System Status</CardTitle>
        <DataIndicator type="realtime" />
      </CardHeader>
      <CardContent className="space-y-3">
        {displayComponents.map((component) => (
          <div key={component.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Circle className={`w-3 h-3 ${getStatusIcon(component.status)}`} />
              <div>
                <div className="font-medium" style={{ color: '#1b244d' }}>{component.name}</div>
                <div className="text-xs text-gray-500">
                  {component.responseTime ? 
                    `Response: ${formatResponseTime(component.responseTime)}` :
                    component.name === "Email Service" ? "Queue: 1,247" : "Monitoring"
                  }
                </div>
              </div>
            </div>
            <span className={`text-sm capitalize ${getStatusColor(component.status)}`}>
              {component.status === "degraded" && component.name === "Search Service" ? "Slow" :
               component.status === "operational" && component.name === "Email Service" ? "Processing" :
               component.status}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
