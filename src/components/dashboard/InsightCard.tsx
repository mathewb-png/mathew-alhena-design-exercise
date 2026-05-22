import { motion } from "framer-motion";
import {
  Trophy,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";
import type { Insight, InsightType } from "../../types/dashboard";

const insightConfig: Record<
  InsightType,
  { icon: typeof Trophy; color: string; bg: string; border: string; label: string }
> = {
  win: {
    icon: Trophy,
    color: "text-success-600",
    bg: "bg-success-50",
    border: "border-success-200",
    label: "Win",
  },
  risk: {
    icon: AlertTriangle,
    color: "text-danger-600",
    bg: "bg-danger-50",
    border: "border-danger-200",
    label: "Risk",
  },
  opportunity: {
    icon: Lightbulb,
    color: "text-warning-600",
    bg: "bg-warning-50",
    border: "border-warning-200",
    label: "Opportunity",
  },
  action: {
    icon: Shield,
    color: "text-alhena-600",
    bg: "bg-alhena-50",
    border: "border-alhena-200",
    label: "Action",
  },
};

interface InsightCardProps {
  insight: Insight;
  index: number;
}

export function InsightCard({ insight, index }: InsightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = insightConfig[insight.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className={clsx(
        "rounded-xl border p-5 transition-all duration-200",
        config.border,
        config.bg
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={clsx(
            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
            config.color,
            "bg-surface-0/80"
          )}
        >
          <Icon size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={clsx(
                "text-[10px] font-bold uppercase tracking-wider",
                config.color
              )}
            >
              {config.label}
            </span>
            {insight.confidence !== "high" && (
              <span className="text-[10px] font-medium text-surface-400 bg-surface-0/60 px-1.5 py-0.5 rounded-full">
                {insight.confidence} confidence
              </span>
            )}
          </div>

          <h3 className="text-sm font-semibold text-surface-900 leading-snug mb-2">
            {insight.title}
          </h3>

          <p className="text-sm text-surface-600 leading-relaxed mb-3">
            {insight.summary}
          </p>

          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1 text-xs font-medium text-surface-500 hover:text-surface-700 transition-colors mb-2"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? "Hide evidence" : "Show evidence"}
          </button>

          {expanded && (
            <motion.ul
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-1.5 mb-3"
            >
              {insight.evidence.map((e, i) => (
                <li
                  key={i}
                  className="text-xs text-surface-600 flex items-start gap-2"
                >
                  <span className="w-1 h-1 rounded-full bg-surface-400 mt-1.5 shrink-0" />
                  {e}
                </li>
              ))}
            </motion.ul>
          )}

          {insight.recommendedAction && (
            <div className="flex items-center gap-2 pt-2 border-t border-black/5">
              <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-0 text-xs font-semibold text-surface-800 hover:bg-surface-100 shadow-sm transition-all">
                {insight.actionLabel || "Take action"}
                <ArrowRight size={13} />
              </button>
              <span className="text-xs text-surface-400">
                {insight.impact}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
