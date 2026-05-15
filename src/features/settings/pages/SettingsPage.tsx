import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Download, KeyRound, Lock, Save, ShieldCheck, Upload, UserCog, Users, Database } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Surface } from "@/shared/ui/Surface";
import { TextField } from "@/shared/ui/TextField";
import { HttpClient } from "@/core/network/HttpClient";
import { AdminProfileService, type AdminProfile } from "../services/AdminProfileService";
import { cn } from "@/lib/utils";
import { useRoleStore, type AppRole, getRoleLabel } from "@/core/stores/useRoleStore";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
};

const profileService = new AdminProfileService();

export function SettingsPage() {
  const role = useRoleStore((s) => s.role);
  const setRole = useRoleStore((s) => s.setRole);
  const rbacEnabled = useRoleStore((s) => s.rbacEnabled);
  const setRbacEnabled = useRoleStore((s) => s.setRbacEnabled);
  const importInputId = useMemo(() => `demo-import-${Math.random().toString(16).slice(2)}`, []);

  const defaultProfile = useMemo<AdminProfile>(() => {
    return (
      profileService.get() ?? {
        fullName: "",
        email: "",
        phone: "",
      }
    );
  }, []);

  const [profile, setProfile] = useState<AdminProfile>(defaultProfile);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({ currentPassword: "", newPassword: "" });

  const [adminKey, setAdminKey] = useState<string>("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingAdminKey, setIsSavingAdminKey] = useState(false);
  const [importBusy, setImportBusy] = useState(false);

  useEffect(() => {
    setAdminKey(HttpClient.getInstance().getAdminKey() ?? "");
  }, []);

  async function saveProfile() {
    setIsSavingProfile(true);
    try {
      profileService.save(profile);
      toast.success("Perfil actualizado.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function changePassword() {
    setIsSavingPassword(true);
    try {
      if (passwordForm.newPassword.trim().length < 6) {
        toast.error("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      toast.success("Contraseña actualizada (simulado).");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } finally {
      setIsSavingPassword(false);
    }
  }

  async function saveAdminKey() {
    setIsSavingAdminKey(true);
    try {
      HttpClient.getInstance().setAdminKey(adminKey);
      toast.success("API Key de administración guardada.");
    } finally {
      setIsSavingAdminKey(false);
    }
  }

  function exportDemoData() {
    const payload: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key.startsWith("demo_") || key === "demo_system-alerts" || key === "biowaste.auditLog") {
        const value = localStorage.getItem(key);
        if (value !== null) {
          payload[key] = value;
        }
      }
    }
    const json = JSON.stringify({ exportedAt: new Date().toISOString(), payload }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `biowaste-demo-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("Respaldo exportado.");
  }

  async function importDemoData(file: File | null) {
    if (!file) return;
    setImportBusy(true);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { payload?: Record<string, string> };
      const payload = parsed && typeof parsed === "object" ? parsed.payload : null;
      if (!payload || typeof payload !== "object") {
        toast.error("Archivo inválido.");
        return;
      }
      for (const [key, value] of Object.entries(payload)) {
        if (typeof value !== "string") continue;
        localStorage.setItem(key, value);
      }
      toast.success("Respaldo importado.");
      window.location.reload();
    } catch {
      toast.error("No se pudo importar el respaldo.");
    } finally {
      setImportBusy(false);
    }
  }

  function resetDemoData() {
    const confirmed = window.confirm("¿Restablecer los datos demo? Esto borra tablas demo, alertas y bitácora.");
    if (!confirmed) return;
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (key.startsWith("demo_") || key === "demo_system-alerts" || key === "biowaste.auditLog") {
        toRemove.push(key);
      }
    }
    for (const key of toRemove) {
      localStorage.removeItem(key);
    }
    toast.success("Datos demo restablecidos.");
    window.location.reload();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Perfil y Configuración</h2>
        <p className="mt-1 text-sm text-slate-700 dark:text-white/70">
          Administra tu perfil, seguridad y la clave requerida para endpoints de administración.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Surface className="p-4 sm:p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200/70 bg-slate-900/5 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
              <UserCog className="h-5 w-5" />
            </div>
            <div>
              <div className="text-base font-semibold">Datos del administrador</div>
              <div className="text-sm text-slate-700 dark:text-white/60">Información de contacto</div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Nombre"
              value={profile.fullName}
              onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
              placeholder="Nombre completo"
            />
            <TextField
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
              placeholder="admin@hospital.com"
            />
            <TextField
              label="Teléfono"
              value={profile.phone}
              onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+57 300 000 0000"
            />
          </div>

          <div className="mt-4 flex justify-end">
            <Button type="button" onClick={saveProfile} isLoading={isSavingProfile}>
              <Save className="h-4 w-4" />
              Guardar
            </Button>
          </div>
        </Surface>

        <div className="space-y-4">
          <Surface className="p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200/70 bg-slate-900/5 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-semibold">Seguridad</div>
                <div className="text-sm text-slate-700 dark:text-white/60">Cambio de contraseña (simulado)</div>
              </div>
            </div>

            <div className="space-y-4">
              <TextField
                label="Contraseña actual"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
                placeholder="••••••••"
              />
              <TextField
                label="Nueva contraseña"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
                placeholder="••••••••"
              />
            </div>

            <div className="mt-4">
              <Button type="button" className="w-full" onClick={changePassword} isLoading={isSavingPassword}>
                <Lock className="h-4 w-4" />
                Cambiar contraseña
              </Button>
            </div>
          </Surface>

          <Surface className="p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200/70 bg-slate-900/5 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-semibold">API Key de Administración</div>
                <div className="text-sm text-slate-700 dark:text-white/60">Header requerido: X-Admin-Key</div>
              </div>
            </div>

            <label className="block">
              <span className="mb-1 block text-sm text-slate-700 dark:text-white/80">API Key</span>
              <input
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className={cn(
                  "w-full rounded-xl border border-slate-300/80 bg-white px-4 py-2 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-400/20 dark:border-white/15 dark:bg-white/10 dark:text-white dark:placeholder:text-white/40"
                )}
                placeholder="Ingresa la llave del backend"
              />
            </label>

            <div className="mt-4">
              <Button type="button" className="w-full" onClick={saveAdminKey} isLoading={isSavingAdminKey}>
                <Save className="h-4 w-4" />
                Guardar API Key
              </Button>
            </div>
          </Surface>

          <Surface className="p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200/70 bg-slate-900/5 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-semibold">Rol (demo)</div>
                <div className="text-sm text-slate-700 dark:text-white/60">
                  Controla permisos y visibilidad de módulos
                </div>
              </div>
            </div>

            <label className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-slate-900/5 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <span className="text-sm text-slate-700 dark:text-white/80">Restringir por rol</span>
              <input
                type="checkbox"
                checked={rbacEnabled}
                onChange={(e) => setRbacEnabled(e.target.checked)}
                className="h-5 w-5 accent-emerald-500"
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm text-slate-700 dark:text-white/80">Rol actual</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AppRole)}
                className="w-full rounded-xl border border-slate-300/80 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-400/20 dark:border-white/15 dark:bg-white/10 dark:text-white"
              >
                <option value="admin">{getRoleLabel("admin")}</option>
                <option value="operador">{getRoleLabel("operador")}</option>
                <option value="conductor">{getRoleLabel("conductor")}</option>
                <option value="auditor">{getRoleLabel("auditor")}</option>
              </select>
            </label>
          </Surface>

          <Surface className="p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200/70 bg-slate-900/5 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <div className="text-base font-semibold">Datos demo</div>
                <div className="text-sm text-slate-700 dark:text-white/60">Exportar, importar y restablecer</div>
              </div>
            </div>

            <div className="grid gap-2">
              <Button type="button" variant="secondary" className="w-full" onClick={exportDemoData}>
                <Download className="h-4 w-4" />
                Exportar respaldo
              </Button>

              <input
                id={importInputId}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => void importDemoData(e.target.files?.[0] ?? null)}
                disabled={importBusy}
              />
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                isLoading={importBusy}
                onClick={() => document.getElementById(importInputId)?.click()}
              >
                <Upload className="h-4 w-4" />
                Importar respaldo
              </Button>

              <Button type="button" className="w-full" onClick={resetDemoData}>
                <Save className="h-4 w-4" />
                Restablecer datos demo
              </Button>
            </div>
          </Surface>
        </div>
      </div>
    </div>
  );
}
