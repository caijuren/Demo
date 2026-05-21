import { useState } from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  AlertCircle,
  Search,
  Server,
  MessageSquare,
  Database,
  BookOpen,
  MessageCircleCode,
  Settings,
  Download,
  Brain,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import AiAnalysisModal from "@/components/AiAnalysisModal";
import type { AlertItem } from "@/types";

interface Incident {
  id: string;
  time: string;
  name: string;
  source: string;
  level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: string;
  aiConclusion: string;
}

const incidents: Incident[] = [
  {
    id: "INC-2026-0812",
    time: "05-10 14:12:05",
    name: "AD 域账户枚举攻击",
    source: "10.22.1.84",
    level: "CRITICAL",
    status: "研判中",
    aiConclusion: "确认尝试性破解，已封禁IP",
  },
  {
    id: "INC-2026-0813",
    time: "05-10 13:45:12",
    name: "钓鱼邮件 - 模拟登录页面",
    source: "external-host.xyz",
    level: "HIGH",
    status: "待处理",
    aiConclusion: "发现多个内部账户点击链接",
  },
  {
    id: "INC-2026-0814",
    time: "05-10 13:20:00",
    name: "非工作时间大规模下载",
    source: "User: LiSi",
    level: "MEDIUM",
    status: "已处置",
    aiConclusion: "用户确认为备份操作，补录审批",
  },
  {
    id: "INC-2026-0815",
    time: "05-10 12:05:44",
    name: "可疑 PowerShell 脚本执行",
    source: "10.5.10.22 (PC-0021)",
    level: "CRITICAL",
    status: "已忽略",
    aiConclusion: "IT 运维自动化巡检脚本误报",
  },
  {
    id: "INC-2026-0816",
    time: "05-10 11:30:15",
    name: "检测到对外部 C&C 的心跳连接",
    source: "172.16.50.4",
    level: "CRITICAL",
    status: "研判中",
    aiConclusion: "域名匹配威胁情报库（恶意）",
  },
  {
    id: "INC-2026-0817",
    time: "05-10 10:45:00",
    name: "多次错误的 VPN 登录尝试",
    source: "123.15.6.8 (Russia)",
    level: "HIGH",
    status: "已处置",
    aiConclusion: "触发地理围栏拦截规则",
  },
  {
    id: "INC-2026-0818",
    time: "05-10 09:20:11",
    name: "数据源: 邮箱日志同步异常",
    source: "Email Connector",
    level: "LOW",
    status: "待处理",
    aiConclusion: "连接超时，需检查 API Key",
  },
  {
    id: "INC-2026-0819",
    time: "05-10 08:55:02",
    name: "数据库敏感字段查询异常",
    source: "User: DBA_Account",
    level: "HIGH",
    status: "研判中",
    aiConclusion: "单次拉取超过 10,000 条记录",
  },
];

const levelConfig: Record<string, { bg: string; text: string; border: string; dot: string; accent: string }> = {
  CRITICAL: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
    accent: "border-l-red-500",
  },
  HIGH: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    accent: "border-l-amber-400",
  },
  MEDIUM: {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    dot: "bg-sky-500",
    accent: "border-l-sky-400",
  },
  LOW: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    dot: "bg-slate-400",
    accent: "",
  },
};

const statusConfig: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  "研判中": { icon: Loader2, color: "text-blue-600", bg: "bg-blue-50" },
  "待处理": { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  "已处置": { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  "已忽略": { icon: XCircle, color: "text-slate-500", bg: "bg-slate-50" },
};

const navItems = [
  { icon: LayoutDashboard, label: "工作台", href: "#", active: false },
  { icon: AlertCircle, label: "事件中心", href: "#", active: true },
  { icon: Search, label: "调查分析", href: "#", active: false },
  { icon: Server, label: "资产清单", href: "#", active: false },
  { icon: MessageSquare, label: "AI 问答", href: "#", active: false },
];

const configItems = [
  { icon: Database, label: "数据源", href: "#" },
  { icon: BookOpen, label: "知识库", href: "#" },
  { icon: MessageCircleCode, label: "反馈管理", href: "#" },
  { icon: Settings, label: "系统设置", href: "#" },
];

function incidentToAlertItem(incident: Incident): AlertItem {
  return {
    id: incident.id,
    name: incident.name,
    category: "abnormal-login",
    level:
      incident.level === "CRITICAL"
        ? "critical"
        : incident.level === "HIGH"
        ? "warning"
        : "info",
    status:
      incident.status === "已处置"
        ? "resolved"
        : incident.status === "研判中"
        ? "processing"
        : "pending",
    time: incident.time,
    source: incident.source,
    detail: incident.aiConclusion,
  };
}

export default function Home() {
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  return (
    <div className="flex h-screen overflow-hidden bg-dashboard-bg">
      {/* Sidebar */}
      <aside className="w-48 flex-shrink-0 bg-gradient-to-b from-white to-slate-50/80 border-r border-dashboard-border flex flex-col shadow-sm">
        <div className="px-4 py-5 flex items-center gap-2.5 border-b border-dashboard-border/50">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-sm shadow-blue-500/20">
            <ShieldCheck className="text-white w-4 h-4" />
          </div>
          <h1 className="text-sm font-semibold tracking-tight text-dashboard-text whitespace-nowrap">
            安全事件分析助手
          </h1>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          <div className="text-[10px] font-bold text-dashboard-text-dim uppercase tracking-widest px-2.5 pt-3 pb-1.5">
            核心模块
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all duration-200 ${
                  item.active
                    ? "bg-blue-50/80 text-blue-700 font-semibold shadow-sm shadow-blue-500/5 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-4 before:bg-blue-600 before:rounded-r"
                    : "text-dashboard-text-muted hover:bg-dashboard-hover-light hover:text-dashboard-text"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${item.active ? "text-blue-600" : ""}`} />
                <span>{item.label}</span>
              </a>
            );
          })}
          <div className="text-[10px] font-bold text-dashboard-text-dim uppercase tracking-widest px-2.5 pt-4 pb-1.5">
            配置管理
          </div>
          {configItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs hover:bg-dashboard-hover-light transition-all duration-200 text-dashboard-text-muted hover:text-dashboard-text"
              >
                <Icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
        <div className="px-3 py-3 border-t border-dashboard-border/50">
          <div className="flex items-center gap-2 px-2.5 py-1.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-dashboard-text truncate">Admin</div>
              <div className="text-[10px] text-dashboard-text-dim">超级管理员</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-12 bg-white/80 backdrop-blur-sm border-b border-dashboard-border flex items-center justify-between px-6 relative">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <h2 className="text-sm font-semibold text-dashboard-text">
            统一事件流管理系统
          </h2>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/25 active:scale-[0.98]">
              <Download className="w-3.5 h-3.5" />
              导出审计报告
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Filter Bar */}
          <div className="bg-white border border-dashboard-border p-3.5 rounded-xl mb-4 flex flex-wrap gap-3 items-end shadow-sm">
            <div className="flex-1 min-w-[180px] space-y-1">
              <label className="text-[11px] font-semibold text-dashboard-text-dim uppercase tracking-wider">搜索事件</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dashboard-text-dim w-3.5 h-3.5" />
                <input
                  className="w-full bg-slate-50/80 border border-dashboard-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-dashboard-text placeholder:text-dashboard-text-dim focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 h-[32px] transition-all duration-200"
                  placeholder="ID, IP, 资产名称..."
                  type="text"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-dashboard-text-dim uppercase tracking-wider">风险等级</label>
              <select className="bg-slate-50/80 border border-dashboard-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-dashboard-text h-[32px] transition-all duration-200">
                <option>全部等级</option>
                <option>Critical (严重)</option>
                <option>High (高危)</option>
                <option>Medium (中等)</option>
                <option>Low (低危)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-dashboard-text-dim uppercase tracking-wider">事件分类</label>
              <select className="bg-slate-50/80 border border-dashboard-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-dashboard-text h-[32px] transition-all duration-200">
                <option>全部类型</option>
                <option>密码暴力破解</option>
                <option>钓鱼邮件</option>
                <option>用户异常行为</option>
                <option>恶意代码植入</option>
                <option>数据泄露风险</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-dashboard-text-dim uppercase tracking-wider">处理状态</label>
              <select className="bg-slate-50/80 border border-dashboard-border rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-dashboard-text h-[32px] transition-all duration-200">
                <option>全部状态</option>
                <option>待处理</option>
                <option>研判中</option>
                <option>已处置</option>
                <option>误报忽略</option>
              </select>
            </div>
            <button className="bg-slate-100 hover:bg-slate-200 text-dashboard-text-muted px-3 py-1.5 rounded-lg text-xs font-medium h-[32px] transition-all duration-200 active:scale-[0.98]">
              重置
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-dashboard-border rounded-xl overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-slate-50/50 border-b border-dashboard-border">
                  <th className="px-4 py-2.5 text-[11px] font-bold text-dashboard-text-dim uppercase tracking-wider whitespace-nowrap">事件 ID</th>
                  <th className="px-4 py-2.5 text-[11px] font-bold text-dashboard-text-dim uppercase tracking-wider whitespace-nowrap">时间戳</th>
                  <th className="px-4 py-2.5 text-[11px] font-bold text-dashboard-text-dim uppercase tracking-wider">事件名称</th>
                  <th className="px-4 py-2.5 text-[11px] font-bold text-dashboard-text-dim uppercase tracking-wider whitespace-nowrap">源 IP / 账户</th>
                  <th className="px-4 py-2.5 text-[11px] font-bold text-dashboard-text-dim uppercase tracking-wider whitespace-nowrap min-w-[80px]">风险级别</th>
                  <th className="px-4 py-2.5 text-[11px] font-bold text-dashboard-text-dim uppercase tracking-wider whitespace-nowrap">状态</th>
                  <th className="px-4 py-2.5 text-[11px] font-bold text-dashboard-text-dim uppercase tracking-wider whitespace-nowrap">AI 研判结论</th>
                  <th className="px-4 py-2.5 text-[11px] font-bold text-dashboard-text-dim uppercase tracking-wider text-right whitespace-nowrap min-w-[160px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incidents.map((incident, index) => {
                  const levelStyle = levelConfig[incident.level];
                  const statusStyle = statusConfig[incident.status];
                  const StatusIcon = statusStyle.icon;
                  const isCritical = incident.level === "CRITICAL";
                  return (
                    <tr
                      key={incident.id}
                      className={`group transition-all duration-200 hover:bg-blue-50/30 ${isCritical ? "border-l-[3px] " + levelStyle.accent : ""} ${isCritical ? "bg-red-50/20" : ""}`}
                      style={{ animationDelay: `${index * 60}ms` }}
                    >
                      <td className="px-4 py-2.5 font-mono text-dashboard-text-dim text-[11px] whitespace-nowrap">
                        {incident.id}
                      </td>
                      <td className="px-4 py-2.5 text-dashboard-text-muted whitespace-nowrap font-mono text-[11px]">
                        {incident.time}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-dashboard-text truncate max-w-[280px]" title={incident.name}>
                        {incident.name}
                      </td>
                      <td className="px-4 py-2.5 text-dashboard-text-muted truncate max-w-[160px] font-mono text-[11px]" title={incident.source}>
                        {incident.source}
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${levelStyle.bg} ${levelStyle.text} border ${levelStyle.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${levelStyle.dot} ${isCritical ? "animate-pulse" : ""}`} />
                          {incident.level}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium ${statusStyle.bg} ${statusStyle.color}`}>
                          <StatusIcon className={`w-3 h-3 ${incident.status === "研判中" ? "animate-spin" : ""}`} />
                          {incident.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-dashboard-text-muted max-w-[180px] truncate text-[11px]" title={incident.aiConclusion}>
                        {incident.aiConclusion}
                      </td>
                      <td className="px-4 py-2.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-blue-600 hover:bg-blue-50 transition-all duration-200"
                            href="#"
                          >
                            <Eye className="w-3 h-3" />
                            详情
                          </a>
                          <button
                            onClick={() =>
                              setSelectedAlert(incidentToAlertItem(incident))
                            }
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all duration-200 bg-[#00b4d8]/8 text-[#00b4d8] border border-[#00b4d8]/15 hover:bg-[#00b4d8]/15 hover:border-[#00b4d8]/30 hover:shadow-sm hover:shadow-[#00b4d8]/10 active:scale-95"
                          >
                            <Brain className="w-3 h-3" />
                            AI研判
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-4 py-2.5 border-t border-dashboard-border flex items-center justify-between text-[11px] text-dashboard-text-dim bg-slate-50/30">
              <p>展示 1-8 条，共 <span className="font-semibold text-dashboard-text-muted">1,284</span> 条记录</p>
              <div className="flex items-center gap-1.5">
                <button className="px-2.5 py-1 bg-white border border-dashboard-border text-dashboard-text-muted rounded-md hover:bg-slate-50 disabled:opacity-40 transition-all duration-200 text-[11px]" disabled>
                  上一页
                </button>
                <span className="px-2 text-dashboard-text-muted font-medium">1 / 161</span>
                <button className="px-2.5 py-1 bg-white border border-dashboard-border text-dashboard-text-muted rounded-md hover:bg-slate-50 transition-all duration-200 text-[11px]">
                  下一页
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AiAnalysisModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </div>
  );
}