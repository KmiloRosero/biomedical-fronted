import type { Order } from "./Order";

export type AssignmentActionType = "ASSIGN";

export interface AssignmentAction {
  id: string;
  type: AssignmentActionType;
  createdAt: number;
  order: Order;
  truckCode: string;
}
