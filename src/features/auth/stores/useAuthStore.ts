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
  requestEmailLogin: (email: string) => Promise<void>;
  signInWithOAuth: (provider: "github" | "google") => Promise<void>;
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
    } catch {
      set({
        status: "unauthenticated",
        token: null,
        user: null,
        isLoading: false,
        error: "No se pudo iniciar sesión. Verifica tus credenciales.",
      });
    }
  },
  requestEmailLogin: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await authService.requestEmailLogin(email);
      set({ isLoading: false });
    } catch {
      set({
        isLoading: false,
        error: "No se pudo enviar el enlace al correo. Verifica Supabase y CORS.",
      });
    }
  },
  signInWithOAuth: async (provider) => {
    set({ isLoading: true, error: null });
    try {
      const url = await authService.signInWithOAuth(provider);
      set({ isLoading: false });
      window.location.assign(url);
    } catch {
      set({ isLoading: false, error: "No se pudo iniciar con proveedor social." });
    }
  },
  exchangeCodeForSession: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const session = await authService.exchangeCodeForSession(code);
      set({ status: "authenticated", token: session.token, user: session.user, isLoading: false });
    } catch {
      set({ isLoading: false, error: "No se pudo completar el inicio de sesión." });
    }
  },
  signOut: () => {
    authService.logout();
    set({ status: "unauthenticated", token: null, user: null });
  },
  clearError: () => set({ error: null }),
}));
