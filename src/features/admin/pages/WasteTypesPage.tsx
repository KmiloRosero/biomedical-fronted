import { GenericApiService } from "@/core/services/GenericApiService";
import { DynamicTableCrud } from "@/shared/components/DynamicTableCrud";
import type { DynamicTableCrudConfig } from "@/shared/components/DynamicTableCrud";
import { colombianWasteTypes, WasteType } from "../data/demoWasteTypes";

// Extender el servicio para cargar datos demo iniciales
class WasteTypeService extends GenericApiService<WasteType> {
  constructor() {
    super("waste-types");
    // Inicializar con todos los tipos de residuos colombianos
    this.initializeData(colombianWasteTypes);
  }
}

const config: DynamicTableCrudConfig<WasteType> = {
  tableName: "waste-types",
  title: "Tipos de Residuos Biológicos",
  subtitle: "Clasificación, nivel de riesgo, almacenamiento y tratamiento según normativa.",
  enableSearch: true,
  searchPlaceholder: "Buscar por código o nombre...",
  searchKeys: ["codigo", "nombre", "nivel_riesgo"],
  filters: [
    { key: "nivel_riesgo", label: "Riesgo", options: ["Bajo", "Medio", "Alto", "Crítico"] },
  ],
  columns: [
    { key: "id", header: "ID", hidden: true },
    { key: "codigo", header: "Código", inputType: "text" },
    { key: "nombre", header: "Nombre", inputType: "text" },
    { key: "nivel_riesgo", header: "Nivel Riesgo", inputType: "select", options: ["Bajo", "Medio", "Alto", "Crítico"] },
    { key: "dias_almacenamiento_max", header: "Días máx. almacenamiento", inputType: "number" },
    { key: "tratamiento", header: "Tratamiento", inputType: "text" },
    { key: "isActive", header: "Activo", inputType: "boolean" },
  ],
  details: {
    title: "Detalle del tipo",
    render: (row) => (
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-slate-600 dark:text-white/60">Código</div>
          <div className="mt-1 text-lg font-semibold">{row.codigo}</div>
          <div className="mt-2 text-sm text-slate-700 dark:text-white/70">{row.nombre}</div>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-slate-600 dark:text-white/60">Riesgo</div>
          <div className="mt-1 font-semibold">{row.nivel_riesgo}</div>
          <div className="mt-2 text-sm text-slate-700 dark:text-white/70">
            Almacenamiento máximo: {row.dias_almacenamiento_max} días
          </div>
        </div>
        <div className="sm:col-span-2 rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-slate-600 dark:text-white/60">Tratamiento</div>
          <div className="mt-1 text-sm text-slate-900 dark:text-white">{row.tratamiento}</div>
        </div>
      </div>
    ),
  },
  pageSize: 10,
};

const api = new WasteTypeService();

export function WasteTypesPage() {
  return <DynamicTableCrud config={config} api={api} />;
}
