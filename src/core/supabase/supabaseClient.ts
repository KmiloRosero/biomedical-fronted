import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getEnvValue(key: string): string {
  const value = import.meta.env[key] as string | undefined;
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
}

function getSupabasePublicKey(): string {
  const anonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined;
  const publishableKey = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;
  const value = (anonKey ?? publishableKey)?.trim();
  if (!value) {
    throw new Error("Missing env var: VITE_SUPABASE_ANON_KEY (or VITE_SUPABASE_PUBLISHABLE_KEY)");
  }
  return value;
}

export class SupabaseClientFactory {
  private static client: SupabaseClient | null = null;

  public static getClient(): SupabaseClient {
    if (!SupabaseClientFactory.client) {
      const url = getEnvValue("VITE_SUPABASE_URL");
      const anonKey = getSupabasePublicKey();
      SupabaseClientFactory.client = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    }
    return SupabaseClientFactory.client;
  }
}
