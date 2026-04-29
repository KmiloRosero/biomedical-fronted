import { HttpClient } from "@/core/network/HttpClient";
import { API_BASE_URL } from "@/core/config/endpoints";
import type { UserProfile } from "../models/UserProfile";
import type { AuthProviderId } from "../models/AuthProvider";

type AuthSession = {
  token: string;
  user: UserProfile;
};

type LoginResponse = {
  token: string;
  user: UserProfile;
};

export class AuthService {
  private readonly tokenKey = "biowaste.jwt";
  private readonly userKey = "biowaste.user";
  private readonly api = HttpClient.getInstance().client;

  public async loginWithPassword(email: string, password: string): Promise<AuthSession> {
    const response = await this.api.post<LoginResponse>("/api/auth/login", { email, password });
    const session = response.data;
    if (!session?.token) {
      throw new Error("INVALID_LOGIN_RESPONSE");
    }
    this.setSession({ token: session.token, user: session.user });
    return { token: session.token, user: session.user };
  }

  public async fetchCurrentUser(): Promise<UserProfile> {
    const response = await this.api.get<UserProfile>("/api/auth/me");
    return response.data;
  }

  public buildOAuthStartUrl(provider: AuthProviderId): string {
    if (provider === "github") {
      return `${API_BASE_URL}/oauth2/authorization/github`;
    }
    if (provider === "google") {
      return `${API_BASE_URL}/oauth2/authorization/google`;
    }
    throw new Error("UNSUPPORTED_PROVIDER");
  }

  public completeOAuthLogin(token: string, user?: UserProfile): AuthSession {
    if (!token) {
      throw new Error("MISSING_TOKEN");
    }
    const profile = user ?? {
      id: crypto.randomUUID(),
      fullName: "Usuario",
      email: "",
      role: "VIEWER",
    };
    this.setSession({ token, user: profile });
    return { token, user: profile };
  }

  public logout(): void {
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
