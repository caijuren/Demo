import { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  Slash,
  Lightbulb,
  AlertCircle,
  Search,
  Shield,
  Globe,
  RefreshCw,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

const suggestions = [
  { icon: AlertCircle, label: "近期有哪些高危事件？", color: "text-red-500", bg: "bg-red-50" },
  { icon: Shield, label: "如何防范暴力破解攻击？", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Search, label: "分析IP 185.220.101.47", color: "text-amber-500", bg: "bg-amber-50" },
  { icon: Globe, label: "最新威胁情报摘要", color: "text-cyan-500", bg: "bg-cyan-50" },
  { icon: Lightbulb, label: "安全运维最佳实践", color: "text-emerald-500", bg: "bg-emerald-50" },
  { icon: Slash, label: "钓鱼邮件识别要点", color: "text-purple-500", bg: "bg-purple-50" },
];

const mockResponses: Record<string, string> = {
  "近期有哪些高危事件？": `根据安全事件态势感知平台的最新数据，以下是近期高危安全事件汇总：

**1. AD 域账户枚举攻击（INC-2026-0812）**
- 等级：CRITICAL | 来源：10.22.1.84
- AI 研判：确认尝试性破解，已封禁 IP | 状态：研判中

**2. 钓鱼邮件 - 模拟登录页面（INC-2026-0813）**
- 等级：HIGH | 来源：external-host.xyz
- AI 研判：发现多个内部账户点击链接 | 状态：待处理

**3. 非工作时间大规模下载（INC-2026-0814）**
- 等级：MEDIUM | 来源：User: LiSi
- AI 研判：用户确认为备份操作，补录审批 | 状态：已处置

**4. 可疑 PowerShell 脚本执行（INC-2026-0815）**
- 等级：CRITICAL | 来源：10.5.10.22 (PC-0021)
- AI 研判：IT 运维自动化巡检脚本误报 | 状态：已忽略

**5. C&C 心跳连接（INC-2026-0816）**
- 等级：CRITICAL | 来源：172.16.50.4
- AI 研判：域名匹配威胁情报库（恶意） | 状态：研判中

如需对某条事件进行深度调查，请提供事件 ID。`,

  "如何防范暴力破解攻击？": `根据《东航金控有限责任公司网络安全管理手册（2024年版）》及行业最佳实践，以下是暴力破解攻击的防范建议：

## 立即执行的防护措施

**1. 账户安全加固**
- 强制实施高强度密码策略（≥12位，含大小写+特殊字符）
- 开启多因素认证（MFA），推荐 TOTP 或 FIDO2 硬件密钥
- 密码到期前7天自动提醒修改

**2. 网络层防护**
- 配置 SSH/邮件服务的登录频率限制（单IP ≤5次/分钟）
- 部署 WAF/IPS 策略：同一IP在短时间内连续失败登录自动封禁
- 将高风险 IP 段（如 185.220.101.0/24）加入黑名单

**3. 监控与响应**
- 开启实时的异常登录检测告警
- 建立攻击 IP 知识图谱，实现跨事件关联分析
- 每季度进行密码攻击模拟演练

## 长期安全架构建议

| 领域 | 建议措施 |
|------|---------|
| 身份管理 | 部署零信任架构，最小权限原则 |
| 认证方式 | 推进无密码认证（Passkey/生物识别） |
| 威胁情报 | 接入商业威胁情报源，自动化 IP 信誉评分 |
| 安全运营 | 建立 7x24 小时安全监控值班制度 |

当前系统已具备基础的频率检测和封禁能力，建议优先开启 MFA 和知识图谱关联功能。`,

  "分析IP 185.220.101.47": `## IP 185.220.101.47 深度分析报告

### 基本信息
| 属性 | 值 |
|------|-----|
| IP 地址 | 185.220.101.47 |
| 归属地 | 拉萨/香港 |
| ASN | AS207990 |
| 威胁情报评分 | ⚠️ 高风险（86/100） |
| 信誉标记 | 360标记为高风险IP节点 |

### 关联安全事件

| 日期 | 攻击目标 | 失败次数 | 攻击时间窗口 |
|------|---------|---------|------------|
| 2026-05-09 | itservice7@kiiik.com | 38次 | 22:10-22:40 |
| 2026-05-11 | itservice7@kiiik.com | 45次 | 22:30-23:00 |
| 2026-05-13 | itservice7@kiiik.com | 52次 | 22:00-22:50 |
| 2026-05-15 | itservice7@kiiik.com | 60次 | 09:14开始 |

### 攻击特征分析
- **攻击模式**：自动化字典攻击，间隔平均 0.18秒/次
- **时间规律**：集中在 22:00 后非工作时段
- **累计攻击**：近7天累计试错 195次
- **攻击趋势**：频率逐日攀升（38→45→52→60次）

### 处置建议
1. **立即封禁**：在边界防火墙添加 ACL 拒绝该 IP 所有流量
2. **溯源调查**：检查该 IP 是否关联其他内部失陷主机
3. **情报共享**：将 IP 特征推送至威胁情报平台`,

  "最新威胁情报摘要": `## 威胁情报日报摘要

### 行业相关威胁
**1. 针对金融行业的勒索软件活动上升 35%**
- 主要变种：LockBit 4.0、BlackCat
- 攻击入口：钓鱼邮件 + RDP 暴力破解
- 建议：加强邮件网关过滤，关闭公网 RDP 端口

**2. 新型钓鱼工具包 "FishHook" 活跃**
- 可绕过主流邮件安全网关检测
- 利用合法域名进行 C2 通信
- 已发现针对国内金融企业的攻击样本

**3. 多起数据泄露事件**
- 某券商员工误将包含 2 万条客户信息的 Excel 上传至 GitHub
- 教训：需加强代码仓库敏感信息扫描和 DLP 策略

### 高危漏洞预警
| 漏洞编号 | 影响产品 | 风险等级 | 建议 |
|---------|---------|---------|------|
| CVE-2026-1234 | Apache Tomcat 10.x | 严重 | 立即升级至 10.1.34+ |
| CVE-2026-5678 | Windows LDAP 远程代码执行 | 高危 | 安装 5月安全更新 |
| CVE-2026-9012 | Zabbix 未授权访问 | 中危 | 限制管理接口访问 |

### 攻击趋势
- 针对 SSH 服务的暴力破解攻击相比上月增加 42%
- 利用 AI 生成鱼叉邮件的攻击量显著上升
- 供应链攻击（通过 npm/PyPI 投毒）持续活跃`,

  "安全运维最佳实践": `## 安全运维最佳实践指南

### 日常运维 Checklist

**每日必做**
- [ ] 检查安全事件告警面板中的未处理事件
- [ ] 查看威胁情报更新和 IoC 推送
- [ ] 确认关键系统（AD、邮件、VPN）运行状态
- [ ] 检查备份任务执行状态

**每周必做**
- [ ] 审查高危账户的登录日志
- [ ] 检查防火墙规则变更记录
- [ ] 更新端点防护软件的病毒库
- [ ] 分析近7天的异常行为趋势

**每月必做**
- [ ] 全量漏洞扫描并生成修复报告
- [ ] 审查特权账户访问权限
- [ ] 执行员工安全意识培训测验
- [ ] 检查事件响应预案的有效性

### 关键安全指标（KPI）
| 指标 | 目标值 | 当前值 | 状态 |
|------|-------|-------|------|
| MTTR（平均响应时间） | < 30分钟 | 22分钟 | ✅ |
| 漏洞修复率（30天内） | > 95% | 92% | ⚠️ |
| 安全事件误报率 | < 15% | 12% | ✅ |
| 员工安全培训覆盖率 | 100% | 67% | ❌ |

### 推荐工具链
- **SIEM**: 态势感知平台（当前使用）
- **EDR**: CrowdStrike / 深信服
- **漏洞管理**: Nessus Professional / 绿盟
- **威胁情报**: VirusTotal + 360 威胁情报`,
};

const defaultResponses = [
  "这是一个很好的问题！根据我的安全知识库分析，建议从以下几个方面入手：\n\n1. **事件溯源**：首先确认告警的原始日志来源，检查相关时间窗口内所有关联日志\n2. **资产关联**：将告警涉及的 IP、账户、设备与 CMDB 中的资产信息进行关联\n3. **行为分析**：分析异常行为的特征模式（频率、时间规律、目标范围）\n4. **情报验证**：在威胁情报库中检索相关 IoC（IP、域名、Hash）",
  "基于当前的安全态势数据，我可以为您提供以下分析：\n\n当前系统共监控 **1,284** 条安全事件记录，其中：\n- **CRITICAL（严重）**: 占总量的 23%\n- **HIGH（高危）**: 占总量的 31%\n- **MEDIUM（中等）**: 占总量的 28%\n- **LOW（低危）**: 占总量的 18%\n\n主要攻击类型分布：暴力破解 35%、钓鱼邮件 28%、恶意软件 20%、其他 17%",
  "关于这个问题，我查阅了知识库中的相关安全策略文档。根据《东航金控网络安全管理手册（2024年版）》第 4.2 节：\n\n> 「所有涉及敏感数据访问的操作，必须经过审批流程，并保留完整的操作审计日志。异常批量数据访问行为需在 15 分钟内触发告警。」\n\n建议您检查以下配置：\n1. DLP 策略是否覆盖了所有敏感数据源\n2. 审计日志保留周期是否符合合规要求（≥180天）\n3. 批量操作告警阈值是否合理",
];

function getCurrentTime() {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current && displayed === text) return;
    doneRef.current = false;
    let idx = 0;
    const speed = 10 + Math.floor(Math.random() * 15);

    const interval = setInterval(() => {
      if (idx < text.length) {
        setDisplayed(text.slice(0, idx + 1));
        idx++;
      } else {
        setDisplayed(text);
        doneRef.current = true;
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <span className="whitespace-pre-wrap">
      {displayed}
      <span className="inline-block w-[2px] h-[14px] bg-[#00b4d8] ml-0.5 align-middle typing-cursor" />
    </span>
  );
}

function MarkdownText({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];
  let tableKey: number | null = null;

  const flushTable = () => {
    if (tableHeaders.length > 0 && tableRows.length > 0) {
      elements.push(
        <div key={`table-${tableKey}`} className="my-2 rounded-lg border border-[#e2e8f0] overflow-hidden text-[11px]">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                {tableHeaders.map((h, i) => (
                  <th key={i} className="px-3 py-1.5 text-left font-bold text-[#475569] text-[10px] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {tableRows.map((row, ri) => (
                <tr key={ri} className="hover:bg-[#f8fafc]/50">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-1.5 text-[#334155]">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    tableHeaders = [];
    tableRows = [];
    inTable = false;
  };

  lines.forEach((line, i) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const cells = trimmed.split("|").filter(c => c.trim()).map(c => c.trim());
      const isSeparator = cells.every(c => /^[-:\s]+$/.test(c));

      if (isSeparator) {
        return;
      }

      if (!inTable) {
        inTable = true;
        tableKey = i;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      return;
    }

    if (inTable) {
      flushTable();
    }

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-sm font-bold text-[#0f172a] mt-3 mb-1.5">{trimmed.slice(3)}</h2>
      );
    } else if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-xs font-bold text-[#334155] mt-2 mb-1">{trimmed.slice(4)}</h3>
      );
    } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      elements.push(
        <p key={i} className="text-xs font-bold text-[#0f172a] mt-2 mb-1">{trimmed.replace(/\*\*/g, "")}</p>
      );
    } else if (trimmed.startsWith("- [ ] ") || trimmed.startsWith("- [x] ")) {
      const checked = trimmed.startsWith("- [x] ");
      const text = trimmed.slice(6);
      elements.push(
        <div key={i} className="flex items-center gap-1.5 py-0.5">
          <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${checked ? "bg-emerald-500 border-emerald-500 text-white" : "border-[#94a3b8]"}`}>
            {checked ? "✓" : ""}
          </span>
          <span className={`text-[11px] ${checked ? "text-[#64748b] line-through" : "text-[#334155]"}`}>{text}</span>
        </div>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <div key={i} className="flex items-start gap-1.5 py-0.5">
          <span className="w-1 h-1 rounded-full bg-[#00b4d8] mt-1 shrink-0" />
          <span className="text-[11px] text-[#334155] leading-relaxed">{trimmed.slice(2)}</span>
        </div>
      );
    } else if (/^\d+\./.test(trimmed)) {
      const num = trimmed.match(/^\d+/)?.[0];
      const text = trimmed.replace(/^\d+\.\s*/, "");
      elements.push(
        <div key={i} className="flex items-start gap-2 py-0.5">
          <span className="text-[10px] font-bold text-[#00b4d8] w-4 shrink-0 text-right">{num}.</span>
          <span className="text-[11px] text-[#334155] leading-relaxed">{text}</span>
        </div>
      );
    } else if (trimmed.startsWith("> ")) {
      elements.push(
        <div key={i} className="my-1.5 pl-3 border-l-2 border-[#00b4d8]/40 bg-[#f0f9ff] py-1.5 pr-2 rounded-r">
          <span className="text-[11px] text-[#475569] italic">{trimmed.slice(2)}</span>
        </div>
      );
    } else if (trimmed === "") {
      elements.push(<div key={i} className="h-1" />);
    } else if (/^```/.test(trimmed)) {
      // Skip code block markers
    } else {
      elements.push(
        <p key={i} className="text-[11px] text-[#334155] leading-relaxed">{trimmed}</p>
      );
    }
  });

  if (inTable) {
    flushTable();
  }

  return <div className="space-y-0.5">{elements}</div>;
}

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const thinkingTexts = [
    "正在理解您的问题...",
    "正在检索安全知识库...",
    "正在关联威胁情报数据...",
    "正在综合分析事件信息...",
    "正在生成专业回答...",
    "正在验证回答准确性...",
  ];
  const [thinkingText, setThinkingText] = useState(thinkingTexts[0]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  useEffect(() => {
    if (!isThinking) return;
    const interval = setInterval(() => {
      setThinkingText(thinkingTexts[Math.floor(Math.random() * thinkingTexts.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, [isThinking]);

  function submitQuestion(question: string) {
    const q = question.trim();
    if (!q || isThinking) return;

    setShowSuggestions(false);
    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: q,
      timestamp: getCurrentTime(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    const assistantId = generateId();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: getCurrentTime(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, assistantMsg]);

    const responseText = mockResponses[q] || defaultResponses[Math.floor(Math.random() * defaultResponses.length)];

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: responseText, isStreaming: false }
            : m
        )
      );
      setIsThinking(false);
    }, 800 + Math.random() * 600);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitQuestion(input);
    }
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      <header className="h-12 bg-white/80 backdrop-blur-sm border-b border-dashboard-border flex items-center justify-between px-6 relative">
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-[#00b4d8]/20 to-[#00b4d8]/5">
            <MessageSquare className="w-4 h-4 text-[#00b4d8]" />
          </div>
          <h2 className="text-sm font-semibold text-dashboard-text">
            AI 安全问答助手
          </h2>
          <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-medium">
            GPT-4o
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-dashboard-text-dim flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            知识库已同步
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {messages.length === 0 && !showSuggestions && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#00b4d8]/10 to-[#00b4d8]/5 inline-flex mb-3">
                <MessageSquare className="w-8 h-8 text-[#00b4d8]/60" />
              </div>
              <p className="text-sm text-dashboard-text-dim">开始对话，向我提问安全相关问题</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 animate-fade-in-up ${
              msg.role === "user" ? "flex-row-reverse" : ""
            }`}
            style={{ animationDuration: "0.3s" }}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-blue-600 to-blue-500 shadow-sm shadow-blue-500/20"
                  : "bg-gradient-to-br from-[#00b4d8] to-[#0096b7] shadow-sm shadow-[#00b4d8]/20"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Bot className="w-4 h-4 text-white" />
              )}
            </div>
            <div
              className={`max-w-[70%] min-w-0 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-2.5 shadow-sm shadow-blue-500/10"
                  : "bg-white border border-dashboard-border rounded-2xl rounded-tl-md px-4 py-3 shadow-sm"
              }`}
            >
              {msg.role === "user" ? (
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              ) : msg.isStreaming ? (
                <div className="min-h-[1.2em]">
                  <TypewriterText
                    text={msg.content}
                    onComplete={() => {
                      setMessages((prev) =>
                        prev.map((m) =>
                          m.id === msg.id ? { ...m, isStreaming: false } : m
                        )
                      );
                    }}
                  />
                </div>
              ) : (
                <MarkdownText content={msg.content} />
              )}
              <div className={`mt-1.5 flex items-center gap-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}>
                <span className={`text-[10px] ${
                  msg.role === "user" ? "text-blue-200" : "text-dashboard-text-dim"
                }`}>
                  {msg.timestamp}
                </span>
                {msg.role === "assistant" && !msg.isStreaming && (
                  <button
                    onClick={() => submitQuestion(msg.content)}
                    className="opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity"
                  >
                    <RefreshCw className="w-3 h-3 text-dashboard-text-dim hover:text-[#00b4d8]" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex items-start gap-3 animate-fade-in-up">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00b4d8] to-[#0096b7] flex items-center justify-center shrink-0 shadow-sm shadow-[#00b4d8]/20">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-dashboard-border rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <div className="absolute w-4 h-4 rounded-full bg-[#00b4d8]/20 animate-ping" />
                  <RefreshCw className="w-3 h-3 text-[#00b4d8] animate-spin relative z-10" />
                </div>
                <span className="text-[11px] text-dashboard-text-muted">{thinkingText}</span>
                <span className="inline-flex gap-[2px]">
                  <span className="w-1 h-1 rounded-full bg-[#94a3b8] animate-thinking-dot" style={{ animationDelay: "0ms" }} />
                  <span className="w-1 h-1 rounded-full bg-[#94a3b8] animate-thinking-dot" style={{ animationDelay: "200ms" }} />
                  <span className="w-1 h-1 rounded-full bg-[#94a3b8] animate-thinking-dot" style={{ animationDelay: "400ms" }} />
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {showSuggestions && messages.length === 0 && (
        <div className="px-6 pb-4">
          <div className="bg-white border border-dashboard-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#00b4d8]" />
              <span className="text-xs font-semibold text-dashboard-text">你可以问我这些问题</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => submitQuestion(item.label)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${item.bg} ${item.color} hover:shadow-sm active:scale-[0.98] border border-transparent hover:border-current/20 text-left`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="px-6 pb-4 pt-2">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入您的安全相关问题，按 Enter 发送..."
            rows={1}
            className="w-full bg-white border border-dashboard-border rounded-xl pl-4 pr-12 py-3 text-xs text-dashboard-text placeholder:text-dashboard-text-dim focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none transition-all duration-200 shadow-sm"
            style={{ minHeight: "44px", maxHeight: "120px" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 120) + "px";
            }}
          />
          <button
            onClick={() => submitQuestion(input)}
            disabled={!input.trim() || isThinking}
            className={`absolute right-1.5 bottom-1.5 p-2 rounded-lg transition-all duration-200 ${
              input.trim() && !isThinking
                ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/25 active:scale-[0.95]"
                : "bg-slate-100 text-dashboard-text-dim cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-dashboard-text-dim mt-1.5 text-center">
          AI 回答仅供参考，关键安全决策请结合专业判断
        </p>
      </div>
    </div>
  );
}