import { createContext, useContext, useState, useMemo, useEffect, useRef, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Store,
  Plug,
  BookOpen,
  MessageCircle,
  Settings,
  Users,
  Rocket,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────

export type IntegrationStatus = "connected" | "pending" | "not_connected" | "error";

export interface Integration {
  id: string;
  name: string;
  category: string;
  description: string;
  status: IntegrationStatus;
  logo: string;
  connectedAt?: string;
  detail?: string;
  required: boolean;
}

export type ArticleStatus = "imported" | "pending_review" | "not_imported" | "conflict";

export interface KnowledgeArticle {
  id: string;
  title: string;
  source: string;
  status: ArticleStatus;
  category: string;
  lastUpdated?: string;
  issue?: string;
}

export interface Category {
  name: string;
  imported: number;
  total: number;
  hasConflict: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  status: "active" | "invited";
  avatar: string;
}

export interface OnboardingStep {
  id: number;
  icon: LucideIcon;
  label: string;
  description: string;
  status: "complete" | "in_progress" | "pending";
  progress: number;
  time: string;
  owner: string;
  detail: string;
  action?: string;
  actionRoute?: string;
}

export interface CompletedStepInfo {
  stepLabel: string;
  nextStepLabel: string | null;
  nextStepRoute: string | null;
  allComplete: boolean;
}

interface OnboardingState {
  integrations: Integration[];
  connectIntegration: (id: string) => void;
  completeIntegration: (id: string) => void;

  knowledgeBase: {
    categories: Category[];
    flaggedArticles: KnowledgeArticle[];
    totalImported: number;
    totalArticles: number;
  };
  resolveArticle: (id: string) => void;
  reviewArticle: (id: string) => void;
  bulkImport: () => void;
  importCategory: (name: string) => void;

  teamMembers: TeamMember[];
  inviteMember: (email: string, role: "admin" | "editor" | "viewer") => void;

  brandVoiceConfigured: boolean;
  setBrandVoiceConfigured: (v: boolean) => void;
  aiBehaviorsConfigured: boolean;
  setAiBehaviorsConfigured: (v: boolean) => void;

  launched: boolean;
  launchAlhena: () => void;

  steps: OnboardingStep[];
  currentStep: OnboardingStep | undefined;
  overallProgress: number;
  completedCount: number;

  lastCompletedStep: CompletedStepInfo | null;
  clearCompletedNotification: () => void;
}

// ── Initial data ───────────────────────────────────────────────────────

const initialIntegrations: Integration[] = [
  {
    id: "shopify",
    name: "Shopify",
    category: "Ecommerce Platform",
    description: "Product catalog, orders, and customer data",
    status: "pending",
    logo: "S",
    detail: "Connect your Shopify store to sync products and orders",
    required: true,
  },
  {
    id: "zendesk",
    name: "Zendesk",
    category: "Help Desk",
    description: "Support tickets, macros, and agent workflows",
    status: "connected",
    logo: "Z",
    connectedAt: "May 20, 2026",
    detail: "Syncing ticket history (last 90 days)",
    required: true,
  },
  {
    id: "ga4",
    name: "Google Analytics 4",
    category: "Analytics",
    description: "Traffic, conversion, and attribution data",
    status: "pending",
    logo: "G",
    detail: "Awaiting property access - check email for verification link",
    required: true,
  },
  {
    id: "klaviyo",
    name: "Klaviyo",
    category: "Email / CRM",
    description: "Customer segments, email flows, and lifecycle data",
    status: "not_connected",
    logo: "K",
    detail: "Enables customer lifetime value insights",
    required: false,
  },
  {
    id: "gorgias",
    name: "Gorgias",
    category: "Help Desk",
    description: "Alternative to Zendesk for support automation",
    status: "not_connected",
    logo: "G",
    detail: "Optional - Zendesk already connected",
    required: false,
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments",
    description: "Subscription and payment data for revenue attribution",
    status: "not_connected",
    logo: "$",
    detail: "Required for subscription-based metrics",
    required: false,
  },
];

const initialCategories: Category[] = [
  { name: "Returns & Refunds", imported: 5, total: 8, hasConflict: true },
  { name: "Shipping & Delivery", imported: 3, total: 7, hasConflict: false },
  { name: "Product FAQs", imported: 4, total: 12, hasConflict: false },
  { name: "Subscription Management", imported: 0, total: 6, hasConflict: false },
  { name: "Account & Billing", imported: 0, total: 5, hasConflict: false },
];

const initialFlaggedArticles: KnowledgeArticle[] = [
  {
    id: "kb_1",
    title: "Return Policy - 30 Day Guarantee",
    source: "Help Center",
    status: "conflict",
    category: "Returns & Refunds",
    lastUpdated: "May 18, 2026",
    issue:
      "Conflicts with Shopify policy page which states 14-day returns. Alhena will flag responses as low-confidence until resolved.",
  },
  {
    id: "kb_2",
    title: "Holiday Shipping Cutoff Dates",
    source: "Help Center",
    status: "pending_review",
    category: "Shipping & Delivery",
    lastUpdated: "Dec 2025",
    issue: "Content may be outdated. Review for current shipping timelines.",
  },
];

const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "You",
    email: "admin@bloomandco.com",
    role: "admin",
    status: "active",
    avatar: "BC",
  },
];

// ── Context ────────────────────────────────────────────────────────────

const OnboardingContext = createContext<OnboardingState | null>(null);

export function useOnboarding(): OnboardingState {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}

// ── Provider ───────────────────────────────────────────────────────────

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [flaggedArticles, setFlaggedArticles] = useState<KnowledgeArticle[]>(initialFlaggedArticles);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [brandVoiceConfigured, setBrandVoiceConfigured] = useState(false);
  const [aiBehaviorsConfigured, setAiBehaviorsConfigured] = useState(false);
  const [launched, setLaunched] = useState(false);

  const launchAlhena = () => setLaunched(true);

  // ── Integration actions (synchronous state updates; pages handle toasts) ──

  const connectIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const extra =
          id === "shopify"
            ? { detail: "1,247 products synced, 3 collections", connectedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }
            : { connectedAt: "Just now" };
        return { ...i, status: "connected" as const, ...extra };
      })
    );
  };

  const completeIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, status: "connected" as const, connectedAt: "Just now" }
          : i
      )
    );
  };

  // ── Knowledge Base actions ──

  const resolveArticle = (id: string) => {
    setFlaggedArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const reviewArticle = (id: string) => {
    setFlaggedArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const bulkImport = () => {
    setCategories((prev) =>
      prev.map((c) => ({ ...c, imported: Math.min(c.total, c.imported + 2) }))
    );
  };

  const importCategory = (name: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.name === name ? { ...c, imported: c.total } : c))
    );
  };

  // ── Team actions ──

  const inviteMember = (email: string, role: "admin" | "editor" | "viewer") => {
    const newMember: TeamMember = {
      id: `member_${Date.now()}`,
      name: email.split("@")[0],
      email,
      role,
      status: "invited",
      avatar: email.slice(0, 2).toUpperCase(),
    };
    setTeamMembers((prev) => [...prev, newMember]);
  };

  // ── Derived knowledge base stats ──

  const totalImported = categories.reduce((s, c) => s + c.imported, 0);
  const totalArticles = categories.reduce((s, c) => s + c.total, 0);

  // ── Derived step state ──

  const steps = useMemo<OnboardingStep[]>(() => {
    const requiredIntegrations = integrations.filter((i) => i.required);
    const requiredConnected = requiredIntegrations.filter((i) => i.status === "connected").length;
    const requiredTotal = requiredIntegrations.length;
    const integrationProgress = requiredTotal > 0 ? (requiredConnected / requiredTotal) * 100 : 0;

    const kbProgress = totalArticles > 0 ? (totalImported / totalArticles) * 100 : 0;

    const shopifyConnected = integrations.find((i) => i.id === "shopify")?.status === "connected";

    const invitedCount = teamMembers.length - 1;
    const plural = invitedCount !== 1 ? "s" : "";

    const step1Status: OnboardingStep["status"] = shopifyConnected ? "complete" : "in_progress";

    const step2Status: OnboardingStep["status"] =
      integrationProgress === 100 ? "complete" : integrationProgress > 0 ? "in_progress" : "pending";

    const step3Status: OnboardingStep["status"] =
      kbProgress === 100 ? "complete" : kbProgress > 0 ? "in_progress" : "pending";

    const kbReady = kbProgress >= 80;
    const step4Status: OnboardingStep["status"] = brandVoiceConfigured
      ? "complete"
      : kbReady
        ? "in_progress"
        : "pending";

    const step5Status: OnboardingStep["status"] = aiBehaviorsConfigured
      ? "complete"
      : step4Status === "complete" || step4Status === "in_progress"
        ? "in_progress"
        : "pending";

    const step6Status: OnboardingStep["status"] =
      teamMembers.length > 1 ? "complete" : "in_progress";

    const allPriorStatuses = [step1Status, step2Status, step3Status, step4Status, step5Status, step6Status];
    const allPriorComplete = allPriorStatuses.every((s) => s === "complete");

    const step7Status: OnboardingStep["status"] = launched
      ? "complete"
      : allPriorComplete
        ? "in_progress"
        : "pending";

    return [
      {
        id: 1,
        icon: Store,
        label: "Connect your store",
        description: "Shopify store linked and product catalog synced",
        status: step1Status,
        progress: step1Status === "complete" ? 100 : 0,
        time: step1Status === "complete" ? "Done" : "~5 min",
        owner: "You",
        detail: step1Status === "complete" ? "1,247 products synced from Shopify" : "Connect your Shopify store to get started",
        action: shopifyConnected ? undefined : "Connect store",
        actionRoute: shopifyConnected ? undefined : "/scenario-2/connect-store",
      },
      {
        id: 2,
        icon: Plug,
        label: "Set up integrations",
        description: "Connect help desk, analytics, and CRM",
        status: step2Status,
        progress: Math.round(integrationProgress),
        time: step2Status === "complete" ? "Done" : "~10 min left",
        owner: "You",
        detail:
          requiredConnected === requiredTotal
            ? "All required integrations connected"
            : `${requiredConnected} of ${requiredTotal} required integrations connected`,
        action: "Continue setup",
        actionRoute: "/scenario-2/integrations",
      },
      {
        id: 3,
        icon: BookOpen,
        label: "Import knowledge base",
        description: "FAQs, return policies, shipping guides, and product docs",
        status: step3Status,
        progress: Math.round(kbProgress),
        time: step3Status === "complete" ? "Done" : "~15 min",
        owner: "You",
        detail:
          totalImported === totalArticles
            ? "All articles imported"
            : `${totalImported} of ${totalArticles} articles imported`,
        action: "Continue import",
        actionRoute: "/scenario-2/knowledge",
      },
      {
        id: 4,
        icon: MessageCircle,
        label: "Configure brand voice",
        description: "Set tone, language preferences, and response style",
        status: step4Status,
        progress: brandVoiceConfigured ? 100 : 0,
        time: brandVoiceConfigured ? "Done" : "~10 min",
        owner: "You",
        detail: brandVoiceConfigured
          ? "Brand voice configured"
          : kbReady
            ? "Knowledge base ready - configure your brand voice"
            : "Unlocks after knowledge base setup",
        action: brandVoiceConfigured ? undefined : "Configure voice",
        actionRoute: brandVoiceConfigured ? undefined : "/scenario-2/settings#ai-personality",
      },
      {
        id: 5,
        icon: Settings,
        label: "Define AI behaviors",
        description: "Escalation rules, automation boundaries, and approval workflows",
        status: step5Status,
        progress: aiBehaviorsConfigured ? 100 : 0,
        time: aiBehaviorsConfigured ? "Done" : "~15 min",
        owner: "You",
        detail: aiBehaviorsConfigured
          ? "AI behaviors configured"
          : step4Status === "complete" || step4Status === "in_progress"
            ? "Ready to configure AI behaviors"
            : "Requires brand voice configuration",
        action: aiBehaviorsConfigured ? undefined : "Set up rules",
        actionRoute: aiBehaviorsConfigured ? undefined : "/scenario-2/settings#escalation-behavior",
      },
      {
        id: 6,
        icon: Users,
        label: "Invite your team",
        description: "Add team members to monitor AI and review escalations",
        status: step6Status,
        progress: step6Status === "complete" ? 100 : 50,
        time: step6Status === "complete" ? "Done" : "~3 min",
        owner: "You",
        detail:
          invitedCount > 0
            ? `${invitedCount} team member${plural} invited`
            : "Can be done anytime",
        action: "Invite now",
        actionRoute: "/scenario-2/team",
      },
      {
        id: 7,
        icon: Rocket,
        label: "Launch",
        description: "Deploy to your storefront with a controlled rollout",
        status: step7Status,
        progress: launched ? 100 : 0,
        time: launched ? "Done" : "~5 min",
        owner: "You + Alhena CSM",
        detail: launched
          ? "Alhena is live on your storefront!"
          : allPriorComplete
            ? "All steps complete - ready to launch!"
            : "All prior steps required",
        action: launched ? undefined : allPriorComplete ? "Launch now" : undefined,
      },
    ];
  }, [integrations, totalImported, totalArticles, teamMembers, brandVoiceConfigured, aiBehaviorsConfigured, launched]);

  const currentStep = steps.find((s) => s.status === "in_progress") ?? steps.find((s) => s.status === "pending");
  const completedCount = steps.filter((s) => s.status === "complete").length;
  const overallProgress = Math.round(steps.reduce((acc, s) => acc + s.progress, 0) / steps.length);

  // ── Step-completion transition detection ──
  const [lastCompletedStep, setLastCompletedStep] = useState<CompletedStepInfo | null>(null);
  const prevStatusesRef = useRef<OnboardingStep["status"][]>([]);

  useEffect(() => {
    const prev = prevStatusesRef.current;
    if (prev.length === 0) {
      prevStatusesRef.current = steps.map((s) => s.status);
      return;
    }

    for (let i = 0; i < steps.length; i++) {
      if (prev[i] !== "complete" && steps[i].status === "complete") {
        const nextStep = steps.slice(i + 1).find(
          (s) => s.status === "in_progress" || s.status === "pending"
        );
        const allComplete = steps.every((s) => s.status === "complete");
        setLastCompletedStep({
          stepLabel: steps[i].label,
          nextStepLabel: nextStep?.label ?? null,
          nextStepRoute: nextStep?.actionRoute ?? null,
          allComplete,
        });
        break;
      }
    }

    prevStatusesRef.current = steps.map((s) => s.status);
  }, [steps]);

  const clearCompletedNotification = () => setLastCompletedStep(null);

  const value: OnboardingState = {
    integrations,
    connectIntegration,
    completeIntegration,

    knowledgeBase: {
      categories,
      flaggedArticles,
      totalImported,
      totalArticles,
    },
    resolveArticle,
    reviewArticle,
    bulkImport,
    importCategory,

    teamMembers,
    inviteMember,

    brandVoiceConfigured,
    setBrandVoiceConfigured,
    aiBehaviorsConfigured,
    setAiBehaviorsConfigured,

    launched,
    launchAlhena,

    steps,
    currentStep,
    overallProgress,
    completedCount,

    lastCompletedStep,
    clearCompletedNotification,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}
