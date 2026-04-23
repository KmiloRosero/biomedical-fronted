import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, RotateCcw, Terminal } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Surface } from "@/shared/ui/Surface";
import { cn } from "@/lib/utils";
import { useSystemMonitorStore } from "../stores/useSystemMonitorStore";
import type { SystemLog, SystemLogLevel } from "../models/SystemLog";

export function SystemMonitorPage() {
  const logs = useSystemMonitorStore((s) => s.logsSnapshot);
  const isRunning = useSystemMonitorStore((s) => s.isRunning);
  const start = useSystemMonitorStore((s) => s.start);
  const stop = useSystemMonitorStore((s) => s.stop);
  const clear = useSystemMonitorStore((s) => s.clear);
  const pushRandomLog = useSystemMonitorStore((s) => s.pushRandomLog);

  useEffect(() => {
    start();
    return () => {
      stop();
    };
  }, [start, stop]);

  const statusLabel = useMemo(() => (isRunning ? "En vivo" : "Pausado"), [isRunning]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-semibold">Monitor de Estabilidad del Sistema</h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-white/70">
            Buffer circular de 10 logs (FixedArray). Al llegar el log 11, el log 1 se elimina.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
              isRunning
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                : "border-slate-200/70 bg-slate-900/5 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
            )}
          >
            <Terminal className="h-4 w-4" />
            {statusLabel}
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => (isRunning ? stop() : start())}
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? "Pausar" : "Reanudar"}
          </Button>
          <Button type="button" variant="secondary" onClick={pushRandomLog}>
            Generar log
          </Button>
          <Button type="button" variant="secondary" onClick={clear}>
            <RotateCcw className="h-4 w-4" />
            Limpiar
          </Button>
        </div>
      </div>

      <Surface className="overflow-hidden">
        <div className="border-b border-slate-200/70 bg-slate-950/90 px-4 py-3 text-white dark:border-white/10 dark:bg-black/30">
          <div className="text-sm font-semibold">Consola en tiempo real</div>
          <div className="text-xs text-white/70">Mostrando {logs.length} / 10</div>
        </div>

        <div className="max-h-[520px] overflow-y-auto bg-black/40 p-3 font-mono text-white">
          <AnimatePresence initial={false}>
            {logs.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-white/70"
              >
                Esperando eventos...
              </motion.div>
            ) : (
              logs.map((log) => <LogRow key={log.id} log={log} />)
            )}
          </AnimatePresence>
        </div>
      </Surface>
    </div>
  );
}

function LogRow({ log }: { log: SystemLog }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, height: 0, marginTop: 0, marginBottom: 0 }}
      transition={{ duration: 0.18 }}
      className="mb-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={cn("rounded-lg px-2 py-1 text-[11px]", levelClass(log.level))}>
          {levelLabel(log.level)}
        </span>
        <span className="text-[11px] text-white/70">{formatTime(log.createdAt)}</span>
        <span className="text-[11px] text-white/70">{log.source}</span>
      </div>
      <div className="mt-1 text-sm text-white/90">{log.message}</div>
    </motion.div>
  );
}

function levelLabel(level: SystemLogLevel) {
  if (level === "ERROR") return "ERROR";
  if (level === "WARNING") return "WARN";
  if (level === "CONNECTION") return "CONEXIÓN";
  return "INFO";
}

function levelClass(level: SystemLogLevel) {
  if (level === "ERROR") return "bg-rose-500/15 text-rose-100";
  if (level === "WARNING") return "bg-amber-500/15 text-amber-100";
  if (level === "CONNECTION") return "bg-sky-500/15 text-sky-100";
  return "bg-emerald-500/15 text-emerald-100";
}

function formatTime(ts: number) {
  const date = new Date(ts);
  return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
