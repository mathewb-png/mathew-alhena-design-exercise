import { useState, useRef, useEffect } from "react";
import { Bell, Calendar, Download, Share2, Check, ChevronDown, Copy, Mail, FileText, Table } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

type PeriodKey = "7d" | "30d" | "90d";

const periodLabels: Record<PeriodKey, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

interface Notification {
  id: string;
  title: string;
  detail: string;
  time: string;
  unread: boolean;
  type: "alert" | "insight" | "system";
}

const defaultNotifications: Notification[] = [
  {
    id: "n1",
    title: "Escalation spike detected",
    detail: "Subscription cancellations up 45% in 14 days",
    time: "3h ago",
    unread: true,
    type: "alert",
  },
  {
    id: "n2",
    title: "Weekly report ready",
    detail: "Your May 19 performance snapshot is available",
    time: "6h ago",
    unread: true,
    type: "insight",
  },
  {
    id: "n3",
    title: "Knowledge base conflict resolved",
    detail: "Shipping FAQ gap was fixed - escalations down 12%",
    time: "2 days ago",
    unread: false,
    type: "system",
  },
];

interface TopBarProps {
  title: string;
  subtitle?: string;
  period?: PeriodKey;
  showActions?: boolean;
  onPeriodChange?: (period: PeriodKey) => void;
  onExport?: (format: "pdf" | "csv") => void;
  onShare?: (method: "copy" | "email") => void;
}

export function TopBar({
  title,
  subtitle,
  period: controlledPeriod,
  showActions = true,
  onPeriodChange,
  onExport,
  onShare,
}: TopBarProps) {
  const [period, setPeriod] = useState<PeriodKey>(controlledPeriod ?? "30d");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [notifications, setNotifications] = useState(defaultNotifications);
  const [shareCopied, setShareCopied] = useState(false);

  const periodRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const notifsRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (periodRef.current && !periodRef.current.contains(target)) setPeriodOpen(false);
      if (exportRef.current && !exportRef.current.contains(target)) setExportOpen(false);
      if (shareRef.current && !shareRef.current.contains(target)) setShareOpen(false);
      if (notifsRef.current && !notifsRef.current.contains(target)) setNotifsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePeriodSelect = (p: PeriodKey) => {
    setPeriod(p);
    setPeriodOpen(false);
    onPeriodChange?.(p);
  };

  const handleExport = (format: "pdf" | "csv") => {
    setExportOpen(false);
    onExport?.(format);
  };

  const handleShareCopy = () => {
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
    setShareOpen(false);
    onShare?.("copy");
  };

  const handleShareEmail = () => {
    setShareOpen(false);
    onShare?.("email");
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const typeColor = {
    alert: "bg-danger-500",
    insight: "bg-alhena-500",
    system: "bg-success-500",
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between pb-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-surface-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[0.9375rem] text-surface-600 mt-1">{subtitle}</p>
        )}
      </div>

      {showActions && (
        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="relative" ref={periodRef}>
            <button
              onClick={() => {
                setPeriodOpen(!periodOpen);
                setExportOpen(false);
                setShareOpen(false);
                setNotifsOpen(false);
              }}
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-[0.875rem] font-medium transition-all",
                periodOpen
                  ? "border-alhena-300 bg-alhena-50 text-alhena-700 ring-2 ring-alhena-100"
                  : "border-surface-200 bg-surface-0 text-surface-700 hover:bg-surface-50 hover:border-surface-300"
              )}
            >
              <Calendar size={16} />
              <span>{periodLabels[period]}</span>
              <ChevronDown size={14} className={clsx("transition-transform", periodOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {periodOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-surface-0 border border-surface-200 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  {(Object.entries(periodLabels) as [PeriodKey, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => handlePeriodSelect(key)}
                      className={clsx(
                        "w-full px-4 py-2.5 text-left text-sm flex items-center justify-between transition-colors",
                        period === key
                          ? "bg-alhena-50 text-alhena-700 font-semibold"
                          : "text-surface-700 hover:bg-surface-50"
                      )}
                    >
                      {label}
                      {period === key && <Check size={14} className="text-alhena-500" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Export */}
          <div className="relative" ref={exportRef}>
            <button
              onClick={() => {
                setExportOpen(!exportOpen);
                setPeriodOpen(false);
                setShareOpen(false);
                setNotifsOpen(false);
              }}
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-[0.875rem] font-medium transition-all",
                exportOpen
                  ? "border-alhena-300 bg-alhena-50 text-alhena-700 ring-2 ring-alhena-100"
                  : "border-surface-200 bg-surface-0 text-surface-700 hover:bg-surface-50 hover:border-surface-300"
              )}
            >
              <Download size={16} />
              <span>Export</span>
            </button>
            <AnimatePresence>
              {exportOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-surface-0 border border-surface-200 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <button
                    onClick={() => handleExport("pdf")}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-surface-50 transition-colors"
                  >
                    <FileText size={16} className="text-danger-500" />
                    <div>
                      <p className="text-sm font-medium text-surface-900">PDF Report</p>
                      <p className="text-[11px] text-surface-500">Formatted for stakeholders</p>
                    </div>
                  </button>
                  <div className="h-px bg-surface-100" />
                  <button
                    onClick={() => handleExport("csv")}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-surface-50 transition-colors"
                  >
                    <Table size={16} className="text-success-600" />
                    <div>
                      <p className="text-sm font-medium text-surface-900">CSV Data</p>
                      <p className="text-[11px] text-surface-500">Raw metrics for analysis</p>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Share */}
          <div className="relative" ref={shareRef}>
            <button
              onClick={() => {
                setShareOpen(!shareOpen);
                setPeriodOpen(false);
                setExportOpen(false);
                setNotifsOpen(false);
              }}
              className={clsx(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-[0.875rem] font-medium transition-all",
                shareOpen
                  ? "border-alhena-300 bg-alhena-50 text-alhena-700 ring-2 ring-alhena-100"
                  : "border-surface-200 bg-surface-0 text-surface-700 hover:bg-surface-50 hover:border-surface-300"
              )}
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
            <AnimatePresence>
              {shareOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-surface-0 border border-surface-200 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <button
                    onClick={handleShareCopy}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-surface-50 transition-colors"
                  >
                    {shareCopied ? (
                      <Check size={16} className="text-success-500" />
                    ) : (
                      <Copy size={16} className="text-surface-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-surface-900">
                        {shareCopied ? "Link copied!" : "Copy snapshot link"}
                      </p>
                      <p className="text-[11px] text-surface-500">Shareable read-only view</p>
                    </div>
                  </button>
                  <div className="h-px bg-surface-100" />
                  <button
                    onClick={handleShareEmail}
                    className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-surface-50 transition-colors"
                  >
                    <Mail size={16} className="text-surface-500" />
                    <div>
                      <p className="text-sm font-medium text-surface-900">Email summary</p>
                      <p className="text-[11px] text-surface-500">Send to your inbox</p>
                    </div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative" ref={notifsRef}>
            <button
              onClick={() => {
                setNotifsOpen(!notifsOpen);
                setPeriodOpen(false);
                setExportOpen(false);
                setShareOpen(false);
              }}
              className={clsx(
                "relative p-2.5 rounded-full border transition-all",
                notifsOpen
                  ? "border-alhena-300 bg-alhena-50 text-alhena-700 ring-2 ring-alhena-100"
                  : "border-surface-200 bg-surface-0 text-surface-600 hover:bg-surface-50 hover:border-surface-300"
              )}
              aria-label={`Notifications${unreadCount > 0 ? ` - ${unreadCount} new` : ""}`}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-danger-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1">
                  {unreadCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {notifsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-surface-0 border border-surface-200 rounded-xl shadow-lg overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-surface-100 flex items-center justify-between">
                    <p className="text-sm font-semibold text-surface-900">Notifications</p>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs font-medium text-alhena-600 hover:text-alhena-700 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="divide-y divide-surface-100 max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={clsx(
                          "px-4 py-3 flex items-start gap-3 transition-colors",
                          notif.unread ? "bg-alhena-50/30" : "bg-surface-0"
                        )}
                      >
                        <span className={clsx("w-2 h-2 rounded-full shrink-0 mt-1.5", typeColor[notif.type])} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className={clsx("text-sm", notif.unread ? "font-semibold text-surface-900" : "font-medium text-surface-700")}>
                              {notif.title}
                            </p>
                            {notif.unread && (
                              <span className="w-1.5 h-1.5 rounded-full bg-alhena-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-surface-500 mt-0.5">{notif.detail}</p>
                          <p className="text-[10px] text-surface-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {unreadCount === 0 && (
                    <div className="px-4 py-2 bg-surface-50 border-t border-surface-100">
                      <p className="text-[11px] text-surface-500 text-center">All caught up</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.header>
  );
}
