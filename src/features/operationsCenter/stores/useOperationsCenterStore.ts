import { create } from "zustand";
import { Queue, Stack } from "@/core/structures";
import type { Order, OrderPriority, WasteCategory } from "../models/Order";
import type { AssignmentAction } from "../models/AssignmentAction";

type OperationsCenterState = {
  ordersQueue: Queue<Order>;
  queueSnapshot: Order[];
  assignmentsStack: Stack<AssignmentAction>;
  stackSnapshot: AssignmentAction[];
  activeAssignments: AssignmentAction[];
  isSimulationRunning: boolean;
  simulationIntervalId: number | null;
  startSimulation: () => void;
  stopSimulation: () => void;
  enqueueRandomOrder: () => void;
  processNextOrder: () => void;
  undoLastAction: () => void;
};

function createRandomOrder(): Order {
  const wasteCategories: WasteCategory[] = ["SHARPS", "INFECTIOUS", "PHARMACEUTICAL", "CHEMICAL"];
  const priorities: OrderPriority[] = ["LOW", "MEDIUM", "HIGH"];
  const generatorUnits = [
    "Emergencias",
    "Quirófano",
    "UCI",
    "Laboratorio",
    "Hospitalización",
    "Banco de Sangre",
  ];

  const wasteCategory = wasteCategories[Math.floor(Math.random() * wasteCategories.length)]!;
  const priority = priorities[Math.floor(Math.random() * priorities.length)]!;
  const generatorUnit = generatorUnits[Math.floor(Math.random() * generatorUnits.length)]!;

  return {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    generatorUnit,
    wasteCategory,
    priority,
  };
}

function createTruckCode(): string {
  const n = Math.floor(100 + Math.random() * 900);
  return `TRK-${n}`;
}

export const useOperationsCenterStore = create<OperationsCenterState>((set, get) => ({
  ordersQueue: new Queue<Order>(),
  queueSnapshot: [],
  assignmentsStack: new Stack<AssignmentAction>(),
  stackSnapshot: [],
  activeAssignments: [],
  isSimulationRunning: false,
  simulationIntervalId: null,
  startSimulation: () => {
    const state = get();
    if (state.isSimulationRunning) {
      return;
    }

    const intervalId = window.setInterval(() => {
      get().enqueueRandomOrder();
    }, 3000);

    set({ isSimulationRunning: true, simulationIntervalId: intervalId });
  },
  stopSimulation: () => {
    const state = get();
    if (state.simulationIntervalId !== null) {
      window.clearInterval(state.simulationIntervalId);
    }
    set({ isSimulationRunning: false, simulationIntervalId: null });
  },
  enqueueRandomOrder: () => {
    const state = get();
    const order = createRandomOrder();
    state.ordersQueue.enqueue(order);
    set({ queueSnapshot: [...state.queueSnapshot, order] });
  },
  processNextOrder: () => {
    const state = get();
    const next = state.ordersQueue.dequeue();
    if (!next) {
      return;
    }

    const action: AssignmentAction = {
      id: crypto.randomUUID(),
      type: "ASSIGN",
      createdAt: Date.now(),
      order: next,
      truckCode: createTruckCode(),
    };

    state.assignmentsStack.push(action);

    set({
      queueSnapshot: state.queueSnapshot.slice(1),
      stackSnapshot: [action, ...state.stackSnapshot],
      activeAssignments: [action, ...state.activeAssignments],
    });
  },
  undoLastAction: () => {
    const state = get();
    const lastAction = state.assignmentsStack.pop();
    if (!lastAction) {
      return;
    }

    if (lastAction.type === "ASSIGN") {
      const restoredOrder = lastAction.order;
      state.ordersQueue.enqueue(restoredOrder);

      set({
        stackSnapshot: state.stackSnapshot.filter((a) => a.id !== lastAction.id),
        activeAssignments: state.activeAssignments.filter((a) => a.id !== lastAction.id),
        queueSnapshot: [...state.queueSnapshot, restoredOrder],
      });
    }
  },
}));
