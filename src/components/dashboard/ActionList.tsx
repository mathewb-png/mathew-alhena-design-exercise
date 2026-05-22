import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const confirmationMessages: Record<string, string> = {
  action_1: "Added to sprint backlog - CX Team notified",
  action_2: "Shipping integration task created",
  action_3: "Content review assigned to Content Team",
  action_4: "A/B test draft created - ready to configure",
  action_5: "Summary report queued for generation",
};

interface ActionListProps {
  actions: ActionItem[];
}

export function ActionList({ actions }: ActionListProps) {
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set());

  const handleClick = (actionId: string) => {
    setConfirmedIds((prev) => new Set(prev).add(actionId));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-surface-0 rounded-xl border border-surface-200 overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-surface-100">
        <h3 className="text-[0.9375rem] font-semibold text-surface-900">
          Recommended Actions
        </h3>
        <p className="text-sm text-surface-600 mt-0.5">
          Prioritized by estimated impact
        </p>
      </div>

      <div className="divide-y divide-surface-100">
        {actions.map((action, i) => {
          const pStyle = priorityStyles[action.priority];
          const isConfirmed = confirmedIds.has(action.id);
          const StatusIcon = isConfirmed
            ? CheckCircle2
            : statusIcons[action.status];

          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.06 }}
              onClick={() => handleClick(action.id)}
              className="w-full px-5 py-4 hover:bg-surface-50 transition-colors group cursor-pointer text-left"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <StatusIcon
                    size={18}
                    className={clsx(
                      isConfirmed
                        ? "text-success-600"
                        : action.status === "completed"
                          ? "text-success-600"
                          : "text-surface-400"
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
                    <span className="text-xs font-bold uppercase tracking-wider text-surface-600">
                      {pStyle.label}
                    </span>
                    <span className="text-xs text-surface-400">|</span>
                    <span className="text-sm text-surface-600">
                      {action.owner}
                    </span>
                  </div>

                  <h4 className="text-[0.9375rem] font-semibold text-surface-900 mb-1">
                    {action.title}
                  </h4>
                  <p className="text-sm text-surface-600 leading-relaxed">
                    {action.description}
                  </p>
                  <p className="text-sm text-alhena-600 font-semibold mt-2">
                    Impact: {action.estimatedImpact}
                  </p>

                  <AnimatePresence>
                    {isConfirmed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-2 flex items-center gap-2 text-sm text-success-700 bg-success-50 rounded-lg px-3 py-2"
                      >
                        <CheckCircle2 size={14} className="shrink-0" />
                        <span>
                          {confirmationMessages[action.id] ||
                            "Task added to backlog"}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <ArrowRight
                  size={16}
                  className="text-surface-400 group-hover:text-surface-600 transition-colors mt-1 shrink-0"
                />
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
