import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { clsx } from "clsx";
import type { Metric } from "../../types/dashboard";
import { SparklineChart } from "./SparklineChart";
import { useTheme } from "../../context/ThemeContext";

interface MetricCardProps {
  metric: Metric;
  index: number;
  onClick?: () => void;
}

export function MetricCard({ metric, index, onClick }: MetricCardProps) {
  const { darkMode } = useTheme();
  const TrendIcon =
    metric.trend === "up"
      ? TrendingUp
      : metric.trend === "down"
        ? TrendingDown
        : Minus;

  const sentimentStyles = {
    positive: {
      badge: "bg-success-50 text-success-700",
      icon: "text-success-600",
      sparkline: darkMode ? "#4ade80" : "#16a34a",
    },
    negative: {
      badge: "bg-danger-50 text-danger-700",
      icon: "text-danger-600",
      sparkline: darkMode ? "#f87171" : "#dc2626",
    },
    neutral: {
      badge: "bg-surface-100 text-surface-700",
      icon: "text-surface-600",
      sparkline: darkMode ? "#94a3b8" : "#475569",
    },
    warning: {
      badge: "bg-warning-50 text-warning-700",
      icon: "text-warning-600",
      sparkline: darkMode ? "#fbbf24" : "#d97706",
    },
  };

  const style = sentimentStyles[metric.sentiment];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onClick}
      className={clsx(
        "bg-surface-0 rounded-2xl border border-surface-200 p-5 hover:shadow-md hover:border-surface-300 transition-all duration-200 group",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-surface-600 leading-tight">
          {metric.label}
        </p>
        <span
          className={clsx(
            "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-semibold",
            style.badge
          )}
        >
          <TrendIcon size={14} className={style.icon} />
          {metric.change}
        </span>
      </div>

      <p className="text-2xl font-bold text-surface-900 tracking-tight mb-1">
        {metric.value}
      </p>

      <p className="text-sm text-surface-600 mb-3">{metric.period}</p>

      {metric.sparklineData && (
        <div className="mt-2 -mx-1">
          <SparklineChart
            data={metric.sparklineData}
            color={style.sparkline}
            height={40}
            formatValue={(v) => {
              if (metric.value.includes("%")) return `${v}%`;
              if (metric.value.startsWith("$")) {
                if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
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
}
