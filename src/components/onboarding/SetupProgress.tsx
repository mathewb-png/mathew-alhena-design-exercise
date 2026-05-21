import { motion } from "framer-motion";
import {
  Check,
  Store,
  Plug,
  BookOpen,
  MessageCircle,
  Settings,
  Users,
  Rocket,
  ChevronRight,
  Clock,
  Lock,
} from "lucide-react";
import { clsx } from "clsx";
import type { SetupStep, SetupStatus } from "../../types/dashboard";

const iconMap: Record<string, typeof Store> = {
  Store,
  Plug,
  BookOpen,
  MessageCircle,
  Settings,
  Users,
  Rocket,
};

const statusConfig: Record<
  SetupStatus,
  { bg: string; border: string; text: string; iconBg: string }
> = {
  complete: {
    bg: "bg-success-50",
    border: "border-success-200",
    text: "text-success-700",
    iconBg: "bg-success-500 text-white",
  },
  in_progress: {
    bg: "bg-alhena-50",
    border: "border-alhena-200",
    text: "text-alhena-700",
    iconBg: "bg-alhena-500 text-white",
  },
  pending: {
    bg: "bg-white",
    border: "border-surface-200",
    text: "text-surface-500",
    iconBg: "bg-surface-100 text-surface-400",
  },
  blocked: {
    bg: "bg-danger-50",
    border: "border-danger-200",
    text: "text-danger-700",
    iconBg: "bg-danger-500 text-white",
  },
};

interface SetupProgressProps {
  steps: SetupStep[];
  overallProgress: number;
  stepsCompleted: number;
  totalSteps: number;
  estimatedTimeRemaining: string;
}

export function SetupProgress({
  steps,
  overallProgress,
  stepsCompleted,
  totalSteps,
  estimatedTimeRemaining,
}: SetupProgressProps) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl border border-surface-200 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-surface-900">
              Launch Readiness
            </h3>
            <p className="text-sm text-surface-500 mt-0.5">
              {stepsCompleted} of {totalSteps} steps complete
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-alhena-600">
              {overallProgress}%
            </span>
            <p className="text-xs text-surface-400 flex items-center gap-1 justify-end mt-0.5">
              <Clock size={11} />
              {estimatedTimeRemaining} remaining
            </p>
          </div>
        </div>

        <div className="h-3 bg-surface-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="h-full bg-gradient-to-r from-alhena-500 to-alhena-400 rounded-full"
          />
        </div>
      </motion.div>

      <div className="space-y-3">
        {steps.map((step, i) => {
          const config = statusConfig[step.status];
          const Icon = iconMap[step.icon] || Settings;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
              className={clsx(
                "rounded-xl border p-4 transition-all duration-200 group",
                config.border,
                config.bg,
                step.status !== "pending" && "hover:shadow-sm"
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={clsx(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    config.iconBg
                  )}
                >
                  {step.status === "complete" ? (
                    <Check size={20} />
                  ) : step.status === "pending" ? (
                    <Lock size={16} />
                  ) : (
                    <Icon size={20} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={clsx(
                        "text-sm font-semibold",
                        step.status === "pending"
                          ? "text-surface-400"
                          : "text-surface-900"
                      )}
                    >
                      {step.label}
                    </h4>
                    {step.estimatedTime && step.status !== "complete" && (
                      <span className="text-[10px] text-surface-400 bg-surface-100 px-1.5 py-0.5 rounded-full">
                        {step.estimatedTime}
                      </span>
                    )}
                  </div>
                  <p
                    className={clsx(
                      "text-xs mt-0.5 leading-relaxed",
                      step.status === "pending"
                        ? "text-surface-300"
                        : "text-surface-500"
                    )}
                  >
                    {step.description}
                  </p>

                  {step.status === "in_progress" && step.progress != null && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-alhena-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${step.progress}%` }}
                          transition={{ duration: 0.8, delay: 0.5 }}
                          className="h-full bg-alhena-500 rounded-full"
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-alhena-600">
                        {step.progress}%
                      </span>
                    </div>
                  )}
                </div>

                {step.status !== "complete" && step.status !== "pending" && (
                  <button className="px-3 py-1.5 rounded-lg bg-alhena-600 text-white text-xs font-semibold hover:bg-alhena-700 transition-colors shrink-0">
                    Continue
                  </button>
                )}

                {step.status === "complete" && (
                  <ChevronRight
                    size={16}
                    className="text-surface-300 group-hover:text-surface-500 transition-colors"
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
