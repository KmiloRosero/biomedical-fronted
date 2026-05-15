export const flags = {
  requireAuth: (import.meta.env["VITE_REQUIRE_AUTH"] as string | undefined) === "true",
  authMode: (import.meta.env["VITE_AUTH_MODE"] as string | undefined) ?? "demo",
};

export function isAuthRequired(): boolean {
  return flags.requireAuth;
}

export function isDemoMode(): boolean {
  return !flags.requireAuth;
}

export type AuthMode = "demo" | "supabase";

export function getAuthMode(): AuthMode {
  return (flags.authMode === "supabase" ? "supabase" : "demo") satisfies AuthMode;
}

export function isDemoAuthMode(): boolean {
  return getAuthMode() === "demo";
}
