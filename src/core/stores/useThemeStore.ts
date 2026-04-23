import { create } from "zustand";

export type ThemeMode = "light" | "dark";

type ThemeState = {
  mode: ThemeMode;
  initialize: () => void;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
};

const storageKey = "biowaste.theme";

function applyMode(mode: ThemeMode) {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(mode);
}

function resolveInitialMode(): ThemeMode {
  const saved = localStorage.getItem(storageKey);
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  return "dark";
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: "dark",
  initialize: () => {
    const mode = resolveInitialMode();
    applyMode(mode);
    set({ mode });
  },
  setMode: (mode) => {
    localStorage.setItem(storageKey, mode);
    applyMode(mode);
    set({ mode });
  },
  toggle: () => {
    const next: ThemeMode = get().mode === "dark" ? "light" : "dark";
    get().setMode(next);
  },
}));
