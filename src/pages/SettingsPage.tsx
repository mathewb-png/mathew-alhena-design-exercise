import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Sparkles,
  FileBarChart,
  Shield,
  Check,
  Globe,
  Clock,
  Mail,
  AlertTriangle,
  Zap,
  BarChart3,
  Download,
  Calendar,
  Trash2,
} from "lucide-react";
import { clsx } from "clsx";
import { TopBar } from "../components/layout/TopBar";
import { CollapsibleSection } from "../components/layout/CollapsibleSection";
import { Toast } from "../components/common/Toast";
import { useToast } from "../hooks/useToast";

type AlertLevel = "critical" | "high" | "all";
type DigestFreq = "daily" | "weekly" | "off";
type Period = "7d" | "30d" | "90d";

export function SettingsPage() {
  const toast = useToast();

  const [alertLevel, setAlertLevel] = useState<AlertLevel>("high");
  const [digestFreq, setDigestFreq] = useState<DigestFreq>("weekly");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);

  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [autoResolve, setAutoResolve] = useState(true);
  const [showLowConfidence, setShowLowConfidence] = useState(true);

  const [defaultPeriod, setDefaultPeriod] = useState<Period>("30d");
  const [scheduledReport, setScheduledReport] = useState(true);
  const [reportDay, setReportDay] = useState("monday");

  const handleSave = (section: string) => {
    toast.show(`${section} saved`);
  };

  return (
    <div className="space-y-6">
      <TopBar
        title="Settings"
        subtitle="Configure your Alhena experience for Acme Commerce"
        showActions={false}
      />

      {/* Account overview */}
      <CollapsibleSection title="Account">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
        >
          <div className="divide-y divide-surface-100">
            <div className="px-5 py-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-alhena-50 flex items-center justify-center shrink-0">
                <User size={18} className="text-alhena-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-surface-900">Sarah Chen</p>
                <p className="text-xs text-surface-500">VP of Ecommerce, Acme Commerce</p>
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-alhena-700 bg-alhena-50 px-2.5 py-1 rounded-full">
                Admin
              </span>
            </div>
            <div className="px-5 py-3 flex items-center gap-3">
              <Globe size={16} className="text-surface-400 shrink-0" />
              <span className="text-sm text-surface-700 flex-1">Timezone</span>
              <span className="text-sm text-surface-900 font-medium">US/Pacific (PDT)</span>
            </div>
            <div className="px-5 py-3 flex items-center gap-3">
              <Mail size={16} className="text-surface-400 shrink-0" />
              <span className="text-sm text-surface-700 flex-1">Email</span>
              <span className="text-sm text-surface-900 font-medium">s.chen@acmecommerce.com</span>
            </div>
            <div className="px-5 py-3 flex items-center gap-3">
              <Clock size={16} className="text-surface-400 shrink-0" />
              <span className="text-sm text-surface-700 flex-1">Account active since</span>
              <span className="text-sm text-surface-900 font-medium">March 2025</span>
            </div>
          </div>
        </motion.div>
      </CollapsibleSection>

      {/* Notifications */}
      <CollapsibleSection title="Notifications">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-surface-100">
            <div className="flex items-center gap-2 mb-1">
              <Bell size={16} className="text-surface-500" />
              <p className="text-sm font-semibold text-surface-800">Alert threshold</p>
            </div>
            <p className="text-xs text-surface-500">Which alerts show up on your dashboard and trigger notifications</p>
          </div>

          <div className="px-5 py-4 border-b border-surface-100">
            <div className="flex gap-2">
              {(
                [
                  { value: "critical", label: "Critical only", icon: AlertTriangle, desc: "Urgent issues that need immediate action" },
                  { value: "high", label: "High + Critical", icon: Zap, desc: "Important changes and urgent issues" },
                  { value: "all", label: "All alerts", icon: Bell, desc: "Every anomaly, trend change, and content flag" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setAlertLevel(opt.value)}
                  className={clsx(
                    "flex-1 rounded-xl border p-3 text-left transition-all",
                    alertLevel === opt.value
                      ? "border-alhena-300 bg-alhena-50/40 ring-1 ring-alhena-200"
                      : "border-surface-200 hover:border-surface-300"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <opt.icon size={14} className={alertLevel === opt.value ? "text-alhena-600" : "text-surface-400"} />
                    <span className={clsx("text-sm font-semibold", alertLevel === opt.value ? "text-alhena-700" : "text-surface-800")}>
                      {opt.label}
                    </span>
                  </div>
                  <p className="text-xs text-surface-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-surface-100">
            <div className="px-5 py-3.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-800">Email digest</p>
                <p className="text-xs text-surface-500">Receive a summary of alerts and insights</p>
              </div>
              <select
                value={digestFreq}
                onChange={(e) => setDigestFreq(e.target.value as DigestFreq)}
                className="px-3 py-1.5 rounded-full border border-surface-200 text-sm text-surface-700 bg-surface-0 cursor-pointer focus:outline-none focus:border-alhena-300"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="off">Off</option>
              </select>
            </div>
            <ToggleRow
              label="Email notifications"
              description="Get notified via email for alerts above your threshold"
              checked={emailAlerts}
              onChange={setEmailAlerts}
            />
            <ToggleRow
              label="Slack notifications"
              description="Post alerts to your connected Slack channel"
              checked={slackAlerts}
              onChange={setSlackAlerts}
            />
          </div>

          <div className="px-5 py-3 border-t border-surface-100 bg-surface-50/50 flex justify-end">
            <button
              onClick={() => handleSave("Notification preferences")}
              className="px-4 py-2 rounded-full bg-alhena-500 text-white text-sm font-semibold hover:bg-alhena-600 transition-colors flex items-center gap-1.5"
            >
              <Check size={14} />
              Save
            </button>
          </div>
        </motion.div>
      </CollapsibleSection>

      {/* AI Behavior */}
      <CollapsibleSection title="AI behavior">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-surface-100">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-surface-500" />
              <p className="text-sm font-semibold text-surface-800">How Alhena interprets your data</p>
            </div>
            <p className="text-xs text-surface-500">
              These settings affect how insights, anomalies, and recommendations are surfaced
            </p>
          </div>

          <div className="px-5 py-4 border-b border-surface-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-surface-800">Confidence threshold</p>
                <p className="text-xs text-surface-500">Minimum confidence to surface an insight without flagging</p>
              </div>
              <span className="text-sm font-bold text-alhena-600 bg-alhena-50 px-2.5 py-1 rounded-full">
                {confidenceThreshold}%
              </span>
            </div>
            <input
              type="range"
              min={40}
              max={95}
              step={5}
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-surface-200 rounded-full appearance-none cursor-pointer accent-alhena-500"
            />
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-surface-400">More insights (may include noise)</span>
              <span className="text-[10px] text-surface-400">Fewer, higher-quality insights</span>
            </div>
          </div>

          <div className="divide-y divide-surface-100">
            <ToggleRow
              label="Auto-resolve known issues"
              description="Alhena applies fixes for known content gaps without manual approval"
              checked={autoResolve}
              onChange={setAutoResolve}
            />
            <ToggleRow
              label="Show low-confidence insights"
              description="Display insights below threshold with a warning badge"
              checked={showLowConfidence}
              onChange={setShowLowConfidence}
            />
          </div>

          <div className="px-5 py-3 border-t border-surface-100 bg-surface-50/50 flex justify-end">
            <button
              onClick={() => handleSave("AI behavior")}
              className="px-4 py-2 rounded-full bg-alhena-500 text-white text-sm font-semibold hover:bg-alhena-600 transition-colors flex items-center gap-1.5"
            >
              <Check size={14} />
              Save
            </button>
          </div>
        </motion.div>
      </CollapsibleSection>

      {/* Reporting */}
      <CollapsibleSection title="Reporting">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-surface-100">
            <div className="flex items-center gap-2 mb-1">
              <FileBarChart size={16} className="text-surface-500" />
              <p className="text-sm font-semibold text-surface-800">Dashboard & export defaults</p>
            </div>
          </div>

          <div className="divide-y divide-surface-100">
            <div className="px-5 py-3.5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-800">Default time period</p>
                <p className="text-xs text-surface-500">Applied when you open the dashboard</p>
              </div>
              <div className="flex gap-1">
                {(["7d", "30d", "90d"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setDefaultPeriod(p)}
                    className={clsx(
                      "px-3 py-1.5 rounded-full text-xs font-semibold transition-all",
                      defaultPeriod === p
                        ? "bg-alhena-500 text-white"
                        : "bg-surface-100 text-surface-600 hover:bg-surface-200"
                    )}
                  >
                    {p === "7d" ? "7 days" : p === "30d" ? "30 days" : "90 days"}
                  </button>
                ))}
              </div>
            </div>
            <ToggleRow
              label="Scheduled weekly report"
              description="Auto-generate and email a PDF summary each week"
              checked={scheduledReport}
              onChange={setScheduledReport}
            />
            {scheduledReport && (
              <div className="px-5 py-3.5 flex items-center justify-between bg-surface-50/30">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-surface-400" />
                  <p className="text-sm text-surface-700">Report delivered on</p>
                </div>
                <select
                  value={reportDay}
                  onChange={(e) => setReportDay(e.target.value)}
                  className="px-3 py-1.5 rounded-full border border-surface-200 text-sm text-surface-700 bg-surface-0 cursor-pointer focus:outline-none focus:border-alhena-300"
                >
                  <option value="monday">Monday</option>
                  <option value="tuesday">Tuesday</option>
                  <option value="wednesday">Wednesday</option>
                  <option value="thursday">Thursday</option>
                  <option value="friday">Friday</option>
                </select>
              </div>
            )}
          </div>

          <div className="px-5 py-3 border-t border-surface-100 bg-surface-50/50 flex justify-end">
            <button
              onClick={() => handleSave("Reporting preferences")}
              className="px-4 py-2 rounded-full bg-alhena-500 text-white text-sm font-semibold hover:bg-alhena-600 transition-colors flex items-center gap-1.5"
            >
              <Check size={14} />
              Save
            </button>
          </div>
        </motion.div>
      </CollapsibleSection>

      {/* Data & Privacy */}
      <CollapsibleSection title="Data & privacy">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
        >
          <div className="divide-y divide-surface-100">
            <div className="px-5 py-3.5 flex items-center gap-3">
              <Shield size={16} className="text-surface-400 shrink-0" />
              <span className="text-sm text-surface-700 flex-1">Data retention</span>
              <span className="text-sm text-surface-900 font-medium">12 months rolling</span>
            </div>
            <div className="px-5 py-3.5 flex items-center gap-3">
              <BarChart3 size={16} className="text-surface-400 shrink-0" />
              <span className="text-sm text-surface-700 flex-1">Analytics data</span>
              <span className="text-xs font-medium text-success-600 bg-success-50 px-2.5 py-1 rounded-full">
                Anonymized
              </span>
            </div>
            <div className="px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download size={16} className="text-surface-400 shrink-0" />
                <span className="text-sm text-surface-700">Export all account data</span>
              </div>
              <button
                onClick={() => toast.show("Data export started - you'll receive an email when ready")}
                className="px-4 py-1.5 rounded-full border border-surface-200 text-xs font-semibold text-surface-700 hover:bg-surface-50 transition-colors"
              >
                Request export
              </button>
            </div>
            <div className="px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trash2 size={16} className="text-danger-400 shrink-0" />
                <div>
                  <span className="text-sm text-surface-700">Delete account</span>
                  <p className="text-xs text-surface-500">Permanently remove all data. This cannot be undone.</p>
                </div>
              </div>
              <button
                onClick={() => toast.show("Contact support to process account deletion")}
                className="px-4 py-1.5 rounded-full border border-danger-200 text-xs font-semibold text-danger-600 hover:bg-danger-50 transition-colors"
              >
                Contact support
              </button>
            </div>
          </div>
        </motion.div>
      </CollapsibleSection>

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
