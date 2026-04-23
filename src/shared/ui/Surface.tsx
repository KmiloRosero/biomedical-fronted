import type { HTMLAttributes, PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

export type SurfaceProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

export function Surface({ className, ...props }: SurfaceProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/70 bg-white/80 backdrop-blur-xl shadow-[0_20px_60px_-30px_rgba(15,23,42,0.18)] dark:border-white/15 dark:bg-white/10 dark:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]",
        className
      )}
      {...props}
    />
  );
}
