import { Badge } from "@/components/ui/badge";
import { ChartLine, Activity } from "lucide-react";

export default function Header() {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ChartLine className="h-6 w-6" style={{ color: '#d63426' }} />
          <h1 className="text-xl font-bold" style={{ color: '#1b244d' }}>Intelligent Sales Tower</h1>
          <Badge className="bg-green-600 hover:bg-green-700 text-white">
            LIVE EVENT
          </Badge>
        </div>
        <div className="flex items-center space-x-6">
          <div className="text-sm">
            <span style={{ color: '#1b244d' }}>Black Friday Sale 2024</span>
            <div className="text-xs text-gray-500">Day 2 of 4 • 14:32:15 Remaining</div>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-sm" style={{ color: '#1b244d' }}>All Systems Operational</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
