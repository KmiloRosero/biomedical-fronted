export type WasteStageId = "GENERATED" | "COLLECTION" | "TREATMENT" | "DISPOSAL";

export type WasteStageStatus = "completed" | "current" | "pending";

export type WasteStage = {
  id: WasteStageId;
  label: string;
};

export type WasteStageEvent = {
  stageId: WasteStageId;
  timestamp: number;
};
