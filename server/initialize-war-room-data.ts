import { db } from "./db";
import { incidents, warRoomParticipants, incidentResolutionPaths } from "@shared/schema";

export async function initializeWarRoomData() {
  try {
    // Create sample incidents with war room data
    const [paymentIncident] = await db.insert(incidents).values({
      incidentId: "INC-2025-001",
      title: "Payment Gateway Timeout",
      description: "Critical payment processing failures affecting checkout",
      severity: "critical",
      status: "investigating",
      assignedTeam: "Payment Engineering",
      impact: "High revenue impact",
      eta: 15,
      escalationLevel: 3,
      usersAffected: 35500,
      revenueAtRisk: "47000.00",
      currentAction: "Manual Gateway Configuration",
      actionEta: 12,
      actionOwner: "Mike Kumar",
      warRoomActive: true,
      warRoomParticipants: 6
    }).returning();

    const [mobileIncident] = await db.insert(incidents).values({
      incidentId: "INC-2025-002", 
      title: "Mobile App Crashes",
      description: "High crash rate on iOS and Android platforms",
      severity: "high",
      status: "investigating",
      assignedTeam: "Mobile Engineering",
      impact: "User experience degradation",
      eta: 25,
      escalationLevel: 2,
      usersAffected: 12000,
      revenueAtRisk: "8500.00",
      currentAction: "Rolling Back Mobile App",
      actionEta: 7,
      actionOwner: "Deployment Monitor AI",
      warRoomActive: true,
      warRoomParticipants: 4
    }).returning();

    // Payment incident war room participants
    await db.insert(warRoomParticipants).values([
      {
        incidentId: paymentIncident.id,
        participantType: "ai",
        name: "Payment Analyzer AI",
        role: "Transaction Pattern Analysis",
        status: "active",
        description: "Analyzing 15K transactions/sec for timeout patterns",
        etaMinutes: 2,
        badgeColor: "purple"
      },
      {
        incidentId: paymentIncident.id,
        participantType: "ai", 
        name: "Capacity Predictor AI",
        role: "Resource Forecasting",
        status: "standby",
        description: "Scaling recommendations ready",
        etaMinutes: null,
        badgeColor: "blue"
      },
      {
        incidentId: paymentIncident.id,
        participantType: "human",
        name: "Sarah Chen",
        role: "Chief Technology Officer",
        status: "active",
        description: "Coordinating with payment vendor CEO",
        etaMinutes: 8,
        badgeColor: "red"
      },
      {
        incidentId: paymentIncident.id,
        participantType: "human",
        name: "Mike Kumar", 
        role: "Sr. Payment Engineer",
        status: "active",
        description: "Manual gateway config adjustment",
        etaMinutes: 15,
        badgeColor: "orange"
      },
      {
        incidentId: paymentIncident.id,
        participantType: "human",
        name: "Rachel Johnson",
        role: "DevOps Lead",
        status: "active", 
        description: "Monitoring infrastructure health",
        etaMinutes: null,
        badgeColor: "green"
      },
      {
        incidentId: paymentIncident.id,
        participantType: "human",
        name: "David Lee",
        role: "Customer Support Lead",
        status: "active",
        description: "Managing customer communications",
        etaMinutes: null,
        badgeColor: "blue"
      }
    ]);

    // Mobile incident war room participants
    await db.insert(warRoomParticipants).values([
      {
        incidentId: mobileIncident.id,
        participantType: "ai",
        name: "Crash Analytics AI",
        role: "Error Pattern Detection", 
        status: "completed",
        description: "Identified memory leak in checkout module - auto-rollback triggered",
        etaMinutes: null,
        badgeColor: "green"
      },
      {
        incidentId: mobileIncident.id,
        participantType: "ai",
        name: "Deployment Monitor AI",
        role: "Rollback Orchestration",
        status: "active",
        description: "75% devices updated to v2.1.2 stable",
        etaMinutes: 10,
        badgeColor: "orange"
      },
      {
        incidentId: mobileIncident.id,
        participantType: "human",
        name: "Alex Rodriguez",
        role: "Engineering Manager",
        status: "active",
        description: "Monitoring rollback metrics & crash rates",
        etaMinutes: 5,
        badgeColor: "orange"
      },
      {
        incidentId: mobileIncident.id,
        participantType: "human",
        name: "Jessica Wang",
        role: "Sr. Mobile Developer",
        status: "active",
        description: "Preparing hotfix for edge cases",
        etaMinutes: 20,
        badgeColor: "blue"
      }
    ]);

    // Payment incident resolution paths
    await db.insert(incidentResolutionPaths).values([
      {
        incidentId: paymentIncident.id,
        pathName: "Path A",
        pathType: "current",
        description: "Manual config adjustment + backup gateway",
        successRate: 85,
        timeEstimate: "12 min",
        tradeoffs: "Current approach",
        priority: 1
      },
      {
        incidentId: paymentIncident.id,
        pathName: "Path B", 
        pathType: "fallback",
        description: "Full payment service restart",
        successRate: 95,
        timeEstimate: "30 min",
        tradeoffs: "30min downtime",
        priority: 2
      },
      {
        incidentId: paymentIncident.id,
        pathName: "Path C",
        pathType: "nuclear",
        description: "Switch to backup payment provider",
        successRate: 99,
        timeEstimate: "2 hr",
        tradeoffs: "2hr setup",
        priority: 3
      }
    ]);

    // Mobile incident resolution paths
    await db.insert(incidentResolutionPaths).values([
      {
        incidentId: mobileIncident.id,
        pathName: "Path A",
        pathType: "current",
        description: "Automated rollback to v2.1.2",
        successRate: 90,
        timeEstimate: "7 min",
        tradeoffs: "Current approach",
        priority: 1
      },
      {
        incidentId: mobileIncident.id,
        pathName: "Path B",
        pathType: "fallback", 
        description: "Manual hotfix deployment",
        successRate: 95,
        timeEstimate: "45 min",
        tradeoffs: "Manual intervention",
        priority: 2
      },
      {
        incidentId: mobileIncident.id,
        pathName: "Path C",
        pathType: "nuclear",
        description: "Rollback to v2.0.8 LTS",
        successRate: 99,
        timeEstimate: "15 min",
        tradeoffs: "Loss of features",
        priority: 3
      }
    ]);

    console.log("War room data initialized successfully");
  } catch (error) {
    console.error("Error initializing war room data:", error);
  }
}