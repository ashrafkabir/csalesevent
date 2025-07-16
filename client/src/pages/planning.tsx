import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import EventConfig from "@/components/planning/event-config";
import SignalGraph from "@/components/planning/signal-graph-redesigned";
import DependencyGraphVisualization from "@/components/planning/dependency-graph-visualization";
import { Button } from "@/components/ui/button";
import { Network } from "lucide-react";
import type { DataFieldConfig } from "@shared/schema";

export default function Planning() {
  const [selectedBundle, setSelectedBundle] = useState<string | null>(null);
  const [showDependencyGraph, setShowDependencyGraph] = useState(false);

  // Fetch field configurations from database
  const { data: fieldConfigurations = [] } = useQuery<DataFieldConfig[]>({
    queryKey: ["/api/field-configs"],
    enabled: showDependencyGraph
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1b244d' }}>Sales Event Planning</h2>
          <p className="text-gray-500">Configure data signals and intelligence gathering for upcoming sales events</p>
        </div>
        
        <Button
          onClick={() => setShowDependencyGraph(true)}
          className="text-white hover:opacity-90"
          style={{ backgroundColor: '#d63426' }}
        >
          <Network className="h-4 w-4 mr-2" />
          Signal Graph
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1">
          <EventConfig />
        </div>
        
        <div className="col-span-3">
          <SignalGraph 
            selectedBundle={selectedBundle}
            onSelectBundle={setSelectedBundle}
          />
        </div>
      </div>

      <DependencyGraphVisualization
        open={showDependencyGraph}
        onOpenChange={setShowDependencyGraph}
        fieldConfigurations={fieldConfigurations}
      />
    </div>
  );
}
