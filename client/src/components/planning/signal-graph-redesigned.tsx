import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DataIndicator from "@/components/common/data-indicator";
import BundleConfigModal from "@/components/planning/bundle-config-modal";
import DependencyGraphModal from "@/components/planning/dependency-graph-modal";
import { signalBundles } from "@/lib/mock-data";
import { BarChart3, Globe, Users, Package, CloudSun, Brain, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignalGraphProps {
  selectedBundle: string | null;
  onSelectBundle: (bundleId: string) => void;
}

const iconMap = {
  "chart-line": BarChart3,
  "globe": Globe,
  "users": Users,
  "package": Package,
  "cloud-sun": CloudSun,
  "brain": Brain,
};

export default function SignalGraph({ selectedBundle, onSelectBundle }: SignalGraphProps) {
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [dependencyModalOpen, setDependencyModalOpen] = useState(false);
  const [modalBundleId, setModalBundleId] = useState<string | null>(null);

  const handleBundleClick = (bundleId: string) => {
    onSelectBundle(bundleId);
    setModalBundleId(bundleId);
    setConfigModalOpen(true);
  };

  return (
    <>
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between" style={{ color: '#1b244d' }}>
            <span>Data Signals Configuration</span>
          </CardTitle>
          <p className="text-sm text-gray-500">
            Click on data signals to configure data collection parameters
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {signalBundles.map((bundle) => {
              const Icon = iconMap[bundle.icon as keyof typeof iconMap];
              const isSelected = selectedBundle === bundle.id;
              
              return (
                <div
                  key={bundle.id}
                  onClick={() => handleBundleClick(bundle.id)}
                  className={cn(
                    "group p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg",
                    isSelected 
                      ? "border-gray-300 bg-gray-50 shadow-md" 
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                  )}
                  style={isSelected ? { borderColor: '#d63426', backgroundColor: '#fee2e2' } : {}}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "p-2 rounded-lg transition-all duration-200",
                        bundle.color === "blue" && "bg-blue-600 group-hover:bg-blue-500",
                        bundle.color === "green" && "bg-green-600 group-hover:bg-green-500",
                        bundle.color === "purple" && "bg-purple-600 group-hover:bg-purple-500",
                        bundle.color === "yellow" && "bg-yellow-600 group-hover:bg-yellow-500",
                        bundle.color === "red" && "bg-red-600 group-hover:bg-red-500",
                        bundle.color === "indigo" && "bg-indigo-600 group-hover:bg-indigo-500"
                      )}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm" style={{ color: '#1b244d' }}>{bundle.name}</h3>
                        <p className="text-xs text-gray-500">{bundle.category}</p>
                      </div>
                    </div>
                    <Settings className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{bundle.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {bundle.dataTypes.map((type, index) => (
                      <DataIndicator key={index} type={type} />
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">{bundle.signals.length} signals</span>
                    <span className="text-gray-500">{bundle.dataSources.length} sources</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <BundleConfigModal
        bundleId={modalBundleId}
        open={configModalOpen}
        onOpenChange={setConfigModalOpen}
      />

      <DependencyGraphModal
        open={dependencyModalOpen}
        onOpenChange={setDependencyModalOpen}
      />
    </>
  );
}