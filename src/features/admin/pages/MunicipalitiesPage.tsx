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
  pageSize: 10,
};

const api = new MunicipalityService();

export function MunicipalitiesPage() {
  return <DynamicTableCrud config={config} api={api} />;
}
