import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataIndicator from "@/components/common/data-indicator";
import { 
  ChartLine, 
  Globe, 
  Users, 
  Package, 
  CloudSun, 
  Brain,
  Circle
} from "lucide-react";
import { signalBundles, type SignalBundle } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface SignalGraphProps {
  selectedBundle: string | null;
  onSelectBundle: (bundleId: string) => void;
}

const iconMap = {
  "chart-line": ChartLine,
  "globe": Globe,
  "users": Users,
  "package": Package,
  "cloud-sun": CloudSun,
  "brain": Brain,
};

export default function SignalGraph({ selectedBundle, onSelectBundle }: SignalGraphProps) {
  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold text-white">Data Signal Configuration</CardTitle>
        <div className="flex space-x-2">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Add Signal
          </Button>
          <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
            Import Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 bg-gray-800 rounded-lg p-4 border border-gray-600">
          <div className="grid grid-cols-3 gap-4 h-full">
            {signalBundles.map((bundle) => {
              const Icon = iconMap[bundle.icon as keyof typeof iconMap];
              const isSelected = selectedBundle === bundle.id;
              
              return (
                <div
                  key={bundle.id}
                  onClick={() => onSelectBundle(bundle.id)}
                  className={cn(
                    "signal-bundle transition-all duration-200 hover:scale-105",
                    `signal-bundle-${bundle.color}`,
                    isSelected && "ring-2 ring-white"
                  )}
                >
                  <div className="text-center">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3",
                      bundle.color === "blue" && "bg-blue-500",
                      bundle.color === "green" && "bg-green-500",
                      bundle.color === "purple" && "bg-purple-500",
                      bundle.color === "yellow" && "bg-yellow-500",
                      bundle.color === "red" && "bg-red-500",
                      bundle.color === "indigo" && "bg-indigo-500"
                    )}>
                      <Icon className="text-white w-5 h-5" />
                    </div>
                    <h4 className={cn(
                      "font-semibold mb-2",
                      bundle.color === "blue" && "text-blue-300",
                      bundle.color === "green" && "text-green-300",
                      bundle.color === "purple" && "text-purple-300",
                      bundle.color === "yellow" && "text-yellow-300",
                      bundle.color === "red" && "text-red-300",
                      bundle.color === "indigo" && "text-indigo-300"
                    )}>
                      {bundle.name}
                    </h4>
                    <div className="text-xs text-gray-400 space-y-1">
                      {bundle.signals.slice(0, 4).map((signal, index) => (
                        <div key={index}>• {signal}</div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-center space-x-1">
                      {bundle.dataTypes.map((type, index) => (
                        <Circle 
                          key={index}
                          className={cn(
                            "w-2 h-2",
                            type === "processed" && "text-blue-500",
                            type === "realtime" && "text-green-500 animate-pulse",
                            type === "ai" && "text-purple-500"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
