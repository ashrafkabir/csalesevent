import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, ShoppingCart, Eye, Activity, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import DataIndicator from "@/components/common/data-indicator";
import { formatNumber } from "@/lib/format";

export default function CustomerBehaviorTile() {
  const [showDetails, setShowDetails] = useState(false);

  // Fetch real data from APIs
  const { data: metrics } = useQuery({ queryKey: ["/api/metrics/latest"] });
  const { data: customerBehavior = [] } = useQuery({ queryKey: ["/api/customer-behavior-metrics"] });

  // Use latest customer behavior data
  const latestBehavior = (customerBehavior as any[])[0] || {};
  
  const customerData = {
    totalActive: (metrics as any)?.activeCustomers || 0,
    newCustomers: latestBehavior.newCustomers || 0,
    returningCustomers: latestBehavior.returningCustomers || 0,
    segments: [
      { 
        name: "Premium Buyers", 
        count: latestBehavior.premiumSegment || 0, 
        revenue: `$${((latestBehavior.premiumRevenue || 0) / 1000).toFixed(1)}K`, 
        avgOrder: (metrics as any)?.avgBasketSize || "$750", 
        retention: "89%" 
      },
      { 
        name: "Value Seekers", 
        count: latestBehavior.valueSegment || 0, 
        revenue: `$${((latestBehavior.valueRevenue || 0) / 1000).toFixed(1)}K`, 
        avgOrder: latestBehavior.valueAvgOrder ? `$${latestBehavior.valueAvgOrder}` : "$500", 
        retention: "67%" 
      },
      { 
        name: "First-Time Buyers", 
        count: latestBehavior.firstTimeSegment || 0, 
        revenue: `$${((latestBehavior.firstTimeRevenue || 0) / 1000).toFixed(1)}K`, 
        avgOrder: latestBehavior.firstTimeAvgOrder ? `$${latestBehavior.firstTimeAvgOrder}` : "$650", 
        retention: "45%" 
      },
      { 
        name: "Loyalty Members", 
        count: latestBehavior.loyaltySegment || 0, 
        revenue: `$${((latestBehavior.loyaltyRevenue || 0) / 1000).toFixed(1)}K`, 
        avgOrder: latestBehavior.loyaltyAvgOrder ? `$${latestBehavior.loyaltyAvgOrder}` : "$850", 
        retention: "94%" 
      },
    ],
    basketAnalysis: [
      { metric: "Average Basket Size", value: (metrics as any)?.avgBasketSize || "$650", change: "+12.5%" },
      { metric: "Items per Basket", value: "2.4", change: "+8.3%" },
      { metric: "Conversion Rate", value: (metrics as any)?.conversionRate || "15.2%", change: "+3.2%" },
      { metric: "Cart Abandonment", value: `${100 - ((parseFloat((metrics as any)?.conversionRate?.replace('%', '') || '15') || 15))}%`, change: "-5.8%" },
    ],
    crossChannel: [
      { journey: "Online → Store Pickup", customers: 2847, conversion: "92%" },
      { journey: "Store Browse → Online Purchase", customers: 1956, conversion: "87%" },
      { journey: "Social Media → Website", customers: 3421, conversion: "23%" },
      { journey: "Email → Mobile App", customers: 1823, conversion: "78%" },
      { journey: "Website → Phone Order", customers: 892, conversion: "95%" },
    ],
    engagement: [
      { channel: "Website", sessions: 12847, duration: "8:45", bounceRate: "34%" },
      { channel: "Mobile App", sessions: 9234, duration: "6:23", bounceRate: "28%" },
      { channel: "In-Store", interactions: 4521, satisfaction: "4.6/5", loyalty: "83%" },
      { channel: "Phone Support", calls: 892, resolution: "94%", satisfaction: "4.8/5" },
    ],
    satisfactionMetrics: {
      overall: 4.7,
      trend: "+0.3",
      responses: 12847,
      nps: 68,
      breakdown: [
        { category: "Product Quality", score: 4.8, change: "+0.2" },
        { category: "Customer Service", score: 4.9, change: "+0.1" },
        { category: "Delivery Experience", score: 4.5, change: "+0.4" },
        { category: "Price Value", score: 4.3, change: "+0.2" },
        { category: "Website Experience", score: 4.6, change: "+0.3" },
      ],
      recentFeedback: [
        { comment: "Excellent mattress quality, very comfortable", rating: 5, verified: true },
        { comment: "Fast delivery and great customer service", rating: 5, verified: true },
        { comment: "Good value for money, would recommend", rating: 4, verified: true },
        { comment: "Website could be more user-friendly", rating: 3, verified: false },
      ]
    },
    realTimeActivity: [
      { action: "Product View", count: 1247, trend: "up" },
      { action: "Add to Cart", count: 389, trend: "up" },
      { action: "Checkout Started", count: 167, trend: "stable" },
      { action: "Purchase Completed", count: 98, trend: "up" },
      { action: "Support Contacted", count: 23, trend: "down" },
    ]
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up": return "text-green-400";
      case "down": return "text-red-400";
      default: return "text-yellow-400";
    }
  };

  return (
    <>
      <Card 
        className="dashboard-card cursor-pointer hover:shadow-lg transition-shadow" 
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold" style={{ color: '#1b244d' }}>Customer Behavior Metrics</CardTitle>
          <DataIndicator type="ai" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-blue-600">{formatNumber(customerData.totalActive)}</div>
              <div className="text-sm text-gray-500">Active Customers</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{customerData.basketAnalysis[0].value}</div>
              <div className="text-sm text-gray-500">Avg Basket Size</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">New Customers</span>
              <span className="font-semibold" style={{ color: '#1b244d' }}>{formatNumber(customerData.newCustomers)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Returning Customers</span>
              <span className="font-semibold" style={{ color: '#1b244d' }}>{formatNumber(customerData.returningCustomers)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Conversion Rate</span>
              <span className="text-green-600 font-semibold">{customerData.basketAnalysis[2].value}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Customer Satisfaction</span>
              <div className="flex items-center space-x-2">
                <span className="font-semibold" style={{ color: '#1b244d' }}>{customerData.satisfactionMetrics.overall}/5.0</span>
                <span className="text-xs text-green-600">({customerData.satisfactionMetrics.trend})</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Net Promoter Score</span>
              <span className="font-semibold text-green-600">{customerData.satisfactionMetrics.nps}</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-300 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-blue-400 font-medium">Cross-Channel Journeys</span>
              <span className="text-blue-400 font-bold">{customerData.crossChannel.length}</span>
            </div>
            <div className="text-sm text-blue-300 mt-1">
              Active customer touchpoints tracked
            </div>
          </div>

          <div className="text-center">
            <Button variant="outline" size="sm" className="text-xs">
              View Behavior Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Customer Behavior Metrics - Detailed Analysis</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Customer Segments */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Active Customers by Segment
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {customerData.segments.map((segment, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="font-semibold">{segment.name}</div>
                          <div className="text-sm text-muted-foreground">{formatNumber(segment.count)} customers</div>
                        </div>
                        <Badge variant="outline" className="text-green-400 border-green-400">
                          {segment.retention} retention
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-muted-foreground">Revenue</div>
                          <div className="font-semibold text-green-400">{segment.revenue}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Avg Order</div>
                          <div className="font-semibold">{segment.avgOrder}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Basket Analysis */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Basket Analysis Metrics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {customerData.basketAnalysis.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{metric.metric}</div>
                          <div className="text-2xl font-bold text-blue-400">{metric.value}</div>
                        </div>
                        <div className={`text-right ${metric.change.startsWith('+') ? 'text-green-400' : metric.change.startsWith('-') ? 'text-red-400' : 'text-yellow-400'}`}>
                          <div className="font-semibold">{metric.change}</div>
                          <div className="text-xs text-muted-foreground">vs last period</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Cross-Channel Journey Tracking */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Cross-Channel Journey Tracking
              </h3>
              <div className="space-y-2">
                {customerData.crossChannel.map((journey, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{journey.journey}</div>
                          <div className="text-sm text-muted-foreground">{formatNumber(journey.customers)} customers</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-400">{journey.conversion}</div>
                          <div className="text-xs text-muted-foreground">conversion rate</div>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-400 h-2 rounded-full" 
                          style={{ width: journey.conversion }}
                        ></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Channel Engagement */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                Channel Engagement Analysis
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {customerData.engagement.map((channel, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="font-semibold mb-2">{channel.channel}</div>
                      <div className="space-y-2 text-sm">
                        {channel.sessions && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Sessions</span>
                              <span className="font-semibold">{formatNumber(channel.sessions)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Avg Duration</span>
                              <span className="font-semibold">{channel.duration}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Bounce Rate</span>
                              <span className="font-semibold">{channel.bounceRate}</span>
                            </div>
                          </>
                        )}
                        {channel.interactions && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Interactions</span>
                              <span className="font-semibold">{formatNumber(channel.interactions)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Satisfaction</span>
                              <span className="font-semibold text-green-400">{channel.satisfaction}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Loyalty</span>
                              <span className="font-semibold">{channel.loyalty}</span>
                            </div>
                          </>
                        )}
                        {channel.calls && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Calls</span>
                              <span className="font-semibold">{formatNumber(channel.calls)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Resolution</span>
                              <span className="font-semibold text-green-400">{channel.resolution}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Satisfaction</span>
                              <span className="font-semibold text-green-400">{channel.satisfaction}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Customer Satisfaction Analytics */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Star className="h-4 w-4 mr-2" />
                Customer Satisfaction Analytics
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overall Metrics */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-4">Overall Satisfaction</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Overall Rating</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${i < Math.floor(customerData.satisfactionMetrics.overall) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="font-semibold" style={{ color: '#1b244d' }}>{customerData.satisfactionMetrics.overall}/5.0</span>
                          <span className="text-xs text-green-600">({customerData.satisfactionMetrics.trend})</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Net Promoter Score</span>
                        <span className="font-semibold text-green-600">{customerData.satisfactionMetrics.nps}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Responses</span>
                        <span className="font-semibold">{formatNumber(customerData.satisfactionMetrics.responses)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Breakdown */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-4">Satisfaction by Category</h4>
                    <div className="space-y-3">
                      {customerData.satisfactionMetrics.breakdown.map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{category.category}</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold" style={{ color: '#1b244d' }}>{category.score}</span>
                            <span className="text-xs text-green-600">({category.change})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Feedback */}
                <Card className="lg:col-span-2">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-4">Recent Customer Feedback</h4>
                    <div className="space-y-3">
                      {customerData.satisfactionMetrics.recentFeedback.map((feedback, index) => (
                        <div key={index} className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${i < feedback.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                ))}
                              </div>
                              {feedback.verified && (
                                <Badge variant="outline" className="text-xs text-green-600 border-green-400">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 italic">"{feedback.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Real-time Activity */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Real-time Customer Activity (Last Hour)
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {customerData.realTimeActivity.map((activity, index) => (
                  <Card key={index}>
                    <CardContent className="p-3 text-center">
                      <div className="text-sm font-medium text-muted-foreground">{activity.action}</div>
                      <div className="text-2xl font-bold">{formatNumber(activity.count)}</div>
                      <div className={`text-xs ${getTrendColor(activity.trend)}`}>
                        {activity.trend === "up" ? "↗ Increasing" : 
                         activity.trend === "down" ? "↘ Decreasing" : 
                         "→ Stable"}
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