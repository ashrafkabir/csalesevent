import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataIndicator from "@/components/common/data-indicator";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency, formatNumber } from "@/lib/format";

export default function TopProducts() {
  const { data: productPerformance = [] } = useQuery({
    queryKey: ["/api/product-performance"],
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const topProducts = (productPerformance as any[])
    .sort((a: any, b: any) => a.ranking - b.ranking)
    .slice(0, 5)
    .map((perf: any) => {
      const product = (products as any[]).find((p: any) => p.id === perf.productId);
      return {
        ranking: perf.ranking,
        name: product?.name || "Unknown Product",
        size: product?.size || "Standard Size",
        revenue: formatCurrency(perf.revenue),
        units: formatNumber(perf.unitsSold),
      };
    });

  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold" style={{ color: '#1b244d' }}>Top Products</CardTitle>
        <DataIndicator type="ai" />
      </CardHeader>
      <CardContent className="space-y-3">
        {topProducts.map((product) => (
          <div key={product.ranking} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                product.ranking === 1 
                  ? "text-white" 
                  : "bg-gray-300 text-gray-700"
              }`} style={product.ranking === 1 ? { backgroundColor: '#d63426' } : {}}>
                {product.ranking}
              </div>
              <div>
                <div className="font-medium" style={{ color: '#1b244d' }}>{product.name}</div>
                <div className="text-sm text-gray-500">{product.size}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-green-600">${product.revenue}</div>
              <div className="text-xs text-gray-500">{product.units} units</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
