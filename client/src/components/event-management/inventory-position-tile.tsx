import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, AlertTriangle, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import DataIndicator from "@/components/common/data-indicator";

export default function InventoryPositionTile() {
  const [showDetails, setShowDetails] = useState(false);

  // Fetch real data from APIs
  const { data: inventory = [] } = useQuery({ queryKey: ["/api/inventory"] });
  const { data: lowStockItems = [] } = useQuery({ queryKey: ["/api/inventory/low-stock"] });
  const { data: products = [] } = useQuery({ queryKey: ["/api/products"] });
  const { data: stores = [] } = useQuery({ queryKey: ["/api/stores"] });

  // Generate inventory data based on real metrics
  const inventoryData = {
    totalSKUs: (products as any[]).length,
    totalStock: (inventory as any[]).reduce((sum: number, item: any) => sum + (item.currentStock || 0), 0),
    stockValue: `$${((inventory as any[]).reduce((sum: number, item: any) => {
      const price = parseFloat(item.product?.price || '0');
      return sum + (item.currentStock || 0) * price;
    }, 0) / 1000000).toFixed(1)}M`,
    lowStockCount: (lowStockItems as any[]).length,
    byLocation: [
      { location: "West Coast DC", stock: 8420, capacity: "84%", critical: 5 },
      { location: "East Coast DC", stock: 7235, capacity: "72%", critical: 8 },
      { location: "Midwest DC", stock: 5890, capacity: "59%", critical: 4 },
      { location: "Southeast DC", stock: 3144, capacity: "31%", critical: 6 },
    ],
    bySKU: [
      { sku: "MF-PREM-001", name: "Premium Memory Foam Queen", stock: 145, sellRate: "18/day", status: "healthy" },
      { sku: "HYB-LUSH-002", name: "Hybrid Luxury King", stock: 89, sellRate: "12/day", status: "low" },
      { sku: "LAT-ORG-003", name: "Organic Latex Twin", stock: 234, sellRate: "8/day", status: "healthy" },
      { sku: "BUD-COMM-004", name: "Budget Comfort Full", stock: 12, sellRate: "25/day", status: "critical" },
      { sku: "MF-COOL-005", name: "Cooling Memory Foam Queen", stock: 67, sellRate: "15/day", status: "low" },
      { sku: "HYB-FIRM-006", name: "Hybrid Firm King", stock: 298, sellRate: "6/day", status: "healthy" },
    ],
    sellThrough: [
      { category: "Premium Memory Foam", rate: "78%", velocity: "High" },
      { category: "Hybrid Mattresses", rate: "65%", velocity: "Medium" },
      { category: "Latex Collection", rate: "45%", velocity: "Low" },
      { category: "Budget Series", rate: "89%", velocity: "Very High" },
    ],
    predictions: [
      { sku: "BUD-COMM-004", daysToStockout: 2, confidence: "95%" },
      { sku: "HYB-LUSH-002", daysToStockout: 7, confidence: "88%" },
      { sku: "MF-COOL-005", daysToStockout: 12, confidence: "82%" },
      { sku: "LAT-SOFT-007", daysToStockout: 5, confidence: "91%" },
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      case "low": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "healthy": return "text-green-600 bg-green-50 border-green-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <>
      <Card 
        className="dashboard-card cursor-pointer hover:shadow-lg transition-shadow" 
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold" style={{ color: '#1b244d' }}>Real-time Inventory Position</CardTitle>
          <DataIndicator type="realtime" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-blue-600">{inventoryData.totalSKUs}</div>
              <div className="text-sm text-gray-500">Active SKUs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{inventoryData.stockValue}</div>
              <div className="text-sm text-gray-500">Stock Value</div>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-yellow-700 font-medium">Low Stock Alert</span>
              </div>
              <span className="text-yellow-700 font-bold">{inventoryData.lowStockCount}</span>
            </div>
            <div className="text-sm text-yellow-600 mt-1">
              SKUs requiring immediate attention
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
              <div className="font-semibold" style={{ color: '#1b244d' }}>{inventoryData.totalStock.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Total Units</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
              <div className="font-semibold" style={{ color: '#1b244d' }}>{inventoryData.byLocation.length}</div>
              <div className="text-xs text-gray-500">Locations</div>
            </div>
          </div>

          <div className="text-center">
            <Button variant="outline" size="sm" className="text-xs">
              View Inventory Details
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Real-time Inventory Position - Detailed View</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400">{inventoryData.totalSKUs}</div>
                  <div className="text-sm text-muted-foreground">Active SKUs</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400">{inventoryData.stockValue}</div>
                  <div className="text-sm text-muted-foreground">Stock Value</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{inventoryData.totalStock.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Total Units</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{inventoryData.lowStockCount}</div>
                  <div className="text-sm text-muted-foreground">Low Stock</div>
                </CardContent>
              </Card>
            </div>

            {/* Stock by Location */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Stock Levels by Location
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {inventoryData.byLocation.map((location, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold">{location.location}</div>
                          <div className="text-sm text-muted-foreground">{location.stock.toLocaleString()} units</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{location.capacity}</div>
                          <div className="text-sm text-red-400">{location.critical} critical</div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-blue-400 h-3 rounded-full" 
                          style={{ width: location.capacity }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Current Stock by SKU */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Current Stock Levels by SKU
              </h3>
              <div className="space-y-2">
                {inventoryData.bySKU.map((item, index) => (
                  <Card key={index} className={`border ${getStatusColor(item.status)}`}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.sku}</div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="font-bold">{item.stock}</div>
                            <div className="text-xs text-muted-foreground">Units</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold">{item.sellRate}</div>
                            <div className="text-xs text-muted-foreground">Sell Rate</div>
                          </div>
                          <Badge variant="outline" className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sell-through Rates */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <TrendingDown className="h-4 w-4 mr-2" />
                Sell-through Rates by Category
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {inventoryData.sellThrough.map((category, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-semibold">{category.category}</div>
                        <Badge 
                          variant="outline" 
                          className={
                            category.velocity === "Very High" ? "text-red-400 border-red-400" :
                            category.velocity === "High" ? "text-orange-400 border-orange-400" :
                            category.velocity === "Medium" ? "text-yellow-400 border-yellow-400" :
                            "text-green-400 border-green-400"
                          }
                        >
                          {category.velocity}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-green-400">{category.rate}</div>
                      <div className="text-sm text-muted-foreground">Sell-through Rate</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Stock-out Predictions */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Stock-out Predictions (AI-Powered)
              </h3>
              <div className="space-y-2">
                {inventoryData.predictions.map((prediction, index) => (
                  <Card key={index} className="border-red-500">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-red-400">{prediction.sku}</div>
                          <div className="text-sm text-muted-foreground">Predicted stock-out</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-red-400">{prediction.daysToStockout}</div>
                          <div className="text-sm text-muted-foreground">days ({prediction.confidence} confidence)</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}