import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Eye,
  Rocket,
  Shield,
  Target,
  Sparkles,
} from "lucide-react";
import { clsx } from "clsx";
import { TopBar } from "../../components/layout/TopBar";
import { Toast } from "../../components/common/Toast";
import { useToast } from "../../hooks/useToast";
import { useOnboarding } from "../../context/OnboardingContext";
import { ConfettiCelebration } from "../../components/common/ConfettiCelebration";

export function LaunchReadinessPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { steps, currentStep, overallProgress, completedCount, launchAlhena, launched } = useOnboarding();
  const totalCount = steps.length;
  const [showConfetti, setShowConfetti] = useState(false);

  const handleStepAction = (step: (typeof steps)[0]) => {
    if (step.id === 7 && step.status === "in_progress") {
      toast.show("Alhena is launching!");
      setTimeout(() => {
        launchAlhena();
        setShowConfetti(true);
        toast.show("Alhena is live! Your storefront AI is now serving customers.");
      }, 1500);
      return;
    }
    if (step.actionRoute) {
      navigate(step.actionRoute);
    }
  };

  const encouragementMessage = (() => {
    if (launched) return "Congratulations! Alhena is live and serving your customers.";
    if (!currentStep) return "Everything is ready. Time to go live!";
    const id = currentStep.id;
    if (id <= 2) return "You're getting started - connecting your data sources is the foundation.";
    if (id === 3) return "Your data sources are connected! Now let's make sure Alhena has the right content.";
    if (id <= 5) return "Almost there - configure how Alhena communicates with your customers.";
    if (id === 6) return "Your AI is configured! Invite your team before launch.";
    return "Everything is ready. Time to go live!";
  })();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <TopBar
          title="Launch Readiness"
          subtitle="Get your Alhena account ready to go live"
          showActions={false}
        />
        <button
          onClick={() => navigate("/scenario-2/preview")}
          className="shrink-0 mb-1 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-alhena-200 text-sm font-medium text-alhena-600 hover:bg-alhena-50 hover:border-alhena-300 transition-all"
        >
          <Eye size={14} />
          Preview dashboard
        </button>
      </div>

      {/* Overall progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-surface-0 rounded-2xl border border-surface-200 px-5 py-4 flex items-center gap-4"
      >
        <p className="text-sm font-medium text-surface-900 shrink-0">
          {completedCount} of {totalCount} steps complete
        </p>
        <div className="flex-1 h-2 rounded-full bg-surface-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="h-full rounded-full bg-alhena-500"
          />
        </div>
        <span className="text-sm font-semibold text-alhena-600 shrink-0">
          {overallProgress}%
        </span>
      </motion.div>

      {/* Encouragement banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-alhena-50 rounded-2xl border border-alhena-200 px-6 py-4 flex items-center gap-4"
      >
        <Sparkles size={16} className="text-alhena-500 shrink-0" />
        <p className="text-[0.875rem] text-alhena-800">
          {encouragementMessage}
        </p>
      </motion.div>

      {/* Simplified step list */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-0 rounded-2xl border border-surface-200 divide-y divide-surface-100 overflow-hidden"
      >
        {steps.map((step) => {
          const Icon = step.icon;
          const isCurrent = currentStep?.id === step.id;
          const isLaunchStep = step.id === 7 && step.status === "in_progress";
          const isClickable =
            step.status === "in_progress" && (step.actionRoute || isLaunchStep);

          const Row = isClickable ? "button" : "div";

          return (
            <Row
              key={step.id}
              {...(isClickable
                ? { onClick: () => handleStepAction(step), type: "button" as const }
                : {})}
              className={clsx(
                "flex items-center gap-4 px-5 py-4 transition-all w-full text-left",
                isCurrent && "border-l-4 border-l-alhena-500 bg-alhena-50/40",
                isClickable && "cursor-pointer hover:bg-alhena-50 group",
                step.status === "pending" && "opacity-50"
              )}
            >
              <div
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  step.status === "complete" && "bg-success-500 text-white",
                  step.status === "in_progress" && "bg-alhena-500 text-white",
                  step.status === "pending" && "bg-surface-100 text-surface-400"
                )}
              >
                {step.status === "complete" ? (
                  <Check size={14} />
                ) : (
                  <Icon size={14} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={clsx(
                    "text-[0.875rem] font-semibold",
                    isCurrent ? "text-surface-900" : step.status === "complete" ? "text-surface-900" : "text-surface-500"
                  )}
                >
                  {step.label}
                </p>
                {(isCurrent || step.status === "in_progress") && (
                  <p className="text-xs text-surface-600 mt-0.5">
                    {step.detail}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {step.status === "complete" && (
                  <span className="text-xs font-semibold text-success-600">Done</span>
                )}
                {step.status === "in_progress" && step.progress > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-surface-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-alhena-500 rounded-full"
                        style={{ width: `${step.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-alhena-600">
                      {step.progress}%
                    </span>
                  </div>
                )}
                {step.status === "pending" && (
                  <span className="text-xs text-surface-400">{step.time}</span>
                )}
                {isClickable && (
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white text-xs font-semibold transition-all",
                      isLaunchStep
                        ? "bg-success-500 group-hover:bg-success-600"
                        : "bg-alhena-500 group-hover:bg-alhena-600 group-hover:gap-2.5"
                    )}
                  >
                    {isLaunchStep && <Rocket size={12} />}
                    {step.action || "Start"}
                    {!isLaunchStep && <ArrowRight size={12} />}
                  </span>
                )}
              </div>
            </Row>
          );
        })}
      </motion.div>

      {/* Preview your live dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
      >
        <div className="px-6 py-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-alhena-500 flex items-center justify-center shrink-0">
            <Eye size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-surface-900 mb-0.5">
              See what your dashboard will look like
            </h3>
            <p className="text-sm text-surface-600">
              Preview the exact dashboard you'll use after launch, populated with sample performance data.
            </p>
          </div>
          <button
            onClick={() => navigate("/scenario-2/preview")}
            className="px-5 py-2.5 rounded-full bg-alhena-500 text-white text-sm font-semibold hover:bg-alhena-600 transition-colors flex items-center gap-2 shrink-0"
          >
            Preview dashboard
            <ArrowRight size={14} />
          </button>
        </div>
        <div className="px-6 py-3 bg-surface-50 border-t border-surface-100 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles size={13} className="text-surface-400" />
            <span className="text-xs text-surface-500">Revenue Attribution</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={13} className="text-surface-400" />
            <span className="text-xs text-surface-500">Support Automation</span>
          </div>
          <div className="flex items-center gap-2">
            <Target size={13} className="text-surface-400" />
            <span className="text-xs text-surface-500">Actionable Insights</span>
          </div>
        </div>
      </motion.div>

      {/* Staging notice */}
      {!launched && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface-50 rounded-2xl border border-surface-200 px-6 py-4 flex items-center gap-4"
        >
          <Shield size={16} className="text-alhena-500 shrink-0" />
          <div className="flex-1">
            <p className="text-[0.875rem] text-surface-700">
              <strong className="text-surface-900">Your data is not live yet.</strong>{" "}
              Everything you configure now is in staging mode. Dashboards become meaningful after 48 hours of traffic and 500+ conversations.
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-warning-400 animate-pulse" />
            <span className="text-xs font-semibold text-warning-600">Staging</span>
          </div>
        </motion.div>
      )}

      {/* Launch success banner */}
      {launched && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-success-50 rounded-2xl border border-success-200 px-6 py-4 flex items-center gap-4"
        >
          <Rocket size={16} className="text-success-600 shrink-0" />
          <div className="flex-1">
            <p className="text-[0.875rem] text-success-800">
              <strong>Alhena is live!</strong>{" "}
              Your AI assistant is now serving customers on your storefront. Dashboards will populate with real data within 48 hours.
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
            <span className="text-xs font-semibold text-success-600">Live</span>
          </div>
        </motion.div>
      )}

      <ConfettiCelebration
        active={showConfetti}
        onComplete={() => setShowConfetti(false)}
        duration={5000}
      />

      <Toast message={toast.message} visible={toast.visible} onClose={toast.hide} />
    </div>
  );
}
