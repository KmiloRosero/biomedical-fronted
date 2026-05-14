export const flags = {
  requireAuth: (import.meta.env["VITE_REQUIRE_AUTH"] as string | undefined) === "true",
};

export function isAuthRequired(): boolean {
  return flags.requireAuth;
}

export function isDemoMode(): boolean {
  return !flags.requireAuth;
}
