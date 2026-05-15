import { HttpClient } from "@/core/network/HttpClient";
import { isDemoMode } from "@/core/config/flags";

export type EntityId = string | number;

export class GenericApiService<TRecord extends { id: EntityId }> {
  private readonly api = HttpClient.getInstance().client;
  private readonly storageKey: string;

  public constructor(
    private readonly tableName: string
  ) {
    this.storageKey = `demo_${tableName}`;
  }

  // Inicializar datos demo si no existen en localStorage
  public initializeData(initialData: TRecord[]): void {
    if (!isDemoMode()) return;
    
    const existing = localStorage.getItem(this.storageKey);
    if (!existing || JSON.parse(existing).length === 0) {
      localStorage.setItem(this.storageKey, JSON.stringify(initialData));
    }
  }

  public async getAll(signal?: AbortSignal): Promise<TRecord[]> {
    if (isDemoMode()) {
      // Modo demo: leer de localStorage
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    }
    
    // Modo producción: llamada API real
    const config = signal ? { signal } : undefined;
    const response = await this.api.get<TRecord[]>(`/api/admin/${this.tableName}`, config);
    return response.data;
  }

  public async create(input: Omit<TRecord, "id">): Promise<TRecord> {
    if (isDemoMode()) {
      const current = await this.getAll();
      const newId = `new_${Date.now()}`;
      const newRecord = { ...input, id: newId } as TRecord;
      current.push(newRecord);
      localStorage.setItem(this.storageKey, JSON.stringify(current));
      return newRecord;
    }
    
    const response = await this.api.post<TRecord>(`/api/admin/${this.tableName}`, input);
    return response.data;
  }

  public async update(id: EntityId, patch: Partial<Omit<TRecord, "id">>): Promise<TRecord> {
    if (isDemoMode()) {
      const current = await this.getAll();
      const index = current.findIndex(r => r.id === id);
      if (index === -1) throw new Error("Record not found");
      
      const updated = { ...current[index], ...patch } as TRecord;
      current[index] = updated;
      localStorage.setItem(this.storageKey, JSON.stringify(current));
      return updated;
    }
    
    const response = await this.api.put<TRecord>(`/api/admin/${this.tableName}/${id}`, patch);
    return response.data;
  }

  public async delete(id: EntityId): Promise<void> {
    if (isDemoMode()) {
      const current = await this.getAll();
      const filtered = current.filter(r => r.id !== id);
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      return;
    }
    
    await this.api.delete(`/api/admin/${this.tableName}/${id}`);
  }
}
