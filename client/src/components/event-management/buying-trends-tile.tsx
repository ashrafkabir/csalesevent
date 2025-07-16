import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, MessageCircle, DollarSign, Cloud, Newspaper, Activity } from "lucide-react";
import DataIndicator from "@/components/common/data-indicator";

export default function BuyingTrendsTile() {
  const [showDetails, setShowDetails] = useState(false);

  // Mock buying trends data with AI insights
  const trendsData = {
    aiInsights: {
      demandScore: 87,
      trendDirection: "strongly_positive",
      confidence: "94%",
      keyFactors: ["Social buzz", "Weather patterns", "Economic indicators"]
    },
    socialMedia: {
      totalMentions: 12847,
      sentiment: "positive",
      platforms: [
        { name: "Twitter", mentions: 4892, sentiment: "positive", engagement: "high", trending: "#BlackFridayDeals" },
        { name: "Instagram", mentions: 3521, sentiment: "very_positive", engagement: "very_high", trending: "#MattressSale" },
        { name: "TikTok", mentions: 2847, sentiment: "positive", engagement: "viral", trending: "#SleepBetter" },
        { name: "Facebook", mentions: 1587, sentiment: "mixed", engagement: "moderate", trending: "#HomeComfort" },
      ],
      topTopics: ["comfort technology", "sleep quality", "value for money", "delivery speed"]
    },
    priceComparisons: [
      { competitor: "Sleep Number", category: "Premium", ourPrice: "$1,299", theirPrice: "$1,899", advantage: "+46%" },
      { competitor: "Purple", category: "Memory Foam", ourPrice: "$899", theirPrice: "$1,199", advantage: "+33%" },
      { competitor: "Casper", category: "Hybrid", ourPrice: "$1,099", theirPrice: "$1,295", advantage: "+18%" },
      { competitor: "Tuft & Needle", category: "Budget", ourPrice: "$499", theirPrice: "$595", advantage: "+19%" },
    ],
    dealComparisons: [
      { competitor: "Tempur-Pedic", ourDiscount: "40%", theirDiscount: "25%", advantage: "15% better" },
      { competitor: "Saatva", ourDiscount: "35%", theirDiscount: "20%", advantage: "15% better" },
      { competitor: "Amerisleep", ourDiscount: "30%", theirDiscount: "35%", advantage: "5% behind" },
    ],
    footfall: {
      totalVisitors: 8934,
      conversionRate: "23.4%",
      byLocation: [
        { store: "West Coast Flagship", visitors: 2847, conversion: "28.9%", trend: "up" },
        { store: "East Coast Mall", visitors: 1923, conversion: "21.2%", trend: "stable" },
        { store: "Midwest Outlet", visitors: 1456, conversion: "19.8%", trend: "up" },
        { store: "Southeast Store", visitors: 2708, conversion: "25.1%", trend: "up" },
      ]
    },
    weatherEvents: [
      { region: "Northeast", event: "Cold Front", impact: "+18% demand for heated mattresses" },
      { region: "Southwest", event: "Heat Wave", impact: "+25% demand for cooling mattresses" },
      { region: "Midwest", event: "Early Snow", impact: "+12% overall mattress demand" },
    ],
    newsEvents: [
      { headline: "Sleep Study Links Quality Mattresses to Productivity", impact: "+15% premium category interest" },
      { headline: "Black Friday Records Expected", impact: "+22% overall shopping intent" },
      { headline: "Supply Chain Improvements Announced", impact: "+8% delivery confidence" },
    ],
    cpiTrends: {
      current: "3.2%",
      trend: "decreasing",
      impact: "Positive for discretionary spending",
      mattressIndex: "+2.1%",
      prediction: "Increased purchasing power for premium products"
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "very_positive": return "text-green-600 bg-green-50 border-green-200";
      case "positive": return "text-green-600 bg-green-50 border-green-200";
      case "mixed": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "negative": return "text-red-600 bg-red-50 border-red-200";
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
          <CardTitle className="text-lg font-semibold" style={{ color: '#1b244d' }}>AI-Powered Buying Trends</CardTitle>
          <DataIndicator type="ai" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-600">{trendsData.aiInsights.demandScore}</div>
              <div className="text-sm text-gray-500">Demand Score</div>
            </div>
            <div className="flex items-center text-green-600">
              <Brain className="h-4 w-4 mr-1" />
              <span className="font-semibold">{trendsData.aiInsights.confidence}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
              <div className="font-semibold" style={{ color: '#1b244d' }}>{trendsData.socialMedia.totalMentions.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Social Mentions</div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center">
              <div className="font-semibold" style={{ color: '#1b244d' }}>{trendsData.footfall.totalVisitors.toLocaleString()}</div>
              <div className="text-xs text-gray-500">Store Visitors</div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Brain className="h-4 w-4 text-purple-600" />
              <span className="text-purple-600 font-medium">AI Prediction</span>
            </div>
            <div className="text-sm text-purple-500">
              {trendsData.aiInsights.trendDirection === "strongly_positive" ? "Strong upward demand trend" : "Market conditions favorable"}
            </div>
          </div>

          <div className="text-center">
            <Button variant="outline" size="sm" className="text-xs">
              View Market Intelligence
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI-Powered Buying Trends - Market Intelligence Dashboard</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* AI Demand Sensing */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                AI Demand Sensing & Predictions
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400">{trendsData.aiInsights.demandScore}</div>
                    <div className="text-sm text-muted-foreground">Demand Score</div>
                    <Badge variant="outline" className="mt-2 text-green-400 border-green-400">
                      {trendsData.aiInsights.confidence} Confidence
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground mb-2">Key Factors</div>
                    <div className="space-y-1">
                      {trendsData.aiInsights.keyFactors.map((factor, index) => (
                        <Badge key={index} variant="secondary" className="mr-1 mb-1">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Trend Direction</div>
                    <div className="text-xl font-bold text-green-400 capitalize">
                      {trendsData.aiInsights.trendDirection.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-green-300 mt-1">Strong market momentum</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Social Media Intelligence */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Social Media Sentiment & Chatter Analysis
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  {trendsData.socialMedia.platforms.map((platform, index) => (
                    <Card key={index} className={`border ${getSentimentColor(platform.sentiment)}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-semibold">{platform.name}</div>
                            <div className="text-sm text-muted-foreground">{platform.mentions.toLocaleString()} mentions</div>
                          </div>
                          <Badge variant="outline" className={getSentimentColor(platform.sentiment)}>
                            {platform.sentiment.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <div className="flex justify-between">
                            <span>Trending:</span>
                            <span className="font-medium">{platform.trending}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Engagement:</span>
                            <span className="font-medium">{platform.engagement}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card>
                  <CardContent className="p-4">
                    <div className="font-semibold mb-3">Top Discussion Topics</div>
                    <div className="space-y-2">
                      {trendsData.socialMedia.topTopics.map((topic, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="capitalize">{topic}</span>
                          <Badge variant="outline">Trending</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Price & Deal Comparisons */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Price Comparisons vs Competitors
                </h3>
                <div className="space-y-2">
                  {trendsData.priceComparisons.map((comp, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{comp.competitor}</div>
                            <div className="text-sm text-muted-foreground">{comp.category}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">
                              <span className="font-semibold text-green-400">{comp.ourPrice}</span> vs {comp.theirPrice}
                            </div>
                            <Badge variant="outline" className="text-green-400 border-green-400">
                              {comp.advantage} better value
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Deal Comparisons</h3>
                <div className="space-y-2">
                  {trendsData.dealComparisons.map((deal, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <div className="flex justify-between items-center">
                          <div className="font-semibold">{deal.competitor}</div>
                          <div className="text-right">
                            <div className="text-sm">
                              <span className="font-semibold">{deal.ourDiscount}</span> vs {deal.theirDiscount}
                            </div>
                            <Badge 
                              variant="outline" 
                              className={deal.advantage.includes('better') ? 
                                "text-green-400 border-green-400" : 
                                "text-red-400 border-red-400"
                              }
                            >
                              {deal.advantage}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Footfall Analysis */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Footfall Analysis by Location
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {trendsData.footfall.byLocation.map((location, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{location.store}</div>
                          <div className="text-sm text-muted-foreground">{location.visitors.toLocaleString()} visitors</div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={location.trend === 'up' ? 
                            "text-green-400 border-green-400" : 
                            "text-yellow-400 border-yellow-400"
                          }
                        >
                          {location.trend === 'up' ? '↗ Rising' : '→ Stable'}
                        </Badge>
                      </div>
                      <div className="text-2xl font-bold text-green-400">{location.conversion}</div>
                      <div className="text-sm text-muted-foreground">Conversion Rate</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* External Factors */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Cloud className="h-4 w-4 mr-2" />
                  Weather Impact
                </h3>
                <div className="space-y-2">
                  {trendsData.weatherEvents.map((weather, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <div className="font-semibold text-sm">{weather.region}</div>
                        <div className="text-xs text-muted-foreground mb-1">{weather.event}</div>
                        <div className="text-xs text-green-400 font-medium">{weather.impact}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <Newspaper className="h-4 w-4 mr-2" />
                  News Impact
                </h3>
                <div className="space-y-2">
                  {trendsData.newsEvents.map((news, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <div className="text-xs font-medium leading-tight mb-1">{news.headline}</div>
                        <div className="text-xs text-green-400">{news.impact}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">CPI Trends</h3>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-400">{trendsData.cpiTrends.current}</div>
                    <div className="text-sm text-muted-foreground mb-2">Current CPI</div>
                    <div className="text-sm">
                      <div className="text-green-400 mb-1">Trend: {trendsData.cpiTrends.trend}</div>
                      <div className="text-xs text-muted-foreground">{trendsData.cpiTrends.impact}</div>
                    </div>
                    <Badge variant="outline" className="mt-2 text-green-400 border-green-400">
                      Mattress Index: {trendsData.cpiTrends.mattressIndex}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}