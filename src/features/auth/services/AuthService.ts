import { SupabaseClientFactory } from "@/core/supabase/supabaseClient";
import { isDemoAuthMode } from "@/core/config/flags";
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
    if (isDemoAuthMode()) {
      if (password.length < 6) {
        throw new Error("INVALID_LOGIN_CREDENTIALS");
      }
      const token = this.createDemoToken(email);
      const user: UserProfile = {
        id: crypto.randomUUID(),
        fullName: "Usuario Demo",
        email,
        role: "OPERATOR",
      };
      this.setSession({ token, user });
      return { token, user };
    }

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

  public async signUpWithPassword(email: string, password: string): Promise<AuthSession | null> {
    if (isDemoAuthMode()) {
      if (password.length < 6) {
        throw new Error("INVALID_LOGIN_CREDENTIALS");
      }
      const token = this.createDemoToken(email);
      const user: UserProfile = {
        id: crypto.randomUUID(),
        fullName: "Usuario Demo",
        email,
        role: "OPERATOR",
      };
      this.setSession({ token, user });
      return { token, user };
    }

    const redirectTo = `${window.location.origin}/auth/callback`;
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo },
    });

    if (error) {
      throw error;
    }

    const token = data.session?.access_token;
    if (!token) {
      return null;
    }

    if (!data.session) {
      return null;
    }

    const user = mapSupabaseUserToProfile(data.session.user);
    this.setSession({ token, user });
    return { token, user };
  }

  public async requestEmailLogin(email: string): Promise<void> {
    if (isDemoAuthMode()) {
      const token = this.createDemoToken(email);
      const user: UserProfile = {
        id: crypto.randomUUID(),
        fullName: "Usuario Demo",
        email,
        role: "OPERATOR",
      };
      this.setSession({ token, user });
      return;
    }

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
    if (isDemoAuthMode()) {
      const token = this.getToken();
      const user = this.getUser();
      if (!token || !user) {
        return null;
      }
      return { token, user };
    }

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

  public async signInWithOAuth(provider: Extract<AuthProviderId, "github" | "facebook">): Promise<string> {
    if (isDemoAuthMode()) {
      throw new Error("UNSUPPORTED_PROVIDER");
    }
    const redirectTo = `${window.location.origin}/auth/callback`;
    const supabaseProvider = provider === "github" ? "github" : "facebook";
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
    if (isDemoAuthMode()) {
      throw new Error("UNSUPPORTED_PROVIDER");
    }
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
    if (!isDemoAuthMode()) {
      void this.supabase.auth.signOut();
    }
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

  private createDemoToken(email: string): string {
    const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ sub: email, iat: Date.now(), mode: "demo" }));
    return `${header}.${payload}.demo`;
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
