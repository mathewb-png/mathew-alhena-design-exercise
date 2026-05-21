import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { clsx } from "clsx";
import type { Metric } from "../../types/dashboard";
import { SparklineChart } from "./SparklineChart";

interface MetricCardProps {
  metric: Metric;
  index: number;
  onClick?: () => void;
}

export function MetricCard({ metric, index, onClick }: MetricCardProps) {
  const TrendIcon =
    metric.trend === "up"
      ? TrendingUp
      : metric.trend === "down"
        ? TrendingDown
        : Minus;

  const sentimentStyles = {
    positive: {
      badge: "bg-success-50 text-success-700",
      icon: "text-success-500",
      sparkline: "#10b981",
    },
    negative: {
      badge: "bg-danger-50 text-danger-700",
      icon: "text-danger-500",
      sparkline: "#ef4444",
    },
    neutral: {
      badge: "bg-surface-100 text-surface-600",
      icon: "text-surface-400",
      sparkline: "#6b7280",
    },
    warning: {
      badge: "bg-warning-50 text-warning-700",
      icon: "text-warning-500",
      sparkline: "#f59e0b",
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
        "bg-white rounded-xl border border-surface-200 p-5 hover:shadow-md hover:border-surface-300 transition-all duration-200 group",
        onClick && "cursor-pointer"
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-surface-500 leading-tight">
          {metric.label}
        </p>
        <span
          className={clsx(
            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold",
            style.badge
          )}
        >
          <TrendIcon size={12} className={style.icon} />
          {metric.change}
        </span>
      </div>

      <p className="text-2xl font-bold text-surface-900 tracking-tight mb-1">
        {metric.value}
      </p>

      <p className="text-xs text-surface-400 mb-3">{metric.period}</p>

      {metric.sparklineData && (
        <div className="h-10 -mx-1">
          <SparklineChart
            data={metric.sparklineData}
            color={style.sparkline}
            height={40}
          />
        </div>
      )}
    </motion.div>
  );
}
