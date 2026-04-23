import { GenericApiService } from "@/core/services/GenericApiService";
import { DynamicTableCrud } from "@/shared/components/DynamicTableCrud";
import type { DynamicTableCrudConfig } from "@/shared/components/DynamicTableCrud";

type MunicipalityRecord = {
  id: string | number;
  name: string;
  department: string;
  code: string;
  isActive: boolean;
};

const config: DynamicTableCrudConfig<MunicipalityRecord> = {
  tableName: "municipalities",
  title: "Municipios",
  columns: [
    { key: "id", header: "ID", hidden: true },
    { key: "name", header: "Nombre", inputType: "text" },
    { key: "department", header: "Departamento", inputType: "text" },
    { key: "code", header: "Código", inputType: "text" },
    { key: "isActive", header: "Activo", inputType: "boolean" },
  ],
  pageSize: 10,
};

const api = new GenericApiService<MunicipalityRecord>(config.tableName);

export function MunicipalitiesPage() {
  return <DynamicTableCrud config={config} api={api} />;
}
