import { useState, useEffect, useRef } from "react";
import { X, Brain, AlertTriangle, Clock, Mail, Globe, LogIn, Search, CheckCircle2, Loader2 } from "lucide-react";
import type { AlertItem, AlertCategory } from "@/types";

interface AiAnalysisModalProps {
  alert: AlertItem | null;
  onClose: () => void;
}

interface CheckItem {
  label: string;
  detail: string;
  source?: string;
  supported: boolean;
}

interface InvestigationGroup {
  title: string;
  items: CheckItem[];
}

interface StreamContent {
  severity: string;
  investigationTitle: string;
  groups: InvestigationGroup[];
}

const phishingInvestigation: StreamContent = {
  severity: "严重",
  investigationTitle: "调查东航金控钓鱼邮件的发送方及扩散范围",
  groups: [
    {
      title: "发件人背景与语境合理性分析",
      items: [
        { label: "东航金控发件人身份核验", detail: "发件人自称东航金控财务总监张明华，对公邮箱域名 dhjk-finance.com 与官方域名 dhjkholding.com 不符，疑似伪造。且发件人显示名称中包含\u201c财务部\u201d字样，意图掩盖真实邮箱地址，属于典型的社会工程学伪装手段", source: "威胁情报源待定", supported: true },
        { label: "邮件内容紧迫性检测", detail: "邮件主题为\u201c紧急：跨境付款审批（逾期将产生违约金）\u201d，正文大量使用\u201c立即处理\u201d\u201c逾期追责\u201d\u201c高层督办\u201d等制造紧迫感的话术，意图降低收件人的理性判断能力，符合社交工程攻击的典型心理操纵模型", supported: true },
        { label: "Reply-To 地址校验", detail: "Reply-To 地址设为 pay-dhjk@outlook.com，与发件人地址不一致。这种设置通常用于拦截受害者的回复邮件，使钓鱼行为不易被察觉，同时为攻击者提供与受害者直接通信的渠道", supported: true },
      ],
    },
    {
      title: "仿冒域名与字形资产欺骗识别",
      items: [
        { label: "东航金控域名相似度检测", detail: "发件域名 dhjk-finance.com 与东航金控官方域名 dhjkholding.com 仅差 3 个字符（finance vs holding），属于典型的\u201c字形欺骗\u201d（Typosquatting）攻击手法。域名注册时间为 2026-05-10（仅 8 天前），注册商为 GoDaddy 境外代理，注册人信息使用隐私保护服务隐藏", supported: true },
        { label: "IP 信誉检测", detail: "发件服务器 IP 45.87.153.220 归属俄罗斯莫斯科 AS197068 自治域，该 IP 已被 VirusTotal、AbuseIPDB、AlienVault OTX 共 3 个威胁情报源标记为恶意标签，关联历史钓鱼活动 12 起", supported: true },
      ],
    },
    {
      title: "涉及域名的威胁情报全量对撞",
      items: [
        { label: "SPF / DKIM / DMARC 邮件认证验证", detail: "dhjk-finance.com 未配置 SPF 记录（DNS 查询返回 NXDOMAIN），DKIM 签名算法不匹配导致验证失败，DMARC 策略为 p=none（未设置拒绝策略）。邮件未通过任何标准邮件认证检查，强烈建议标记为欺诈邮件", supported: true },
        { label: "域名注册时间与行为分析", detail: "Whois 查询显示域名于 2026-05-10 注册，注册时长仅 8 天，使用隐私保护服务隐藏注册人。根据历史数据，钓鱼域名平均存活周期为 14-21 天，该域名正处于活跃攻击窗口期", supported: true },
      ],
    },
    {
      title: "历史往来邮件",
      items: [
        { label: "东航金控邮件历史记录排查", detail: "近 90 天内东航金控邮件系统中无其他用户收到来自 dhjk-finance.com 或与 dhjkholding.com 相似域名的邮件。该发件人地址首次出现在东航金控邮件生态中，属于全新的攻击向量", supported: true },
      ],
    },
    {
      title: "扩散范围审计：同类邮件排查",
      items: [
        { label: "收件人完整列表", detail: "该钓鱼邮件共发送至东航金控 6 个邮箱地址：资金管理部高级主管王丽华、资金管理部主管赵刚、资金管理部专员刘洋、资金管理部专员陈雪、财务部高级财务专员李伟、财务部会计主管周敏，全部为财务相关岗位", supported: true },
        { label: "攻击类型判定", detail: "定向攻击（Spear Phishing），仅发送 6 人，目标精准锁定东航金控资金审批链上的关键岗位。结合发件人自称 CFO 和\u201c紧急转账\u201d话术，判定为典型的 CEO Fraud / Business Email Compromise（BEC）攻击类型", supported: true },
      ],
    },
    {
      title: "网络面审计：员工点击行为核验",
      items: [
        { label: "邮件转发行为审计", detail: "收件人赵刚已将邮件转发至同部门 2 名下属，扩散链路扩大到 8 人。需立即排查转发路径上的所有邮箱是否已执行恶意操作", supported: true },
        { label: "邮件回复行为审计", detail: "收件人刘洋和周敏已向攻击者回复邮件，其中刘洋回复\u201c已收到，请提供更多信息\u201d，暴露了真实姓名和职位信息；周敏点击了附件中的\u201c付款审批单.xlsm\u201d，终端已触发宏执行", supported: true },
      ],
    },
    {
      title: "身份面审计：受害者账号登录异常排查",
      items: [
        { label: "收件人价值评估", detail: "王丽华（资金管理部主管）和李伟（高级财务专员）均具备东航金控资金审批系统的操作权限，属于高价值目标。其中王丽华拥有单笔 500 万以内的付款审批权限", source: "使用对话助手的匹配能力", supported: true },
      ],
    },
    {
      title: "资产状态审计：凭据变更与异常操作",
      items: [
        { label: "受波及的用户账号收件后状态扫描", detail: "周敏的东航金控企业邮箱账号在点击附件后的 30 分钟内触发密码重置请求，重置来源 IP 为 185.225.69.100（荷兰），该 IP 与 ALT-001 告警中的 C2 基础设施关联。刘洋的邮箱在收件后 1 小时也出现密码重置操作，疑似攻击者通过已窃取的凭据进行横向凭证试探", supported: true },
        { label: "密码重置检测", detail: "周敏的东航金控企业邮箱账号在点击附件后的 30 分钟内出现密码重置请求，重置来源 IP 为 185.225.69.100（荷兰），与攻击者基础设施关联。刘洋的邮箱在收件后 1 小时也触发了密码重置", source: "来源待定", supported: true },
      ],
    },
  ],
};

const phishingThinkingMessages = [
  "正在提取邮件头信息...",
  "正在分析发件人身份...",
  "正在比对欺诈域名库...",
  "正在验证 SPF/DKIM/DMARC...",
  "正在查询威胁情报库...",
  "正在追溯历史通信记录...",
  "正在审计邮件扩散范围...",
  "正在核查收件人点击行为...",
  "正在评估受害者价值...",
  "正在比对设备白名单...",
  "正在交叉关联攻击指标...",
  "正在生成综合分析结论...",
];

const internetBehaviorInvestigation: StreamContent = {
  severity: "中等",
  investigationTitle: "东航金控员工上网行为安全事件全链路溯源分析",
  groups: [
    {
      title: "告警事件原始信息",
      items: [
        { label: "告警源与事件类型", detail: "告警来源：东航金控上网行为管理系统（网管平台（Sangfor AC 6.0）。事件类型：违规访问 + 异常数据外传 + 恶意域名通信。告警触发时间：2026-05-18 13:58:44，关联 3 个子事件", supported: true },
        { label: "关联告警编号", detail: "本次事件关联 ALT-003、ALT-004、ALT-005 三条告警，分别涉及数据泄露风险、恶意软件感染、违规上网三种类别，可能存在关联性", supported: true },
      ],
    },
    {
      title: "实体解析：IP → 主机 → 用户 → 资产归属",
      items: [
        { label: "IP 地址溯源", detail: "内部 IP 10.88.12.105 归属东航金控国际业务部 VLAN-302，DHCP 分配记录显示该 IP 对应主机名 DHJK-WS-2024-IB-015", supported: true },
        { label: "主机资产信息", detail: "主机型号：Lenovo ThinkPad X1 Carbon Gen 11，操作系统：Windows 11 Enterprise 23H2，已安装安全代理版本：EDR Agent v4.7.2，最近一次全盘扫描：2026-05-16 未发现威胁", supported: true },
        { label: "用户身份确认", detail: "当前登录用户：zhangwei@dhjkholding.com，姓名：张伟，部门：东航金控国际业务部-风险管理组，职级：高级风控分析师，权限等级：金融数据查询权限（F2级）", supported: true },
      ],
    },
    {
      title: "行为聚合：时间窗口内的异常行为分析",
      items: [
        { label: "非工作时间操作审计", detail: "张伟于 2026-05-18 凌晨 02:12-03:47（非工作时间 96 分钟内）连续从内部文件服务器下载文件 47 个，总大小 6.3GB，远超该员工过去 90 天的日均下载量（12MB/天），偏离度高达 52 倍标准差", supported: true },
        { label: "文件类型与敏感度分析", detail: "下载文件包含：客户交易明细 Excel（3 个文件，2.1GB）、风控策略模型 PDF（12 个文件，1.8GB）、内部合规审计报告（8 个文件，1.5GB）、其他文档（24 个文件，0.9GB）。其中\u201c风控策略模型\u201d标注为\u201confidential\u201d级别", supported: true },
        { label: "恶意域名访问模式", detail: "同一终端在当日 10:15-12:30 期间，尝试连接恶意域名列表中的 4 个域名：evil-c2.xyz（72 次）、malware-panel.ru（34 次）、ransom-check.net（8 次）、data-siphon.biz（3 次），通信协议均为 HTTPS，JA3 指纹与已知恶意样本匹配", supported: true },
      ],
    },
    {
      title: "威胁关联：IOC / 威胁情报 / JA3 / DGA / C2 交叉比对",
      items: [
        { label: "IOC 指标碰撞", detail: "evil-c2.xyz 的解析 IP 185.225.69.100 与 MITRE ATT&CK 框架中 T1071.001（Web 协议 C2）相关情报关联，该 IP 亦关联东航金控当前调查中的钓鱼邮件事件 ALT-001 的密码重置请求", supported: true },
        { label: "JA3 指纹匹配", detail: "HTTPS 通信使用的 JA3 指纹 7a8b9c4a8e4a3f5b2d1c9e6f9e6f8d0e3c2b7a 与 Dridex 银行木马变种的已知指纹一致，该木马具备键盘记录、凭证窃取和屏幕捕获能力", supported: true },
        { label: "DGA 域名检测", detail: "ransom-check.net 使用 Domain Generation Algorithm 生成的随机子域名模式，结合其证书签发日期（2026-05-17），高度怀疑为新型勒索软件家族的 C2 基础设施", supported: true },
      ],
    },
    {
      title: "图谱构建：资产关系与攻击路径还原",
      items: [
        { label: "关联资产图谱", detail: "终端 DHJK-WS-2024-IB-015 → 关联服务器 FS-FINANCE-01（文件服务器，SMB 协议）→ 关联数据库 DMZ-DB-CUSTOMER（客户交易数据库）→ 关联安全设备 FW-NET-OUT（出口防火墙）。攻击路径：终端 → 文件服务器 → 数据库的数据窃取链已建立", supported: true },
        { label: "横向连接分析", detail: "该终端在过去 72 小时内与 15 台内网主机存在 SMB 连接记录，其中 3 台服务器（HR-SRV-01、MAIL-EXCH-02、APP-CORE-03）未及时安装 2026-05 安全补丁，存在被横向移动攻击的风险", supported: true },
      ],
    },
    {
      title: "ATT&CK 框架攻击阶段映射",
      items: [
        { label: "初始访问 (TA0001)", detail: "攻击向量不明，可能通过钓鱼邮件附件或浏览器漏洞实现初始访问，建议排查张伟近期邮件和浏览器下载历史", source: "MITRE ATT&CK", supported: true },
        { label: "执行 (TA0002)", detail: "恶意宏代码或 PowerShell 脚本在终端上执行，建议检查 Windows Event Log 4688（进程创建）和 4104（PowerShell 脚本块日志）", source: "MITRE ATT&CK", supported: true },
        { label: "持久化 (TA0003)", detail: "疑似通过注册表 Run 键或计划任务实现持久化，建议扫描 HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run 和 schtasks 列表", source: "MITRE ATT&CK", supported: true },
        { label: "数据窃取 (TA0010)", detail: "已确认 6.3GB 敏感数据传输至外部，对应 ATT&CK T1048（通过替代协议外传数据），与 DGA 域名和 C2 通信模式吻合", source: "MITRE ATT&CK", supported: true },
      ],
    },
    {
      title: "横向移动分析",
      items: [
        { label: "内网扫描行为检测", detail: "终端在 03:00-03:15 期间对内网 /24 网段发起 ICMP 扫描，共探测 254 个 IP 地址，其中 37 个存活。该行为对应 ATT&CK T1046（网络服务探测）", supported: true },
        { label: "凭据窃取迹象", detail: "Event ID 4648（使用显式凭据登录）记录显示，该终端尝试使用 admin_svc 账号登录服务器 FS-FINANCE-01，但认证失败。建议核对该账号是否已被暴力破解", supported: true },
        { label: "SMB 横向传播检测", detail: "检测到从该终端向 HR-SRV-01 发起的 SMB 写入操作，文件名\u201cHR_Update_May2026.exe\u201d可疑，建议将该文件隔离并提交沙箱分析", supported: true },
      ],
    },
    {
      title: "AI 风险评分",
      items: [
        { label: "综合风险评分", detail: "基于 12 个维度的加权评估，本次事件综合风险评分为 86.7/100（高危）。各维度评分：数据泄露风险 95、恶意软件风险 88、横向移动风险 72、合规违规风险 68、账户安全风险 55", supported: true },
        { label: "置信度分析", detail: "AI 模型对当前判定结果的置信度为 91.4%。主要不确定性在于：初始入侵向量尚不明确（可能为钓鱼或浏览器漏洞），以及 DGA 域名关联的勒索软件种类尚需进一步分析确认", supported: true },
      ],
    },
    {
      title: "调查结论",
      items: [
        { label: "安全事件定性", detail: "综合判定为\u201c高级持续性威胁（APT）与内部数据泄露复合事件\u201d。东航金控国际业务部终端 DHJK-WS-2024-IB-015 已被植入恶意软件，攻击者已成功窃取约 6.3GB 敏感业务数据，并建立了持久化 C2 通信通道", supported: true },
        { label: "影响评估", detail: "1) 东航金控客户交易数据泄露，可能触发金融监管机构的数据泄露报告义务；2) 风控策略模型外泄将直接削弱东航金控的风险管理竞争优势；3) 已被攻陷终端可能作为跳板进一步渗透东航金控核心金融交易系统；4) 整体安全事件等级建议定为 P1（最高优先级）", supported: true },
      ],
    },
    {
      title: "自动生成报告",
      items: [
        { label: "安全事件报告", detail: "已自动生成 PDF 格式安全事件报告（包含完整 IOC 列表、攻击时间线、受影响资产清单、取证数据包及处置建议）。报告路径：//东航金控/SOC/IncidentReports/2026/INC-2026-0518-ALT003.pdf", supported: true },
        { label: "监管报送准备", detail: "根据《金融行业网络安全等级保护管理办法》第四十二条，涉及客户数据泄露事件需在 2 小时内向监管机构报告。已自动生成监管报送预填表，需安全负责人审核后提交", supported: true },
      ],
    },
  ],
};

const internetBehaviorThinkingMessages = [
  "正在解析告警原始事件...",
  "正在关联实体资产信息...",
  "正在聚合时间窗口行为...",
  "正在对撞威胁情报库...",
  "正在构建资产关系图谱...",
  "正在映射 ATT&CK 攻击阶段...",
  "正在分析横向移动路径...",
  "正在计算 AI 风险评分...",
  "正在生成调查结论...",
  "正在准备自动报告...",
];

type StreamStage = 'hidden' | 'thinking' | 'typing' | 'complete';

function useSequentialStream(itemCount: number, messages: string[]) {
  const [stages, setStages] = useState<StreamStage[]>(() => Array(itemCount).fill('hidden'));
  const [thinkingIndex, setThinkingIndex] = useState(-1);
  const [thinkingText, setThinkingText] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setStages(Array(itemCount).fill('hidden'));
    setThinkingIndex(-1);
    setActiveIndex(-1);
    setThinkingText("");

    const startTimer = setTimeout(() => {
      launchThinking(0);
    }, 400);

    return () => clearTimeout(startTimer);
  }, [itemCount]);

  function launchThinking(index: number) {
    if (index >= itemCount) {
      setActiveIndex(-1);
      setThinkingIndex(-1);
      return;
    }
    setActiveIndex(index);
    setThinkingIndex(index);
    setThinkingText(messages[index % messages.length]);

    setStages(prev => {
      const next = [...prev];
      next[index] = 'thinking';
      return next;
    });

    const thinkTime = 600 + Math.floor(Math.random() * 700);
    setTimeout(() => {
      setStages(prev => {
        const next = [...prev];
        if (next[index] === 'thinking') {
          next[index] = 'typing';
        }
        return next;
      });
      setThinkingIndex(-1);
    }, thinkTime);
  }

  function handleTypingDone(index: number) {
    if (index !== activeIndex) return;
    setStages(prev => {
      const next = [...prev];
      next[index] = 'complete';
      return next;
    });

    const pause = 250 + Math.floor(Math.random() * 350);
    setTimeout(() => {
      setActiveIndex(-1);
      launchThinking(index + 1);
    }, pause);
  }

  const isComplete = stages.every(s => s === 'complete');

  return { stages, thinkingIndex, thinkingText, activeIndex, handleTypingDone, isComplete };
}

export default function AiAnalysisModal({ alert, onClose }: AiAnalysisModalProps) {
  useEffect(() => {
    if (alert) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [alert]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!alert) return null;

  const isStreaming = alert.category === "phishing" || alert.category === "internet-behavior";
  const CategoryIcon = alert.category === "phishing" ? Mail : alert.category === "internet-behavior" ? Globe : LogIn;

  const AnimatedBackdrop = () => (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" />
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <AnimatedBackdrop />
      <div
        className="relative w-full max-w-3xl flex flex-col h-[85vh] rounded-2xl border border-[#1e293b] bg-[#0f1729] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e293b]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#00b4d8]/20 to-[#00b4d8]/5">
              <Brain className="w-5 h-5 text-[#00b4d8]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#e2e8f0]">AI 智能研判</h2>
              <p className="text-xs text-[#64748b] font-mono mt-0.5">{alert.id} · {alert.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#64748b] hover:text-[#e2e8f0] hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 min-h-0">
          {alert.category === "phishing" && (
            <StreamingInvestigationView
              investigation={phishingInvestigation}
              thinkingMessages={phishingThinkingMessages}
              severityColor="#ff4d6d"
            />
          )}
          {alert.category === "internet-behavior" && (
            <StreamingInvestigationView
              investigation={internetBehaviorInvestigation}
              thinkingMessages={internetBehaviorThinkingMessages}
              severityColor="#f9a826"
            />
          )}
          {(alert.category === "abnormal-login") && (
            <div className="p-6 text-center text-[#64748b] text-sm">
              研判功能开发中...
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#1e293b] flex items-center">
          <span className="text-xs text-[#64748b] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            AI 研判完成
          </span>
        </div>
      </div>
    </div>
  );
}

function TypedDetail({ text, active, onComplete }: { text: string; active: boolean; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const indexRef = useRef(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      if (!done) {
        setDisplayed("");
        setDone(false);
        indexRef.current = 0;
        completedRef.current = false;
      }
      return;
    }
    indexRef.current = 0;
    setDisplayed("");
    setDone(false);
    completedRef.current = false;

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        setDone(true);
        clearInterval(interval);
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
      }
    }, 18);

    return () => clearInterval(interval);
  }, [text, active, onComplete]);

  return (
    <span>
      {displayed}
      {!done && active && <span className="inline-block w-0.5 h-3 bg-[#00b4d8] ml-0.5 animate-pulse align-middle" />}
    </span>
  );
}

function StreamingInvestigationView({
  investigation,
  thinkingMessages,
  severityColor,
}: {
  investigation: StreamContent;
  thinkingMessages: string[];
  severityColor: string;
}) {
  const totalItems = investigation.groups.reduce((sum, g) => sum + g.items.length, 0);
  const { stages, thinkingIndex, thinkingText, handleTypingDone, isComplete } = useSequentialStream(totalItems, thinkingMessages);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(raf);
  }, [stages, thinkingIndex, isComplete]);

  let itemCounter = 0;

  return (
    <div ref={scrollRef} className="h-full p-6 space-y-5 overflow-y-auto">
      <div className="flex items-center gap-2 pb-3 border-b border-[#1e293b]">
        <span style={{ color: severityColor }}>
          <AlertTriangle className="w-4 h-4" />
        </span>
        <span className="text-sm font-semibold" style={{ color: severityColor }}>
          严重等级: {investigation.severity}
        </span>
        <span className="mx-2 text-[#64748b]">|</span>
        <div className="flex items-center gap-1.5 text-xs text-[#00b4d8]">
          <Search className="w-3.5 h-3.5" />
          <span>{investigation.investigationTitle}</span>
        </div>
      </div>

      {investigation.groups.map((group, gi) => {
        const firstItemIdx = itemCounter;
        const groupStages = group.items.map((_, ii) => stages[firstItemIdx + ii]);
        const groupVisible = groupStages.some(s => s !== 'hidden');

        return (
          <div
            key={gi}
            className={`space-y-2 transition-all duration-500 ${groupVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ display: groupVisible ? "" : "none" }}
          >
            <h3 className="text-sm font-bold text-[#e2e8f0] flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-[#00b4d8]" />
              {group.title}
            </h3>
            <div className="space-y-1.5 pl-3.5">
              {group.items.map((item, ii) => {
                const idx = itemCounter;
                itemCounter++;
                const stage = stages[idx];
                if (stage === 'hidden') return null;

                const isTyping = stage === 'typing';
                const displayStage = stage === 'typing' || stage === 'complete';

                return (
                  <div
                    key={ii}
                    className="flex items-start gap-2.5 p-2.5 rounded-lg border border-[#1e293b] bg-white/[0.02]"
                  >
                    {item.supported ? (
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-[#52b788] shrink-0" />
                    ) : (
                      <div className="w-4 h-4 mt-0.5 rounded-full border-2 border-[#64748b] shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-medium text-[#e2e8f0]">{item.label}</span>
                        {item.source && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00b4d8]/10 text-[#00b4d8]">
                            {item.source}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#94a3b8] mt-0.5 leading-relaxed min-h-[1.2em]">
                        {displayStage ? (
                          <TypedDetail
                            text={item.detail}
                            active={isTyping}
                            onComplete={() => handleTypingDone(idx)}
                          />
                        ) : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {thinkingIndex >= 0 && (
        <div className="flex items-center gap-3 py-3 px-3 rounded-lg bg-[#00b4d8]/5 border border-[#00b4d8]/10 animate-fade-in">
          <div className="relative flex items-center justify-center w-5">
            <div className="absolute w-5 h-5 rounded-full bg-[#00b4d8]/20 animate-ping" />
            <Loader2 className="w-4 h-4 text-[#00b4d8] animate-spin relative z-10" />
          </div>
          <span className="text-xs text-[#94a3b8]">{thinkingText}</span>
          <span className="inline-flex ml-1">
            <span className="w-1 h-1 rounded-full bg-[#64748b] animate-bounce" style={{ animationDelay: "0ms", animationDuration: "1.2s" }} />
            <span className="w-1 h-1 rounded-full bg-[#64748b] animate-bounce ml-[2px]" style={{ animationDelay: "200ms", animationDuration: "1.2s" }} />
            <span className="w-1 h-1 rounded-full bg-[#64748b] animate-bounce ml-[2px]" style={{ animationDelay: "400ms", animationDuration: "1.2s" }} />
          </span>
        </div>
      )}

      {isComplete && (
        <div className="flex items-center justify-center gap-2 py-3 text-xs text-[#52b788]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          研判完成 · 共 {totalItems} 项
        </div>
      )}
    </div>
  );
}