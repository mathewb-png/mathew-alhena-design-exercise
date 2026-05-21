import { motion } from "framer-motion";
import {
  AlertTriangle,
  AlertOctagon,
  ShieldAlert,
  ArrowRight,
  Clock,
  Eye,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { clsx } from "clsx";
import { TopBar } from "../components/layout/TopBar";
import { riskSignals } from "../data/insights";

const anomalyStates = [
  {
    id: "anomaly_1",
    type: "data_conflict" as const,
    icon: ShieldAlert,
    severity: "high" as const,
    title: "Return policy content conflict detected",
    description:
      "Alhena found conflicting return policy information between your help center (14-day return window) and Shopify policy page (30-day return window). This may cause inconsistent answers.",
    confidence: "low" as const,
    affectedMetric: "~8% of conversations touch return policy",
    detectedAt: "2 days ago",
    suggestedAction: "Reconcile return policy sources",
    details: [
      "Help center states: '14-day return window for all products'",
      "Shopify policy page states: '30-day return window for unused items'",
      "Alhena is currently using the help center version (last updated: April 12)",
      "23 escalations in the last 7 days cited conflicting return information",
    ],
  },
  {
    id: "anomaly_2",
    type: "metric_anomaly" as const,
    icon: AlertTriangle,
    severity: "critical" as const,
    title: "Subscription cancellation escalations spiking",
    description:
      "Subscription cancellation escalations increased 45% in the last 14 days, significantly outpacing overall escalation growth (+21%). The current AI response flow does not offer retention options.",
    confidence: "high" as const,
    affectedMetric: "1,680 escalations (30% of total)",
    detectedAt: "3 days ago",
    suggestedAction: "Update cancellation flow with retention offers",
    details: [
      "45% increase vs. 21% overall escalation increase",
      "No self-service cancellation path exists",
      "Average time to agent: 12 minutes (up from 8 minutes)",
      "Competitor benchmark: 60% of cancellations handled by AI with retention offers",
    ],
  },
];

const severityStyles = {
  critical: {
    bg: "bg-danger-50",
    border: "border-danger-200",
    iconBg: "bg-danger-500",
    badge: "bg-danger-100 text-danger-700",
    ring: "ring-danger-500/20",
  },
  high: {
    bg: "bg-warning-50",
    border: "border-warning-200",
    iconBg: "bg-warning-500",
    badge: "bg-warning-100 text-warning-700",
    ring: "ring-warning-500/20",
  },
};

const confidenceExplanations = {
  high: "Based on strong statistical evidence across multiple data points.",
  medium:
    "Based on moderate evidence. Some contributing factors are inferred.",
  low: "Based on limited or indirect evidence. Verify before acting.",
};

export function AnomalyPage() {
  return (
    <div className="space-y-8">
      <TopBar
        title="Alerts & Anomalies"
        subtitle="Issues that need your attention"
        showActions={false}
      />

      {/* Active alerts */}
      <section className="space-y-4">
        {anomalyStates.map((anomaly, i) => {
          const style =
            severityStyles[anomaly.severity as keyof typeof severityStyles];
          const Icon = anomaly.icon;

          return (
            <motion.div
              key={anomaly.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={clsx(
                "rounded-2xl border-2 p-6 ring-4",
                style.border,
                style.bg,
                style.ring
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={clsx(
                    "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                    style.iconBg
                  )}
                >
                  <Icon size={22} className="text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={clsx(
                        "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full",
                        style.badge
                      )}
                    >
                      {anomaly.severity}
                    </span>
                    <span className="text-[10px] text-surface-400 flex items-center gap-1">
                      <Clock size={10} />
                      Detected {anomaly.detectedAt}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-surface-900 mb-2">
                    {anomaly.title}
                  </h3>

                  <p className="text-sm text-surface-600 leading-relaxed mb-4">
                    {anomaly.description}
                  </p>

                  {/* Evidence */}
                  <div className="bg-white/60 rounded-xl p-4 border border-black/5 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye size={13} className="text-surface-400" />
                      <span className="text-xs font-semibold text-surface-600">
                        Evidence
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {anomaly.details.map((d, j) => (
                        <li
                          key={j}
                          className="text-xs text-surface-600 flex items-start gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-surface-400 mt-1.5 shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Confidence indicator */}
                  <div className="flex items-start gap-2 bg-white/40 rounded-lg p-3 mb-4">
                    <HelpCircle
                      size={14}
                      className="text-surface-400 mt-0.5 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold text-surface-600">
                          Confidence:
                        </span>
                        <span
                          className={clsx(
                            "text-xs font-bold uppercase",
                            anomaly.confidence === "high"
                              ? "text-success-600"
                              : (anomaly.confidence as string) === "medium"
                                ? "text-warning-600"
                                : "text-danger-600"
                          )}
                        >
                          {anomaly.confidence}
                        </span>
                      </div>
                      <p className="text-[11px] text-surface-500">
                        {
                          confidenceExplanations[
                            anomaly.confidence as keyof typeof confidenceExplanations
                          ]
                        }
                      </p>
                    </div>
                  </div>

                  {/* Impact + Action */}
                  <div className="flex items-center gap-3">
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-900 text-white text-sm font-semibold hover:bg-surface-800 transition-colors">
                      {anomaly.suggestedAction}
                      <ArrowRight size={14} />
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-surface-300 text-sm font-medium text-surface-600 hover:bg-white transition-colors">
                      Dismiss
                    </button>
                    <span className="text-xs text-surface-400 ml-auto">
                      Affects: {anomaly.affectedMetric}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Resolved state example */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-surface-400 mb-4">
          Recently resolved
        </h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-surface-200 bg-white p-5"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-success-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-surface-700">
                Shipping FAQ content gap filled
              </p>
              <p className="text-xs text-surface-400 mt-0.5">
                Resolved 5 days ago - Added missing international shipping info
                to knowledge base
              </p>
            </div>
            <span className="text-xs text-success-600 font-medium bg-success-50 px-2 py-1 rounded-full">
              Escalations down 12%
            </span>
          </div>
        </motion.div>
      </section>

      {/* Empty state hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="bg-surface-50 rounded-xl border border-surface-200 p-6 text-center"
      >
        <Sparkles size={24} className="text-surface-300 mx-auto mb-2" />
        <p className="text-sm text-surface-500">
          Alhena continuously monitors your account for anomalies, content
          conflicts, and performance risks. Alerts appear here when action is
          needed.
        </p>
      </motion.div>
    </div>
  );
}
