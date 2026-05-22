import type { Insight, ActionItem, RiskSignal, AccountHealth } from "../types/dashboard";
import type { PeriodKey } from "./metrics";

// ── 30-day baseline (existing data) ──

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

// ── 7-day insights: tactical, urgent, action-oriented ──

const insights7d: Insight[] = [
  {
    id: "insight_7d_win_1",
    type: "win",
    title: "Revenue spiked 22% this week to $148K, led by flash sale",
    summary:
      "A mid-week flash sale drove a sharp uptick in AI-engaged orders. Conversion peaked at 15.9% on Thursday, and AOV climbed to $161 as the AI guided shoppers toward premium bundles.",
    evidence: [
      "948 AI-influenced orders this week (+14% WoW)",
      "AOV hit $161, the highest 7-day average this quarter",
      "Thursday conversion peaked at 15.9%",
    ],
    confidence: "high",
    impact: "$148K in weekly AI-attributable revenue",
    relatedMetrics: ["ai_revenue", "ai_orders", "ai_aov", "ai_cvr"],
    timestamp: "2026-05-19T08:00:00Z",
  },
  {
    id: "insight_7d_risk_1",
    type: "risk",
    title: "Resolution rate hit 76.1% - worst week this quarter",
    summary:
      "A surge of subscription cancellation requests overwhelmed the AI flow mid-week. Resolution dropped to 74.8% on Thursday before recovering slightly. Escalations hit 1.8K for the week, a 32% increase.",
    evidence: [
      "Resolution rate bottomed at 74.8% on Thursday",
      "1.8K escalations (+32% WoW)",
      "CSAT fell to 82% (-5pp WoW)",
    ],
    confidence: "high",
    impact: "Acute CX pressure - agent queue backed up Thursday/Friday",
    recommendedAction:
      "Deploy an emergency update to the subscription cancellation flow this week. Route cancellation intents to a retention-offer path.",
    actionLabel: "Fix cancellation flow now",
    relatedMetrics: ["resolution_rate", "csat", "escalations"],
    timestamp: "2026-05-19T08:00:00Z",
  },
  {
    id: "insight_7d_opportunity_1",
    type: "opportunity",
    title: "Flash sale FAQ volume spiked 28% - automate the top queries",
    summary:
      "Product FAQ interactions surged to 16.2K, mostly sizing and return-window questions triggered by flash sale traffic. Automating answers for the top 5 flash-sale queries could cut next event's support load.",
    evidence: [
      "16.2K FAQ interactions (+28% WoW)",
      "Top queries: sizing, return window, bundle contents",
      "89% of these interactions were on mobile",
    ],
    confidence: "medium",
    impact: "Could reduce next flash sale escalations by ~20%",
    recommendedAction:
      "Create dedicated flash-sale FAQ content for the top 5 queries before the next event.",
    actionLabel: "Prepare flash sale FAQs",
    relatedMetrics: ["product_faq", "escalations", "mobile_share"],
    timestamp: "2026-05-19T08:00:00Z",
  },
];

const accountHealth7d: AccountHealth = {
  score: 72,
  trend: "down",
  label: "Needs Attention",
  summary:
    "Strong revenue week ($148K, +22%) was overshadowed by the worst support performance this quarter. Resolution dropped to 76.1% and CSAT fell to 82%. The subscription cancellation flow is the primary driver and needs an immediate fix.",
};

const actionItems7d: ActionItem[] = [
  {
    id: "action_7d_1",
    title: "Emergency fix: subscription cancellation flow",
    description:
      "Cancellation escalations surged 32% this week. Deploy a retention-offer path before routing to agents. This is the single highest-impact fix available right now.",
    priority: "critical",
    owner: "CX Team",
    estimatedImpact: "Reduce weekly escalations by ~25%, recover 2-3pp CSAT",
    status: "suggested",
    category: "Support",
  },
  {
    id: "action_7d_2",
    title: "Add real-time shipping ETA to AI responses",
    description:
      "Shipping delays hit subscription orders mid-week. Live carrier data would let Alhena answer ETA questions directly.",
    priority: "high",
    owner: "CX Team",
    estimatedImpact: "Reduce shipping escalations by ~30%",
    status: "suggested",
    category: "Support",
  },
  {
    id: "action_7d_3",
    title: "Prepare flash-sale FAQ content",
    description:
      "Sizing and return-window questions spiked during the flash sale. Pre-built FAQ content for the top 5 queries will reduce next event's support load.",
    priority: "medium",
    owner: "Content Team",
    estimatedImpact: "Cut flash sale escalations by ~20%",
    status: "suggested",
    category: "Content",
  },
  {
    id: "action_7d_4",
    title: "Investigate Thursday CSAT drop to 80.8%",
    description:
      "CSAT bottomed on Thursday, coinciding with the escalation spike. Review the specific interactions that drove low scores.",
    priority: "medium",
    owner: "CX Team",
    estimatedImpact: "Identify root cause and prevent recurrence",
    status: "suggested",
    category: "Support",
  },
  {
    id: "action_7d_5",
    title: "Capitalize on flash sale momentum",
    description:
      "Revenue spiked 22% this week. Share highlights with stakeholders and plan the next promotional event.",
    priority: "low",
    owner: "Account Team",
    estimatedImpact: "Strengthen renewal narrative",
    status: "suggested",
    category: "Reporting",
  },
];

// ── 90-day insights: strategic, pattern-oriented, higher confidence ──

const insights90d: Insight[] = [
  {
    id: "insight_90d_win_1",
    type: "win",
    title: "AI-influenced revenue totaled $1.62M this quarter, up 22% QoQ",
    summary:
      "Alhena delivered consistent revenue growth across all three months. Conversion rates climbed from 11% to 14.8%, and AOV stabilized above $150. The quarter validates the AI commerce thesis.",
    evidence: [
      "10,450 AI-influenced orders (+15% QoQ)",
      "AOV grew from $134 to $155 over the quarter",
      "Conversion rate improved from 11.0% to 14.8%",
      "Smart nudges contributed $720K (+26% QoQ)",
    ],
    confidence: "high",
    impact: "$1.62M in quarterly AI-attributable revenue",
    relatedMetrics: ["ai_revenue", "ai_orders", "ai_aov", "ai_cvr"],
    timestamp: "2026-05-19T08:00:00Z",
  },
  {
    id: "insight_90d_win_2",
    type: "win",
    title: "Conversion rate doubled over 90 days, now at 14.8%",
    summary:
      "AI-engaged conversion grew steadily from ~11% to 14.8% across the quarter, far outpacing the sitewide baseline that moved from 3.1% to 3.3%. The gap is widening in Alhena's favor.",
    evidence: [
      "Start of quarter: 11.0% AI vs. 3.1% baseline",
      "End of quarter: 14.8% AI vs. 3.3% baseline",
      "Growth was gradual and consistent, not spike-driven",
    ],
    confidence: "high",
    impact: "Structural conversion advantage - engagement quality is improving",
    relatedMetrics: ["ai_cvr", "ai_orders"],
    timestamp: "2026-05-19T08:00:00Z",
  },
  {
    id: "insight_90d_risk_1",
    type: "risk",
    title: "Support quality eroded steadily across the quarter",
    summary:
      "AI resolution rate declined from 83.5% to 78.4% over 90 days, with escalations growing from 3.4K to 5.6K monthly. The decline accelerated in the final month, suggesting a compounding problem rather than a one-off event.",
    evidence: [
      "Resolution rate: 83.5% to 78.4% (-5.1pp over 90 days)",
      "Escalation volume: 3.4K to 5.6K monthly (+65%)",
      "CSAT: 87.5% to 84.0% (-3.5pp over the quarter)",
      "Subscription and shipping intents drove 60%+ of the decline",
    ],
    confidence: "high",
    impact: "Sustained CX erosion threatens renewal if not addressed",
    recommendedAction:
      "Invest in a structured support improvement program: fix cancellation flow, connect shipping data, and retrain intents monthly.",
    actionLabel: "Launch support improvement plan",
    relatedMetrics: ["resolution_rate", "csat", "escalations"],
    timestamp: "2026-05-19T08:00:00Z",
  },
  {
    id: "insight_90d_opportunity_1",
    type: "opportunity",
    title: "Nudge revenue scaled from $180K to $274K/month - but watch CSAT",
    summary:
      "Smart nudges grew 26% QoQ to $720K total. The channel has proven scalable but CSAT for nudge interactions deteriorated as frequency increased. A frequency cap or smarter targeting could unlock the next tier of growth without the CSAT drag.",
    evidence: [
      "Nudge revenue: $180K/month to $274K/month over the quarter",
      "Nudge frequency doubled, but CSAT for nudge sessions dropped to 76%",
      "Mobile share grew to 87%, amplifying nudge fatigue risk",
      "Best-performing nudges are product recommendations, worst are urgency-based",
    ],
    confidence: "high",
    impact: "Optimize for $300K+/month nudge revenue with improved CSAT",
    recommendedAction:
      "Implement a nudge frequency cap for mobile and shift mix toward product recommendations. Run a 30-day test.",
    actionLabel: "Design nudge optimization plan",
    relatedMetrics: ["nudge_revenue", "csat", "mobile_share"],
    timestamp: "2026-05-19T08:00:00Z",
  },
];

const accountHealth90d: AccountHealth = {
  score: 78,
  trend: "up",
  label: "Fair",
  summary:
    "Quarterly trajectory is positive: $1.62M in AI-influenced revenue (+22% QoQ) and conversion rates doubled. Support quality declined but the trend is gradual, not acute. A focused support improvement program would move the score above 80.",
};

const actionItems90d: ActionItem[] = [
  {
    id: "action_90d_1",
    title: "Launch a structured support improvement program",
    description:
      "Resolution dropped 5.1pp over the quarter and escalations grew 65%. A phased program covering cancellation flow, shipping data, and monthly intent retraining will reverse the trend.",
    priority: "critical",
    owner: "CX Team",
    estimatedImpact: "Recover 3-5pp resolution rate over next quarter",
    status: "suggested",
    category: "Support",
  },
  {
    id: "action_90d_2",
    title: "Optimize nudge strategy for the next quarter",
    description:
      "Nudges scaled to $720K/quarter but CSAT drag is growing. Implement frequency caps, shift to product-rec nudges, and measure over 30 days.",
    priority: "high",
    owner: "Growth Team",
    estimatedImpact: "Target $300K+/month nudge revenue with +4pp CSAT",
    status: "suggested",
    category: "Revenue",
  },
  {
    id: "action_90d_3",
    title: "Expand AI commerce playbook to new product lines",
    description:
      "AOV and conversion growth are strong. Identify 2-3 underserved product categories where AI guidance could replicate the current lift.",
    priority: "high",
    owner: "Account Team",
    estimatedImpact: "Potential $400K+ incremental quarterly revenue",
    status: "suggested",
    category: "Revenue",
  },
  {
    id: "action_90d_4",
    title: "Build quarterly executive review deck",
    description:
      "$1.62M in AI-influenced revenue is a strong renewal narrative. Package the quarter's story with trend lines and strategic recommendations.",
    priority: "medium",
    owner: "Account Team",
    estimatedImpact: "Strengthen renewal and expansion conversations",
    status: "suggested",
    category: "Reporting",
  },
  {
    id: "action_90d_5",
    title: "Reconcile return policy content",
    description:
      "The content conflict has persisted all quarter. Designate a canonical source to eliminate the low-confidence flag.",
    priority: "medium",
    owner: "Content Team",
    estimatedImpact: "Resolve long-standing inconsistency, reduce escalation risk",
    status: "suggested",
    category: "Content",
  },
];

// ── Period-keyed lookups ──

export const insightsByPeriod: Record<PeriodKey, Insight[]> = {
  "7d": insights7d,
  "30d": insights,
  "90d": insights90d,
};

export const accountHealthByPeriod: Record<PeriodKey, AccountHealth> = {
  "7d": accountHealth7d,
  "30d": accountHealth,
  "90d": accountHealth90d,
};

export const actionItemsByPeriod: Record<PeriodKey, ActionItem[]> = {
  "7d": actionItems7d,
  "30d": actionItems,
  "90d": actionItems90d,
};
