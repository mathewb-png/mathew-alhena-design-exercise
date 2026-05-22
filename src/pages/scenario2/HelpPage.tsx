import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Rocket,
  Plug,
  BookOpen,
  Users,
  ArrowRight,
  Clock,
  CheckCircle2,
  Search,
  MessageCircle,
  ExternalLink,
  Calendar,
  Sparkles,
  HelpCircle,
  Zap,
} from "lucide-react";
import { clsx } from "clsx";
import { TopBar } from "../../components/layout/TopBar";
import { CollapsibleSection } from "../../components/layout/CollapsibleSection";

const onboardingSteps = [
  {
    icon: Plug,
    label: "Connect integrations",
    time: "10-15 min",
    description: "Link your ecommerce platform, helpdesk, and analytics tools so Alhena can access your data.",
    tip: "Start with your most critical tool (e.g. Shopify or Zendesk). Optional tools can wait until after launch.",
    link: "/scenario-2/integrations",
  },
  {
    icon: BookOpen,
    label: "Prepare knowledge base",
    time: "20-30 min",
    description: "Import your help articles, FAQs, and product info. Alhena reviews them for gaps and conflicts.",
    tip: "Don't worry about perfection. Alhena flags issues and suggests improvements automatically.",
    link: "/scenario-2/knowledge",
  },
  {
    icon: Users,
    label: "Invite your team",
    time: "5 min",
    description: "Add team members who'll monitor Alhena, review escalations, and track performance.",
    tip: "At minimum, invite your CX lead and a VP-level stakeholder for dashboard access.",
    link: "/scenario-2/team",
  },
  {
    icon: Sparkles,
    label: "Configure AI behavior",
    time: "5-10 min",
    description: "Choose your AI's tone, escalation rules, and confidence thresholds in Settings.",
    tip: "Start with Conservative escalation and Friendly tone. You can always adjust after seeing real conversations.",
    link: "/scenario-2/settings",
  },
  {
    icon: Rocket,
    label: "Launch",
    time: "Instant",
    description: "Once all steps are green on Launch Readiness, flip the switch and Alhena goes live.",
    tip: "Alhena starts in shadow mode for the first 24 hours, showing what it would have said without actually responding.",
    link: "/scenario-2",
  },
];

interface FaqItem {
  question: string;
  answer: string;
}

const onboardingFaqs: FaqItem[] = [
  {
    question: "How long does the full setup take?",
    answer:
      "Most teams complete onboarding in 2-4 hours spread over a few days. Integrations take 10-15 minutes each, the knowledge base review depends on your content volume (Alhena does the heavy lifting), and team invites are instant. You don't need to do it all at once.",
  },
  {
    question: "Can I launch before completing every step?",
    answer:
      "Integrations and knowledge base are required. Team invites are strongly recommended but won't block launch. Settings have smart defaults, so you can launch and adjust later. The Launch Readiness page shows exactly what's blocking.",
  },
  {
    question: "What happens during the first 24 hours after launch?",
    answer:
      "Alhena runs in shadow mode - it processes every incoming conversation and shows you what it would have said, but doesn't actually respond to customers. This lets you review its responses, adjust tone and accuracy, and build confidence before going fully live.",
  },
  {
    question: "What if Alhena gives a wrong answer to a customer?",
    answer:
      "Alhena shows a confidence level for every response. When confidence is low, it automatically escalates to a human agent instead of guessing. You can also set escalation rules in Settings to be more conservative. Any wrong answer gets flagged and corrected in the knowledge base.",
  },
  {
    question: "Can I disconnect or pause Alhena after launch?",
    answer:
      "Yes. You can pause Alhena at any time from the dashboard, which immediately routes all conversations to your human team. No data is lost. You can also reduce AI involvement to specific channels or topics rather than a full pause.",
  },
  {
    question: "How does Alhena handle sensitive customer data?",
    answer:
      "All data is encrypted in transit and at rest. Customer conversations are stored in your dedicated tenant and never shared across accounts. Alhena follows SOC 2 Type II and GDPR compliance standards. You control data retention and can request full deletion.",
  },
];

const glossaryTerms = [
  { term: "Resolution rate", definition: "Percentage of conversations fully resolved by AI without human intervention" },
  { term: "Escalation", definition: "When AI hands a conversation to a human agent due to complexity, low confidence, or customer request" },
  { term: "Confidence level", definition: "How sure Alhena is about its response (high, medium, low). Low-confidence responses are flagged or escalated." },
  { term: "Shadow mode", definition: "First 24 hours after launch where Alhena processes but doesn't respond, letting you review before going live" },
  { term: "Knowledge base", definition: "Your collection of help articles, FAQs, and product information that Alhena uses to answer questions" },
  { term: "AI-influenced revenue", definition: "Revenue from orders where Alhena played a role through recommendations, nudges, or support resolution" },
  { term: "CSAT", definition: "Customer Satisfaction Score from post-interaction surveys, typically on a 1-5 scale converted to percentage" },
  { term: "Deflection rate", definition: "Percentage of potential support tickets prevented because AI resolved the issue first" },
];

export function Scenario2HelpPage() {
  const navigate = useNavigate();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAllGlossary, setShowAllGlossary] = useState(false);

  const filteredFaqs = searchQuery
    ? onboardingFaqs.filter(
        (f) =>
          f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : onboardingFaqs;

  const visibleGlossary = showAllGlossary ? glossaryTerms : glossaryTerms.slice(0, 4);

  return (
    <div className="space-y-6">
      <TopBar
        title="Help"
        subtitle="Everything you need to get Bloom & Co set up on Alhena"
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

      {/* Getting started guide */}
      <CollapsibleSection title="Getting started">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-surface-100 flex items-center gap-2">
            <Rocket size={16} className="text-alhena-500" />
            <span className="text-sm font-semibold text-surface-800">Your path to launch</span>
            <span className="text-xs text-surface-500 ml-auto flex items-center gap-1">
              <Clock size={12} />
              Total: 2-4 hours
            </span>
          </div>

          <div className="divide-y divide-surface-100">
            {onboardingSteps.map((step, i) => (
              <button
                key={step.label}
                onClick={() => navigate(step.link)}
                className="w-full px-5 py-4 flex items-start gap-4 text-left hover:bg-surface-50/60 transition-colors group"
              >
                <div className="flex items-center gap-3 shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-surface-400 w-5 text-center">
                    {i + 1}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-alhena-50 flex items-center justify-center group-hover:bg-alhena-100 transition-colors">
                    <step.icon size={16} className="text-alhena-600" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-surface-900">
                      {step.label}
                    </span>
                    <span className="text-xs text-surface-500 flex items-center gap-1">
                      <Clock size={11} />
                      {step.time}
                    </span>
                  </div>
                  <p className="text-xs text-surface-600 mb-1.5">{step.description}</p>
                  <p className="text-xs text-alhena-600 flex items-center gap-1">
                    <Zap size={11} className="shrink-0" />
                    {step.tip}
                  </p>
                </div>
                <ArrowRight size={16} className="text-surface-300 group-hover:text-alhena-500 transition-colors shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </motion.div>
      </CollapsibleSection>

      {/* Onboarding FAQ */}
      <CollapsibleSection title="Common questions">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
                    <HelpCircle size={16} className="text-surface-400 shrink-0 mt-0.5" />
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
                        <div className="px-5 pb-4 pt-0 pl-[3.25rem]">
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
                  No matching questions. Try a different search term.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </CollapsibleSection>

      {/* What to expect timeline */}
      <CollapsibleSection title="What to expect after launch">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
        >
          <div className="divide-y divide-surface-100">
            {[
              {
                period: "Day 1",
                icon: Sparkles,
                title: "Shadow mode",
                desc: "Alhena processes conversations without responding. Review its proposed answers and adjust tone.",
                status: "automatic",
              },
              {
                period: "Week 1",
                icon: CheckCircle2,
                title: "First live conversations",
                desc: "Alhena starts responding to customers. Monitor resolution rate and CSAT closely. Your CSM checks in.",
                status: "milestone",
              },
              {
                period: "Week 2-3",
                icon: Zap,
                title: "Optimization",
                desc: "Alhena learns from escalation patterns. Knowledge base gaps get flagged for you to fill. Metrics stabilize.",
                status: "milestone",
              },
              {
                period: "Month 1",
                icon: Calendar,
                title: "First performance review",
                desc: "Your dashboard shows ROI data: revenue influenced, tickets deflected, and time saved. Share with leadership.",
                status: "milestone",
              },
            ].map((phase, i) => (
              <div key={phase.period} className="px-5 py-4 flex items-start gap-4">
                <div className="shrink-0 text-center w-16">
                  <span className="text-xs font-bold uppercase tracking-wider text-alhena-600">
                    {phase.period}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-lg bg-alhena-50 flex items-center justify-center shrink-0">
                  <phase.icon size={16} className="text-alhena-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-900">{phase.title}</p>
                  <p className="text-xs text-surface-600 mt-0.5">{phase.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </CollapsibleSection>

      {/* Glossary */}
      <CollapsibleSection title="Glossary">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
        >
          <div className="divide-y divide-surface-100">
            {visibleGlossary.map((item) => (
              <div key={item.term} className="px-5 py-3.5">
                <p className="text-sm font-semibold text-surface-900">{item.term}</p>
                <p className="text-xs text-surface-600 mt-0.5">{item.definition}</p>
              </div>
            ))}
          </div>
          {glossaryTerms.length > 4 && (
            <button
              onClick={() => setShowAllGlossary(!showAllGlossary)}
              className="w-full px-5 py-3 border-t border-surface-100 text-sm font-semibold text-alhena-600 hover:bg-alhena-50/30 transition-colors flex items-center justify-center gap-1"
            >
              {showAllGlossary ? "Show less" : `Show all ${glossaryTerms.length} terms`}
              <motion.span
                animate={{ rotate: showAllGlossary ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={14} />
              </motion.span>
            </button>
          )}
        </motion.div>
      </CollapsibleSection>

      {/* Contact */}
      <CollapsibleSection title="Need help?">
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
                  Your onboarding specialist
                </h3>
                <p className="text-xs text-surface-500">
                  Dedicated to your setup success
                </p>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-surface-700">
                <span className="font-medium">Priya Mehta</span>
              </p>
              <p className="text-sm text-alhena-600">priya.m@alhena.ai</p>
              <p className="text-xs text-surface-500">
                Available Mon-Fri, 9 AM - 6 PM PST. Avg response: 30 min during onboarding.
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
                  Setup documentation
                </h3>
                <p className="text-xs text-surface-500">
                  Step-by-step integration guides
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <button className="text-sm text-alhena-600 hover:text-alhena-700 transition-colors flex items-center gap-1.5">
                docs.alhena.ai/getting-started
                <ExternalLink size={12} />
              </button>
              <p className="text-xs text-surface-500">
                Platform-specific guides for Shopify, Zendesk, Intercom, Gorgias, and more
              </p>
            </div>
          </motion.div>
        </div>
      </CollapsibleSection>
    </div>
  );
}
