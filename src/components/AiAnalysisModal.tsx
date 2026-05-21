import { useState, useEffect, useRef } from "react";
import { X, Brain, Shield, Download, Clock, Loader2, CheckCircle2, Zap } from "lucide-react";
import type { AlertItem } from "@/types";

interface AiAnalysisModalProps {
  alert: AlertItem | null;
  onClose: () => void;
}

interface StreamItem {
  section: string;
  label: string;
  detail: string;
  tag?: string;
  tagColor?: string;
  tagBg?: string;
  highlight?: 'red' | 'blue';
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
      // 如果已经打完了，保留文字；如果从未开始，保持空
      if (!doneFlag.current && hasStarted.current) {
        // 被打断了，保留当前已显示的内容
      }
      return;
    }

    // 如果已经显示完整了，不需要重新开始
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

function StreamItemRow({
  item,
  isActive,
  onTypingDone,
}: {
  item: StreamItem;
  isActive: boolean;
  onTypingDone: () => void;
}) {
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

export default function AiAnalysisModal({ alert, onClose }: AiAnalysisModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [completeTime, setCompleteTime] = useState("");
  const [streamStatus, setStreamStatus] = useState<'idle' | 'streaming' | 'complete'>('idle');

  const section1: StreamItem[] = alert ? [
    { section: "basic", label: "事件时间", detail: "2026-03-20 10:28:39" },
    { section: "basic", label: "调查完成时间", detail: "2026-03-20 10:29:39" },
    { section: "basic", label: "事件标题", detail: "[itservice7@kiiik.com] 经态势感知平台检测，疑似遭遇「邮件暴力破解」，账户权限为「高敏感」" },
    { section: "basic", label: "事件描述", detail: "经态势感知平台检测，疑似遭遇「邮件暴力破解」，账户权限为「高敏感」" },
    { section: "basic", label: "调查状态", detail: "已接入", tag: "已接入", tagColor: "#059669", tagBg: "#ecfdf5" },
  ] : [];

  const section2: StreamItem[] = alert ? [
    { section: "detail", label: "事件发生时间", detail: "Fri Mar 20 10:29:09 CST 2026" },
    { section: "detail", label: "事件等级", detail: "警告", tag: "警告", tagColor: "#dc2626", tagBg: "#fef2f2" },
    { section: "detail", label: "服务节点", detail: "null" },
    { section: "detail", label: "触发安全策略", detail: "疑似暴力破解" },
    { section: "detail", label: "事件来源", detail: "态势感知平台" },
    { section: "detail", label: "", detail: "试错频率0.18秒/次，远超人类操作极限（通常>2秒/次），同一IP持续不间断密集组合，与《2025网络安全手册》中「异常操作行为模式」判定吻合", highlight: 'red' },
    { section: "detail", label: "1. 确认邮件账户所属员工", detail: "邮箱账号 itservice7@kiiik.com · 许博 · 基础运维部 · IT关键岗位" },
    { section: "detail", label: "2. 本次多次试错登录特征", detail: "失败60次 | 平均间隔0.18秒 | 字典攻击模式，含常见组合及姓名拼音+数字变体" },
    { section: "detail", label: "3. 密码策略强度", detail: "上次修改2025-12-01，已超期25天，密码符合复杂度但已过期", tag: "风险", tagColor: "#dc2626", tagBg: "#fef2f2" },
    { section: "detail", label: "4. 近3个月类似试错情况", detail: "同一IP累计试错157次（42→55→60），集中在22:00后，呈递增趋势", highlight: 'red' },
    { section: "detail", label: "5. 安全知识库匹配", detail: "《2025网络安全手册》自动化爆破行为识别，匹配度97%", tag: "97%", tagColor: "#dc2626", tagBg: "#fef2f2" },
    { section: "detail", label: "6. 试错发起IP归属地", detail: "185.220.101.47 · 美国/洛杉矶 · 360标记为高风险IP节点" },
    { section: "detail", label: "7. 试错IP是否针对其他账号", detail: "同时攻击yupepeng(37次)和daiying(20次)，非偶发情况", highlight: 'red' },
    { section: "detail", label: "8. 账号近期是否有异常行为", detail: "未成功登录，发送行为与历史基线一致，暂未发现异常", highlight: 'blue' },
  ] : [];

  const section3: StreamItem[] = alert ? [
    { section: "log", label: "原始日志片段", detail: "22:00:01-22:00:19，IP 185.220.101.47 连续10次登录失败，间隔0.18秒/次" },
    { section: "log", label: "日志异常特征", detail: "pam_authenticate() failed · Authentication failure · Too many invalid commands" },
    { section: "log", label: "时间间隔分析", detail: "最小0.18秒，最大0.39秒，非人工操作，确认脚本执行" },
    { section: "log", label: "success字段", detail: "全为false → 未成功匹配到账号密码正确" },
    { section: "log", label: "IP一致性", detail: "60次攻击均来自同一IP → 非分布式多源行为" },
  ] : [];

  const section4: StreamItem[] = alert ? [
    { section: "conclusion", label: "", detail: "该邮箱正遭受来自美国IP 185.220.101.47 的持续性自动化大量登录失败攻击。失败登录累计157次，失败次数呈递增趋势，且时间规律一致，集中于22:00后非工作时段。", highlight: 'red' },
    { section: "conclusion", label: "", detail: "单次试错间隔最小0.05秒，平均0.18秒，远低于人类正常操作基线。与《2025网络安全手册》中「异常操作行为模式」判定标准高度吻合，置信度97%。该IP同时对企业另外2个账号存在类似试错记录。", highlight: 'red' },
    { section: "conclusion", label: "", detail: "判定该账号正遭受「持续性自动化暴力破解」攻击，性质为高危。截至调查时刻，攻击未成功登录，但账号密码已超期25天未修改，账号为高权限岗位，需立即干预。", highlight: 'red' },
    { section: "conclusion", label: "邮件安全 - 暴力破解", detail: "高危 | 累计试错157次 | 平均间隔0.1秒 | 关联攻击目标2个账号" },
    { section: "conclusion", label: "处置建议-立即执行", detail: "通知许博修改高强度密码并开启MFA；封禁IP 185.220.101.47" },
    { section: "conclusion", label: "处置建议-3天跟进", detail: "同步通知yupepeng、daiying账号立即修改密码" },
    { section: "conclusion", label: "处置建议-7天跟进", detail: "邮件管理员持续监控itservice7账号，确认无异常外发" },
    { section: "conclusion", label: "处置建议-长期", detail: "攻击IP及特征加入知识图谱，同类攻击下次直接触发高危告警" },
  ] : [];

  const allItems = [...section1, ...section2, ...section3, ...section4];
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
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(raf);
  }, [currentIndex, thinkingText]);

  if (!alert) return null;

  const isStreaming = streamStatus === 'streaming' || streamStatus === 'complete';

  const sec1Start = 0;
  const sec2Start = sec1Start + section1.length;
  const sec3Start = sec2Start + section2.length;
  const sec4Start = sec3Start + section3.length;

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
            label="事件详情"
            items={section2}
            currentIndex={currentIndex}
            startIdx={sec2Start}
            typingItem={typingItem}
            onTypingDone={onTypingDone}
            visible={currentIndex >= sec2Start}
          />

          <StreamSection
            label="关键日志调查取证"
            items={section3}
            currentIndex={currentIndex}
            startIdx={sec3Start}
            typingItem={typingItem}
            onTypingDone={onTypingDone}
            visible={currentIndex >= sec3Start}
          />

          <StreamSection
            label="综合结论"
            items={section4}
            currentIndex={currentIndex}
            startIdx={sec4Start}
            typingItem={typingItem}
            onTypingDone={onTypingDone}
            visible={currentIndex >= sec4Start}
          />

          {isStreaming && !done && (
            <div className="sticky bottom-0 mx-4 mb-4 flex items-center gap-3 py-2.5 px-3 rounded-lg bg-white border border-[#00b4d8]/20 shadow-lg shadow-black/5 animate-fade-in-up">
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
          )}

          {done && (
            <div className="flex items-center justify-center gap-2 py-3 mb-4 text-xs text-emerald-600 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              研判完成 · {completeTime} · 共 {allItems.length} 项分析结果
            </div>
          )}
        </div>

        <div className="px-6 py-3 border-t border-[#e2e8f0] bg-white flex items-center justify-between">
          {streamStatus === 'complete' ? (
            <span className="text-xs text-[#64748b] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              AI 研判完成 · {completeTime}
            </span>
          ) : streamStatus === 'streaming' ? (
            <span className="text-xs text-[#00b4d8] flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              AI 研判中...
            </span>
          ) : (
            <span className="text-xs text-[#94a3b8] flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              准备开始研判...
            </span>
          )}
          <span className="text-[10px] text-[#94a3b8]">
            共 {allItems.length} 项
          </span>
        </div>
      </div>
    </div>
  );
}
