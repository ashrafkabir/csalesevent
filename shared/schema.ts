import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const salesEvents = pgTable("sales_events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  targetRevenue: decimal("target_revenue", { precision: 12, scale: 2 }).notNull(),
  status: text("status").notNull().default("planned"), // planned, active, completed
  signalConfig: jsonb("signal_config"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const salesMetrics = pgTable("sales_metrics", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => salesEvents.id),
  timestamp: timestamp("timestamp").notNull(),
  totalSales: decimal("total_sales", { precision: 12, scale: 2 }).notNull(),
  activeCustomers: integer("active_customers").notNull(),
  avgBasketSize: decimal("avg_basket_size", { precision: 8, scale: 2 }).notNull(),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }).notNull(),
  inventoryHealth: decimal("inventory_health", { precision: 5, scale: 2 }).notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  size: text("size"),
  price: decimal("price", { precision: 8, scale: 2 }).notNull(),
  sku: text("sku").notNull().unique(),
  description: text("description"),
});

export const inventory = pgTable("inventory", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  storeId: integer("store_id").notNull(),
  region: text("region").notNull(),
  currentStock: integer("current_stock").notNull(),
  minThreshold: integer("min_threshold").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const stores = pgTable("stores", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  region: text("region").notNull(),
  address: text("address"),
  status: text("status").notNull().default("active"), // active, maintenance, closed
  storeCount: integer("store_count").notNull(),
});

export const incidents = pgTable("incidents", {
  id: serial("id").primaryKey(),
  incidentId: text("incident_id").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // critical, high, medium, low
  status: text("status").notNull().default("open"), // open, investigating, resolved, closed
  assignedTeam: text("assigned_team"),
  impact: text("impact"),
  eta: integer("eta_minutes"),
  escalationLevel: integer("escalation_level").default(1), // 1=L1, 2=L2, 3=L3
  usersAffected: integer("users_affected"),
  revenueAtRisk: decimal("revenue_at_risk", { precision: 12, scale: 2 }),
  currentAction: text("current_action"),
  actionEta: integer("action_eta_minutes"),
  actionOwner: text("action_owner"),
  warRoomActive: boolean("war_room_active").default(false),
  warRoomParticipants: integer("war_room_participants").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const warRoomParticipants = pgTable("war_room_participants", {
  id: serial("id").primaryKey(),
  incidentId: integer("incident_id").references(() => incidents.id),
  participantType: text("participant_type").notNull(), // ai, human
  name: text("name").notNull(),
  role: text("role").notNull(),
  status: text("status").notNull(), // active, standby, completed
  description: text("description"),
  etaMinutes: integer("eta_minutes"),
  badgeColor: text("badge_color"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const incidentResolutionPaths = pgTable("incident_resolution_paths", {
  id: serial("id").primaryKey(),
  incidentId: integer("incident_id").references(() => incidents.id),
  pathName: text("path_name").notNull(),
  pathType: text("path_type").notNull(), // current, fallback, nuclear
  description: text("description").notNull(),
  successRate: integer("success_rate").notNull(),
  timeEstimate: text("time_estimate"),
  tradeoffs: text("tradeoffs"),
  priority: integer("priority").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const systemComponents = pgTable("system_components", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull(), // operational, degraded, down
  responseTime: integer("response_time_ms"),
  lastCheck: timestamp("last_check").defaultNow(),
});

export const dataFieldConfigs = pgTable("data_field_configs", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => salesEvents.id),
  bundleId: text("bundle_id").notNull(),
  dataSource: text("data_source").notNull(),
  fieldName: text("field_name").notNull(),
  updateFrequency: text("update_frequency").notNull().default("realtime"),
  retentionDays: integer("retention_days").notNull().default(7),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const signalDependencies = pgTable("signal_dependencies", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => salesEvents.id),
  sourceBundle: text("source_bundle").notNull(),
  sourceField: text("source_field").notNull(),
  targetBundle: text("target_bundle").notNull(),
  targetField: text("target_field").notNull(),
  dependencyType: text("dependency_type").notNull(), // "direct", "computed", "derived"
  weight: integer("weight").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertSalesEventSchema = createInsertSchema(salesEvents).omit({
  id: true,
  createdAt: true,
});

export const insertSalesMetricsSchema = createInsertSchema(salesMetrics).omit({
  id: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export const insertInventorySchema = createInsertSchema(inventory).omit({
  id: true,
  lastUpdated: true,
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertDataFieldConfigSchema = createInsertSchema(dataFieldConfigs).omit({
  id: true,
  createdAt: true,
});

export const insertSignalDependencySchema = createInsertSchema(signalDependencies).omit({
  id: true,
  createdAt: true,
});

export const insertWarRoomParticipantSchema = createInsertSchema(warRoomParticipants).omit({
  id: true,
  createdAt: true,
});

export const insertIncidentResolutionPathSchema = createInsertSchema(incidentResolutionPaths).omit({
  id: true,
  createdAt: true,
});

// Additional tables for comprehensive data coverage

export const hourlySalesData = pgTable("hourly_sales_data", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => salesEvents.id),
  hour: text("hour").notNull(), // Format: "HH:MM" 
  date: timestamp("date").notNull(),
  targetSales: decimal("target_sales", { precision: 12, scale: 2 }).notNull(),
  actualSales: decimal("actual_sales", { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const productPerformance = pgTable("product_performance", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  eventId: integer("event_id").references(() => salesEvents.id),
  revenue: decimal("revenue", { precision: 12, scale: 2 }).notNull(),
  unitsSold: integer("units_sold").notNull(),
  ranking: integer("ranking").notNull(),
  growthRate: decimal("growth_rate", { precision: 5, scale: 2 }),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const regionalSalesData = pgTable("regional_sales_data", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => salesEvents.id),
  region: text("region").notNull(),
  storeCount: integer("store_count").notNull(),
  revenue: decimal("revenue", { precision: 12, scale: 2 }).notNull(),
  growthRate: decimal("growth_rate", { precision: 5, scale: 2 }).notNull(),
  performanceVsTarget: decimal("performance_vs_target", { precision: 5, scale: 2 }).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const customerBehaviorMetrics = pgTable("customer_behavior_metrics", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => salesEvents.id),
  totalVisitors: integer("total_visitors").notNull(),
  bounceRate: decimal("bounce_rate", { precision: 5, scale: 2 }).notNull(),
  sessionDuration: integer("avg_session_duration_seconds").notNull(),
  pagesPerSession: decimal("pages_per_session", { precision: 5, scale: 2 }).notNull(),
  customerSatisfaction: decimal("customer_satisfaction", { precision: 3, scale: 1 }).notNull(),
  npsScore: integer("nps_score").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const socialMentions = pgTable("social_mentions", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => salesEvents.id),
  platform: text("platform").notNull(),
  mentions: integer("mentions").notNull(),
  sentiment: text("sentiment").notNull(), // positive, negative, mixed
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }).notNull(),
  influenceScore: integer("influence_score").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const marketTrends = pgTable("market_trends", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => salesEvents.id),
  trendName: text("trend_name").notNull(),
  category: text("category").notNull(),
  impact: text("impact").notNull(), // high, medium, low
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
  description: text("description").notNull(),
  predictedGrowth: decimal("predicted_growth", { precision: 5, scale: 2 }),
  dataSource: text("data_source").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const topPerformers = pgTable("top_performers", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => salesEvents.id),
  name: text("name").notNull(),
  region: text("region").notNull(),
  storeId: integer("store_id").notNull(),
  sales: decimal("sales", { precision: 10, scale: 2 }).notNull(),
  targetPercentage: decimal("target_percentage", { precision: 5, scale: 2 }).notNull(),
  ranking: integer("ranking").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const aiInsights = pgTable("ai_insights", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => salesEvents.id),
  category: text("category").notNull(), // "prediction", "recommendation", "alert"
  title: text("title").notNull(),
  description: text("description").notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
  impact: text("impact").notNull(), // "high", "medium", "low"
  dataSource: text("data_source").notNull(),
  priority: integer("priority").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const inventoryAlerts = pgTable("inventory_alerts", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").references(() => products.id),
  storeId: integer("store_id").notNull(),
  location: text("location").notNull(),
  currentStock: integer("current_stock").notNull(),
  minThreshold: integer("min_threshold").notNull(),
  severity: text("severity").notNull(), // critical, warning, info
  eta: text("eta"),
  autoReorderEnabled: boolean("auto_reorder_enabled").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Additional insert schemas
export const insertHourlySalesDataSchema = createInsertSchema(hourlySalesData).omit({
  id: true,
  createdAt: true,
});

export const insertProductPerformanceSchema = createInsertSchema(productPerformance).omit({
  id: true,
  lastUpdated: true,
});

export const insertRegionalSalesDataSchema = createInsertSchema(regionalSalesData).omit({
  id: true,
  lastUpdated: true,
});

export const insertCustomerBehaviorMetricsSchema = createInsertSchema(customerBehaviorMetrics).omit({
  id: true,
  timestamp: true,
});

export const insertSocialMentionsSchema = createInsertSchema(socialMentions).omit({
  id: true,
  lastUpdated: true,
});

export const insertMarketTrendsSchema = createInsertSchema(marketTrends).omit({
  id: true,
  lastUpdated: true,
});

export const insertTopPerformersSchema = createInsertSchema(topPerformers).omit({
  id: true,
  lastUpdated: true,
});

export const insertAiInsightsSchema = createInsertSchema(aiInsights).omit({
  id: true,
  createdAt: true,
});

export const insertInventoryAlertsSchema = createInsertSchema(inventoryAlerts).omit({
  id: true,
  createdAt: true,
});

// Types
export type SalesEvent = typeof salesEvents.$inferSelect;
export type InsertSalesEvent = z.infer<typeof insertSalesEventSchema>;
export type SalesMetrics = typeof salesMetrics.$inferSelect;
export type InsertSalesMetrics = z.infer<typeof insertSalesMetricsSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Inventory = typeof inventory.$inferSelect;
export type InsertInventory = z.infer<typeof insertInventorySchema>;
export type Store = typeof stores.$inferSelect;
export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type SystemComponent = typeof systemComponents.$inferSelect;
export type DataFieldConfig = typeof dataFieldConfigs.$inferSelect;
export type InsertDataFieldConfig = z.infer<typeof insertDataFieldConfigSchema>;
export type SignalDependency = typeof signalDependencies.$inferSelect;
export type InsertSignalDependency = z.infer<typeof insertSignalDependencySchema>;
export type WarRoomParticipant = typeof warRoomParticipants.$inferSelect;
export type InsertWarRoomParticipant = z.infer<typeof insertWarRoomParticipantSchema>;
export type IncidentResolutionPath = typeof incidentResolutionPaths.$inferSelect;
export type InsertIncidentResolutionPath = z.infer<typeof insertIncidentResolutionPathSchema>;
export type HourlySalesData = typeof hourlySalesData.$inferSelect;
export type InsertHourlySalesData = z.infer<typeof insertHourlySalesDataSchema>;
export type ProductPerformance = typeof productPerformance.$inferSelect;
export type InsertProductPerformance = z.infer<typeof insertProductPerformanceSchema>;
export type RegionalSalesData = typeof regionalSalesData.$inferSelect;
export type InsertRegionalSalesData = z.infer<typeof insertRegionalSalesDataSchema>;
export type CustomerBehaviorMetrics = typeof customerBehaviorMetrics.$inferSelect;
export type InsertCustomerBehaviorMetrics = z.infer<typeof insertCustomerBehaviorMetricsSchema>;
export type SocialMentions = typeof socialMentions.$inferSelect;
export type InsertSocialMentions = z.infer<typeof insertSocialMentionsSchema>;
export type MarketTrends = typeof marketTrends.$inferSelect;
export type InsertMarketTrends = z.infer<typeof insertMarketTrendsSchema>;
export type TopPerformers = typeof topPerformers.$inferSelect;
export type InsertTopPerformers = z.infer<typeof insertTopPerformersSchema>;
export type AiInsights = typeof aiInsights.$inferSelect;
export type InsertAiInsights = z.infer<typeof insertAiInsightsSchema>;
export type InventoryAlerts = typeof inventoryAlerts.$inferSelect;
export type InsertInventoryAlerts = z.infer<typeof insertInventoryAlertsSchema>;
