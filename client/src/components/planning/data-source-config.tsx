import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Database, Globe, Check, Copy } from "lucide-react";
import { signalBundles, type SignalBundle, type DataSource } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface DataSourceConfigProps {
  selectedBundle: string | null;
}

export default function DataSourceConfig({ selectedBundle }: DataSourceConfigProps) {
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set());
  const [showSummary, setShowSummary] = useState(false);

  const bundle = selectedBundle ? signalBundles.find(b => b.id === selectedBundle) : null;

  const handleFieldToggle = (dataSource: string, field: string) => {
    const fieldKey = `${dataSource}.${field}`;
    const newSelectedFields = new Set(selectedFields);
    
    if (newSelectedFields.has(fieldKey)) {
      newSelectedFields.delete(fieldKey);
    } else {
      newSelectedFields.add(fieldKey);
    }
    
    setSelectedFields(newSelectedFields);
  };

  const generateSummaryString = () => {
    if (selectedFields.size === 0) return "No fields selected";
    return Array.from(selectedFields).sort().join(", ");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateSummaryString());
  };

  if (!bundle) {
    return (
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="text-white">Data Source Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400">
            Click on a data signal above to configure its data sources and fields.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-white">Data Source Configuration - {bundle.name}</CardTitle>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowSummary(!showSummary)}
              className="border-gray-600 text-gray-300"
            >
              {showSummary ? "Hide" : "Show"} Summary
            </Button>
            <Button 
              size="sm" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={selectedFields.size === 0}
            >
              Apply Configuration
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-gray-300 mb-2">{bundle.description}</p>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">Categories:</span>
              {bundle.dataTypes.map((type, index) => (
                <Badge 
                  key={index}
                  className={cn(
                    "text-xs",
                    type === "processed" && "bg-blue-600",
                    type === "realtime" && "bg-green-600", 
                    type === "ai" && "bg-purple-600"
                  )}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bundle.dataSources.map((dataSource) => (
              <div key={dataSource.name} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  {dataSource.type === "internal" ? (
                    <Database className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Globe className="w-4 h-4 text-green-400" />
                  )}
                  <div>
                    <h4 className="font-medium text-white">{dataSource.name}</h4>
                    <span className={cn(
                      "text-xs capitalize",
                      dataSource.type === "internal" ? "text-blue-400" : "text-green-400"
                    )}>
                      {dataSource.type}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {dataSource.fields.map((field) => {
                    const fieldKey = `${dataSource.name}.${field}`;
                    const isSelected = selectedFields.has(fieldKey);
                    
                    return (
                      <div key={field} className="flex items-center space-x-2">
                        <Checkbox
                          id={fieldKey}
                          checked={isSelected}
                          onCheckedChange={() => handleFieldToggle(dataSource.name, field)}
                          className="border-gray-500"
                        />
                        <label 
                          htmlFor={fieldKey}
                          className={cn(
                            "text-sm cursor-pointer",
                            isSelected ? "text-white font-medium" : "text-gray-300"
                          )}
                        >
                          {field}
                        </label>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="text-xs text-gray-400">
                    {dataSource.fields.filter(field => 
                      selectedFields.has(`${dataSource.name}.${field}`)
                    ).length} of {dataSource.fields.length} fields selected
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Update Frequency
              </label>
              <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white">
                <option>Real-time</option>
                <option>Every 5 minutes</option>
                <option>Every 15 minutes</option>
                <option>Hourly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Data Retention
              </label>
              <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white">
                <option>7 days</option>
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {showSummary && (
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-white">Selected Fields Summary</CardTitle>
            <Button 
              size="sm" 
              variant="outline"
              onClick={copyToClipboard}
              className="border-gray-600 text-gray-300"
              disabled={selectedFields.size === 0}
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
              <div className="flex items-center space-x-2 mb-2">
                <Check className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium text-white">
                  {selectedFields.size} fields selected for monitoring
                </span>
              </div>
              <div className="text-sm text-gray-300 font-mono leading-relaxed">
                {selectedFields.size === 0 ? (
                  <span className="text-gray-500 italic">No fields selected</span>
                ) : (
                  generateSummaryString()
                )}
              </div>
            </div>
            
            {selectedFields.size > 0 && (
              <div className="mt-4 text-xs text-gray-400">
                <p>
                  These data fields will be monitored during the sales event and used across 
                  the Event Management and Service Operations views. The system will collect, 
                  process, and analyze these signals to provide real-time insights and alerts.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}