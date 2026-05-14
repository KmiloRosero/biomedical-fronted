import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CheckCircle2, RefreshCw, ShieldAlert, Trash2 } from "lucide-react";
import { Surface } from "@/shared/ui/Surface";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/ui/Skeleton";
import { RestClient } from "@/core/services/RestClient";

type AlertRow = Record<string, unknown>;

const client = new RestClient();

export function AlertsPage() {
  const [rows, setRows] = useState<AlertRow[]>([]);
  const [level, setLevel] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = useMemo(() => {
    if (!level) {
      return rows;
    }
    const key = level.toLowerCase();
    return rows.filter((r) => String(r["level"] ?? r["severity"] ?? "").toLowerCase() === key);
  }, [level, rows]);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await client.get<unknown>("/api/alerts");
      const list = Array.isArray(data) ? (data as AlertRow[]) : [];
      setRows(list);
      const criticalCount = list.filter((r) => String(r["level"] ?? r["severity"] ?? "").toLowerCase() === "critical").length;
      if (criticalCount > 0) {
        toast.error(`Hay ${criticalCount} alertas críticas.`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo cargar.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
    const id = window.setInterval(() => {
      void load();
    }, 15000);
    return () => window.clearInterval(id);
  }, []);

  async function markRead(row: AlertRow) {
    const id = extractId(row);
    if (!id) {
      toast.error("No se pudo detectar el ID.");
      return;
    }
    setIsSubmitting(true);
    try {
      await client.patch(`/api/alerts/${encodeURIComponent(String(id))}/read`);
      toast.success("Marcada como leída.");
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudo actualizar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function remove(row: AlertRow) {
    const id = extractId(row);
    if (!id) {
      toast.error("No se pudo detectar el ID.");
      return;
    }
    setIsSubmitting(true);
    try {
      await client.delete(`/api/alerts/${encodeURIComponent(String(id))}`);
      toast.success("Alerta eliminada.");
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-semibold">Alertas</h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-white/70">Monitor de alertas en tiempo real (polling cada 15s).</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="h-10 rounded-xl border border-slate-300/80 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-white/10 dark:text-white"
          >
            <option value="">Todas</option>
            <option value="critical">Críticas</option>
            <option value="high">Altas</option>
            <option value="medium">Medias</option>
            <option value="low">Bajas</option>
          </select>
          <Button type="button" variant="secondary" onClick={() => void load()} disabled={isLoading}>
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      <Surface className="p-0">
        {error ? <div className="p-4 text-sm text-rose-600 dark:text-rose-200">{error}</div> : null}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-900/5 dark:bg-white/5">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-white/70">Nivel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-white/70">Mensaje</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-white/70">Fecha</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-white/70">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-white/10">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={`sk-${i}`}>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-80" /></td>
                      <td className="px-4 py-3"><Skeleton className="h-4 w-36" /></td>
                      <td className="px-4 py-3 text-right"><Skeleton className="ml-auto h-4 w-16" /></td>
                    </tr>
                  ))
                : filtered.map((r, idx) => (
                    <motion.tr
                      key={String(extractId(r) ?? idx)}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.14 }}
                      className="hover:bg-slate-900/5 dark:hover:bg-white/5"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-sm">
                        <span className={badgeClass(String(r["level"] ?? r["severity"] ?? ""))}>
                          {String(r["level"] ?? r["severity"] ?? "—")}
                        </span>
                      </td>
                      <td className="min-w-[320px] px-4 py-3 text-sm text-slate-800 dark:text-white/85">
                        {String(r["message"] ?? r["description"] ?? r["title"] ?? "—")}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700 dark:text-white/70">
                        {formatDate(r["createdAt"] ?? r["created_at"] ?? r["timestamp"])}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            className="rounded-xl p-2 text-slate-700 hover:bg-slate-900/5 dark:text-white/80 dark:hover:bg-white/10"
                            onClick={() => void markRead(r)}
                            aria-label="Marcar leída"
                            disabled={isSubmitting}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="rounded-xl p-2 text-rose-600/90 hover:bg-rose-500/10 dark:text-rose-100/80"
                            onClick={() => void remove(r)}
                            aria-label="Eliminar"
                            disabled={isSubmitting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
            </tbody>
          </table>
        </div>
      </Surface>

      <Surface className="p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-amber-400/25 bg-amber-500/10 text-amber-700 dark:text-amber-100">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">Notas</div>
            <div className="mt-1 text-sm text-slate-700 dark:text-white/70">
              Este módulo usa endpoints: `GET /api/alerts`, `PATCH /api/alerts/:id/read`, `DELETE /api/alerts/:id`.
            </div>
          </div>
        </div>
      </Surface>
    </div>
  );
}

function extractId(row: AlertRow): unknown {
  return row["id"] ?? row["alertId"] ?? row["uuid"] ?? row["_id"];
}

function badgeClass(level: string) {
  const key = level.toLowerCase();
  const base = "rounded-lg px-2 py-1 text-xs";
  if (key === "critical") return `${base} bg-rose-500/15 text-rose-700 dark:text-rose-100`;
  if (key === "high") return `${base} bg-amber-500/15 text-amber-700 dark:text-amber-100`;
  if (key === "medium") return `${base} bg-sky-500/15 text-sky-700 dark:text-sky-100`;
  if (key === "low") return `${base} bg-emerald-500/15 text-emerald-700 dark:text-emerald-100`;
  return `${base} bg-slate-900/5 text-slate-700 dark:bg-white/10 dark:text-white/70`;
}

function formatDate(value: unknown) {
  if (!value) return "—";
  const ts = typeof value === "number" ? value : Date.parse(String(value));
  if (!Number.isFinite(ts)) return String(value);
  return new Date(ts).toLocaleString();
}
