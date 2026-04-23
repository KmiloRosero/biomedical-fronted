import { HttpClient } from "@/core/network/HttpClient";

export type EntityId = string | number;

export class GenericApiService<TRecord extends { id: EntityId }> {
  private readonly api = HttpClient.getInstance().client;

  public constructor(
    private readonly tableName: string
  ) {}

  public async getAll(signal?: AbortSignal): Promise<TRecord[]> {
    const config = signal ? { signal } : undefined;
    const response = await this.api.get<TRecord[]>(`/api/admin/${this.tableName}`, config);
    return response.data;
  }

  public async create(input: Omit<TRecord, "id">): Promise<TRecord> {
    const response = await this.api.post<TRecord>(`/api/admin/${this.tableName}`, input);
    return response.data;
  }

  public async update(id: EntityId, patch: Partial<Omit<TRecord, "id">>): Promise<TRecord> {
    const response = await this.api.put<TRecord>(`/api/admin/${this.tableName}/${id}`, patch);
    return response.data;
  }

  public async delete(id: EntityId): Promise<void> {
    await this.api.delete(`/api/admin/${this.tableName}/${id}`);
  }
}
