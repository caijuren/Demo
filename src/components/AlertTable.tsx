import { AlertTriangle, AlertCircle, Info, Clock, CheckCircle2, Loader2, Brain, Mail, Globe, LogIn } from "lucide-react";
import type { AlertItem, AlertCategory } from "@/types";

interface AlertTableProps {
  alerts: AlertItem[];
  onAnalyze: (alert: AlertItem) => void;
}

const categoryConfig: Record<AlertCategory, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  phishing: {
    label: "钓鱼邮件",
    icon: Mail,
    color: "#ff4d6d",
    bg: "rgba(255, 77, 109, 0.1)",
  },
  "internet-behavior": {
    label: "上网行为管理",
    icon: Globe,
    color: "#f9a826",
    bg: "rgba(249, 168, 38, 0.1)",
  },
  "abnormal-login": {
    label: "异常登录",
    icon: LogIn,
    color: "#00b4d8",
    bg: "rgba(0, 180, 216, 0.1)",
  },
};

const levelConfig = {
  critical: {
    label: "高危",
    icon: AlertTriangle,
    color: "#ff4d6d",
    bg: "rgba(255, 77, 109, 0.1)",
    border: "rgba(255, 77, 109, 0.2)",
  },
  warning: {
    label: "中危",
    icon: AlertCircle,
    color: "#f9a826",
    bg: "rgba(249, 168, 38, 0.1)",
    border: "rgba(249, 168, 38, 0.2)",
  },
  info: {
    label: "提示",
    icon: Info,
    color: "#00b4d8",
    bg: "rgba(0, 180, 216, 0.1)",
    border: "rgba(0, 180, 216, 0.2)",
  },
};

const statusConfig = {
  pending: {
    label: "未处理",
    icon: Clock,
    color: "#f9a826",
  },
  processing: {
    label: "处理中",
    icon: Loader2,
    color: "#00b4d8",
  },
  resolved: {
    label: "已处理",
    icon: CheckCircle2,
    color: "#52b788",
  },
};

export default function AlertTable({ alerts, onAnalyze }: AlertTableProps) {
  return (
    <div className="rounded-xl border border-[#1e293b] bg-[#111827] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#1e293b]">
              <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                告警名称
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                分类
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                级别
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                时间
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                状态
              </th>
              <th className="text-right px-5 py-4 text-xs font-semibold uppercase tracking-wider text-[#64748b]">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]">
            {alerts.map((alert, index) => {
              const category = categoryConfig[alert.category];
              const level = levelConfig[alert.level];
              const status = statusConfig[alert.status];
              const CategoryIcon = category.icon;
              const LevelIcon = level.icon;
              const StatusIcon = status.icon;

              return (
                <tr
                  key={alert.id}
                  className="group transition-colors duration-200 hover:bg-white/[0.02]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#64748b] min-w-[64px]">
                        {alert.id}
                      </span>
                      <span className="text-sm font-medium text-[#e2e8f0] group-hover:text-[#00b4d8] transition-colors">
                        {alert.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
                      style={{ color: category.color, backgroundColor: category.bg }}
                    >
                      <CategoryIcon className="w-3.5 h-3.5" />
                      {category.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
                      style={{
                        color: level.color,
                        backgroundColor: level.bg,
                        border: `1px solid ${level.border}`,
                      }}
                    >
                      <LevelIcon className="w-3.5 h-3.5" />
                      {level.label}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-[#94a3b8] font-mono">
                      {alert.time}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: status.color }}>
                      {alert.status === "processing" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <StatusIcon className="w-3.5 h-3.5" />
                      )}
                      {status.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => onAnalyze(alert)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 bg-[#00b4d8]/10 text-[#00b4d8] border border-[#00b4d8]/20 hover:bg-[#00b4d8]/20 hover:border-[#00b4d8]/40 hover:shadow-lg hover:shadow-[#00b4d8]/10 active:scale-95"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      AI研判
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}