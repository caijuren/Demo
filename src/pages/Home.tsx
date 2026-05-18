import { useState } from "react";
import { Activity } from "lucide-react";
import DashboardCard from "@/components/DashboardCard";
import AlertTable from "@/components/AlertTable";
import AiAnalysisModal from "@/components/AiAnalysisModal";
import { dashboardMetrics, AlertList } from "@/data/mockData";
import type { AlertItem } from "@/types";

export default function Home() {
  const [selectedAlert, setSelectedAlertAiAnalysisModal] = useState<AlertItem | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-[#00b4d8]/20 to-[#00b4d8]/5">
              <Activity className="w-6 h-6 text-[#00b4d8]" />
            </div>
            <h1 className="text-2xl font-bold text-gradient">
              智能告警监控大屏
            </h1>
          </div>
          <p className="text-sm text-[#64748b] ml-11">
            实时监控系统健康状态 · 共 {AlertList.length} 条告警
          </p>
        </header>

        <section className="mb-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex flex-wrap gap-4">
            {dashboardMetrics.map((metric, index) => (
              <DashboardCard key={metric.id} metric={metric} index={index} />
            ))}
          </div>
        </section>

        <section className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#e2e8f0]">告警列表</h2>
            <span className="text-xs text-[#64748b] font-mono">
              更新于 {new Date().toLocaleTimeString("zh-CN", { hour12: false })}
            </span>
          </div>
          <AlertTable alerts={AlertList} onAnalyze={setSelectedAlertAiAnalysisModal} />
        </section>
      </div>

      <AiAnalysisModal
        alert={selectedAlert}
        onClose={() => setSelectedAlertAiAnalysisModal(null)}
      />
    </div>
  );
}