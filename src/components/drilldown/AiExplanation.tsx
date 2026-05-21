import { motion } from "framer-motion";
import { Sparkles, Info, AlertCircle } from "lucide-react";
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
  high: { dot: "bg-success-500", text: "text-success-700" },
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
      className="bg-gradient-to-br from-alhena-50 to-white rounded-xl border border-alhena-200 p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-alhena-500 flex items-center justify-center">
          <Sparkles size={15} className="text-white" />
        </div>
        <h3 className="text-sm font-semibold text-surface-900">
          AI Analysis
        </h3>
        <span className="text-[10px] font-medium text-alhena-600 bg-alhena-100 px-2 py-0.5 rounded-full">
          Auto-generated
        </span>
      </div>

      <p className="text-sm text-surface-700 leading-relaxed mb-5">
        {summary}
      </p>

      <div className="space-y-3 mb-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-surface-400">
          Contributing factors
        </h4>
        {factors.map((f, i) => {
          const cStyle = confidenceStyles[f.confidence];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="flex items-start gap-3 bg-white/60 rounded-lg p-3 border border-alhena-100"
            >
              <span
                className={clsx(
                  "w-2 h-2 rounded-full mt-1.5 shrink-0",
                  cStyle.dot
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-surface-800">{f.factor}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-semibold text-surface-500">
                    {f.contribution}
                  </span>
                  <span
                    className={clsx(
                      "text-[10px] font-semibold uppercase tracking-wider",
                      cStyle.text
                    )}
                  >
                    {f.confidence} confidence
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-start gap-2 bg-surface-50 rounded-lg p-3 border border-surface-200">
        <Info size={14} className="text-surface-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-medium text-surface-600 mb-0.5">
            Methodology
          </p>
          <p className="text-xs text-surface-500 leading-relaxed">
            {methodology}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-alhena-100">
        <AlertCircle size={13} className="text-surface-400" />
        <p className="text-[11px] text-surface-400">
          AI explanations are generated from available data and may not capture
          all contributing factors. Always validate with domain expertise.
        </p>
      </div>
    </motion.div>
  );
}
