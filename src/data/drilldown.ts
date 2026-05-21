import type { DrilldownData, TimeSeriesPoint } from "../types/dashboard";

const escalationTimeSeries: TimeSeriesPoint[] = [
  { date: "Apr 21", value: 3800 },
  { date: "Apr 24", value: 3950 },
  { date: "Apr 27", value: 4100 },
  { date: "Apr 30", value: 4300 },
  { date: "May 03", value: 4500 },
  { date: "May 06", value: 4650 },
  { date: "May 09", value: 4800 },
  { date: "May 12", value: 5000 },
  { date: "May 15", value: 5200 },
  { date: "May 18", value: 5400 },
  { date: "May 20", value: 5600 },
];

export const escalationDrilldown: DrilldownData = {
  metric: {
    id: "escalations",
    label: "Escalations",
    value: "5.6K",
    numericValue: 5600,
    change: "+21%",
    changeValue: 21,
    trend: "up",
    sentiment: "negative",
    period: "Last 30 days",
    category: "support",
    description:
      "Largest increase from subscription cancellation and shipping ETA intents.",
    sparklineData: [3800, 4000, 4200, 4400, 4600, 4800, 5000, 5100, 5200, 5350, 5500, 5600],
  },
  timeSeries: escalationTimeSeries,
  breakdowns: [
    { label: "Subscription cancellation", value: 1680, percentage: 30 },
    { label: "Shipping ETA", value: 1120, percentage: 20 },
    { label: "Returns & refunds", value: 840, percentage: 15 },
    { label: "Product availability", value: 560, percentage: 10 },
    { label: "Payment issues", value: 448, percentage: 8 },
    { label: "Order modifications", value: 392, percentage: 7 },
    { label: "Other", value: 560, percentage: 10 },
  ],
  relatedInsights: [],
  aiExplanation: {
    summary:
      "Escalations increased 21% primarily due to a 45% spike in subscription cancellation requests and a 28% increase in shipping ETA queries. These two intents alone account for 50% of all escalations.",
    factors: [
      {
        factor: "Subscription cancellation flow lacks self-service options",
        contribution: "~40% of increase",
        confidence: "high",
      },
      {
        factor: "Carrier tracking API returns stale data for 2 shipping providers",
        contribution: "~30% of increase",
        confidence: "medium",
      },
      {
        factor: "Seasonal volume increase in May",
        contribution: "~20% of increase",
        confidence: "medium",
      },
      {
        factor: "Return policy content conflict causing fallback to agent",
        contribution: "~10% of increase",
        confidence: "low",
      },
    ],
    methodology:
      "Causal analysis based on intent classification, resolution path tracking, and comparison with the prior 30-day period. Confidence levels reflect data completeness and causal certainty.",
  },
};

export const revenueTimeSeries: TimeSeriesPoint[] = [
  { date: "Apr 21", value: 380000 },
  { date: "Apr 24", value: 410000 },
  { date: "Apr 27", value: 430000 },
  { date: "Apr 30", value: 460000 },
  { date: "May 03", value: 485000 },
  { date: "May 06", value: 510000 },
  { date: "May 09", value: 540000 },
  { date: "May 12", value: 565000 },
  { date: "May 15", value: 585000 },
  { date: "May 18", value: 600000 },
  { date: "May 20", value: 612000 },
];
