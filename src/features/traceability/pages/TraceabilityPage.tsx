import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Activity, CheckCircle2, Factory, Hospital, MapPin, PackageOpen, Truck } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Surface } from "@/shared/ui/Surface";
import type { WasteStage, WasteStageEvent, WasteStageId, WasteStageStatus } from "../models/WasteStage";
import { WasteTimeline, type WasteTimelineItem } from "../components/WasteTimeline";
import { SimulatedMap } from "../components/SimulatedMap";

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
  const timeoutsRef = useRef<number[]>([]);

  const [stageState, setStageState] = useState<StageState>({
    currentIndex: 0,
    events: {},
  });

  useEffect(() => {
    return () => {
      for (const id of timeoutsRef.current) {
        window.clearTimeout(id);
      }
      timeoutsRef.current = [];
    };
  }, []);

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

    for (const id of timeoutsRef.current) {
      window.clearTimeout(id);
    }
    timeoutsRef.current = [];

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

    const stepMs = 2500;
    const t1 = window.setTimeout(() => {
      setStageState((prev) => ({
        currentIndex: Math.max(prev.currentIndex, 2),
        events: {
          ...prev.events,
          COLLECTION: prev.events.COLLECTION ?? { stageId: "COLLECTION", timestamp: Date.now() },
        },
      }));
    }, stepMs);

    const t2 = window.setTimeout(() => {
      setStageState((prev) => ({
        currentIndex: Math.max(prev.currentIndex, 3),
        events: {
          ...prev.events,
          TREATMENT: prev.events.TREATMENT ?? { stageId: "TREATMENT", timestamp: Date.now() },
        },
      }));
    }, stepMs * 2);

    const t3 = window.setTimeout(() => {
      setStageState((prev) => ({
        currentIndex: stages.length,
        events: {
          ...prev.events,
          DISPOSAL: prev.events.DISPOSAL ?? { stageId: "DISPOSAL", timestamp: Date.now() },
        },
      }));
      setIsTracking(false);
    }, stepMs * 3);

    timeoutsRef.current = [t1, t2, t3];
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
              <div className="text-base font-semibold">Mapa Simulado</div>
                <div className="text-sm text-slate-700 dark:text-white/60">Hospital → Recolección → Planta → Disposición</div>
            </div>
            <SimulatedMap isTracking={isTracking} animationKey={animationKey} />
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
