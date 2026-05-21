import { motion } from "framer-motion";
import { Lock, Eye } from "lucide-react";

interface PreviewCardProps {
  title: string;
  description: string;
  previewLabel: string;
  index: number;
}

export function PreviewCard({
  title,
  description,
  previewLabel,
  index,
}: PreviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
      className="bg-white rounded-xl border border-dashed border-surface-300 p-5 relative overflow-hidden group hover:border-alhena-300 transition-colors"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-surface-50/50 to-alhena-50/30 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-surface-100 flex items-center justify-center">
            <Lock size={14} className="text-surface-400" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-surface-400">
            {previewLabel}
          </span>
        </div>

        <h4 className="text-sm font-semibold text-surface-700 mb-1">
          {title}
        </h4>
        <p className="text-xs text-surface-400 leading-relaxed mb-3">
          {description}
        </p>

        <div className="h-16 bg-surface-50 rounded-lg border border-surface-100 flex items-center justify-center">
          <div className="flex items-center gap-2 text-surface-300">
            <Eye size={14} />
            <span className="text-xs font-medium">
              Available after setup
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
