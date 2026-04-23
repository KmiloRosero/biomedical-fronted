import { GenericApiService } from "@/core/services/GenericApiService";
import { DynamicTableCrud } from "@/shared/components/DynamicTableCrud";
import type { DynamicTableCrudConfig } from "@/shared/components/DynamicTableCrud";

type WasteTypeRecord = {
  id: string | number;
  name: string;
  category: string;
  isHazardous: boolean;
};

const config: DynamicTableCrudConfig<WasteTypeRecord> = {
  tableName: "waste-types",
  title: "Tipos de Residuos",
  columns: [
    { key: "id", header: "ID", hidden: true },
    { key: "name", header: "Nombre", inputType: "text" },
    { key: "category", header: "Categoría", inputType: "text" },
    { key: "isHazardous", header: "Peligroso", inputType: "boolean" },
  ],
  pageSize: 10,
};

const api = new GenericApiService<WasteTypeRecord>(config.tableName);

export function WasteTypesPage() {
  return <DynamicTableCrud config={config} api={api} />;
}
