import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Check,
  Clock,
  AlertCircle,
  ExternalLink,
  Plug,
  Sparkles,
  Search,
  Loader2,
  Zap,
} from "lucide-react";
import { clsx } from "clsx";
import { TopBar } from "../../components/layout/TopBar";
import { CollapsibleSection } from "../../components/layout/CollapsibleSection";
import { Toast } from "../../components/common/Toast";
import { useToast } from "../../hooks/useToast";
import { useOnboarding, type IntegrationStatus } from "../../context/OnboardingContext";

const statusConfig: Record<
  IntegrationStatus,
  { label: string; color: string; bg: string; border: string; icon: typeof Check }
> = {
  connected: {
    label: "Connected",
    color: "text-success-600",
    bg: "bg-success-50",
    border: "border-success-200",
    icon: Check,
  },
  pending: {
    label: "Pending",
    color: "text-warning-600",
    bg: "bg-warning-50",
    border: "border-warning-200",
    icon: Clock,
  },
  not_connected: {
    label: "Not connected",
    color: "text-surface-600",
    bg: "bg-surface-0",
    border: "border-surface-200",
    icon: Plug,
  },
  error: {
    label: "Error",
    color: "text-danger-600",
    bg: "bg-danger-50",
    border: "border-danger-200",
    icon: AlertCircle,
  },
};

type ScanPhase = "idle" | "scanning" | "found" | "done";

interface DetectedTool {
  name: string;
  logo: string;
  category: string;
  confidence: string;
  signal: string;
}

const detectedTools: DetectedTool[] = [
  { name: "Shopify", logo: "S", category: "Ecommerce", confidence: "High", signal: "Detected via storefront scripts and product API" },
  { name: "Zendesk", logo: "Z", category: "Help Desk", confidence: "High", signal: "Found Zendesk widget on your domain" },
  { name: "Google Analytics 4", logo: "G", category: "Analytics", confidence: "Medium", signal: "GA4 tag detected, property access needed" },
  { name: "Klaviyo", logo: "K", category: "Email / CRM", confidence: "Low", signal: "Klaviyo tracking pixel found on checkout page" },
];

export function IntegrationsPage() {
  const toast = useToast();
  const { integrations, connectIntegration, completeIntegration } = useOnboarding();
  const [scanPhase, setScanPhase] = useState<ScanPhase>("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [showDetected, setShowDetected] = useState(false);

  const required = integrations.filter((i) => i.required).length;
  const requiredConnected = integrations.filter(
    (i) => i.required && i.status === "connected"
  ).length;

  const handleConnect = (id: string) => {
    const integ = integrations.find((i) => i.id === id);
    if (!integ) return;

    toast.show(`Connecting ${integ.name}...`);
    setTimeout(() => {
      connectIntegration(id);
      toast.show(`${integ.name} connected successfully`);
    }, 1500);
  };

  const handleComplete = (id: string) => {
    const integ = integrations.find((i) => i.id === id);
    if (!integ) return;

    toast.show(`Completing ${integ.name} setup...`);
    setTimeout(() => {
      completeIntegration(id);
      toast.show(`${integ.name} connected successfully`);
    }, 1200);
  };

  const handleScan = () => {
    setScanPhase("scanning");
    setScanProgress(0);

    const steps = [
      { progress: 20, delay: 600 },
      { progress: 45, delay: 1200 },
      { progress: 70, delay: 1800 },
      { progress: 90, delay: 2400 },
      { progress: 100, delay: 2800 },
    ];

    steps.forEach(({ progress, delay }) => {
      setTimeout(() => setScanProgress(progress), delay);
    });

    setTimeout(() => {
      setScanPhase("found");
      setShowDetected(true);
    }, 3200);
  };

  const handleConnectDetected = (tool: DetectedTool) => {
    const match = integrations.find(
      (i) => i.name.toLowerCase() === tool.name.toLowerCase()
    );
    if (match) {
      handleConnect(match.id);
    } else {
      toast.show(`${tool.name} added to your integrations`);
    }
  };

  const handleDismissScan = () => {
    setScanPhase("done");
    setShowDetected(false);
  };

  return (
    <div className="space-y-6">
      <TopBar
        title="Integrations"
        subtitle="Connect the data sources that power your Alhena experience"
        showActions={false}
      />

      {/* AI Scan card */}
      <AnimatePresence>
        {scanPhase !== "done" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className={clsx(
              "rounded-2xl border overflow-hidden",
              scanPhase === "idle"
                ? "bg-gradient-to-r from-alhena-50 to-surface-0 border-alhena-200"
                : scanPhase === "scanning"
                  ? "bg-alhena-50 border-alhena-200"
                  : "bg-surface-0 border-alhena-200"
            )}
          >
            {scanPhase === "idle" && (
              <div className="px-6 py-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-alhena-500 flex items-center justify-center shrink-0">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-surface-900 mb-0.5">
                    Auto-detect your integrations
                  </h3>
                  <p className="text-sm text-surface-600">
                    Alhena AI can scan your domain to find tools you already use and suggest connections automatically.
                  </p>
                </div>
                <button
                  onClick={handleScan}
                  className="px-5 py-2.5 rounded-full bg-alhena-500 text-white text-sm font-semibold hover:bg-alhena-600 transition-colors flex items-center gap-2 shrink-0"
                >
                  <Search size={14} />
                  Scan my site
                </button>
              </div>
            )}

            {scanPhase === "scanning" && (
              <div className="px-6 py-5">
                <div className="flex items-center gap-3 mb-3">
                  <Loader2 size={16} className="text-alhena-500 animate-spin" />
                  <p className="text-sm font-semibold text-alhena-800">
                    Scanning bloomandco.com...
                  </p>
                </div>
                <div className="h-2 bg-alhena-100 rounded-full overflow-hidden mb-2">
                  <motion.div
                    className="h-full bg-alhena-500 rounded-full"
                    animate={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <p className="text-xs text-alhena-600">
                  {scanProgress < 30
                    ? "Checking storefront scripts..."
                    : scanProgress < 60
                      ? "Detecting analytics and tracking tags..."
                      : scanProgress < 90
                        ? "Identifying help desk and CRM tools..."
                        : "Finalizing results..."}
                </p>
              </div>
            )}

            {scanPhase === "found" && showDetected && (
              <div>
                <div className="px-6 py-4 border-b border-alhena-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success-500 flex items-center justify-center">
                    <Zap size={14} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-surface-900">
                      {detectedTools.length} tools detected on your site
                    </p>
                    <p className="text-xs text-surface-600">
                      Click to connect any detected integration
                    </p>
                  </div>
                  <button
                    onClick={handleDismissScan}
                    className="text-xs text-surface-500 hover:text-surface-700 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
                <div className="divide-y divide-surface-100">
                  {detectedTools.map((tool, i) => {
                    const alreadyConnected = integrations.some(
                      (ig) =>
                        ig.name.toLowerCase() === tool.name.toLowerCase() &&
                        ig.status === "connected"
                    );
                    return (
                      <motion.div
                        key={tool.name}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="px-6 py-3 flex items-center gap-3"
                      >
                        <div className="w-7 h-7 rounded-md bg-surface-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          {tool.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-surface-900">
                              {tool.name}
                            </span>
                            <span className="text-xs text-surface-500">{tool.category}</span>
                          </div>
                          <p className="text-xs text-surface-500">{tool.signal}</p>
                        </div>
                        <span
                          className={clsx(
                            "text-xs font-medium px-2 py-0.5 rounded-full shrink-0",
                            tool.confidence === "High" && "bg-success-50 text-success-700",
                            tool.confidence === "Medium" && "bg-warning-50 text-warning-700",
                            tool.confidence === "Low" && "bg-surface-100 text-surface-600"
                          )}
                        >
                          {tool.confidence}
                        </span>
                        {alreadyConnected ? (
                          <span className="text-xs font-medium text-success-600 flex items-center gap-1 shrink-0">
                            <Check size={12} />
                            Connected
                          </span>
                        ) : (
                          <button
                            onClick={() => handleConnectDetected(tool)}
                            className="px-3.5 py-1.5 rounded-full bg-alhena-500 text-white text-xs font-semibold hover:bg-alhena-600 transition-colors shrink-0"
                          >
                            Connect
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact progress indicator */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-0 rounded-2xl border border-surface-200 px-5 py-4 flex items-center gap-4"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-surface-900">
            {requiredConnected} of {required} required integrations connected
          </p>
        </div>
        <div className="w-48 shrink-0">
          <div className="h-2 rounded-full bg-surface-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-alhena-500 transition-all duration-500"
              style={{ width: `${(requiredConnected / required) * 100}%` }}
            />
          </div>
        </div>
        {requiredConnected < required && (
          <p className="text-xs text-warning-600 font-medium shrink-0">
            {required - requiredConnected} remaining
          </p>
        )}
        {requiredConnected === required && (
          <p className="text-xs text-success-600 font-medium shrink-0 flex items-center gap-1">
            <Check size={12} />
            Ready to launch
          </p>
        )}
      </motion.div>

      {/* Required integrations - table-like rows */}
      <CollapsibleSection title="Required integrations">
        <div className="bg-surface-0 rounded-2xl border border-surface-200 divide-y divide-surface-100">
          {integrations
            .filter((i) => i.required)
            .map((integ, i) => {
              const config = statusConfig[integ.status];
              const StatusIcon = config.icon;
              return (
                <motion.div
                  key={integ.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    {integ.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-surface-900">
                        {integ.name}
                      </h4>
                      <span className="text-xs text-surface-500">
                        {integ.category}
                      </span>
                    </div>
                    <p className="text-xs text-surface-500 truncate">
                      {integ.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={clsx(
                        "flex items-center gap-1 text-xs font-medium",
                        config.color
                      )}
                    >
                      <StatusIcon size={13} />
                      {config.label}
                    </span>
                    {integ.status === "connected" && integ.connectedAt && (
                      <span className="text-xs text-surface-400">
                        {integ.connectedAt}
                      </span>
                    )}
                    {integ.status === "not_connected" && (
                      <button
                        onClick={() => handleConnect(integ.id)}
                        className="px-3.5 py-1.5 rounded-full bg-alhena-500 text-white text-xs font-semibold hover:bg-alhena-600 transition-colors"
                      >
                        Connect
                      </button>
                    )}
                    {integ.status === "pending" && (
                      <button
                        onClick={() => handleComplete(integ.id)}
                        className="px-3.5 py-1.5 rounded-full bg-warning-500 text-white text-xs font-semibold hover:bg-warning-600 transition-colors"
                      >
                        Complete setup
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
        </div>
      </CollapsibleSection>

      {/* Optional integrations - secondary list (hide connected ones) */}
      {integrations.filter((i) => !i.required && i.status !== "connected").length > 0 && (
      <CollapsibleSection title="Optional integrations">
        <div className="grid grid-cols-2 gap-3">
          {integrations
            .filter((i) => !i.required && i.status !== "connected")
            .map((integ, i) => (
              <motion.div
                key={integ.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="bg-surface-0 rounded-2xl border border-surface-150 px-4 py-3 hover:border-surface-300 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-surface-100 text-surface-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {integ.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-surface-800">
                      {integ.name}
                    </h4>
                    <p className="text-xs text-surface-500 truncate">
                      {integ.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleConnect(integ.id)}
                    className="text-xs font-semibold text-alhena-500 hover:text-alhena-600 flex items-center gap-1 transition-colors shrink-0"
                  >
                    Connect
                    <ExternalLink size={11} />
                  </button>
                </div>
              </motion.div>
            ))}
        </div>
      </CollapsibleSection>
      )}

      <Toast message={toast.message} visible={toast.visible} onClose={toast.hide} />
    </div>
  );
}
