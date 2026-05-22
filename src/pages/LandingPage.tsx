import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart3,
  Rocket,
  ArrowRight,
  Clock,
  User,
  MonitorSmartphone,
  Layers,
  Eye,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { AlhenaLogo } from "../components/brand/AlhenaLogo";
import { OrganicBackground } from "../components/brand/OrganicBackground";

const scenarios = [
  {
    to: "/scenario-1",
    number: "01",
    title: "Weekly Performance Review",
    subtitle: "Mature account with live data",
    persona: "VP of Ecommerce",
    context:
      "Monday morning before a weekly trading meeting. 10 minutes to understand last week's performance - wins, risks, and what to act on first.",
    questions: [
      "Is Alhena driving meaningful outcomes?",
      "What changed since last period?",
      "Which issue should the team act on first?",
      "What evidence supports the recommendation?",
      "What can be shared with stakeholders?",
    ],
    icon: BarChart3,
    gradient: "from-alhena-500 to-alhena-700",
    deliverables: ["Primary dashboard", "Drilldown detail", "Anomaly state"],
  },
  {
    to: "/scenario-2",
    number: "02",
    title: "New Account Onboarding",
    subtitle: "First-run experience, no data yet",
    persona: "New customer",
    context:
      "A new customer lands on the dashboard for the first time. No live traffic, no integrations, no historical data. The goal is to guide them to launch readiness.",
    questions: [
      "What setup steps are required?",
      "Which integrations are connected or missing?",
      "What will reporting look like with real data?",
      'How to distinguish "not enough data" from a problem?',
      "What is the clearest next action?",
    ],
    icon: Rocket,
    gradient: "from-emerald-500 to-teal-700",
    deliverables: [
      "Setup progress view",
      "Integration status",
      "Preview/sample data",
    ],
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-surface-100">
        <div className="max-w-6xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlhenaLogo collapsed={false} />
          </div>
          <div className="flex items-center gap-4 text-[12px] text-surface-400">
            <span className="flex items-center gap-1.5">
              <MonitorSmartphone size={13} />
              Desktop web
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={13} />
              Product Design Exercise
            </span>
          </div>
        </div>
      </header>

      {/* Hero + Scenario Cards */}
      <div className="relative">
        <OrganicBackground />
        <div className="relative max-w-6xl mx-auto px-8 pt-16 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-alhena-500 mb-3">
              Mathew Byrne - Design Exercise
            </p>
            <h1 className="text-4xl font-bold text-surface-900 leading-tight mb-4">
              Redesigning Alhena's Dashboard Around Actionability
            </h1>
            <p className="text-lg text-surface-500 leading-relaxed">
              Two scenarios. Two distinct design challenges. Both focused on
              helping users understand what changed, why it matters, and what
              they should do next.
            </p>
          </motion.div>
        </div>
        <div className="relative max-w-6xl mx-auto px-8 pb-16">
        <div className="grid grid-cols-2 gap-8">
          {scenarios.map((s, i) => (
            <motion.div
              key={s.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
            >
              <Link
                to={s.to}
                className="block group rounded-2xl border border-surface-200 overflow-hidden bg-white hover:shadow-xl hover:border-surface-300 transition-all duration-300"
              >
                {/* Card header */}
                <div
                  className={`bg-gradient-to-br ${s.gradient} p-8 text-white relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                        Scenario {s.number}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                        <s.icon size={20} />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{s.title}</h2>
                    <p className="text-sm text-white/70">{s.subtitle}</p>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6 space-y-5">
                  {/* Persona */}
                  <div className="flex items-center gap-2">
                    <User size={13} className="text-surface-400" />
                    <span className="text-[12px] font-semibold text-surface-600">
                      Primary user: {s.persona}
                    </span>
                  </div>

                  {/* Context */}
                  <p className="text-[13px] text-surface-600 leading-relaxed">
                    {s.context}
                  </p>

                  {/* Questions */}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-surface-400 mb-2">
                      Questions the design answers
                    </p>
                    {s.questions.map((q) => (
                      <div
                        key={q}
                        className="flex items-start gap-2 text-[12px] text-surface-500"
                      >
                        <span className="w-1 h-1 rounded-full bg-surface-300 mt-1.5 shrink-0" />
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>

                  {/* Deliverables */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {s.deliverables.map((d) => (
                      <span
                        key={d}
                        className="text-[10px] font-medium text-surface-500 bg-surface-50 border border-surface-100 px-2.5 py-1 rounded-full"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-alhena-500 font-semibold text-[13px] pt-2 group-hover:gap-3 transition-all">
                    View design
                    <ArrowRight
                      size={15}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      </div>

      {/* Deliverables Mapping */}
      <div className="max-w-6xl mx-auto px-8 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-surface-400 mb-4">
            Required Deliverables
          </p>
          <div className="grid grid-cols-5 gap-3">
            {[
              {
                icon: Layers,
                label: "Primary dashboard",
                detail: "Account health, top changes, actions",
                route: "Scenario 1 - Dashboard",
              },
              {
                icon: Rocket,
                label: "New-account state",
                detail: "Before historical data exists",
                route: "Scenario 2 - Launch Readiness",
              },
              {
                icon: Eye,
                label: "Drilldown detail",
                detail: "Investigate a metric or issue",
                route: "Scenario 1 - Escalation Analysis",
              },
              {
                icon: AlertTriangle,
                label: "Non-happy-path",
                detail: "Anomaly, low-confidence AI, risk",
                route: "Scenario 1 - Alerts & Anomalies",
              },
              {
                icon: FileText,
                label: "Design rationale",
                detail: "Assumptions, tradeoffs, hierarchy",
                route: "Below",
              },
            ].map((d) => (
              <div
                key={d.label}
                className="bg-surface-50 border border-surface-100 rounded-xl p-4"
              >
                <d.icon size={14} className="text-surface-400 mb-2" />
                <p className="text-[12px] font-semibold text-surface-800 mb-0.5">
                  {d.label}
                </p>
                <p className="text-[11px] text-surface-500 leading-relaxed">
                  {d.detail}
                </p>
                <p className="text-[10px] text-alhena-500 font-medium mt-2">
                  {d.route}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Design Rationale */}
      <div className="max-w-6xl mx-auto px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <div className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-wider text-alhena-500 mb-2">
              Deliverable 5
            </p>
            <h2 className="text-3xl font-bold text-surface-900 mb-2">
              Design Rationale
            </h2>
            <p className="text-[15px] text-surface-500 max-w-xl">
              The thinking behind every layout, hierarchy, and interaction choice.
            </p>
          </div>

          {/* Primary user - hero callout */}
          <div className="bg-gradient-to-br from-alhena-500 to-alhena-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
            <div className="relative flex items-start gap-6">
              <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 mt-1">
                <User size={22} />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1">
                  Primary user
                </p>
                <h3 className="text-xl font-bold mb-2">VP of Ecommerce / Digital</h3>
                <p className="text-[14px] text-white/80 leading-relaxed max-w-2xl">
                  10 minutes before a trading meeting. Three questions:{" "}
                  <strong className="text-white">Is Alhena working?</strong>{" "}
                  <strong className="text-white">What changed?</strong>{" "}
                  <strong className="text-white">What do I do about it?</strong>{" "}
                  Every design decision is filtered through this time-pressured, outcome-oriented lens.
                </p>
                <p className="text-[12px] text-white/50 mt-3">
                  Secondary users: CX leads and CSMs access deeper analytical layers
                </p>
              </div>
            </div>
          </div>

          {/* Key assumptions - numbered cards */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-surface-800 mb-4">
              Key assumptions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  title: "Outcomes over activity",
                  desc: "Revenue, resolution, and CSAT matter more than conversations or page views. Activity metrics are available but deprioritized.",
                },
                {
                  title: "Narrative over charts",
                  desc: "A single AI-generated narrative is more useful than a grid of charts. Charts support the narrative, not the other way around.",
                },
                {
                  title: "Numbers need context",
                  desc: "Every metric movement is accompanied by an explanation and a recommended action. Numbers without context create anxiety, not clarity.",
                },
                {
                  title: "Momentum over empty states",
                  desc: "New accounts need confidence, not blank screens. Progress bars, milestones, and preview data keep them engaged through onboarding.",
                },
              ].map((a, i) => (
                <div
                  key={i}
                  className="bg-white border border-surface-200 rounded-xl p-5 flex items-start gap-4"
                >
                  <span className="w-7 h-7 rounded-lg bg-alhena-50 flex items-center justify-center text-xs font-bold text-alhena-600 shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-surface-900 mb-1">
                      {a.title}
                    </p>
                    <p className="text-[12px] text-surface-500 leading-relaxed">
                      {a.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Information hierarchy - visual timeline */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-surface-800 mb-4">
              Information hierarchy
            </h3>
            <div className="grid grid-cols-3 gap-0 bg-white border border-surface-200 rounded-2xl overflow-hidden">
              {[
                {
                  level: "L1",
                  label: "Glanceable",
                  items: [
                    "Account health score",
                    "Hero metrics (4)",
                    "Win / risk / action headlines",
                  ],
                  timing: "First 10 seconds",
                  color: "bg-alhena-500",
                  textColor: "text-alhena-700",
                  bgColor: "bg-alhena-50",
                },
                {
                  level: "L2",
                  label: "Scannable",
                  items: [
                    "Insight evidence",
                    "Action list with owners",
                    "Sparkline trends",
                  ],
                  timing: "10 - 30 seconds",
                  color: "bg-alhena-400",
                  textColor: "text-alhena-600",
                  bgColor: "bg-white",
                },
                {
                  level: "L3",
                  label: "Explorable",
                  items: [
                    "Full metric grid",
                    "Drilldown charts & AI analysis",
                    "Share & export tools",
                  ],
                  timing: "On demand",
                  color: "bg-alhena-300",
                  textColor: "text-alhena-500",
                  bgColor: "bg-surface-50/50",
                },
              ].map((l, i) => (
                <div
                  key={l.level}
                  className={`p-5 ${l.bgColor} ${i < 2 ? "border-r border-surface-100" : ""}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-2 h-2 rounded-full ${l.color}`} />
                    <span className={`text-[11px] font-bold uppercase tracking-wider ${l.textColor}`}>
                      {l.level} - {l.label}
                    </span>
                  </div>
                  <ul className="space-y-1.5 mb-3">
                    {l.items.map((item) => (
                      <li
                        key={item}
                        className="text-[12px] text-surface-700 flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-surface-300 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[11px] font-medium text-surface-400 flex items-center gap-1">
                    <Clock size={10} />
                    {l.timing}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Design tradeoffs */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-surface-800 mb-4">
              Design tradeoffs
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  gave: "Comprehensive chart grid",
                  got: "Narrative-first insights",
                  why: "A VP with 10 minutes needs conclusions, not raw charts. Charts exist on demand (L3) but the default view leads with AI-generated summaries.",
                },
                {
                  gave: "Equal metric weighting",
                  got: "Revenue + CX hero pairing",
                  why: "Showing 4 hero metrics (2 revenue, 2 support) surfaces the revenue-experience tension immediately. Remaining 7 metrics are one click away.",
                },
                {
                  gave: "Separate alerts page only",
                  got: "Inline risk signals in insights",
                  why: "Risks appear in the main dashboard feed so they are never missed. A dedicated Alerts page exists for deeper investigation but is not required to notice a problem.",
                },
                {
                  gave: "Generic empty state",
                  got: "Guided onboarding with preview",
                  why: "New accounts see a structured setup flow with progress, milestones, and a sample dashboard. This builds confidence that the product will deliver value once launched.",
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="bg-surface-50 border border-surface-200 rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-danger-500">
                      Gave up
                    </span>
                    <span className="text-[12px] text-surface-700 font-medium">
                      {t.gave}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-success-600">
                      Got
                    </span>
                    <span className="text-[12px] text-surface-700 font-medium">
                      {t.got}
                    </span>
                  </div>
                  <p className="text-[12px] text-surface-500 leading-relaxed">
                    {t.why}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
