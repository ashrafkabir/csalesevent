import { db } from "./db";
import {
  salesEvents, salesMetrics, products, inventory, stores, incidents, systemComponents
} from "@shared/schema";

export async function initializeDatabase() {
  try {
    // Check if data already exists
    const existingEvents = await db.select().from(salesEvents).limit(1);
    if (existingEvents.length > 0) {
      console.log("Database already initialized");
      return;
    }

    // Create sample sales event
    const [sampleEvent] = await db.insert(salesEvents).values({
      name: "Black Friday 2024",
      startDate: new Date("2024-11-29"),
      endDate: new Date("2024-12-02"),
      targetRevenue: "2500000",
      status: "active",
      signalConfig: JSON.stringify({
        bundles: ["sales", "market", "customer", "inventory"],
        updateFrequency: "realtime"
      })
    }).returning();

    // Create sample products
    const sampleProducts = [
      {
        name: "Premium Memory Foam",
        category: "Memory Foam",
        price: "1299.99",
        sku: "PMF-001",
        size: "Queen",
        description: "Premium memory foam mattress with cooling gel"
      },
      {
        name: "Hybrid Comfort",
        category: "Hybrid",
        price: "899.99",
        sku: "HC-002",
        size: "King",
        description: "Hybrid spring and foam construction"
      },
      {
        name: "Natural Latex",
        category: "Latex",
        price: "1599.99",
        sku: "NL-003",
        size: "Queen",
        description: "100% natural latex mattress"
      }
    ];

    const insertedProducts = await db.insert(products).values(sampleProducts).returning();

    // Create sample stores
    const sampleStores = [
      {
        name: "West Coast Region",
        region: "West Coast",
        address: "Los Angeles, CA",
        status: "active",
        storeCount: 15
      },
      {
        name: "East Coast Region", 
        region: "East Coast",
        address: "New York, NY",
        status: "active",
        storeCount: 12
      },
      {
        name: "Midwest Region",
        region: "Midwest", 
        address: "Chicago, IL",
        status: "active",
        storeCount: 8
      }
    ];

    const insertedStores = await db.insert(stores).values(sampleStores).returning();

    // Create sample inventory
    const sampleInventory = [];
    for (const product of insertedProducts) {
      for (const store of insertedStores) {
        const currentStock = Math.floor(Math.random() * 100) + 10;
        sampleInventory.push({
          productId: product.id,
          storeId: store.id,
          region: store.region,
          currentStock: currentStock,
          minThreshold: 20,
          lastUpdated: new Date()
        });
      }
    }

    await db.insert(inventory).values(sampleInventory);

    // Create sample sales metrics
    await db.insert(salesMetrics).values({
      eventId: 1,
      timestamp: new Date(),
      totalSales: "125000",
      activeCustomers: 1247,
      avgBasketSize: "425.50",
      conversionRate: "3.2",
      inventoryHealth: "92"
    });

    // Create sample incidents
    const sampleIncidents = [
      {
        incidentId: "INC-2024-001247",
        title: "High latency on payment gateway",
        description: "Payment processing experiencing delays",
        severity: "high",
        status: "investigating",
        assignedTeam: "Platform Team",
        impact: "Payment delays affecting checkout",
        eta: 30
      },
      {
        incidentId: "INC-2024-001248",
        title: "Inventory sync delay",
        description: "West Coast inventory data sync is delayed",
        severity: "medium",
        status: "open",
        assignedTeam: "Data Team",
        impact: "Inventory counts may be outdated",
        eta: 60
      }
    ];

    await db.insert(incidents).values(sampleIncidents);

    // Create sample system components
    const sampleComponents = [
      {
        name: "Web Frontend",
        status: "operational",
        responseTime: 245,
        lastCheck: new Date()
      },
      {
        name: "Payment Gateway",
        status: "degraded",
        responseTime: 890,
        lastCheck: new Date()
      },
      {
        name: "Inventory API",
        status: "operational",
        responseTime: 156,
        lastCheck: new Date()
      },
      {
        name: "Analytics Pipeline",
        status: "operational",
        responseTime: 324,
        lastCheck: new Date()
      }
    ];

    await db.insert(systemComponents).values(sampleComponents);

    console.log("Database initialized with sample data");
  } catch (error) {
    console.error("Failed to initialize database:", error);
  }
}