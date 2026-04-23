import { GenericApiService } from "@/core/services/GenericApiService";
import { DynamicTableCrud } from "@/shared/components/DynamicTableCrud";
import type { DynamicTableCrudConfig } from "@/shared/components/DynamicTableCrud";

type TransportFleetRecord = {
  id: string | number;
  truckCode: string;
  plate: string;
  capacityKg: number;
  isAvailable: boolean;
};

const config: DynamicTableCrudConfig<TransportFleetRecord> = {
  tableName: "transport-fleet",
  title: "Flota de Transporte",
  columns: [
    { key: "id", header: "ID", hidden: true },
    { key: "truckCode", header: "Código", inputType: "text" },
    { key: "plate", header: "Placa", inputType: "text" },
    { key: "capacityKg", header: "Capacidad (Kg)", inputType: "number" },
    { key: "isAvailable", header: "Disponible", inputType: "boolean" },
  ],
  pageSize: 10,
};

const api = new GenericApiService<TransportFleetRecord>(config.tableName);

export function TransportFleetPage() {
  return <DynamicTableCrud config={config} api={api} />;
}
