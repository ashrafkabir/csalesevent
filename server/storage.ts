import {
  salesEvents, salesMetrics, products, inventory, stores, incidents, systemComponents,
  dataFieldConfigs, signalDependencies, warRoomParticipants, incidentResolutionPaths,
  hourlySalesData, productPerformance, regionalSalesData, customerBehaviorMetrics,
  socialMentions, marketTrends, topPerformers, aiInsights, inventoryAlerts,
  type SalesEvent, type InsertSalesEvent, type SalesMetrics, type InsertSalesMetrics,
  type Product, type InsertProduct, type Inventory, type InsertInventory,
  type Store, type Incident, type InsertIncident, type SystemComponent,
  type DataFieldConfig, type InsertDataFieldConfig, type SignalDependency, type InsertSignalDependency,
  type WarRoomParticipant, type InsertWarRoomParticipant, type IncidentResolutionPath, type InsertIncidentResolutionPath,
  type HourlySalesData, type InsertHourlySalesData, type ProductPerformance, type InsertProductPerformance,
  type RegionalSalesData, type InsertRegionalSalesData, type CustomerBehaviorMetrics, type InsertCustomerBehaviorMetrics,
  type SocialMentions, type InsertSocialMentions, type MarketTrends, type InsertMarketTrends,
  type TopPerformers, type InsertTopPerformers, type AiInsights, type InsertAiInsights,
  type InventoryAlerts, type InsertInventoryAlerts
} from "@shared/schema";

export interface IStorage {
  // Sales Events
  getSalesEvents(): Promise<SalesEvent[]>;
  getSalesEvent(id: number): Promise<SalesEvent | undefined>;
  createSalesEvent(event: InsertSalesEvent): Promise<SalesEvent>;
  updateSalesEvent(id: number, event: Partial<InsertSalesEvent>): Promise<SalesEvent | undefined>;

  // Sales Metrics
  getSalesMetrics(eventId?: number): Promise<SalesMetrics[]>;
  createSalesMetrics(metrics: InsertSalesMetrics): Promise<SalesMetrics>;
  getLatestSalesMetrics(): Promise<SalesMetrics | undefined>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Inventory
  getInventory(): Promise<(Inventory & { product: Product; store: Store })[]>;
  getInventoryByRegion(region: string): Promise<(Inventory & { product: Product; store: Store })[]>;
  getLowStockItems(): Promise<(Inventory & { product: Product; store: Store })[]>;
  updateInventory(id: number, inventory: Partial<InsertInventory>): Promise<Inventory | undefined>;

  // Stores
  getStores(): Promise<Store[]>;
  getStore(id: number): Promise<Store | undefined>;
  getStoresByRegion(region: string): Promise<Store[]>;

  // Incidents
  getIncidents(): Promise<Incident[]>;
  getActiveIncidents(): Promise<Incident[]>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  updateIncident(id: number, incident: Partial<InsertIncident>): Promise<Incident | undefined>;

  // System Components
  getSystemComponents(): Promise<SystemComponent[]>;
  updateSystemComponent(id: number, status: string, responseTime?: number): Promise<SystemComponent | undefined>;

  // Data Field Configurations
  getDataFieldConfigs(eventId?: number): Promise<DataFieldConfig[]>;
  createDataFieldConfig(config: InsertDataFieldConfig): Promise<DataFieldConfig>;
  updateDataFieldConfig(id: number, config: Partial<InsertDataFieldConfig>): Promise<DataFieldConfig | undefined>;
  deleteDataFieldConfig(id: number): Promise<void>;

  // Signal Dependencies
  getSignalDependencies(eventId?: number): Promise<SignalDependency[]>;
  createSignalDependency(dependency: InsertSignalDependency): Promise<SignalDependency>;
  deleteSignalDependency(id: number): Promise<void>;

  // War Room Participants
  getWarRoomParticipants(incidentId: number): Promise<WarRoomParticipant[]>;
  createWarRoomParticipant(participant: InsertWarRoomParticipant): Promise<WarRoomParticipant>;
  
  // Incident Resolution Paths
  getIncidentResolutionPaths(incidentId: number): Promise<IncidentResolutionPath[]>;
  createIncidentResolutionPath(path: InsertIncidentResolutionPath): Promise<IncidentResolutionPath>;

  // Hourly Sales Data
  getHourlySalesData(eventId?: number): Promise<HourlySalesData[]>;
  createHourlySalesData(data: InsertHourlySalesData): Promise<HourlySalesData>;

  // Product Performance
  getProductPerformance(eventId?: number): Promise<ProductPerformance[]>;
  createProductPerformance(performance: InsertProductPerformance): Promise<ProductPerformance>;

  // Regional Sales Data
  getRegionalSalesData(eventId?: number): Promise<RegionalSalesData[]>;
  createRegionalSalesData(data: InsertRegionalSalesData): Promise<RegionalSalesData>;

  // Customer Behavior Metrics
  getCustomerBehaviorMetrics(eventId?: number): Promise<CustomerBehaviorMetrics[]>;
  getLatestCustomerBehaviorMetrics(): Promise<CustomerBehaviorMetrics | undefined>;
  createCustomerBehaviorMetrics(metrics: InsertCustomerBehaviorMetrics): Promise<CustomerBehaviorMetrics>;

  // Social Mentions
  getSocialMentions(eventId?: number): Promise<SocialMentions[]>;
  createSocialMentions(mentions: InsertSocialMentions): Promise<SocialMentions>;

  // Market Trends
  getMarketTrends(eventId?: number): Promise<MarketTrends[]>;
  createMarketTrends(trends: InsertMarketTrends): Promise<MarketTrends>;

  // Top Performers
  getTopPerformers(eventId?: number): Promise<TopPerformers[]>;
  createTopPerformers(performers: InsertTopPerformers): Promise<TopPerformers>;

  // AI Insights
  getAiInsights(eventId?: number): Promise<AiInsights[]>;
  createAiInsights(insights: InsertAiInsights): Promise<AiInsights>;

  // Inventory Alerts
  getInventoryAlerts(): Promise<InventoryAlerts[]>;
  createInventoryAlerts(alerts: InsertInventoryAlerts): Promise<InventoryAlerts>;
}

export class MemStorage implements IStorage {
  private salesEvents: Map<number, SalesEvent>;
  private salesMetrics: Map<number, SalesMetrics>;
  private products: Map<number, Product>;
  private inventory: Map<number, Inventory>;
  private stores: Map<number, Store>;
  private incidents: Map<number, Incident>;
  private systemComponents: Map<number, SystemComponent>;
  private currentId: number;

  constructor() {
    this.salesEvents = new Map();
    this.salesMetrics = new Map();
    this.products = new Map();
    this.inventory = new Map();
    this.stores = new Map();
    this.incidents = new Map();
    this.systemComponents = new Map();
    this.currentId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Initialize sample mattress products
    const sampleProducts: Product[] = [
      { id: 1, name: "Premium Memory Foam", category: "Memory Foam", size: "Queen", price: "1299.99", sku: "PMF-Q001", description: "Premium memory foam mattress with cooling gel" },
      { id: 2, name: "Luxury Hybrid Mattress", category: "Hybrid", size: "King", price: "1899.99", sku: "LHM-K001", description: "Luxury hybrid with pocket springs and memory foam" },
      { id: 3, name: "Cooling Gel Mattress", category: "Gel", size: "Queen", price: "999.99", sku: "CGM-Q001", description: "Cooling gel mattress for hot sleepers" },
      { id: 4, name: "Organic Cotton Mattress", category: "Organic", size: "Full", price: "799.99", sku: "OCM-F001", description: "Organic cotton and natural latex mattress" },
      { id: 5, name: "Firm Support Mattress", category: "Innerspring", size: "King", price: "699.99", sku: "FSM-K001", description: "Firm support innerspring mattress" },
    ];

    // Initialize sample stores
    const sampleStores: Store[] = [
      { id: 1, name: "West Coast Region", region: "West Coast", address: "Multiple locations", status: "active", storeCount: 45 },
      { id: 2, name: "East Coast Region", region: "East Coast", address: "Multiple locations", status: "active", storeCount: 52 },
      { id: 3, name: "Midwest Region", region: "Midwest", address: "Multiple locations", status: "active", storeCount: 38 },
      { id: 4, name: "Southeast Region", region: "Southeast", address: "Multiple locations", status: "active", storeCount: 29 },
    ];

    // Initialize sample sales event
    const sampleEvent: SalesEvent = {
      id: 1,
      name: "Black Friday Sale 2024",
      startDate: new Date("2024-11-29"),
      endDate: new Date("2024-12-02"),
      targetRevenue: "3200000.00",
      status: "active",
      signalConfig: {},
      createdAt: new Date(),
    };

    // Initialize sample incidents
    const sampleIncidents: Incident[] = [
      {
        id: 1,
        incidentId: "INC-2024-001247",
        title: "Payment Gateway Degraded Performance",
        description: "Checkout completion rate dropped from 94% to 67%. Multiple payment failures reported.",
        severity: "critical",
        status: "investigating",
        assignedTeam: "DevOps Team",
        impact: "High Revenue Loss",
        eta: 45,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        resolvedAt: null,
      },
      {
        id: 2,
        incidentId: "INC-2024-001246",
        title: "Search Function Latency",
        description: "Product search response time increased from 200ms to 1.2s average.",
        severity: "high",
        status: "investigating",
        assignedTeam: "Platform Team",
        impact: "User Experience",
        eta: 30,
        createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        resolvedAt: null,
      },
    ];

    // Initialize sample system components
    const sampleComponents: SystemComponent[] = [
      { id: 1, name: "Web Frontend", status: "operational", responseTime: 156, lastCheck: new Date() },
      { id: 2, name: "Payment Service", status: "degraded", responseTime: 2100, lastCheck: new Date() },
      { id: 3, name: "Inventory API", status: "operational", responseTime: 89, lastCheck: new Date() },
      { id: 4, name: "User Authentication", status: "operational", responseTime: 45, lastCheck: new Date() },
      { id: 5, name: "Search Service", status: "degraded", responseTime: 1200, lastCheck: new Date() },
      { id: 6, name: "Email Service", status: "operational", responseTime: null, lastCheck: new Date() },
    ];

    // Populate data
    sampleProducts.forEach(product => this.products.set(product.id, product));
    sampleStores.forEach(store => this.stores.set(store.id, store));
    this.salesEvents.set(sampleEvent.id, sampleEvent);
    sampleIncidents.forEach(incident => this.incidents.set(incident.id, incident));
    sampleComponents.forEach(component => this.systemComponents.set(component.id, component));

    // Initialize sample inventory
    const sampleInventory: Inventory[] = [
      { id: 1, productId: 1, storeId: 1, region: "West Coast", currentStock: 12, minThreshold: 20, lastUpdated: new Date() },
      { id: 2, productId: 2, storeId: 2, region: "East Coast", currentStock: 47, minThreshold: 30, lastUpdated: new Date() },
      { id: 3, productId: 3, storeId: 3, region: "Midwest", currentStock: 85, minThreshold: 40, lastUpdated: new Date() },
      { id: 4, productId: 1, storeId: 2, region: "East Coast", currentStock: 156, minThreshold: 50, lastUpdated: new Date() },
      { id: 5, productId: 4, storeId: 1, region: "West Coast", currentStock: 23, minThreshold: 25, lastUpdated: new Date() },
    ];

    sampleInventory.forEach(inv => this.inventory.set(inv.id, inv));

    // Initialize current sales metrics
    const currentMetrics: SalesMetrics = {
      id: 1,
      eventId: 1,
      timestamp: new Date(),
      totalSales: "2400000.00",
      activeCustomers: 8347,
      avgBasketSize: "287.00",
      conversionRate: "4.20",
      inventoryHealth: "94.00",
    };

    this.salesMetrics.set(currentMetrics.id, currentMetrics);
    this.currentId = 100;
  }

  async getSalesEvents(): Promise<SalesEvent[]> {
    return Array.from(this.salesEvents.values());
  }

  async getSalesEvent(id: number): Promise<SalesEvent | undefined> {
    return this.salesEvents.get(id);
  }

  async createSalesEvent(event: InsertSalesEvent): Promise<SalesEvent> {
    const id = this.currentId++;
    const newEvent: SalesEvent = { ...event, id, createdAt: new Date() };
    this.salesEvents.set(id, newEvent);
    return newEvent;
  }

  async updateSalesEvent(id: number, event: Partial<InsertSalesEvent>): Promise<SalesEvent | undefined> {
    const existing = this.salesEvents.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...event };
    this.salesEvents.set(id, updated);
    return updated;
  }

  async getSalesMetrics(eventId?: number): Promise<SalesMetrics[]> {
    const metrics = Array.from(this.salesMetrics.values());
    if (eventId) {
      return metrics.filter(m => m.eventId === eventId);
    }
    return metrics;
  }

  async createSalesMetrics(metrics: InsertSalesMetrics): Promise<SalesMetrics> {
    const id = this.currentId++;
    const newMetrics: SalesMetrics = { ...metrics, id };
    this.salesMetrics.set(id, newMetrics);
    return newMetrics;
  }

  async getLatestSalesMetrics(): Promise<SalesMetrics | undefined> {
    const metrics = Array.from(this.salesMetrics.values());
    const latestMetrics = metrics.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    if (!latestMetrics) return undefined;
    
    // Calculate total sales from all regional sales data
    const regionalSales = Array.from(this.regionalSalesData.values());
    const totalRegionalSales = regionalSales.reduce((sum, region) => {
      return sum + (parseFloat(region.revenue) || 0);
    }, 0);
    
    // Add online sales estimate (typically 15-20% of total retail)
    const onlineSalesEstimate = totalRegionalSales * 0.18;
    const calculatedTotal = totalRegionalSales + onlineSalesEstimate;
    
    // Return metrics with calculated total sales
    return {
      ...latestMetrics,
      totalSales: calculatedTotal.toFixed(2)
    };
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const newProduct: Product = { ...product, id };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async getInventory(): Promise<(Inventory & { product: Product; store: Store })[]> {
    const inventory = Array.from(this.inventory.values());
    return inventory.map(inv => ({
      ...inv,
      product: this.products.get(inv.productId!)!,
      store: this.stores.get(inv.storeId)!,
    }));
  }

  async getInventoryByRegion(region: string): Promise<(Inventory & { product: Product; store: Store })[]> {
    const inventory = await this.getInventory();
    return inventory.filter(inv => inv.region === region);
  }

  async getLowStockItems(): Promise<(Inventory & { product: Product; store: Store })[]> {
    const inventory = await this.getInventory();
    return inventory.filter(inv => inv.currentStock <= inv.minThreshold);
  }

  async updateInventory(id: number, inventory: Partial<InsertInventory>): Promise<Inventory | undefined> {
    const existing = this.inventory.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...inventory, lastUpdated: new Date() };
    this.inventory.set(id, updated);
    return updated;
  }

  async getStores(): Promise<Store[]> {
    return Array.from(this.stores.values());
  }

  async getStore(id: number): Promise<Store | undefined> {
    return this.stores.get(id);
  }

  async getStoresByRegion(region: string): Promise<Store[]> {
    return Array.from(this.stores.values()).filter(store => store.region === region);
  }

  async getIncidents(): Promise<Incident[]> {
    return Array.from(this.incidents.values());
  }

  async getActiveIncidents(): Promise<Incident[]> {
    return Array.from(this.incidents.values()).filter(incident => incident.status !== "resolved" && incident.status !== "closed");
  }

  async createIncident(incident: InsertIncident): Promise<Incident> {
    const id = this.currentId++;
    const newIncident: Incident = { ...incident, id, createdAt: new Date(), resolvedAt: null };
    this.incidents.set(id, newIncident);
    return newIncident;
  }

  async updateIncident(id: number, incident: Partial<InsertIncident>): Promise<Incident | undefined> {
    const existing = this.incidents.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...incident };
    if (incident.status === "resolved" || incident.status === "closed") {
      updated.resolvedAt = new Date();
    }
    this.incidents.set(id, updated);
    return updated;
  }

  async getSystemComponents(): Promise<SystemComponent[]> {
    return Array.from(this.systemComponents.values());
  }

  async updateSystemComponent(id: number, status: string, responseTime?: number): Promise<SystemComponent | undefined> {
    const existing = this.systemComponents.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, status, responseTime, lastCheck: new Date() };
    this.systemComponents.set(id, updated);
    return updated;
  }
}

import { db } from "./db";
import { eq, desc, lt } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getSalesEvents(): Promise<SalesEvent[]> {
    return await db.select().from(salesEvents);
  }

  async getSalesEvent(id: number): Promise<SalesEvent | undefined> {
    const [event] = await db.select().from(salesEvents).where(eq(salesEvents.id, id));
    return event || undefined;
  }

  async createSalesEvent(event: InsertSalesEvent): Promise<SalesEvent> {
    const [newEvent] = await db
      .insert(salesEvents)
      .values({ ...event, status: event.status || "draft" })
      .returning();
    return newEvent;
  }

  async updateSalesEvent(id: number, event: Partial<InsertSalesEvent>): Promise<SalesEvent | undefined> {
    const [updatedEvent] = await db
      .update(salesEvents)
      .set(event)
      .where(eq(salesEvents.id, id))
      .returning();
    return updatedEvent || undefined;
  }

  async getSalesMetrics(eventId?: number): Promise<SalesMetrics[]> {
    if (eventId) {
      return await db.select().from(salesMetrics).where(eq(salesMetrics.eventId, eventId));
    }
    return await db.select().from(salesMetrics);
  }

  async createSalesMetrics(metrics: InsertSalesMetrics): Promise<SalesMetrics> {
    const [newMetrics] = await db
      .insert(salesMetrics)
      .values({ ...metrics, eventId: metrics.eventId || null })
      .returning();
    return newMetrics;
  }

  async getLatestSalesMetrics(): Promise<SalesMetrics | undefined> {
    const [latest] = await db
      .select()
      .from(salesMetrics)
      .orderBy(desc(salesMetrics.timestamp))
      .limit(1);
    
    if (!latest) return undefined;
    
    // Calculate total sales from all regional sales data
    const regionalSales = await db.select().from(regionalSalesData);
    const totalRegionalSales = regionalSales.reduce((sum, region) => {
      return sum + (parseFloat(region.revenue) || 0);
    }, 0);
    
    // Add online sales estimate (typically 15-20% of total retail)
    const onlineSalesEstimate = totalRegionalSales * 0.18;
    const calculatedTotal = totalRegionalSales + onlineSalesEstimate;
    
    // Return metrics with calculated total sales
    return {
      ...latest,
      totalSales: calculatedTotal.toFixed(2)
    };
  }

  async getProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values({ 
        ...product, 
        size: product.size || null,
        description: product.description || null 
      })
      .returning();
    return newProduct;
  }

  async getInventory(): Promise<(Inventory & { product: Product; store: Store })[]> {
    const result = await db
      .select()
      .from(inventory)
      .leftJoin(products, eq(inventory.productId, products.id))
      .leftJoin(stores, eq(inventory.storeId, stores.id));
    
    return result.map(row => ({
      ...row.inventory,
      product: row.products!,
      store: row.stores!
    }));
  }

  async getInventoryByRegion(region: string): Promise<(Inventory & { product: Product; store: Store })[]> {
    const result = await db
      .select()
      .from(inventory)
      .leftJoin(products, eq(inventory.productId, products.id))
      .leftJoin(stores, eq(inventory.storeId, stores.id))
      .where(eq(stores.region, region));
    
    return result.map(row => ({
      ...row.inventory,
      product: row.products!,
      store: row.stores!
    }));
  }

  async getLowStockItems(): Promise<(Inventory & { product: Product; store: Store })[]> {
    const result = await db
      .select()
      .from(inventory)
      .leftJoin(products, eq(inventory.productId, products.id))
      .leftJoin(stores, eq(inventory.storeId, stores.id))
      .where(lt(inventory.currentStock, 50)); // Consider items with less than 50 as low stock
    
    return result.map(row => ({
      ...row.inventory,
      product: row.products!,
      store: row.stores!
    }));
  }

  async updateInventory(id: number, inventoryUpdate: Partial<InsertInventory>): Promise<Inventory | undefined> {
    const [updated] = await db
      .update(inventory)
      .set(inventoryUpdate)
      .where(eq(inventory.id, id))
      .returning();
    return updated || undefined;
  }

  async getStores(): Promise<Store[]> {
    return await db.select().from(stores);
  }

  async getStore(id: number): Promise<Store | undefined> {
    const [store] = await db.select().from(stores).where(eq(stores.id, id));
    return store || undefined;
  }

  async getStoresByRegion(region: string): Promise<Store[]> {
    return await db.select().from(stores).where(eq(stores.region, region));
  }

  async getIncidents(): Promise<Incident[]> {
    return await db.select().from(incidents);
  }

  async getActiveIncidents(): Promise<Incident[]> {
    return await db.select().from(incidents).where(eq(incidents.status, "open"));
  }

  async createIncident(incident: InsertIncident): Promise<Incident> {
    const [newIncident] = await db
      .insert(incidents)
      .values({ 
        ...incident, 
        status: incident.status || "open",
        assignedTeam: incident.assignedTeam || null,
        impact: incident.impact || null,
        eta: incident.eta || null
      })
      .returning();
    return newIncident;
  }

  async updateIncident(id: number, incident: Partial<InsertIncident>): Promise<Incident | undefined> {
    const [updated] = await db
      .update(incidents)
      .set(incident)
      .where(eq(incidents.id, id))
      .returning();
    return updated || undefined;
  }

  async getSystemComponents(): Promise<SystemComponent[]> {
    return await db.select().from(systemComponents);
  }

  async updateSystemComponent(id: number, status: string, responseTime?: number): Promise<SystemComponent | undefined> {
    const [updated] = await db
      .update(systemComponents)
      .set({ 
        status, 
        responseTime: responseTime || null,
        lastCheck: new Date()
      })
      .where(eq(systemComponents.id, id))
      .returning();
    return updated || undefined;
  }

  // New methods for data field configurations
  async getDataFieldConfigs(eventId?: number): Promise<DataFieldConfig[]> {
    if (eventId) {
      return await db.select().from(dataFieldConfigs).where(eq(dataFieldConfigs.eventId, eventId));
    }
    return await db.select().from(dataFieldConfigs);
  }

  async createDataFieldConfig(config: InsertDataFieldConfig): Promise<DataFieldConfig> {
    const [newConfig] = await db
      .insert(dataFieldConfigs)
      .values(config)
      .returning();
    return newConfig;
  }

  async updateDataFieldConfig(id: number, config: Partial<InsertDataFieldConfig>): Promise<DataFieldConfig | undefined> {
    const [updated] = await db
      .update(dataFieldConfigs)
      .set(config)
      .where(eq(dataFieldConfigs.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteDataFieldConfig(id: number): Promise<void> {
    await db.delete(dataFieldConfigs).where(eq(dataFieldConfigs.id, id));
  }

  // New methods for signal dependencies
  async getSignalDependencies(eventId?: number): Promise<SignalDependency[]> {
    if (eventId) {
      return await db.select().from(signalDependencies).where(eq(signalDependencies.eventId, eventId));
    }
    return await db.select().from(signalDependencies);
  }

  async createSignalDependency(dependency: InsertSignalDependency): Promise<SignalDependency> {
    const [newDependency] = await db
      .insert(signalDependencies)
      .values(dependency)
      .returning();
    return newDependency;
  }

  async deleteSignalDependency(id: number): Promise<void> {
    await db.delete(signalDependencies).where(eq(signalDependencies.id, id));
  }

  async getWarRoomParticipants(incidentId: number): Promise<WarRoomParticipant[]> {
    return await db.select().from(warRoomParticipants).where(eq(warRoomParticipants.incidentId, incidentId));
  }

  async createWarRoomParticipant(participant: InsertWarRoomParticipant): Promise<WarRoomParticipant> {
    const [newParticipant] = await db.insert(warRoomParticipants).values(participant).returning();
    return newParticipant;
  }

  async getIncidentResolutionPaths(incidentId: number): Promise<IncidentResolutionPath[]> {
    return await db.select().from(incidentResolutionPaths)
      .where(eq(incidentResolutionPaths.incidentId, incidentId))
      .orderBy(incidentResolutionPaths.priority);
  }

  async createIncidentResolutionPath(path: InsertIncidentResolutionPath): Promise<IncidentResolutionPath> {
    const [newPath] = await db.insert(incidentResolutionPaths).values(path).returning();
    return newPath;
  }

  // Hourly Sales Data methods
  async getHourlySalesData(eventId?: number): Promise<HourlySalesData[]> {
    if (eventId) {
      return await db.select().from(hourlySalesData).where(eq(hourlySalesData.eventId, eventId));
    }
    return await db.select().from(hourlySalesData).orderBy(hourlySalesData.date, hourlySalesData.hour);
  }

  async createHourlySalesData(data: InsertHourlySalesData): Promise<HourlySalesData> {
    const [newData] = await db.insert(hourlySalesData).values(data).returning();
    return newData;
  }

  // Product Performance methods
  async getProductPerformance(eventId?: number): Promise<ProductPerformance[]> {
    if (eventId) {
      return await db.select().from(productPerformance).where(eq(productPerformance.eventId, eventId));
    }
    return await db.select().from(productPerformance).orderBy(productPerformance.ranking);
  }

  async createProductPerformance(performance: InsertProductPerformance): Promise<ProductPerformance> {
    const [newPerformance] = await db.insert(productPerformance).values(performance).returning();
    return newPerformance;
  }

  // Regional Sales Data methods
  async getRegionalSalesData(eventId?: number): Promise<RegionalSalesData[]> {
    if (eventId) {
      return await db.select().from(regionalSalesData).where(eq(regionalSalesData.eventId, eventId));
    }
    return await db.select().from(regionalSalesData);
  }

  async createRegionalSalesData(data: InsertRegionalSalesData): Promise<RegionalSalesData> {
    const [newData] = await db.insert(regionalSalesData).values(data).returning();
    return newData;
  }

  // Customer Behavior Metrics methods
  async getCustomerBehaviorMetrics(eventId?: number): Promise<CustomerBehaviorMetrics[]> {
    if (eventId) {
      return await db.select().from(customerBehaviorMetrics).where(eq(customerBehaviorMetrics.eventId, eventId));
    }
    return await db.select().from(customerBehaviorMetrics);
  }

  async getLatestCustomerBehaviorMetrics(): Promise<CustomerBehaviorMetrics | undefined> {
    const [latest] = await db.select().from(customerBehaviorMetrics)
      .orderBy(customerBehaviorMetrics.timestamp)
      .limit(1);
    return latest || undefined;
  }

  async createCustomerBehaviorMetrics(metrics: InsertCustomerBehaviorMetrics): Promise<CustomerBehaviorMetrics> {
    const [newMetrics] = await db.insert(customerBehaviorMetrics).values(metrics).returning();
    return newMetrics;
  }

  // Social Mentions methods
  async getSocialMentions(eventId?: number): Promise<SocialMentions[]> {
    if (eventId) {
      return await db.select().from(socialMentions).where(eq(socialMentions.eventId, eventId));
    }
    return await db.select().from(socialMentions);
  }

  async createSocialMentions(mentions: InsertSocialMentions): Promise<SocialMentions> {
    const [newMentions] = await db.insert(socialMentions).values(mentions).returning();
    return newMentions;
  }

  // Market Trends methods
  async getMarketTrends(eventId?: number): Promise<MarketTrends[]> {
    if (eventId) {
      return await db.select().from(marketTrends).where(eq(marketTrends.eventId, eventId));
    }
    return await db.select().from(marketTrends);
  }

  async createMarketTrends(trends: InsertMarketTrends): Promise<MarketTrends> {
    const [newTrends] = await db.insert(marketTrends).values(trends).returning();
    return newTrends;
  }

  // Top Performers methods
  async getTopPerformers(eventId?: number): Promise<TopPerformers[]> {
    if (eventId) {
      return await db.select().from(topPerformers).where(eq(topPerformers.eventId, eventId));
    }
    return await db.select().from(topPerformers).orderBy(topPerformers.ranking);
  }

  async createTopPerformers(performers: InsertTopPerformers): Promise<TopPerformers> {
    const [newPerformers] = await db.insert(topPerformers).values(performers).returning();
    return newPerformers;
  }

  // AI Insights methods
  async getAiInsights(eventId?: number): Promise<AiInsights[]> {
    if (eventId) {
      return await db.select().from(aiInsights).where(eq(aiInsights.eventId, eventId));
    }
    return await db.select().from(aiInsights).orderBy(aiInsights.priority, aiInsights.createdAt);
  }

  async createAiInsights(insights: InsertAiInsights): Promise<AiInsights> {
    const [newInsights] = await db.insert(aiInsights).values(insights).returning();
    return newInsights;
  }

  // Inventory Alerts methods
  async getInventoryAlerts(): Promise<InventoryAlerts[]> {
    return await db.select().from(inventoryAlerts)
      .orderBy(inventoryAlerts.severity, inventoryAlerts.createdAt);
  }

  async createInventoryAlerts(alerts: InsertInventoryAlerts): Promise<InventoryAlerts> {
    const [newAlerts] = await db.insert(inventoryAlerts).values(alerts).returning();
    return newAlerts;
  }
}

export const storage = new DatabaseStorage();
