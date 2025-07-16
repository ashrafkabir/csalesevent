import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

type DataType = "processed" | "realtime" | "ai";

interface DataIndicatorProps {
  type: DataType;
  label?: string;
  className?: string;
}

const indicators = {
  processed: {
    color: "bg-blue-500",
    label: "Processed",
  },
  realtime: {
    color: "bg-green-500 animate-pulse",
    label: "Real-time",
  },
  ai: {
    color: "bg-purple-500",
    label: "AI Summarized",
  },
};

export default function DataIndicator({ type, label, className }: DataIndicatorProps) {
  const indicator = indicators[type];
  const displayLabel = label || indicator.label;

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Circle className={cn("w-2 h-2", indicator.color)} />
      <span className="text-xs text-gray-400">{displayLabel}</span>
    </div>
  );
}
