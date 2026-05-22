import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  BarChart3,
  Sparkles,
  AlertTriangle,
  Share2,
  BookOpen,
  MessageCircle,
  ExternalLink,
  Search,
  TrendingUp,
  Shield,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { clsx } from "clsx";
import { TopBar } from "../components/layout/TopBar";

interface FaqItem {
  question: string;
  answer: string;
}

const dashboardFaqs: FaqItem[] = [
  {
    question: "What does Account Health score mean?",
    answer:
      "Account Health is a composite score (0-100) combining revenue performance, customer satisfaction, resolution rate, and AI engagement. Scores above 80 are 'Strong', 60-79 are 'Needs attention', and below 60 require immediate action. The trend arrow shows direction over the last 30 days.",
  },
  {
    question: "How is AI-influenced revenue calculated?",
    answer:
      "AI-influenced revenue tracks orders where Alhena's assistant played a role in the customer journey - product recommendations, checkout nudges, or support resolutions that prevented abandonment. It uses last-touch attribution with a 7-day lookback window. Note the selection bias callout: customers who engage with AI may already have higher purchase intent.",
  },
  {
    question: "Why does conversion show 14.8% when my site average is 3.2%?",
    answer:
      "The 14.8% conversion rate is among sessions where customers interacted with Alhena, not your overall site rate. This is expected to be higher due to selection bias - customers who chat tend to be further along in their purchase decision. Compare against non-AI sessions (3.2% baseline) for the true uplift, and use the drilldown for a controlled comparison.",
  },
  {
    question: "What triggers an anomaly alert?",
    answer:
      "Alhena flags anomalies when a metric deviates significantly from its recent pattern - typically 2+ standard deviations over a 14-day rolling baseline. Factors include sudden volume spikes, content conflicts across sources, and sustained performance drops. Each alert includes confidence level and affected scope.",
  },
  {
    question: "What's the difference between 'high' and 'low' confidence?",
    answer:
      "Confidence reflects how much evidence Alhena has for an insight. High confidence means strong correlation with multiple data points and a clear causal pattern. Low confidence means the signal is present but could be noise, seasonal, or driven by a small sample. Low-confidence insights are still surfaced with a badge so you can decide whether to investigate.",
  },
];

const metricGuides = [
  {
    icon: TrendingUp,
    title: "Revenue metrics",
    items: [
      "AI-Influenced Revenue - Total revenue from sessions with Alhena interaction",
      "AI Conversion Rate - Purchase rate among Alhena-engaged sessions",
      "Nudge Revenue - Revenue from AI-initiated product recommendations",
    ],
  },
  {
    icon: Shield,
    title: "Support metrics",
    items: [
      "Resolution Rate - % of conversations fully resolved by AI without human handoff",
      "Escalation Rate - % of conversations transferred to a human agent",
      "CSAT - Customer satisfaction score from post-interaction surveys",
    ],
  },
  {
    icon: Lightbulb,
    title: "Engagement metrics",
    items: [
      "AI Conversations - Total customer interactions handled by Alhena",
      "Avg Handle Time - Mean duration of AI-handled conversations",
      "Deflection Rate - Support tickets prevented by AI resolution",
    ],
  },
];

interface GuideSection {
  heading: string;
  body: string;
  tip?: string;
}

interface Guide {
  icon: LucideIcon;
  title: string;
  desc: string;
  readTime: string;
  sections: GuideSection[];
  nextGuide: number;
}

const guides: Guide[] = [
  {
    icon: BarChart3,
    title: "Dashboard walkthrough",
    desc: "Step-by-step guide to reading your weekly performance view",
    readTime: "4 min read",
    sections: [
      {
        heading: "1. Start with Account Health",
        body: "The score at the top (0-100) is your single at-a-glance indicator. Green means strong, yellow means attention needed, red means act now. The trend arrow shows direction over the prior period.",
        tip: "If the score is declining but revenue is up, check support metrics - they often explain the gap.",
      },
      {
        heading: "2. Scan the four hero metrics",
        body: "Revenue, Conversion, Resolution Rate, and CSAT are your four pillars. Each card shows the current value, change vs. prior period, and a sparkline trend. Green badges mean improvement; red means decline.",
      },
      {
        heading: "3. Read the AI-generated insights",
        body: "Below the metrics, Alhena summarizes what changed and why. Insights are tagged as Win, Risk, or Opportunity. The first insight is always expanded - it's the most important thing to know this week.",
        tip: "Click any insight to expand the supporting evidence. This is your talking point for stakeholder meetings.",
      },
      {
        heading: "4. Review the action list",
        body: "Actions are ranked by estimated impact. Each has an owner, expected outcome, and clear next step. Start with the priority action at the top - it's the highest-leverage move for the week.",
      },
      {
        heading: "5. Share your snapshot",
        body: "Use the Share section to copy a formatted summary for Slack/email, or export a PDF. The snapshot is pre-written for executive audiences - concise, data-backed, and action-oriented.",
      },
    ],
    nextGuide: 1,
  },
  {
    icon: Sparkles,
    title: "How AI insights work",
    desc: "Methodology behind recommendations, confidence, and anomaly detection",
    readTime: "5 min read",
    sections: [
      {
        heading: "Data sources",
        body: "Alhena analyzes conversation logs, order data, customer satisfaction surveys, and knowledge base content. These are cross-referenced to identify patterns that no single source would reveal.",
      },
      {
        heading: "Insight generation",
        body: "Each insight follows a structured process: detect a significant change, identify the likely cause by correlating data sources, assess confidence level, and recommend a specific action with estimated impact.",
        tip: "Insights tagged 'medium' or 'low' confidence are worth investigating but should not drive major decisions without validation.",
      },
      {
        heading: "Confidence scoring",
        body: "High confidence means strong signal with multiple corroborating data points. Medium confidence indicates a clear pattern but limited sample size. Low confidence means the signal exists but could be noise - Alhena surfaces it so you can decide whether to dig deeper.",
      },
      {
        heading: "Selection bias awareness",
        body: "Conversion rates for AI-engaged sessions will naturally be higher than site averages because customers who interact with AI tend to have higher purchase intent. Alhena flags this with a bias note and provides the non-AI baseline for honest comparison.",
      },
      {
        heading: "Continuous learning",
        body: "As you act on recommendations and outcomes are measured, Alhena refines its models. Dismissed insights reduce similar future suggestions; acted-on insights with positive results increase confidence in that pattern.",
      },
    ],
    nextGuide: 2,
  },
  {
    icon: AlertTriangle,
    title: "Alert response playbook",
    desc: "Best practices for triaging and acting on critical alerts",
    readTime: "3 min read",
    sections: [
      {
        heading: "Triage in 60 seconds",
        body: "Check the severity badge (Critical, Warning, Info) and the affected metric. Critical alerts require same-day action. Warnings should be reviewed within 48 hours. Info alerts are awareness-only.",
        tip: "If multiple alerts fire simultaneously, they often share a root cause. Look for a common trigger before addressing each individually.",
      },
      {
        heading: "Understand the context",
        body: "Every alert shows what changed, when it started, how many customers are affected, and what Alhena recommends. Read the 'Likely causes' section before acting - the most obvious fix isn't always the right one.",
      },
      {
        heading: "Escalation vs. self-resolution",
        body: "Some alerts resolve on their own (e.g., temporary traffic spikes). Alhena monitors resolution automatically and will dismiss transient alerts. If an alert persists beyond its expected duration, it escalates to your attention with updated severity.",
      },
      {
        heading: "Post-resolution review",
        body: "After resolving an alert, check back in 24-48 hours. Alhena tracks whether the fix held and will surface follow-up alerts if the problem recurs. Document your resolution approach in the alert notes for future reference.",
      },
    ],
    nextGuide: 3,
  },
  {
    icon: Share2,
    title: "Sharing reports",
    desc: "How to share snapshots with executives and cross-functional teams",
    readTime: "2 min read",
    sections: [
      {
        heading: "Copy to clipboard",
        body: "The dashboard generates a pre-formatted text summary optimized for Slack and email. It includes the four key metrics, top win, top risk, and priority action - everything a stakeholder needs in 15 seconds.",
        tip: "The summary format is designed for executive audiences. For CX teams, use the detailed export which includes escalation breakdowns.",
      },
      {
        heading: "Email summary",
        body: "Sends a formatted email with subject line, key metrics, and action items. Recipients don't need an Alhena account to read it. Add a personal note to provide context or highlight what you want them to focus on.",
      },
      {
        heading: "PDF export",
        body: "Generates a branded report with all visible dashboard data, charts, and insights. Ideal for board decks, quarterly reviews, or archiving. The PDF includes a timestamp and data freshness indicator.",
      },
      {
        heading: "Best practices",
        body: "Share weekly snapshots on a consistent schedule (e.g., Monday morning before standup). Use the same format each time so stakeholders know where to look. Highlight one action item - if everything is a priority, nothing is.",
      },
    ],
    nextGuide: 0,
  },
];

export function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGuide, setActiveGuide] = useState<number | null>(null);

  const filteredFaqs = searchQuery
    ? dashboardFaqs.filter(
        (f) =>
          f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : dashboardFaqs;

  return (
    <div className="space-y-6">
      <TopBar
        title="Help"
        subtitle="Learn how to get the most from your Alhena dashboard"
        showActions={false}
      />

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search help topics..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-surface-200 bg-surface-0 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:border-alhena-300 focus:ring-2 focus:ring-alhena-100 transition-all"
        />
      </motion.div>

      {/* Quick answers */}
      <section>
        <h2 className="text-sm font-semibold text-surface-900 mb-3">
          Frequently asked questions
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
        >
          <div className="divide-y divide-surface-100">
            {filteredFaqs.map((faq, i) => {
              const isOpen = expandedFaq === i;
              return (
                <div key={i}>
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : i)}
                    className="w-full px-5 py-4 flex items-start gap-3 text-left hover:bg-surface-50/60 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm font-semibold text-surface-800 flex-1">
                      {faq.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-surface-400 mt-0.5"
                    >
                      <ChevronDown size={16} />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 pt-0">
                          <p className="text-sm text-surface-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
            {filteredFaqs.length === 0 && (
              <div className="px-5 py-6 text-center">
                <p className="text-sm text-surface-500">
                  No matching help topics. Try a different search term.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* Metric guide */}
      <section>
        <h2 className="text-sm font-semibold text-surface-900 mb-3">
          Understanding your metrics
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {metricGuides.map((guide, i) => (
            <motion.div
              key={guide.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              className="bg-surface-0 rounded-2xl border border-surface-200 p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <guide.icon size={16} className="text-alhena-500" />
                <h3 className="text-sm font-semibold text-surface-900">
                  {guide.title}
                </h3>
              </div>
              <ul className="space-y-2">
                {guide.items.map((item, j) => {
                  const [name, desc] = item.split(" - ");
                  return (
                    <li key={j} className="text-sm">
                      <span className="font-medium text-surface-800">
                        {name}
                      </span>
                      {desc && (
                        <span className="text-surface-500"> - {desc}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Guides & resources */}
      <section>
        <AnimatePresence mode="wait">
          {activeGuide === null ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-sm font-semibold text-surface-900 mb-3">
                Guides & resources
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {guides.map((guide, i) => (
                  <motion.button
                    key={guide.title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.04 }}
                    onClick={() => setActiveGuide(i)}
                    className="bg-surface-0 rounded-2xl border border-surface-200 p-5 text-left hover:border-alhena-200 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-alhena-50 flex items-center justify-center shrink-0">
                        <guide.icon size={16} className="text-alhena-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-surface-900 group-hover:text-alhena-700 transition-colors">
                          {guide.title}
                        </h3>
                        <p className="text-xs text-surface-500 mt-0.5 leading-relaxed">
                          {guide.desc}
                        </p>
                        <span className="text-[11px] text-surface-400 mt-2 flex items-center gap-1">
                          <BookOpen size={10} />
                          {guide.readTime}
                        </span>
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-surface-300 group-hover:text-alhena-500 mt-1.5 transition-colors shrink-0"
                      />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`guide-${activeGuide}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              {/* Back + breadcrumb */}
              <button
                onClick={() => setActiveGuide(null)}
                className="flex items-center gap-1.5 text-sm text-surface-500 hover:text-alhena-600 transition-colors mb-4"
              >
                <ChevronLeft size={16} />
                <span>All guides</span>
              </button>

              {/* Article header */}
              <div className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-surface-100 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-alhena-50 flex items-center justify-center shrink-0">
                    {(() => {
                      const Icon = guides[activeGuide].icon;
                      return <Icon size={18} className="text-alhena-600" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-surface-900">
                      {guides[activeGuide].title}
                    </h2>
                    <p className="text-xs text-surface-500 mt-0.5">
                      {guides[activeGuide].desc}
                      <span className="mx-2 text-surface-300">|</span>
                      {guides[activeGuide].readTime}
                    </p>
                  </div>
                </div>

                {/* Article body */}
                <div className="px-6 py-5 space-y-5">
                  {guides[activeGuide].sections.map((section, si) => (
                    <motion.div
                      key={si}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: si * 0.06 }}
                    >
                      <h3 className="text-sm font-semibold text-surface-900 mb-1.5 flex items-center gap-2">
                        <CheckCircle2
                          size={14}
                          className="text-alhena-400 shrink-0"
                        />
                        {section.heading}
                      </h3>
                      <p className="text-sm text-surface-600 leading-relaxed ml-[22px]">
                        {section.body}
                      </p>
                      {section.tip && (
                        <div className="ml-[22px] mt-2 bg-alhena-50/60 border border-alhena-100 rounded-lg px-3.5 py-2.5">
                          <p className="text-xs text-alhena-700 leading-relaxed">
                            <span className="font-semibold">Tip:</span>{" "}
                            {section.tip}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Next guide */}
                <div className="px-6 py-4 bg-surface-50/80 border-t border-surface-100">
                  <button
                    onClick={() =>
                      setActiveGuide(guides[activeGuide].nextGuide)
                    }
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-surface-0 border border-surface-200 hover:border-alhena-200 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                        Next
                      </span>
                      <span className="text-sm font-semibold text-surface-800 group-hover:text-alhena-700 transition-colors">
                        {guides[guides[activeGuide].nextGuide].title}
                      </span>
                    </div>
                    <ArrowRight
                      size={14}
                      className="text-surface-300 group-hover:text-alhena-500 transition-colors"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>


      {/* Contact */}
      <section>
        <h2 className="text-sm font-semibold text-surface-900 mb-3">
          Get in touch
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-surface-0 rounded-2xl border border-surface-200 p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-alhena-50 flex items-center justify-center">
                <MessageCircle size={16} className="text-alhena-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-surface-900">
                  Your Alhena CSM
                </h3>
                <p className="text-xs text-surface-500">
                  Dedicated account manager
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-surface-700">
                <span className="font-medium">Jordan Rivera</span>
              </p>
              <p className="text-sm text-alhena-600">
                jordan.r@alhena.ai
              </p>
              <p className="text-xs text-surface-500">
                Typically responds within 2 hours during business hours
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="bg-surface-0 rounded-2xl border border-surface-200 p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-surface-100 flex items-center justify-center">
                <BookOpen size={16} className="text-surface-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-surface-900">
                  Documentation
                </h3>
                <p className="text-xs text-surface-500">
                  Full reference & API docs
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="text-sm text-alhena-600 hover:text-alhena-700 transition-colors flex items-center gap-1.5">
                docs.alhena.ai
                <ExternalLink size={12} />
              </button>
              <p className="text-xs text-surface-500">
                Comprehensive guides, API reference, webhook configuration, and integration tutorials
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
