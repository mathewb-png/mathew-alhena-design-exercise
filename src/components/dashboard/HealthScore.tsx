import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Minus, Info } from "lucide-react";
import { clsx } from "clsx";
import type { AccountHealth } from "../../types/dashboard";

interface HealthScoreProps {
  health: AccountHealth;
}

export function HealthScore({ health }: HealthScoreProps) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (health.score / 100) * circumference;

  const scoreColor =
    health.score >= 80
      ? "text-success-500"
      : health.score >= 60
        ? "text-warning-500"
        : "text-danger-500";

  const ringColor =
    health.score >= 80
      ? "stroke-success-500"
      : health.score >= 60
        ? "stroke-warning-500"
        : "stroke-danger-500";

  const bgColor =
    health.score >= 80
      ? "bg-success-50"
      : health.score >= 60
        ? "bg-warning-50"
        : "bg-danger-50";

  const labelColor =
    health.score >= 80
      ? "text-success-700 bg-success-100"
      : health.score >= 60
        ? "text-warning-700 bg-warning-100"
        : "text-danger-700 bg-danger-100";

  const TrendIcon =
    health.trend === "up"
      ? TrendingUp
      : health.trend === "down"
        ? TrendingDown
        : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={clsx(
        "rounded-2xl border border-surface-200 p-6 flex items-center gap-6",
        bgColor
      )}
    >
      <div className="relative w-32 h-32 shrink-0">
        <svg
          className="w-32 h-32 -rotate-90"
          viewBox="0 0 120 120"
        >
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-surface-200"
          />
          <motion.circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            className={ringColor}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={clsx("text-3xl font-bold", scoreColor)}
          >
            {health.score}
          </motion.span>
          <span className="text-xs text-surface-500 font-medium">/ 100</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-surface-900">
            Account Health
          </h3>
          <span
            className={clsx(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
              labelColor
            )}
          >
            <TrendIcon size={12} />
            {health.label}
          </span>
        </div>
        <p className="text-sm text-surface-600 leading-relaxed">
          {health.summary}
        </p>
        <button className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-alhena-600 hover:text-alhena-700 transition-colors">
          <Info size={13} />
          How is this calculated?
        </button>
      </div>
    </motion.div>
  );
}
