import { GenericApiService } from "@/core/services/GenericApiService";
import { DynamicTableCrud } from "@/shared/components/DynamicTableCrud";
import type { DynamicTableCrudConfig } from "@/shared/components/DynamicTableCrud";
import { nariñoMunicipalities, Municipality } from "../data/demoMunicipalities";

// Extender el servicio para cargar datos demo iniciales
class MunicipalityService extends GenericApiService<Municipality> {
  constructor() {
    super("municipalities");
    // Inicializar con todos los municipios de Nariño si están vacíos
    this.initializeData(nariñoMunicipalities);
  }
}

const config: DynamicTableCrudConfig<Municipality> = {
  tableName: "municipalities",
  title: "Municipios de Nariño",
  subtitle: "Catálogo maestro con cobertura territorial e indicadores de generación.",
  enableSearch: true,
  searchPlaceholder: "Buscar municipio...",
  searchKeys: ["nombre", "region"],
  filters: [
    { key: "region", label: "Región", options: ["Sur", "Norte", "Centro", "Occidente", "Oriente"] },
  ],
  columns: [
    { key: "id", header: "ID", hidden: true },
    { key: "nombre", header: "Nombre Municipio", inputType: "text" },
    { key: "region", header: "Región", inputType: "select", options: ["Sur", "Norte", "Centro", "Occidente", "Oriente"] },
    { key: "instituciones_salud", header: "Instituciones", inputType: "number" },
    { key: "generacion_mensual", header: "Generación (ton/mes)", inputType: "number" },
    { key: "latitud", header: "Latitud", inputType: "number", hidden: true },
    { key: "longitud", header: "Longitud", inputType: "number", hidden: true },
    { key: "isActive", header: "Activo", inputType: "boolean" },
  ],
  details: {
    title: "Detalle de municipio",
    render: (row) => (
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-slate-600 dark:text-white/60">Municipio</div>
          <div className="mt-1 text-lg font-semibold">{row.nombre}</div>
          <div className="mt-2 text-sm text-slate-700 dark:text-white/70">Región: {row.region}</div>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-slate-600 dark:text-white/60">Indicadores</div>
          <div className="mt-1 font-semibold">Instituciones: {row.instituciones_salud}</div>
          <div className="mt-2 text-sm text-slate-700 dark:text-white/70">Generación: {row.generacion_mensual} ton/mes</div>
        </div>
        <div className="sm:col-span-2 rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-slate-600 dark:text-white/60">Coordenadas</div>
          <div className="mt-1 text-sm text-slate-900 dark:text-white">Lat: {row.latitud} — Lng: {row.longitud}</div>
        </div>
      </div>
    ),
  },
  pageSize: 10,
};

const api = new MunicipalityService();

export function MunicipalitiesPage() {
  return <DynamicTableCrud config={config} api={api} />;
}
