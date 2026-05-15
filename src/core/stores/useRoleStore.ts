import { create } from "zustand";

export type AppRole = "admin" | "operador" | "conductor" | "auditor";

const storageKey = "biowaste.role";

type RoleState = {
  role: AppRole;
  setRole: (role: AppRole) => void;
};

function loadRole(): AppRole {
  const raw = localStorage.getItem(storageKey);
  if (raw === "admin" || raw === "operador" || raw === "conductor" || raw === "auditor") {
    return raw;
  }
  return "admin";
}

export const useRoleStore = create<RoleState>((set) => ({
  role: loadRole(),
  setRole: (role) => {
    localStorage.setItem(storageKey, role);
    set({ role });
  },
}));

export function getRoleLabel(role: AppRole) {
  if (role === "admin") return "Administrador";
  if (role === "operador") return "Operador";
  if (role === "conductor") return "Conductor";
  return "Auditor";
}

