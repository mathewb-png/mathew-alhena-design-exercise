import { motion } from "framer-motion";

interface BreakdownBarProps {
  breakdowns: { label: string; value: number; percentage: number }[];
}

const colors = [
  "bg-danger-500",
  "bg-warning-500",
  "bg-alhena-500",
  "bg-info-500",
  "bg-success-500",
  "bg-surface-400",
  "bg-surface-300",
];

export function BreakdownBar({ breakdowns }: BreakdownBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-xl border border-surface-200 p-6"
    >
      <h3 className="text-sm font-semibold text-surface-900 mb-1">
        Breakdown by Intent
      </h3>
      <p className="text-xs text-surface-400 mb-5">
        What's driving escalation volume
      </p>

      <div className="flex h-3 rounded-full overflow-hidden mb-5 gap-0.5">
        {breakdowns.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ width: 0 }}
            animate={{ width: `${item.percentage}%` }}
            transition={{ duration: 0.6, delay: 0.4 + i * 0.05 }}
            className={`${colors[i]} first:rounded-l-full last:rounded-r-full`}
          />
        ))}
      </div>

      <div className="space-y-3">
        {breakdowns.map((item, i) => (
          <div key={item.label} className="flex items-center gap-3">
            <span
              className={`w-3 h-3 rounded-sm shrink-0 ${colors[i]}`}
            />
            <span className="text-sm text-surface-700 flex-1">
              {item.label}
            </span>
            <span className="text-sm font-semibold text-surface-900 tabular-nums">
              {item.value.toLocaleString()}
            </span>
            <span className="text-xs text-surface-400 w-10 text-right tabular-nums">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
