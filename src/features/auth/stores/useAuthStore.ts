import { create } from "zustand";
import type { UserProfile } from "../models/UserProfile";
import { AuthService } from "../services/AuthService";

type AuthStatus = "unknown" | "authenticated" | "unauthenticated";

type AuthState = {
  status: AuthStatus;
  token: string | null;
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  signUpWithPassword: (email: string, password: string) => Promise<void>;
  requestEmailLogin: (email: string) => Promise<void>;
  signInWithOAuth: (provider: "github" | "facebook") => Promise<void>;
  exchangeCodeForSession: (code: string) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
};

const authService = new AuthService();

export const useAuthStore = create<AuthState>((set) => ({
  status: "unknown",
  token: null,
  user: null,
  isLoading: false,
  error: null,
  initialize: async () => {
    set({ status: "unknown" });
    try {
      const session = await authService.getSession();
      set({
        status: session ? "authenticated" : "unauthenticated",
        token: session?.token ?? null,
        user: session?.user ?? null,
      });
    } catch {
      set({ status: "unauthenticated", token: null, user: null });
    }
  },
  signInWithPassword: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const session = await authService.loginWithPassword(email, password);
      set({
        status: "authenticated",
        token: session.token,
        user: session.user,
        isLoading: false,
      });
    } catch (err: unknown) {
      set({
        status: "unauthenticated",
        token: null,
        user: null,
        isLoading: false,
        error: mapAuthErrorToMessage(err),
      });
    }
  },
  signUpWithPassword: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const session = await authService.signUpWithPassword(email, password);
      if (session) {
        set({ status: "authenticated", token: session.token, user: session.user, isLoading: false });
        return;
      }
      set({ isLoading: false });
    } catch (err: unknown) {
      set({ isLoading: false, error: mapAuthErrorToMessage(err) });
    }
  },
  requestEmailLogin: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await authService.requestEmailLogin(email);
      set({ isLoading: false });
    } catch (err: unknown) {
      set({
        isLoading: false,
        error: mapAuthErrorToMessage(err),
      });
    }
  },
  signInWithOAuth: async (provider) => {
    set({ isLoading: true, error: null });
    try {
      const url = await authService.signInWithOAuth(provider);
      set({ isLoading: false });
      window.location.assign(url);
    } catch (err: unknown) {
      set({ isLoading: false, error: mapAuthErrorToMessage(err) });
    }
  },
  exchangeCodeForSession: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const session = await authService.exchangeCodeForSession(code);
      set({ status: "authenticated", token: session.token, user: session.user, isLoading: false });
    } catch (err: unknown) {
      set({ isLoading: false, error: mapAuthErrorToMessage(err) });
    }
  },
  signOut: () => {
    authService.logout();
    set({ status: "unauthenticated", token: null, user: null });
  },
  clearError: () => set({ error: null }),
}));

function mapAuthErrorToMessage(err: unknown): string {
  const message =
    typeof err === "object" && err && "message" in err && typeof (err as { message: unknown }).message === "string"
      ? ((err as { message: string }).message ?? "")
      : "";

  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "Credenciales inválidas. Verifica tu correo y contraseña.";
  }

  if (normalized.includes("email not confirmed")) {
    return "Tu correo no está confirmado. Revisa tu bandeja y confirma el email.";
  }

  if (normalized.includes("user already registered")) {
    return "Ese correo ya está registrado. Intenta iniciar sesión.";
  }

  if (normalized.includes("unsupported provider")) {
    return "Proveedor no habilitado en Supabase. Actívalo en Authentication → Providers.";
  }

  if (normalized.includes("missing env var") || normalized.includes("missing env")) {
    return "Faltan variables de entorno de Supabase en Vercel (URL y Publishable/Anon Key).";
  }

  return message ? `Error de autenticación: ${message}` : "No se pudo completar la autenticación.";
}
