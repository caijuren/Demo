import { useState, useRef, useEffect } from "react";
import {
  Send,
  Bot,
  Loader2,
  Sparkles,
  Slash,
  Lightbulb,
  AlertCircle,
  Search,
  Shield,
  MessageSquare,
  User,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  { icon: Lightbulb, label: "安全运维最佳实践" },
  { icon: Slash, label: "钓鱼邮件识别要点" },
  { icon: AlertCircle, label: "如何识别钓鱼邮件?" },
  { icon: Search, label: "常见的网络攻击类型有哪些?" },
  { icon: Shield, label: "什么是零信任安全架构?" },
];

const suggestionIcons: Record<string, string> = {
  "安全运维最佳实践": "#10b981",
  "钓鱼邮件识别要点": "#ef4444",
  "如何识别钓鱼邮件?": "#6366f1",
  "常见的网络攻击类型有哪些?": "#06b6d4",
  "什么是零信任安全架构?": "#8b5cf6",
};

const mockResponses: Record<string, string> = {
  "主机安全防护软件的序列号是多少?授权有效期到何时?": `**主机安全防护软件的序列号为:**
PAynKront2tW/1l1Dr LGP2+CK00VmQqT xz jrKCNWL0epgf Lzg+e/9zAuRu04pkTJETwjqtNpLHa lfovZ2RIYS641FOF76366IE2/b+7WZP6zeGNU5RVsXxg84d9fZ/bigI0raXXFM9uKSeMK5/tt+eKQNs0jgNxcap0KL52A6ul=

**授权有效期存在以下情况:**
- 有效期标注为2029-06-28和2029-10-15
- 但资产状态备注显示"已过期"，需进一步核实实际生效状态。`,

  "堡垒机设备的授权有效期到何时、维保有效期到何时?": `堡垒机设备共有两台，其授权有效期均为2099年12月31日，维保有效期均为2028年12月25日。`,

  "aTrust-1000-B1050C在机房的哪个位置?管理员或负责人是谁?过保时间到多少?": `根据CMDB资产数据，aTrust-1000-B1050C的资产编号为JK11A030000125052817634，设备名称为VPN-aTrust-1000-B1050C。

**机房位置:** 通信机房，机柜编号B1F-B2。

**管理员/负责人:** 管理员为张博

**过保时间:** 过保日期为2029-09-25。`,

  "10.71.18.210是谁的终端IP?": `根据 CMDB 终端资产数据，10.71.18.210 归属信息如下：

| 归属信息项 | 具体内容 |
|-----------|---------|
| 责任人 | 孙秀娟 |
| 终端名称 | JK-0-XZ-0011 |
| 终端分组 | 全网终端/金控云桌面 |
| 终端状态 | 在线(正常运行) |
| 操作系统 | Windows 10 Enterprise (已激活) |`,

  "IT监控平台访问地址是多少?": `IT监控平台的访问地址为：\`http://10.71.160.10:8088/portal\`

> 该信息提取自您上传的《标准应用资产.xlsx》文件中「标准应用」工作表的对应条目，完整行信息为：

| 归属信息项 | 具体内容 |
|-----------|---------|
| 资源名称 | IT监控平台 |
| IP地址/访问地址 | \`http://10.71.160.10:8088/portal\` |
| URL可用性 | 正常 |
| 响应时间 | — |`,

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

// ── Sub-components ──────────────────────────────────────────

function renderBold(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
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
        <div key={`table-${tableKey}`} className="my-3 rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {tableHeaders.map((h, i) => (
                  <th key={i} className="px-4 py-2.5 text-left font-semibold text-slate-600 text-xs tracking-wide">
                    {renderBold(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tableRows.map((row, ri) => (
                <tr key={ri} className="hover:bg-slate-50/50">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-2.5 text-slate-700 text-sm">{renderBold(cell)}</td>
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
      const isSep = cells.every(c => /^[-:\s]+$/.test(c));
      if (isSep) return;
      if (!inTable) { inTable = true; tableKey = i; tableHeaders = cells; }
      else tableRows.push(cells);
      return;
    }
    if (inTable) flushTable();

    if (trimmed.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-base font-bold text-slate-900 mt-6 mb-2.5 leading-relaxed">{renderBold(trimmed.slice(3))}</h2>
      );
    } else if (trimmed.startsWith("### ")) {
      elements.push(
        <h3 key={i} className="text-sm font-bold text-slate-800 mt-4 mb-2 leading-relaxed">{renderBold(trimmed.slice(4))}</h3>
      );
    } else if (trimmed.startsWith("- [x] ")) {
      elements.push(
        <div key={i} className="flex items-center gap-2.5 py-0.5 group">
          <span className="w-4 h-4 rounded flex items-center justify-center bg-emerald-500 text-white text-[10px] shrink-0 shadow-sm shadow-emerald-200">✓</span>
          <span className="text-sm text-slate-400 line-through">{renderBold(trimmed.slice(6))}</span>
        </div>
      );
    } else if (trimmed.startsWith("- [ ] ")) {
      elements.push(
        <div key={i} className="flex items-center gap-2.5 py-0.5 group">
          <span className="w-4 h-4 rounded border-2 border-slate-300 shrink-0 group-hover:border-slate-400 transition-colors" />
          <span className="text-sm text-slate-700">{renderBold(trimmed.slice(6))}</span>
        </div>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      elements.push(
        <div key={i} className="flex items-start gap-2.5 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-[7px] shrink-0 ring-2 ring-cyan-100" />
          <span className="text-sm text-slate-700 leading-relaxed">{renderBold(trimmed.slice(2))}</span>
        </div>
      );
    } else if (/^\d+\./.test(trimmed)) {
      const num = trimmed.match(/^\d+/)?.[0];
      const text = trimmed.replace(/^\d+\.\s*/, "");
      elements.push(
        <div key={i} className="flex items-start gap-2.5 py-0.5">
          <span className="text-xs font-bold text-cyan-600 w-5 shrink-0 text-right mt-0.5">{num}.</span>
          <span className="text-sm text-slate-700 leading-relaxed">{renderBold(text)}</span>
        </div>
      );
    } else if (trimmed.startsWith("> ")) {
      elements.push(
        <div key={i} className="my-2.5 pl-4 border-l-[3px] border-cyan-400 bg-cyan-50/60 py-2.5 pr-4 rounded-r-lg">
          <span className="text-sm text-slate-600 italic leading-relaxed">{renderBold(trimmed.slice(2))}</span>
        </div>
      );
    } else if (trimmed === "") {
      elements.push(<div key={i} className="h-2" />);
    } else if (trimmed.startsWith("**") && trimmed.endsWith("**")) {
      elements.push(
        <p key={i} className="text-sm font-semibold text-slate-800 mt-3 mb-1.5">{trimmed.slice(2, -2)}</p>
      );
    } else {
      const isLongText = trimmed.length > 60 && !trimmed.includes(" ");
      if (isLongText) {
        elements.push(
          <div key={i} className="my-2 px-3 py-2.5 bg-slate-50/80 rounded-lg border border-slate-100 text-xs text-slate-600 font-mono leading-relaxed overflow-x-auto select-all whitespace-nowrap">
            {trimmed}
          </div>
        );
      } else {
        elements.push(
          <p key={i} className="text-sm text-slate-700 leading-7 break-words">{renderBold(trimmed)}</p>
        );
      }
    }
  });
  if (inTable) flushTable();
  return <div className="space-y-0.5">{elements}</div>;
}

// ── Main Component ──────────────────────────────────────────

export default function AiChat() {
  const STORAGE_KEY = "ai_chat_messages";

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const thinkingTexts = [
    "正在解析您的问题...",
    "正在检索 CMDB 资产数据...",
    "正在匹配设备信息...",
    "正在验证资产关联关系...",
    "正在整理分析结果...",
  ];
  const [thinkingText, setThinkingText] = useState(thinkingTexts[0]);
  const [thinkingStep, setThinkingStep] = useState(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking, thinkingStep]);

  useEffect(() => {
    try {
      localStorage.setItem("ai_chat_messages", JSON.stringify(messages));
    } catch { /* ignore */ }
  }, [messages]);

  useEffect(() => {
    if (!isThinking) {
      setThinkingStep(0);
      setThinkingText(thinkingTexts[0]);
      return;
    }
    const interval = setInterval(() => {
      setThinkingStep((prev) => {
        const next = prev + 1;
        if (next < thinkingTexts.length) setThinkingText(thinkingTexts[next]);
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [isThinking]);

  function generateId() { return Math.random().toString(36).substring(2, 9); }

  function submitQuestion(question: string) {
    const q = question.trim();
    if (!q || isThinking) return;
    const userMsg: Message = { id: generateId(), role: "user", content: q };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);
    const assistantId = generateId();
    setMessages(prev => [...prev, { id: assistantId, role: "assistant", content: "" }]);
    const responseText = mockResponses[q] || defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    const cmdbQuestions = [
      "主机安全防护软件的序列号是多少?授权有效期到何时?",
      "堡垒机设备的授权有效期到何时、维保有效期到何时?",
      "aTrust-1000-B1050C在机房的哪个位置?管理员或负责人是谁?过保时间到多少?",
      "10.71.18.210是谁的终端IP?",
      "IT监控平台访问地址是多少?",
    ];
    const delay = cmdbQuestions.includes(q) ? 5000 + Math.random() * 1500 : 2000 + Math.random() * 1000;
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: responseText } : m));
      setIsThinking(false);
    }, delay);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitQuestion(input);
    }
  }

  const isEmpty = messages.length === 0;

  // ── Thinking bubble (shared between both occurrences) ──
  const thinkingBubble = (
    <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm shadow-slate-200/50">
      <div className="flex items-center gap-3">
        <span className="relative flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400/40" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500" />
        </span>
        <span className="text-sm text-slate-400 font-medium">{thinkingText}</span>
        <span className="flex gap-1">
          {[0, 200, 400].map(d => (
            <span key={d} className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-thinking-dot" style={{ animationDelay: `${d}ms` }} />
          ))}
        </span>
      </div>
      <div className="flex gap-1 mt-3">
        {thinkingTexts.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ease-out ${
              i <= thinkingStep ? "bg-gradient-to-r from-cyan-400 to-cyan-500 w-5" : "bg-slate-200 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-b from-white to-slate-50/50">
      {/* ── Chat area ── */}
      <div className="flex-1 overflow-y-auto scroll-smooth">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-6 md:py-10">

          {isEmpty ? (
            /* ── Empty state ── */
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-240px)]">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-[28px] blur-xl" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 ring-1 ring-white/20">
                  <Bot className="w-8 h-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1.5 tracking-tight">安全分析助手</h1>
              <p className="text-sm text-slate-400 mb-8">问我任何安全相关的问题，快速获取专业分析</p>

              <div className="w-full max-w-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {suggestions.map(({ icon: Icon, label }) => {
                    const accent = suggestionIcons[label] || "#06b6d4";
                    return (
                      <button
                        key={label}
                        onClick={() => submitQuestion(label)}
                        className="group relative flex items-center gap-3 px-4 py-3.5 rounded-xl bg-white border border-slate-200/70 hover:border-slate-300/80 hover:shadow-md hover:shadow-slate-200/60 transition-all duration-200 text-left active:scale-[0.98]"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200"
                          style={{ backgroundColor: `${accent}12` }}
                        >
                          <Icon className="w-4 h-4 transition-colors duration-200" style={{ color: accent }} />
                        </div>
                        <span className="text-sm text-slate-600 group-hover:text-slate-900 leading-snug transition-colors duration-200 line-clamp-2">
                          {label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* ── Messages ── */
            <div className="space-y-5">
              {messages.map((msg, idx) => {
                const isLastAssistant = idx === messages.length - 1 && msg.role === "assistant";
                const showThinking = isLastAssistant && isThinking && !msg.content;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""} animate-fade-in-up`}
                    style={{ animationDuration: "0.35s", animationFillMode: "both" }}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ring-2 ring-white shadow-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 ring-blue-100 shadow-blue-200/50"
                          : "bg-gradient-to-br from-cyan-500 to-blue-600 ring-cyan-100 shadow-cyan-200/50"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>

                    {/* Bubble */}
                    {msg.role === "user" ? (
                      <div className="max-w-[78%] flex justify-end">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-2.5 shadow-md shadow-blue-200/50">
                          <p className="text-sm leading-relaxed font-medium break-words">{msg.content}</p>
                        </div>
                      </div>
                    ) : showThinking ? (
                      <div className="w-[75%]">
                        {thinkingBubble}
                      </div>
                    ) : msg.content ? (
                      <div className="w-[75%]">
                        <div className="bg-emerald-50/80 border border-emerald-100/60 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm shadow-emerald-100/30 break-words">
                          <MarkdownText content={msg.content} />
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}

              {/* Extra thinking row when continuing after a completed message */}
              {isThinking && messages[messages.length - 1]?.role === "assistant" && messages[messages.length - 1]?.content && (
                <div className="flex items-start gap-3 animate-fade-in-up" style={{ animationDuration: "0.35s" }}>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 ring-2 ring-cyan-100 shadow-sm shadow-cyan-200/50">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  {thinkingBubble}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* ── Input area ── */}
      <div className="relative bg-white/95 safari-blur border-t border-slate-200/60 shadow-[0_-1px_6px_-1px_rgba(0,0,0,0.04)]">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-3.5">
          <div className="relative flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="问我任何安全相关问题..."
                rows={1}
                className="w-full bg-slate-50/80 border border-slate-200/80 rounded-xl pl-4 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/25 focus:border-cyan-400/50 resize-none transition-all duration-200"
                style={{ minHeight: "48px", maxHeight: "120px" }}
                onInput={e => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = Math.min(el.scrollHeight, 120) + "px";
                }}
              />
              <button
                onClick={() => submitQuestion(input)}
                disabled={!input.trim() || isThinking}
                className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all duration-200 ${
                  input.trim() && !isThinking
                    ? "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-sm shadow-cyan-200/50 hover:shadow-md hover:shadow-cyan-200/60 active:scale-95"
                    : "bg-slate-100 cursor-not-allowed"
                }`}
              >
                <Send className={`w-4 h-4 ${
                  input.trim() && !isThinking ? "text-white" : "text-cyan-400"
                }`} />
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-2.5 tracking-wide">
            AI 回答仅供参考，关键安全决策请结合专业判断
          </p>
        </div>
      </div>
    </div>
  );
}