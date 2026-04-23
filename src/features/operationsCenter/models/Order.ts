export type WasteCategory = "SHARPS" | "INFECTIOUS" | "PHARMACEUTICAL" | "CHEMICAL";

export type OrderPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Order {
  id: string;
  createdAt: number;
  generatorUnit: string;
  wasteCategory: WasteCategory;
  priority: OrderPriority;
}
