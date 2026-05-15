import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  CirclePlus,
  Factory,
  Hospital,
  MapPin,
  PackageOpen,
  Pencil,
  RefreshCw,
  Trash2,
  Truck,
} from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { Surface } from "@/shared/ui/Surface";
import { Skeleton } from "@/shared/ui/Skeleton";
import { JsonEditor } from "@/shared/ui/JsonEditor";
import { JsonViewer } from "@/shared/ui/JsonViewer";
import type { WasteStage, WasteStageEvent, WasteStageId, WasteStageStatus } from "../models/WasteStage";
import { WasteTimeline, type WasteTimelineItem } from "../components/WasteTimeline";
import { TraceabilityMap } from "../components/TraceabilityMap";
import { RoutesService, type BackendRoute, type BackendStop } from "../services/RoutesService";
import type { LatLngExpression } from "leaflet";
import { demoRoutes } from "../data/demoRoutes";

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

  const [isCreateRouteOpen, setIsCreateRouteOpen] = useState(false);
  const [isCreateStopOpen, setIsCreateStopOpen] = useState(false);
  const [editRoute, setEditRoute] = useState<BackendRoute | null>(null);
  const [editStop, setEditStop] = useState<BackendStop | null>(null);
  const [viewJson, setViewJson] = useState<unknown | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedStopId, setSelectedStopId] = useState<string>("");

  const [mapPickMode, setMapPickMode] = useState<"none" | "route" | "stop">("none");
  const [pendingFirstStop, setPendingFirstStop] = useState<{ lat: number; lng: number } | null>(null);
  const [createRouteInitial, setCreateRouteInitial] = useState<unknown>({
    name: "Ruta",
    code: `R-${Date.now()}`,
    status: "ACTIVE",
  });
  const [createStopInitial, setCreateStopInitial] = useState<unknown>({
    name: "Parada",
    lat: 1.2136,
    lng: -77.2811,
    stage: "COLLECTION",
  });

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
        const safeList = list.length ? list : demoRoutes;
        setRoutes(safeList);
        const hasSelected = selectedRouteId
          ? safeList.some((r) => String(extractRouteId(r) ?? "") === selectedRouteId)
          : false;

        if (!selectedRouteId || !hasSelected) {
          const firstId = safeList[0] ? String(extractRouteId(safeList[0]) ?? "") : "";
          setSelectedRouteId(firstId);
        }
      } catch {
        if (!mounted) return;
        setRoutes(demoRoutes);
        if (!selectedRouteId) {
          setSelectedRouteId(String(extractRouteId(demoRoutes[0]!) ?? ""));
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
  }, [routesService, selectedRouteId]);

  useEffect(() => {
    let mounted = true;
    async function loadStops() {
      if (!selectedRouteId) {
        setStops([]);
        setSelectedStopId("");
        return;
      }

      setIsLoadingStops(true);
      try {
        const list = await routesService.getStops(selectedRouteId);
        if (!mounted) return;
        setStops(list);
        if (selectedStopId) {
          const exists = list.some((s) => String(extractStopId(s) ?? "") === selectedStopId);
          if (!exists) {
            setSelectedStopId("");
          }
        }
      } catch {
        if (!mounted) return;
        setStops([]);
        setSelectedStopId("");
      } finally {
        if (!mounted) return;
        setIsLoadingStops(false);
      }
    }
    void loadStops();
    return () => {
      mounted = false;
    };
  }, [routesService, selectedRouteId, selectedStopId]);

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

  const mapWaypoints = useMemo(() => {
    return stops
      .map((s) => ({ stop: s, pos: extractLatLng(s), label: extractStopLabel(s) }))
      .filter((x): x is { stop: BackendStop; pos: LatLngExpression; label: string } => Boolean(x.pos));
  }, [stops]);

  const selectedWaypointIndex = useMemo(() => {
    if (!selectedStopId) return -1;
    return mapWaypoints.findIndex((w) => String(extractStopId(w.stop) ?? "") === selectedStopId);
  }, [mapWaypoints, selectedStopId]);

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

  async function refreshRoutes() {
    setIsLoadingRoutes(true);
    try {
      const list = await routesService.getRoutes();
      const safeList = list.length ? list : demoRoutes;
      setRoutes(safeList);
      if (selectedRouteId) {
        const exists = safeList.some((r) => String(extractRouteId(r) ?? "") === selectedRouteId);
        if (!exists) {
          const firstId = safeList[0] ? String(extractRouteId(safeList[0]) ?? "") : "";
          setSelectedRouteId(firstId);
          setSelectedStopId("");
        }
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudieron cargar rutas.");
      setRoutes(demoRoutes);
    } finally {
      setIsLoadingRoutes(false);
    }
  }

  async function refreshStops() {
    if (!selectedRouteId) {
      setStops([]);
      setSelectedStopId("");
      return;
    }

    setIsLoadingStops(true);
    try {
      const list = await routesService.getStops(selectedRouteId);
      setStops(list);
      if (selectedStopId) {
        const exists = list.some((s) => String(extractStopId(s) ?? "") === selectedStopId);
        if (!exists) {
          setSelectedStopId("");
        }
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudieron cargar paradas.");
      setStops([]);
      setSelectedStopId("");
    } finally {
      setIsLoadingStops(false);
    }
  }

  async function refreshAll() {
    await refreshRoutes();
    await refreshStops();
  }

  async function createRoute(payload: unknown) {
    setIsSubmitting(true);
    try {
      const created = await routesService.createRoute(payload);
      toast.success("Ruta creada.");
      setIsCreateRouteOpen(false);
      await refreshRoutes();
      const id = extractRouteId(created);
      if (id) {
        setSelectedRouteId(String(id));

        if (pendingFirstStop) {
          const { lat, lng } = pendingFirstStop;
          setPendingFirstStop(null);
          try {
            await routesService.createStop(String(id), {
              name: "Parada inicial",
              lat,
              lng,
              stage: "GENERATED",
            });
            toast.success("Parada inicial agregada.");
            await refreshStops();
          } catch {
            toast("Ruta creada. No se pudo crear la parada inicial automáticamente.", { icon: "ℹ️" });
          }
        }
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudo crear la ruta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function updateRoute(payload: unknown) {
    if (!editRoute) return;
    const id = extractRouteId(editRoute);
    if (!id) {
      toast.error("No se pudo detectar el ID de la ruta.");
      return;
    }
    setIsSubmitting(true);
    try {
      await routesService.updateRoute(String(id), payload);
      toast.success("Ruta actualizada.");
      setEditRoute(null);
      await refreshRoutes();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudo actualizar la ruta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeRoute() {
    if (!selectedRouteId) return;
    setIsSubmitting(true);
    try {
      await routesService.deleteRoute(selectedRouteId);
      toast.success("Ruta eliminada.");
      setSelectedRouteId("");
      setStops([]);
      await refreshRoutes();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar la ruta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function createStop(payload: unknown) {
    if (!selectedRouteId) {
      toast.error("Selecciona una ruta primero.");
      return;
    }
    setIsSubmitting(true);
    try {
      await routesService.createStop(selectedRouteId, payload);
      toast.success("Parada creada.");
      setIsCreateStopOpen(false);
      await refreshStops();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudo crear la parada.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleMapPick(pos: { lat: number; lng: number }) {
    if (mapPickMode === "route") {
      setPendingFirstStop(pos);
      setCreateRouteInitial({
        name: "Ruta (Pasto)",
        code: `R-${Date.now()}`,
        status: "ACTIVE",
      });
      setIsCreateRouteOpen(true);
      setMapPickMode("none");
      toast.success("Ubicación capturada. Completa los datos de la ruta.");
      return;
    }

    if (mapPickMode === "stop") {
      setCreateStopInitial({
        name: `Parada ${stops.length + 1}`,
        lat: pos.lat,
        lng: pos.lng,
        stage: "COLLECTION",
      });
      setIsCreateStopOpen(true);
      setMapPickMode("none");
      toast.success("Ubicación capturada. Completa los datos de la parada.");
    }
  }

  async function updateStop(payload: unknown) {
    if (!selectedRouteId || !editStop) return;
    const id = extractStopId(editStop);
    if (!id) {
      toast.error("No se pudo detectar el ID de la parada.");
      return;
    }
    setIsSubmitting(true);
    try {
      await routesService.updateStop(selectedRouteId, String(id), payload);
      toast.success("Parada actualizada.");
      setEditStop(null);
      await refreshStops();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudo actualizar la parada.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function removeStop(stop: BackendStop) {
    if (!selectedRouteId) return;
    const id = extractStopId(stop);
    if (!id) {
      toast.error("No se pudo detectar el ID de la parada.");
      return;
    }
    setIsSubmitting(true);
    try {
      await routesService.deleteStop(selectedRouteId, String(id));
      toast.success("Parada eliminada.");
      await refreshStops();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudo eliminar la parada.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function moveStop(index: number, direction: -1 | 1) {
    if (!selectedRouteId) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= stops.length) return;

    const copy = stops.slice();
    const tmp = copy[index]!;
    copy[index] = copy[nextIndex]!;
    copy[nextIndex] = tmp;
    setStops(copy);

    const ids = copy
      .map((s) => extractStopId(s))
      .filter((x): x is string | number => x !== null && x !== undefined)
      .map((x) => String(x));
    if (ids.length !== copy.length) {
      return;
    }
    try {
      await routesService.reorderStops(selectedRouteId, ids);
    } catch {
      toast("Orden actualizado solo en la vista (backend no soporta reorder).", { icon: "ℹ️" });
    }
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
          <Button type="button" variant="secondary" onClick={() => void refreshAll()} disabled={isLoadingRoutes || isLoadingStops}>
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>

          <Button type="button" onClick={startTracking} isLoading={isTracking} disabled={isTracking || !selectedRouteId}>
            <Activity className="h-4 w-4" />
            {isTracking ? "Rastreando..." : "Iniciar Rastreo"}
          </Button>
          <Button type="button" variant="secondary" onClick={reset} disabled={isTracking}>
            Reiniciar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
          <Surface className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold">Rutas</div>
                <div className="mt-1 text-sm text-slate-700 dark:text-white/60">Selecciona una ruta o crea una nueva.</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setMapPickMode("route");
                    toast("Haz clic en el mapa para elegir el punto inicial de la ruta.", { icon: "🗺️" });
                  }}
                >
                  <MapPin className="h-4 w-4" />
                  En mapa
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setCreateRouteInitial({ name: "Ruta", code: `R-${Date.now()}`, status: "ACTIVE" });
                    setIsCreateRouteOpen(true);
                  }}
                >
                  <CirclePlus className="h-4 w-4" />
                  Nueva
                </Button>
              </div>
            </div>

            <div className="mt-4">
              {isLoadingRoutes ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <select
                  value={selectedRouteId}
                  onChange={(e) => {
                    setSelectedRouteId(e.target.value);
                    setSelectedStopId("");
                  }}
                  className="h-10 w-full rounded-xl border border-slate-300/80 bg-white px-3 text-sm text-slate-900 dark:border-white/15 dark:bg-white/10 dark:text-white"
                >
                  <option value="">Selecciona una ruta…</option>
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

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const route = routes.find((r) => String(extractRouteId(r) ?? "") === selectedRouteId) ?? null;
                  setEditRoute(route);
                }}
                disabled={!selectedRouteId}
              >
                <Pencil className="h-4 w-4" />
                Editar
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setViewJson(routes.find((r) => String(extractRouteId(r) ?? "") === selectedRouteId) ?? null)}
                disabled={!selectedRouteId}
              >
                Ver JSON
              </Button>
              <Button type="button" variant="secondary" onClick={() => void removeRoute()} disabled={!selectedRouteId || isSubmitting}>
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </div>

            <div className="mt-6 flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold">Paradas</div>
                <div className="mt-1 text-sm text-slate-700 dark:text-white/60">Ordena y edita los puntos de la ruta.</div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    if (!selectedRouteId) {
                      toast.error("Selecciona una ruta primero.");
                      return;
                    }
                    setMapPickMode("stop");
                    toast("Haz clic en el mapa para agregar una parada.", { icon: "📍" });
                  }}
                  disabled={!selectedRouteId}
                >
                  <MapPin className="h-4 w-4" />
                  En mapa
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setCreateStopInitial({ name: "Parada", lat: 1.2136, lng: -77.2811, stage: "COLLECTION" });
                    setIsCreateStopOpen(true);
                  }}
                  disabled={!selectedRouteId}
                >
                  <CirclePlus className="h-4 w-4" />
                  Agregar
                </Button>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {isLoadingStops ? (
                Array.from({ length: 6 }).map((_, i) => <Skeleton key={`sk-stop-${i}`} className="h-12 w-full" />)
              ) : stops.length ? (
                stops.map((s, idx) => (
                  <div
                    key={String(extractStopId(s) ?? idx)}
                    className={
                      String(extractStopId(s) ?? "") === selectedStopId
                        ? "cursor-pointer rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 dark:border-emerald-200/20 dark:bg-emerald-400/10"
                        : "cursor-pointer rounded-2xl border border-slate-200/70 bg-slate-900/5 px-4 py-3 hover:bg-slate-900/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
                    }
                    onClick={() => {
                      const id = extractStopId(s);
                      if (!id) return;
                      setSelectedStopId(String(id));
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{extractStopLabel(s) || `Parada ${idx + 1}`}</div>
                        <div className="mt-1 text-xs text-slate-700 dark:text-white/60">{formatLatLng(s)}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="rounded-xl p-2 text-slate-700 hover:bg-slate-900/5 dark:text-white/80 dark:hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            void moveStop(idx, -1);
                          }}
                          aria-label="Subir"
                          disabled={idx === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-xl p-2 text-slate-700 hover:bg-slate-900/5 dark:text-white/80 dark:hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            void moveStop(idx, 1);
                          }}
                          aria-label="Bajar"
                          disabled={idx === stops.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-xl p-2 text-slate-700 hover:bg-slate-900/5 dark:text-white/80 dark:hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditStop(s);
                          }}
                          aria-label="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="rounded-xl p-2 text-rose-600/90 hover:bg-rose-500/10 dark:text-rose-100/80"
                          onClick={(e) => {
                            e.stopPropagation();
                            void removeStop(s);
                          }}
                          aria-label="Eliminar"
                          disabled={isSubmitting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          setViewJson(s);
                        }}
                      >
                        Ver JSON
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-700 dark:text-white/70">No hay paradas registradas.</div>
              )}
            </div>
          </Surface>
        </motion.div>

        <div className="grid gap-4 lg:col-span-2 lg:grid-cols-2">
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

          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: 0.06 }} className="lg:col-span-2">
            <Surface className="p-4 sm:p-6">
              <div className="mb-4">
                <div className="text-base font-semibold">Mapa de Trazabilidad</div>
                <div className="text-sm text-slate-700 dark:text-white/60">
                  {isLoadingStops ? "Cargando paradas de la ruta..." : "Ruta y camión en tiempo real."}
                </div>
              </div>
              {mapPickMode !== "none" ? (
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-200/15 dark:bg-emerald-400/10 dark:text-emerald-100">
                  <div>
                    {mapPickMode === "route"
                      ? "Modo mapa: selecciona el punto inicial de la nueva ruta."
                      : "Modo mapa: selecciona la ubicación de la nueva parada."}
                  </div>
                  <Button type="button" variant="secondary" onClick={() => setMapPickMode("none")}>
                    Cancelar
                  </Button>
                </div>
              ) : null}
              <TraceabilityMap
                isTracking={isTracking}
                animationKey={animationKey}
                onMilestone={handleMilestone}
                onCompleted={handleCompleted}
                {...(mapPoints ? { customPoints: mapPoints } : {})}
                waypoints={mapWaypoints.map((w) => ({ label: w.label, position: w.pos }))}
                {...(mapPickMode === "none" ? {} : { onMapClick: handleMapPick })}
                clickHint={
                  mapPickMode === "route"
                    ? "Haz clic para ubicar el inicio de la ruta"
                    : mapPickMode === "stop"
                      ? "Haz clic para ubicar la nueva parada"
                      : null
                }
                draftMarker={
                  pendingFirstStop && mapPickMode === "none"
                    ? { label: "Inicio", position: [pendingFirstStop.lat, pendingFirstStop.lng] }
                    : null
                }
                {...(selectedWaypointIndex >= 0 ? { selectedWaypointIndex } : {})}
              />
            </Surface>
          </motion.div>
        </div>
      </div>

      <Dialog isOpen={isCreateRouteOpen} title="Nueva ruta" onClose={() => setIsCreateRouteOpen(false)}>
        <JsonEditor
          initialValue={createRouteInitial}
          onSubmit={createRoute}
          submitLabel="Crear"
          isSubmitting={isSubmitting}
        />
      </Dialog>

      <Dialog isOpen={Boolean(editRoute)} title="Editar ruta" onClose={() => setEditRoute(null)}>
        <JsonEditor initialValue={editRoute ?? {}} onSubmit={updateRoute} submitLabel="Guardar" isSubmitting={isSubmitting} />
      </Dialog>

      <Dialog isOpen={isCreateStopOpen} title="Nueva parada" onClose={() => setIsCreateStopOpen(false)}>
        <JsonEditor
          initialValue={createStopInitial}
          onSubmit={createStop}
          submitLabel="Crear"
          isSubmitting={isSubmitting}
        />
      </Dialog>

      <Dialog isOpen={Boolean(editStop)} title="Editar parada" onClose={() => setEditStop(null)}>
        <JsonEditor initialValue={editStop ?? {}} onSubmit={updateStop} submitLabel="Guardar" isSubmitting={isSubmitting} />
      </Dialog>

      <Dialog isOpen={Boolean(viewJson)} title="JSON" onClose={() => setViewJson(null)}>
        <JsonViewer value={viewJson} />
      </Dialog>
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

function extractStopId(stop: BackendStop): unknown {
  return stop["id"] ?? stop["stopId"] ?? stop["uuid"] ?? stop["_id"];
}

function extractStopLabel(stop: BackendStop): string {
  const name = stop["name"] ?? stop["label"] ?? stop["title"];
  return name ? String(name) : "";
}

function formatLatLng(stop: BackendStop): string {
  const pos = extractLatLng(stop);
  if (!pos) return "Sin coordenadas";
  const t = pos as [number, number];
  return `${t[0].toFixed(5)}, ${t[1].toFixed(5)}`;
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
