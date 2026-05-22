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

export default function AiAnalysisModal({ alert, onClose }: AiAnalysisModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [completeTime, setCompleteTime] = useState("");
  const [streamStatus, setStreamStatus] = useState<'idle' | 'streaming' | 'complete'>('idle');

  const timeConfig = useMemo(() => {
    const pad2 = (n: number) => String(n).padStart(2, '0');
    const eventTime = "2026-05-15 09:14:37";
    const completeTime = "2026-05-15 09:16:23";
    return {
      eventTime,
      completeTime,
      completeTimeShort: "09:16:23",
    };
  }, [alert]);

  const logLines = [
    'May 15 09:14:45 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52134 ssh2',
    'May 15 09:14:45 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52135 ssh2',
    'May 15 09:14:46 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52136 ssh2',
    'May 15 09:14:46 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52137 ssh2',
    'May 15 09:14:47 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52138 ssh2',
    '$ grep "Failed password" /var/log/auth.log | grep "185.220.101.47" | wc -l',
    '157',
    '---',
    '$ awk \'{print $1,$2,$3}\' /var/log/auth.log | sort | uniq -c | sort -rn',
    '  157 May 15 09:14',
    '---',
    'May 15 09:14:48 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52139 ssh2',
    'May 15 09:14:49 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52140 ssh2',
    'May 15 09:14:50 mail-server sshd[28471]: Failed password for yupepeng from 185.220.101.47 port 52141 ssh2',
    'May 15 09:14:51 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52142 ssh2',
    'May 15 09:14:52 mail-server sshd[28471]: Failed password for daiying from 185.220.101.47 port 52143 ssh2',
    'May 15 09:14:53 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52144 ssh2',
    'May 15 09:14:54 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52145 ssh2',
    'May 15 09:14:55 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52146 ssh2',
    'May 15 09:14:56 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52147 ssh2',
    'May 15 09:14:57 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52148 ssh2',
    'May 15 09:14:58 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52149 ssh2',
    'May 15 09:14:59 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52150 ssh2',
    '$ lastb | grep 185.220.101.47 | head -10',
    'itservice7 ssh:notty 185.220.101.47  Fri May 15 09:14 - 09:14  (00:00)',
    'itservice7 ssh:notty 185.220.101.47  Fri May 15 09:14 - 09:14  (00:00)',
    'yupepeng   ssh:notty 185.220.101.47  Fri May 15 09:14 - 09:14  (00:00)',
    'itservice7 ssh:notty 185.220.101.47  Fri May 15 09:14 - 09:14  (00:00)',
    'daiying    ssh:notty 185.220.101.47  Fri May 15 09:14 - 09:14  (00:00)',
    'itservice7 ssh:notty 185.220.101.47  Fri May 15 09:14 - 09:14  (00:00)',
    '---',
  ];

  const section1: StreamItem[] = alert ? [
    { section: "basic", label: "事件时间", detail: timeConfig.eventTime },
    { section: "basic", label: "调查完成时间", detail: timeConfig.completeTime },
    { section: "basic", label: "事件标题", detail: "[itservice7@kiiik.com] 经态势感知平台检测，疑似遭遇「邮件暴力破解」，账户权限为「高敏感」" },
    { section: "basic", label: "事件描述", detail: "经态势感知平台检测，疑似遭遇「邮件暴力破解」，账户权限为「高敏感」" },
  ] : [];

  const section2: StreamItem[] = alert ? [
    { section: "detail", label: "事件发生时间", detail: "Thu May 15 09:14:37 CST 2026" },
    { section: "detail", label: "事件等级", detail: "警告", tag: "警告", tagColor: "#dc2626", tagBg: "#fef2f2" },
    { section: "detail", label: "服务节点", detail: "mail-server (10.22.1.84)" },
    { section: "detail", label: "触发安全策略", detail: "疑似暴力破解" },
    { section: "detail", label: "事件来源", detail: "态势感知平台" },
    {
      section: "detail",
      label: "异常行为判定",
      type: 'table',
      tableData: [
        { key: "试错频率", value: "0.18秒/次，远超人类操作极限（通常>2秒/次）" },
        { key: "攻击模式", value: "同一IP持续不间断密集组合，4秒内发起超过20次登录尝试，符合自动化字典攻击特征" },
      ],
    },
    {
      section: "detail",
      label: "1. 确认邮件账户所属员工",
      type: 'table',
      tableData: [
        { key: "邮箱账号", value: "itservice7@kiiik.com" },
        { key: "员工姓名", value: "许博" },
        { key: "所属部门", value: "基础运维部" },
      ],
    },
    {
      section: "detail",
      label: "2. 本次多次试错登录特征",
      type: 'table',
      tableData: [
        { key: "登录失败次数", value: "60次" },
        { key: "发生时间段", value: "2026-05-15 09:14:37 - 09:15:41" },
        { key: "平均间隔", value: "0.18秒/次（最小0.05秒）" },
        { key: "登录特征", value: "连续>20次" },
      ],
    },
    {
      section: "detail",
      label: "3. 密码策略调查",
      type: 'table',
      tableData: [
        { key: "上次修改时间", value: "2026-03-20" },
        { key: "规定到期日", value: "2026-06-18（临近过期）" },
        { key: "风险提示", value: "符合12位+大小写+特殊字符，但密码临近过期" },
      ],
    },
    {
      section: "detail",
      label: "4. 近7天类似行为调查",
      type: 'table',
      tableData: [
        { key: "2026-05-09", value: "同一IP，失败38次，攻击时间22:10-22:40" },
        { key: "2026-05-11", value: "同一IP，失败45次，攻击时间22:30-23:00" },
        { key: "2026-05-13", value: "同一IP，失败52次，攻击时间22:00-22:50" },
        { key: "2026-05-15（今日）", value: "同一IP，失败60次，攻击时间09:14开始" },
        { key: "累计趋势", value: "近7天同一IP累计试错195次，攻击频率逐日攀升（38→45→52→60次），时间规律一致，均集中在22:00后非工作时段" },
      ],
    },
    {
      section: "detail",
      label: "5. 试错发起IP归属地",
      type: 'table',
      tableData: [
        { key: "来源IP", value: "185.220.101.47" },
        { key: "IP归属地", value: "拉萨/香港" },
        { key: "威胁情报标记", value: "360标记为高风险IP节点" },
        { key: "历史告警记录", value: "过去90天内，出现在本企业告警记录攻击2次" },
      ],
    },
    {
      section: "detail",
      label: "6. 关联调查——是否有其他账号收到类似攻击",
      type: 'table',
      tableData: [
        { key: "调查结果", value: "未发现" },
      ],
    },
    {
      section: "detail",
      label: "7. 账号近期是否有异常行为",
      type: 'table',
      tableData: [
        { key: "登录成功记录", value: "未发现（60次全部失败）" },
        { key: "最近一次登录", value: "2026-05-14 18:23:17，IP归属上海市，正常" },
        { key: "外发行为", value: "未发生大量邮件外发/批量附件发送" },
        { key: "其他异常操作", value: "未发现（关联行为管理日志未发现异常访问）" },
        { key: "结论", value: "截至本次调查时刻，账号未成功登录，发送行为与历史基线一致，暂未发现异常" },
      ],
    },
    {
      section: "detail",
      label: "",
      type: 'terminal',
      detail: `May 15 09:14:45 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52134 ssh2\nMay 15 09:14:45 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52135 ssh2\nMay 15 09:14:46 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52136 ssh2\nMay 15 09:14:46 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52137 ssh2\nMay 15 09:14:47 mail-server sshd[28471]: Failed password for itservice7 from 185.220.101.47 port 52138 ssh2`,
    },
  ] : [];

  const section4: StreamItem[] = alert ? [
    {
      section: "conclusion",
      label: "",
      type: 'block',
      highlight: 'red',
      detail: "经过对近期登录日志的排查，我们发现该邮箱存在明显异常。具体而言，来自香港 IP 185.220.101.47 的访问记录呈现出典型的自动化攻击特征：从首次尝试到调查时点，累计出现 157 次登录失败，且失败次数整体呈递增态势。更值得警惕的是，这些请求的时间分布高度规律——几乎集中在 22:00 之后的非工作时段，与正常业务操作时段完全错开。\n\n进一步分析请求间隔发现，单次试错的最短间隔仅 0.05 秒，平均间隔 0.18 秒。这个频率远低于人类正常键盘操作的生理基线，且该用户还未到密码修改周期，因此基本可以排除人为误输或正常遗忘密码的可能。\n\n此外，通过横向关联分析，该 IP 地址尚未对其他公司员工账号进行攻击，同时许博账号并未发现类似群发邮件、访问异常IP等异常行为。\n\n综合判定：该账号当前正遭受持续性自动化暴力破解攻击，事件性质属高危。截至本次调查时刻，攻击方尚未成功登录，风险可控。但需要特别指出的是，该账号密码临近过期仍未修改，一旦防线被突破，后果将呈指数级放大。建议立即启动干预措施，包括但不限于：强制密码重置、临时禁用该 IP 段访问、开启多因素认证，并同步通知账号持有人提高警觉。",
    },
    { section: "conclusion", label: "邮件安全 - 暴力破解", detail: "高危 | 累计试错157次 | 平均间隔0.1秒" },
    {
      section: "conclusion",
      label: "处置建议",
      type: 'table',
      tableData: [
        { key: "立即执行", value: "通知许博修改高强度密码并开启MFA；封禁IP 185.220.101.47" },
        { key: "长期跟进", value: "攻击IP及特征加入知识图谱，同类攻击下次直接触发高危告警" },
      ],
    },
  ] : [];

  const section3Placeholder: StreamItem = { section: "log", label: "", detail: "" };

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