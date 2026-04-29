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
  initialize: () => void;
  signInWithPassword: (email: string, password: string) => Promise<void>;
  requestEmailLogin: (email: string) => Promise<void>;
  completeOAuth: (token: string, user?: UserProfile) => void;
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
  initialize: () => {
    const token = authService.getToken();
    const user = authService.getUser();
    set({
      status: token ? "authenticated" : "unauthenticated",
      token,
      user,
    });
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
        error: "No se pudo iniciar sesión. Verifica tus credenciales o el backend.",
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
        error: "No se pudo enviar el enlace al correo. Verifica el backend y CORS.",
      });
    }
  },
  completeOAuth: (token, user) => {
    const session = authService.completeOAuthLogin(token, user);
    set({ status: "authenticated", token: session.token, user: session.user });
  },
  signOut: () => {
    authService.logout();
    set({ status: "unauthenticated", token: null, user: null });
  },
  clearError: () => set({ error: null }),
}));
