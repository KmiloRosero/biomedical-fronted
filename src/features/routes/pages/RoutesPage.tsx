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
  columns: [
    { key: "id", header: "ID", hidden: true },
    { key: "nombre", header: "Nombre Ruta", inputType: "text" },
    { key: "flota_id", header: "Flota asignada", inputType: "text" },
    { key: "horario", header: "Horario", inputType: "text" },
    { key: "progreso", header: "Progreso", inputType: "text" },
    { key: "isActive", header: "Activa", inputType: "boolean" },
  ],
  pageSize: 10,
};

const api = new RouteService();

export function RoutesPage() {
  return <DynamicTableCrud config={config} api={api} />;
}
