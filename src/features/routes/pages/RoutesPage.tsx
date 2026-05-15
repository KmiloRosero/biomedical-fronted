import { GenericApiService } from "@/core/services/GenericApiService";
import { DynamicTableCrud } from "@/shared/components/DynamicTableCrud";
import type { DynamicTableCrudConfig } from "@/shared/components/DynamicTableCrud";
import { departmentalRoutes, DepartmentalRoute } from "../data/demoDepartmentalRoutes";

// Extender el servicio para cargar datos demo iniciales
class RouteService extends GenericApiService<DepartmentalRoute> {
  constructor() {
    super("departmental-routes");
    // Inicializar con todas las rutas departamentales
    this.initializeData(departmentalRoutes);
  }
}

const config: DynamicTableCrudConfig<DepartmentalRoute> = {
  tableName: "departmental-routes",
  title: "Rutas Departamentales - Nariño",
  subtitle: "Planificación de cobertura, asignación de flota y control de progreso.",
  enableSearch: true,
  searchPlaceholder: "Buscar por nombre o flota...",
  searchKeys: ["nombre", "flota_id"],
  filters: [
    { key: "flota_id", label: "Flota" },
  ],
  columns: [
    { key: "id", header: "ID", hidden: true },
    { key: "nombre", header: "Nombre Ruta", inputType: "text" },
    { key: "flota_id", header: "Flota asignada", inputType: "text" },
    { key: "horario", header: "Horario", inputType: "text" },
    { key: "progreso", header: "Progreso", inputType: "text" },
    { key: "isActive", header: "Activa", inputType: "boolean" },
  ],
  details: {
    title: "Detalle de ruta",
    render: (row) => (
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-slate-600 dark:text-white/60">Ruta</div>
          <div className="mt-1 font-semibold">{row.nombre}</div>
          <div className="mt-2 text-sm text-slate-700 dark:text-white/70">Horario: {row.horario}</div>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-slate-600 dark:text-white/60">Asignación</div>
          <div className="mt-1 font-semibold">Flota: {row.flota_id}</div>
          <div className="mt-2 text-sm text-slate-700 dark:text-white/70">Progreso: {row.progreso}</div>
        </div>
        <div className="sm:col-span-2 rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-slate-600 dark:text-white/60">Municipios (IDs)</div>
          <div className="mt-1 text-sm text-slate-900 dark:text-white">
            {row.municipios_ids?.length ? row.municipios_ids.join(", ") : "—"}
          </div>
        </div>
      </div>
    ),
  },
  pageSize: 10,
};

const api = new RouteService();

export function RoutesPage() {
  return <DynamicTableCrud config={config} api={api} />;
}
