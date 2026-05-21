import type { SetupStep } from "../types/dashboard";

export const setupSteps: SetupStep[] = [
  {
    id: "step_connect_store",
    label: "Connect your store",
    description:
      "Link your Shopify, BigCommerce, or custom storefront so Alhena can access your product catalog and order data.",
    status: "complete",
    progress: 100,
    icon: "Store",
    estimatedTime: "5 min",
  },
  {
    id: "step_integrations",
    label: "Set up integrations",
    description:
      "Connect your help desk (Zendesk, Gorgias, Intercom), analytics, and CRM to enable full support automation.",
    status: "in_progress",
    progress: 60,
    icon: "Plug",
    estimatedTime: "10 min",
  },
  {
    id: "step_knowledge_base",
    label: "Import knowledge base",
    description:
      "Upload FAQs, return policies, shipping guides, and product documentation so Alhena can answer customer questions accurately.",
    status: "in_progress",
    progress: 30,
    icon: "BookOpen",
    estimatedTime: "15 min",
  },
  {
    id: "step_brand_voice",
    label: "Configure brand voice",
    description:
      "Set your tone, language preferences, and response style so Alhena sounds like your team.",
    status: "pending",
    icon: "MessageCircle",
    estimatedTime: "10 min",
  },
  {
    id: "step_ai_behaviors",
    label: "Define AI behaviors",
    description:
      "Set escalation rules, automation boundaries, and approval workflows for sensitive topics.",
    status: "pending",
    icon: "Settings",
    estimatedTime: "15 min",
  },
  {
    id: "step_invite_team",
    label: "Invite your team",
    description:
      "Add team members who will monitor AI performance, review escalations, and manage the Alhena experience.",
    status: "pending",
    icon: "Users",
    estimatedTime: "3 min",
  },
  {
    id: "step_go_live",
    label: "Launch Alhena",
    description:
      "Deploy the Alhena widget to your storefront. Start with a controlled rollout to a percentage of traffic.",
    status: "pending",
    icon: "Rocket",
    estimatedTime: "5 min",
  },
];

export const onboardingMetrics = {
  overallProgress: 32,
  stepsCompleted: 1,
  totalSteps: 7,
  estimatedTimeRemaining: "~45 min",
  accountCreated: "2026-05-20T10:00:00Z",
  expectedLaunchDate: "2026-05-27",
};
