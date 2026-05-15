import { RestClient } from "@/core/services/RestClient";

export type BackendRoute = Record<string, unknown>;
export type BackendStop = Record<string, unknown>;

export class RoutesService {
  private readonly client = new RestClient();

  public async getRoutes(): Promise<BackendRoute[]> {
    const data = await this.client.get<unknown>("/api/routes");
    return Array.isArray(data) ? (data as BackendRoute[]) : [];
  }

  public async getStops(routeId: string): Promise<BackendStop[]> {
    const data = await this.client.get<unknown>(`/api/routes/${encodeURIComponent(routeId)}/stops`);
    return Array.isArray(data) ? (data as BackendStop[]) : [];
  }

  public async createRoute(payload: unknown): Promise<BackendRoute> {
    return (await this.client.post<unknown>("/api/routes", payload)) as BackendRoute;
  }

  public async updateRoute(routeId: string, payload: unknown): Promise<BackendRoute> {
    return (await this.client.put<unknown>(`/api/routes/${encodeURIComponent(routeId)}`, payload)) as BackendRoute;
  }

  public async deleteRoute(routeId: string): Promise<void> {
    await this.client.delete(`/api/routes/${encodeURIComponent(routeId)}`);
  }

  public async createStop(routeId: string, payload: unknown): Promise<BackendStop> {
    return (await this.client.post<unknown>(`/api/routes/${encodeURIComponent(routeId)}/stops`, payload)) as BackendStop;
  }

  public async updateStop(routeId: string, stopId: string, payload: unknown): Promise<BackendStop> {
    return (await this.client.put<unknown>(
      `/api/routes/${encodeURIComponent(routeId)}/stops/${encodeURIComponent(stopId)}`,
      payload
    )) as BackendStop;
  }

  public async deleteStop(routeId: string, stopId: string): Promise<void> {
    await this.client.delete(`/api/routes/${encodeURIComponent(routeId)}/stops/${encodeURIComponent(stopId)}`);
  }

  public async reorderStops(routeId: string, stopIds: string[]): Promise<void> {
    await this.client.patch(`/api/routes/${encodeURIComponent(routeId)}/stops/reorder`, { stopIds });
  }
}
