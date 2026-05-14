import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function CodeBlock({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 text-xs text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-white/80",
        className
      )}
      {...props}
    />
  );
}
