import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataIndicator from "@/components/common/data-indicator";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";

export default function SalesChart() {
  const { data: hourlySalesData = [] } = useQuery({
    queryKey: ["/api/hourly-sales"],
  });
  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold" style={{ color: '#1b244d' }}>Hourly Sales Performance</CardTitle>
        <DataIndicator type="realtime" />
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={(hourlySalesData as any[]).map((item: any) => ({
              hour: item.hour,
              target: parseFloat(item.targetSales) || 0,
              actual: parseFloat(item.actualSales) || 0
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="hour" 
                stroke="#6b7280" 
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  color: '#1b244d',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="#6b7280" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Target"
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#d63426" 
                strokeWidth={3}
                name="Actual"
                dot={{ fill: '#d63426', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
