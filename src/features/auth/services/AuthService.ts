import type { UserProfile } from "../models/UserProfile";

type AuthSession = {
  token: string;
  user: UserProfile;
};

export class AuthService {
  private readonly tokenKey = "biowaste.jwt";
  private readonly userKey = "biowaste.user";

  public async login(email: string, password: string): Promise<AuthSession> {
    await this.delay(700);

    if (password.length < 6) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const token = this.createFakeJwt(email);
    const user: UserProfile = {
      id: crypto.randomUUID(),
      fullName: "Usuario Demo",
      email,
      role: "OPERATOR",
    };

    this.setSession({ token, user });
    return { token, user };
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

  private createFakeJwt(email: string): string {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ sub: email, iat: Date.now() }));
    const signature = btoa(crypto.randomUUID());
    return `${header}.${payload}.${signature}`;
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
