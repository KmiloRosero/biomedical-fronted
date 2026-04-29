import type { AuthProvider } from "../models/AuthProvider";

function readBooleanEnv(key: string, defaultValue: boolean): boolean {
  const raw = import.meta.env[key] as string | undefined;
  if (!raw) {
    return defaultValue;
  }
  const v = raw.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export function getEnabledAuthProviders(): AuthProvider[] {
  const githubEnabled = readBooleanEnv("VITE_ENABLE_GITHUB_OAUTH", true);
  const googleEnabled = readBooleanEnv("VITE_ENABLE_GOOGLE_OAUTH", false);

  const providers: AuthProvider[] = [{ id: "password", label: "Correo" }];

  if (githubEnabled) {
    providers.push({ id: "github", label: "GitHub" });
  }
  if (googleEnabled) {
    providers.push({ id: "google", label: "Google" });
  }

  return providers;
}
