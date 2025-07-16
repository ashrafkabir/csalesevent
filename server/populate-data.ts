import { db } from "./db";
import { 
  hourlySalesData, productPerformance, regionalSalesData, 
  customerBehaviorMetrics, socialMentions, marketTrends, 
  topPerformers, aiInsights, inventoryAlerts 
} from "@shared/schema";

export async function populateComprehensiveData() {
  try {
    // Clear existing data for fresh start
    console.log("🧹 Clearing existing comprehensive data...");
    await db.delete(inventoryAlerts);
    await db.delete(aiInsights);
    await db.delete(topPerformers);
    await db.delete(marketTrends);
    await db.delete(socialMentions);
    await db.delete(customerBehaviorMetrics);
    await db.delete(regionalSalesData);
    await db.delete(productPerformance);
    await db.delete(hourlySalesData);

    // Populate Hourly Sales Data
    console.log("📊 Populating hourly sales data...");
    const hoursData = [];
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      const target = 85000 + (Math.sin(i / 24 * Math.PI * 2) * 45000) + (Math.random() * 10000);
      const actual = target * (0.85 + Math.random() * 0.3);
      
      hoursData.push({
        eventId: 1,
        hour,
        date: new Date(currentDate.getTime() + i * 60 * 60 * 1000),
        targetSales: target.toFixed(2),
        actualSales: actual.toFixed(2)
      });
    }
    await db.insert(hourlySalesData).values(hoursData);

    // Populate Product Performance
    console.log("🛍️ Populating product performance data...");
    const products = [
      { productId: 1, revenue: 45200, units: 156 }, // Premium Memory Foam
      { productId: 2, revenue: 35600, units: 89 },  // Hybrid Comfort
      { productId: 3, revenue: 38900, units: 67 }   // Natural Latex
    ];

    const productPerf = products.map((product, index) => ({
      productId: product.productId,
      eventId: 1,
      revenue: product.revenue.toString(),
      unitsSold: product.units,
      ranking: index + 1,
      growthRate: (Math.random() * 40 - 10).toFixed(2) // -10% to +30%
    }));
    await db.insert(productPerformance).values(productPerf);

    // Populate Regional Sales Data
    console.log("🌎 Populating regional sales data...");
    const regions = [
      { region: "West Coast", stores: 24, baseRevenue: 485000 },
      { region: "East Coast", stores: 18, baseRevenue: 392000 },
      { region: "Midwest", stores: 15, baseRevenue: 328000 },
      { region: "Southwest", stores: 12, baseRevenue: 267000 },
      { region: "Southeast", stores: 19, baseRevenue: 356000 }
    ];

    const regionalData = regions.map(region => ({
      eventId: 1,
      region: region.region,
      storeCount: region.stores,
      revenue: (region.baseRevenue * (0.9 + Math.random() * 0.2)).toFixed(2),
      growthRate: (Math.random() * 25 + 5).toFixed(2), // 5-30% growth
      performanceVsTarget: (85 + Math.random() * 30).toFixed(2) // 85-115% of target
    }));
    await db.insert(regionalSalesData).values(regionalData);

    // Populate Customer Behavior Metrics
    console.log("👥 Populating customer behavior metrics...");
    const behaviorMetrics = {
      eventId: 1,
      totalVisitors: 12847,
      bounceRate: "23.4",
      sessionDuration: 287, // seconds
      pagesPerSession: "4.2",
      customerSatisfaction: "4.7",
      npsScore: 68
    };
    await db.insert(customerBehaviorMetrics).values([behaviorMetrics]);

    // Populate Social Mentions
    console.log("📱 Populating social mentions...");
    const socialData = [
      { platform: "Twitter", mentions: 2847, sentiment: "positive", engagement: "8.2", influence: 87 },
      { platform: "Instagram", mentions: 3921, sentiment: "positive", engagement: "12.4", influence: 92 },
      { platform: "Facebook", mentions: 1563, sentiment: "mixed", engagement: "6.8", influence: 73 },
      { platform: "TikTok", mentions: 4206, sentiment: "positive", engagement: "15.7", influence: 95 },
      { platform: "Reddit", mentions: 892, sentiment: "mixed", engagement: "4.3", influence: 64 }
    ];

    const socialMentionsData = socialData.map(social => ({
      eventId: 1,
      platform: social.platform,
      mentions: social.mentions,
      sentiment: social.sentiment,
      engagementRate: social.engagement,
      influenceScore: social.influence
    }));
    await db.insert(socialMentions).values(socialMentionsData);

    // Populate Market Trends
    console.log("📈 Populating market trends...");
    const trends = [
      {
        trendName: "Sustainable Sleep Products",
        category: "Environmental",
        impact: "high",
        confidence: "87.3",
        description: "Growing consumer preference for eco-friendly materials driving 23% increase in organic product sales",
        predictedGrowth: "34.2",
        dataSource: "Market Research AI"
      },
      {
        trendName: "Smart Home Integration",
        category: "Technology",
        impact: "medium",
        confidence: "72.8",
        description: "Sleep technology integration showing steady adoption with 18% quarterly growth",
        predictedGrowth: "28.7",
        dataSource: "IoT Analytics Platform"
      },
      {
        trendName: "Premium Wellness Focus",
        category: "Consumer Behavior",
        impact: "high",
        confidence: "91.2",
        description: "Premium product segment outperforming budget options by 42% in current quarter",
        predictedGrowth: "45.6",
        dataSource: "Consumer Sentiment AI"
      }
    ];

    const marketTrendsData = trends.map(trend => ({
      eventId: 1,
      trendName: trend.trendName,
      category: trend.category,
      impact: trend.impact,
      confidence: trend.confidence,
      description: trend.description,
      predictedGrowth: trend.predictedGrowth,
      dataSource: trend.dataSource
    }));
    await db.insert(marketTrends).values(marketTrendsData);

    // Populate Top Performers
    console.log("🏆 Populating top performers...");
    const performers = [
      { name: "Alex Thompson", region: "West Coast", store: 1, sales: 47200, target: 142.3 },
      { name: "Sarah Chen", region: "East Coast", store: 5, sales: 39800, target: 128.7 },
      { name: "Michael Rodriguez", region: "Midwest", store: 8, sales: 35400, target: 115.2 },
      { name: "Jessica Park", region: "Southwest", store: 12, sales: 33100, target: 108.9 },
      { name: "David Kim", region: "Southeast", store: 15, sales: 31700, target: 103.4 }
    ];

    const performersData = performers.map((performer, index) => ({
      eventId: 1,
      name: performer.name,
      region: performer.region,
      storeId: performer.store,
      sales: performer.sales.toString(),
      targetPercentage: performer.target.toString(),
      ranking: index + 1
    }));
    await db.insert(topPerformers).values(performersData);

    // Populate AI Insights
    console.log("🤖 Populating AI insights...");
    const insights = [
      {
        category: "prediction",
        title: "Sales Acceleration Detected",
        description: "Current trajectory suggests 18% above target by end of day. Recommend increasing inventory for top 3 products.",
        confidence: "94.2",
        impact: "high",
        dataSource: "Sales Prediction Engine",
        priority: 1
      },
      {
        category: "recommendation",
        title: "Regional Optimization Opportunity",
        description: "West Coast region showing 23% higher conversion rates. Consider reallocating marketing spend from underperforming regions.",
        confidence: "87.6",
        impact: "medium",
        dataSource: "Regional Analytics AI",
        priority: 2
      },
      {
        category: "alert",
        title: "Customer Satisfaction Trend",
        description: "NPS score increased by 12 points compared to last quarter. Current strategies are highly effective.",
        confidence: "91.8",
        impact: "high",
        dataSource: "Sentiment Analysis Engine",
        priority: 3
      },
      {
        category: "prediction",
        title: "Inventory Optimization Alert",
        description: "Premium Memory Foam projected to sell out within 6 hours. Immediate restocking recommended.",
        confidence: "96.7",
        impact: "high",
        dataSource: "Inventory Prediction AI",
        priority: 1
      }
    ];

    const aiInsightsData = insights.map(insight => ({
      eventId: 1,
      category: insight.category,
      title: insight.title,
      description: insight.description,
      confidence: insight.confidence,
      impact: insight.impact,
      dataSource: insight.dataSource,
      priority: insight.priority
    }));
    await db.insert(aiInsights).values(aiInsightsData);

    // Populate Inventory Alerts
    console.log("📦 Populating inventory alerts...");
    const alerts = [
      {
        productId: 1,
        storeId: 3,
        location: "West Coast - Store 3",
        currentStock: 8,
        minThreshold: 15,
        severity: "critical",
        eta: "2 hours",
        autoReorderEnabled: true
      },
      {
        productId: 2,
        storeId: 7,
        location: "East Coast - Store 7", 
        currentStock: 12,
        minThreshold: 20,
        severity: "warning",
        eta: "4 hours",
        autoReorderEnabled: true
      },
      {
        productId: 3,
        storeId: 12,
        location: "Midwest - Store 12",
        currentStock: 23,
        minThreshold: 25,
        severity: "info",
        eta: "6 hours",
        autoReorderEnabled: false
      }
    ];

    const inventoryAlertsData = alerts.map(alert => ({
      productId: alert.productId,
      storeId: alert.storeId,
      location: alert.location,
      currentStock: alert.currentStock,
      minThreshold: alert.minThreshold,
      severity: alert.severity,
      eta: alert.eta,
      autoReorderEnabled: alert.autoReorderEnabled
    }));
    await db.insert(inventoryAlerts).values(inventoryAlertsData);

    console.log("✅ Successfully populated all comprehensive data!");
  } catch (error) {
    console.error("❌ Error populating comprehensive data:", error);
    throw error;
  }
}

// Run the population function
populateComprehensiveData().then(() => {
  console.log("🎉 Data population complete!");
  process.exit(0);
}).catch((error) => {
  console.error("💥 Failed to populate data:", error);
  process.exit(1);
});