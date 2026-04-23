import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { WasteStageStatus } from "../models/WasteStage";

export type WasteTimelineItem = {
  id: string;
  label: string;
  timestamp: number | null;
  status: WasteStageStatus;
  icon: ReactNode;
};

export function WasteTimeline({ items }: { items: WasteTimelineItem[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={item.id} className="relative flex gap-3">
          <div className="relative flex w-10 justify-center">
            {index !== items.length - 1 ? (
              <div className="absolute left-1/2 top-10 h-[calc(100%-14px)] w-px -translate-x-1/2 bg-slate-200/70 dark:bg-white/10" />
            ) : null}

            <div className={cn("grid h-10 w-10 place-items-center rounded-2xl border", statusClass(item.status))}>
              {item.icon}
            </div>
          </div>

          <div className="min-w-0 flex-1 rounded-2xl border border-slate-200/70 bg-slate-900/5 px-4 py-3 dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-semibold text-slate-900 dark:text-white">{item.label}</div>
              <div className="text-xs text-slate-600 dark:text-white/60">
                {item.timestamp ? formatDateTime(item.timestamp) : "—"}
              </div>
            </div>
            <div className="mt-2">
              <span className={cn("rounded-lg px-2 py-1 text-xs", badgeClass(item.status))}>
                {statusLabel(item.status)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function statusLabel(status: WasteStageStatus) {
  if (status === "completed") return "Completado";
  if (status === "current") return "Actual";
  return "Pendiente";
}

function statusClass(status: WasteStageStatus) {
  if (status === "completed") return "border-emerald-400/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-100";
  if (status === "current") return "border-sky-400/25 bg-sky-500/10 text-sky-700 dark:text-sky-100";
  return "border-slate-200/70 bg-slate-900/5 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-white/60";
}

function badgeClass(status: WasteStageStatus) {
  if (status === "completed") return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-100";
  if (status === "current") return "bg-sky-500/15 text-sky-700 dark:text-sky-100";
  return "bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-white/70";
}

function formatDateTime(ts: number) {
  const date = new Date(ts);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
