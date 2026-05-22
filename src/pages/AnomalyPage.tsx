import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { clsx } from "clsx";
import { TopBar } from "../components/layout/TopBar";
import { CollapsibleSection } from "../components/layout/CollapsibleSection";
import { Toast } from "../components/common/Toast";
import { useToast } from "../hooks/useToast";

const anomalyStates = [
  {
    id: "anomaly_2",
    severity: "critical" as const,
    title: "Subscription cancellation escalations spiking",
    description:
      "Cancellation escalations up 45% in 14 days, outpacing overall growth (+21%). No retention options in AI flow.",
    confidence: "high" as const,
    affectedMetric: "1,680 escalations (30% of total)",
    detectedAt: "3 days ago",
    suggestedAction: "Add retention flow",
    details: [
      "45% increase vs. 21% overall escalation growth",
      "No self-service cancellation path exists",
      "Avg time to agent: 12 min (was 8 min)",
    ],
  },
  {
    id: "anomaly_1",
    severity: "high" as const,
    title: "Return policy content conflict detected",
    description:
      "Conflicting return policy between help center (14-day) and Shopify (30-day) may cause inconsistent answers.",
    confidence: "low" as const,
    affectedMetric: "~8% of conversations",
    detectedAt: "2 days ago",
    suggestedAction: "Reconcile sources",
    details: [
      "Help center: 14-day return window",
      "Shopify page: 30-day return window",
      "23 escalations in last 7 days from conflicting info",
    ],
  },
];

const severityConfig = {
  critical: {
    dot: "bg-danger-500",
    badge: "text-danger-700",
    left: "border-l-danger-500",
  },
  high: {
    dot: "bg-warning-500",
    badge: "text-warning-700",
    left: "border-l-warning-500",
  },
};

const confidenceConfig = {
  high: "text-success-700",
  medium: "text-warning-700",
  low: "text-danger-700",
};

export function AnomalyPage() {
  const navigate = useNavigate();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [actionedIds, setActionedIds] = useState<Set<string>>(new Set());
  const toast = useToast();

  const handleAction = (anomalyId: string) => {
    setActionedIds((prev) => new Set(prev).add(anomalyId));
    toast.show("Task created in your workflow");
  };

  const handleDismiss = (anomalyId: string) => {
    setDismissedIds((prev) => new Set(prev).add(anomalyId));
    toast.show("Alert dismissed");
  };

  const visibleAnomalies = anomalyStates.filter(
    (a) => !dismissedIds.has(a.id)
  );

  return (
    <div className="space-y-6">
      <TopBar
        title="Alerts & Anomalies"
        subtitle="Issues that need your attention"
        showActions={false}
      />

      {/* Active alerts */}
      <CollapsibleSection
        title="Active alerts"
        titleRight={<span>{visibleAnomalies.length} issues</span>}
      >
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {visibleAnomalies.map((anomaly, i) => {
              const cfg =
                severityConfig[
                  anomaly.severity as keyof typeof severityConfig
                ];
              const isActioned = actionedIds.has(anomaly.id);

              return (
                <motion.article
                  key={anomaly.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -80, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  className={clsx(
                    "bg-surface-0 rounded-xl border border-surface-200 border-l-4 overflow-hidden",
                    cfg.left
                  )}
                >
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span
                        className={clsx(
                          "text-xs font-bold uppercase tracking-wider",
                          cfg.dot === "bg-danger-500"
                            ? "text-danger-700"
                            : "text-warning-700"
                        )}
                      >
                        {anomaly.severity}
                      </span>
                      <span className="text-sm text-surface-500 flex items-center gap-1">
                        <Clock size={13} />
                        {anomaly.detectedAt}
                      </span>
                      <span
                        className={clsx(
                          "text-xs font-bold uppercase tracking-wider ml-auto",
                          confidenceConfig[anomaly.confidence]
                        )}
                      >
                        {anomaly.confidence} confidence
                      </span>
                    </div>

                    <button
                      onClick={() => navigate("/scenario-1/drilldown")}
                      className="text-left group"
                    >
                      <h3 className="text-[0.9375rem] font-bold text-surface-900 mb-1 group-hover:text-alhena-600 transition-colors">
                        {anomaly.title}
                      </h3>
                    </button>
                    <p className="text-sm text-surface-600 mb-3">
                      {anomaly.description}
                    </p>

                    <ul className="space-y-1 mb-4">
                      {anomaly.details.map((d, j) => (
                        <li
                          key={j}
                          className="text-sm text-surface-600 flex items-start gap-2"
                        >
                          <span className="w-1 h-1 rounded-full bg-surface-400 mt-2 shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-center gap-3 pt-3 border-t border-surface-100">
                      {isActioned ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-success-50 text-success-700 text-sm font-semibold">
                          <CheckCircle2 size={14} />
                          Task created
                        </span>
                      ) : (
                        <button
                          onClick={() => handleAction(anomaly.id)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-alhena-500 text-white text-sm font-semibold hover:bg-alhena-600 transition-colors"
                        >
                          {anomaly.suggestedAction}
                          <ArrowRight size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDismiss(anomaly.id)}
                        className="px-4 py-2 rounded-full border border-surface-200 text-sm font-medium text-surface-600 hover:bg-surface-50 transition-colors"
                      >
                        Dismiss
                      </button>
                      <span className="text-sm text-surface-500 ml-auto">
                        {anomaly.affectedMetric}
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>

          {visibleAnomalies.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-surface-0 rounded-xl border border-surface-200 px-5 py-8 text-center"
            >
              <CheckCircle2
                size={32}
                className="text-success-500 mx-auto mb-3"
              />
              <p className="text-sm font-semibold text-surface-800">
                All clear
              </p>
              <p className="text-sm text-surface-500 mt-1">
                No active alerts right now. Alhena is monitoring.
              </p>
            </motion.div>
          )}
        </div>
      </CollapsibleSection>

      {/* Recently resolved */}
      <CollapsibleSection title="Recently resolved">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-surface-200 bg-surface-0 px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-success-600 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-surface-800">
                Shipping FAQ content gap filled
              </p>
              <p className="text-sm text-surface-600">
                Resolved 5 days ago - Added missing international shipping info
              </p>
            </div>
            <span className="text-sm text-success-700 font-semibold bg-success-50 px-3 py-1 rounded-full shrink-0">
              Escalations down 12%
            </span>
          </div>
        </motion.div>
      </CollapsibleSection>

      {/* Monitoring status footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-surface-50 rounded-xl border border-surface-200 px-5 py-4 flex items-center gap-3"
        role="status"
      >
        <Sparkles size={18} className="text-surface-400 shrink-0" />
        <p className="text-sm text-surface-500">
          Alhena continuously monitors for anomalies, content conflicts, and
          performance risks. Alerts appear here when action is needed.
        </p>
      </motion.div>

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={toast.hide}
      />
    </div>
  );
}
