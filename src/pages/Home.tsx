import { useState, useEffect } from "react";
import {
  ShieldCheck,
  SquaresFour,
  WarningCircle,
  MagnifyingGlass,
  DesktopTower,
  ChatCircle,
  Database,
  BookOpen,
  Code,
  Gear,
  Download,
  Brain,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Spinner,
  CaretDown,
} from "@phosphor-icons/react";
import AiAnalysisModal from "@/components/AiAnalysisModal";
import AiChat from "@/components/AiChat";
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
    time: "03-28 09:44:05",
    name: "疑似邮件暴力破解攻击",
    source: "185.220.101.47",
    level: "CRITICAL",
    status: "研判中",
    aiConclusion: "高危 — 累计试错157次，平均间隔0.1秒，持续遭受自动化暴力破解攻击。终端日志显示：Mar 28 09:44:05 mail-server dovecot: auth-worker(28471): pam(itservice7,185.220.101.47): Authentication failure; logname= uid=0 euid=0 tty=dovecot ruser=itservice7 rhost=185.220.101.47。",
  },
  {
    id: "INC-2026-0813",
    time: "03-29 14:06:29",
    name: "钓鱼邮件 - 模拟登录页面",
    source: "external-host.xyz",
    level: "HIGH",
    status: "待处理",
    aiConclusion: "邮件网关拦截到 3 封高度仿真的钓鱼邮件，发件人伪装成 IT 运维团队，诱导用户访问 external-host.xyz 的虚假 VPN 登录页。URL 被 3 家威胁情报源标记为恶意。已识别 7 名员工点击了链接，其中 2 名输入了凭据。终端日志：Mar 29 14:06:29 proxy squid[4521]: TCP_MISS/200 1245 GET http://external-host.xyz/login - HIER_DIRECT/185.220.101.47 text/html; user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64)。",
  },
  {
    id: "INC-2026-0814",
    time: "04-15 16:45:16",
    name: "非工作时间大规模数据下载",
    source: "User: chenwei@corp.com",
    level: "MEDIUM",
    status: "已处置",
    aiConclusion: "用户陈伟（chenwei@corp.com）于凌晨 02:15 从 CRM 系统批量导出客户数据，涉及 2.3 万条记录。经核实，该用户为市场部数据分析师，已补交数据使用审批单。终端日志：Apr 15 02:15:33 crm-app nginx: 10.8.12.45 - chenwei [15/Apr/2026:02:15:33 +0800] GET /api/v1/customers/export?limit=50000 HTTP/1.1 200 18475632 - python-requests/2.28.1; user_agent=Mozilla/5.0。",
  },
  {
    id: "INC-2026-0815",
    time: "04-30 13:36:39",
    name: "可疑 PowerShell 脚本执行",
    source: "10.5.10.22 (PC-0021)",
    level: "CRITICAL",
    status: "已忽略",
    aiConclusion: "终端安全软件检测到 PC-0021 执行了 Base64 编码的 PowerShell 命令，经解码分析为系统补丁检测脚本。该设备归属运维部张磊，脚本为其日常巡检工具。终端日志：Apr 30 13:36:39 PC-0021 sysmon: Process Create: UtcTime: 2026-04-30 13:36:39.442, ProcessGuid: {a1b2c3d4-e5f6-7890-abcd-ef1234567890}, ProcessId: 4521, Image: C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe, CommandLine: powershell -enc UwB5AHMAdABlAG0ALgBVAFAAZABhAHQAZQAuAFQAbwB0AGEAbAAuAEQAbwB3AG4AbABvAGEAZAAoACkA, User: CORP\\zhangsan。",
  },
  {
    id: "INC-2026-0816",
    time: "03-08 20:20:19",
    name: "检测到对外部 C&C 的心跳连接",
    source: "172.16.50.4",
    level: "CRITICAL",
    status: "研判中",
    aiConclusion: "防火墙日志显示 172.16.50.4 每 30 秒向 185.220.101.47:443 发送固定长度的 TLS 握手请求，包大小一致，无实际业务数据交换。该域名被 VirusTotal 5/70 引擎标记为恶意，关联 APT29 组织历史活动。终端日志：Mar 08 20:20:19 fw01 kernel: [IPTABLES] OUT=eth0 SRC=172.16.50.4 DST=185.220.101.47 LEN=60 TOS=0x00 PREC=0x00 TTL=64 ID=12345 DF PROTO=TCP SPT=49152 DPT=443 WINDOW=29200 RES=0x00 SYN URGP=0; repeat=47 times/10min。",
  },
  {
    id: "INC-2026-0817",
    time: "03-01 09:31:53",
    name: "多次错误的 VPN 登录尝试",
    source: "123.15.6.8 (Russia)",
    level: "HIGH",
    status: "已处置",
    aiConclusion: "VPN 网关记录到来自俄罗斯 IP 123.15.6.8 的 47 次失败登录，尝试用户名包括 admin、itservice、zhangsan 等。登录间隔呈规律性（每 5 秒一次），符合字典攻击特征。终端日志：Mar 01 09:31:53 vpn01 openvpn[2156]: 123.15.6.8:51234 TLS Auth Error: Auth Username/Password verification failed for peer ; user=admin; cipher=AES-256-GCM; reason=TLS handshake failed。",
  },
  {
    id: "INC-2026-0818",
    time: "04-03 07:59:06",
    name: "邮箱日志同步异常",
    source: "Exchange Connector",
    level: "LOW",
    status: "待处理",
    aiConclusion: "Exchange 日志同步服务连续 3 小时未上报数据，API 返回 401 未授权错误。经排查，系服务账户密码过期导致。终端日志：Apr 03 07:59:06 exch01 python3[4521]: [ERROR] Exchange SIEM Connector: HTTP 401 Unauthorized - {'error': 'invalid_client', 'error_description': 'AADSTS7000222: The provided client secret keys are expired.', 'timestamp': '2026-04-03T07:59:06Z'}。",
  },
  {
    id: "INC-2026-0819",
    time: "04-05 11:57:13",
    name: "数据库敏感字段查询异常",
    source: "User: dba_admin",
    level: "HIGH",
    status: "研判中",
    aiConclusion: "数据库审计系统告警：dba_admin 账户在 10 分钟内执行了 15 次 SELECT * 查询，涉及员工身份证号、银行卡号等敏感字段，总计返回 12,847 条记录。终端日志：Apr 05 22:01:17 db-audit mysql-audit: {\"timestamp\":\"2026-04-05T22:01:17\",\"user\":\"dba_admin@10.8.12.45\",\"query\":\"SELECT * FROM hr.employees WHERE id < 15000\",\"rows_returned\":12847,\"tables\":[\"hr.employees\"],\"sensitive_columns\":[\"id_card\",\"bank_account\"],\"client_ip\":\"10.8.12.45\"}。",
  },
  {
    id: "INC-2026-0820",
    time: "03-28 16:00:25",
    name: "内网横向移动检测",
    source: "10.8.12.55 (PC-0047)",
    level: "CRITICAL",
    status: "待处理",
    aiConclusion: "EDR 检测到 PC-0047 在 5 分钟内对 23 台内网主机发起 SMB 连接，尝试访问 ADMIN$ 共享。该设备归属研发部王涛，但其正常工作不涉及服务器管理。终端日志：Mar 28 16:00:25 PC-0047 sysmon: Network connection detected: UtcTime: 2026-03-28 16:00:25.881, ProcessGuid: {b2c3d4e5-f6a7-8901-bcde-f23456789012}, ProcessId: 8912, Image: C:\\Windows\\System32\\svchost.exe, User: CORP\\wangtao, Protocol: tcp, Initiated: true, SourceIsIpv6: false, SourceIp: 10.8.12.55, SourceHostname: PC-0047, SourcePort: 49672, DestinationIsIpv6: false, DestinationIp: 10.8.12.10, DestinationHostname: FILE-SERVER-01, DestinationPort: 445。",
  },
  {
    id: "INC-2026-0821",
    time: "03-18 08:02:15",
    name: "Web 应用 SQL 注入尝试",
    source: "45.142.212.89 (Netherlands)",
    level: "HIGH",
    status: "已处置",
    aiConclusion: "WAF 拦截到来自荷兰 IP 的 89 次 SQL 注入攻击，目标为 OA 系统的 /api/report/export 接口。攻击载荷包含 UNION SELECT、sleep() 等特征，尝试提取数据库版本信息。终端日志：Mar 18 08:02:15 waf01 modsecurity: [client 45.142.212.89] ModSecurity: Access denied with code 403 (phase 2). Pattern match \"(?i:union\\\\s*select)\" at ARGS:query. [file \"/etc/modsecurity/rules/sql_injection.conf\"] [line \"47\"] [id \"942100\"] [msg \"SQL Injection Attack Detected\"] [data \"Matched Data: UNION SELECT found within ARGS:query: 1' UNION SELECT version(),user(),database()-- \"] [severity \"CRITICAL\"] [tag \"application-multi\"] [tag \"language-multi\"] [tag \"platform-multi\"] [tag \"attack-sqli\"] [hostname \"oa.corp.com\"] [uri \"/api/report/export\"] [unique_id \"Y1234567890abcdef\"]。",
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

const statusConfig: Record<string, { icon: React.ComponentType<{ className?: string; weight?: string }>; color: string; bg: string }> = {
  "研判中": { icon: Spinner, color: "text-blue-600", bg: "bg-blue-50" },
  "待处理": { icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
  "已处置": { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  "已忽略": { icon: XCircle, color: "text-slate-500", bg: "bg-slate-50" },
};

type PageKey = "events" | "ai-chat";

const navItems: { icon: React.ComponentType<{ className?: string; weight?: string }>; label: string; page: PageKey }[] = [
  { icon: SquaresFour, label: "工作台", page: "events" },
  { icon: WarningCircle, label: "事件中心", page: "events" },
  { icon: MagnifyingGlass, label: "调查分析", page: "events" },
  { icon: DesktopTower, label: "资产清单", page: "events" },
  { icon: ChatCircle, label: "AI 问答", page: "ai-chat" },
];

const configItems = [
  { icon: Database, label: "数据源", href: "#" },
  { icon: BookOpen, label: "知识库", href: "#" },
  { icon: Code, label: "反馈管理", href: "#" },
  { icon: Gear, label: "系统设置", href: "#" },
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
  const [currentPage, setCurrentPage] = useState<PageKey>(() => {
    const saved = localStorage.getItem("home_page");
    return saved === "ai-chat" ? "ai-chat" : "events";
  });
  const [activeNav, setActiveNav] = useState(() => {
    const saved = localStorage.getItem("home_page");
    return saved === "ai-chat" ? "AI 问答" : "事件中心";
  });

  useEffect(() => {
    localStorage.setItem("home_page", currentPage);
  }, [currentPage]);

  return (
    <div className="flex h-screen overflow-hidden bg-dashboard-bg">
      {/* Sidebar */}
      <aside className="w-48 flex-shrink-0 bg-gradient-to-b from-white to-slate-50/80 border-r border-dashboard-border flex flex-col shadow-sm">
        <div className="px-4 py-5 flex items-center gap-2.5 border-b border-dashboard-border/50">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-sm shadow-blue-500/20">
            <ShieldCheck weight="duotone" className="text-white w-4 h-4" />
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
            const isActive = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setActiveNav(item.label);
                  setCurrentPage(item.page);
                }}
                className={`relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all duration-200 w-full text-left ${
                  isActive
                    ? "bg-blue-50/80 text-blue-700 font-semibold shadow-sm shadow-blue-500/5 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-4 before:bg-blue-600 before:rounded-r"
                    : "text-dashboard-text-muted hover:bg-dashboard-hover-light hover:text-dashboard-text"
                }`}
              >
                <Icon weight="duotone" className={`w-[18px] h-[18px] ${isActive ? "text-blue-600" : ""}`} />
                <span>{item.label}</span>
              </button>
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
                <Icon weight="duotone" className="w-[18px] h-[18px]" />
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

      {currentPage === "ai-chat" ? (
         <AiChat />
       ) : (
         <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-12 bg-white/80 backdrop-blur-sm border-b border-dashboard-border flex items-center justify-between px-6 relative">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <h2 className="text-sm font-semibold text-dashboard-text">
            统一事件流管理系统
          </h2>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/25 active:scale-[0.98]">
              <Download weight="duotone" className="w-3.5 h-3.5" />
              导出审计报告
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Filter Bar */}
          <div className="bg-white border border-dashboard-border p-4 rounded-xl mb-4 shadow-sm">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex items-center gap-2 min-w-[260px]">
                <label className="text-[11px] font-semibold text-dashboard-text-dim uppercase tracking-wider whitespace-nowrap">搜索事件</label>
                <div className="relative flex-1">
                  <MagnifyingGlass weight="duotone" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-dashboard-text-dim w-3.5 h-3.5" />
                  <input
                    className="w-full bg-white border border-dashboard-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-dashboard-text placeholder:text-dashboard-text-dim focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 h-[34px] transition-all duration-200 hover:border-blue-300"
                    placeholder="ID, IP, 资产名称..."
                    type="text"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-semibold text-dashboard-text-dim uppercase tracking-wider whitespace-nowrap">风险等级</label>
                <div className="relative">
                  <select className="appearance-none bg-white border border-dashboard-border rounded-lg pl-3 pr-8 py-1.5 text-xs text-dashboard-text focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 h-[34px] min-w-[140px] cursor-pointer transition-all duration-200 hover:border-blue-300">
                    <option>全部等级</option>
                    <option>Critical (严重)</option>
                    <option>High (高危)</option>
                    <option>Medium (中等)</option>
                    <option>Low (低危)</option>
                  </select>
                  <CaretDown weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dashboard-text-dim w-3 h-3 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-semibold text-dashboard-text-dim uppercase tracking-wider whitespace-nowrap">事件分类</label>
                <div className="relative">
                  <select className="appearance-none bg-white border border-dashboard-border rounded-lg pl-3 pr-8 py-1.5 text-xs text-dashboard-text focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 h-[34px] min-w-[140px] cursor-pointer transition-all duration-200 hover:border-blue-300">
                    <option>全部类型</option>
                    <option>密码暴力破解</option>
                    <option>钓鱼邮件</option>
                    <option>用户异常行为</option>
                    <option>恶意代码植入</option>
                    <option>数据泄露风险</option>
                  </select>
                  <CaretDown weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dashboard-text-dim w-3 h-3 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[11px] font-semibold text-dashboard-text-dim uppercase tracking-wider whitespace-nowrap">处理状态</label>
                <div className="relative">
                  <select className="appearance-none bg-white border border-dashboard-border rounded-lg pl-3 pr-8 py-1.5 text-xs text-dashboard-text focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 h-[34px] min-w-[140px] cursor-pointer transition-all duration-200 hover:border-blue-300">
                    <option>全部状态</option>
                    <option>待处理</option>
                    <option>研判中</option>
                    <option>已处置</option>
                    <option>误报忽略</option>
                  </select>
                  <CaretDown weight="bold" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-dashboard-text-dim w-3 h-3 pointer-events-none" />
                </div>
              </div>
              <button className="h-[34px] px-4 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-dashboard-text-muted rounded-lg text-xs font-medium transition-all duration-200 active:scale-[0.97]">
                重置
              </button>
            </div>
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
                      className={`group transition-all duration-200 hover:bg-blue-50/30 border-l-[3px] ${levelStyle.accent} ${isCritical ? "bg-red-50/20" : ""}`}
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
                          <StatusIcon weight="duotone" className={`w-3 h-3 ${incident.status === "研判中" ? "animate-spin" : ""}`} />
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
                            <Eye weight="duotone" className="w-3 h-3" />
                            详情
                          </a>
                          <button
                            onClick={() =>
                              setSelectedAlert(incidentToAlertItem(incident))
                            }
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all duration-200 bg-[#00b4d8]/8 text-[#00b4d8] border border-[#00b4d8]/15 hover:bg-[#00b4d8]/15 hover:border-[#00b4d8]/30 hover:shadow-sm hover:shadow-[#00b4d8]/10 active:scale-95"
                          >
                            <Brain weight="duotone" className="w-3 h-3" />
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
              <p>展示 1-10 条，共 <span className="font-semibold text-dashboard-text-muted">1,284</span> 条记录</p>
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
      )}

      <AiAnalysisModal
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
      />
    </div>
  );
}
