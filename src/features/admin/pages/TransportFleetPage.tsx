import { GenericApiService } from "@/core/services/GenericApiService";
import { DynamicTableCrud } from "@/shared/components/DynamicTableCrud";
import type { DynamicTableCrudConfig } from "@/shared/components/DynamicTableCrud";
import { nariñoFleets, Fleet } from "../data/demoFleets";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// Extender el servicio para cargar datos demo iniciales
class FleetService extends GenericApiService<Fleet> {
  constructor() {
    super("transport-fleet");
    // Inicializar con todas las flotas de Nariño
    this.initializeData(nariñoFleets);
  }
}

const baseConfig: DynamicTableCrudConfig<Fleet> = {
  tableName: "transport-fleet",
  title: "Flotas de Transporte - Nariño",
  subtitle: "Disponibilidad, capacidad y mantenimiento preventivo de vehículos.",
  enableSearch: true,
  searchPlaceholder: "Buscar por placa, marca o conductor...",
  searchKeys: ["id", "placa", "marca", "conductor", "estado"],
  filters: [
    { key: "estado", label: "Estado", options: ["activo", "mantenimiento", "en ruta"] },
  ],
  columns: [
    { key: "id", header: "ID", hidden: true },
    { key: "placa", header: "Placa", inputType: "text" },
    { key: "marca", header: "Marca/Modelo", inputType: "text" },
    { key: "capacidad_toneladas", header: "Capacidad (ton)", inputType: "number" },
    { key: "conductor", header: "Conductor", inputType: "text" },
    { key: "estado", header: "Estado", inputType: "select", options: ["activo", "mantenimiento", "en ruta"] },
    { key: "ultima_mantenimiento", header: "Último mantenimiento", inputType: "date" },
    { key: "isActive", header: "Activo", inputType: "boolean" },
  ],
  details: {
    title: "Detalle de vehículo",
    render: (row) => (
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-slate-600 dark:text-white/60">Placa</div>
          <div className="mt-1 text-lg font-semibold">{row.placa}</div>
          <div className="mt-2 text-sm text-slate-700 dark:text-white/70">{row.marca}</div>
        </div>
        <div className="rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-xs text-slate-600 dark:text-white/60">Operación</div>
          <div className="mt-1 font-semibold">Estado: {row.estado}</div>
          <div className="mt-2 text-sm text-slate-700 dark:text-white/70">Conductor: {row.conductor}</div>
        </div>
        <div className="sm:col-span-2 rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs text-slate-600 dark:text-white/60">Capacidad</div>
              <div className="mt-1 font-semibold">{row.capacidad_toneladas} ton</div>
            </div>
            <div>
              <div className="text-xs text-slate-600 dark:text-white/60">Último mantenimiento</div>
              <div className="mt-1 font-semibold">{row.ultima_mantenimiento}</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  pageSize: 10,
};

const api = new FleetService();

export function TransportFleetPage() {
  const [params] = useSearchParams();
  const estado = params.get("estado") ?? "";
  const q = params.get("q") ?? "";

  const config = useMemo<DynamicTableCrudConfig<Fleet>>(() => {
    return {
      ...baseConfig,
      initialSearchText: q,
      ...(estado ? { initialFilterValues: { estado } } : {}),
      initialStateToken: `estado=${estado}|q=${q}`,
    };
  }, [estado, q]);

  return <DynamicTableCrud config={config} api={api} />;
}
