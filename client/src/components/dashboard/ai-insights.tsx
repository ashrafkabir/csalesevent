import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataIndicator from "@/components/common/data-indicator";
import { Lightbulb, TrendingUp, AlertTriangle, Database, Globe, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function AIInsights() {
  const { data: aiInsights = [] } = useQuery({
    queryKey: ["/api/ai-insights"],
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'opportunity': return Lightbulb;
      case 'success': return TrendingUp;  
      case 'warning': return AlertTriangle;
      default: return Database;
    }
  };

  const getColorForType = (type: string) => {
    switch (type) {
      case 'opportunity': return "purple";
      case 'success': return "green";
      case 'warning': return "yellow";
      default: return "blue";
    }
  };
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: '#d63426' }}></div>
          <span className="text-sm font-semibold" style={{ color: '#1b244d' }}>AI Intelligence Ticker</span>
        </div>
        <DataIndicator type="ai" />
      </div>
      
      <div className="overflow-hidden">
        <div className="flex animate-marquee space-x-8 py-3">
          {(aiInsights as any[]).concat(aiInsights as any[]).map((insight: any, index: number) => {
            const Icon = getIconForType(insight.type);
            const color = getColorForType(insight.type);
            const colorClasses = {
              purple: "text-purple-600",
              green: "text-green-600", 
              yellow: "text-yellow-600",
              blue: "text-blue-600",
            };
            
            return (
              <div key={index} className="flex items-center space-x-3 px-4 whitespace-nowrap">
                <Icon className={`w-4 h-4 ${colorClasses[color as keyof typeof colorClasses]}`} />
                <div className="flex items-center space-x-2">
                  <span className="font-medium" style={{ color: '#d63426' }}>{insight.title}:</span>
                  <span className="text-sm" style={{ color: '#1b244d' }}>{insight.description}</span>
                  <span className="text-xs text-gray-500">
                    ({insight.confidence}% confidence)
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Database className="w-3 h-3" />
                    <span>Sources: {insight.sources}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
