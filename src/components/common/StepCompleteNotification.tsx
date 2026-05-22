import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, ArrowRight, PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOnboarding } from "../../context/OnboardingContext";

const AUTO_DISMISS_MS = 8000;

export function StepCompleteNotification() {
  const { lastCompletedStep, clearCompletedNotification } = useOnboarding();
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const dismiss = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    clearCompletedNotification();
  }, [clearCompletedNotification]);

  useEffect(() => {
    if (!lastCompletedStep) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lastCompletedStep, dismiss]);

  const handleGoToLaunchReadiness = () => {
    dismiss();
    navigate("/scenario-2");
  };

  return (
    <AnimatePresence>
      {lastCompletedStep && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-20 right-6 z-[90] w-full max-w-[400px] rounded-2xl border border-surface-200 bg-surface-0 p-4 shadow-lg"
        >
          <button
            onClick={dismiss}
            aria-label="Dismiss notification"
            className="absolute top-3 right-3 rounded-lg p-1 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600"
          >
            <X size={16} />
          </button>

          {lastCompletedStep.allComplete ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success-100 text-success-600">
                  <PartyPopper size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900">
                    All steps complete!
                  </p>
                  <p className="text-xs text-surface-500">
                    You're ready to launch.
                  </p>
                </div>
              </div>
              <button
                onClick={handleGoToLaunchReadiness}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-alhena-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-alhena-600"
              >
                Go to Launch Readiness
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-success-100 text-success-600">
                  <CheckCircle2 size={16} />
                </div>
                <div className="min-w-0 pr-5">
                  <p className="text-sm font-semibold text-surface-900">
                    {lastCompletedStep.stepLabel} - Complete
                  </p>
                  {lastCompletedStep.nextStepLabel && (
                    <p className="text-xs text-surface-500">
                      Next up: {lastCompletedStep.nextStepLabel}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleGoToLaunchReadiness}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-alhena-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-alhena-600"
              >
                Go to Launch Readiness
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Auto-dismiss progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: AUTO_DISMISS_MS / 1000, ease: "linear" }}
            className="absolute bottom-0 left-0 h-0.5 w-full origin-left rounded-b-2xl bg-alhena-500/30"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
