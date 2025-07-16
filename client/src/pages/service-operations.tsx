import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import IncidentList from "@/components/service/incident-list";
import SystemStatus from "@/components/service/system-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, TrendingUp, Clock, Users, Zap, ArrowRight, Activity, Target, Shield } from "lucide-react";

export default function ServiceOperations() {
  const { data: incidents } = useQuery({ queryKey: ["/api/incidents", { active: true }] });
  const { data: components } = useQuery({ queryKey: ["/api/system/components"] });
  
  const [selectedTile, setSelectedTile] = useState<'incidents' | 'impacts' | 'escalations' | null>(null);
  const [showWarRoom, setShowWarRoom] = useState<'payment' | 'mobile' | null>(null);

  // Enhanced incident data with more entries and meaningful details
  const mockIncidents = [
    {
      id: 1,
      title: "Database Connection Pool Exhaustion",
      description: "Primary database connection pool showing 98% utilization, causing 500ms+ query delays",
      severity: "critical",
      status: "investigating",
      impact: "high",
      assignedTeam: "Database Engineering",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      escalated: true,
      escalationLevel: 2,
      affectedUsers: 15000,
      eta: 45,
      autoRemediation: false,
      category: "Database"
    },
    {
      id: 2,
      title: "CDN Edge Server Latency",
      description: "West Coast edge servers showing increased response times (avg 2.3s vs normal 450ms)",
      severity: "high",
      status: "monitoring",
      impact: "medium",
      assignedTeam: "Infrastructure",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      escalated: false,
      escalationLevel: 1,
      affectedUsers: 3200,
      eta: 120,
      autoRemediation: true,
      category: "Network"
    },
    {
      id: 3,
      title: "Payment Gateway Timeout",
      description: "Stripe API showing 15% timeout rate on checkout transactions during peak hours",
      severity: "critical",
      status: "escalated",
      impact: "high",
      assignedTeam: "Payment Engineering",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      escalated: true,
      escalationLevel: 3,
      affectedUsers: 8500,
      eta: 30,
      autoRemediation: false,
      category: "Payment"
    },
    {
      id: 4,
      title: "Search Index Sync Delay",
      description: "Elasticsearch index showing 45min delay on product updates, affecting search results",
      severity: "medium",
      status: "assigned",
      impact: "low",
      assignedTeam: "Search Team",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      escalated: false,
      escalationLevel: 1,
      affectedUsers: 1200,
      eta: 180,
      autoRemediation: true,
      category: "Application"
    },
    {
      id: 5,
      title: "Mobile App Crash Reports",
      description: "iOS app v2.1.3 showing 8% crash rate on product detail views (vs normal 0.3%)",
      severity: "high",
      status: "investigating",
      impact: "high",
      assignedTeam: "Mobile Engineering",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      escalated: true,
      escalationLevel: 2,
      affectedUsers: 12000,
      eta: 60,
      autoRemediation: false,
      category: "Mobile"
    },
    {
      id: 6,
      title: "Email Service Delivery Delay",
      description: "SendGrid experiencing delays, order confirmations averaging 18min delivery",
      severity: "medium",
      status: "resolved",
      impact: "medium",
      assignedTeam: "Communications",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      escalated: false,
      escalationLevel: 1,
      affectedUsers: 2800,
      eta: null,
      autoRemediation: true,
      category: "Communications"
    },
    {
      id: 7,
      title: "Redis Cache Miss Rate Spike",
      description: "Product cache showing 34% miss rate (normal 8%), increasing page load times",
      severity: "high",
      status: "monitoring",
      impact: "medium",
      assignedTeam: "Performance Team",
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      escalated: false,
      escalationLevel: 1,
      affectedUsers: 5400,
      eta: 90,
      autoRemediation: true,
      category: "Performance"
    },
    {
      id: 8,
      title: "SSL Certificate Renewal Alert",
      description: "*.api.domain.com certificate expires in 72 hours, auto-renewal failed twice",
      severity: "high",
      status: "assigned",
      impact: "low",
      assignedTeam: "DevOps",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      escalated: false,
      escalationLevel: 1,
      affectedUsers: 0,
      eta: 24,
      autoRemediation: false,
      category: "Security"
    },
    {
      id: 9,
      title: "Inventory Sync Service Degradation",
      description: "Real-time inventory updates delayed by 12 minutes, causing oversell risk",
      severity: "medium",
      status: "investigating",
      impact: "medium",
      assignedTeam: "Inventory Team",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      escalated: false,
      escalationLevel: 1,
      affectedUsers: 3800,
      eta: 150,
      autoRemediation: true,
      category: "Business Logic"
    },
    {
      id: 10,
      title: "Login Service Rate Limiting",
      description: "Authentication service triggering rate limits, 12% of login attempts failing",
      severity: "medium",
      status: "monitoring",
      impact: "medium",
      assignedTeam: "Auth Team",
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
      escalated: false,
      escalationLevel: 1,
      affectedUsers: 2100,
      eta: 60,
      autoRemediation: true,
      category: "Authentication"
    },
    {
      id: 11,
      title: "Data Warehouse ETL Pipeline Failure",
      description: "Nightly ETL job failed at 03:47 UTC, analytics dashboard showing stale data",
      severity: "low",
      status: "assigned",
      impact: "low",
      assignedTeam: "Data Engineering",
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      escalated: false,
      escalationLevel: 1,
      affectedUsers: 0,
      eta: 240,
      autoRemediation: false,
      category: "Data Pipeline"
    }
  ];

  const allIncidents = (incidents && (incidents as any[]).length > 0) ? (incidents as any[]) : mockIncidents;
  const activeIncidents = allIncidents.filter((incident: any) => incident.status !== "resolved");
  const highImpactIncidents = allIncidents.filter((incident: any) => incident.impact === "high");
  const escalatedIncidents = allIncidents.filter((incident: any) => incident.escalated);
  const criticalIncidents = allIncidents.filter((incident: any) => incident.severity === "critical");
  
  const systemHealth = components && (components as any[]).length > 0 ? 
    ((components as any[]).filter((c: any) => c.status === "operational").length / (components as any[]).length * 100).toFixed(1) :
    "97.8";

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#1b244d' }}>Service Operations Center</h2>
        <p className="text-gray-500">Monitor incidents, manage escalations, and ensure system reliability</p>
      </div>

      {/* System Health Overview Bar */}
      <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-medium" style={{ color: '#1b244d' }}>System Health: {systemHealth}%</span>
            </div>
            <div className="text-gray-400">|</div>
            <div className="text-gray-600">
              {activeIncidents.length} Active • {highImpactIncidents.length} High Impact • {escalatedIncidents.length} Escalated
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Service Operations Summary Dashboard */}
      <Card className="dashboard-card mb-6">
        <CardHeader>
          <CardTitle className="text-xl font-semibold flex items-center" style={{ color: '#1b244d' }}>
            <Activity className="h-6 w-6 mr-3" style={{ color: '#d63426' }} />
            Service Operations Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-6">
            {/* Overall Health Score */}
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{systemHealth}%</div>
              <div className="text-sm font-medium" style={{ color: '#1b244d' }}>System Health</div>
              <div className="text-xs text-gray-500 mt-1">Last 24h</div>
            </div>

            {/* Active Incidents Summary */}
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-1">{activeIncidents.length}</div>
              <div className="text-sm font-medium" style={{ color: '#1b244d' }}>Active Incidents</div>
              <div className="text-xs text-gray-500 mt-1">
                {criticalIncidents.length} Critical • {allIncidents.filter(i => i.severity === 'high').length} High
              </div>
            </div>

            {/* Resolution Time */}
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">24m</div>
              <div className="text-sm font-medium" style={{ color: '#1b244d' }}>Avg Resolution</div>
              <div className="text-xs text-green-600 mt-1">-15% vs target</div>
            </div>

            {/* Escalation Rate */}
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">{((escalatedIncidents.length / Math.max(allIncidents.length, 1)) * 100).toFixed(1)}%</div>
              <div className="text-sm font-medium" style={{ color: '#1b244d' }}>Escalation Rate</div>
              <div className="text-xs text-gray-500 mt-1">{escalatedIncidents.length} of {allIncidents.length}</div>
            </div>
          </div>

          {/* Service Status Grid */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-6">
              {/* Services Status */}
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#1b244d' }}>Service Components</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Database</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">API Gateway</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Payment Processing</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-yellow-600">Degraded</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">CDN</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#1b244d' }}>Performance Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="text-sm font-medium text-green-600">142ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Uptime</span>
                    <span className="text-sm font-medium text-green-600">99.94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Error Rate</span>
                    <span className="text-sm font-medium text-yellow-600">0.06%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Throughput</span>
                    <span className="text-sm font-medium text-blue-600">2.4k req/min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline View - Incidents → Impacts → Escalations */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Incidents Tile */}
        <Card 
          className="dashboard-card cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-yellow-500"
          onClick={() => setSelectedTile('incidents')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center" style={{ color: '#1b244d' }}>
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              Incident Analytics
              <ArrowRight className="h-4 w-4 ml-auto text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-yellow-600">{allIncidents.length}</div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Total Events</div>
                <div className="text-xs text-green-600">+12% vs yesterday</div>
              </div>
            </div>
            
            {/* Severity Breakdown */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Critical</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(criticalIncidents.length / allIncidents.length) * 100}%` }}></div>
                  </div>
                  <span className="text-sm text-red-600">{criticalIncidents.length}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(allIncidents.filter(i => i.severity === 'high').length / allIncidents.length) * 100}%` }}></div>
                  </div>
                  <span className="text-sm text-orange-600">{allIncidents.filter(i => i.severity === 'high').length}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Medium</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(allIncidents.filter(i => i.severity === 'medium').length / allIncidents.length) * 100}%` }}></div>
                  </div>
                  <span className="text-sm text-yellow-600">{allIncidents.filter(i => i.severity === 'medium').length}</span>
                </div>
              </div>
            </div>

            {/* Key Trends */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Key Trends</div>
              <div className="text-sm text-green-600">↓ Resolution time improving</div>
              <div className="text-sm text-yellow-600">↑ Database incidents trending</div>
            </div>
          </CardContent>
        </Card>

        {/* Impacts Tile */}
        <Card 
          className="dashboard-card cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-red-500"
          onClick={() => setSelectedTile('impacts')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center" style={{ color: '#1b244d' }}>
              <Target className="h-5 w-5 mr-2 text-red-600" />
              Impact Analysis
              <ArrowRight className="h-4 w-4 ml-auto text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-red-600">{highImpactIncidents.length}</div>
              <div className="text-right">
                <div className="text-sm text-gray-500">High Impact</div>
                <div className="text-xs text-red-600">
                  {highImpactIncidents.reduce((sum: number, inc: any) => sum + (inc.affectedUsers || 0), 0).toLocaleString()} users
                </div>
              </div>
            </div>
            
            {/* Impact Areas with Auto-Remediation */}
            <div className="space-y-2">
              <div className="flex justify-between items-center p-3 bg-red-50 border border-red-300 rounded">
                <div>
                  <div className="text-sm font-medium" style={{ color: '#1b244d' }}>Payment Processing</div>
                  <div className="text-xs text-gray-600">15% checkout failures • $47K revenue at risk</div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-red-600 border-red-600 text-xs">CRITICAL</Badge>
                  <div className="text-xs text-gray-500 mt-1">Manual intervention</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-300 rounded">
                <div>
                  <div className="text-sm font-medium" style={{ color: '#1b244d' }}>Mobile App Performance</div>
                  <div className="text-xs text-gray-600">8% crash rate • 12K users affected</div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="text-orange-600 border-orange-600 text-xs">HIGH</Badge>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                    <span className="text-xs text-purple-600 font-medium">AI Auto-rollback enabled</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Auto-Remediation Status */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-2">Auto-Remediation Status</div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CDN Failover</span>
                  <span className="text-green-600">✓ Active</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cache Warming</span>
                  <span className="text-yellow-600">🔄 In Progress</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">DB Scaling</span>
                  <span className="text-red-600">✗ Failed (Manual needed)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Escalations Tile */}
        <Card 
          className="dashboard-card cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-orange-500"
          onClick={() => setSelectedTile('escalations')}
        >
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold flex items-center" style={{ color: '#1b244d' }}>
              <Shield className="h-5 w-5 mr-2 text-orange-600" />
              Escalation Tracking
              <ArrowRight className="h-4 w-4 ml-auto text-gray-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-orange-600">{escalatedIncidents.length}</div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Escalated</div>
                <div className="text-xs text-orange-600">47% auto-escalated</div>
              </div>
            </div>
            
            {/* Detailed Escalation Tracking */}
            <div className="space-y-3">
              {/* Critical Escalation */}
              <div className="p-3 bg-red-50 border border-red-300 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#1b244d' }}>Payment Gateway Timeout</div>
                    <div className="text-xs text-gray-600">Escalated to Level 3 (Executive)</div>
                  </div>
                  <Badge variant="outline" className="text-red-600 border-red-600 text-xs">L3</Badge>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Executive Contact:</span>
                    <span style={{ color: '#1b244d' }}>Sarah Chen (CTO)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response Time:</span>
                    <span className="text-green-600">8 minutes (SLA: 15min)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last Update:</span>
                    <span className="text-yellow-600">12 minutes ago</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">War Room:</span>
                    <button 
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg font-medium text-xs flex items-center space-x-1 transition-colors"
                      onClick={(e) => { e.stopPropagation(); setShowWarRoom('payment'); }}
                    >
                      <Shield className="h-3 w-3" />
                      <span>War Room • 6 participants</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Management Escalation */}
              <div className="p-3 bg-orange-50 border border-orange-300 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#1b244d' }}>Mobile App Crashes</div>
                    <div className="text-xs text-gray-600">Escalated to Level 2 (Management)</div>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-600 text-xs">L2</Badge>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Manager Contact:</span>
                    <span style={{ color: '#1b244d' }}>Alex Rodriguez (Eng. Manager)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response Time:</span>
                    <span className="text-green-600">5 minutes (SLA: 30min)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Auto-Rollback:</span>
                    <span className="text-green-600">Triggered • v2.1.2 deployed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span className="text-yellow-600">Monitoring recovery</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">War Room:</span>
                    <button 
                      className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg font-medium text-xs flex items-center space-x-1 transition-colors"
                      onClick={(e) => { e.stopPropagation(); setShowWarRoom('mobile'); }}
                    >
                      <Shield className="h-3 w-3" />
                      <span>War Room • 4 participants</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Escalation Metrics */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-2">Escalation Performance</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Response:</span>
                  <span className="text-green-600">6.5min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SLA Compliance:</span>
                  <span className="text-green-600">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Auto Escalated:</span>
                  <span className="text-yellow-600">47%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Active:</span>
                  <span className="text-orange-600">{escalatedIncidents.length}</span>
                </div>
              </div>
            </div>


          </CardContent>
        </Card>
      </div>

      {/* Simplified System Status */}
      <div className="grid grid-cols-2 gap-6">
        <SystemStatus components={components as any} />
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center" style={{ color: '#1b244d' }}>
              <Activity className="h-5 w-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allIncidents.slice(0, 6).map((incident: any) => (
              <div key={incident.id} className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    incident.severity === 'critical' ? 'bg-red-500' :
                    incident.severity === 'high' ? 'bg-orange-500' :
                    'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="text-sm" style={{ color: '#1b244d' }}>{incident.title.substring(0, 28)}...</div>
                    <div className="text-xs text-gray-500">{incident.category}</div>
                  </div>
                  {incident.autoRemediation && (
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                      <span className="text-xs text-purple-600 font-medium">AI</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">
                    {Math.floor((Date.now() - new Date(incident.createdAt).getTime()) / (1000 * 60 * 60))}h
                  </span>
                  {incident.escalated && (
                    <div className="text-xs text-orange-600">L{incident.escalationLevel}</div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Modal Views for Each Tile */}
      <Dialog open={selectedTile === 'incidents'} onOpenChange={() => setSelectedTile(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2" style={{ color: '#1b244d' }}>
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <span>Comprehensive Incident Analytics</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{allIncidents.length}</div>
                  <div className="text-sm text-gray-600">Total Incidents</div>
                  <div className="text-xs text-green-600">+12% vs yesterday</div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold" style={{ color: '#d63426' }}>{criticalIncidents.length}</div>
                  <div className="text-sm text-gray-600">Critical Priority</div>
                  <div className="text-xs" style={{ color: '#d63426' }}>Requires immediate attention</div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">14.2min</div>
                  <div className="text-sm text-gray-600">Avg Resolution Time</div>
                  <div className="text-xs text-green-600">↓ 8% improvement</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle style={{ color: '#1b244d' }}>Incident Breakdown by Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#1b244d' }}>Database</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                      <span className="text-sm" style={{ color: '#1b244d' }}>{allIncidents.filter(i => i.category === 'Database').length}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#1b244d' }}>Payment Systems</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                      <span className="text-sm" style={{ color: '#1b244d' }}>{allIncidents.filter(i => i.category === 'Payment').length}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#1b244d' }}>Mobile/Performance</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '27%' }}></div>
                      </div>
                      <span className="text-sm" style={{ color: '#1b244d' }}>{allIncidents.filter(i => i.category === 'Mobile' || i.category === 'Performance').length}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#1b244d' }}>Network/Infrastructure</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '36%' }}></div>
                      </div>
                      <span className="text-sm" style={{ color: '#1b244d' }}>{allIncidents.filter(i => i.category === 'Network' || i.category === 'Security' || i.category === 'Communications' || i.category === 'Authentication').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle style={{ color: '#1b244d' }}>Trending Issues</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-red-50 border border-red-200 rounded">
                    <span className="text-sm" style={{ color: '#1b244d' }}>Database connection timeouts</span>
                    <Badge variant="outline" className="text-red-600 border-red-600">Critical</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-orange-50 border border-orange-200 rounded">
                    <span className="text-sm" style={{ color: '#1b244d' }}>Mobile app performance</span>
                    <Badge variant="outline" className="text-orange-600 border-orange-600">High</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <span className="text-sm" style={{ color: '#1b244d' }}>Email delivery delays</span>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">Medium</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle style={{ color: '#1b244d' }}>Detailed Incident List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allIncidents.map((incident: any) => (
                    <div key={incident.id} className={`p-4 rounded-lg border ${
                      incident.severity === 'critical' ? 'bg-red-50 border-red-300' :
                      incident.severity === 'high' ? 'bg-orange-50 border-orange-300' :
                      'bg-gray-50 border-gray-300'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold" style={{ color: '#1b244d' }}>{incident.title}</h4>
                            <Badge variant="outline" className={`text-xs ${
                              incident.severity === 'critical' ? 'text-red-600 border-red-600' :
                              incident.severity === 'high' ? 'text-orange-600 border-orange-600' :
                              'text-yellow-600 border-yellow-600'
                            }`}>
                              {incident.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-gray-600 border-gray-600 text-xs">
                              {incident.category}
                            </Badge>
                            {incident.autoRemediation && (
                              <Badge variant="outline" className="text-purple-600 border-purple-600 text-xs flex items-center">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                                AI AUTO-REMEDIATION
                              </Badge>
                            )}
                            {incident.escalated && (
                              <Badge variant="outline" className="text-orange-600 border-orange-600 text-xs">
                                ESCALATED L{incident.escalationLevel}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{incident.assignedTeam}</span>
                            <span>{incident.affectedUsers?.toLocaleString()} users affected</span>
                            <span>{incident.eta ? `ETA: ${incident.eta}min` : 'No ETA'}</span>
                            <span>{Math.floor((Date.now() - new Date(incident.createdAt).getTime()) / (1000 * 60 * 60))}h ago</span>
                          </div>
                        </div>
                        <Badge variant="outline" className={`${
                          incident.status === 'resolved' ? 'text-green-600 border-green-600' :
                          incident.status === 'escalated' ? 'text-orange-600 border-orange-600' :
                          'text-yellow-600 border-yellow-600'
                        }`}>
                          {incident.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedTile === 'impacts'} onOpenChange={() => setSelectedTile(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2" style={{ color: '#1b244d' }}>
              <Target className="h-5 w-5" style={{ color: '#d63426' }} />
              <span>Business Impact Analysis</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold" style={{ color: '#d63426' }}>{highImpactIncidents.length}</div>
                  <div className="text-sm text-gray-600">High Impact Incidents</div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {highImpactIncidents.reduce((sum: number, inc: any) => sum + (inc.affectedUsers || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Users Affected</div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold" style={{ color: '#d63426' }}>$47K</div>
                  <div className="text-sm text-gray-600">Revenue at Risk</div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">18%</div>
                  <div className="text-sm text-gray-600">Conversion Drop</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle style={{ color: '#1b244d' }}>Impact by Business Area</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 border border-red-300 rounded">
                    <div>
                      <div className="font-semibold" style={{ color: '#1b244d' }}>Sales Experience</div>
                      <div className="text-sm text-gray-600">Checkout flow disrupted</div>
                    </div>
                    <Badge variant="outline" className="text-red-600 border-red-600">CRITICAL</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 border border-orange-300 rounded">
                    <div>
                      <div className="font-semibold" style={{ color: '#1b244d' }}>Customer Service</div>
                      <div className="text-sm text-gray-600">Response time degraded</div>
                    </div>
                    <Badge variant="outline" className="text-orange-600 border-orange-600">HIGH</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 border border-yellow-300 rounded">
                    <div>
                      <div className="font-semibold" style={{ color: '#1b244d' }}>Marketing Ops</div>
                      <div className="text-sm text-gray-600">Email campaigns delayed</div>
                    </div>
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">MEDIUM</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle style={{ color: '#1b244d' }}>Regional Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                    <div>
                      <div className="font-semibold" style={{ color: '#1b244d' }}>West Coast</div>
                      <div className="text-sm text-gray-600">15,000 users affected</div>
                    </div>
                    <div className="text-red-600 font-bold">68%</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                    <div>
                      <div className="font-semibold" style={{ color: '#1b244d' }}>East Coast</div>
                      <div className="text-sm text-gray-600">8,500 users affected</div>
                    </div>
                    <div className="text-orange-600 font-bold">24%</div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                    <div>
                      <div className="font-semibold" style={{ color: '#1b244d' }}>Central Region</div>
                      <div className="text-sm text-gray-600">3,200 users affected</div>
                    </div>
                    <div className="text-yellow-600 font-bold">8%</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white border border-gray-200">
              <CardHeader>
                <CardTitle style={{ color: '#1b244d' }}>Customer Segment Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-red-50 border border-red-300 rounded">
                    <div className="text-2xl font-bold text-red-600">12K</div>
                    <div className="text-sm text-gray-600">Premium Customers</div>
                    <div className="text-xs text-red-600">High revenue impact</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 border border-orange-300 rounded">
                    <div className="text-2xl font-bold text-orange-600">8.5K</div>
                    <div className="text-sm text-gray-600">Standard Customers</div>
                    <div className="text-xs text-orange-600">Medium impact</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 border border-yellow-300 rounded">
                    <div className="text-2xl font-bold text-yellow-600">15K</div>
                    <div className="text-sm text-gray-600">New Visitors</div>
                    <div className="text-xs text-yellow-600">Conversion risk</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={selectedTile === 'escalations'} onOpenChange={() => setSelectedTile(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2" style={{ color: '#1b244d' }}>
              <Shield className="h-5 w-5 text-orange-600" />
              <span>Escalation Management & Tracking</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">{escalatedIncidents.length}</div>
                  <div className="text-sm text-gray-600">Active Escalations</div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold" style={{ color: '#d63426' }}>
                    {escalatedIncidents.filter(i => i.escalationLevel === 3).length}
                  </div>
                  <div className="text-sm text-gray-600">Executive Level</div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">23min</div>
                  <div className="text-sm text-gray-600">Avg Escalation Time</div>
                </CardContent>
              </Card>
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">47%</div>
                  <div className="text-sm text-gray-600">Auto-escalated</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle style={{ color: '#1b244d' }}>Escalation Levels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {escalatedIncidents.map((incident: any) => (
                    <div key={incident.id} className={`p-4 rounded-lg border ${
                      incident.escalationLevel === 3 ? 'bg-red-50 border-red-300' :
                      incident.escalationLevel === 2 ? 'bg-orange-50 border-orange-300' :
                      'bg-yellow-50 border-yellow-300'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold" style={{ color: '#1b244d' }}>{incident.title}</h4>
                            <Badge variant="outline" className={`text-xs ${
                              incident.escalationLevel === 3 ? 'text-red-600 border-red-600' :
                              incident.escalationLevel === 2 ? 'text-orange-600 border-orange-600' :
                              'text-yellow-600 border-yellow-600'
                            }`}>
                              LEVEL {incident.escalationLevel}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            Escalated {Math.floor((Date.now() - new Date(incident.createdAt).getTime()) / (1000 * 60 * 60))}h ago
                          </div>
                          <div className="text-xs text-gray-500">
                            Assigned to: {incident.assignedTeam}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-orange-600">
                            ETA: {incident.eta ? `${incident.eta}min` : 'TBD'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardHeader>
                  <CardTitle style={{ color: '#1b244d' }}>Escalation Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded">
                      <div className="text-xl font-bold text-green-600">89%</div>
                      <div className="text-xs text-gray-500">Resolution rate within SLA</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded">
                      <div className="text-xl font-bold text-yellow-600">2.3h</div>
                      <div className="text-xs text-gray-500">Avg time to escalate</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded">
                      <div className="text-xl font-bold text-orange-600">12</div>
                      <div className="text-xs text-gray-500">Escalations this week</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded">
                      <div className="text-xl font-bold text-purple-600">85%</div>
                      <div className="text-xs text-gray-500">Executive response rate</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm" style={{ color: '#1b244d' }}>Priority Queue</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-red-50 border border-red-200 rounded">
                        <span className="text-sm" style={{ color: '#1b244d' }}>Payment Gateway Timeout</span>
                        <Badge variant="outline" className="text-red-600 border-red-600 text-xs">URGENT</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-orange-50 border border-orange-200 rounded">
                        <span className="text-sm" style={{ color: '#1b244d' }}>Database Connection Pool</span>
                        <Badge variant="outline" className="text-orange-600 border-orange-600 text-xs">HIGH</Badge>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <span className="text-sm" style={{ color: '#1b244d' }}>Mobile App Crashes</span>
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-xs">MEDIUM</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* War Room Modal - Detailed Escalation Breakdown */}
      <Dialog open={showWarRoom !== null} onOpenChange={() => setShowWarRoom(null)}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3" style={{ color: '#1b244d' }}>
              <Shield className="h-6 w-6" style={{ color: '#d63426' }} />
              <div>
                {showWarRoom === 'payment' ? (
                  <>
                    <div className="text-xl font-bold">Payment Gateway Timeout - War Room</div>
                    <div className="text-sm font-normal text-gray-600">L3 Executive Escalation • 6 participants • Sarah Chen (CTO) leading</div>
                  </>
                ) : (
                  <>
                    <div className="text-xl font-bold">Mobile App Crashes - War Room</div>
                    <div className="text-sm font-normal text-gray-600">L2 Management Escalation • 4 participants • Alex Rodriguez (Eng. Manager) leading</div>
                  </>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Critical Incident Overview */}
          <div className={`${showWarRoom === 'payment' ? 'bg-red-50 border-red-300' : 'bg-orange-50 border-orange-300'} border rounded-lg p-4 mb-6`}>
            <div className="grid grid-cols-4 gap-4">
              {showWarRoom === 'payment' ? (
                <>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">35,500</div>
                    <div className="text-sm font-medium" style={{ color: '#1b244d' }}>Users Affected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">$47K</div>
                    <div className="text-sm font-medium" style={{ color: '#1b244d' }}>Revenue at Risk</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">15%</div>
                    <div className="text-sm font-medium" style={{ color: '#1b244d' }}>Checkout Failures</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">L3</div>
                    <div className="text-sm font-medium" style={{ color: '#1b244d' }}>Executive Level</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">12,000</div>
                    <div className="text-sm font-medium" style={{ color: '#1b244d' }}>Users Affected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">8%</div>
                    <div className="text-sm font-medium" style={{ color: '#1b244d' }}>Crash Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">iOS & Android</div>
                    <div className="text-sm font-medium" style={{ color: '#1b244d' }}>Platforms</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">L2</div>
                    <div className="text-sm font-medium" style={{ color: '#1b244d' }}>Management Level</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Current Status & Possible Paths */}
          <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <div>
                  <div className="font-semibold text-blue-800">
                    {showWarRoom === 'payment' ? 'ACTIVE: Manual Gateway Configuration' : 'ACTIVE: Rolling Back Mobile App'}
                  </div>
                  <div className="text-sm text-blue-600">
                    {showWarRoom === 'payment' ? 'Mike Kumar adjusting timeout thresholds' : 'Deployment Monitor AI pushing v2.1.2 stable'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-800">
                  {showWarRoom === 'payment' ? '12 min' : '7 min'}
                </div>
                <div className="text-sm text-blue-600">ETA to Complete</div>
              </div>
            </div>
            
            <div className="border-t border-blue-200 pt-3">
              <div className="text-sm font-medium text-blue-800 mb-2">Possible Resolution Paths:</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {showWarRoom === 'payment' ? (
                  <>
                    <div className="bg-white border border-blue-200 rounded p-2">
                      <div className="font-medium text-green-600 text-xs">Path A (Current)</div>
                      <div className="text-xs text-gray-700">Manual config adjustment + backup gateway</div>
                      <div className="text-xs text-blue-600 mt-1">85% success rate</div>
                    </div>
                    <div className="bg-white border border-blue-200 rounded p-2">
                      <div className="font-medium text-orange-600 text-xs">Path B (Fallback)</div>
                      <div className="text-xs text-gray-700">Full payment service restart</div>
                      <div className="text-xs text-blue-600 mt-1">95% success, 30min downtime</div>
                    </div>
                    <div className="bg-white border border-blue-200 rounded p-2">
                      <div className="font-medium text-red-600 text-xs">Path C (Nuclear)</div>
                      <div className="text-xs text-gray-700">Switch to backup payment provider</div>
                      <div className="text-xs text-blue-600 mt-1">99% success, 2hr setup</div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white border border-blue-200 rounded p-2">
                      <div className="font-medium text-green-600 text-xs">Path A (Current)</div>
                      <div className="text-xs text-gray-700">Automated rollback to v2.1.2</div>
                      <div className="text-xs text-blue-600 mt-1">90% success rate</div>
                    </div>
                    <div className="bg-white border border-blue-200 rounded p-2">
                      <div className="font-medium text-orange-600 text-xs">Path B (Manual)</div>
                      <div className="text-xs text-gray-700">Manual hotfix deployment</div>
                      <div className="text-xs text-blue-600 mt-1">95% success, 45min</div>
                    </div>
                    <div className="bg-white border border-blue-200 rounded p-2">
                      <div className="font-medium text-gray-600 text-xs">Path C (Stable)</div>
                      <div className="text-xs text-gray-700">Rollback to v2.0.8 LTS</div>
                      <div className="text-xs text-blue-600 mt-1">99% success, loss features</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* AI Agents Column */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: '#1b244d' }}>
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                AI Agents & Automated Response
              </h3>
              
              <div className="space-y-4">
                {showWarRoom === 'payment' ? (
                  <>
                    {/* Payment Analyzer AI */}
                    <Card className="bg-purple-50 border border-purple-300">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                            AI
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold" style={{ color: '#1b244d' }}>Payment Analyzer AI</div>
                            <div className="text-sm text-gray-600 mb-2">AI Agent • Transaction Pattern Analysis</div>
                            <div className="text-sm text-gray-700 mb-3">Analyzing 15K transactions/sec for timeout patterns</div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-orange-600 border-orange-600">2min TO COMPLETE</Badge>
                              <div className="flex items-center text-sm text-gray-600">
                                <Activity className="h-4 w-4 mr-1" />
                                Processing...
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>



                    {/* Capacity Predictor AI */}
                    <Card className="bg-blue-50 border border-blue-300">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            AI
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold" style={{ color: '#1b244d' }}>Capacity Predictor AI</div>
                            <div className="text-sm text-gray-600 mb-2">AI Agent • Resource Forecasting</div>
                            <div className="text-sm text-gray-700 mb-3">Scaling recommendations ready</div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-blue-600 border-blue-600">Ready AWAITING</Badge>
                              <div className="flex items-center text-sm text-blue-600">
                                <Clock className="h-4 w-4 mr-1" />
                                Standby
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    {/* Crash Analytics AI */}
                    <Card className="bg-green-50 border border-green-300">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                            AI
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold" style={{ color: '#1b244d' }}>Crash Analytics AI</div>
                            <div className="text-sm text-gray-600 mb-2">AI Agent • Error Pattern Detection</div>
                            <div className="text-sm text-gray-700 mb-3">Identified memory leak in checkout module - auto-rollback triggered</div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-green-600 border-green-600">COMPLETED</Badge>
                              <div className="flex items-center text-sm text-green-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                Done
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Deployment Monitor AI */}
                    <Card className="bg-orange-50 border border-orange-300">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                            AI
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold" style={{ color: '#1b244d' }}>Deployment Monitor AI</div>
                            <div className="text-sm text-gray-600 mb-2">AI Agent • Rollback Orchestration</div>
                            <div className="text-sm text-gray-700 mb-3">75% devices updated to v2.1.2 stable</div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-orange-600 border-orange-600">10min TO 100%</Badge>
                              <div className="flex items-center text-sm text-orange-600">
                                <Activity className="h-4 w-4 mr-1" />
                                Deploying
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>

            {/* Human Responders Column */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center" style={{ color: '#1b244d' }}>
                <Users className="h-5 w-5 mr-2" style={{ color: '#d63426' }} />
                Human Responders & Leadership
              </h3>
              
              <div className="space-y-4">
                {showWarRoom === 'payment' ? (
                  <>
                    {/* Sarah Chen - CTO */}
                    <Card className="bg-red-50 border border-red-300">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">
                            SC
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold" style={{ color: '#1b244d' }}>Sarah Chen</div>
                            <div className="text-sm text-gray-600 mb-2">Human • Chief Technology Officer</div>
                            <div className="text-sm text-gray-700 mb-3">Coordinating with payment vendor CEO</div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-red-600 border-red-600">8min RESPONSE</Badge>
                              <div className="flex items-center text-sm text-red-600">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                                Critical Action
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Mike Kumar - Sr. Payment Engineer */}
                    <Card className="bg-orange-50 border border-orange-300">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                            MK
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold" style={{ color: '#1b244d' }}>Mike Kumar</div>
                            <div className="text-sm text-gray-600 mb-2">Human • Sr. Payment Engineer</div>
                            <div className="text-sm text-gray-700 mb-3">Manual gateway config adjustment</div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-orange-600 border-orange-600">15min TO FIX</Badge>
                              <div className="flex items-center text-sm text-orange-600">
                                <Activity className="h-4 w-4 mr-1" />
                                Working
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Rachel Johnson - DevOps Lead */}
                    <Card className="bg-green-50 border border-green-300">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                            RJ
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold" style={{ color: '#1b244d' }}>Rachel Johnson</div>
                            <div className="text-sm text-gray-600 mb-2">Human • DevOps Lead</div>
                            <div className="text-sm text-gray-700 mb-3">Monitoring infrastructure health</div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-green-600 border-green-600">Active MONITORING</Badge>
                              <div className="flex items-center text-sm text-green-600">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                                Live
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* David Lee - Customer Support Lead */}
                    <Card className="bg-blue-50 border border-blue-300">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            DL
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold" style={{ color: '#1b244d' }}>David Lee</div>
                            <div className="text-sm text-gray-600 mb-2">Human • Customer Support Lead</div>
                            <div className="text-sm text-gray-700 mb-3">Managing customer communications</div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-blue-600 border-blue-600">Ongoing ACTIVE</Badge>
                              <div className="flex items-center text-sm text-blue-600">
                                <Users className="h-4 w-4 mr-1" />
                                Customer Focus
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <>
                    {/* Alex Rodriguez - Engineering Manager */}
                    <Card className="bg-orange-50 border border-orange-300">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                            AR
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold" style={{ color: '#1b244d' }}>Alex Rodriguez</div>
                            <div className="text-sm text-gray-600 mb-2">Human • Engineering Manager</div>
                            <div className="text-sm text-gray-700 mb-3">Monitoring rollback metrics & crash rates</div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-orange-600 border-orange-600">5min RESPONSE</Badge>
                              <div className="flex items-center text-sm text-orange-600">
                                <Activity className="h-4 w-4 mr-1" />
                                Monitoring
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Jessica Wang - Sr. Mobile Developer */}
                    <Card className="bg-blue-50 border border-blue-300">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            JW
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold" style={{ color: '#1b244d' }}>Jessica Wang</div>
                            <div className="text-sm text-gray-600 mb-2">Human • Sr. Mobile Developer</div>
                            <div className="text-sm text-gray-700 mb-3">Preparing hotfix for edge cases</div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-blue-600 border-blue-600">20min TO DEPLOY</Badge>
                              <div className="flex items-center text-sm text-blue-600">
                                <Activity className="h-4 w-4 mr-1" />
                                Developing
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* War Room Statistics */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold mb-4" style={{ color: '#1b244d' }}>War Room Performance Metrics</h4>
            <div className="grid grid-cols-4 gap-4">
              {showWarRoom === 'payment' ? (
                <>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-green-600">2:4</div>
                    <div className="text-sm text-gray-600">AI to Human Ratio</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-blue-600">67%</div>
                    <div className="text-sm text-gray-600">AI Automation</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-orange-600">8min</div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold" style={{ color: '#d63426' }}>L3</div>
                    <div className="text-sm text-gray-600">Escalation Level</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-green-600">1:1</div>
                    <div className="text-sm text-gray-600">AI to Human Ratio</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-blue-600">50%</div>
                    <div className="text-sm text-gray-600">AI Automation</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-orange-600">5min</div>
                    <div className="text-sm text-gray-600">Response Time</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-orange-600">L2</div>
                    <div className="text-sm text-gray-600">Management Level</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
