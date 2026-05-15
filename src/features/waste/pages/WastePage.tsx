import { GenericApiService } from "@/core/services/GenericApiService";
import { DynamicTableCrud } from "@/shared/components/DynamicTableCrud";
import type { DynamicTableCrudConfig } from "@/shared/components/DynamicTableCrud";
import { wasteLots, WasteLot } from "../data/demoWasteLots";

// Extender el servicio para cargar datos demo iniciales
class WasteLotService extends GenericApiService<WasteLot> {
  constructor() {
    super("waste-lots");
    // Inicializar con todos los lotes de residuos
    this.initializeData(wasteLots);
  }
}

const config: DynamicTableCrudConfig<WasteLot> = {
  tableName: "waste-lots",
  title: "Lotes de Residuos - Nariño",
  subtitle: "Registro, seguimiento y control de lotes para recolección, transporte y tratamiento.",
  enableSearch: true,
  searchPlaceholder: "Buscar por institución o estado...",
  searchKeys: ["institucion", "estado"],
  filters: [
    {
      key: "estado",
      label: "Estado",
      options: ["generado", "en ruta", "tratado"],
    },
  ],
  columns: [
    { key: "id", header: "ID", hidden: true },
    { key: "institucion", header: "Institución", inputType: "text" },
    { key: "municipio_id", header: "Municipio ID", inputType: "text", hidden: true },
    { key: "tipo_residuo_id", header: "Tipo Residuo ID", inputType: "text", hidden: true },
    { key: "cantidad_kg", header: "Cantidad (kg)", inputType: "number" },
    { key: "estado", header: "Estado", inputType: "select", options: ["generado", "en ruta", "tratado"] },
    { key: "fecha_generacion", header: "Fecha generación", inputType: "date" },
    { key: "fecha_vencimiento", header: "Fecha vencimiento", inputType: "date" },
    { key: "isActive", header: "Activo", inputType: "boolean" },
  ],
  details: {
    title: "Detalle del lote",
    render: (row) => (
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-slate-600 dark:text-white/60">Institución</div>
          <div className="mt-1 font-semibold">{row.institucion}</div>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-slate-600 dark:text-white/60">Estado</div>
          <div className="mt-1 font-semibold">{row.estado}</div>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-slate-600 dark:text-white/60">Municipio ID</div>
          <div className="mt-1 font-semibold">{row.municipio_id}</div>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-slate-600 dark:text-white/60">Tipo residuo ID</div>
          <div className="mt-1 font-semibold">{row.tipo_residuo_id}</div>
        </div>
      </div>
    ),
  },
  pageSize: 10,
};

const api = new WasteLotService();

export function WastePage() {
  return <DynamicTableCrud config={config} api={api} />;
}
