import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { Surface } from "@/shared/ui/Surface";
import { TextField } from "@/shared/ui/TextField";
import { Skeleton } from "@/shared/ui/Skeleton";
import type { EntityId, GenericApiService } from "@/core/services/GenericApiService";

export type ColumnInputType = "text" | "number" | "boolean" | "date" | "select";

export type DynamicColumnConfig<TRecord> = {
  key: keyof TRecord & string;
  header: string;
  inputType?: ColumnInputType;
  hidden?: boolean;
  options?: string[];
};

export type DynamicTableCrudConfig<TRecord extends { id: EntityId }> = {
  tableName: string;
  title: string;
  columns: Array<DynamicColumnConfig<TRecord>>;
  pageSize?: number;
};

export type DynamicTableCrudProps<TRecord extends { id: EntityId }> = {
  config: DynamicTableCrudConfig<TRecord>;
  api: GenericApiService<TRecord>;
};

type JsonValue = string | number | boolean | null;

export function DynamicTableCrud<TRecord extends { id: EntityId }>({ config, api }: DynamicTableCrudProps<TRecord>) {
  const pageSize = config.pageSize ?? 10;
  const visibleColumns = useMemo(() => config.columns.filter((c) => !c.hidden), [config.columns]);

  const [rows, setRows] = useState<TRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<TRecord | null>(null);
  const [formValues, setFormValues] = useState<Record<string, JsonValue>>({});
  const [isSaving, setIsSaving] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const reload = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getAll(controller.signal);
      setRows(data);
      setPage(1);
    } catch {
      setError("No se pudo cargar la información desde el backend.");
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    void reload();
    return () => abortRef.current?.abort();
  }, [reload, config.tableName]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(rows.length / pageSize)), [rows.length, pageSize]);
  const pagedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function openCreateDialog() {
    setEditingRow(null);
    const initial: Record<string, JsonValue> = {};
    for (const col of visibleColumns) {
      if (col.key === "id") continue;
      initial[col.key] = col.inputType === "boolean" ? false : "";
    }
    setFormValues(initial);
    setIsDialogOpen(true);
  }

  function openEditDialog(row: TRecord) {
    setEditingRow(row);
    const initial: Record<string, JsonValue> = {};
    for (const col of visibleColumns) {
      if (col.key === "id") continue;
      const value = (row as Record<string, unknown>)[col.key];
      initial[col.key] = normalizeToJsonValue(value);
    }
    setFormValues(initial);
    setIsDialogOpen(true);
  }

  function closeDialog() {
    setIsDialogOpen(false);
    setEditingRow(null);
    setFormValues({});
  }

  async function handleSave() {
    setIsSaving(true);
    setError(null);
    try {
      const payload = buildPayload(formValues, visibleColumns);
      if (editingRow) {
        const updated = await api.update(editingRow.id, payload as Partial<Omit<TRecord, "id">>);
        setRows((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      } else {
        const created = await api.create(payload as Omit<TRecord, "id">);
        setRows((prev) => [created, ...prev]);
      }
      closeDialog();
    } catch {
      setError("No se pudo guardar. Verifica la conexión o los datos.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(row: TRecord) {
    const confirmed = window.confirm("¿Eliminar este registro?");
    if (!confirmed) {
      return;
    }
    setError(null);
    try {
      await api.delete(row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch {
      setError("No se pudo eliminar el registro.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-semibold">{config.title}</h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-white/70">Tabla: {config.tableName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={reload} isLoading={isLoading}>
            <RefreshCcw className="h-4 w-4" />
            Recargar
          </Button>
          <Button type="button" onClick={openCreateDialog}>
            <Plus className="h-4 w-4" />
            Nuevo
          </Button>
        </div>
      </div>

      {error ? <div className="text-sm text-rose-600 dark:text-rose-200">{error}</div> : null}

      <Surface className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-900/5 dark:bg-white/5">
              <tr>
                {visibleColumns.map((c) => (
                  <th
                    key={c.key}
                    className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-white/70"
                  >
                    {c.header}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-white/70">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-white/10">
              <AnimatePresence initial={false}>
                {isLoading
                  ? Array.from({ length: pageSize }).map((_, index) => (
                      <motion.tr
                        key={`row-skeleton-${index}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.16 }}
                      >
                        {visibleColumns.map((c) => (
                          <td key={c.key} className="whitespace-nowrap px-4 py-3">
                            <Skeleton className="h-4 w-full max-w-[160px]" />
                          </td>
                        ))}
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <Skeleton className="h-4 w-20" />
                        </td>
                      </motion.tr>
                    ))
                  : pagedRows.map((row) => (
                      <motion.tr
                        key={String(row.id)}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.16 }}
                        className="hover:bg-slate-900/5 dark:hover:bg-white/5"
                      >
                        {visibleColumns.map((c) => (
                          <td key={c.key} className="whitespace-nowrap px-4 py-3 text-sm text-slate-800 dark:text-white/85">
                            {formatCell((row as Record<string, unknown>)[c.key])}
                          </td>
                        ))}
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              className="rounded-xl p-2 text-slate-700 hover:bg-slate-900/5 dark:text-white/80 dark:hover:bg-white/10"
                              onClick={() => openEditDialog(row)}
                              aria-label="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="rounded-xl p-2 text-rose-600/90 hover:bg-rose-500/10 dark:text-rose-100/80"
                              onClick={() => void handleDelete(row)}
                              aria-label="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200/70 bg-slate-900/5 px-4 py-3 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70 sm:flex-row">
          <div className="text-sm">
            Página {page} de {totalPages} — {rows.length} registros
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" onClick={() => setPage(1)} disabled={page === 1}>
              Primero
            </Button>
            <Button type="button" variant="ghost" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              Anterior
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Siguiente
            </Button>
            <Button type="button" variant="ghost" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
              Último
            </Button>
          </div>
        </div>
      </Surface>

      <Dialog
        isOpen={isDialogOpen}
        title={editingRow ? "Editar registro" : "Crear nuevo registro"}
        onClose={closeDialog}
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {visibleColumns
              .filter((c) => c.key !== "id")
              .map((c) => (
                <FieldEditor
                  key={c.key}
                  column={c}
                  value={formValues[c.key]}
                  onChange={(next) => setFormValues((p) => ({ ...p, [c.key]: next }))}
                />
              ))}
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" onClick={closeDialog} disabled={isSaving}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSave} isLoading={isSaving}>
              Guardar
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function FieldEditor<TRecord>({
  column,
  value,
  onChange,
}: {
  column: DynamicColumnConfig<TRecord>;
  value: JsonValue | undefined;
  onChange: (value: JsonValue) => void;
}) {
  if (column.inputType === "boolean") {
    return (
      <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-slate-900/5 px-4 py-3 dark:border-white/10 dark:bg-white/5">
        <span className="text-sm text-slate-700 dark:text-white/80">{column.header}</span>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 accent-emerald-500"
        />
      </label>
    );
  }

  if (column.inputType === "select" && column.options) {
    return (
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-white/80">{column.header}</label>
        <select
          value={String(value || "")}
          onChange={(e) => onChange(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm dark:border-white/20 dark:bg-slate-800 dark:text-white"
        >
          {column.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  const inputType = column.inputType === "number" ? "number" : column.inputType === "date" ? "date" : "text";
  return (
    <TextField
      label={column.header}
      type={inputType}
      value={value === null || value === undefined ? "" : String(value)}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function formatCell(value: unknown) {
  if (value === null || value === undefined) {
    return "—";
  }
  if (typeof value === "boolean") {
    return value ? "Sí" : "No";
  }
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  return String(value);
}

function normalizeToJsonValue(value: unknown): JsonValue {
  if (value === null) return null;
  if (typeof value === "string") return value;
  if (typeof value === "number") return value;
  if (typeof value === "boolean") return value;
  return String(value);
}

function buildPayload<TRecord>(
  values: Record<string, JsonValue>,
  columns: Array<DynamicColumnConfig<TRecord>>
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  for (const col of columns) {
    if (col.key === "id") continue;
    const raw = values[col.key];
    if (col.inputType === "number") {
      payload[col.key] = raw === "" ? null : typeof raw === "number" ? raw : Number(raw);
      continue;
    }
    if (col.inputType === "boolean") {
      payload[col.key] = Boolean(raw);
      continue;
    }
    payload[col.key] = raw;
  }
  return payload;
}
