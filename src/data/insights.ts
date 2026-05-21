import type { Insight, ActionItem, RiskSignal, AccountHealth } from "../types/dashboard";

export const accountHealth: AccountHealth = {
  score: 74,
  trend: "down",
  label: "Needs Attention",
  summary:
    "Revenue metrics are strong (+18% AI-influenced revenue), but support quality is declining. CSAT dropped 3pp and escalations rose 21%, concentrated in subscription and shipping intents. Immediate action on support resolution will protect the revenue gains.",
};

export const insights: Insight[] = [
  {
    id: "insight_win_1",
    type: "win",
    title: "AI-influenced revenue hit $612K, up 18% month-over-month",
    summary:
      "Alhena interactions are driving measurably higher conversion and AOV. AI-engaged shoppers convert at 14.8% versus the 3.2% site baseline, with AOV 50% higher than average.",
    evidence: [
      "3,920 AI-influenced orders (+11% MoM)",
      "AI-engaged AOV of $156 vs. $104 sitewide",
      "14.8% conversion rate for engaged shoppers",
      "Smart nudges contributed $274K (+31%)",
    ],
    confidence: "high",
    impact: "$612K in attributable revenue",
    relatedMetrics: ["ai_revenue", "ai_orders", "ai_aov", "ai_cvr"],
    timestamp: "2026-05-19T08:00:00Z",
  },
  {
    id: "insight_risk_1",
    type: "risk",
    title: "Support resolution dropped 4.6pp while escalations surged 21%",
    summary:
      "AI resolution rate fell from 83% to 78.4%. Escalations jumped to 5.6K, driven by subscription cancellation and shipping ETA queries. CSAT declined 3pp to 84%, with the drop concentrated in these same intents.",
    evidence: [
      "Resolution rate: 78.4% (was 83.0%)",
      "Escalation volume: 5.6K (+21%)",
      "CSAT: 84% (-3pp), worst in subscription & shipping",
      "Subscription cancellation is the fastest-growing escalation intent",
    ],
    confidence: "high",
    impact: "Customer experience degradation in high-sensitivity intents",
    recommendedAction:
      "Review and update subscription cancellation and shipping ETA response flows. Consider adding proactive shipping status updates to reduce inbound volume.",
    actionLabel: "Review escalation intents",
    relatedMetrics: ["resolution_rate", "csat", "escalations"],
    timestamp: "2026-05-19T08:00:00Z",
  },
  {
    id: "insight_opportunity_1",
    type: "opportunity",
    title: "Smart nudges drive $274K but CSAT is 76% - optimize for both",
    summary:
      "Nudge revenue grew 31%, making it the fastest-growing channel. However, nudge-triggered interactions have a CSAT of 76%, 8pp below the account average. Tuning nudge frequency or timing could preserve revenue while improving sentiment.",
    evidence: [
      "Nudge revenue: $274K (+31%)",
      "Nudge CSAT: 76% vs. 84% account average",
      "Nudge frequency has increased 2x in the last 30 days",
      "Mobile users (87% of traffic) may be more sensitive to nudge fatigue",
    ],
    confidence: "medium",
    impact: "Potential to recover 4-6pp CSAT while retaining $250K+ in nudge revenue",
    recommendedAction:
      "A/B test reduced nudge frequency on mobile and measure CSAT impact over 14 days.",
    actionLabel: "Set up nudge A/B test",
    relatedMetrics: ["nudge_revenue", "csat", "mobile_share"],
    timestamp: "2026-05-19T08:00:00Z",
  },
  {
    id: "insight_risk_2",
    type: "risk",
    title: "Return policy answers flagged as low confidence",
    summary:
      "Alhena detected a conflict between the help center return policy and the Shopify policy page. This may cause inconsistent answers to return-related questions, increasing escalation risk.",
    evidence: [
      "Policy conflict detected between two authoritative sources",
      "Return-related queries account for ~8% of total conversations",
      "Low-confidence flag triggered by content divergence check",
    ],
    confidence: "low",
    impact: "Inconsistent customer experience on return policy questions",
    recommendedAction:
      "Reconcile the help center and Shopify return policy content. Designate one as the canonical source.",
    actionLabel: "Fix policy conflict",
    relatedMetrics: ["resolution_rate", "escalations"],
    timestamp: "2026-05-19T08:00:00Z",
  },
];

export const actionItems: ActionItem[] = [
  {
    id: "action_1",
    title: "Fix subscription cancellation flow",
    description:
      "Subscription cancellation is the #1 escalation driver. Update the AI response to offer retention options before routing to an agent.",
    priority: "critical",
    owner: "CX Team",
    estimatedImpact: "Reduce escalations by ~15%, recover 1-2pp CSAT",
    status: "suggested",
    category: "Support",
  },
  {
    id: "action_2",
    title: "Update shipping ETA responses",
    description:
      "Shipping status queries are the #2 escalation driver. Connect live carrier tracking data so Alhena can give real-time ETAs.",
    priority: "high",
    owner: "CX Team",
    estimatedImpact: "Reduce shipping escalations by ~30%",
    status: "suggested",
    category: "Support",
  },
  {
    id: "action_3",
    title: "Reconcile return policy content",
    description:
      "Help center and Shopify return policy pages conflict. Designate a canonical source and update Alhena's knowledge base.",
    priority: "high",
    owner: "Content Team",
    estimatedImpact: "Resolve low-confidence flag, prevent inconsistent answers",
    status: "suggested",
    category: "Content",
  },
  {
    id: "action_4",
    title: "A/B test nudge frequency on mobile",
    description:
      "Smart nudges drive $274K revenue but CSAT is 76%. Test reducing nudge frequency for mobile users (87% of traffic).",
    priority: "medium",
    owner: "Growth Team",
    estimatedImpact: "Recover 4-6pp CSAT while retaining $250K+ nudge revenue",
    status: "suggested",
    category: "Revenue",
  },
  {
    id: "action_5",
    title: "Share weekly performance summary with stakeholders",
    description:
      "AI-influenced revenue is up 18%. Generate and share an executive-ready performance snapshot.",
    priority: "low",
    owner: "Account Team",
    estimatedImpact: "Strengthen stakeholder confidence and renewal narrative",
    status: "suggested",
    category: "Reporting",
  },
];

export const riskSignals: RiskSignal[] = [
  {
    id: "risk_1",
    title: "Return policy content conflict",
    description:
      "The help center return policy and Shopify policy page contain conflicting information about return windows and conditions.",
    severity: "high",
    confidence: "low",
    source: "Content divergence check",
    detectedAt: "2026-05-17T14:30:00Z",
    suggestedFix:
      "Review both sources and designate one as canonical. Update Alhena's knowledge base to reference only the canonical version.",
  },
  {
    id: "risk_2",
    title: "Subscription cancellation escalation spike",
    description:
      "Subscription cancellation escalations increased 45% in the last 14 days, faster than overall escalation growth.",
    severity: "critical",
    confidence: "high",
    source: "Intent trend analysis",
    detectedAt: "2026-05-18T09:15:00Z",
    suggestedFix:
      "Update the cancellation flow to include retention offers and self-service options before agent handoff.",
  },
];
