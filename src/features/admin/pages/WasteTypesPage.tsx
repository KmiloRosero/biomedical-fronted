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
  columns: [
    { key: "id", header: "ID", hidden: true },
    { key: "codigo", header: "Código", inputType: "text" },
    { key: "nombre", header: "Nombre", inputType: "text" },
    { key: "nivel_riesgo", header: "Nivel Riesgo", inputType: "select", options: ["Bajo", "Medio", "Alto", "Crítico"] },
    { key: "dias_almacenamiento_max", header: "Días máx. almacenamiento", inputType: "number" },
    { key: "tratamiento", header: "Tratamiento", inputType: "text" },
    { key: "isActive", header: "Activo", inputType: "boolean" },
  ],
  pageSize: 10,
};

const api = new WasteTypeService();

export function WasteTypesPage() {
  return <DynamicTableCrud config={config} api={api} />;
}
