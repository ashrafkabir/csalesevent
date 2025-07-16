import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { signalBundles } from "@/lib/mock-data";
import { ArrowRight, Database, Globe, BarChart3, Users, Package, CloudSun, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface DependencyGraphModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const iconMap = {
  "chart-line": BarChart3,
  "globe": Globe,
  "users": Users,
  "package": Package,
  "cloud-sun": CloudSun,
  "brain": Brain,
};

// Mock dependency relationships for visualization
const dependencies = [
  { from: "sales", to: "inventory", type: "direct", description: "Sales data drives inventory updates" },
  { from: "customer", to: "sales", type: "computed", description: "Customer behavior influences sales predictions" },
  { from: "market", to: "ai", type: "derived", description: "Market intelligence feeds AI models" },
  { from: "external", to: "sales", type: "direct", description: "Weather/events impact sales patterns" },
  { from: "inventory", to: "ai", type: "computed", description: "Stock levels used for demand forecasting" },
  { from: "ai", to: "sales", type: "derived", description: "AI insights optimize sales strategies" },
];

export default function DependencyGraphModal({ open, onOpenChange }: DependencyGraphModalProps) {
  const getBundleById = (id: string) => signalBundles.find(b => b.id === id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Data Signals Dependencies</DialogTitle>
          <p className="text-sm text-gray-400">
            Visual representation of data flow and dependencies between data signals
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Network Graph Visualization */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-4">Dependency Network</h3>
            <div className="relative bg-gray-900 rounded-lg p-6 min-h-[400px]">
              {/* Bundle Nodes */}
              <div className="grid grid-cols-3 gap-8 relative">
                {signalBundles.map((bundle, index) => {
                  const Icon = iconMap[bundle.icon as keyof typeof iconMap];
                  const row = Math.floor(index / 3);
                  const col = index % 3;
                  
                  return (
                    <div
                      key={bundle.id}
                      className="relative"
                      style={{
                        gridRow: row + 1,
                        gridColumn: col + 1,
                      }}
                    >
                      <div className={cn(
                        "flex flex-col items-center p-3 rounded-lg border-2 transition-all",
                        "border-gray-600 bg-gray-800 hover:border-gray-500"
                      )}>
                        <div className={cn(
                          "p-2 rounded-lg mb-2",
                          bundle.color === "blue" && "bg-blue-600",
                          bundle.color === "green" && "bg-green-600",
                          bundle.color === "purple" && "bg-purple-600",
                          bundle.color === "yellow" && "bg-yellow-600",
                          bundle.color === "red" && "bg-red-600",
                          bundle.color === "indigo" && "bg-indigo-600"
                        )}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="text-xs font-medium text-white text-center">{bundle.name}</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {bundle.dataTypes.slice(0, 2).map((type, i) => (
                            <Badge key={i} variant="outline" className="text-xs px-1 py-0">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Connection Lines (simplified representation) */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {dependencies.map((dep, index) => (
                    <g key={index}>
                      <defs>
                        <marker
                          id={`arrowhead-${index}`}
                          markerWidth="10"
                          markerHeight="7"
                          refX="9"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill={dep.type === "direct" ? "#3b82f6" : dep.type === "computed" ? "#10b981" : "#8b5cf6"}
                          />
                        </marker>
                      </defs>
                      <line
                        x1={Math.random() * 80 + 10}
                        y1={Math.random() * 60 + 20}
                        x2={Math.random() * 80 + 10}
                        y2={Math.random() * 60 + 20}
                        stroke={dep.type === "direct" ? "#3b82f6" : dep.type === "computed" ? "#10b981" : "#8b5cf6"}
                        strokeWidth="0.5"
                        markerEnd={`url(#arrowhead-${index})`}
                        opacity="0.6"
                      />
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </div>

          {/* Dependency Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-white">Dependency Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dependencies.map((dep, index) => {
                const fromBundle = getBundleById(dep.from);
                const toBundle = getBundleById(dep.to);
                
                if (!fromBundle || !toBundle) return null;

                return (
                  <Card key={index} className="bg-gray-800 border-gray-700">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={cn(
                            "w-3 h-3 rounded-full",
                            fromBundle.color === "blue" && "bg-blue-600",
                            fromBundle.color === "green" && "bg-green-600",
                            fromBundle.color === "purple" && "bg-purple-600",
                            fromBundle.color === "yellow" && "bg-yellow-600",
                            fromBundle.color === "red" && "bg-red-600",
                            fromBundle.color === "indigo" && "bg-indigo-600"
                          )} />
                          <span className="text-sm text-white">{fromBundle.name}</span>
                        </div>
                        
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        
                        <div className="flex items-center space-x-2">
                          <div className={cn(
                            "w-3 h-3 rounded-full",
                            toBundle.color === "blue" && "bg-blue-600",
                            toBundle.color === "green" && "bg-green-600",
                            toBundle.color === "purple" && "bg-purple-600",
                            toBundle.color === "yellow" && "bg-yellow-600",
                            toBundle.color === "red" && "bg-red-600",
                            toBundle.color === "indigo" && "bg-indigo-600"
                          )} />
                          <span className="text-sm text-white">{toBundle.name}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge 
                          className={cn(
                            "text-xs",
                            dep.type === "direct" && "bg-blue-600",
                            dep.type === "computed" && "bg-green-600",
                            dep.type === "derived" && "bg-purple-600"
                          )}
                        >
                          {dep.type}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-400 mt-2">{dep.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Data Flow Summary */}
          <div className="mt-6 bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-3">Data Flow Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  {dependencies.filter(d => d.type === "direct").length}
                </div>
                <div className="text-xs text-gray-400">Direct Dependencies</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">
                  {dependencies.filter(d => d.type === "computed").length}
                </div>
                <div className="text-xs text-gray-400">Computed Dependencies</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">
                  {dependencies.filter(d => d.type === "derived").length}
                </div>
                <div className="text-xs text-gray-400">Derived Dependencies</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}