import { useQuery } from "@tanstack/react-query";
import LiveTickers from "@/components/operations/live-tickers";
import AggregatedSalesTile from "@/components/event-management/aggregated-sales-tile";
import InventoryPositionTile from "@/components/event-management/inventory-position-tile";
import CustomerBehaviorTile from "@/components/event-management/customer-behavior-tile";
import BuyingTrendsTile from "@/components/event-management/buying-trends-tile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataIndicator from "@/components/common/data-indicator";
import { Users, TrendingUp, Star, Brain } from "lucide-react";
import { useRealTimeMetrics } from "@/hooks/use-real-time-data";

export default function EventManagement() {
  const { data: metrics } = useRealTimeMetrics();
  const { data: stores = [] } = useQuery({ queryKey: ["/api/stores"] });

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#1b244d' }}>Event Management Operations</h2>
        <p className="text-gray-500">Real-time monitoring and management of active sales events</p>
      </div>

      <LiveTickers metrics={metrics as any} />

      {/* Core Analytics Tiles */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <AggregatedSalesTile />
        <InventoryPositionTile />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <CustomerBehaviorTile />
        <BuyingTrendsTile />
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold" style={{ color: '#1b244d' }}>Regional Performance Summary</CardTitle>
            <DataIndicator type="realtime" />
          </CardHeader>
          <CardContent className="space-y-3">
            {(stores as any[]).slice(0, 4).map((store: any, index: number) => (
              <div key={store.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium" style={{ color: '#1b244d' }}>{store.region}</div>
                    <div className="text-sm text-gray-500">{store.storeCount} stores active</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">
                      ${((Math.random() * 600) + 300).toFixed(0)}K
                    </div>
                    <div className="text-xs text-green-400">
                      +{(Math.random() * 20 + 10).toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full" 
                    style={{ width: `${Math.random() * 40 + 60}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold" style={{ color: '#1b244d' }}>Top Performers</CardTitle>
            <DataIndicator type="ai" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Alex Thompson", store: "West Coast", sales: "47.2K", target: "142%" },
              { name: "Sarah Chen", store: "East Coast", sales: "39.8K", target: "128%" },
              { name: "Michael Rodriguez", store: "Midwest", sales: "35.4K", target: "115%" },
            ].map((associate, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {associate.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: '#1b244d' }}>{associate.name}</div>
                    <div className="text-sm text-gray-500">{associate.store}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">${associate.sales}</div>
                  <div className="text-xs text-green-600">{associate.target}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold" style={{ color: '#1b244d' }}>AI Insights Summary</CardTitle>
            <DataIndicator type="ai" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="text-purple-600 font-medium">Demand Prediction</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">87%</div>
              <div className="text-sm text-purple-500">Strong upward trend</div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">Social Sentiment</span>
              </div>
              <div className="text-2xl font-bold text-green-600">89%</div>
              <div className="text-sm text-green-500">Positive mentions</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-blue-600 font-medium">Customer Health</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">92%</div>
              <div className="text-sm text-blue-500">Retention rate</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
