export const env = {
  apiBaseUrl: import.meta.env["VITE_API_BASE_URL"] as string | undefined,
};

export function getApiBaseUrl(): string {
  const raw = env.apiBaseUrl;
  if (!raw) {
    return "http://localhost:8080";
  }

  const trimmed = raw.trim().replace(/\/+$/, "");
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("localhost") || trimmed.startsWith("127.0.0.1")) {
    return `http://${trimmed}`;
  }

  return `https://${trimmed}`;
}
