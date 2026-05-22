import { motion } from "framer-motion";
import {
  Upload,
  Check,
  Clock,
  AlertTriangle,
  Folder,
} from "lucide-react";
import { clsx } from "clsx";
import { TopBar } from "../../components/layout/TopBar";
import { CollapsibleSection } from "../../components/layout/CollapsibleSection";
import { Toast } from "../../components/common/Toast";
import { useToast } from "../../hooks/useToast";
import { useOnboarding } from "../../context/OnboardingContext";

export function KnowledgeBasePage() {
  const toast = useToast();
  const {
    knowledgeBase,
    resolveArticle,
    reviewArticle,
    bulkImport,
    importCategory,
  } = useOnboarding();

  const { categories, flaggedArticles, totalImported, totalArticles } = knowledgeBase;

  const progressPct = totalArticles > 0 ? Math.round((totalImported / totalArticles) * 100) : 0;

  const handleResolve = (articleId: string) => {
    toast.show("Resolving conflict...");
    setTimeout(() => {
      resolveArticle(articleId);
      toast.show("Conflict resolved - article updated");
    }, 1200);
  };

  const handleReview = (articleId: string) => {
    toast.show("Opening article for review...");
    setTimeout(() => {
      reviewArticle(articleId);
      toast.show("Article reviewed and approved");
    }, 1000);
  };

  const handleBulkImport = () => {
    toast.show("Starting bulk import...");
    setTimeout(() => {
      bulkImport();
      toast.show("Imported 10 additional articles");
    }, 1500);
  };

  const handleImportCategory = (name: string) => {
    toast.show(`Importing articles from ${name}...`);
    setTimeout(() => {
      importCategory(name);
      toast.show(`${name} - all articles imported`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <TopBar
        title="Knowledge Base"
        subtitle="Import and review the content Alhena uses to answer customer questions"
        showActions={false}
      />

      {/* ── Compact progress bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-0 rounded-2xl border border-surface-200 px-5 py-4 flex items-center gap-5"
      >
        <p className="text-[0.875rem] font-medium text-surface-700 whitespace-nowrap shrink-0">
          {totalImported} of {totalArticles} articles imported
        </p>

        <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full bg-alhena-500 rounded-full"
          />
        </div>

        <span className="text-[0.875rem] font-semibold text-surface-700 whitespace-nowrap shrink-0">
          {progressPct}% ready
        </span>

        <button
          onClick={handleBulkImport}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-alhena-500 text-white text-[0.875rem] font-semibold hover:bg-alhena-600 transition-colors shrink-0"
        >
          <Upload size={14} />
          Bulk import
        </button>
      </motion.div>

      {/* ── Flagged items ── */}
      {flaggedArticles.length > 0 && (
        <CollapsibleSection
          title="Requires attention"
          titleRight={
            <span className="px-2 py-0.5 rounded-full bg-danger-100 text-danger-700 text-xs font-semibold">
              {flaggedArticles.length}
            </span>
          }
        >
          <div className="bg-surface-0 rounded-2xl border border-surface-200 divide-y divide-surface-100 overflow-hidden">
            {flaggedArticles.map((article) => (
              <div
                key={article.id}
                className="flex items-center gap-4 px-5 py-3.5"
              >
                <div
                  className={clsx(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    article.status === "conflict"
                      ? "bg-danger-100 text-danger-600"
                      : "bg-warning-100 text-warning-600"
                  )}
                >
                  {article.status === "conflict" ? (
                    <AlertTriangle size={15} />
                  ) : (
                    <Clock size={15} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[0.875rem] font-semibold text-surface-900 truncate">
                      {article.title}
                    </span>
                    <span className="text-xs text-surface-500 bg-surface-100 px-2 py-0.5 rounded-full shrink-0">
                      {article.source}
                    </span>
                  </div>
                  <p className="text-xs text-surface-600 truncate mt-0.5">
                    {article.issue}
                  </p>
                </div>

                <button
                  onClick={() =>
                    article.status === "conflict"
                      ? handleResolve(article.id)
                      : handleReview(article.id)
                  }
                  className={clsx(
                    "px-3.5 py-1.5 rounded-full text-white text-[0.8125rem] font-semibold transition-colors shrink-0",
                    article.status === "conflict"
                      ? "bg-danger-500 hover:bg-danger-600"
                      : "bg-warning-500 hover:bg-warning-600"
                  )}
                >
                  {article.status === "conflict" ? "Resolve" : "Review"}
                </button>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* ── Content categories ── */}
      <CollapsibleSection title="Content categories">
        <div className="bg-surface-0 rounded-2xl border border-surface-200 divide-y divide-surface-100 overflow-hidden">
          {categories.map((cat) => {
            const pct = cat.total > 0 ? Math.round((cat.imported / cat.total) * 100) : 0;
            const isComplete = cat.imported >= cat.total;

            return (
              <div
                key={cat.name}
                className="flex items-center gap-4 px-5 py-3.5"
              >
                <Folder size={18} className="text-surface-400 shrink-0" />

                <span className="text-[0.875rem] font-medium text-surface-800 flex-1 min-w-0 truncate">
                  {cat.name}
                </span>

                {cat.hasConflict && (
                  <AlertTriangle size={13} className="text-danger-500 shrink-0" />
                )}

                <div className="w-28 shrink-0">
                  <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className={clsx(
                        "h-full rounded-full transition-all",
                        isComplete ? "bg-success-500" : pct > 0 ? "bg-alhena-500" : "bg-surface-200"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <span className="text-xs font-semibold text-surface-600 w-9 text-right shrink-0">
                  {pct}%
                </span>

                {isComplete ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-success-600 w-24 justify-end shrink-0">
                    <Check size={14} />
                    Complete
                  </span>
                ) : (
                  <button
                    onClick={() => handleImportCategory(cat.name)}
                    className="px-3.5 py-1.5 rounded-full bg-alhena-500 text-white text-[0.8125rem] font-semibold hover:bg-alhena-600 transition-colors w-24 shrink-0"
                  >
                    Import all
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </CollapsibleSection>

      <Toast message={toast.message} visible={toast.visible} onClose={toast.hide} />
    </div>
  );
}
