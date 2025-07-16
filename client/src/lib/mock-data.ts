// This file provides typed interfaces for our data structures
// The actual data comes from the backend APIs

export interface SalesData {
  totalSales: string;
  activeCustomers: number;
  avgBasketSize: string;
  conversionRate: string;
  inventoryHealth: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  size?: string;
  revenue: string;
  units: number;
  ranking: number;
}

export interface RegionalPerformance {
  region: string;
  stores: number;
  revenue: string;
  growth: string;
  performance: number; // percentage of target
}

export interface InventoryAlert {
  id: number;
  product: string;
  location: string;
  currentStock: number;
  minThreshold: number;
  severity: "critical" | "warning" | "info";
  eta?: string;
}

export interface SystemHealth {
  overall: number;
  activeIncidents: number;
  resolvedToday: number;
  mttr: number;
}

export interface SocialMention {
  platform: string;
  mentions: number;
  sentiment: "positive" | "negative" | "mixed";
  engagement: string;
  icon: string;
}

// Signal bundle types for planning view
export interface DataSource {
  name: string;
  type: "internal" | "external";
  fields: string[];
}

export interface SignalBundle {
  id: string;
  name: string;
  category: string;
  description: string;
  signals: string[];
  dataTypes: ("processed" | "realtime" | "ai")[];
  color: string;
  icon: string;
  dataSources: DataSource[];
}

export const signalBundles: SignalBundle[] = [
  {
    id: "sales",
    name: "Sales Events",
    category: "Performance",
    description: "Core sales performance metrics and KPIs",
    signals: [
      "Hourly Sales Summary",
      "Target vs Actual",
      "Product Performance",
      "Customer Segments"
    ],
    dataTypes: ["processed", "realtime", "ai"],
    color: "blue",
    icon: "chart-line",
    dataSources: [
      {
        name: "Order Management System",
        type: "internal",
        fields: ["order_id", "total_amount", "timestamp", "customer_id", "product_sku", "quantity", "discount_applied", "payment_method"]
      },
      {
        name: "POS Systems",
        type: "internal", 
        fields: ["transaction_id", "store_id", "cashier_id", "items_sold", "total_value", "tax_amount", "tender_type"]
      },
      {
        name: "Customer Database",
        type: "internal",
        fields: ["customer_segment", "loyalty_tier", "purchase_history", "demographics", "contact_preferences"]
      }
    ]
  },
  {
    id: "market",
    name: "Market Intelligence",
    category: "External",
    description: "Competitive and market analysis data",
    signals: [
      "Price Comparisons",
      "Competitor Analysis", 
      "Market Trends",
      "Economic Indicators"
    ],
    dataTypes: ["processed", "ai"],
    color: "green",
    icon: "globe",
    dataSources: [
      {
        name: "Price Intelligence API",
        type: "external",
        fields: ["competitor_name", "product_match", "price", "availability", "promotion_details", "last_updated"]
      },
      {
        name: "Market Research Feed",
        type: "external",
        fields: ["industry_trend", "market_size", "growth_rate", "seasonal_patterns", "consumer_behavior"]
      },
      {
        name: "Economic Data API",
        type: "external",
        fields: ["gdp_growth", "inflation_rate", "unemployment", "consumer_confidence", "retail_sales_index"]
      }
    ]
  },
  {
    id: "customer",
    name: "Customer Behavior",
    category: "Behavioral",
    description: "Customer journey and behavioral analytics",
    signals: [
      "Journey Tracking",
      "Basket Analysis",
      "Sentiment Analysis",
      "Social Media Chatter"
    ],
    dataTypes: ["realtime", "ai"],
    color: "purple",
    icon: "users",
    dataSources: [
      {
        name: "Web Analytics",
        type: "internal",
        fields: ["session_id", "page_views", "bounce_rate", "conversion_funnel", "cart_abandonment", "search_terms"]
      },
      {
        name: "Social Media APIs",
        type: "external",
        fields: ["platform", "mention_count", "sentiment_score", "engagement_rate", "hashtags", "influencer_activity"]
      },
      {
        name: "Customer Support System",
        type: "internal",
        fields: ["ticket_id", "issue_category", "resolution_time", "satisfaction_score", "feedback_text"]
      }
    ]
  },
  {
    id: "inventory",
    name: "Inventory & Operations",
    category: "Operations",
    description: "Inventory levels and operational metrics",
    signals: [
      "Stock Levels",
      "Sell-through Rates", 
      "Store Operations",
      "Supply Chain"
    ],
    dataTypes: ["processed", "realtime"],
    color: "yellow",
    icon: "package",
    dataSources: [
      {
        name: "Warehouse Management System",
        type: "internal",
        fields: ["sku", "location", "on_hand_qty", "allocated_qty", "available_qty", "reorder_point", "lead_time"]
      },
      {
        name: "Store Inventory System",
        type: "internal",
        fields: ["store_id", "product_id", "floor_stock", "backroom_stock", "reserved_stock", "last_count_date"]
      },
      {
        name: "Supply Chain API",
        type: "internal",
        fields: ["supplier_id", "purchase_order", "delivery_status", "quality_score", "cost_variance", "delivery_time"]
      }
    ]
  },
  {
    id: "external",
    name: "External Events",
    category: "Environmental",
    description: "External factors affecting sales",
    signals: [
      "Weather Events",
      "News Events",
      "Economic Data",
      "Seasonal Trends"
    ],
    dataTypes: ["processed", "ai"],
    color: "red",
    icon: "cloud-sun",
    dataSources: [
      {
        name: "Weather API",
        type: "external",
        fields: ["location", "temperature", "precipitation", "humidity", "wind_speed", "weather_alerts", "forecast"]
      },
      {
        name: "News Feed API",
        type: "external",
        fields: ["headline", "source", "category", "sentiment", "relevance_score", "publish_date", "impact_rating"]
      },
      {
        name: "Event Calendar API",
        type: "external",
        fields: ["event_type", "event_date", "location", "expected_attendance", "category", "impact_level"]
      }
    ]
  },
  {
    id: "ai",
    name: "AI & Analytics",
    category: "Intelligence",
    description: "AI-powered insights and predictions",
    signals: [
      "Demand Forecasting",
      "Pattern Recognition",
      "Anomaly Detection", 
      "Predictive Insights"
    ],
    dataTypes: ["ai"],
    color: "indigo",
    icon: "brain",
    dataSources: [
      {
        name: "ML Pipeline",
        type: "internal",
        fields: ["model_name", "prediction_confidence", "feature_importance", "training_date", "accuracy_score"]
      },
      {
        name: "Analytics Engine",
        type: "internal",
        fields: ["pattern_type", "anomaly_score", "trend_direction", "statistical_significance", "recommendation"]
      },
      {
        name: "AI Insights API",
        type: "external",
        fields: ["insight_type", "confidence_level", "action_recommendation", "impact_forecast", "risk_assessment"]
      }
    ]
  }
];
