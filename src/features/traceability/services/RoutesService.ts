import { RestClient } from "@/core/services/RestClient";
import { isDemoMode } from "@/core/config/flags";
import { demoRoutes, getDemoStops } from "@/features/traceability/data/demoRoutes";

export type BackendRoute = Record<string, unknown>;
export type BackendStop = Record<string, unknown>;

export class RoutesService {
  private readonly client = new RestClient();
  private readonly routesKey = "demo_traceability_routes";
  private readonly stopsPrefix = "demo_traceability_stops_";

  public async getRoutes(): Promise<BackendRoute[]> {
    if (isDemoMode()) {
      const current = this.read<BackendRoute[]>(this.routesKey, []);
      const merged = this.mergeById(current, demoRoutes as unknown as BackendRoute[]);
      this.write(this.routesKey, merged);
      return merged;
    }
    const data = await this.client.get<unknown>("/api/routes");
    return Array.isArray(data) ? (data as BackendRoute[]) : [];
  }

  public async getStops(routeId: string): Promise<BackendStop[]> {
    if (isDemoMode()) {
      const key = this.stopsKey(routeId);
      const current = this.read<BackendStop[]>(key, []);
      const seed = routeId.startsWith("demo-") ? (getDemoStops(routeId) as unknown as BackendStop[]) : [];
      const merged = this.mergeById(current, seed);
      if (merged.length !== current.length) {
        this.write(key, merged);
      }
      return merged;
    }
    const data = await this.client.get<unknown>(`/api/routes/${encodeURIComponent(routeId)}/stops`);
    return Array.isArray(data) ? (data as BackendStop[]) : [];
  }

  public async createRoute(payload: unknown): Promise<BackendRoute> {
    if (isDemoMode()) {
      const routes = this.read<BackendRoute[]>(this.routesKey, []);
      const next: BackendRoute = {
        id: `route_${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...(payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {}),
      };
      this.write(this.routesKey, [next, ...routes]);
      return next;
    }
    return (await this.client.post<unknown>("/api/routes", payload)) as BackendRoute;
  }

  public async updateRoute(routeId: string, payload: unknown): Promise<BackendRoute> {
    if (isDemoMode()) {
      const routes = this.read<BackendRoute[]>(this.routesKey, []);
      const updated = routes.map((r) => {
        const id = this.extractId(r);
        if (String(id ?? "") !== routeId) return r;
        return {
          ...r,
          ...(payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {}),
          updatedAt: new Date().toISOString(),
        };
      });
      this.write(this.routesKey, updated);
      return updated.find((r) => String(this.extractId(r) ?? "") === routeId) ?? ({} as BackendRoute);
    }
    return (await this.client.put<unknown>(`/api/routes/${encodeURIComponent(routeId)}`, payload)) as BackendRoute;
  }

  public async deleteRoute(routeId: string): Promise<void> {
    if (isDemoMode()) {
      const routes = this.read<BackendRoute[]>(this.routesKey, []);
      const next = routes.filter((r) => String(this.extractId(r) ?? "") !== routeId);
      this.write(this.routesKey, next);
      localStorage.removeItem(this.stopsKey(routeId));
      return;
    }
    await this.client.delete(`/api/routes/${encodeURIComponent(routeId)}`);
  }

  public async createStop(routeId: string, payload: unknown): Promise<BackendStop> {
    if (isDemoMode()) {
      const key = this.stopsKey(routeId);
      const stops = this.read<BackendStop[]>(key, []);
      const next: BackendStop = {
        id: `stop_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        routeId,
        createdAt: new Date().toISOString(),
        ...(payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {}),
      };
      this.write(key, [...stops, next]);
      return next;
    }
    return (await this.client.post<unknown>(`/api/routes/${encodeURIComponent(routeId)}/stops`, payload)) as BackendStop;
  }

  public async updateStop(routeId: string, stopId: string, payload: unknown): Promise<BackendStop> {
    if (isDemoMode()) {
      const key = this.stopsKey(routeId);
      const stops = this.read<BackendStop[]>(key, []);
      const updated = stops.map((s) => {
        const id = this.extractId(s);
        if (String(id ?? "") !== stopId) return s;
        return {
          ...s,
          ...(payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {}),
          updatedAt: new Date().toISOString(),
        };
      });
      this.write(key, updated);
      return updated.find((s) => String(this.extractId(s) ?? "") === stopId) ?? ({} as BackendStop);
    }
    return (await this.client.put<unknown>(
      `/api/routes/${encodeURIComponent(routeId)}/stops/${encodeURIComponent(stopId)}`,
      payload
    )) as BackendStop;
  }

  public async deleteStop(routeId: string, stopId: string): Promise<void> {
    if (isDemoMode()) {
      const key = this.stopsKey(routeId);
      const stops = this.read<BackendStop[]>(key, []);
      const next = stops.filter((s) => String(this.extractId(s) ?? "") !== stopId);
      this.write(key, next);
      return;
    }
    await this.client.delete(`/api/routes/${encodeURIComponent(routeId)}/stops/${encodeURIComponent(stopId)}`);
  }

  public async reorderStops(routeId: string, stopIds: string[]): Promise<void> {
    if (isDemoMode()) {
      const key = this.stopsKey(routeId);
      const stops = this.read<BackendStop[]>(key, []);
      const map = new Map<string, BackendStop>();
      for (const s of stops) {
        const id = this.extractId(s);
        if (id !== null && id !== undefined) {
          map.set(String(id), s);
        }
      }
      const ordered: BackendStop[] = [];
      for (const id of stopIds) {
        const item = map.get(String(id));
        if (item) {
          ordered.push(item);
          map.delete(String(id));
        }
      }
      for (const remaining of map.values()) {
        ordered.push(remaining);
      }
      this.write(key, ordered);
      return;
    }
    await this.client.patch(`/api/routes/${encodeURIComponent(routeId)}/stops/reorder`, { stopIds });
  }

  private stopsKey(routeId: string) {
    return `${this.stopsPrefix}${routeId}`;
  }

  private read<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  }

  private write(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  private extractId(record: Record<string, unknown>): unknown {
    return record["id"] ?? record["routeId"] ?? record["stopId"] ?? record["uuid"] ?? record["_id"];
  }

  private mergeById<T extends Record<string, unknown>>(current: T[], seed: T[]): T[] {
    const map = new Map<string, T>();
    for (const item of current) {
      const id = this.extractId(item);
      if (id !== null && id !== undefined) {
        map.set(String(id), item);
      }
    }
    let changed = false;
    for (const item of seed) {
      const id = this.extractId(item);
      if (id === null || id === undefined) continue;
      const key = String(id);
      if (!map.has(key)) {
        map.set(key, item);
        changed = true;
      }
    }
    if (!changed) return current;
    return Array.from(map.values());
  }
}
