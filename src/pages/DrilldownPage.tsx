import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TopBar } from "../components/layout/TopBar";
import { CollapsibleSection } from "../components/layout/CollapsibleSection";
import { MetricCard } from "../components/dashboard/MetricCard";
import { DrilldownChart } from "../components/drilldown/DrilldownChart";
import { BreakdownBar } from "../components/drilldown/BreakdownBar";
import { AiExplanation } from "../components/drilldown/AiExplanation";
import { ActionList } from "../components/dashboard/ActionList";
import { Toast } from "../components/common/Toast";
import { useToast } from "../hooks/useToast";
import { useTheme } from "../context/ThemeContext";
import { escalationDrilldown } from "../data/drilldown";
import { actionItems } from "../data/insights";
import { metrics } from "../data/metrics";

export function DrilldownPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const toast = useToast();
  const [activeMetricId, setActiveMetricId] = useState<string>("escalations");
  const analysisRef = useRef<HTMLDivElement>(null);
  const { metric, timeSeries, breakdowns, aiExplanation } =
    escalationDrilldown;

  const relatedMetrics = metrics.filter((m) =>
    ["resolution_rate", "csat"].includes(m.id)
  );

  const relatedActions = actionItems.filter((a) =>
    ["action_1", "action_2"].includes(a.id)
  );

  const handleMetricClick = (metricId: string, label: string) => {
    setActiveMetricId(metricId);
    toast.show(`Viewing ${label} analysis`);
    analysisRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate("/scenario-1")}
          className="inline-flex items-center gap-2 text-sm font-medium text-surface-600 hover:text-surface-900 transition-colors mb-4"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <TopBar
          title="Escalation Analysis"
          subtitle="Deep dive into what's driving the 21% escalation increase"
          onPeriodChange={(p) => {
            toast.show(`Showing data for ${p === "7d" ? "last 7 days" : p === "30d" ? "last 30 days" : "last 90 days"}`);
          }}
          onExport={(format) => {
            toast.show(format === "pdf" ? "Exporting escalation report as PDF..." : "Exporting escalation data as CSV...");
          }}
          onShare={(method) => {
            if (method === "copy") {
              toast.show("Analysis link copied to clipboard");
            } else {
              toast.show("Escalation report sent to your inbox");
            }
          }}
        />
      </div>

      {/* Key metrics */}
      <CollapsibleSection
        title="Key metrics"
        titleRight={<span>vs. prior 30 days</span>}
      >
        <div className="grid grid-cols-3 gap-5">
          <MetricCard
            metric={metric}
            index={0}
            active={activeMetricId === metric.id}
            onClick={() => handleMetricClick(metric.id, metric.label)}
          />
          {relatedMetrics.map((m, i) => (
            <MetricCard
              key={m.id}
              metric={m}
              index={i + 1}
              active={activeMetricId === m.id}
              onClick={() => handleMetricClick(m.id, m.label)}
            />
          ))}
        </div>
      </CollapsibleSection>

      {/* Trend and breakdown */}
      <div ref={analysisRef} />
      <CollapsibleSection title="Trend and breakdown">
        <div className="grid grid-cols-2 gap-6">
          <DrilldownChart
            data={timeSeries}
            color={darkMode ? "#f87171" : "#dc2626"}
            title="Escalation Volume Trend"
            format={(v) =>
              v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v)
            }
          />
          <BreakdownBar breakdowns={breakdowns} />
        </div>
      </CollapsibleSection>

      {/* Merged: AI analysis + recommended actions */}
      <CollapsibleSection title="Analysis & recommended actions">
        <div className="space-y-6">
          <AiExplanation
            summary={aiExplanation.summary}
            factors={aiExplanation.factors}
            methodology={aiExplanation.methodology}
          />
          <div className="flex items-center gap-2 pt-2">
            <div className="h-px flex-1 bg-surface-200" />
            <span className="text-xs font-bold uppercase tracking-wider text-surface-500 shrink-0">Recommended next steps</span>
            <div className="h-px flex-1 bg-surface-200" />
          </div>
          <ActionList actions={relatedActions} />
        </div>
      </CollapsibleSection>

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={toast.hide}
      />
    </div>
  );
}
