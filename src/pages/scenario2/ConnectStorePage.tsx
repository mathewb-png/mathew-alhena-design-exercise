import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  ShieldCheck,
  Package,
  Users,
  ArrowRight,
  Check,
  Loader2,
  Link2,
  Lock,
  RefreshCw,
  ShoppingBag,
  CreditCard,
  BarChart3,
  Eye,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";
import { TopBar } from "../../components/layout/TopBar";
import { Toast } from "../../components/common/Toast";
import { useToast } from "../../hooks/useToast";
import { useOnboarding } from "../../context/OnboardingContext";

type ConnectionPhase = "select" | "idle" | "connecting" | "syncing" | "success";

interface Platform {
  id: string;
  name: string;
  logo: string;
  color: string;
  urlPlaceholder: string;
  urlPattern: RegExp;
  urlHint: string;
  productCount: number;
  collectionCount: number;
  popular?: boolean;
  comingSoon?: boolean;
}

const platforms: Platform[] = [
  {
    id: "shopify",
    name: "Shopify",
    logo: "S",
    color: "bg-[#96bf48]",
    urlPlaceholder: "your-store.myshopify.com",
    urlPattern: /\.myshopify\.com$/i,
    urlHint: "your-store.myshopify.com",
    productCount: 1247,
    collectionCount: 3,
    popular: true,
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    logo: "W",
    color: "bg-[#7f54b3]",
    urlPlaceholder: "your-store.com",
    urlPattern: /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/i,
    urlHint: "your-store.com",
    productCount: 892,
    collectionCount: 5,
    popular: true,
  },
  {
    id: "bigcommerce",
    name: "BigCommerce",
    logo: "B",
    color: "bg-[#121118]",
    urlPlaceholder: "your-store.mybigcommerce.com",
    urlPattern: /\.(mybigcommerce\.com|bigcommerce\.com)$/i,
    urlHint: "your-store.mybigcommerce.com",
    productCount: 1034,
    collectionCount: 4,
    popular: true,
  },
  {
    id: "magento",
    name: "Adobe Commerce",
    logo: "M",
    color: "bg-[#f46f25]",
    urlPlaceholder: "your-store.com",
    urlPattern: /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/i,
    urlHint: "your-store.com",
    productCount: 2156,
    collectionCount: 8,
  },
  {
    id: "salesforce",
    name: "Salesforce Commerce",
    logo: "SF",
    color: "bg-[#00a1e0]",
    urlPlaceholder: "your-instance.commercecloud.salesforce.com",
    urlPattern: /\.(salesforce|demandware)\.com$/i,
    urlHint: "your-instance.commercecloud.salesforce.com",
    productCount: 3420,
    collectionCount: 12,
    comingSoon: true,
  },
  {
    id: "custom",
    name: "Custom / Headless",
    logo: "{}",
    color: "bg-surface-600",
    urlPlaceholder: "api.your-store.com",
    urlPattern: /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/i,
    urlHint: "api.your-store.com",
    productCount: 0,
    collectionCount: 0,
    comingSoon: true,
  },
];

const accessItems = [
  {
    icon: Package,
    label: "Products and collections",
    description: "Product titles, descriptions, images, variants, and pricing",
  },
  {
    icon: CreditCard,
    label: "Orders and transactions",
    description: "Order history, fulfillment status, and refund data",
  },
  {
    icon: Users,
    label: "Customer profiles",
    description: "Names, order history, and lifetime value (no passwords or payment details)",
  },
  {
    icon: BarChart3,
    label: "Store analytics",
    description: "Traffic sources, conversion rates, and sales trends",
  },
];

export function ConnectStorePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { integrations, connectIntegration } = useOnboarding();
  const shopify = integrations.find((i) => i.id === "shopify");
  const alreadyConnected = shopify?.status === "connected";

  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [storeUrl, setStoreUrl] = useState("");
  const [directUrl, setDirectUrl] = useState("");
  const [urlTouched, setUrlTouched] = useState(false);
  const [phase, setPhase] = useState<ConnectionPhase>(
    alreadyConnected ? "success" : "select"
  );
  const [syncCount, setSyncCount] = useState(0);
  const syncTotal = selectedPlatform?.productCount || 1247;

  const isValidDirectUrl =
    directUrl.trim().length > 3 &&
    /^(https?:\/\/)?[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+/i.test(directUrl.trim());

  const isValidUrl =
    storeUrl.trim().length > 0 &&
    selectedPlatform !== null &&
    (selectedPlatform.urlPattern.test(storeUrl.trim()) ||
      /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/i.test(storeUrl.trim()));

  const urlError =
    urlTouched && storeUrl.trim().length > 0 && !isValidUrl && selectedPlatform
      ? `Enter a valid URL (e.g. ${selectedPlatform.urlHint})`
      : null;

  const handleSelectPlatform = (platform: Platform) => {
    if (platform.comingSoon) {
      toast.show(`${platform.name} integration coming soon`);
      return;
    }
    setSelectedPlatform(platform);
    setStoreUrl("");
    setUrlTouched(false);
    setPhase("idle");
  };

  const handleBackToPlatforms = () => {
    setSelectedPlatform(null);
    setStoreUrl("");
    setUrlTouched(false);
    setPhase("select");
  };

  const handleDirectConnect = () => {
    if (!isValidDirectUrl) return;
    const url = directUrl.trim().toLowerCase();
    const matched = platforms.find(
      (p) => !p.comingSoon && p.urlPattern.test(url.replace(/^https?:\/\//, ""))
    );
    const fallback = platforms.find((p) => p.id === "shopify")!;
    const platform = matched || fallback;
    setSelectedPlatform(platform);
    setStoreUrl(url.replace(/^https?:\/\//, ""));
    setPhase("connecting");
    setTimeout(() => setPhase("syncing"), 2000);
  };

  const handleConnect = useCallback(() => {
    if (!isValidUrl || phase !== "idle") return;
    setPhase("connecting");

    setTimeout(() => {
      setPhase("syncing");
    }, 2000);
  }, [isValidUrl, phase]);

  const connectionSteps = selectedPlatform
    ? [
        {
          icon: Link2,
          title: `Enter your ${selectedPlatform.name} URL`,
          description: `Provide your store address so Alhena knows where to connect`,
        },
        {
          icon: ShieldCheck,
          title: "Authorize Alhena",
          description: `Grant read-only access through ${selectedPlatform.name}'s secure OAuth flow`,
        },
        {
          icon: RefreshCw,
          title: "Sync your catalog",
          description: "Alhena imports your products, collections, and order history automatically",
        },
      ]
    : [];

  const connectRef = useRef(connectIntegration);
  connectRef.current = connectIntegration;
  const toastRef = useRef(toast);
  toastRef.current = toast;
  const platformRef = useRef(selectedPlatform);
  platformRef.current = selectedPlatform;

  useEffect(() => {
    if (phase !== "syncing") return;

    let frame: number;
    const start = performance.now();
    const duration = 3000;
    const total = syncTotal;

    function tick() {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setSyncCount(Math.round(eased * total));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        connectRef.current("shopify");
        setPhase("success");
        toastRef.current.show(`${platformRef.current?.name || "Store"} connected successfully`);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase, syncTotal]);

  return (
    <div className="space-y-6">
      <TopBar
        title="Connect your store"
        subtitle="Link your ecommerce store to power Alhena with real product and customer data"
        showActions={false}
      />

      {/* Platform selection */}
      {phase === "select" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-alhena-500 flex items-center justify-center">
              <Store size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-surface-900">
                Choose your ecommerce platform
              </h2>
              <p className="text-sm text-surface-500">
                Select where your store is hosted so Alhena can connect
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
            {platforms.map((platform, i) => (
              <motion.button
                key={platform.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 + i * 0.04 }}
                onClick={() => handleSelectPlatform(platform)}
                disabled={platform.comingSoon}
                className={clsx(
                  "group relative flex items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-all",
                  platform.comingSoon
                    ? "bg-surface-50 border-surface-200 opacity-60 cursor-not-allowed"
                    : "bg-surface-0 border-surface-200 hover:border-alhena-300 hover:shadow-md cursor-pointer"
                )}
              >
                <div
                  className={clsx(
                    "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm",
                    platform.color
                  )}
                >
                  {platform.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-surface-900">
                      {platform.name}
                    </span>
                    {platform.popular && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-alhena-50 text-alhena-700 border border-alhena-200">
                        Popular
                      </span>
                    )}
                    {platform.comingSoon && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-surface-100 text-surface-500">
                        Coming soon
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {platform.comingSoon
                      ? "Integration available soon"
                      : `Connect via ${platform.urlHint}`}
                  </p>
                </div>
                {!platform.comingSoon && (
                  <ChevronRight
                    size={16}
                    className="text-surface-300 group-hover:text-alhena-500 transition-colors shrink-0"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Direct URL option */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-5 rounded-2xl border border-surface-200 bg-surface-0 px-5 py-4"
          >
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide mb-3">
              Or connect directly with your store URL
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={directUrl}
                  onChange={(e) => setDirectUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleDirectConnect();
                  }}
                  placeholder="https://your-store.com"
                  aria-label="Store URL"
                  className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm bg-surface-0 text-surface-900 placeholder:text-surface-400 outline-none transition-all focus:border-alhena-300 focus:ring-2 focus:ring-alhena-100"
                />
              </div>
              <button
                onClick={handleDirectConnect}
                disabled={!isValidDirectUrl}
                className={clsx(
                  "shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all",
                  isValidDirectUrl
                    ? "bg-alhena-500 text-white hover:bg-alhena-600 shadow-sm"
                    : "bg-surface-100 text-surface-400 cursor-not-allowed"
                )}
              >
                <Link2 size={16} />
                Connect
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Hero / status section */}
      {phase !== "select" && (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className={clsx(
          "rounded-2xl border overflow-hidden",
          phase === "success"
            ? "bg-success-50 border-success-200"
            : "bg-gradient-to-br from-alhena-50 via-surface-0 to-surface-0 border-alhena-200"
        )}
      >
        <div className="px-6 py-6 sm:px-8 sm:py-8">
          <AnimatePresence mode="wait">
            {/* Idle / input state */}
            {phase === "idle" && selectedPlatform && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={clsx(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm",
                      selectedPlatform.color
                    )}
                  >
                    {selectedPlatform.logo}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-surface-900">
                      Connect your {selectedPlatform.name} store
                    </h2>
                    <p className="text-sm text-surface-600">
                      This is the foundation for everything Alhena does
                    </p>
                  </div>
                </div>

                <p className="text-sm text-surface-600 mb-6 max-w-xl">
                  When you connect your store, Alhena syncs your product catalog,
                  order history, and customer profiles. This lets the AI give
                  accurate, product-aware answers from day one.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={storeUrl}
                      onChange={(e) => setStoreUrl(e.target.value)}
                      onBlur={() => setUrlTouched(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleConnect();
                      }}
                      placeholder={selectedPlatform.urlPlaceholder}
                      aria-label={`${selectedPlatform.name} store URL`}
                      aria-invalid={!!urlError}
                      className={clsx(
                        "w-full px-4 py-3 rounded-xl border text-sm bg-surface-0 text-surface-900 placeholder:text-surface-400 outline-none transition-all",
                        urlError
                          ? "border-danger-300 ring-2 ring-danger-100"
                          : "border-surface-200 focus:border-alhena-300 focus:ring-2 focus:ring-alhena-100"
                      )}
                    />
                    {urlError && (
                      <p className="text-xs text-danger-600 mt-1.5">{urlError}</p>
                    )}
                  </div>
                  <button
                    onClick={handleConnect}
                    disabled={!isValidUrl}
                    className={clsx(
                      "shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all",
                      isValidUrl
                        ? "bg-alhena-500 text-white hover:bg-alhena-600 shadow-sm"
                        : "bg-surface-100 text-surface-400 cursor-not-allowed"
                    )}
                  >
                    <Store size={16} />
                    Connect store
                  </button>
                </div>

                <button
                  onClick={handleBackToPlatforms}
                  className="mt-4 text-xs text-surface-500 hover:text-alhena-600 transition-colors cursor-pointer"
                >
                  &larr; Choose a different platform
                </button>
              </motion.div>
            )}

            {/* Connecting state */}
            {phase === "connecting" && (
              <motion.div
                key="connecting"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center py-4"
              >
                <Loader2
                  size={32}
                  className="text-alhena-500 animate-spin mx-auto mb-4"
                />
                <h3 className="text-lg font-bold text-surface-900 mb-1">
                  Connecting to {selectedPlatform?.name || "your store"}...
                </h3>
                <p className="text-sm text-surface-600">
                  Establishing a secure connection to{" "}
                  <span className="font-medium text-surface-800">{storeUrl}</span>
                </p>
              </motion.div>
            )}

            {/* Syncing state */}
            {phase === "syncing" && (
              <motion.div
                key="syncing"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <RefreshCw
                    size={20}
                    className="text-alhena-500 animate-spin"
                  />
                  <h3 className="text-lg font-bold text-surface-900">
                    Syncing your product catalog
                  </h3>
                </div>
                <div className="mb-3">
                  <div className="h-2.5 rounded-full bg-alhena-100 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-alhena-500"
                      style={{
                        width: `${(syncCount / syncTotal) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-surface-600">
                    Syncing products...{" "}
                    <span className="font-semibold text-alhena-600">
                      {syncCount.toLocaleString()} of{" "}
                      {syncTotal.toLocaleString()}
                    </span>
                  </p>
                  <span className="text-xs text-surface-400">
                    {Math.round((syncCount / syncTotal) * 100)}%
                  </span>
                </div>
              </motion.div>
            )}

            {/* Success state */}
            {phase === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 24 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 15,
                    delay: 0.1,
                  }}
                  className="w-14 h-14 rounded-full bg-success-500 flex items-center justify-center mx-auto mb-4"
                >
                  <Check size={28} className="text-white" strokeWidth={3} />
                </motion.div>
                <h3 className="text-lg font-bold text-success-800 mb-1">
                  Store connected successfully
                </h3>
                <p className="text-sm text-success-700 mb-6">
                  {syncTotal.toLocaleString()} products synced
                  {selectedPlatform && selectedPlatform.collectionCount > 0
                    ? ` across ${selectedPlatform.collectionCount} collections`
                    : ""}{" "}
                  from your {selectedPlatform?.name || "store"}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => navigate("/scenario-2/integrations")}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-alhena-500 text-white text-sm font-semibold hover:bg-alhena-600 transition-colors shadow-sm"
                  >
                    Continue to integrations
                    <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => navigate("/scenario-2")}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-surface-200 text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors"
                  >
                    <Eye size={14} />
                    Back to Launch Readiness
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      )}

      {/* How it works - visual steps */}
      {phase !== "success" && phase !== "select" && selectedPlatform && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          <h3 className="text-sm font-semibold text-surface-900 mb-3">
            How it works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {connectionSteps.map((step, i) => {
              const Icon = step.icon;
              const isActive =
                (phase === "idle" && i === 0) ||
                (phase === "connecting" && i === 1) ||
                (phase === "syncing" && i === 2);
              const isDone =
                (phase === "connecting" && i === 0) ||
                (phase === "syncing" && i < 2);

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className={clsx(
                    "rounded-2xl border px-5 py-4 transition-all relative",
                    isActive
                      ? "bg-alhena-50 border-alhena-200"
                      : isDone
                        ? "bg-success-50 border-success-200"
                        : "bg-surface-0 border-surface-200"
                  )}
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={clsx(
                        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                        isDone
                          ? "bg-success-500 text-white"
                          : isActive
                            ? "bg-alhena-500 text-white"
                            : "bg-surface-100 text-surface-400"
                      )}
                    >
                      {isDone ? <Check size={14} /> : <Icon size={14} />}
                    </div>
                    <span
                      className={clsx(
                        "text-xs font-semibold uppercase tracking-wide",
                        isDone
                          ? "text-success-600"
                          : isActive
                            ? "text-alhena-600"
                            : "text-surface-400"
                      )}
                    >
                      Step {i + 1}
                    </span>
                  </div>
                  <h4
                    className={clsx(
                      "text-sm font-semibold mb-0.5",
                      isActive || isDone
                        ? "text-surface-900"
                        : "text-surface-500"
                    )}
                  >
                    {step.title}
                  </h4>
                  <p
                    className={clsx(
                      "text-xs leading-relaxed",
                      isActive || isDone
                        ? "text-surface-600"
                        : "text-surface-400"
                    )}
                  >
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* What we access - transparency section */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-surface-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck size={16} className="text-alhena-500" />
            <h3 className="text-sm font-semibold text-surface-900">
              What Alhena accesses
            </h3>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-alhena-50 border border-alhena-200 text-xs font-semibold text-alhena-700">
            <Lock size={10} />
            Read-only access
          </span>
        </div>
        <div className="divide-y divide-surface-100">
          {accessItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.14 + i * 0.04 }}
                className="flex items-start gap-3 px-6 py-3.5"
              >
                <div className="w-8 h-8 rounded-lg bg-surface-50 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={16} className="text-surface-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-900">
                    {item.label}
                  </p>
                  <p className="text-xs text-surface-500 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="px-6 py-3 bg-surface-50 border-t border-surface-100">
          <p className="text-xs text-surface-500">
            <ShoppingBag size={11} className="inline mr-1 -mt-0.5" />
            Alhena never modifies your store data. All access is read-only through
            Shopify's official API with OAuth 2.0 encryption.
          </p>
        </div>
      </motion.div>

      <Toast message={toast.message} visible={toast.visible} onClose={toast.hide} />
    </div>
  );
}
