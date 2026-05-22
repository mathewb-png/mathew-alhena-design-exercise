import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";
import { CollapsibleSection } from "../../components/layout/CollapsibleSection";
import { SparklineChart } from "../../components/dashboard/SparklineChart";
import { Toast } from "../../components/common/Toast";
import { useToast } from "../../hooks/useToast";
import { useTheme } from "../../context/ThemeContext";
import { metrics } from "../../data/metrics";
import { insights, actionItems, accountHealth } from "../../data/insights";

export function PreviewDashboardPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const toast = useToast();
  const [expandedInsights, setExpandedInsights] = useState<number[]>([0]);

  const hero = [
    metrics.find((m) => m.id === "ai_revenue")!,
    metrics.find((m) => m.id === "ai_cvr")!,
    metrics.find((m) => m.id === "resolution_rate")!,
    metrics.find((m) => m.id === "csat")!,
  ];

  const topAction = actionItems[0];

  const toggleInsight = (index: number) => {
    setExpandedInsights((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const typeConfig: Record<string, { label: string; dotColor: string; labelColor: string; borderColor: string }> = {
    win: { label: "Win", dotColor: "bg-success-500", labelColor: "text-success-700", borderColor: "border-l-success-500" },
    risk: { label: "Risk", dotColor: "bg-danger-500", labelColor: "text-danger-700", borderColor: "border-l-danger-500" },
    opportunity: { label: "Opportunity", dotColor: "bg-warning-500", labelColor: "text-warning-700", borderColor: "border-l-warning-500" },
    action: { label: "Action", dotColor: "bg-alhena-500", labelColor: "text-alhena-700", borderColor: "border-l-alhena-500" },
  };

  const weeklyInsights = insights.map((insight) => {
    const cfg = typeConfig[insight.type] ?? typeConfig.action;
    return { ...cfg, headline: insight.title, insight };
  });

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate("/scenario-2")}
        className="inline-flex items-center gap-2 text-sm font-medium text-surface-600 hover:text-surface-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Launch Readiness
      </button>

      {/* Preview banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-alhena-50 rounded-2xl border border-alhena-200 px-6 py-4 flex items-center gap-4"
      >
        <div className="w-9 h-9 rounded-lg bg-alhena-500 flex items-center justify-center shrink-0">
          <Eye size={16} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-alhena-800">
            Dashboard preview
          </p>
          <p className="text-sm text-alhena-700">
            This is exactly what your dashboard will look like after launch. The data below is illustrative.
          </p>
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-alhena-100 text-xs font-semibold text-alhena-600 shrink-0">
          <Eye size={11} />
          Preview
        </span>
      </motion.div>

      {/* ── ACCOUNT HEALTH ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={clsx(
          "rounded-2xl border px-6 py-4 flex items-center gap-4",
          accountHealth.score >= 80
            ? "bg-success-50 border-success-200"
            : accountHealth.score >= 60
              ? "bg-warning-50 border-warning-200"
              : "bg-danger-50 border-danger-200"
        )}
      >
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={clsx(
              "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white",
              accountHealth.score >= 80
                ? "bg-success-500"
                : accountHealth.score >= 60
                  ? "bg-warning-500"
                  : "bg-danger-500"
            )}
          >
            {accountHealth.score}
          </div>
          <div>
            <p className="text-sm font-bold text-surface-900">
              Account Health: {accountHealth.label}
            </p>
            <p className="text-xs text-surface-600 flex items-center gap-1">
              {accountHealth.trend === "down" && (
                <>
                  <ArrowDownRight size={12} className="text-danger-500" />
                  Trending down
                </>
              )}
              {accountHealth.trend === "up" && (
                <>
                  <ArrowUpRight size={12} className="text-success-500" />
                  Trending up
                </>
              )}
            </p>
          </div>
        </div>
        <p className="text-sm text-surface-700 flex-1">
          {accountHealth.summary}
        </p>
      </motion.div>

      {/* ── HERO METRICS ── */}
      <CollapsibleSection
        title="Key metrics"
        titleRight={<span>vs. prior 30 days</span>}
      >
        <div className="grid grid-cols-4 gap-5">
          {hero.map((m, i) => {
            const isNeg = m.sentiment === "negative";
            const isWarn = m.sentiment === "warning";
            const isPos = m.sentiment === "positive";

            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.04 }}
                className={clsx(
                  "bg-surface-0 rounded-2xl border p-5 text-left",
                  isNeg ? "border-danger-200" : "border-surface-200"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-surface-600">
                    {m.label}
                  </p>
                  {isPos && (
                    <CheckCircle2
                      size={16}
                      className="text-success-600"
                      aria-label="Positive trend"
                    />
                  )}
                  {isNeg && (
                    <XCircle
                      size={16}
                      className="text-danger-500"
                      aria-label="Negative trend"
                    />
                  )}
                </div>
                <div className="flex items-end justify-between mb-1">
                  <span className="text-3xl font-bold text-surface-900 leading-none tracking-tight">
                    {m.value}
                  </span>
                  <span
                    className={clsx(
                      "inline-flex items-center gap-0.5 text-sm font-semibold whitespace-nowrap",
                      isNeg
                        ? "text-danger-600"
                        : isWarn
                          ? "text-warning-700"
                          : "text-success-600"
                    )}
                  >
                    {m.changeValue > 0 ? (
                      <ArrowUpRight size={16} />
                    ) : (
                      <ArrowDownRight size={16} />
                    )}
                    {m.change}
                  </span>
                </div>
                {m.sparklineData && (
                  <div className="mt-2">
                    <SparklineChart
                      data={m.sparklineData}
                      color={
                        isNeg
                          ? (darkMode ? "#f87171" : "#dc2626")
                          : isWarn
                            ? (darkMode ? "#fbbf24" : "#d97706")
                            : (darkMode ? "#4ade80" : "#16a34a")
                      }
                      height={36}
                      formatValue={(v) => {
                        if (m.value.includes("%")) return `${v}%`;
                        if (m.value.startsWith("$")) {
                          if (v >= 1_000) return `$${Math.round(v)}K`;
                          return `$${v}`;
                        }
                        if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K`;
                        return String(v);
                      }}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* ── THIS MONTH'S INSIGHTS ── */}
      <CollapsibleSection title="This month's insights">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-surface-0 rounded-xl border border-surface-200 overflow-hidden"
        >
          <div className="px-5 py-3 border-b border-surface-100 flex items-center gap-2">
            <Sparkles size={16} className="text-alhena-500" />
            <span className="text-sm font-semibold text-surface-900">
              AI-generated summary
            </span>
            <span className="text-xs text-surface-500 ml-auto flex items-center gap-1.5">
              <Clock size={13} />
              Updated 2h ago
            </span>
          </div>

          <div className="divide-y divide-surface-100">
            {weeklyInsights.map((item, i) => {
              const isExpanded = expandedInsights.includes(i);
              return (
                <div key={item.insight.id} className={clsx("border-l-[3px]", item.borderColor)}>
                  <button
                    onClick={() => toggleInsight(i)}
                    className="w-full px-5 py-3.5 flex items-center gap-3 hover:bg-surface-50/80 transition-colors text-left"
                    aria-expanded={isExpanded}
                  >
                    <span
                      className={clsx(
                        "w-2 h-2 rounded-full shrink-0",
                        item.dotColor
                      )}
                    />
                    <span
                      className={clsx(
                        "text-xs font-bold uppercase tracking-wider shrink-0 w-24 text-left",
                        item.labelColor
                      )}
                    >
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-surface-800 flex-1 min-w-0 text-left">
                      {item.headline}
                    </span>
                    {item.insight.confidence !== "high" && (
                      <span className="text-xs text-surface-500 bg-surface-100 px-2 py-0.5 rounded-full font-medium shrink-0">
                        {item.insight.confidence} confidence
                      </span>
                    )}
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-surface-400"
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pb-4 pt-0.5 pr-5 pl-[9.25rem]">
                          <ul className="space-y-2 mb-3" aria-label="Evidence">
                            {item.insight.evidence.slice(0, 3).map((e, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-2 text-sm text-surface-600"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-surface-300 mt-2 shrink-0" />
                                <span>{e}</span>
                              </li>
                            ))}
                          </ul>
                          {item.insight.recommendedAction && (
                            <button
                              onClick={() =>
                                toast.show("Action available after launch")
                              }
                              className="text-sm font-semibold text-alhena-600 hover:text-alhena-700 transition-colors flex items-center gap-1.5"
                            >
                              {item.insight.actionLabel}
                              <ArrowRight size={14} />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      </CollapsibleSection>

      {/* ── ACT ON FIRST ── */}
      <CollapsibleSection title="Act on first">
        <div className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden">
          <div
            onClick={() => toast.show("Drilldown available after launch")}
            className="w-full px-5 py-4 text-left border-l-[3px] border-l-alhena-500 bg-alhena-50/40 hover:bg-alhena-50 transition-colors cursor-pointer group"
          >
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-md bg-alhena-500 flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb size={14} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-alhena-600">
                    Priority action
                  </span>
                  <span className="text-xs text-surface-500">
                    {topAction.owner} / {topAction.category}
                  </span>
                </div>
                <h3 className="text-[0.9375rem] font-bold text-surface-900 leading-snug">
                  {topAction.title}
                </h3>
                <p className="text-sm text-surface-600 leading-normal mt-0.5">
                  {topAction.description}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm font-semibold text-alhena-600">
                    Est. impact: {topAction.estimatedImpact}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="divide-y divide-surface-100">
            {actionItems.slice(1, 5).map((a, i) => {
              const dotColor =
                a.priority === "critical"
                  ? "bg-danger-500"
                  : a.priority === "high"
                    ? "bg-warning-500"
                    : a.priority === "medium"
                      ? "bg-alhena-500"
                      : "bg-surface-400";
              return (
                <motion.button
                  key={a.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.25 + i * 0.03 }}
                  onClick={() => toast.show("Action available after launch")}
                  className="w-full px-5 py-2.5 hover:bg-surface-50 transition-colors cursor-pointer flex items-center gap-3 text-left"
                >
                  <span
                    className={clsx(
                      "w-2 h-2 rounded-full shrink-0",
                      dotColor
                    )}
                  />
                  <span className="text-sm font-semibold text-surface-900 flex-1 min-w-0 truncate">
                    {a.title}
                  </span>
                  <span className="text-xs text-alhena-600 shrink-0">
                    {a.estimatedImpact}
                  </span>
                  <span className="text-xs text-surface-500 shrink-0 w-20 text-right">
                    {a.owner}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </CollapsibleSection>

      <Toast message={toast.message} visible={toast.visible} onClose={toast.hide} />
    </div>
  );
}
