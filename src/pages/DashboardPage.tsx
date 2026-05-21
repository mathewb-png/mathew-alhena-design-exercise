import { useNavigate } from "react-router-dom";
import { TopBar } from "../components/layout/TopBar";
import { HealthScore } from "../components/dashboard/HealthScore";
import { MetricCard } from "../components/dashboard/MetricCard";
import { InsightCard } from "../components/dashboard/InsightCard";
import { ActionList } from "../components/dashboard/ActionList";
import { metrics } from "../data/metrics";
import { accountHealth, insights, actionItems } from "../data/insights";

export function DashboardPage() {
  const navigate = useNavigate();

  const heroMetrics = metrics.filter((m) =>
    ["ai_revenue", "resolution_rate", "csat", "escalations"].includes(m.id)
  );
  const secondaryMetrics = metrics.filter(
    (m) => !["ai_revenue", "resolution_rate", "csat", "escalations"].includes(m.id)
  );

  return (
    <div className="space-y-8">
      <TopBar
        title="Dashboard"
        subtitle="Monday, May 19, 2026 - Weekly performance review"
      />

      <HealthScore health={accountHealth} />

      {/* Top Insights - Win, Risk, Opportunity */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-surface-400 mb-4">
          This week's insights
        </h2>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <InsightCard key={insight.id} insight={insight} index={i} />
          ))}
        </div>
      </section>

      {/* Key Metrics */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-surface-400 mb-4">
          Key metrics
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {heroMetrics.map((metric, i) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              index={i}
              onClick={() => {
                if (metric.id === "escalations") {
                  navigate("/drilldown");
                }
              }}
            />
          ))}
        </div>
      </section>

      {/* Secondary Metrics */}
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-surface-400 mb-4">
          All metrics
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {secondaryMetrics.map((metric, i) => (
            <MetricCard
              key={metric.id}
              metric={metric}
              index={i + heroMetrics.length}
            />
          ))}
        </div>
      </section>

      {/* Actions */}
      <section>
        <ActionList actions={actionItems} />
      </section>
    </div>
  );
}
