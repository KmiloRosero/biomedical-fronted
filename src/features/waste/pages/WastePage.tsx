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
  pageSize: 10,
};

const api = new WasteLotService();

export function WastePage() {
  return <DynamicTableCrud config={config} api={api} />;
}
