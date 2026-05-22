import { motion } from "framer-motion";
import { Sparkles, Info } from "lucide-react";
import { clsx } from "clsx";
import type { Confidence } from "../../types/dashboard";

interface AiExplanationProps {
  summary: string;
  factors: { factor: string; contribution: string; confidence: Confidence }[];
  methodology: string;
}

const confidenceStyles: Record<
  Confidence,
  { dot: string; text: string }
> = {
  high: { dot: "bg-success-600", text: "text-success-700" },
  medium: { dot: "bg-warning-500", text: "text-warning-700" },
  low: { dot: "bg-danger-500", text: "text-danger-700" },
};

export function AiExplanation({
  summary,
  factors,
  methodology,
}: AiExplanationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-surface-0 rounded-xl border border-surface-200 overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-surface-100 flex items-center gap-2.5">
        <Sparkles size={16} className="text-alhena-500" />
        <h3 className="text-[0.9375rem] font-bold text-surface-900">
          AI Analysis
        </h3>
        <span className="text-xs font-semibold text-alhena-700 bg-alhena-50 px-2.5 py-0.5 rounded-full">
          Auto-generated
        </span>
      </div>

      <div className="px-5 py-4 border-b border-surface-100">
        <p className="text-sm text-surface-700 leading-relaxed">
          {summary}
        </p>
      </div>

      <div className="px-5 pt-3 pb-1 border-b border-surface-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-surface-500">Likely causes</h4>
      </div>

      <div className="divide-y divide-surface-100">
        {factors.map((f, i) => {
          const cStyle = confidenceStyles[f.confidence];
          return (
            <div key={i} className="px-5 py-3 flex items-center gap-3">
              <span
                className={clsx(
                  "w-2 h-2 rounded-full shrink-0",
                  cStyle.dot
                )}
              />
              <span className="text-sm text-surface-800 flex-1">
                {f.factor}
              </span>
              <span className="text-sm font-semibold text-surface-600 shrink-0">
                {f.contribution}
              </span>
              <span
                className={clsx(
                  "text-xs font-bold uppercase tracking-wider shrink-0",
                  cStyle.text
                )}
              >
                {f.confidence}
              </span>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3 bg-surface-50 border-t border-surface-100 flex items-center gap-2">
        <Info size={14} className="text-surface-500 shrink-0" />
        <p className="text-xs text-surface-500">
          {methodology}
        </p>
      </div>
    </motion.div>
  );
}
