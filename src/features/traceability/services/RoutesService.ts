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
}
