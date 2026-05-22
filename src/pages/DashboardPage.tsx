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
  Copy,
  Mail,
  Download,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";
import { TopBar } from "../components/layout/TopBar";
import { CollapsibleSection } from "../components/layout/CollapsibleSection";
import { SparklineChart } from "../components/dashboard/SparklineChart";
import { Toast } from "../components/common/Toast";
import { useToast } from "../hooks/useToast";
import { useTheme } from "../context/ThemeContext";
import { metricsByPeriod } from "../data/metrics";
import type { PeriodKey } from "../data/metrics";
import {
  insightsByPeriod,
  actionItemsByPeriod,
  accountHealthByPeriod,
} from "../data/insights";

const CLICKABLE_METRICS = new Set(["resolution_rate", "csat"]);

export function DashboardPage() {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [showAllMetrics, setShowAllMetrics] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedInsights, setExpandedInsights] = useState<number[]>([0]);

  const toast = useToast();
  const [activePeriod, setActivePeriod] = useState<PeriodKey>("30d");

  const periodSubtitles: Record<PeriodKey, string> = {
    "7d": "Monday, May 19, 2026 - Last 7 days",
    "30d": "Monday, May 19, 2026 - Weekly performance review",
    "90d": "Monday, May 19, 2026 - Quarterly view",
  };

  const metrics = metricsByPeriod[activePeriod];
  const currentInsights = insightsByPeriod[activePeriod];
  const currentActions = actionItemsByPeriod[activePeriod];
  const currentHealth = accountHealthByPeriod[activePeriod];

  const hero = [
    metrics.find((m) => m.id === "ai_revenue")!,
    metrics.find((m) => m.id === "ai_cvr")!,
    metrics.find((m) => m.id === "resolution_rate")!,
    metrics.find((m) => m.id === "csat")!,
  ];

  const topAction = currentActions[0];

  const handleCopy = () => {
    const revenueMetric = hero[0];
    const cvrMetric = hero[1];
    const resMetric = hero[2];
    const csatMetric = hero[3];
    const text = `Alhena Snapshot - May 19, 2026 (${activePeriod === "7d" ? "7 days" : activePeriod === "30d" ? "30 days" : "90 days"})\n\nRevenue: ${revenueMetric.value} (${revenueMetric.change}) | Conversion: ${cvrMetric.value} | Resolution: ${resMetric.value} (${resMetric.change}) | CSAT: ${csatMetric.value} (${csatMetric.change})\n\nTop Insight: ${currentInsights[0]?.title ?? ""}\nPriority Action: ${topAction.title} (est. ${topAction.estimatedImpact})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEmail = () => {
    toast.show("Report sent to your inbox");
  };

  const handlePdf = () => {
    toast.show("PDF downloading...");
  };

  const toggleInsight = (index: number) => {
    setExpandedInsights((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const insightActionNavigation = (insight: (typeof currentInsights)[0]) => {
    if (
      insight.relatedMetrics.includes("escalations") ||
      insight.relatedMetrics.includes("resolution_rate")
    ) {
      navigate("/scenario-1/drilldown");
    } else if (insight.relatedMetrics.includes("nudge_revenue")) {
      toast.show("A/B test configuration opened");
    } else {
      navigate("/scenario-1/alerts");
    }
  };

  const actionItemNavigation = (action: (typeof currentActions)[0]) => {
    if (action.category === "Support") {
      navigate("/scenario-1/drilldown");
    } else if (action.category === "Content") {
      navigate("/scenario-1/alerts");
    } else if (action.category === "Revenue") {
      toast.show("A/B test configuration opened");
    } else {
      toast.show("Performance summary generated");
    }
  };

  const typeConfig: Record<string, { label: string; dotColor: string; labelColor: string; borderColor: string }> = {
    win: { label: "Win", dotColor: "bg-success-500", labelColor: "text-success-700", borderColor: "border-l-success-500" },
    risk: { label: "Risk", dotColor: "bg-danger-500", labelColor: "text-danger-700", borderColor: "border-l-danger-500" },
    opportunity: { label: "Opportunity", dotColor: "bg-warning-500", labelColor: "text-warning-700", borderColor: "border-l-warning-500" },
    action: { label: "Action", dotColor: "bg-alhena-500", labelColor: "text-alhena-700", borderColor: "border-l-alhena-500" },
  };

  const weeklyInsights = currentInsights.map((insight) => {
    const cfg = typeConfig[insight.type] ?? typeConfig.action;
    return { ...cfg, headline: insight.title, insight };
  });

  return (
    <div className="space-y-6">
      <TopBar
        title="Dashboard"
        subtitle={periodSubtitles[activePeriod]}
        period={activePeriod}
        onPeriodChange={(p) => {
          setActivePeriod(p);
          setExpandedInsights([0]);
          toast.show(`Showing data for ${p === "7d" ? "last 7 days" : p === "30d" ? "last 30 days" : "last 90 days"}`);
        }}
        onExport={(format) => {
          toast.show(format === "pdf" ? "Generating PDF report..." : "Exporting CSV data...");
        }}
        onShare={(method) => {
          if (method === "copy") {
            toast.show("Dashboard link copied to clipboard");
          } else {
            toast.show("Report sent to your inbox");
          }
        }}
      />

      {/* ── ACCOUNT HEALTH ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={clsx(
          "rounded-2xl border px-6 py-4 flex items-center gap-4",
          currentHealth.score >= 80
            ? "bg-success-50 border-success-200"
            : currentHealth.score >= 60
              ? "bg-warning-50 border-warning-200"
              : "bg-danger-50 border-danger-200"
        )}
      >
        <div className="flex items-center gap-3 shrink-0">
          <div
            className={clsx(
              "w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white",
              currentHealth.score >= 80
                ? "bg-success-500"
                : currentHealth.score >= 60
                  ? "bg-warning-500"
                  : "bg-danger-500"
            )}
          >
            {currentHealth.score}
          </div>
          <div>
            <p className="text-sm font-bold text-surface-900">
              Account Health: {currentHealth.label}
            </p>
            <p className="text-xs text-surface-600 flex items-center gap-1">
              {currentHealth.trend === "down" && (
                <>
                  <ArrowDownRight size={12} className="text-danger-500" />
                  Trending down
                </>
              )}
              {currentHealth.trend === "up" && (
                <>
                  <ArrowUpRight size={12} className="text-success-500" />
                  Trending up
                </>
              )}
            </p>
          </div>
        </div>
        <p className="text-sm text-surface-700 flex-1">
          {currentHealth.summary}
        </p>
      </motion.div>

      {/* ── HERO METRICS ── */}
      <CollapsibleSection
        title="Key metrics"
        titleRight={<span>vs. prior {activePeriod === "7d" ? "7" : activePeriod === "30d" ? "30" : "90"} days</span>}
      >
        <div className="grid grid-cols-4 gap-5">
          {hero.map((m, i) => {
            const isNeg = m.sentiment === "negative";
            const isWarn = m.sentiment === "warning";
            const isPos = m.sentiment === "positive";
            const isClickable = CLICKABLE_METRICS.has(m.id);

            const cardInner = (
              <>
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
              </>
            );

            if (isClickable) {
              return (
                <motion.button
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  onClick={() => navigate("/scenario-1/drilldown")}
                  className={clsx(
                    "bg-surface-0 rounded-2xl border p-5 transition-all text-left cursor-pointer hover:shadow-md hover:border-surface-300",
                    isNeg ? "border-danger-200" : "border-surface-200"
                  )}
                >
                  {cardInner}
                </motion.button>
              );
            }

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
                {cardInner}
              </motion.div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* ── THIS WEEK'S INSIGHTS ── */}
      <CollapsibleSection title={activePeriod === "7d" ? "This week's insights" : activePeriod === "90d" ? "This quarter's insights" : "This month's insights"}>
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
                                insightActionNavigation(item.insight)
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
          {/* Priority action - highlighted row */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={() => navigate("/scenario-1/drilldown")}
            className="w-full px-5 py-3.5 text-left border-l-[3px] border-l-alhena-500 bg-alhena-50/30 hover:bg-alhena-50 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb size={13} className="text-alhena-500 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-alhena-600">
                Priority
              </span>
              <span className="text-xs text-surface-400">
                {topAction.owner}
              </span>
            </div>
            <h3 className="text-[0.875rem] font-semibold text-surface-900 leading-snug mb-1">
              {topAction.title}
            </h3>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-alhena-600">
                {topAction.estimatedImpact}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-alhena-600 group-hover:gap-2 transition-all">
                View analysis
                <ArrowRight size={12} />
              </span>
            </div>
          </motion.button>

          {/* Remaining action items - compact rows */}
          <div className="divide-y divide-surface-100">
            {currentActions.slice(1, 5).map((a, i) => {
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
                  onClick={() => actionItemNavigation(a)}
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

      {/* ── SHARE ── */}
      <CollapsibleSection title="Share with your team">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.4 }}
          className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
        >
          <div className="px-5 py-4 bg-surface-50/50 border-b border-surface-100">
            <p className="text-sm text-surface-700 font-medium mb-1">
              {activePeriod === "7d" ? "Weekly" : activePeriod === "90d" ? "Quarterly" : "Monthly"} snapshot ready to share
            </p>
            <p className="text-xs text-surface-500">
              Formatted for executives, ecommerce, CX, or the Alhena account team
            </p>
          </div>
          <div className="px-5 py-4">
            <div className="bg-surface-50 rounded-xl px-4 py-3 mb-4 text-xs text-surface-600 font-mono leading-relaxed">
              <p className="font-semibold text-surface-800 mb-1">
                Alhena {activePeriod === "7d" ? "Weekly" : activePeriod === "90d" ? "Quarterly" : "Monthly"} Snapshot - May 19, 2026
              </p>
              <p>
                Revenue: {hero[0].value} ({hero[0].change}) | Conversion: {hero[1].value} | Resolution: {hero[2].value} ({hero[2].change}) | CSAT: {hero[3].value} ({hero[3].change})
              </p>
              <p className="mt-1">Top Insight: {currentInsights[0]?.title}</p>
              <p>Priority: {topAction.title} (est. {topAction.estimatedImpact})</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className={clsx(
                  "inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all",
                  copied
                    ? "bg-success-50 text-success-700 border border-success-200"
                    : "bg-alhena-500 text-white hover:bg-alhena-600"
                )}
              >
                {copied ? (
                  <CheckCircle2 size={15} />
                ) : (
                  <Copy size={15} />
                )}
                {copied ? "Copied!" : "Copy summary"}
              </button>
              <button
                onClick={handleEmail}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-surface-200 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors"
              >
                <Mail size={15} />
                Email
              </button>
              <button
                onClick={handlePdf}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-surface-200 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors"
              >
                <Download size={15} />
                PDF
              </button>
            </div>
          </div>
        </motion.div>
      </CollapsibleSection>

      {/* ── ALL METRICS ── */}
      <section aria-labelledby="metrics-heading">
        <button
          onClick={() => setShowAllMetrics(!showAllMetrics)}
          className="flex items-center gap-2 text-sm font-bold text-surface-700 hover:text-surface-900 transition-colors mb-5"
          aria-expanded={showAllMetrics}
          id="metrics-heading"
        >
          {showAllMetrics ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
          All metrics (
          {metrics.filter((m) => !hero.some((h) => h.id === m.id)).length})
        </button>

        {showAllMetrics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="grid grid-cols-4 gap-4"
          >
            {metrics
              .filter((m) => !hero.some((h) => h.id === m.id))
              .map((m) => (
                <button
                  key={m.id}
                  onClick={() => navigate("/scenario-1/drilldown")}
                  className="bg-surface-0 rounded-xl border border-surface-200 p-4 text-left hover:shadow-md hover:border-surface-300 transition-all cursor-pointer"
                >
                  <p className="text-sm font-medium text-surface-600 mb-2">
                    {m.label}
                  </p>
                  <div className="flex items-end justify-between">
                    <span className="text-xl font-bold text-surface-900">
                      {m.value}
                    </span>
                    <span
                      className={clsx(
                        "text-sm font-semibold flex items-center gap-0.5",
                        m.sentiment === "negative"
                          ? "text-danger-600"
                          : m.sentiment === "warning"
                            ? "text-warning-700"
                            : m.sentiment === "positive"
                              ? "text-success-600"
                              : "text-surface-600"
                      )}
                    >
                      {m.change}
                    </span>
                  </div>
                </button>
              ))}
          </motion.div>
        )}
      </section>

      <Toast message={toast.message} visible={toast.visible} onClose={toast.hide} />
    </div>
  );
}
