import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Activity, CheckCircle2, Factory, Hospital, MapPin, PackageOpen, Truck } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Surface } from "@/shared/ui/Surface";
import { Skeleton } from "@/shared/ui/Skeleton";
import type { WasteStage, WasteStageEvent, WasteStageId, WasteStageStatus } from "../models/WasteStage";
import { WasteTimeline, type WasteTimelineItem } from "../components/WasteTimeline";
import { TraceabilityMap } from "../components/TraceabilityMap";
import { RoutesService, type BackendRoute, type BackendStop } from "../services/RoutesService";
import type { LatLngExpression } from "leaflet";

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

  const [routes, setRoutes] = useState<BackendRoute[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>("");
  const [stops, setStops] = useState<BackendStop[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true);
  const [isLoadingStops, setIsLoadingStops] = useState(false);
  const routesService = useMemo(() => new RoutesService(), []);

  const [stageState, setStageState] = useState<StageState>({
    currentIndex: 0,
    events: {},
  });

  useEffect(() => {
    let mounted = true;
    async function loadRoutes() {
      setIsLoadingRoutes(true);
      try {
        const list = await routesService.getRoutes();
        if (!mounted) return;
        setRoutes(list);
        const firstId = list[0] ? String(extractRouteId(list[0]) ?? "") : "";
        if (firstId) {
          setSelectedRouteId(firstId);
        }
      } finally {
        if (!mounted) return;
        setIsLoadingRoutes(false);
      }
    }
    void loadRoutes();
    return () => {
      mounted = false;
    };
  }, [routesService]);

  useEffect(() => {
    let mounted = true;
    async function loadStops() {
      if (!selectedRouteId) {
        setStops([]);
        return;
      }
      setIsLoadingStops(true);
      try {
        const list = await routesService.getStops(selectedRouteId);
        if (!mounted) return;
        setStops(list);
      } catch {
        if (!mounted) return;
        setStops([]);
      } finally {
        if (!mounted) return;
        setIsLoadingStops(false);
      }
    }
    void loadStops();
    return () => {
      mounted = false;
    };
  }, [routesService, selectedRouteId]);

  const mapPoints = useMemo(() => {
    const geoStops = stops
      .map((s) => ({ stop: s, pos: extractLatLng(s) }))
      .filter((x): x is { stop: BackendStop; pos: LatLngExpression } => Boolean(x.pos));

    if (geoStops.length < 2) {
      return undefined;
    }

    const first = geoStops[0]!;
    const second = geoStops[Math.min(1, geoStops.length - 1)]!;
    const third = geoStops[Math.min(2, geoStops.length - 1)]!;
    const last = geoStops[geoStops.length - 1]!;

    return [
      { id: "GENERATED" as const, label: "Hospital", position: first.pos },
      { id: "COLLECTION" as const, label: "En Recolección", position: second.pos },
      { id: "TREATMENT" as const, label: "Planta de Tratamiento", position: third.pos },
      { id: "DISPOSAL" as const, label: "Disposición Final", position: last.pos },
    ];
  }, [stops]);

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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-700 dark:text-white/70">Ruta</div>
            {isLoadingRoutes ? (
              <Skeleton className="h-10 w-44" />
            ) : (
              <select
                value={selectedRouteId}
                onChange={(e) => setSelectedRouteId(e.target.value)}
                className="h-10 rounded-xl border border-slate-300/80 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-white/10 dark:text-white"
              >
                {routes.map((r, idx) => {
                  const id = extractRouteId(r);
                  const label = extractRouteLabel(r, idx);
                  return (
                    <option key={String(id ?? idx)} value={String(id ?? "")}>
                      {label}
                    </option>
                  );
                })}
              </select>
            )}
          </div>

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
                {isLoadingStops ? "Cargando paradas de la ruta..." : "Ruta y camión en tiempo real."}
              </div>
            </div>
            <TraceabilityMap
              isTracking={isTracking}
              animationKey={animationKey}
              onMilestone={handleMilestone}
              onCompleted={handleCompleted}
              {...(mapPoints ? { customPoints: mapPoints } : {})}
            />
          </Surface>
        </motion.div>
      </div>
    </div>
  );
}

function extractRouteId(route: BackendRoute): unknown {
  return route["id"] ?? route["routeId"] ?? route["uuid"] ?? route["_id"];
}

function extractRouteLabel(route: BackendRoute, index: number): string {
  const id = extractRouteId(route);
  const name = route["name"] ?? route["code"] ?? route["label"];
  if (name) {
    return String(name);
  }
  if (id) {
    return `Ruta ${String(id)}`;
  }
  return `Ruta ${index + 1}`;
}

function extractLatLng(stop: BackendStop): LatLngExpression | null {
  const lat = stop["lat"] ?? stop["latitude"] ?? stop["y"];
  const lng = stop["lng"] ?? stop["lon"] ?? stop["longitude"] ?? stop["x"];

  const latN = Number(lat);
  const lngN = Number(lng);
  if (!Number.isFinite(latN) || !Number.isFinite(lngN)) {
    return null;
  }
  return [latN, lngN];
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
