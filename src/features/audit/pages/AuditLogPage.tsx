import { useMemo } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { DynamicTableCrud, type DynamicTableCrudConfig, type CrudApi } from "@/shared/components/DynamicTableCrud";
import { AuditLogService, type AuditEvent } from "@/core/services/AuditLogService";
import { Surface } from "@/shared/ui/Surface";
import { Button } from "@/shared/ui/Button";
import { JsonViewer } from "@/shared/ui/JsonViewer";

const auditService = new AuditLogService();

const auditApi: CrudApi<AuditEvent> = {
  getAll: async () => auditService.getAll(),
  create: async () => {
    throw new Error("not-supported");
  },
  update: async () => {
    throw new Error("not-supported");
  },
  delete: async (id) => {
    auditService.delete(String(id));
  },
};

export function AuditLogPage() {
  const config = useMemo<DynamicTableCrudConfig<AuditEvent>>(
    () => ({
      tableName: "audit-log",
      title: "Bitácora de auditoría",
      subtitle: "Eventos del sistema: cambios, eliminaciones y operaciones críticas.",
      enableCreate: false,
      enableEdit: false,
      enableDelete: true,
      enableSearch: true,
      searchPlaceholder: "Buscar por módulo, usuario, acción...",
      filters: [
        { key: "action", label: "Acción" },
        { key: "entity", label: "Módulo" },
        { key: "actorRole", label: "Rol" },
      ],
      columns: [
        { key: "timestamp", header: "Fecha" },
        { key: "actorEmail", header: "Usuario" },
        { key: "actorRole", header: "Rol" },
        { key: "action", header: "Acción" },
        { key: "entity", header: "Módulo" },
        { key: "entityId", header: "ID" },
        { key: "summary", header: "Resumen" },
      ],
      details: {
        title: "Detalle de evento",
        render: (row) => (
          <div className="space-y-4">
            <Surface className="p-4">
              <div className="text-sm font-semibold">Resumen</div>
              <div className="mt-1 text-sm text-slate-700 dark:text-white/70">{row.summary}</div>
              <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <div className="text-xs text-slate-600 dark:text-white/60">Fecha</div>
                  <div className="font-medium">{new Date(row.timestamp).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 dark:text-white/60">Usuario</div>
                  <div className="font-medium">{row.actorEmail}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 dark:text-white/60">Rol</div>
                  <div className="font-medium">{row.actorRole}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 dark:text-white/60">Módulo</div>
                  <div className="font-medium">{row.entity}</div>
                </div>
              </div>
            </Surface>
            <div>
              <div className="text-sm font-semibold">Evento (JSON)</div>
              <div className="mt-2">
                <JsonViewer value={row} />
              </div>
            </div>
          </div>
        ),
      },
    }),
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            const confirmed = window.confirm("¿Vaciar toda la bitácora?");
            if (!confirmed) return;
            auditService.clear();
            toast.success("Bitácora vaciada.");
          }}
        >
          <Trash2 className="h-4 w-4" />
          Vaciar
        </Button>
      </div>

      <DynamicTableCrud config={config} api={auditApi} />
    </div>
  );
}

