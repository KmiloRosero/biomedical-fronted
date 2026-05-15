export interface WasteType {
  id: string;
  codigo: string;
  nombre: string;
  nivel_riesgo: string;
  dias_almacenamiento_max: number;
  tratamiento: string;
  isActive: boolean;
}

export const colombianWasteTypes: WasteType[] = [
  { id: "res-001", codigo: "RES-001", nombre: "Biosanitarios", nivel_riesgo: "Medio", dias_almacenamiento_max: 7, tratamiento: "Incineración", isActive: true },
  { id: "res-002", codigo: "RES-002", nombre: "Cortopunzantes", nivel_riesgo: "Alto", dias_almacenamiento_max: 5, tratamiento: "Desactivación + Disposición final", isActive: true },
  { id: "res-003", codigo: "RES-003", nombre: "Anatomopatológicos", nivel_riesgo: "Alto", dias_almacenamiento_max: 3, tratamiento: "Incineración", isActive: true },
  { id: "res-004", codigo: "RES-004", nombre: "Restos orgánicos animales", nivel_riesgo: "Medio", dias_almacenamiento_max: 5, tratamiento: "Compostaje controlado", isActive: true },
  { id: "res-005", codigo: "RES-005", nombre: "Químicos citotóxicos", nivel_riesgo: "Crítico", dias_almacenamiento_max: 2, tratamiento: "Tratamiento especializado", isActive: true },
  { id: "res-006", codigo: "RES-006", nombre: "Farmacéuticos vencidos", nivel_riesgo: "Alto", dias_almacenamiento_max: 10, tratamiento: "Incineración controlada", isActive: true },
  { id: "res-007", codigo: "RES-007", nombre: "Químicos de laboratorio", nivel_riesgo: "Medio", dias_almacenamiento_max: 14, tratamiento: "Neutralización", isActive: true },
  { id: "res-008", codigo: "RES-008", nombre: "Radioactivos", nivel_riesgo: "Crítico", dias_almacenamiento_max: 1, tratamiento: "Almacenamiento especializado", isActive: true },
  { id: "res-009", codigo: "RES-009", nombre: "Gases médicos residuales", nivel_riesgo: "Medio", dias_almacenamiento_max: 7, tratamiento: "Neutralización atmosférica", isActive: true },
  { id: "res-010", codigo: "RES-010", nombre: "Residuos sanitarios generales", nivel_riesgo: "Bajo", dias_almacenamiento_max: 15, tratamiento: "Reciclaje / disposición normal", isActive: true },
  { id: "res-011", codigo: "RES-011", nombre: "Residuos de COVID-19", nivel_riesgo: "Alto", dias_almacenamiento_max: 3, tratamiento: "Autoclave + Incineración", isActive: true },
  { id: "res-012", codigo: "RES-012", nombre: "Aceites y lubricantes usados", nivel_riesgo: "Medio", dias_almacenamiento_max: 30, tratamiento: "Reciclaje especializado", isActive: true },
  { id: "res-013", codigo: "RES-013", nombre: "Filtros y materiales absorbentes", nivel_riesgo: "Bajo", dias_almacenamiento_max: 15, tratamiento: "Disposición controlada", isActive: true },
  { id: "res-014", codigo: "RES-014", nombre: "Residuos de equipos médicos obsoletos", nivel_riesgo: "Bajo", dias_almacenamiento_max: 30, tratamiento: "Desmantelamiento y reciclaje", isActive: true },
  { id: "res-015", codigo: "RES-015", nombre: "Productos sanguíneos", nivel_riesgo: "Crítico", dias_almacenamiento_max: 2, tratamiento: "Incineración especializada", isActive: true },
];
