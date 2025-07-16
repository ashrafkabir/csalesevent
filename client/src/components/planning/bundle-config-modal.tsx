import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Globe, Check, Copy, Settings2 } from "lucide-react";
import { signalBundles, type SignalBundle, type DataSource } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface BundleConfigModalProps {
  bundleId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FieldConfig {
  dataSource: string;
  fieldName: string;
  updateFrequency: string;
  retentionDays: number;
  isSelected: boolean;
}

export default function BundleConfigModal({ bundleId, open, onOpenChange }: BundleConfigModalProps) {
  const [fieldConfigs, setFieldConfigs] = useState<Map<string, FieldConfig>>(new Map());
  const [showSummary, setShowSummary] = useState(false);

  const bundle = bundleId ? signalBundles.find(b => b.id === bundleId) : null;

  const getFieldKey = (dataSource: string, field: string) => `${dataSource}.${field}`;

  const initializeFieldConfigs = (bundle: SignalBundle) => {
    const configs = new Map<string, FieldConfig>();
    bundle.dataSources.forEach(dataSource => {
      dataSource.fields.forEach(field => {
        const key = getFieldKey(dataSource.name, field);
        configs.set(key, {
          dataSource: dataSource.name,
          fieldName: field,
          updateFrequency: "realtime",
          retentionDays: 7,
          isSelected: false,
        });
      });
    });
    return configs;
  };

  const handleFieldToggle = (dataSource: string, field: string) => {
    const key = getFieldKey(dataSource, field);
    const newConfigs = new Map(fieldConfigs);
    const config = newConfigs.get(key);
    
    if (config) {
      config.isSelected = !config.isSelected;
      newConfigs.set(key, config);
      setFieldConfigs(newConfigs);
    }
  };

  const handleFieldConfigChange = (dataSource: string, field: string, property: keyof FieldConfig, value: any) => {
    const key = getFieldKey(dataSource, field);
    const newConfigs = new Map(fieldConfigs);
    const config = newConfigs.get(key);
    
    if (config) {
      (config as any)[property] = value;
      newConfigs.set(key, config);
      setFieldConfigs(newConfigs);
    }
  };

  const getSelectedFieldsSummary = () => {
    const selectedFields = Array.from(fieldConfigs.values())
      .filter(config => config.isSelected)
      .map(config => `${config.dataSource}.${config.fieldName}`)
      .sort();
    return selectedFields.join(", ");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getSelectedFieldsSummary());
  };

  const applyConfiguration = async () => {
    try {
      const selectedConfigs = Array.from(fieldConfigs.values()).filter(c => c.isSelected);
      
      // Save each field configuration to the database
      for (const config of selectedConfigs) {
        await fetch("/api/field-configs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bundleId: bundleId,
            dataSource: config.dataSource,
            fieldName: config.fieldName,
            updateFrequency: config.updateFrequency,
            retentionDays: config.retentionDays,
            eventId: 1, // For now, using event ID 1
          }),
        });
      }
      
      console.log("Configuration saved successfully");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save configuration:", error);
    }
  };

  // Initialize field configs when bundle changes
  React.useEffect(() => {
    if (bundle) {
      setFieldConfigs(initializeFieldConfigs(bundle));
    }
  }, [bundle]);

  if (!bundle) return null;

  const selectedCount = Array.from(fieldConfigs.values()).filter(c => c.isSelected).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Configure {bundle.name}</span>
            <Badge variant="outline" className="text-xs">
              {selectedCount} fields selected
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="sources" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sources">Data Sources</TabsTrigger>
            <TabsTrigger value="fields">Field Configuration</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="overflow-y-auto max-h-[500px] mt-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">{bundle.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bundle.dataSources.map((dataSource) => (
                  <div key={dataSource.name} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-3">
                      {dataSource.type === "internal" ? (
                        <Database className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Globe className="w-4 h-4 text-green-600" />
                      )}
                      <div>
                        <h4 className="font-medium" style={{ color: '#1b244d' }}>{dataSource.name}</h4>
                        <span className={cn(
                          "text-xs capitalize",
                          dataSource.type === "internal" ? "text-blue-600" : "text-green-600"
                        )}>
                          {dataSource.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {dataSource.fields.map((field) => {
                        const key = getFieldKey(dataSource.name, field);
                        const config = fieldConfigs.get(key);
                        const isSelected = config?.isSelected || false;
                        
                        return (
                          <div key={field} className="flex items-center space-x-2">
                            <Checkbox
                              id={key}
                              checked={isSelected}
                              onCheckedChange={() => handleFieldToggle(dataSource.name, field)}
                              className="border-gray-500"
                            />
                            <label 
                              htmlFor={key}
                              className={cn(
                                "text-sm cursor-pointer flex-1",
                                isSelected ? "font-medium" : "text-gray-600"
                              )}
                              style={isSelected ? { color: '#1b244d' } : {}}
                            >
                              {field}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <div className="text-xs text-gray-500">
                        {dataSource.fields.filter(field => 
                          fieldConfigs.get(getFieldKey(dataSource.name, field))?.isSelected
                        ).length} of {dataSource.fields.length} fields selected
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fields" className="overflow-y-auto max-h-[500px] mt-4">
            <div className="space-y-4">
              {Array.from(fieldConfigs.values())
                .filter(config => config.isSelected)
                .map((config) => {
                  const key = getFieldKey(config.dataSource, config.fieldName);
                  return (
                    <div key={key} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium" style={{ color: '#1b244d' }}>{config.dataSource}.{config.fieldName}</h4>
                          <p className="text-xs text-gray-500">{config.dataSource}</p>
                        </div>
                        <Settings2 className="w-4 h-4 text-gray-500" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: '#1b244d' }}>
                            Update Frequency
                          </label>
                          <Select 
                            value={config.updateFrequency}
                            onValueChange={(value) => handleFieldConfigChange(config.dataSource, config.fieldName, 'updateFrequency', value)}
                          >
                            <SelectTrigger className="bg-white border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="realtime">Real-time</SelectItem>
                              <SelectItem value="5min">Every 5 minutes</SelectItem>
                              <SelectItem value="15min">Every 15 minutes</SelectItem>
                              <SelectItem value="hourly">Hourly</SelectItem>
                              <SelectItem value="daily">Daily</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-1" style={{ color: '#1b244d' }}>
                            Data Retention
                          </label>
                          <Select 
                            value={config.retentionDays.toString()}
                            onValueChange={(value) => handleFieldConfigChange(config.dataSource, config.fieldName, 'retentionDays', parseInt(value))}
                          >
                            <SelectTrigger className="bg-white border-gray-300">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 day</SelectItem>
                              <SelectItem value="7">7 days</SelectItem>
                              <SelectItem value="30">30 days</SelectItem>
                              <SelectItem value="90">90 days</SelectItem>
                              <SelectItem value="365">1 year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              
              {selectedCount === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No fields selected. Go to Data Sources tab to select fields.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="summary" className="mt-4">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium" style={{ color: '#1b244d' }}>
                      {selectedCount} fields configured for {bundle.name}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={copyToClipboard}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    disabled={selectedCount === 0}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                </div>
                
                <div className="text-sm font-mono leading-relaxed bg-white p-3 rounded border border-gray-200" style={{ color: '#1b244d' }}>
                  {selectedCount === 0 ? (
                    <span className="text-gray-500 italic">No fields selected</span>
                  ) : (
                    getSelectedFieldsSummary()
                  )}
                </div>
              </div>

              {selectedCount > 0 && (
                <div className="text-xs bg-gray-50 p-3 rounded border border-gray-200" style={{ color: '#1b244d' }}>
                  <p className="mb-2 font-medium">Configuration Summary:</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Real-time updates: {Array.from(fieldConfigs.values()).filter(c => c.isSelected && c.updateFrequency === 'realtime').length} fields</li>
                    <li>• Batch updates: {Array.from(fieldConfigs.values()).filter(c => c.isSelected && c.updateFrequency !== 'realtime').length} fields</li>
                    <li>• Average retention: {Math.round(Array.from(fieldConfigs.values()).filter(c => c.isSelected).reduce((sum, c) => sum + c.retentionDays, 0) / selectedCount)} days</li>
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-gray-300 text-gray-600">
            Cancel
          </Button>
          <Button 
            onClick={applyConfiguration}
            disabled={selectedCount === 0}
            className="text-white hover:opacity-90"
            style={{ backgroundColor: '#d63426' }}
          >
            Apply Configuration ({selectedCount} fields)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}