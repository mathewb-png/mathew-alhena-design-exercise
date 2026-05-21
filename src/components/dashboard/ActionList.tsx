import { motion } from "framer-motion";
import {
  ArrowRight,
  Circle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { clsx } from "clsx";
import type { ActionItem, Priority } from "../../types/dashboard";

const priorityStyles: Record<Priority, { dot: string; label: string }> = {
  critical: { dot: "bg-danger-500", label: "Critical" },
  high: { dot: "bg-warning-500", label: "High" },
  medium: { dot: "bg-info-500", label: "Medium" },
  low: { dot: "bg-surface-400", label: "Low" },
};

const statusIcons = {
  suggested: Circle,
  in_progress: Clock,
  completed: CheckCircle2,
  dismissed: XCircle,
};

interface ActionListProps {
  actions: ActionItem[];
}

export function ActionList({ actions }: ActionListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-white rounded-xl border border-surface-200 overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-surface-100">
        <h3 className="text-sm font-semibold text-surface-900">
          Recommended Actions
        </h3>
        <p className="text-xs text-surface-400 mt-0.5">
          Prioritized by estimated impact
        </p>
      </div>

      <div className="divide-y divide-surface-100">
        {actions.map((action, i) => {
          const pStyle = priorityStyles[action.priority];
          const StatusIcon = statusIcons[action.status];

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.06 }}
              className="px-5 py-4 hover:bg-surface-50 transition-colors group cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <StatusIcon
                    size={18}
                    className={clsx(
                      action.status === "completed"
                        ? "text-success-500"
                        : "text-surface-300"
                    )}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={clsx(
                        "w-2 h-2 rounded-full shrink-0",
                        pStyle.dot
                      )}
                    />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400">
                      {pStyle.label}
                    </span>
                    <span className="text-[10px] text-surface-300">|</span>
                    <span className="text-[10px] text-surface-400">
                      {action.owner}
                    </span>
                  </div>

                  <h4 className="text-sm font-medium text-surface-800 mb-1">
                    {action.title}
                  </h4>
                  <p className="text-xs text-surface-500 leading-relaxed">
                    {action.description}
                  </p>
                  <p className="text-xs text-alhena-600 font-medium mt-1.5">
                    Impact: {action.estimatedImpact}
                  </p>
                </div>

                <ArrowRight
                  size={16}
                  className="text-surface-300 group-hover:text-surface-500 transition-colors mt-1 shrink-0"
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
