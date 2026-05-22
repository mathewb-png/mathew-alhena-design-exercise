import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Globe,
  Clock,
  Sparkles,
  MessageSquare,
  Shield,
  Check,
  AlertTriangle,
  Eye,
  Lock,
  Database,
  Bell,
  Mail,
} from "lucide-react";
import { clsx } from "clsx";
import { TopBar } from "../../components/layout/TopBar";
import { CollapsibleSection } from "../../components/layout/CollapsibleSection";
import { Toast } from "../../components/common/Toast";
import { useToast } from "../../hooks/useToast";
import { useOnboarding } from "../../context/OnboardingContext";

type Tone = "professional" | "friendly" | "concise";
type EscalationMode = "conservative" | "balanced" | "aggressive";

export function Scenario2SettingsPage() {
  const toast = useToast();
  const location = useLocation();
  const { setBrandVoiceConfigured, setAiBehaviorsConfigured } = useOnboarding();

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (!hash) return;
    const timeout = setTimeout(() => {
      const el = sectionRefs.current[hash];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setHighlightedSection(hash);
        setTimeout(() => setHighlightedSection(null), 2500);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [location.hash]);

  const [industry, setIndustry] = useState("ecommerce");
  const [timezone, setTimezone] = useState("us-pacific");
  const [businessHours, setBusinessHours] = useState("9-17");
  const [language, setLanguage] = useState("en");

  const [tone, setTone] = useState<Tone>("friendly");
  const [escalationMode, setEscalationMode] = useState<EscalationMode>("balanced");

  const [consentAnalytics, setConsentAnalytics] = useState(true);
  const [consentTraining, setConsentTraining] = useState(false);
  const [consentThirdParty, setConsentThirdParty] = useState(false);

  const [emailOnboarding, setEmailOnboarding] = useState(true);
  const [emailLaunch, setEmailLaunch] = useState(true);

  const handleSave = (section: string) => {
    toast.show(`${section} saved`);
  };

  const toneOptions = [
    {
      value: "professional" as const,
      label: "Professional",
      example: '"Thank you for reaching out. I\'d be happy to assist with your order."',
      desc: "Formal, polished tone for enterprise and B2B",
    },
    {
      value: "friendly" as const,
      label: "Friendly",
      example: '"Hey! Let me help you with that. Here\'s what I found about your order."',
      desc: "Warm and approachable for DTC and lifestyle brands",
    },
    {
      value: "concise" as const,
      label: "Concise",
      example: '"Your order #4521 ships tomorrow. Tracking link will be emailed."',
      desc: "Brief and direct for high-volume support",
    },
  ];

  const escalationOptions = [
    {
      value: "conservative" as const,
      label: "Conservative",
      icon: Shield,
      desc: "Hand off to a human at the first sign of complexity or frustration. Best for new deployments.",
      detail: "Escalation rate: ~40-50%",
    },
    {
      value: "balanced" as const,
      label: "Balanced",
      icon: Sparkles,
      desc: "AI attempts resolution for most issues, escalates when confidence is low or sentiment is negative.",
      detail: "Escalation rate: ~20-30%",
    },
    {
      value: "aggressive" as const,
      label: "Maximum AI",
      icon: MessageSquare,
      desc: "AI handles almost everything, only escalates for billing disputes and account deletion requests.",
      detail: "Escalation rate: ~8-15%",
    },
  ];

  return (
    <div className="space-y-6">
      <TopBar
        title="Settings"
        subtitle="Configure Alhena for Bloom & Co before launch"
        showActions={false}
      />

      {/* Setup progress note */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-alhena-200 bg-alhena-50/40 px-5 py-4 flex items-start gap-3"
      >
        <Sparkles size={18} className="text-alhena-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-surface-900">These settings shape your AI before launch</p>
          <p className="text-xs text-surface-600 mt-0.5">
            You can change any of these after launch too. We recommend starting with the defaults and adjusting based on real conversation data.
          </p>
        </div>
      </motion.div>

      {/* Company profile */}
      <div ref={(el) => { sectionRefs.current["company-profile"] = el; }} id="company-profile" className={clsx("rounded-2xl transition-shadow duration-500", highlightedSection === "company-profile" && "shadow-[0_0_0_2px_rgba(99,146,234,0.4)]")}>
      <CollapsibleSection title="Company profile">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-surface-100 flex items-center gap-3">
            <Building2 size={16} className="text-surface-500" />
            <p className="text-sm font-semibold text-surface-800">Bloom & Co</p>
            <span className="text-xs text-surface-500 ml-auto">Account ID: bloom-co-a7x9k2</span>
          </div>

          <div className="divide-y divide-surface-100">
            <div className="px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 size={14} className="text-surface-400" />
                <span className="text-sm text-surface-700">Industry vertical</span>
              </div>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="px-3 py-1.5 rounded-full border border-surface-200 text-sm text-surface-700 bg-surface-0 cursor-pointer focus:outline-none focus:border-alhena-300"
              >
                <option value="ecommerce">Ecommerce / DTC</option>
                <option value="saas">SaaS / Software</option>
                <option value="fintech">Fintech</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe size={14} className="text-surface-400" />
                <span className="text-sm text-surface-700">Timezone</span>
              </div>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="px-3 py-1.5 rounded-full border border-surface-200 text-sm text-surface-700 bg-surface-0 cursor-pointer focus:outline-none focus:border-alhena-300"
              >
                <option value="us-eastern">US/Eastern (EDT)</option>
                <option value="us-central">US/Central (CDT)</option>
                <option value="us-pacific">US/Pacific (PDT)</option>
                <option value="europe-london">Europe/London (BST)</option>
                <option value="asia-tokyo">Asia/Tokyo (JST)</option>
              </select>
            </div>
            <div className="px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-surface-400" />
                <span className="text-sm text-surface-700">Business hours</span>
              </div>
              <select
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                className="px-3 py-1.5 rounded-full border border-surface-200 text-sm text-surface-700 bg-surface-0 cursor-pointer focus:outline-none focus:border-alhena-300"
              >
                <option value="9-17">9 AM - 5 PM</option>
                <option value="8-20">8 AM - 8 PM</option>
                <option value="24-7">24/7</option>
              </select>
            </div>
            <div className="px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare size={14} className="text-surface-400" />
                <span className="text-sm text-surface-700">Primary language</span>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1.5 rounded-full border border-surface-200 text-sm text-surface-700 bg-surface-0 cursor-pointer focus:outline-none focus:border-alhena-300"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </div>

          <div className="px-5 py-3 border-t border-surface-100 bg-surface-50/50 flex justify-end">
            <button
              onClick={() => handleSave("Company profile")}
              className="px-4 py-2 rounded-full bg-alhena-500 text-white text-sm font-semibold hover:bg-alhena-600 transition-colors flex items-center gap-1.5"
            >
              <Check size={14} />
              Save
            </button>
          </div>
        </motion.div>
      </CollapsibleSection>
      </div>

      {/* AI Personality */}
      <div ref={(el) => { sectionRefs.current["ai-personality"] = el; }} id="ai-personality" className={clsx("rounded-2xl transition-shadow duration-500", highlightedSection === "ai-personality" && "shadow-[0_0_0_2px_rgba(99,146,234,0.4)]")}>
      <CollapsibleSection title="AI personality">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-surface-100">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-surface-500" />
              <p className="text-sm font-semibold text-surface-800">How should Alhena sound to your customers?</p>
            </div>
            <p className="text-xs text-surface-500">
              This affects the tone and style of all AI-generated responses
            </p>
          </div>

          <div className="p-5 space-y-3">
            {toneOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTone(opt.value)}
                className={clsx(
                  "w-full rounded-xl border p-4 text-left transition-all",
                  tone === opt.value
                    ? "border-alhena-300 bg-alhena-50/40 ring-1 ring-alhena-200"
                    : "border-surface-200 hover:border-surface-300"
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={clsx("text-sm font-semibold", tone === opt.value ? "text-alhena-700" : "text-surface-800")}>
                    {opt.label}
                  </span>
                  <span className="text-xs text-surface-500">{opt.desc}</span>
                </div>
                <p className="text-sm text-surface-600 italic bg-surface-50 rounded-lg px-3 py-2">
                  {opt.example}
                </p>
              </button>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-surface-100 bg-surface-50/50 flex justify-end">
            <button
              onClick={() => {
                setBrandVoiceConfigured(true);
                handleSave("AI personality");
              }}
              className="px-4 py-2 rounded-full bg-alhena-500 text-white text-sm font-semibold hover:bg-alhena-600 transition-colors flex items-center gap-1.5"
            >
              <Check size={14} />
              Save
            </button>
          </div>
        </motion.div>
      </CollapsibleSection>
      </div>

      {/* Escalation rules */}
      <div ref={(el) => { sectionRefs.current["escalation-behavior"] = el; }} id="escalation-behavior" className={clsx("rounded-2xl transition-shadow duration-500", highlightedSection === "escalation-behavior" && "shadow-[0_0_0_2px_rgba(99,146,234,0.4)]")}>
      <CollapsibleSection title="Escalation behavior">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-surface-100">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={16} className="text-surface-500" />
              <p className="text-sm font-semibold text-surface-800">When should AI hand off to your team?</p>
            </div>
            <p className="text-xs text-surface-500">
              Controls how aggressively Alhena tries to resolve conversations before escalating
            </p>
          </div>

          <div className="p-5 space-y-3">
            {escalationOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setEscalationMode(opt.value)}
                className={clsx(
                  "w-full rounded-xl border p-4 text-left transition-all flex items-start gap-4",
                  escalationMode === opt.value
                    ? "border-alhena-300 bg-alhena-50/40 ring-1 ring-alhena-200"
                    : "border-surface-200 hover:border-surface-300"
                )}
              >
                <div
                  className={clsx(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                    escalationMode === opt.value ? "bg-alhena-500 text-white" : "bg-surface-100 text-surface-500"
                  )}
                >
                  <opt.icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={clsx("text-sm font-semibold", escalationMode === opt.value ? "text-alhena-700" : "text-surface-800")}>
                      {opt.label}
                    </span>
                    <span className="text-xs text-surface-500">{opt.detail}</span>
                  </div>
                  <p className="text-xs text-surface-600">{opt.desc}</p>
                </div>
                {escalationMode === opt.value && (
                  <Check size={16} className="text-alhena-500 shrink-0 mt-1" />
                )}
              </button>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-surface-100 bg-surface-50/50 flex items-center justify-between">
            <p className="text-xs text-surface-500">
              We recommend <strong className="text-surface-700">Conservative</strong> for new accounts to build trust with your team
            </p>
            <button
              onClick={() => {
                setAiBehaviorsConfigured(true);
                handleSave("Escalation behavior");
              }}
              className="px-4 py-2 rounded-full bg-alhena-500 text-white text-sm font-semibold hover:bg-alhena-600 transition-colors flex items-center gap-1.5"
            >
              <Check size={14} />
              Save
            </button>
          </div>
        </motion.div>
      </CollapsibleSection>
      </div>

      {/* Notifications during onboarding */}
      <div ref={(el) => { sectionRefs.current["onboarding-notifications"] = el; }} id="onboarding-notifications" className={clsx("rounded-2xl transition-shadow duration-500", highlightedSection === "onboarding-notifications" && "shadow-[0_0_0_2px_rgba(99,146,234,0.4)]")}>
      <CollapsibleSection title="Onboarding notifications">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-surface-100 flex items-center gap-2">
            <Bell size={16} className="text-surface-500" />
            <p className="text-sm font-semibold text-surface-800">Stay informed during setup</p>
          </div>
          <div className="divide-y divide-surface-100">
            <ToggleRow
              label="Onboarding progress emails"
              description="Weekly summary of your setup progress and next steps"
              checked={emailOnboarding}
              onChange={setEmailOnboarding}
            />
            <ToggleRow
              label="Launch readiness alert"
              description="Get notified when your account is ready to go live"
              checked={emailLaunch}
              onChange={setEmailLaunch}
            />
          </div>
        </motion.div>
      </CollapsibleSection>
      </div>

      {/* Privacy & data */}
      <div ref={(el) => { sectionRefs.current["privacy-data"] = el; }} id="privacy-data" className={clsx("rounded-2xl transition-shadow duration-500", highlightedSection === "privacy-data" && "shadow-[0_0_0_2px_rgba(99,146,234,0.4)]")}>
      <CollapsibleSection title="Privacy & data access">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-surface-100">
            <div className="flex items-center gap-2 mb-1">
              <Lock size={16} className="text-surface-500" />
              <p className="text-sm font-semibold text-surface-800">Control what Alhena can access</p>
            </div>
            <p className="text-xs text-surface-500">
              All data is encrypted in transit and at rest. Alhena never shares raw customer data.
            </p>
          </div>

          <div className="divide-y divide-surface-100">
            <div className="px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye size={14} className="text-surface-400" />
                <div>
                  <p className="text-sm font-medium text-surface-800">Customer conversation data</p>
                  <p className="text-xs text-surface-500">Required for AI to respond to customers</p>
                </div>
              </div>
              <span className="text-xs font-medium text-alhena-600 bg-alhena-50 px-2.5 py-1 rounded-full">
                Required
              </span>
            </div>
            <ToggleRow
              label="Usage analytics"
              description="Help Alhena understand how customers interact with your store to improve recommendations"
              checked={consentAnalytics}
              onChange={setConsentAnalytics}
            />
            <ToggleRow
              label="Model training contribution"
              description="Allow anonymized conversation patterns to improve Alhena's AI for all customers"
              checked={consentTraining}
              onChange={setConsentTraining}
            />
            <ToggleRow
              label="Third-party enrichment"
              description="Allow Alhena to cross-reference with external data sources for deeper insights"
              checked={consentThirdParty}
              onChange={setConsentThirdParty}
            />
          </div>

          <div className="px-5 py-3.5 border-t border-surface-100 bg-surface-50/50 flex items-center gap-3">
            <Database size={14} className="text-surface-400" />
            <p className="text-xs text-surface-500">
              Your data is stored in a dedicated tenant. You can request full deletion at any time after launch.
            </p>
          </div>
        </motion.div>
      </CollapsibleSection>
      </div>

      <Toast message={toast.message} visible={toast.visible} onClose={toast.hide} />
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="px-5 py-3.5 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-surface-800">{label}</p>
        <p className="text-xs text-surface-500">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative w-10 h-[22px] rounded-full transition-colors shrink-0",
          checked ? "bg-alhena-500" : "bg-surface-300"
        )}
      >
        <span
          className={clsx(
            "absolute top-[3px] w-4 h-4 rounded-full bg-surface-0 shadow-sm transition-transform",
            checked ? "left-[22px]" : "left-[3px]"
          )}
        />
      </button>
    </div>
  );
}
