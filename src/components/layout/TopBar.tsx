import { Bell, Calendar, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";

interface TopBarProps {
  title: string;
  subtitle?: string;
  period?: string;
  showActions?: boolean;
}

export function TopBar({
  title,
  subtitle,
  period = "Last 30 days",
  showActions = true,
}: TopBarProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-between pb-6"
    >
      <div>
        <h1 className="text-2xl font-semibold text-surface-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-surface-500 mt-1">{subtitle}</p>
        )}
      </div>

      {showActions && (
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-surface-200 bg-white text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors">
            <Calendar size={15} />
            <span>{period}</span>
          </button>
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-surface-200 bg-white text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors">
            <Download size={15} />
            <span>Export</span>
          </button>
          <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-surface-200 bg-white text-sm font-medium text-surface-700 hover:bg-surface-50 transition-colors">
            <Share2 size={15} />
            <span>Share</span>
          </button>
          <button className="relative p-2 rounded-lg border border-surface-200 bg-white text-surface-500 hover:bg-surface-50 transition-colors">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
          </button>
        </div>
      )}
    </motion.header>
  );
}
