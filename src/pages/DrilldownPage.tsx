import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TopBar } from "../components/layout/TopBar";
import { MetricCard } from "../components/dashboard/MetricCard";
import { DrilldownChart } from "../components/drilldown/DrilldownChart";
import { BreakdownBar } from "../components/drilldown/BreakdownBar";
import { AiExplanation } from "../components/drilldown/AiExplanation";
import { ActionList } from "../components/dashboard/ActionList";
import { escalationDrilldown } from "../data/drilldown";
import { actionItems } from "../data/insights";
import { metrics } from "../data/metrics";

export function DrilldownPage() {
  const navigate = useNavigate();
  const { metric, timeSeries, breakdowns, aiExplanation } =
    escalationDrilldown;

  const relatedMetrics = metrics.filter((m) =>
    ["resolution_rate", "csat"].includes(m.id)
  );

  const relatedActions = actionItems.filter((a) =>
    ["action_1", "action_2"].includes(a.id)
  );

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-700 transition-colors mb-4"
        >
          <ArrowLeft size={15} />
          Back to Dashboard
        </button>
        <TopBar
          title="Escalation Analysis"
          subtitle="Deep dive into what's driving the 21% escalation increase"
        />
      </div>

      {/* Metric summary row */}
      <div className="grid grid-cols-3 gap-4">
        <MetricCard metric={metric} index={0} />
        {relatedMetrics.map((m, i) => (
          <MetricCard key={m.id} metric={m} index={i + 1} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <DrilldownChart
          data={timeSeries}
          color="#ef4444"
          title="Escalation Volume Trend"
          format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}K` : String(v))}
        />
        <BreakdownBar breakdowns={breakdowns} />
      </div>

      <AiExplanation
        summary={aiExplanation.summary}
        factors={aiExplanation.factors}
        methodology={aiExplanation.methodology}
      />

      {/* Related actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-sm font-bold uppercase tracking-wider text-surface-400 mb-4">
          Suggested actions for this issue
        </h2>
        <ActionList actions={relatedActions} />
      </motion.div>
    </div>
  );
}
