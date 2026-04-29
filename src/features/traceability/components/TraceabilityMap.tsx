import { useEffect, useMemo, useRef, useState } from "react";
import type { LatLngExpression } from "leaflet";
import L from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import type { WasteStageId } from "../models/WasteStage";

type TracePoint = {
  id: WasteStageId;
  label: string;
  position: LatLngExpression;
};

export type TraceabilityMapProps = {
  isTracking: boolean;
  animationKey: number;
  onMilestone: (stageId: WasteStageId) => void;
  onCompleted: () => void;
};

type AnimationCallbacks = {
  onPosition: (pos: LatLngExpression) => void;
  onMilestoneIndex: (index: number) => void;
  onCompleted: () => void;
};

class RouteAnimator {
  private rafId: number | null = null;
  private startTime: number | null = null;
  private lastMilestoneIndex = -1;

  public start(route: Array<[number, number]>, durationMs: number, callbacks: AnimationCallbacks) {
    this.stop();
    this.startTime = null;
    this.lastMilestoneIndex = -1;

    const cumulative = buildCumulativeDistances(route);
    const total = cumulative[cumulative.length - 1] ?? 0;
    const safeTotal = total <= 0 ? 1 : total;
    const milestoneRatios = [0, 0.34, 0.68, 1];

    const tick = (now: number) => {
      if (this.startTime === null) {
        this.startTime = now;
      }

      const elapsed = now - this.startTime;
      const t = clamp01(elapsed / durationMs);
      const distance = safeTotal * t;
      const pos = pointAtDistance(route, cumulative, distance);
      callbacks.onPosition(pos);

      const nextMilestoneIndex = resolveMilestoneIndex(milestoneRatios, t);
      if (nextMilestoneIndex > this.lastMilestoneIndex) {
        this.lastMilestoneIndex = nextMilestoneIndex;
        callbacks.onMilestoneIndex(nextMilestoneIndex);
      }

      if (t >= 1) {
        callbacks.onCompleted();
        this.stop();
        return;
      }

      this.rafId = window.requestAnimationFrame(tick);
    };

    this.rafId = window.requestAnimationFrame(tick);
  }

  public stop() {
    if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

export function TraceabilityMap({ isTracking, animationKey, onMilestone, onCompleted }: TraceabilityMapProps) {
  const points = useMemo<TracePoint[]>(
    () => [
      { id: "GENERATED", label: "Hospital", position: [4.6533, -74.0837] },
      { id: "COLLECTION", label: "En Recolección", position: [4.6678, -74.0896] },
      { id: "TREATMENT", label: "Planta de Tratamiento", position: [4.7017, -74.0721] },
      { id: "DISPOSAL", label: "Disposición Final", position: [4.7252, -74.055] },
    ],
    []
  );

  const route = useMemo<Array<[number, number]>>(() => {
    return points.map((p) => asTuple(p.position));
  }, [points]);

  const [truckPos, setTruckPos] = useState<LatLngExpression>(points[0]!.position);
  const animatorRef = useRef<RouteAnimator | null>(null);

  useEffect(() => {
    if (!animatorRef.current) {
      animatorRef.current = new RouteAnimator();
    }

    return () => {
      animatorRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    setTruckPos(points[0]!.position);
  }, [animationKey, points]);

  useEffect(() => {
    if (!isTracking) {
      animatorRef.current?.stop();
      return;
    }

    const reached = new Set<number>();
    animatorRef.current?.start(route, 7500, {
      onPosition: (pos) => setTruckPos(pos),
      onMilestoneIndex: (index) => {
        if (reached.has(index)) return;
        reached.add(index);
        const p = points[index];
        if (p) {
          onMilestone(p.id);
        }
      },
      onCompleted: () => {
        onCompleted();
      },
    });
  }, [isTracking, onCompleted, onMilestone, points, route]);

  const truckIcon = useMemo(() => createTruckIcon(), []);

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-2xl border border-slate-200/70 dark:border-white/10">
      <MapContainer
        center={points[0]!.position}
        zoom={12}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polyline
          positions={route}
          pathOptions={{ color: "#10b981", weight: 5, opacity: 0.85 }}
        />

        {points.map((p) => (
          <Marker
            key={p.id}
            position={p.position}
            icon={createPointIcon(p.label)}
          />
        ))}

        <Marker position={truckPos} icon={truckIcon} />

        <FollowTruck position={truckPos} />
      </MapContainer>
    </div>
  );
}

function FollowTruck({ position }: { position: LatLngExpression }) {
  const map = useMap();
  useEffect(() => {
    map.panTo(position, { animate: true, duration: 0.25 });
  }, [map, position]);
  return null;
}

function createTruckIcon() {
  return L.divIcon({
    className: "",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    html:
      '<div style="width:38px;height:38px;border-radius:16px;display:grid;place-items:center;background:rgba(16,185,129,0.18);border:1px solid rgba(16,185,129,0.35);box-shadow:0 10px 22px -12px rgba(16,185,129,0.45);">'
      + '<div style="font-size:18px;line-height:18px;">🚛</div>'
      + "</div>",
  });
}

function createPointIcon(label: string) {
  return L.divIcon({
    className: "",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    html:
      '<div title="'
      + escapeHtml(label)
      + '" style="width:12px;height:12px;border-radius:999px;background:rgba(2,6,23,0.85);border:2px solid rgba(16,185,129,0.9);"></div>',
  });
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function resolveMilestoneIndex(milestones: number[], t: number) {
  let index = 0;
  for (let i = 0; i < milestones.length; i++) {
    if (t >= milestones[i]!) {
      index = i;
    }
  }
  return index;
}

function asTuple(pos: LatLngExpression): [number, number] {
  const tuple = pos as [number, number];
  return [tuple[0], tuple[1]];
}

function buildCumulativeDistances(route: Array<[number, number]>) {
  const cumulative: number[] = [0];
  for (let i = 1; i < route.length; i++) {
    const prev = route[i - 1]!;
    const cur = route[i]!;
    cumulative.push(cumulative[i - 1]! + haversine(prev, cur));
  }
  return cumulative;
}

function pointAtDistance(route: Array<[number, number]>, cumulative: number[], distance: number): [number, number] {
  if (route.length === 0) {
    return [0, 0];
  }
  if (distance <= 0) {
    return route[0]!;
  }

  const total = cumulative[cumulative.length - 1] ?? 0;
  if (distance >= total) {
    return route[route.length - 1]!;
  }

  let seg = 1;
  while (seg < cumulative.length && cumulative[seg]! < distance) {
    seg++;
  }

  const a = route[seg - 1]!;
  const b = route[seg]!;
  const segStart = cumulative[seg - 1]!;
  const segEnd = cumulative[seg]!;
  const t = (distance - segStart) / Math.max(1e-9, segEnd - segStart);
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
  ];
}

function haversine(a: [number, number], b: [number, number]) {
  const R = 6371;
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const lat1 = toRad(a[0]);
  const lat2 = toRad(b[0]);

  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLon / 2);
  const h = s1 * s1 + Math.cos(lat1) * Math.cos(lat2) * s2 * s2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
