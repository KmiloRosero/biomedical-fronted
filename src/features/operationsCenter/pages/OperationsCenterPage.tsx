import { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownToLine,
  ClipboardList,
  CornerDownLeft,
  Timer,
  Trash2,
  Truck,
} from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Surface } from "@/shared/ui/Surface";
import { cn } from "@/lib/utils";
import { useOperationsCenterStore } from "../stores/useOperationsCenterStore";
import type { Order } from "../models/Order";
import type { AssignmentAction } from "../models/AssignmentAction";

export function OperationsCenterPage() {
  const queueSnapshot = useOperationsCenterStore((s) => s.queueSnapshot);
  const stackSnapshot = useOperationsCenterStore((s) => s.stackSnapshot);
  const activeAssignments = useOperationsCenterStore((s) => s.activeAssignments);
  const isSimulationRunning = useOperationsCenterStore((s) => s.isSimulationRunning);
  const startSimulation = useOperationsCenterStore((s) => s.startSimulation);
  const stopSimulation = useOperationsCenterStore((s) => s.stopSimulation);
  const processNextOrder = useOperationsCenterStore((s) => s.processNextOrder);
  const undoLastAction = useOperationsCenterStore((s) => s.undoLastAction);
  const enqueueRandomOrder = useOperationsCenterStore((s) => s.enqueueRandomOrder);

  useEffect(() => {
    startSimulation();
    return () => {
      stopSimulation();
    };
  }, [startSimulation, stopSimulation]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        undoLastAction();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undoLastAction]);

  const headerBadge = useMemo(() => {
    return isSimulationRunning ? "En vivo" : "Pausado";
  }, [isSimulationRunning]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-semibold">Centro de Operaciones y Despacho</h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-white/70">
            Demostración de cola (FIFO) para órdenes y pila (LIFO) para deshacer asignaciones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm",
              isSimulationRunning
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                : "border-slate-200/70 bg-slate-900/5 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
            )}
          >
            <Timer className="h-4 w-4" />
            {headerBadge}
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => (isSimulationRunning ? stopSimulation() : startSimulation())}
          >
            {isSimulationRunning ? "Pausar" : "Reanudar"}
          </Button>
          <Button type="button" variant="secondary" onClick={enqueueRandomOrder}>
            Nueva orden
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <QueuePanel orders={queueSnapshot} onProcessNext={processNextOrder} />
        <StackPanel
          actions={stackSnapshot}
          activeAssignments={activeAssignments}
          onUndo={undoLastAction}
        />
      </div>
    </div>
  );
}

function QueuePanel({
  orders,
  onProcessNext,
}: {
  orders: Order[];
  onProcessNext: () => void;
}) {
  return (
    <Surface className="p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-700 dark:text-emerald-200" />
            <h3 className="text-base font-semibold">Monitor de Órdenes de Recolección</h3>
          </div>
          <p className="mt-1 text-sm text-slate-700 dark:text-white/60">FIFO: la primera orden en entrar es la primera en salir.</p>
        </div>
        <Button type="button" className="shrink-0" onClick={onProcessNext}>
          <ArrowDownToLine className="h-4 w-4" />
          Procesar siguiente
        </Button>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-sm text-slate-700 dark:text-white/70">
          <span>Fila de camiones esperando asignación</span>
          <span className="rounded-lg bg-slate-900/5 px-2 py-1 text-xs dark:bg-white/5">{orders.length}</span>
        </div>

        <div className="space-y-2">
          <AnimatePresence initial={false}>
            {orders.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-dashed border-slate-200/70 bg-slate-900/5 p-6 text-center text-sm text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-white/60"
              >
                No hay órdenes en cola.
              </motion.div>
            ) : (
              orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 40, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className={cn(
                    "flex items-start justify-between gap-3 rounded-2xl border bg-slate-900/5 p-4 dark:bg-white/5",
                    index === 0 ? "border-emerald-400/30" : "border-slate-200/70 dark:border-white/10"
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-slate-900/5 px-2 py-1 text-xs text-slate-700 dark:bg-white/10 dark:text-white/80">
                        #{index + 1}
                      </span>
                      <span className={cn("text-xs", priorityClass(order.priority))}>
                        {priorityLabel(order.priority)}
                      </span>
                      <span className={cn("text-xs", categoryClass(order.wasteCategory))}>
                        {categoryLabel(order.wasteCategory)}
                      </span>
                    </div>
                    <div className="mt-2 truncate text-sm font-medium text-slate-900 dark:text-white">
                      {order.generatorUnit}
                    </div>
                    <div className="mt-1 text-xs text-slate-700 dark:text-white/60">Orden: {order.id.slice(0, 8)}…</div>
                  </div>
                  <div className="shrink-0 text-right text-xs text-slate-700 dark:text-white/60">
                    <div className="flex items-center justify-end gap-1">
                      <ClipboardList className="h-4 w-4" />
                      En espera
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </Surface>
  );
}

function StackPanel({
  actions,
  activeAssignments,
  onUndo,
}: {
  actions: AssignmentAction[];
  activeAssignments: AssignmentAction[];
  onUndo: () => void;
}) {
  const canUndo = actions.length > 0;

  return (
    <Surface className="p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CornerDownLeft className="h-5 w-5 text-cyan-200" />
            <h3 className="text-base font-semibold">Gestor de Asignaciones y Reversiones</h3>
          </div>
          <p className="mt-1 text-sm text-slate-700 dark:text-white/60">LIFO: la última asignación se deshace primero.</p>
        </div>
        <Button
          type="button"
          className="shrink-0"
          onClick={onUndo}
          disabled={!canUndo}
        >
          <Trash2 className="h-4 w-4" />
          Deshacer Operación (Ctrl+Z)
        </Button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-700 dark:text-white/70">
            <span>Asignaciones activas</span>
            <span className="rounded-lg bg-slate-900/5 px-2 py-1 text-xs dark:bg-white/5">{activeAssignments.length}</span>
          </div>

          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {activeAssignments.length === 0 ? (
                <motion.div
                  key="empty-active"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-dashed border-slate-200/70 bg-slate-900/5 p-6 text-center text-sm text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-white/60"
                >
                  No hay asignaciones activas.
                </motion.div>
              ) : (
                activeAssignments.map((a) => (
                  <motion.div
                    key={a.id}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -40, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium">{a.truckCode}</div>
                      <div className="text-xs text-slate-700 dark:text-white/60">{a.order.id.slice(0, 8)}…</div>
                    </div>
                    <div className="mt-2 text-xs text-slate-700 dark:text-white/70">Unidad: {a.order.generatorUnit}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={cn("text-xs", priorityClass(a.order.priority))}>
                        {priorityLabel(a.order.priority)}
                      </span>
                      <span className={cn("text-xs", categoryClass(a.order.wasteCategory))}>
                        {categoryLabel(a.order.wasteCategory)}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-slate-700 dark:text-white/70">
            <span>Últimas asignaciones (pila)</span>
            <span className="rounded-lg bg-slate-900/5 px-2 py-1 text-xs dark:bg-white/5">{actions.length}</span>
          </div>
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {actions.length === 0 ? (
                <motion.div
                  key="empty-actions"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-2xl border border-dashed border-slate-200/70 bg-slate-900/5 p-6 text-center text-sm text-slate-700 dark:border-white/15 dark:bg-white/5 dark:text-white/60"
                >
                  No hay acciones registradas.
                </motion.div>
              ) : (
                actions.slice(0, 6).map((a, index) => (
                  <motion.div
                    key={a.id}
                    layout
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className={cn(
                      "rounded-2xl border bg-slate-900/5 p-4 dark:bg-white/5",
                      index === 0 ? "border-cyan-400/30" : "border-slate-200/70 dark:border-white/10"
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium">Asignación</div>
                      <div className="text-xs text-slate-700 dark:text-white/60">{a.truckCode}</div>
                    </div>
                    <div className="mt-2 text-xs text-slate-700 dark:text-white/70">Unidad: {a.order.generatorUnit}</div>
                    <div className="mt-1 text-xs text-slate-700 dark:text-white/60">Orden: {a.order.id.slice(0, 8)}…</div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Surface>
  );
}

function priorityLabel(priority: Order["priority"]) {
  if (priority === "HIGH") return "Alta";
  if (priority === "MEDIUM") return "Media";
  return "Baja";
}

function priorityClass(priority: Order["priority"]) {
  if (priority === "HIGH") return "rounded-lg bg-rose-500/15 px-2 py-1 text-rose-100";
  if (priority === "MEDIUM") return "rounded-lg bg-amber-500/15 px-2 py-1 text-amber-100";
  return "rounded-lg bg-emerald-500/15 px-2 py-1 text-emerald-100";
}

function categoryLabel(category: Order["wasteCategory"]) {
  if (category === "SHARPS") return "Cortopunzantes";
  if (category === "INFECTIOUS") return "Infecciosos";
  if (category === "PHARMACEUTICAL") return "Farmacéuticos";
  return "Químicos";
}

function categoryClass(category: Order["wasteCategory"]) {
  if (category === "SHARPS") return "rounded-lg bg-fuchsia-500/15 px-2 py-1 text-fuchsia-100";
  if (category === "INFECTIOUS") return "rounded-lg bg-sky-500/15 px-2 py-1 text-sky-100";
  if (category === "PHARMACEUTICAL") return "rounded-lg bg-indigo-500/15 px-2 py-1 text-indigo-100";
  return "rounded-lg bg-lime-500/15 px-2 py-1 text-lime-100";
}
