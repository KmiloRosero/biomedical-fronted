import { HttpClient } from "@/core/network/HttpClient";

export class RestClient {
  private readonly api = HttpClient.getInstance().client;

  public async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const response = await this.api.get<T>(path, { params });
    return response.data;
  }

  public async post<T>(path: string, body?: unknown): Promise<T> {
    const response = await this.api.post<T>(path, body);
    return response.data;
  }

  public async put<T>(path: string, body?: unknown): Promise<T> {
    const response = await this.api.put<T>(path, body);
    return response.data;
  }

  public async patch<T>(path: string, body?: unknown): Promise<T> {
    const response = await this.api.patch<T>(path, body);
    return response.data;
  }

  public async delete(path: string): Promise<void> {
    await this.api.delete(path);
  }
}
