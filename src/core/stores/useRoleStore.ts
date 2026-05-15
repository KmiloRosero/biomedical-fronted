import { create } from "zustand";

export type AppRole = "admin" | "operador" | "conductor" | "auditor";

const storageKey = "biowaste.role";
const rbacKey = "biowaste.rbacEnabled";

type RoleState = {
  role: AppRole;
  setRole: (role: AppRole) => void;
  rbacEnabled: boolean;
  setRbacEnabled: (enabled: boolean) => void;
};

function loadRole(): AppRole {
  const raw = localStorage.getItem(storageKey);
  if (raw === "admin" || raw === "operador" || raw === "conductor" || raw === "auditor") {
    return raw;
  }
  return "admin";
}

function loadRbacEnabled(): boolean {
  const raw = localStorage.getItem(rbacKey);
  if (raw === null) return false;
  return raw === "true";
}

export const useRoleStore = create<RoleState>((set) => ({
  role: loadRole(),
  rbacEnabled: loadRbacEnabled(),
  setRole: (role) => {
    localStorage.setItem(storageKey, role);
    set({ role });
  },
  setRbacEnabled: (enabled) => {
    localStorage.setItem(rbacKey, enabled ? "true" : "false");
    set({ rbacEnabled: enabled });
  },
}));

export function getRoleLabel(role: AppRole) {
  if (role === "admin") return "Administrador";
  if (role === "operador") return "Operador";
  if (role === "conductor") return "Conductor";
  return "Auditor";
}

export function isRbacEnabled() {
  const raw = localStorage.getItem(rbacKey);
  if (raw === null) return false;
  return raw === "true";
}
