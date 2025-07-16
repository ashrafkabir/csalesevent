import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataIndicator from "@/components/common/data-indicator";
import { Store, Monitor, Smartphone } from "lucide-react";

const channels = [
  {
    name: "Physical Stores",
    contribution: "62%",
    revenue: "$1.14M",
    icon: Store,
    color: "text-blue-400",
  },
  {
    name: "Online",
    contribution: "28%", 
    revenue: "$517K",
    icon: Monitor,
    color: "text-purple-400",
  },
  {
    name: "Mobile App",
    contribution: "10%",
    revenue: "$184K",
    icon: Smartphone,
    color: "text-green-400",
  },
];

export default function ChannelPerformance() {
  return (
    <Card className="dashboard-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold text-white">Channel Performance</CardTitle>
        <DataIndicator type="processed" />
      </CardHeader>
      <CardContent className="space-y-3">
        {channels.map((channel, index) => {
          const Icon = channel.icon;
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon className={`${channel.color} w-5 h-5`} />
                <div>
                  <div className="font-medium text-white">{channel.name}</div>
                  <div className="text-sm text-gray-400">{channel.contribution} contribution</div>
                </div>
              </div>
              <div className="text-green-400 font-semibold">{channel.revenue}</div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
