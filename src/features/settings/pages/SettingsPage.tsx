import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { KeyRound, Lock, Save, ShieldCheck, UserCog } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Surface } from "@/shared/ui/Surface";
import { TextField } from "@/shared/ui/TextField";
import { HttpClient } from "@/core/network/HttpClient";
import { AdminProfileService, type AdminProfile } from "../services/AdminProfileService";
import { cn } from "@/lib/utils";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
};

const profileService = new AdminProfileService();

export function SettingsPage() {
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
        </div>
      </div>
    </div>
  );
}
