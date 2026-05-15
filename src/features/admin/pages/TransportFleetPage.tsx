import { GenericApiService } from "@/core/services/GenericApiService";
import { DynamicTableCrud } from "@/shared/components/DynamicTableCrud";
import type { DynamicTableCrudConfig } from "@/shared/components/DynamicTableCrud";
import { nariñoFleets, Fleet } from "../data/demoFleets";

// Extender el servicio para cargar datos demo iniciales
class FleetService extends GenericApiService<Fleet> {
  constructor() {
    super("transport-fleet");
    // Inicializar con todas las flotas de Nariño
    this.initializeData(nariñoFleets);
  }
}

const config: DynamicTableCrudConfig<Fleet> = {
  tableName: "transport-fleet",
  title: "Flotas de Transporte - Nariño",
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
  pageSize: 10,
};

const api = new FleetService();

export function TransportFleetPage() {
  return <DynamicTableCrud config={config} api={api} />;
}
