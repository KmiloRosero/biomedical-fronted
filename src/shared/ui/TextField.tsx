import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string | undefined;
};

export function TextField({ label, error, className, ...props }: TextFieldProps) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-700 dark:text-white/80">{label}</span>
      <input
        className={cn(
          "w-full rounded-xl border border-slate-300/80 bg-white px-4 py-2 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-400/20 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40",
          error
            ? "border-rose-500/60 focus:border-rose-500/80 focus:ring-rose-400/20 dark:border-rose-400/60 dark:focus:border-rose-400/80"
            : null,
          className
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-rose-600 dark:text-rose-200">{error}</span> : null}
    </label>
  );
}
