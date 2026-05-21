import { AlertTriangle, AlertCircle, Info, Clock, CheckCircle2, Loader2, Brain, Mail, Globe, LogIn, Sparkles } from "lucide-react";
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

const keyAlertIds = ["ALT-001-2", "ALT-004", "ALT-006"];

export default function AlertTable({ alerts, onAnalyze }: AlertTableProps) {
  return (
    <div className="rounded-xl border border-[#e2e8f0] bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e2e8f0]">
              <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                告警名称
              </th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                分类
              </th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                级别
              </th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                时间
              </th>
              <th className="text-left px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                状态
              </th>
              <th className="text-right px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
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
                  className="group transition-all duration-200 hover:bg-[#f1f5f9] animate-stream-in"
                  style={{
                    animationDelay: `${index * 60}ms`,
                    ...(keyAlertIds.includes(alert.id) ? {
                      borderLeft: `3px solid ${category.color}`,
                      boxShadow: `inset 0 0 20px ${category.color}08`,
                    } : {}),
                  }}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {keyAlertIds.includes(alert.id) ? (
                        <div className="relative flex items-center justify-center w-4 h-4 shrink-0">
                          <Sparkles className="w-3.5 h-3.5 text-[#00b4d8]" />
                          <span className="absolute inset-0 animate-ping rounded-full bg-[#00b4d8]/20" style={{ animationDuration: '2s' }} />
                        </div>
                      ) : null}
                      <span className="text-xs font-mono text-[#94a3b8] min-w-[72px]">
                        {alert.id}
                      </span>
                      <span className="text-sm font-medium text-[#0f172a] group-hover:text-[#00b4d8] transition-colors">
                        {alert.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium"
                      style={{ color: category.color, backgroundColor: category.bg }}
                    >
                      <CategoryIcon className="w-3.5 h-3.5" />
                      {category.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3">
                    <span className="text-sm text-[#475569] font-mono">
                      {alert.time}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: status.color }}>
                      {alert.status === "processing" ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <StatusIcon className="w-3.5 h-3.5" />
                      )}
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onAnalyze(alert)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 bg-[#00b4d8]/10 text-[#00b4d8] border border-[#00b4d8]/20 hover:bg-[#00b4d8]/20 hover:border-[#00b4d8]/40 hover:shadow-lg hover:shadow-[#00b4d8]/10 active:scale-95"
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