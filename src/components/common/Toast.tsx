import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose?: () => void;
}

export function Toast({ message, visible, onClose }: ToastProps) {
  const { darkMode } = useTheme();
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-medium shadow-lg"
          style={{
            backgroundColor: darkMode ? "#1e293b" : "#0f172a",
            color: "#ffffff",
          }}
        >
          <CheckCircle2 size={16} className="text-success-400 shrink-0" />
          <span>{message}</span>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-1 p-0.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
