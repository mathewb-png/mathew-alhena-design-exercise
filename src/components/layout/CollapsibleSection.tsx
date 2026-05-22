import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { clsx } from "clsx";

interface CollapsibleSectionProps {
  title: string;
  titleRight?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  id?: string;
  /** Override the heading text className */
  headingClassName?: string;
  /** Override the heading button bottom margin (default "mb-3") */
  headingMargin?: string;
}

export function CollapsibleSection({
  title,
  titleRight,
  children,
  defaultOpen = true,
  id,
  headingClassName,
  headingMargin = "mb-3",
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const headingId = id || `section-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <section aria-labelledby={headingId}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={clsx(
          "w-full flex items-center justify-between cursor-pointer select-none",
          headingMargin
        )}
      >
        <div className="flex items-center gap-2">
          <h2
            id={headingId}
            className={headingClassName || "text-sm font-semibold text-surface-900"}
          >
            {title}
          </h2>
          {titleRight && (
            <span
              className="text-xs text-surface-500"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              {titleRight}
            </span>
          )}
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-surface-400"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
