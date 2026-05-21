export type MetricTrend = "up" | "down" | "flat";
export type MetricSentiment = "positive" | "negative" | "neutral" | "warning";
export type Confidence = "high" | "medium" | "low";
export type Priority = "critical" | "high" | "medium" | "low";
export type InsightType = "win" | "risk" | "opportunity" | "action";
export type SetupStatus = "complete" | "in_progress" | "pending" | "blocked";

export interface Metric {
  id: string;
  label: string;
  value: string;
  numericValue: number;
  change: string;
  changeValue: number;
  trend: MetricTrend;
  sentiment: MetricSentiment;
  period: string;
  category: "revenue" | "engagement" | "support" | "experience";
  description: string;
  sparklineData?: number[];
}

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  summary: string;
  evidence: string[];
  confidence: Confidence;
  impact: string;
  recommendedAction?: string;
  actionLabel?: string;
  relatedMetrics: string[];
  timestamp: string;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  owner: string;
  estimatedImpact: string;
  status: "suggested" | "in_progress" | "completed" | "dismissed";
  dueDate?: string;
  category: string;
}

export interface RiskSignal {
  id: string;
  title: string;
  description: string;
  severity: Priority;
  confidence: Confidence;
  source: string;
  detectedAt: string;
  suggestedFix: string;
}

export interface SetupStep {
  id: string;
  label: string;
  description: string;
  status: SetupStatus;
  progress?: number;
  icon: string;
  estimatedTime?: string;
  helpUrl?: string;
}

export interface AccountHealth {
  score: number;
  trend: MetricTrend;
  label: string;
  summary: string;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
}

export interface DrilldownData {
  metric: Metric;
  timeSeries: TimeSeriesPoint[];
  breakdowns: { label: string; value: number; percentage: number }[];
  relatedInsights: Insight[];
  aiExplanation: {
    summary: string;
    factors: { factor: string; contribution: string; confidence: Confidence }[];
    methodology: string;
  };
}

export type DashboardView = "active" | "onboarding";
export type UserRole = "vp_ecommerce" | "cx_lead" | "csm";
