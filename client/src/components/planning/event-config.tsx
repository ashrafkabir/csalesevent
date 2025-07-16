import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EventConfig() {
  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="text-lg font-semibold" style={{ color: '#1b244d' }}>Event Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="eventName" className="text-sm font-medium" style={{ color: '#1b244d' }}>
            Event Name
          </Label>
          <Input
            id="eventName"
            defaultValue="Spring Mattress Sale 2024"
            className="mt-1 bg-white border-gray-300"
            style={{ color: '#1b244d' }}
          />
        </div>
        
        <div>
          <Label htmlFor="duration" className="text-sm font-medium" style={{ color: '#1b244d' }}>
            Duration
          </Label>
          <Input
            id="duration"
            defaultValue="March 15-22, 2024"
            className="mt-1 bg-white border-gray-300"
            style={{ color: '#1b244d' }}
          />
        </div>
        
        <div>
          <Label htmlFor="targetRevenue" className="text-sm font-medium" style={{ color: '#1b244d' }}>
            Target Revenue
          </Label>
          <Input
            id="targetRevenue"
            defaultValue="$3.2M"
            className="mt-1 bg-white border-gray-300"
            style={{ color: '#1b244d' }}
          />
        </div>
        
        <Button className="w-full text-white hover:opacity-90" style={{ backgroundColor: '#d63426' }}>
          Save Configuration
        </Button>
      </CardContent>
    </Card>
  );
}
