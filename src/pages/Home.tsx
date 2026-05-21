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

const levelConfig = {
  CRITICAL: {
    bg: "bg-red-50",
    text: "text-red-600",
    border: "border-red-200",
  },
  HIGH: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-200",
  },
  MEDIUM: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
  },
  LOW: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
  },
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

// 转换 incident 为 AlertItem 格式给弹窗使用
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
  };
}

export default function Home() {
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-[#e2e8f0] flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            安全事件分析助手
          </h1>
        </div>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-4">
            核心模块
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                  item.active
                    ? "bg-[#f1f5f9] text-blue-600 font-medium border-r-2 border-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            );
          })}
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-4">
            配置管理
          </div>
          {configItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-100 transition-colors text-slate-600 hover:text-slate-900"
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-8">
          <h2 className="text-lg font-semibold text-slate-900">
            统一事件流管理系统
          </h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <Download className="w-4 h-4" />
              导出审计报告
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Filter Bar */}
          <div className="bg-white border border-[#e2e8f0] p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-end shadow-sm">
            <div className="flex-1 min-w-[200px] space-y-1.5">
              <label className="text-xs text-slate-500">搜索事件</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                <input
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="ID, IP, 资产名称..."
                  type="text"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500">风险等级</label>
              <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900">
                <option>全部等级</option>
                <option>Critical (严重)</option>
                <option>High (高危)</option>
                <option>Medium (中等)</option>
                <option>Low (低危)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500">事件分类</label>
              <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900">
                <option>全部类型</option>
                <option>密码暴力破解</option>
                <option>钓鱼邮件</option>
                <option>用户异常行为</option>
                <option>恶意代码植入</option>
                <option>数据泄露风险</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-slate-500">处理状态</label>
              <select className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900">
                <option>全部状态</option>
                <option>待处理</option>
                <option>研判中</option>
                <option>已处置</option>
                <option>误报忽略</option>
              </select>
            </div>
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium h-[38px] transition-colors">
              重置
            </button>
          </div>

          {/* Table */}
          <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                <tr>
                  <th className="px-6 py-4">事件 ID</th>
                  <th className="px-6 py-4">时间戳</th>
                  <th className="px-6 py-4">事件名称</th>
                  <th className="px-6 py-4">源 IP / 账户</th>
                  <th className="px-6 py-4">风险级别</th>
                  <th className="px-6 py-4">状态</th>
                  <th className="px-6 py-4">AI 研判结论</th>
                  <th className="px-6 py-4 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {incidents.map((incident) => {
                  const levelStyle = levelConfig[incident.level];
                  return (
                    <tr
                      key={incident.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-slate-500">
                        {incident.id}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {incident.time}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {incident.name}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {incident.source}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${levelStyle.bg} ${levelStyle.text} border ${levelStyle.border}`}
                        >
                          {incident.level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {incident.status === "研判中" ? (
                          <span className="flex items-center gap-1.5 text-slate-700">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            研判中
                          </span>
                        ) : (
                          <span className="text-slate-700">{incident.status}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {incident.aiConclusion}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            className="text-blue-600 hover:underline text-sm"
                            href="#"
                          >
                            详情分析
                          </a>
                          <button
                            onClick={() =>
                              setSelectedAlert(incidentToAlertItem(incident))
                            }
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 bg-[#00b4d8]/10 text-[#00b4d8] border border-[#00b4d8]/20 hover:bg-[#00b4d8]/20 hover:border-[#00b4d8]/40 hover:shadow-lg hover:shadow-[#00b4d8]/10 active:scale-95"
                          >
                            <Brain className="w-3.5 h-3.5" />
                            AI研判
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <p>展示 1-8 条数据，共计 1,284 条记录</p>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 disabled:opacity-50 transition-colors"
                  disabled
                >
                  上一页
                </button>
                <span className="text-slate-600">1 / 161</span>
                <button className="px-3 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors">
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
