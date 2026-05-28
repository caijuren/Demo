import { useState, useEffect } from "react";
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
import AiChat from "@/components/AiChat";
import type { AlertItem } from "@/types";

interface LogEntry {
  timestamp: string;
  source: string;
  process: string;
  message: string;
  raw: string;
}

interface EmployeeProfile {
  name: string;
  email: string;
  employeeId?: string;
  department: string;
  position: string;
  tenure?: string;
  manager?: string;
  workHours: string;
}

interface HistoricalBehavior {
  period: string;
  normalAccessTimes: string;
  abnormalLoginCount: number;
  dataExportHistory: string;
  firstAlert: boolean;
}

interface Incident {
  id: string;
  time: string;
  name: string;
  source: string;
  level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: string;
  eventDescription: string;
  employeeProfile?: EmployeeProfile;
  historicalBehavior?: HistoricalBehavior;
  accessSource?: {
    ip: string;
    device: string;
    isVpn: boolean;
    tool: string;
  };
  approvalProcess?: {
    submitTime: string;
    approver?: string;
    purpose: string;
    archiveTime: string;
    reason: string;
  };
  dataDetails?: {
    recordCount: number;
    dataSize: string;
    sensitiveFields: string[];
  };
  comprehensiveAssessment: string;
  handlingMeasures: string[];
  terminalLogs: LogEntry[];
}

const incidents: Incident[] = [
  {
    id: "INC-2026-0812",
    time: "03-28 09:44:05",
    name: "疑似邮件暴力破解攻击",
    source: "185.220.101.47",
    level: "CRITICAL",
    status: "研判中",
    eventDescription: "高危 — 累计试错157次，平均间隔0.1秒，持续遭受自动化暴力破解攻击",
    comprehensiveAssessment: "该邮箱正遭受来自美国IP 185.220.101.47 的持续性自动化大量登录失败攻击。失败登录累计157次，失败次数呈递增趋势，且时间规律一致，集中于22:00后非工作时段。单次试错间隔最小0.05秒，平均0.18秒，远低于人类正常操作基线。与《东航金控数据安全管理办法》中「异常操作行为模式」判定标准高度吻合，置信度97%。",
    handlingMeasures: [
      "立即通知许博修改高强度密码并开启MFA",
      "封禁IP 185.220.101.47",
      "同步通知yupepeng、daiying账号立即修改密码",
      "邮件管理员持续监控itservice7账号，确认无异常外发",
      "攻击IP及特征加入知识图谱，同类攻击下次直接触发高危告警"
    ],
    terminalLogs: [
      {
        timestamp: "Mar 28 09:44:05",
        source: "mail-server",
        process: "dovecot",
        message: "auth-worker(28471): pam(itservice7,185.220.101.47): Authentication failure",
        raw: "2026-03-28T09:44:05.123+08:00 mail-server dovecot[28471]: auth-worker(28471): pam(itservice7,185.220.101.47): Authentication failure; logname= uid=0 euid=0 tty=dovecot ruser=itservice7 rhost=185.220.101.47"
      },
      {
        timestamp: "Mar 28 09:44:05",
        source: "mail-server",
        process: "dovecot",
        message: "auth-worker(28472): pam(itservice7,185.220.101.47): Authentication failure",
        raw: "2026-03-28T09:44:05.312+08:00 mail-server dovecot[28472]: auth-worker(28472): pam(itservice7,185.220.101.47): Authentication failure; logname= uid=0 euid=0 tty=dovecot ruser=itservice7 rhost=185.220.101.47"
      },
      {
        timestamp: "Mar 28 09:44:05",
        source: "mail-server",
        process: "dovecot",
        message: "auth-worker(28473): pam(itservice7,185.220.101.47): Authentication failure",
        raw: "2026-03-28T09:44:05.478+08:00 mail-server dovecot[28473]: auth-worker(28473): pam(itservice7,185.220.101.47): Authentication failure; logname= uid=0 euid=0 tty=dovecot ruser=itservice7 rhost=185.220.101.47"
      }
    ]
  },
  {
    id: "INC-2026-0813",
    time: "03-29 14:06:29",
    name: "钓鱼邮件 - 模拟登录页面",
    source: "external-host.xyz",
    level: "HIGH",
    status: "待处理",
    eventDescription: "邮件网关拦截到 3 封高度仿真的钓鱼邮件，发件人伪装成 IT 运维团队",
    comprehensiveAssessment: "邮件网关拦截到 3 封高度仿真的钓鱼邮件，发件人伪装成 IT 运维团队，诱导用户访问 external-host.xyz 的虚假 VPN 登录页。URL 被 3 家威胁情报源标记为恶意。已识别 7 名员工点击了链接，其中 2 名输入了凭据。",
    handlingMeasures: [
      "立即封锁 external-host.xyz 域名",
      "通知 7 名点击员工修改密码",
      "对 2 名输入凭据的员工进行强制 MFA 重置",
      "加强邮件网关钓鱼检测规则"
    ],
    terminalLogs: [
      {
        timestamp: "Mar 29 14:06:15",
        source: "mail-gateway",
        process: "postfix",
        message: "Received phishing email from external-host.xyz",
        raw: "2026-03-29T14:06:15.234+08:00 mail-gateway postfix/smtpd[4521]: NOQUEUE: reject: RCPT from unknown[185.220.101.47]: 554 5.7.1 Service unavailable; Client host [185.220.101.47] blocked using zen.spamhaus.org; https://www.spamhaus.org/query/ip/185.220.101.47; from=<it-support@external-host.xyz> to=<zhangsan@kiiik.com> proto=ESMTP helo=<mail.external-host.xyz>"
      },
      {
        timestamp: "Mar 29 14:06:29",
        source: "proxy",
        process: "squid",
        message: "TCP_MISS/200 1245 GET http://external-host.xyz/login",
        raw: "2026-03-29T14:06:29.567+08:00 proxy squid[4521]: 158703 10.8.12.45 TCP_MISS/200 1245 GET http://external-host.xyz/login - HIER_DIRECT/185.220.101.47 text/html \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36\""
      },
      {
        timestamp: "Mar 29 14:06:35",
        source: "waf",
        process: "modsecurity",
        message: "Access denied with code 403",
        raw: "2026-03-29T14:06:35.123+08:00 waf modsecurity[8912]: [client 10.8.12.45] ModSecurity: Access denied with code 403 (phase 2). Pattern match \"phishing|credential_harvesting\" at REQUEST_HEADERS:Host. [file \"/etc/modsecurity/rules/phishing.conf\"] [line \"23\"] [id \"941100\"] [msg \"Phishing Site Access Blocked\"] [data \"Matched Data: external-host.xyz found within REQUEST_HEADERS:Host\"] [hostname \"external-host.xyz\"] [uri \"/login\"]"
      }
    ]
  },
  {
    id: "INC-2026-0814",
    time: "04-15 16:45:16",
    name: "非工作时间大规模数据下载",
    source: "User: xubo@kiiik.com",
    level: "MEDIUM",
    status: "已处置",
    eventDescription: "用户许博于凌晨 02:15 从 CRM 系统批量导出客户数据，涉及 23,847 条记录",
    employeeProfile: {
      name: "许博",
      email: "xubo@kiiik.com",
      department: "运维部",
      position: "运维工程师",
      workHours: "09:00-18:00"
    },
    historicalBehavior: {
      period: "过去6个月",
      normalAccessTimes: "仅在正常工作时间访问CRM系统",
      abnormalLoginCount: 0,
      dataExportHistory: "无历史数据导出行为",
      firstAlert: true
    },
    accessSource: {
      ip: "10.8.12.45",
      device: "PC-0089",
      isVpn: false,
      tool: "Python requests 脚本"
    },
    approvalProcess: {
      submitTime: "04-14 18:30",
      purpose: "系统运维数据备份",
      archiveTime: "04-15 09:00",
      reason: "运维窗口期紧急备份，提前执行数据导出"
    },
    dataDetails: {
      recordCount: 23847,
      dataSize: "18.4MB",
      sensitiveFields: ["客户姓名", "联系方式", "交易记录", "信用评级"]
    },
    comprehensiveAssessment: "经调查，运维部工程师许博于 04-15 凌晨 02:15 使用 Python 脚本从 CRM 系统批量导出客户数据 23,847 条（18.4MB）。该行为存疑点如下：（1）导出时间 02:15 处于非工作时段，与其正常工作时间 09:00-18:00 不符；（2）使用 Python requests 脚本而非常规备份工具执行，调用链可疑；（3）数据含客户姓名、联系方式、交易记录、信用评级等敏感字段。\n\n进一步核实发现：许博已于 04-14 18:30 提交运维数据备份工单，但未等待审批通过即提前执行导出。导出数据目的地为本地工作目录，未检测到外传行为。其历史 6 个月行为基线正常，无异常登录或数据导出前科。\n\n综合判定：操作目的与运维岗位职责相符，数据未外泄，但违反了《东航金控数据安全管理办法》第 12 条「非工作时间敏感数据访问须经双人审批」的规定。事件性质属中等，已按流程处置完毕。",
    handlingMeasures: [
      "【已执行·事件响应】04-15 02:18 安全运维值班组收到 DLP 告警后立即响应，02:25 电话联系许博确认操作意图，02:30 通过 EDR 终端管控策略临时冻结 PC-0089 的网络外发权限，防止数据外泄风险扩散；02:45 完成导出数据的本地文件清点与隔离，确认 23,847 条记录均存于 /home/xubo/exports/ 目录下，无外部网络传输痕迹",
      "【已执行·审批补录】04-15 09:00 运维部值班负责人对工单 OPS-2026-0415-003 进行补审批，审批意见为「同意补录，紧急备份操作，后续需严格遵守流程」；审批记录已同步至电子审计系统（审计追踪 ID: AUDIT-2026-0415-0089），留存期限 5 年",
      "【已执行·人员处置】04-15 10:00 安全部联合运维部对许博进行约谈，许博对违规操作事实无异议并签署《违规操作确认书》；10:30 完成《数据安全管理办法》（Q/DHJK-SEC-012-2024）第 12 条「非工作时间敏感数据访问」专项培训并闭卷考试，成绩 96 分（满分 100，合格线 85）；11:00 签署《数据安全管理承诺书》，承诺今后严格遵守数据导出审批流程，如有违规自愿接受公司处分",
      "【已执行·权限管控】04-15 11:30 运维部负责人协同安全部对许博的 CRM 系统账号（xubo@kiiik.com）执行临时权限变更：（1）非工作时间段（18:00-次日 09:00 及法定节假日）数据导出权限降级为只读查询，禁止 SELECT INTO OUTFILE 及任何形式的数据导出操作；（2）工作日数据导出增加双人审批流程——发起人提交申请单后，自动发送审批通知至运维部负责人及安全值班组，双方均批准后方可执行导出；（3）审批有效期设为单次 24 小时，过期自动失效需重新提交",
      "【技术管控·导出操作增强确认】CRM 系统已上线「数据导出安全确认」组件：任何用户执行数据导出操作时强制弹出全屏遮罩式确认对话框，展示内容包括——（a）本次导出涉及的数据库实例、表名、数据量预估；（b）数据敏感等级分类标识（绿色/黄色/红色）；（c）《数据安全管理办法》相关条款摘要；（d）「本人确认本次导出已获得有效审批」勾选框。确认过程全量记录至操作审计日志（表名：audit.export_confirm_log），留存周期不少于 180 天",
      "【技术管控·DLP 分级告警策略】已上线三档批量数据导出检测规则：第一档（预警级）——单次导出 1,000~4,999 条记录或数据量 5MB~50MB，记录审计日志并邮件通知当事人及其部门负责人；第二档（告警级）——单次导出 5,000~49,999 条记录或数据量 50MB~500MB，触发实时告警至安全运维值班组并自动冻结该账号导出权限 30 分钟；第三档（严重级）——单次导出 ≥50,000 条记录或数据量 ≥500MB，立即冻结账号全部数据库权限、阻断终端网络连接、通知安全部负责人启动应急响应流程",
      "【技术管控·UEBA 行为基线建模】将该事件特征（操作人、时间、数据量、工具链）录入用户与实体行为分析（UEBA）模型训练数据集。模型已更新的规则包括：（1）非工作时间操作偏离度阈值——若某用户在非工作时段的数据操作量超过其个人历史基线的 5 倍标准差，触发高级别告警；（2）工具链异常检测——若用户使用的数据库客户端工具与历史 90 天内记录的工具集不匹配，标记为「可疑工具链」并附加风险评分 +15；（3）操作频次异常检测——同一用户单日数据导出次数超过历史均值的 3 倍时，自动临时提升该用户的风险等级至「重点关注」",
      "【流程优化·应急备份流程修订】安全部已牵头修订《运维数据备份操作规范》（文档编号 OPS-SOP-008-2026，修订版本 v2.3），修订要点：（1）新增「紧急备份通道」定义——仅限生产环境故障或数据恢复场景，发起人需在运维工单系统填写紧急备份申请单（表单字段包括：影响系统、备份范围、紧急原因、预期时长、回退方案），审批流设置为「发起人→值班负责人（15 分钟内响应）→安全值班组（15 分钟内响应）」三级审批链路；（2）明确非紧急场景下的计划内备份需提前 4 个工作日通过常规备份窗口预约，预约成功后系统自动在备份执行前 30 分钟向操作人推送执行确认通知；（3）所有备份操作完成后 15 分钟内，系统自动生成备份执行报告并归档至审计系统，报告内容须包含：操作人、操作时间、备份路径、数据量、校验和（SHA-256）、审批单编号",
      "【流程优化·权限审计周期调整】安全部已更新《账号权限管理规范》中关于敏感数据账号的审计要求：CRM、HR、财务等含个人敏感信息系统的数据导出权限审计周期从「每季度一次」调整为「每月一次」；审计范围扩展至：（1）权限变更记录回溯——检查过去 30 天内所有权限变更是否关联有效审批单号；（2）异常使用行为扫描——通过 UEBA 模型标记过去 30 天内高风险操作（非工作时间导出、异常工具链、超频次访问）并逐条核实；（3）权限合理性复核——检查账号当前权限是否仍符合岗位职责最小权限原则，超期未用的高权限账号自动降级",
      "【长期跟进·事件复盘机制】事件已纳入 04 月安全运营月报（报告编号 SEC-REP-2026-04）重点复盘议题，计划于 04-30 安全运营例会上进行专题复盘，复盘议程包括：（1）事件时间线回溯——从告警触发→研判→处置→闭环全链路各环节耗时分析，识别响应瓶颈；（2）同类风险排查——对运维部全员近 90 天的数据操作行为进行回扫，排查是否存有同类未触发告警的批量数据导出操作；（3）管控措施有效性验证——新上线的 DLP 分级告警规则、导出确认组件、UEBA 模型更新后的模拟测试结果通报；（4）改进事项跟踪——建立处置措施跟踪台账（跟踪人：安全部负责人），每项措施标注责任人和完成时限，下周例会回顾完成进度"
    ],
    terminalLogs: [
      {
        timestamp: "Apr 15 02:15:28",
        source: "crm-app",
        process: "nginx",
        message: "POST /api/auth/login HTTP/1.1 200",
        raw: "2026-04-15T02:15:28.412+08:00 crm-app nginx[4521]: 10.8.12.45 - xubo [15/Apr/2026:02:15:28 +0800] \"POST /api/auth/login HTTP/1.1\" 200 847 \"-\" \"python-requests/2.28.1\" rt=0.234 ua=\"Mozilla/5.0 (Windows NT 10.0; Win64; x64)\""
      },
      {
        timestamp: "Apr 15 02:15:33",
        source: "crm-app",
        process: "nginx",
        message: "GET /api/v1/customers/export?limit=50000 HTTP/1.1 200",
        raw: "2026-04-15T02:15:33.789+08:00 crm-app nginx[4521]: 10.8.12.45 - xubo [15/Apr/2026:02:15:33 +0800] \"GET /api/v1/customers/export?limit=50000&format=csv HTTP/1.1\" 200 18475632 \"-\" \"python-requests/2.28.1\" rt=45.123 ua=\"Mozilla/5.0 (Windows NT 10.0; Win64; x64)\" request_length=23 response_length=18475632"
      },
      {
        timestamp: "Apr 15 02:15:34",
        source: "crm-db",
        process: "mysql",
        message: "SELECT * FROM customers LIMIT 50000",
        raw: "2026-04-15T02:15:34.156+08:00 crm-db mysql[28471]: [Note] Aborted connection 28471 to db: 'crm_prod' user: 'app_readonly' host: '10.8.12.45' (Got an error reading communication packets); query: 'SELECT id,name,phone,email,address,credit_level,transaction_history,created_at,updated_at FROM customers LIMIT 50000'"
      },
      {
        timestamp: "Apr 15 02:16:18",
        source: "dlp-agent",
        process: "dlp-monitor",
        message: "ALERT: Large data export detected",
        raw: "2026-04-15T02:16:18.445+08:00 dlp-agent dlp-monitor[8912]: ALERT [POLICY_ID=DATA_EXPORT_001] [SEVERITY=MEDIUM] User=xubo@kiiik.com SourceIP=10.8.12.45 Endpoint=PC-0089 Operation=DATA_EXPORT Records=23847 Size=18.4MB Destination=/home/xubo/exports/customers_20260415.csv PolicyViolation=NON_WORK_HOURS_SENSITIVE_DATA_ACCESS"
      }
    ]
  },
  {
    id: "INC-2026-0815",
    time: "04-30 13:36:39",
    name: "可疑 PowerShell 脚本执行",
    source: "10.5.10.22 (PC-0021)",
    level: "CRITICAL",
    status: "已忽略",
    eventDescription: "终端安全软件检测到 PC-0021 执行了 Base64 编码的 PowerShell 命令",
    comprehensiveAssessment: "终端安全软件检测到 PC-0021 执行了 Base64 编码的 PowerShell 命令，经解码分析为系统补丁检测脚本。该设备归属运维部张磊，脚本为其日常巡检工具。行为特征与已知恶意软件不匹配，判定为误报。",
    handlingMeasures: [
      "已将该脚本加入白名单",
      "更新 EDR 规则避免同类误报"
    ],
    terminalLogs: [
      {
        timestamp: "Apr 30 13:36:39",
        source: "PC-0021",
        process: "sysmon",
        message: "Process Create: powershell.exe -enc ...",
        raw: "2026-04-30T13:36:39.442+08:00 PC-0021 Microsoft-Windows-Sysmon[4521]: Process Create: RuleName=\"technique_id=T1086,technique_name=PowerShell\" UtcTime=\"2026-04-30 13:36:39.442\" ProcessGuid=\"{a1b2c3d4-e5f6-7890-abcd-ef1234567890}\" ProcessId=\"4521\" Image=\"C:\\\\Windows\\\\System32\\\\WindowsPowerShell\\\\v1.0\\\\powershell.exe\" CommandLine=\"powershell -ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -enc UwB5AHMAdABlAG0ALgBVAFAAZABhAHQAZQAuAFQAbwB0AGEAbAAuAEQAbwB3AG4AbABvAGEAZAAoACkA\" CurrentDirectory=\"C:\\\\Users\\\\zhangsan\\\\AppData\\\\Local\\\\Temp\" User=\"CORP\\\\zhangsan\" LogonGuid=\"{b2c3d4e5-f6a7-8901-bcde-f23456789012}\" LogonId=\"0x12345678\" TerminalSessionId=\"1\" IntegrityLevel=\"High\""
      },
      {
        timestamp: "Apr 30 13:36:40",
        source: "PC-0021",
        process: "sysmon",
        message: "Network connection detected: 10.5.10.22:49152 -> 45.33.32.156:8443",
        raw: "2026-04-30T13:36:40.156+08:00 PC-0021 Microsoft-Windows-Sysmon[4521]: Network connection detected: RuleName=\"technique_id=T1021,technique_name=Remote Services\" UtcTime=\"2026-04-30 13:36:40.156\" ProcessGuid=\"{a1b2c3d4-e5f6-7890-abcd-ef1234567890}\" ProcessId=\"4521\" Image=\"C:\\\\Windows\\\\System32\\\\WindowsPowerShell\\\\v1.0\\\\powershell.exe\" User=\"CORP\\\\zhangsan\" Protocol=\"tcp\" Initiated=\"true\" SourceIsIpv6=\"false\" SourceIp=\"10.5.10.22\" SourceHostname=\"PC-0021\" SourcePort=\"49152\" DestinationIsIpv6=\"false\" DestinationIp=\"45.33.32.156\" DestinationHostname=\"\" DestinationPort=\"8443\""
      }
    ]
  },
  {
    id: "INC-2026-0816",
    time: "03-08 20:20:19",
    name: "检测到对外部 C&C 的心跳连接",
    source: "172.16.50.4",
    level: "CRITICAL",
    status: "研判中",
    eventDescription: "防火墙日志显示 172.16.50.4 每 30 秒向 185.220.101.47:443 发送固定长度的 TLS 握手请求",
    comprehensiveAssessment: "防火墙日志显示 172.16.50.4 每 30 秒向 185.220.101.47:443 发送固定长度的 TLS 握手请求，包大小一致，无实际业务数据交换。该域名被 VirusTotal 5/70 引擎标记为恶意，关联 APT29 组织历史活动。",
    handlingMeasures: [
      "立即隔离该主机并取证分析",
      "封锁 185.220.101.47 域名和 IP",
      "全网扫描同类 C&C 连接特征"
    ],
    terminalLogs: [
      {
        timestamp: "Mar 08 20:20:19",
        source: "fw01",
        process: "kernel",
        message: "[IPTABLES] OUT=eth0 SRC=172.16.50.4 DST=185.220.101.47 PROTO=TCP SPT=49152 DPT=443 SYN",
        raw: "2026-03-08T20:20:19.234+08:00 fw01 kernel: [IPTABLES] IN=eth0 OUT=eth1 SRC=172.16.50.4 DST=185.220.101.47 LEN=60 TOS=0x00 PREC=0x00 TTL=63 ID=12345 DF PROTO=TCP SPT=49152 DPT=443 WINDOW=29200 RES=0x00 SYN URGP=0"
      },
      {
        timestamp: "Mar 08 20:20:49",
        source: "fw01",
        process: "kernel",
        message: "[IPTABLES] OUT=eth0 SRC=172.16.50.4 DST=185.220.101.47 PROTO=TCP SPT=49153 DPT=443 SYN",
        raw: "2026-03-08T20:20:49.567+08:00 fw01 kernel: [IPTABLES] IN=eth0 OUT=eth1 SRC=172.16.50.4 DST=185.220.101.47 LEN=60 TOS=0x00 PREC=0x00 TTL=63 ID=12346 DF PROTO=TCP SPT=49153 DPT=443 WINDOW=29200 RES=0x00 SYN URGP=0"
      },
      {
        timestamp: "Mar 08 20:21:19",
        source: "ids",
        process: "suricata",
        message: "ET MALWARE Possible CnC Beacon",
        raw: "2026-03-08T20:21:19.890+08:00 ids suricata[8912]: [1:2026187:3] ET MALWARE Possible CnC Beacon [Classification: A Network Trojan was detected] [Priority: 1] {TCP} 172.16.50.4:49152 -> 185.220.101.47:443"
      }
    ]
  },
  {
    id: "INC-2026-0817",
    time: "03-01 09:31:53",
    name: "多次错误的 VPN 登录尝试",
    source: "123.15.6.8 (Russia)",
    level: "HIGH",
    status: "已处置",
    eventDescription: "VPN 网关记录到来自俄罗斯 IP 123.15.6.8 的 47 次失败登录",
    comprehensiveAssessment: "VPN 网关记录到来自俄罗斯 IP 123.15.6.8 的 47 次失败登录，尝试用户名包括 admin、itservice、zhangsan 等。登录间隔呈规律性（每 5 秒一次），符合字典攻击特征。地理围栏策略已自动阻断该 IP 段，无成功登录记录。",
    handlingMeasures: [
      "地理围栏策略已自动阻断该 IP 段",
      "通知相关用户检查密码强度",
      "加强 VPN 登录监控和告警"
    ],
    terminalLogs: [
      {
        timestamp: "Mar 01 09:31:53",
        source: "vpn01",
        process: "openvpn",
        message: "123.15.6.8:51234 TLS Auth Error: user=admin",
        raw: "2026-03-01T09:31:53.123+08:00 vpn01 openvpn[4521]: 123.15.6.8:51234 TLS Auth Error: Auth Username/Password verification failed for peer [AF_INET]123.15.6.8:51234 user=admin cipher=AES-256-GCM reason=TLS handshake failed"
      },
      {
        timestamp: "Mar 01 09:31:58",
        source: "vpn01",
        process: "openvpn",
        message: "123.15.6.8:51235 TLS Auth Error: user=root",
        raw: "2026-03-01T09:31:58.456+08:00 vpn01 openvpn[4521]: 123.15.6.8:51235 TLS Auth Error: Auth Username/Password verification failed for peer [AF_INET]123.15.6.8:51235 user=root cipher=AES-256-GCM reason=TLS handshake failed"
      },
      {
        timestamp: "Mar 01 09:32:03",
        source: "vpn01",
        process: "openvpn",
        message: "123.15.6.8:51236 TLS Auth Error: user=itservice",
        raw: "2026-03-01T09:32:03.789+08:00 vpn01 openvpn[4521]: 123.15.6.8:51236 TLS Auth Error: Auth Username/Password verification failed for peer [AF_INET]123.15.6.8:51236 user=itservice cipher=AES-256-GCM reason=TLS handshake failed"
      },
      {
        timestamp: "Mar 01 09:32:08",
        source: "vpn01",
        process: "openvpn",
        message: "123.15.6.8:51237 TLS Auth Error: user=zhangsan",
        raw: "2026-03-01T09:32:08.012+08:00 vpn01 openvpn[4521]: 123.15.6.8:51237 TLS Auth Error: Auth Username/Password verification failed for peer [AF_INET]123.15.6.8:51237 user=zhangsan cipher=AES-256-GCM reason=TLS handshake failed"
      },
      {
        timestamp: "Mar 01 09:32:13",
        source: "vpn01",
        process: "openvpn",
        message: "123.15.6.8:51238 TLS Auth Error: user=admin",
        raw: "2026-03-01T09:32:13.345+08:00 vpn01 openvpn[4521]: 123.15.6.8:51238 TLS Auth Error: Auth Username/Password verification failed for peer [AF_INET]123.15.6.8:51238 user=admin cipher=AES-256-GCM reason=TLS handshake failed"
      }
    ]
  },
  {
    id: "INC-2026-0818",
    time: "04-03 07:59:06",
    name: "邮箱日志同步异常",
    source: "Exchange Connector",
    level: "LOW",
    status: "待处理",
    eventDescription: "Exchange 日志同步服务连续 3 小时未上报数据，API 返回 401 未授权错误",
    comprehensiveAssessment: "Exchange 日志同步服务连续 3 小时未上报数据，API 返回 401 未授权错误。经排查，系服务账户密码过期导致。该账户用于 SIEM 数据接入，不影响邮件服务本身。",
    handlingMeasures: [
      "重置服务账户密码",
      "更新密钥保管库",
      "设置密码过期提醒机制"
    ],
    terminalLogs: [
      {
        timestamp: "Apr 03 07:59:06",
        source: "exch01",
        process: "python3",
        message: "[ERROR] Exchange SIEM Connector: HTTP 401 Unauthorized",
        raw: "2026-04-03T07:59:06.234+08:00 exch01 python3[4521]: [ERROR] Exchange SIEM Connector: HTTP 401 Unauthorized - {'error': 'invalid_client', 'error_description': 'AADSTS7000222: The provided client secret keys are expired.', 'timestamp': '2026-04-03T07:59:06Z'}"
      },
      {
        timestamp: "Apr 03 07:59:07",
        source: "exch01",
        process: "python3",
        message: "[WARNING] Retrying connection to Exchange API (attempt 1/3)",
        raw: "2026-04-03T07:59:07.456+08:00 exch01 python3[4521]: [WARNING] Retrying connection to Exchange API (attempt 1/3) - backoff=5s"
      },
      {
        timestamp: "Apr 03 07:59:12",
        source: "exch01",
        process: "python3",
        message: "[ERROR] Exchange SIEM Connector: HTTP 401 Unauthorized",
        raw: "2026-04-03T07:59:12.789+08:00 exch01 python3[4521]: [ERROR] Exchange SIEM Connector: HTTP 401 Unauthorized - {'error': 'invalid_client', 'error_description': 'AADSTS7000222: The provided client secret keys are expired.', 'timestamp': '2026-04-03T07:59:12Z'}"
      }
    ]
  },
  {
    id: "INC-2026-0819",
    time: "04-05 11:57:13",
    name: "数据库敏感字段查询异常",
    source: "User: dba_admin",
    level: "HIGH",
    status: "研判中",
    eventDescription: "数据库审计系统告警：dba_admin 账户在 10 分钟内执行了 15 次 SELECT * 查询",
    comprehensiveAssessment: "数据库审计系统告警：dba_admin 账户在 10 分钟内执行了 15 次 SELECT * 查询，涉及员工身份证号、银行卡号等敏感字段，总计返回 12,847 条记录。该账户归属 DBA 团队刘洋，但查询时间（周六 22:00）与其正常工作时间不符。正在联系负责人核实。",
    handlingMeasures: [
      "暂停 dba_admin 账户非工作时间查询权限",
      "联系 DBA 团队负责人刘洋核实查询目的",
      "审查数据库审计策略，增加敏感字段访问审批"
    ],
    terminalLogs: [
      {
        timestamp: "Apr 05 22:01:17",
        source: "db-audit",
        process: "mysql-audit",
        message: "SELECT * FROM hr.employees WHERE id < 15000, rows_returned=12847",
        raw: "2026-04-05T22:01:17.234+08:00 db-audit mysql-audit[28471]: {\"timestamp\":\"2026-04-05T22:01:17\",\"user\":\"dba_admin@10.8.12.45\",\"query\":\"SELECT * FROM hr.employees WHERE id < 15000\",\"rows_returned\":12847,\"tables\":[\"hr.employees\"],\"sensitive_columns\":[\"id_card\",\"bank_account\"],\"client_ip\":\"10.8.12.45\"}"
      },
      {
        timestamp: "Apr 05 22:02:45",
        source: "db-audit",
        process: "mysql-audit",
        message: "SELECT * FROM hr.salary WHERE employee_id < 15000, rows_returned=12847",
        raw: "2026-04-05T22:02:45.567+08:00 db-audit mysql-audit[28472]: {\"timestamp\":\"2026-04-05T22:02:45\",\"user\":\"dba_admin@10.8.12.45\",\"query\":\"SELECT * FROM hr.salary WHERE employee_id < 15000\",\"rows_returned\":12847,\"tables\":[\"hr.salary\"],\"sensitive_columns\":[\"salary\",\"bank_account\"],\"client_ip\":\"10.8.12.45\"}"
      },
      {
        timestamp: "Apr 05 22:03:12",
        source: "db-audit",
        process: "mysql-audit",
        message: "SELECT * FROM hr.attendance WHERE employee_id < 15000, rows_returned=12847",
        raw: "2026-04-05T22:03:12.890+08:00 db-audit mysql-audit[28473]: {\"timestamp\":\"2026-04-05T22:03:12\",\"user\":\"dba_admin@10.8.12.45\",\"query\":\"SELECT * FROM hr.attendance WHERE employee_id < 15000\",\"rows_returned\":12847,\"tables\":[\"hr.attendance\"],\"sensitive_columns\":[\"check_in_time\",\"check_out_time\"],\"client_ip\":\"10.8.12.45\"}"
      }
    ]
  },
  {
    id: "INC-2026-0820",
    time: "03-28 16:00:25",
    name: "内网横向移动检测",
    source: "10.8.12.55 (PC-0047)",
    level: "CRITICAL",
    status: "待处理",
    eventDescription: "EDR 检测到 PC-0047 在 5 分钟内对 23 台内网主机发起 SMB 连接",
    comprehensiveAssessment: "EDR 检测到 PC-0047 在 5 分钟内对 23 台内网主机发起 SMB 连接，尝试访问 ADMIN$ 共享。该设备归属研发部王涛，但其正常工作不涉及服务器管理。NTLM 认证日志显示使用了本地管理员账户，疑似凭据泄露或 Pass-the-Hash 攻击。",
    handlingMeasures: [
      "立即隔离 PC-0047 并取证分析",
      "重置王涛账户密码并检查其他设备",
      "全网扫描 SMB 异常连接",
      "审查本地管理员账户使用情况"
    ],
    terminalLogs: [
      {
        timestamp: "Mar 28 16:00:25",
        source: "PC-0047",
        process: "sysmon",
        message: "Network connection detected: 10.8.12.55:49672 -> 10.8.12.10:445 (SMB)",
        raw: "2026-03-28T16:00:25.881+08:00 PC-0047 Microsoft-Windows-Sysmon[4521]: Network connection detected: RuleName=\"technique_id=T1021.002,technique_name=SMB/Windows Admin Shares\" UtcTime=\"2026-03-28 16:00:25.881\" ProcessGuid=\"{b2c3d4e5-f6a7-8901-bcde-f23456789012}\" ProcessId=\"8912\" Image=\"C:\\\\Windows\\\\System32\\\\svchost.exe\" User=\"CORP\\\\wangtao\" Protocol=\"tcp\" Initiated=\"true\" SourceIsIpv6=\"false\" SourceIp=\"10.8.12.55\" SourceHostname=\"PC-0047\" SourcePort=\"49672\" DestinationIsIpv6=\"false\" DestinationIp=\"10.8.12.10\" DestinationHostname=\"FILE-SERVER-01\" DestinationPort=\"445\""
      },
      {
        timestamp: "Mar 28 16:00:26",
        source: "PC-0047",
        process: "sysmon",
        message: "Network connection detected: 10.8.12.55:49673 -> 10.8.12.11:445 (SMB)",
        raw: "2026-03-28T16:00:26.123+08:00 PC-0047 Microsoft-Windows-Sysmon[4521]: Network connection detected: RuleName=\"technique_id=T1021.002,technique_name=SMB/Windows Admin Shares\" UtcTime=\"2026-03-28 16:00:26.123\" ProcessGuid=\"{b2c3d4e5-f6a7-8901-bcde-f23456789012}\" ProcessId=\"8912\" Image=\"C:\\\\Windows\\\\System32\\\\svchost.exe\" User=\"CORP\\\\wangtao\" Protocol=\"tcp\" Initiated=\"true\" SourceIsIpv6=\"false\" SourceIp=\"10.8.12.55\" SourceHostname=\"PC-0047\" SourcePort=\"49673\" DestinationIsIpv6=\"false\" DestinationIp=\"10.8.12.11\" DestinationHostname=\"FILE-SERVER-02\" DestinationPort=\"445\""
      },
      {
        timestamp: "Mar 28 16:00:27",
        source: "PC-0047",
        process: "sysmon",
        message: "Network connection detected: 10.8.12.55:49674 -> 10.8.12.12:445 (SMB)",
        raw: "2026-03-28T16:00:27.456+08:00 PC-0047 Microsoft-Windows-Sysmon[4521]: Network connection detected: RuleName=\"technique_id=T1021.002,technique_name=SMB/Windows Admin Shares\" UtcTime=\"2026-03-28 16:00:27.456\" ProcessGuid=\"{b2c3d4e5-f6a7-8901-bcde-f23456789012}\" ProcessId=\"8912\" Image=\"C:\\\\Windows\\\\System32\\\\svchost.exe\" User=\"CORP\\\\wangtao\" Protocol=\"tcp\" Initiated=\"true\" SourceIsIpv6=\"false\" SourceIp=\"10.8.12.55\" SourceHostname=\"PC-0047\" SourcePort=\"49674\" DestinationIsIpv6=\"false\" DestinationIp=\"10.8.12.12\" DestinationHostname=\"DB-SERVER-01\" DestinationPort=\"445\""
      },
      {
        timestamp: "Mar 28 16:00:28",
        source: "PC-0047",
        process: "security",
        message: "Event ID 4648: A logon was attempted using explicit credentials",
        raw: "2026-03-28T16:00:28.789+08:00 PC-0047 Microsoft-Windows-Security-Auditing[4521]: Event ID 4648: A logon was attempted using explicit credentials. Subject: Security ID: CORP\\\\wangtao Account Name: wangtao Account Domain: CORP Logon ID: 0x12345678 Logon GUID: {c3d4e5f6-a7b8-9012-cdef-345678901234} Target Server Name: FILE-SERVER-01 Target Server Info: FILE-SERVER-01 Additional Information: FILE-SERVER-01 Process ID: 0x1234 Process Name: C:\\\\Windows\\\\System32\\\\svchost.exe Network Address: 10.8.12.10 Port: 445"
      },
      {
        timestamp: "Mar 28 16:00:29",
        source: "PC-0047",
        process: "sysmon",
        message: "File creation: C:\\Windows\\Temp\\svc_host.exe",
        raw: "2026-03-28T16:00:29.012+08:00 PC-0047 Microsoft-Windows-Sysmon[4521]: File created: RuleName=\"technique_id=T1036,technique_name=Masquerading\" UtcTime=\"2026-03-28 16:00:29.012\" ProcessGuid=\"{d4e5f6a7-b8c9-0123-def4-567890123456}\" ProcessId=\"4521\" Image=\"C:\\\\Windows\\\\System32\\\\WindowsPowerShell\\\\v1.0\\\\powershell.exe\" TargetFilename=\"C:\\\\Windows\\\\Temp\\\\svc_host.exe\" CreationUtcTime=\"2026-03-28 16:00:29.012\" User=\"CORP\\\\wangtao\""
      },
      {
        timestamp: "Mar 28 16:00:30",
        source: "PC-0047",
        process: "sysmon",
        message: "Process Create: C:\\Windows\\Temp\\svc_host.exe",
        raw: "2026-03-28T16:00:30.345+08:00 PC-0047 Microsoft-Windows-Sysmon[4521]: Process Create: RuleName=\"technique_id=T1059,technique_name=Command and Scripting Interpreter\" UtcTime=\"2026-03-28 16:00:30.345\" ProcessGuid=\"{e5f6a7b8-c9d0-1234-ef56-789012345678}\" ProcessId=\"4522\" Image=\"C:\\\\Windows\\\\Temp\\\\svc_host.exe\" CommandLine=\"svc_host.exe -connect 185.220.101.47:443\" CurrentDirectory=\"C:\\\\Windows\\\\Temp\" User=\"CORP\\\\wangtao\" LogonGuid=\"{f6a7b8c9-d0e1-2345-f678-901234567890}\" LogonId=\"0x23456789\" TerminalSessionId=\"1\" IntegrityLevel=\"High\""
      },
      {
        timestamp: "Mar 28 16:00:31",
        source: "PC-0047",
        process: "security",
        message: "Event ID 4624: An account was successfully logged on",
        raw: "2026-03-28T16:00:31.678+08:00 PC-0047 Microsoft-Windows-Security-Auditing[4521]: Event ID 4624: An account was successfully logged on. Subject: Security ID: S-1-0-0 Account Name: - Account Domain: - Logon ID: 0x0 Logon Type: 3 New Logon: Security ID: S-1-5-21-1234567890-1234567890-1234567890-500 Account Name: Administrator Account Domain: FILE-SERVER-01 Logon ID: 0x34567890 Logon GUID: {a7b8c9d0-e1f2-3456-7890-123456789012} Process Information: Process ID: 0x4 Process Name: C:\\\\Windows\\\\System32\\\\svchost.exe Network Information: Workstation Name: PC-0047 Source Network Address: 10.8.12.55 Source Port: 49672 Detailed Authentication Information: Logon Process: NtLmSsp Authentication Package: NTLM Transited Services: - Package Name (NTLM only): NTLM V2 Key Length: 128"
      }
    ]
  },
  {
    id: "INC-2026-0821",
    time: "03-18 08:02:15",
    name: "Web 应用 SQL 注入尝试",
    source: "45.142.212.89 (Netherlands)",
    level: "HIGH",
    status: "已处置",
    eventDescription: "WAF 拦截到来自荷兰 IP 的 89 次 SQL 注入攻击",
    comprehensiveAssessment: "WAF 拦截到来自荷兰 IP 的 89 次 SQL 注入攻击，目标为 OA 系统的 /api/report/export 接口。攻击载荷包含 UNION SELECT、sleep() 等特征，尝试提取数据库版本信息。所有请求均被 WAF 规则阻断，后端无异常查询记录。",
    handlingMeasures: [
      "WAF 已自动阻断所有攻击请求",
      "封锁 45.142.212.89 IP 地址",
      "更新 WAF SQL 注入检测规则",
      "检查 OA 系统是否存在其他注入点"
    ],
    terminalLogs: [
      {
        timestamp: "Mar 18 08:02:15",
        source: "waf01",
        process: "modsecurity",
        message: "Access denied with code 403 (phase 2). SQL Injection Attack Detected",
        raw: "2026-03-18T08:02:15.234+08:00 waf01 modsecurity[8912]: [client 45.142.212.89] ModSecurity: Access denied with code 403 (phase 2). Pattern match \"(?i:union\\s*select)\" at ARGS:query. [file \"/etc/modsecurity/rules/sql_injection.conf\"] [line \"47\"] [id \"942100\"] [msg \"SQL Injection Attack Detected\"] [data \"Matched Data: UNION SELECT found within ARGS:query: 1' UNION SELECT version(),user(),database()-- \"] [severity \"CRITICAL\"] [hostname \"oa.kiiik.com\"] [uri \"/api/report/export\"] [unique_id \"Y1234567890abcdef\"]"
      },
      {
        timestamp: "Mar 18 08:02:16",
        source: "waf01",
        process: "modsecurity",
        message: "Access denied with code 403 (phase 2). SQL Injection Attack Detected",
        raw: "2026-03-18T08:02:16.567+08:00 waf01 modsecurity[8912]: [client 45.142.212.89] ModSecurity: Access denied with code 403 (phase 2). Pattern match \"(?i:select\\s*sleep)\" at ARGS:query. [file \"/etc/modsecurity/rules/sql_injection.conf\"] [line \"52\"] [id \"942160\"] [msg \"SQL Injection Attack Detected - Time-based Blind SQLi\"] [data \"Matched Data: SELECT SLEEP found within ARGS:query: 1' AND (SELECT * FROM (SELECT(SLEEP(5)))a)-- \"] [severity \"CRITICAL\"] [hostname \"oa.kiiik.com\"] [uri \"/api/report/export\"] [unique_id \"Y1234567890abcd01\"]"
      },
      {
        timestamp: "Mar 18 08:02:17",
        source: "waf01",
        process: "modsecurity",
        message: "Access denied with code 403 (phase 2). SQL Injection Attack Detected",
        raw: "2026-03-18T08:02:17.890+08:00 waf01 modsecurity[8912]: [client 45.142.212.89] ModSecurity: Access denied with code 403 (phase 2). Pattern match \"(?i:information_schema)\" at ARGS:query. [file \"/etc/modsecurity/rules/sql_injection.conf\"] [line \"58\"] [id \"942200\"] [msg \"SQL Injection Attack Detected - Schema Enumeration\"] [data \"Matched Data: information_schema found within ARGS:query: 1' UNION SELECT table_name,column_name FROM information_schema.columns WHERE table_schema=database()-- \"] [severity \"CRITICAL\"] [hostname \"oa.kiiik.com\"] [uri \"/api/report/export\"] [unique_id \"Y1234567890abcd02\"]"
      },
      {
        timestamp: "Mar 18 08:02:18",
        source: "oa-app",
        process: "nginx",
        message: "GET /api/report/export?query=1' UNION SELECT HTTP/1.1 403",
        raw: "2026-03-18T08:02:18.123+08:00 oa-app nginx[4521]: 45.142.212.89 - - [18/Mar/2026:08:02:18 +0800] \"GET /api/report/export?query=1%27%20UNION%20SELECT%20version(),user(),database()--%20 HTTP/1.1\" 403 512 \"-\" \"sqlmap/1.7.3#stable (https://sqlmap.org)\" rt=0.045 ua=\"sqlmap/1.7.3#stable\" request_length=89 response_length=512"
      },
      {
        timestamp: "Mar 18 08:02:19",
        source: "oa-app",
        process: "nginx",
        message: "GET /api/report/export?query=1' AND (SELECT HTTP/1.1 403",
        raw: "2026-03-18T08:02:19.456+08:00 oa-app nginx[4521]: 45.142.212.89 - - [18/Mar/2026:08:02:19 +0800] \"GET /api/report/export?query=1%27%20AND%20(SELECT%20*%20FROM%20(SELECT(SLEEP(5)))a)--%20 HTTP/1.1\" 403 512 \"-\" \"sqlmap/1.7.3#stable (https://sqlmap.org)\" rt=0.052 ua=\"sqlmap/1.7.3#stable\" request_length=95 response_length=512"
      },
      {
        timestamp: "Mar 18 08:02:20",
        source: "oa-db",
        process: "mysql",
        message: "Aborted connection 28471 to db: 'oa_prod' user: 'app_readonly'",
        raw: "2026-03-18T08:02:20.789+08:00 oa-db mysql[28471]: [Note] Aborted connection 28471 to db: 'oa_prod' user: 'app_readonly' host: '10.8.12.20' (Got timeout reading communication packets); query: 'SELECT * FROM reports WHERE id = 1'"
      },
      {
        timestamp: "Mar 18 08:02:21",
        source: "siem",
        process: "suricata",
        message: "ET WEB_SERVER Web Attack - SQL Injection",
        raw: "2026-03-18T08:02:21.012+08:00 siem suricata[8912]: [1:2011802:3] ET WEB_SERVER Web Attack - SQL Injection [Classification: Web Application Attack] [Priority: 1] {TCP} 45.142.212.89:51234 -> 10.8.12.10:443"
      }
    ]
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

type PageKey = "events" | "ai-chat";

const navItems: { icon: React.ComponentType<{ className?: string }>; label: string; page: PageKey }[] = [
  { icon: LayoutDashboard, label: "工作台", page: "events" },
  { icon: AlertCircle, label: "事件中心", page: "events" },
  { icon: Search, label: "调查分析", page: "events" },
  { icon: Server, label: "资产清单", page: "events" },
  { icon: MessageSquare, label: "AI 问答", page: "ai-chat" },
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
    detail: incident.eventDescription,
    eventDescription: incident.eventDescription,
    comprehensiveAssessment: incident.comprehensiveAssessment,
    handlingMeasures: incident.handlingMeasures,
    employeeProfile: incident.employeeProfile,
    historicalBehavior: incident.historicalBehavior,
    accessSource: incident.accessSource,
    approvalProcess: incident.approvalProcess,
    dataDetails: incident.dataDetails,
    terminalLogs: incident.terminalLogs,
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
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-48 flex-shrink-0 bg-white border-r border-[#e2e8f0] flex flex-col">
        <div className="px-4 py-5 flex items-center gap-2.5 border-b border-[#e2e8f0]">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-white w-4 h-4" />
          </div>
          <h1 className="text-sm font-semibold text-slate-900 whitespace-nowrap">
            安全事件分析助手
          </h1>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 pt-3 pb-1.5">
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
                className={`relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-all w-full text-left ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[3px] before:h-4 before:bg-blue-600 before:rounded-r"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isActive ? "text-blue-600" : ""}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2.5 pt-4 pb-1.5">
            配置管理
          </div>
          {configItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs hover:bg-slate-100 transition-all text-slate-500 hover:text-slate-900"
              >
                <Icon className="w-[18px] h-[18px]" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
        <div className="px-3 py-3 border-t border-[#e2e8f0]">
          <div className="flex items-center gap-2 px-2.5 py-1.5">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-medium text-slate-900 truncate">Admin</div>
              <div className="text-[10px] text-slate-400">超级管理员</div>
            </div>
          </div>
        </div>
      </aside>

      {currentPage === "ai-chat" ? (
        <AiChat />
      ) : (
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-12 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6">
            <h2 className="text-sm font-semibold text-slate-900">
              统一事件流管理系统
            </h2>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all">
                <Download className="w-3.5 h-3.5" />
                导出审计报告
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-5">
            {/* Filter Bar */}
            <div className="bg-white border border-[#e2e8f0] p-3.5 rounded-xl mb-4 flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[180px] space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">搜索事件</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                  <input
                    className="w-full bg-slate-50 border border-[#e2e8f0] rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 h-[32px]"
                    placeholder="ID, IP, 资产名称..."
                    type="text"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">风险等级</label>
                <select className="bg-slate-50 border border-[#e2e8f0] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-slate-900 h-[32px]">
                  <option>全部等级</option>
                  <option>Critical (严重)</option>
                  <option>High (高危)</option>
                  <option>Medium (中等)</option>
                  <option>Low (低危)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">事件分类</label>
                <select className="bg-slate-50 border border-[#e2e8f0] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-slate-900 h-[32px]">
                  <option>全部类型</option>
                  <option>密码暴力破解</option>
                  <option>钓鱼邮件</option>
                  <option>用户异常行为</option>
                  <option>恶意代码植入</option>
                  <option>数据泄露风险</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">处理状态</label>
                <select className="bg-slate-50 border border-[#e2e8f0] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-slate-900 h-[32px]">
                  <option>全部状态</option>
                  <option>待处理</option>
                  <option>研判中</option>
                  <option>已处置</option>
                  <option>误报忽略</option>
                </select>
              </div>
              <button className="bg-slate-100 hover:bg-slate-200 text-slate-500 px-3 py-1.5 rounded-lg text-xs font-medium h-[32px]">
                重置
              </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#e2e8f0]">
                    <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">事件 ID</th>
                    <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">时间戳</th>
                    <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">事件名称</th>
                    <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">源 IP / 账户</th>
                    <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap min-w-[80px]">风险级别</th>
                    <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">状态</th>
                    <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">AI 研判结论</th>
                    <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right whitespace-nowrap min-w-[160px]">操作</th>
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
                        className={`group transition-all hover:bg-blue-50/30 ${isCritical ? "border-l-[3px] " + levelStyle.accent : ""} ${isCritical ? "bg-red-50/20" : ""}`}
                      >
                        <td className="px-4 py-2.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                          {incident.id}
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap font-mono text-[11px]">
                          {incident.time}
                        </td>
                        <td className="px-4 py-2.5 font-medium text-slate-900 truncate max-w-[280px]" title={incident.name}>
                          {incident.name}
                        </td>
                        <td className="px-4 py-2.5 text-slate-500 truncate max-w-[160px] font-mono text-[11px]" title={incident.source}>
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
                        <td className="px-4 py-2.5 text-slate-500 max-w-[180px] truncate text-[11px]" title={incident.eventDescription}>
                          {incident.eventDescription}
                        </td>
                        <td className="px-4 py-2.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <a
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium text-blue-600 hover:bg-blue-50 transition-all"
                              href="#"
                            >
                              <Eye className="w-3 h-3" />
                              详情
                            </a>
                            <button
                              onClick={() => setSelectedAlert(incidentToAlertItem(incident))}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold transition-all bg-[#00b4d8]/10 text-[#00b4d8] border border-[#00b4d8]/20 hover:bg-[#00b4d8]/20"
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
              <div className="px-4 py-2.5 border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-slate-500 bg-slate-50/30">
                <p>展示 1-10 条，共 <span className="font-semibold text-slate-700">1,284</span> 条记录</p>
                <div className="flex items-center gap-1.5">
                  <button className="px-2.5 py-1 bg-white border border-[#e2e8f0] text-slate-500 rounded-md hover:bg-slate-50 disabled:opacity-40 text-[11px]" disabled>
                    上一页
                  </button>
                  <span className="px-2 text-slate-700 font-medium">1 / 161</span>
                  <button className="px-2.5 py-1 bg-white border border-[#e2e8f0] text-slate-500 rounded-md hover:bg-slate-50 text-[11px]">
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
