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
  signIn: (email: string, password: string) => Promise<void>;
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
  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const session = await authService.login(email, password);
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
        error: "Credenciales inválidas.",
      });
    }
  },
  signOut: () => {
    authService.logout();
    set({ status: "unauthenticated", token: null, user: null });
  },
  clearError: () => set({ error: null }),
}));
