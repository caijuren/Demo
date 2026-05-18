import { useMemo } from "react";
import { Bell, AlertTriangle, AlertCircle, CheckCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { DashboardMetric } from "@/types";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Bell,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
};

interface DashboardCardProps {
  metric: DashboardMetric;
  index: number;
}

export default function DashboardCard({ metric, index }: DashboardCardProps) {
  const Icon = iconMap[metric.icon];
  const TrendIcon = trendIcons[metric.trend];

  const formattedValue = useMemo(() => {
    if (metric.value >= 1000) {
      return metric.value.toLocaleString();
    }
    return metric.value.toString();
  }, [metric.value]);

  const trendColor = metric.trend === "up" ? "#52b788" : metric.trend === "down" ? "#ff4d6d" : "#94a3b8";

  return (
    <div
      className="card-glow group relative flex-1 min-w-[200px] rounded-xl border border-[#1e293b] bg-[#111827] p-5 transition-all duration-300 hover:border-[#00b4d8]/30 hover:shadow-lg hover:shadow-[#00b4d8]/5"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${metric.color}15` }}
        >
          <span style={{ color: metric.color }}>
            {Icon && <Icon className="w-5 h-5" />}
          </span>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5">
          <span style={{ color: trendColor }}>
            {TrendIcon && <TrendIcon className="w-3.5 h-3.5" />}
          </span>
          <span className="text-xs font-medium font-mono" style={{ color: trendColor }}>
            {metric.trendValue}
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <span className="block font-mono text-3xl font-bold tracking-tight" style={{ color: metric.color }}>
          <span className="animate-number">{formattedValue}</span>
        </span>
        <span className="block text-sm text-[#94a3b8] font-medium">
          {metric.label}
        </span>
      </div>
    </div>
  );
}