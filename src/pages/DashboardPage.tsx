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
} from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";
import { TopBar } from "../components/layout/TopBar";
import { CollapsibleSection } from "../components/layout/CollapsibleSection";
import { SparklineChart } from "../components/dashboard/SparklineChart";
import { metrics } from "../data/metrics";
import { insights, actionItems } from "../data/insights";

export function DashboardPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [expandedInsights, setExpandedInsights] = useState<number[]>([0]);

  const hero = [
    metrics.find((m) => m.id === "ai_revenue")!,
    metrics.find((m) => m.id === "ai_cvr")!,
    metrics.find((m) => m.id === "resolution_rate")!,
    metrics.find((m) => m.id === "csat")!,
  ];

  const topAction = actionItems[0];

  const handleCopy = () => {
    const text = `Alhena Weekly Snapshot - May 19, 2026\n\nRevenue: $612K (+18%) | Conversion: 14.8% (vs 3.2% baseline) | Resolution: 78.4% (-4.6pp) | CSAT: 84% (-3pp)\n\nTop Win: AI-influenced revenue hit $612K, up 18% MoM\nTop Risk: Escalations surged 21%, driven by subscription cancellation & shipping ETA\nPriority Action: Fix subscription cancellation flow (est. -15% escalations, +1-2pp CSAT)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleInsight = (index: number) => {
    setExpandedInsights((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const weeklyInsights = [
    {
      label: "Win",
      dotColor: "bg-success-500",
      labelColor: "text-success-700",
      headline: "Revenue up 18% to $612K",
      insight: insights[0],
    },
    {
      label: "Risk",
      dotColor: "bg-danger-500",
      labelColor: "text-danger-700",
      headline: "Support quality declined - escalations surged 21%",
      insight: insights[1],
    },
    {
      label: "Opportunity",
      dotColor: "bg-warning-500",
      labelColor: "text-warning-700",
      headline: "Smart nudges drive $274K but CSAT is 76%",
      insight: insights[2],
    },
    {
      label: "Risk",
      dotColor: "bg-danger-500",
      labelColor: "text-danger-700",
      headline: "Return policy answers flagged as low confidence",
      insight: insights[3],
    },
  ];

  return (
    <div className="space-y-10">
      <TopBar
        title="Dashboard"
        subtitle="Monday, May 19, 2026 - Weekly performance review"
      />

      {/* ── HERO METRICS ── */}
      <CollapsibleSection
        title="Is Alhena driving outcomes?"
        titleRight="vs. prior 30 days"
        defaultOpen={true}
        id="outcomes-heading"
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
                  "bg-surface-0 rounded-2xl border p-5 transition-all",
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
                <div className="flex items-end justify-between mb-3">
                  <span className="text-3xl font-bold text-surface-900 leading-none tracking-tight">
                    {m.value}
                  </span>
                  <span
                    className={clsx(
                      "inline-flex items-center gap-0.5 text-sm font-semibold",
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
                  <div className="h-10" aria-hidden="true">
                    <SparklineChart
                      data={m.sparklineData}
                      color={
                        isNeg
                          ? "#dc2626"
                          : isWarn
                            ? "#d97706"
                            : "#16a34a"
                      }
                      height={40}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* ── THIS WEEK'S INSIGHTS ── */}
      <CollapsibleSection
        title="This week's insights"
        defaultOpen={true}
        id="insights-heading"
      >
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
                <div key={item.insight.id}>
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
                              onClick={() => {
                                if (
                                  item.insight.relatedMetrics.includes(
                                    "escalations"
                                  ) ||
                                  item.insight.relatedMetrics.includes(
                                    "resolution_rate"
                                  )
                                )
                                  navigate("/scenario-1/drilldown");
                              }}
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

      {/* ── ALL METRICS ── */}
      <CollapsibleSection
        title={`All metrics (${metrics.filter((m) => !hero.some((h) => h.id === m.id)).length})`}
        defaultOpen={true}
        id="metrics-heading"
      >
        <div className="grid grid-cols-4 gap-4">
          {metrics
            .filter((m) => !hero.some((h) => h.id === m.id))
            .map((m) => (
              <div
                key={m.id}
                className="bg-surface-0 rounded-xl border border-surface-200 p-4"
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
              </div>
            ))}
        </div>
      </CollapsibleSection>

      {/* ── ACT ON FIRST ── */}
      <CollapsibleSection
        title="Act on first"
        defaultOpen={true}
        id="action-heading"
        headingMargin="mb-3"
      >
        <div className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden">
          {/* Priority action - highlighted row */}
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            onClick={() => navigate("/scenario-1/drilldown")}
            className="w-full px-5 py-4 text-left border-l-[3px] border-l-alhena-500 bg-alhena-50/40 hover:bg-alhena-50 transition-colors group"
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
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-alhena-600 group-hover:gap-2.5 transition-all">
                    View analysis
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          </motion.button>

          {/* Remaining action items - compact rows */}
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
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.25 + i * 0.03 }}
                  className="px-5 py-2.5 hover:bg-surface-50 transition-colors cursor-pointer flex items-center gap-3"
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
                </motion.div>
              );
            })}
          </div>
        </div>
      </CollapsibleSection>

      {/* ── SHARE ── */}
      <CollapsibleSection
        title="Share with your team"
        defaultOpen={true}
        id="share-heading"
      >
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.4 }}
          className="bg-surface-0 rounded-2xl border border-surface-200 px-5 py-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-surface-600">
              Weekly snapshot ready to share - includes key metrics, top win,
              risk, and recommended action.
            </p>
            <div className="flex items-center gap-2 shrink-0 ml-6">
              <button
                onClick={handleCopy}
                className={clsx(
                  "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
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
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-surface-200 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors">
                <Mail size={15} />
                Email
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-surface-200 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors">
                <Download size={15} />
                PDF
              </button>
            </div>
          </div>
        </motion.div>
      </CollapsibleSection>
    </div>
  );
}
