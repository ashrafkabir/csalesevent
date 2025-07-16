import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSalesEventSchema, insertSalesMetricsSchema, insertIncidentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Sales Events routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getSalesEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sales events" });
    }
  });

  app.post("/api/events", async (req, res) => {
    try {
      const eventData = insertSalesEventSchema.parse(req.body);
      const event = await storage.createSalesEvent(eventData);
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const eventData = insertSalesEventSchema.partial().parse(req.body);
      const event = await storage.updateSalesEvent(id, eventData);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      res.status(400).json({ message: "Invalid event data" });
    }
  });

  // Sales Metrics routes
  app.get("/api/metrics", async (req, res) => {
    try {
      const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
      const metrics = await storage.getSalesMetrics(eventId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  app.get("/api/metrics/latest", async (req, res) => {
    try {
      const metrics = await storage.getLatestSalesMetrics();
      res.json(metrics || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest metrics" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Inventory routes
  app.get("/api/inventory", async (req, res) => {
    try {
      const region = req.query.region as string;
      const inventory = region 
        ? await storage.getInventoryByRegion(region)
        : await storage.getInventory();
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory" });
    }
  });

  app.get("/api/inventory/low-stock", async (req, res) => {
    try {
      const lowStock = await storage.getLowStockItems();
      res.json(lowStock);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch low stock items" });
    }
  });

  // Stores routes
  app.get("/api/stores", async (req, res) => {
    try {
      const region = req.query.region as string;
      const stores = region 
        ? await storage.getStoresByRegion(region)
        : await storage.getStores();
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });

  // Incidents routes
  app.get("/api/incidents", async (req, res) => {
    try {
      const activeOnly = req.query.active === 'true';
      const incidents = activeOnly 
        ? await storage.getActiveIncidents()
        : await storage.getIncidents();
      res.json(incidents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch incidents" });
    }
  });

  app.post("/api/incidents", async (req, res) => {
    try {
      const incidentData = insertIncidentSchema.parse(req.body);
      const incident = await storage.createIncident(incidentData);
      res.json(incident);
    } catch (error) {
      res.status(400).json({ message: "Invalid incident data" });
    }
  });

  app.put("/api/incidents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const incidentData = insertIncidentSchema.partial().parse(req.body);
      const incident = await storage.updateIncident(id, incidentData);
      if (!incident) {
        return res.status(404).json({ message: "Incident not found" });
      }
      res.json(incident);
    } catch (error) {
      res.status(400).json({ message: "Invalid incident data" });
    }
  });

  // System Components routes
  app.get("/api/system/components", async (req, res) => {
    try {
      const components = await storage.getSystemComponents();
      res.json(components);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch system components" });
    }
  });

  app.put("/api/system/components/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, responseTime } = req.body;
      const component = await storage.updateSystemComponent(id, status, responseTime);
      if (!component) {
        return res.status(404).json({ message: "Component not found" });
      }
      res.json(component);
    } catch (error) {
      res.status(400).json({ message: "Invalid component data" });
    }
  });

  // Data Field Configuration routes
  app.get("/api/field-configs", async (req, res) => {
    try {
      const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
      const configs = await storage.getDataFieldConfigs(eventId);
      res.json(configs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch field configurations" });
    }
  });

  app.post("/api/field-configs", async (req, res) => {
    try {
      const config = await storage.createDataFieldConfig(req.body);
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to create field configuration" });
    }
  });

  app.put("/api/field-configs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const config = await storage.updateDataFieldConfig(id, req.body);
      if (!config) {
        return res.status(404).json({ message: "Field configuration not found" });
      }
      res.json(config);
    } catch (error) {
      res.status(500).json({ message: "Failed to update field configuration" });
    }
  });

  app.delete("/api/field-configs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteDataFieldConfig(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete field configuration" });
    }
  });

  // Signal Dependencies routes
  app.get("/api/signal-dependencies", async (req, res) => {
    try {
      const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
      const dependencies = await storage.getSignalDependencies(eventId);
      res.json(dependencies);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch signal dependencies" });
    }
  });

  app.post("/api/signal-dependencies", async (req, res) => {
    try {
      const dependency = await storage.createSignalDependency(req.body);
      res.json(dependency);
    } catch (error) {
      res.status(500).json({ message: "Failed to create signal dependency" });
    }
  });

  app.delete("/api/signal-dependencies/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSignalDependency(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete signal dependency" });
    }
  });

  // Hourly Sales Data routes
  app.get("/api/hourly-sales", async (req, res) => {
    try {
      const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
      const data = await storage.getHourlySalesData(eventId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hourly sales data" });
    }
  });

  // Product Performance routes
  app.get("/api/product-performance", async (req, res) => {
    try {
      const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
      const performance = await storage.getProductPerformance(eventId);
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product performance" });
    }
  });

  // Regional Sales Data routes
  app.get("/api/regional-sales", async (req, res) => {
    try {
      const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
      const data = await storage.getRegionalSalesData(eventId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch regional sales data" });
    }
  });

  // Store Metrics routes (calculated from regional data)
  app.get("/api/store-metrics", async (req, res) => {
    try {
      const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
      const regionalData = await storage.getRegionalSalesData(eventId);
      
      const totalStores = regionalData.reduce((sum, region) => {
        return sum + (region.storeCount || 0);
      }, 0);
      
      const activeStores = Math.floor(totalStores * 0.95); // Assume 95% active rate
      
      res.json({
        totalStores,
        activeStores,
        inactiveStores: totalStores - activeStores,
        regions: regionalData.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch store metrics" });
    }
  });

  // Customer Behavior Metrics routes
  app.get("/api/customer-behavior", async (req, res) => {
    try {
      const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
      const metrics = await storage.getCustomerBehaviorMetrics(eventId);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer behavior metrics" });
    }
  });

  app.get("/api/customer-behavior/latest", async (req, res) => {
    try {
      const metrics = await storage.getLatestCustomerBehaviorMetrics();
      res.json(metrics || {});
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest customer behavior metrics" });
    }
  });

  // Social Mentions routes
  app.get("/api/social-mentions", async (req, res) => {
    try {
      const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
      const mentions = await storage.getSocialMentions(eventId);
      res.json(mentions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social mentions" });
    }
  });

  // Market Trends routes
  app.get("/api/market-trends", async (req, res) => {
    try {
      const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
      const trends = await storage.getMarketTrends(eventId);
      res.json(trends);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market trends" });
    }
  });

  // Top Performers routes
  app.get("/api/top-performers", async (req, res) => {
    try {
      const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
      const performers = await storage.getTopPerformers(eventId);
      res.json(performers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top performers" });
    }
  });

  // AI Insights routes
  app.get("/api/ai-insights", async (req, res) => {
    try {
      const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
      const insights = await storage.getAiInsights(eventId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch AI insights" });
    }
  });

  // Inventory Alerts routes
  app.get("/api/inventory-alerts", async (req, res) => {
    try {
      const alerts = await storage.getInventoryAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inventory alerts" });
    }
  });

  // Real-time data simulation endpoint
  app.get("/api/live/metrics", async (req, res) => {
    try {
      const metrics = await storage.getLatestSalesMetrics();
      if (metrics) {
        // Simulate real-time fluctuations
        const fluctuation = (Math.random() - 0.5) * 0.1; // ±5% fluctuation
        const liveMetrics = {
          ...metrics,
          totalSales: (parseFloat(metrics.totalSales) * (1 + fluctuation)).toFixed(2),
          activeCustomers: Math.floor(metrics.activeCustomers * (1 + fluctuation * 0.5)),
          timestamp: new Date(),
        };
        res.json(liveMetrics);
      } else {
        res.json({});
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch live metrics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
