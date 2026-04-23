export const env = {
  apiBaseUrl: import.meta.env["VITE_API_BASE_URL"] as string | undefined,
};

export function getApiBaseUrl(): string {
  return env.apiBaseUrl ?? "http://localhost:8080";
}
