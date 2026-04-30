import { SupabaseClientFactory } from "@/core/supabase/supabaseClient";
import type { UserProfile } from "../models/UserProfile";
import type { AuthProviderId } from "../models/AuthProvider";

type AuthSession = {
  token: string;
  user: UserProfile;
};

export class AuthService {
  private readonly tokenKey = "biowaste.jwt";
  private readonly userKey = "biowaste.user";
  private readonly supabase = SupabaseClientFactory.getClient();

  public async loginWithPassword(email: string, password: string): Promise<AuthSession> {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }

    const token = data.session?.access_token;
    if (!token) {
      throw new Error("MISSING_ACCESS_TOKEN");
    }

    const user = mapSupabaseUserToProfile(data.user);
    this.setSession({ token, user });
    return { token, user };
  }

  public async requestEmailLogin(email: string): Promise<void> {
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await this.supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) {
      throw error;
    }
  }

  public async getSession(): Promise<AuthSession | null> {
    const { data, error } = await this.supabase.auth.getSession();
    if (error) {
      throw error;
    }
    const token = data.session?.access_token;
    if (!token || !data.session) {
      return null;
    }
    const user = mapSupabaseUserToProfile(data.session.user);
    return { token, user };
  }

  public async signInWithOAuth(provider: Extract<AuthProviderId, "github" | "google">): Promise<string> {
    const redirectTo = `${window.location.origin}/auth/callback`;
    const supabaseProvider = provider === "github" ? "github" : "google";
    const { data, error } = await this.supabase.auth.signInWithOAuth({
      provider: supabaseProvider,
      options: { redirectTo },
    });
    if (error) {
      throw error;
    }
    if (!data.url) {
      throw new Error("MISSING_OAUTH_URL");
    }
    return data.url;
  }

  public async exchangeCodeForSession(code: string): Promise<AuthSession> {
    const { data, error } = await this.supabase.auth.exchangeCodeForSession(code);
    if (error) {
      throw error;
    }

    const token = data.session?.access_token;
    if (!token) {
      throw new Error("MISSING_ACCESS_TOKEN");
    }
    if (!data.session) {
      throw new Error("MISSING_SESSION");
    }
    const user = mapSupabaseUserToProfile(data.session.user);
    this.setSession({ token, user });
    return { token, user };
  }

  public logout(): void {
    void this.supabase.auth.signOut();
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public getUser(): UserProfile | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as UserProfile;
    } catch {
      return null;
    }
  }

  public isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  private setSession(session: AuthSession): void {
    localStorage.setItem(this.tokenKey, session.token);
    localStorage.setItem(this.userKey, JSON.stringify(session.user));
  }
}

function mapSupabaseUserToProfile(user: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null): UserProfile {
  const email = user?.email ?? "";
  const metadata = user?.user_metadata ?? {};
  const fullName = typeof metadata["full_name"] === "string" ? (metadata["full_name"] as string) : "";
  const role = (typeof metadata["role"] === "string" ? metadata["role"] : "VIEWER") as UserProfile["role"];

  return {
    id: user?.id ?? crypto.randomUUID(),
    fullName: fullName || "Usuario",
    email,
    role,
  };
}
