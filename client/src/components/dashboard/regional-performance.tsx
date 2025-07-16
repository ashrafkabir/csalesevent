import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import DataIndicator from "@/components/common/data-indicator";
import { MapPin } from "lucide-react";

export default function RegionalPerformance() {
  const { data: regionalSalesData = [] } = useQuery({
    queryKey: ["/api/regional-sales"],
  });

  const { data: stores = [] } = useQuery({
    queryKey: ["/api/stores"],
  });

  // Combine regional sales data with store information
  const regionalData = (regionalSalesData as any[]).map((regionSales: any) => {
    const storeInfo = (stores as any[]).find((store: any) => store.region === regionSales.region);
    return {
      region: regionSales.region,
      stores: storeInfo?.storeCount || 0,
      revenue: `${((parseFloat(regionSales.revenue) || 0) / 1000).toFixed(0)}K`,
      growth: `+${regionSales.growthRate}%`,
    };
  });

  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold" style={{ color: '#1b244d' }}>Regional Performance</CardTitle>
        <DataIndicator type="processed" />
      </CardHeader>
      <CardContent className="space-y-3">
        {regionalData.map((region, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center">
                <MapPin className="text-white w-5 h-5" />
              </div>
              <div>
                <div className="font-medium" style={{ color: '#1b244d' }}>{region.region}</div>
                <div className="text-sm text-gray-500">{region.stores} stores</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-green-600">${region.revenue}</div>
              <div className="text-xs text-green-600">{region.growth}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
