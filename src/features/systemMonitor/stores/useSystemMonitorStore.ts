import { create } from "zustand";
import { FixedArray } from "@/core/structures";
import type { SystemLog, SystemLogLevel } from "../models/SystemLog";

type SystemMonitorState = {
  logsBuffer: FixedArray<SystemLog>;
  logsSnapshot: SystemLog[];
  isRunning: boolean;
  intervalId: number | null;
  start: () => void;
  stop: () => void;
  pushRandomLog: () => void;
  clear: () => void;
};

function createRandomLog(): SystemLog {
  const levels: SystemLogLevel[] = ["INFO", "WARNING", "ERROR", "CONNECTION"];
  const sources = ["api-gateway", "orders-service", "auth-service", "database", "dispatch-service"];
  const messagesByLevel: Record<SystemLogLevel, string[]> = {
    INFO: [
      "Heartbeat OK.",
      "Sincronización completada.",
      "Latencia dentro de parámetros.",
      "Nueva configuración aplicada.",
    ],
    WARNING: [
      "Tiempo de respuesta elevado.",
      "Reintento de conexión programado.",
      "Uso de CPU por encima del 75%.",
      "Cola de órdenes creciendo.",
    ],
    ERROR: [
      "Error 500 al consultar recursos.",
      "Fallo al persistir auditoría.",
      "Token inválido recibido.",
      "Timeout en operación crítica.",
    ],
    CONNECTION: [
      "Conexión al backend intermitente.",
      "WebSocket desconectado.",
      "Restableciendo canal seguro.",
      "Handshake fallido.",
    ],
  };

  const level = levels[Math.floor(Math.random() * levels.length)]!;
  const source = sources[Math.floor(Math.random() * sources.length)]!;
  const messagePool = messagesByLevel[level];
  const message = messagePool[Math.floor(Math.random() * messagePool.length)]!;

  return {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    level,
    source,
    message,
  };
}

export const useSystemMonitorStore = create<SystemMonitorState>((set, get) => ({
  logsBuffer: new FixedArray<SystemLog>(10),
  logsSnapshot: [],
  isRunning: false,
  intervalId: null,
  start: () => {
    const state = get();
    if (state.isRunning) {
      return;
    }
    const intervalId = window.setInterval(() => {
      get().pushRandomLog();
    }, 1600);
    set({ isRunning: true, intervalId });
  },
  stop: () => {
    const state = get();
    if (state.intervalId !== null) {
      window.clearInterval(state.intervalId);
    }
    set({ isRunning: false, intervalId: null });
  },
  pushRandomLog: () => {
    const state = get();
    const log = createRandomLog();
    state.logsBuffer.add(log);
    set({ logsSnapshot: state.logsBuffer.getAll() });
  },
  clear: () => {
    set({ logsBuffer: new FixedArray<SystemLog>(10), logsSnapshot: [] });
  },
}));
