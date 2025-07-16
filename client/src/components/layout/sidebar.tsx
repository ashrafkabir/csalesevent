import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Network, 
  BarChart3, 
  Shield,
  Circle
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/planning", label: "Event Planning", icon: Network },
  { href: "/event-management", label: "Event Management", icon: BarChart3 },
  { href: "/service-operations", label: "Service Operations", icon: Shield },
];

const dataCategories = [
  { label: "Processed Data", color: "bg-blue-500" },
  { label: "Real-time Data", color: "bg-green-500 animate-pulse" },
  { label: "AI Summarized", color: "bg-purple-500" },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
                    isActive
                      ? "font-medium text-white"
                      : "hover:bg-gray-50"
                  )}
                  style={isActive ? { backgroundColor: '#d63426', color: 'white' } : { color: '#1b244d' }}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="mt-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Data Categories
          </h3>
          <div className="space-y-2">
            {dataCategories.map((category) => (
              <div key={category.label} className="flex items-center space-x-2">
                <Circle className={cn("w-3 h-3", category.color)} />
                <span className="text-sm" style={{ color: '#1b244d' }}>{category.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
