import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, CheckCircle2, Factory, Hospital, MapPin, PackageOpen, Truck } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Surface } from "@/shared/ui/Surface";
import type { WasteStage, WasteStageEvent, WasteStageId, WasteStageStatus } from "../models/WasteStage";
import { WasteTimeline, type WasteTimelineItem } from "../components/WasteTimeline";
import { TraceabilityMap } from "../components/TraceabilityMap";

type StageState = {
  currentIndex: number;
  events: Partial<Record<WasteStageId, WasteStageEvent>>;
};

export function TraceabilityPage() {
  const stages: WasteStage[] = useMemo(
    () => [
      { id: "GENERATED", label: "Generado" },
      { id: "COLLECTION", label: "En Recolección" },
      { id: "TREATMENT", label: "En Planta de Tratamiento" },
      { id: "DISPOSAL", label: "Disposición Final" },
    ],
    []
  );

  const [isTracking, setIsTracking] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const [stageState, setStageState] = useState<StageState>({
    currentIndex: 0,
    events: {},
  });

  const timelineItems = useMemo<WasteTimelineItem[]>(() => {
    return stages.map((stage, index) => {
      const timestamp = stageState.events[stage.id]?.timestamp ?? null;
      const status = resolveStatus(index, stageState.currentIndex, stages.length);
      return {
        id: stage.id,
        label: stage.label,
        timestamp,
        status,
        icon: stageIcon(stage.id, status),
      };
    });
  }, [stages, stageState.currentIndex, stageState.events]);

  function startTracking() {
    if (isTracking) {
      return;
    }

    const now = Date.now();
    setStageState((prev) => ({
      currentIndex: Math.max(prev.currentIndex, 1),
      events: {
        ...prev.events,
        GENERATED: prev.events.GENERATED ?? { stageId: "GENERATED", timestamp: now },
      },
    }));

    setIsTracking(true);
    setAnimationKey((k) => k + 1);
  }

  function handleMilestone(stageId: WasteStageId) {
    const index = stages.findIndex((s) => s.id === stageId);
    if (index < 0) {
      return;
    }

    setStageState((prev) => {
      const nextCurrentIndex = Math.max(prev.currentIndex, Math.min(stages.length, index + 1));
      const existing = prev.events[stageId];
      const nextEvents: Partial<Record<WasteStageId, WasteStageEvent>> = existing
        ? prev.events
        : { ...prev.events, [stageId]: { stageId, timestamp: Date.now() } };
      return { currentIndex: nextCurrentIndex, events: nextEvents };
    });

    if (stageId === "DISPOSAL") {
      setIsTracking(false);
    }
  }

  function handleCompleted() {
    setIsTracking(false);
    setStageState((prev) => ({ ...prev, currentIndex: stages.length }));
  }

  function reset() {
    if (isTracking) {
      return;
    }
    setStageState({ currentIndex: 0, events: {} });
    setAnimationKey((k) => k + 1);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-semibold">Trazabilidad de Residuos</h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-white/70">
            Rastrea el ciclo de vida de un lote: recolección, tratamiento y disposición final.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" onClick={startTracking} isLoading={isTracking} disabled={isTracking}>
            <Activity className="h-4 w-4" />
            {isTracking ? "Rastreando..." : "Iniciar Rastreo"}
          </Button>
          <Button type="button" variant="secondary" onClick={reset} disabled={isTracking}>
            Reiniciar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <Surface className="p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-base font-semibold">WasteTimeline</div>
                <div className="text-sm text-slate-700 dark:text-white/60">Estados del lote y marcas de tiempo</div>
              </div>
              <div className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200/70 bg-slate-900/5 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                <PackageOpen className="h-4 w-4" />
                Lote: DEMO-001
              </div>
            </div>

            <WasteTimeline items={timelineItems} />
          </Surface>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.06 }}>
          <Surface className="p-4 sm:p-6">
            <div className="mb-4">
              <div className="text-base font-semibold">Mapa de Trazabilidad</div>
              <div className="text-sm text-slate-700 dark:text-white/60">
                Ruta y camión en tiempo real (demo).
              </div>
            </div>
            <TraceabilityMap
              isTracking={isTracking}
              animationKey={animationKey}
              onMilestone={handleMilestone}
              onCompleted={handleCompleted}
            />
          </Surface>
        </motion.div>
      </div>
    </div>
  );
}

function resolveStatus(index: number, currentIndex: number, total: number): WasteStageStatus {
  if (currentIndex >= total) {
    return "completed";
  }
  if (index < currentIndex) {
    return "completed";
  }
  if (index === currentIndex) {
    return "current";
  }
  return "pending";
}

function stageIcon(stageId: WasteStageId, status: WasteStageStatus) {
  const sizeClass = "h-5 w-5";
  if (status === "completed") {
    return <CheckCircle2 className={sizeClass} />;
  }

  if (stageId === "GENERATED") return <Hospital className={sizeClass} />;
  if (stageId === "COLLECTION") return <Truck className={sizeClass} />;
  if (stageId === "TREATMENT") return <Factory className={sizeClass} />;
  return <MapPin className={sizeClass} />;
}
