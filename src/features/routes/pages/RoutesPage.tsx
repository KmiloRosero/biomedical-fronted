import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { CirclePlus, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { Surface } from "@/shared/ui/Surface";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { Skeleton } from "@/shared/ui/Skeleton";
import { JsonEditor } from "@/shared/ui/JsonEditor";
import { JsonViewer } from "@/shared/ui/JsonViewer";
import { RestClient } from "@/core/services/RestClient";

type Row = Record<string, unknown>;

const client = new RestClient();

export function RoutesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editRow, setEditRow] = useState<Row | null>(null);
  const [viewRow, setViewRow] = useState<Row | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = useMemo(() => inferColumns(rows), [rows]);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await client.get<unknown>("/api/routes");
      const list = Array.isArray(data) ? (data as Row[]) : [];
      setRows(list);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo cargar.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function handleCreate(value: unknown) {
    setIsSubmitting(true);
    try {
      await client.post("/api/routes", value);
      toast.success("Ruta creada.");
      setIsCreateOpen(false);
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudo crear.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(value: unknown) {
    const id = editRow ? extractId(editRow) : null;
    if (!id) {
      toast.error("No se pudo detectar el ID del registro.");
      return;
    }
    setIsSubmitting(true);
    try {
      await client.put(`/api/routes/${encodeURIComponent(String(id))}`, value);
      toast.success("Ruta actualizada.");
      setEditRow(null);
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudo actualizar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(row: Row) {
    const id = extractId(row);
    if (!id) {
      toast.error("No se pudo detectar el ID del registro.");
      return;
    }
    setIsSubmitting(true);
    try {
      await client.delete(`/api/routes/${encodeURIComponent(String(id))}`);
      toast.success("Ruta eliminada.");
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
          <h2 className="text-xl font-semibold">Rutas</h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-white/70">CRUD real contra `GET/POST/PUT/DELETE /api/routes`.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={() => void load()} disabled={isLoading}>
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
          <Button type="button" onClick={() => setIsCreateOpen(true)}>
            <CirclePlus className="h-4 w-4" />
            Nuevo
          </Button>
        </div>
      </div>

      <Surface className="p-0">
        {error ? <div className="p-4 text-sm text-rose-600 dark:text-rose-200">{error}</div> : null}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-900/5 dark:bg-white/5">
              <tr>
                {columns.map((c) => (
                  <th key={c} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-white/70">
                    {c}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-white/70">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-white/10">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <tr key={`sk-${i}`}>
                      {columns.map((c) => (
                        <td key={c} className="px-4 py-3">
                          <Skeleton className="h-4 w-40" />
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right">
                        <Skeleton className="ml-auto h-4 w-16" />
                      </td>
                    </tr>
                  ))
                : rows.map((r, idx) => (
                    <motion.tr
                      key={String(extractId(r) ?? idx)}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.14 }}
                      className="hover:bg-slate-900/5 dark:hover:bg-white/5"
                    >
                      {columns.map((c) => (
                        <td key={c} className="whitespace-nowrap px-4 py-3 text-sm text-slate-800 dark:text-white/85">
                          {formatCell(r[c])}
                        </td>
                      ))}
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            className="rounded-xl p-2 text-slate-700 hover:bg-slate-900/5 dark:text-white/80 dark:hover:bg-white/10"
                            onClick={() => setViewRow(r)}
                            aria-label="Ver"
                          >
                            Ver
                          </button>
                          <button
                            type="button"
                            className="rounded-xl p-2 text-slate-700 hover:bg-slate-900/5 dark:text-white/80 dark:hover:bg-white/10"
                            onClick={() => setEditRow(r)}
                            aria-label="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            className="rounded-xl p-2 text-rose-600/90 hover:bg-rose-500/10 dark:text-rose-100/80"
                            onClick={() => void handleDelete(r)}
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

      <Dialog isOpen={isCreateOpen} title="Nueva ruta" onClose={() => setIsCreateOpen(false)}>
        <JsonEditor initialValue={{}} onSubmit={handleCreate} submitLabel="Crear" isSubmitting={isSubmitting} />
      </Dialog>

      <Dialog isOpen={Boolean(editRow)} title="Editar ruta" onClose={() => setEditRow(null)}>
        <JsonEditor initialValue={editRow ?? {}} onSubmit={handleUpdate} submitLabel="Guardar" isSubmitting={isSubmitting} />
      </Dialog>

      <Dialog isOpen={Boolean(viewRow)} title="Detalle" onClose={() => setViewRow(null)}>
        <JsonViewer value={viewRow} />
      </Dialog>
    </div>
  );
}

function inferColumns(rows: Row[]) {
  const keys = new Set<string>();
  for (const r of rows.slice(0, 30)) {
    for (const k of Object.keys(r)) {
      keys.add(k);
    }
  }
  const base = ["id", "code", "name", "status", "createdAt", "updatedAt"];
  const all = Array.from(keys);
  all.sort((a, b) => {
    const ia = base.indexOf(a);
    const ib = base.indexOf(b);
    if (ia !== -1 || ib !== -1) {
      return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    }
    return a.localeCompare(b);
  });
  return all.length ? all.slice(0, 8) : ["id"];
}

function extractId(row: Row): unknown {
  return row["id"] ?? row["routeId"] ?? row["uuid"] ?? row["_id"];
}

function formatCell(value: unknown) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  return "{…}";
}
