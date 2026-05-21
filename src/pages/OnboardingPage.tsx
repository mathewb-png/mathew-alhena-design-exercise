import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Users, MessageSquare, Zap } from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import { SetupProgress } from "../components/onboarding/SetupProgress";
import { PreviewCard } from "../components/onboarding/PreviewCard";
import { setupSteps, onboardingMetrics } from "../data/onboarding";

const previewCards = [
  {
    title: "AI-Influenced Revenue",
    description:
      "Track how Alhena interactions drive checkout revenue, AOV lift, and conversion improvements.",
    previewLabel: "Coming soon",
  },
  {
    title: "Support Automation",
    description:
      "Monitor AI resolution rates, CSAT scores, and escalation trends across intents.",
    previewLabel: "Coming soon",
  },
  {
    title: "Smart Nudge Performance",
    description:
      "See which nudge campaigns drive revenue and how they impact customer sentiment.",
    previewLabel: "Coming soon",
  },
];

const milestones = [
  {
    icon: Zap,
    label: "Connect",
    description: "Link your store and integrations",
    active: true,
  },
  {
    icon: MessageSquare,
    label: "Configure",
    description: "Set up brand voice and AI behaviors",
    active: false,
  },
  {
    icon: Users,
    label: "Collaborate",
    description: "Invite your team",
    active: false,
  },
  {
    icon: Sparkles,
    label: "Launch",
    description: "Go live with Alhena",
    active: false,
  },
];

export function OnboardingPage() {
  return (
    <div className="space-y-8">
      <TopBar
        title="Welcome to Alhena"
        subtitle="Let's get your account ready to launch"
        showActions={false}
      />

      {/* Hero welcome */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-alhena-600 via-alhena-700 to-alhena-900 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
              <Sparkles size={24} className="text-alhena-200" />
            </div>
            <div>
              <h2 className="text-xl font-bold">
                Your AI-powered commerce experience starts here
              </h2>
              <p className="text-sm text-alhena-200 mt-0.5">
                Complete the setup steps below to launch Alhena on your store
              </p>
            </div>
          </div>

          {/* Milestone bar */}
          <div className="flex items-center gap-2 mt-6">
            {milestones.map((m, i) => (
              <div key={m.label} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg flex-1 ${
                    m.active
                      ? "bg-white/15 border border-white/20"
                      : "bg-white/5"
                  }`}
                >
                  <m.icon
                    size={16}
                    className={m.active ? "text-white" : "text-white/40"}
                  />
                  <div>
                    <p
                      className={`text-xs font-semibold ${m.active ? "text-white" : "text-white/40"}`}
                    >
                      {m.label}
                    </p>
                    <p
                      className={`text-[10px] ${m.active ? "text-white/70" : "text-white/20"}`}
                    >
                      {m.description}
                    </p>
                  </div>
                </div>
                {i < milestones.length - 1 && (
                  <ArrowRight
                    size={14}
                    className="text-white/20 shrink-0"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-8">
        {/* Setup steps */}
        <div className="col-span-2">
          <SetupProgress
            steps={setupSteps}
            overallProgress={onboardingMetrics.overallProgress}
            stepsCompleted={onboardingMetrics.stepsCompleted}
            totalSteps={onboardingMetrics.totalSteps}
            estimatedTimeRemaining={onboardingMetrics.estimatedTimeRemaining}
          />
        </div>

        {/* Preview pane */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-surface-900 mb-1">
              What you'll see after launch
            </h3>
            <p className="text-xs text-surface-400">
              These dashboards unlock once Alhena processes enough interactions
            </p>
          </div>

          {previewCards.map((card, i) => (
            <PreviewCard
              key={card.title}
              title={card.title}
              description={card.description}
              previewLabel={card.previewLabel}
              index={i}
            />
          ))}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-surface-50 rounded-xl border border-surface-200 p-4"
          >
            <p className="text-xs text-surface-500 leading-relaxed">
              <span className="font-semibold text-surface-700">
                Not enough data yet?
              </span>{" "}
              That's normal. Alhena needs at least 48 hours of live traffic and
              500+ interactions before performance dashboards become meaningful.
              You can explore sample data in the meantime.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
