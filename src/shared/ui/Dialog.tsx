import type { PropsWithChildren } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type DialogProps = PropsWithChildren<{
  isOpen: boolean;
  title: string;
  onClose: () => void;
  className?: string;
}>;

export function Dialog({ isOpen, title, onClose, className, children }: DialogProps) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="dialog-root"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
            aria-label="Cerrar"
          />
          <div className="relative mx-auto grid min-h-screen max-w-2xl place-items-center px-4 py-10">
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white/85 text-slate-900 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.22)] backdrop-blur-xl dark:border-white/15 dark:bg-slate-950/70 dark:text-white dark:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]",
                className
              )}
            >
              <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-3 dark:border-white/10">
                <div className="text-sm font-semibold">{title}</div>
                <button
                  type="button"
                  className="rounded-xl p-2 hover:bg-slate-900/5 dark:hover:bg-white/10"
                  onClick={onClose}
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 sm:p-6">{children}</div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
