export class AdminKeyProvider {
  private readonly storageKey = "biowaste.adminKey";

  public get(): string | null {
    return localStorage.getItem(this.storageKey);
  }

  public set(value: string): void {
    localStorage.setItem(this.storageKey, value);
  }

  public clear(): void {
    localStorage.removeItem(this.storageKey);
  }
}
