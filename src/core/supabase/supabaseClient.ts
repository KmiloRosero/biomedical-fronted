import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getEnvValue(key: string): string {
  const value = import.meta.env[key] as string | undefined;
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
}

export class SupabaseClientFactory {
  private static client: SupabaseClient | null = null;

  public static getClient(): SupabaseClient {
    if (!SupabaseClientFactory.client) {
      const url = getEnvValue("VITE_SUPABASE_URL");
      const anonKey = getEnvValue("VITE_SUPABASE_ANON_KEY");
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
