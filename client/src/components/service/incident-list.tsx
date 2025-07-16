import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Incident } from "@shared/schema";

interface IncidentListProps {
  incidents?: Incident[];
}

export default function IncidentList({ incidents }: IncidentListProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 hover:bg-red-700";
      case "high":
        return "bg-yellow-600 hover:bg-yellow-700";
      case "medium":
        return "bg-blue-600 hover:bg-blue-700";
      case "low":
        return "bg-gray-600 hover:bg-gray-700";
      default:
        return "bg-gray-600 hover:bg-gray-700";
    }
  };

  const getSeverityBorder = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-900 bg-opacity-30 border-red-500";
      case "high":
        return "bg-yellow-900 bg-opacity-30 border-yellow-500";
      case "medium":
        return "bg-blue-900 bg-opacity-30 border-blue-500";
      case "low":
        return "bg-gray-900 bg-opacity-30 border-gray-500";
      default:
        return "bg-gray-900 bg-opacity-30 border-gray-500";
    }
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m ago`;
    }
    return `${diffMinutes}m ago`;
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold text-white">Active Incidents</CardTitle>
        <div className="flex space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Create Incident
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {incidents?.map((incident) => (
          <div
            key={incident.id}
            className={`rounded-lg p-4 border ${getSeverityBorder(incident.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge className={`${getSeverityColor(incident.severity)} text-white text-xs font-semibold`}>
                    {incident.severity.toUpperCase()}
                  </Badge>
                  <span className="text-white font-medium">{incident.incidentId}</span>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(incident.createdAt!)}
                  </span>
                </div>
                <h4 className="font-semibold text-white mb-1">{incident.title}</h4>
                <p className="text-sm text-gray-300 mb-2">{incident.description}</p>
                <div className="flex items-center space-x-4 text-xs text-gray-400">
                  {incident.assignedTeam && (
                    <span>Assigned: {incident.assignedTeam}</span>
                  )}
                  {incident.impact && (
                    <span>Impact: {incident.impact}</span>
                  )}
                  {incident.eta && (
                    <span>ETA: {incident.eta} minutes</span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="bg-yellow-600 hover:bg-yellow-700 border-yellow-600 text-white">
                  Escalate
                </Button>
                <Button size="sm" variant="outline" className="bg-gray-600 hover:bg-gray-700 border-gray-600 text-white">
                  Update
                </Button>
              </div>
            </div>
          </div>
        )) || (
          <div className="text-center text-gray-400 py-8">
            No active incidents
          </div>
        )}
      </CardContent>
    </Card>
  );
}
