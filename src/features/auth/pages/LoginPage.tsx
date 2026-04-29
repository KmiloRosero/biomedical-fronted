import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Github, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Surface } from "@/shared/ui/Surface";
import { TextField } from "@/shared/ui/TextField";
import { useAuthStore } from "../stores/useAuthStore";
import { AuthService } from "../services/AuthService";

type LoginForm = {
  email: string;
  password: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginPage() {
  const navigate = useNavigate();
  const status = useAuthStore((s) => s.status);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);
  const signInWithPassword = useAuthStore((s) => s.signInWithPassword);

  const authService = useMemo(() => new AuthService(), []);

  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/app", { replace: true });
    }
  }, [navigate, status]);

  useEffect(() => {
    clearError();
  }, [form.email, form.password, clearError]);

  const errors = useMemo(() => {
    const emailError =
      touched.email && !emailPattern.test(form.email) ? "Correo inválido." : undefined;
    const passwordError =
      touched.password && form.password.length < 6
        ? "La contraseña debe tener al menos 6 caracteres."
        : undefined;
    return { emailError, passwordError };
  }, [form.email, form.password, touched.email, touched.password]);

  const canSubmit = emailPattern.test(form.email) && form.password.length >= 6 && !isLoading;

  async function handleSubmit() {
    setTouched({ email: true, password: true });
    if (!emailPattern.test(form.email) || form.password.length < 6) {
      return;
    }
    await signInWithPassword(form.email, form.password);
  }

  function startOAuth(provider: "github" | "google") {
    const url = authService.buildOAuthStartUrl(provider);
    window.location.assign(url);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="pointer-events-none absolute -left-24 -top-24 h-[380px] w-[380px] rounded-full bg-emerald-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-3xl" />

      <div className="relative grid min-h-screen place-items-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          <Surface className="p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
              <p className="mt-2 text-sm text-slate-700 dark:text-white/70">
                Accede al sistema de gestión de residuos biomédicos.
              </p>
            </div>

            <div className="mb-4 space-y-2">
              <Button type="button" className="w-full" variant="secondary" onClick={() => startOAuth("github")}>
                <Github className="h-4 w-4" />
                Continuar con GitHub
              </Button>
              <Button type="button" className="w-full" variant="secondary" onClick={() => startOAuth("google")}>
                <ShieldCheck className="h-4 w-4" />
                Continuar con Google
              </Button>
            </div>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200/70 dark:bg-white/10" />
              <div className="text-xs text-slate-600 dark:text-white/60">o con correo</div>
              <div className="h-px flex-1 bg-slate-200/70 dark:bg-white/10" />
            </div>

            <div className="space-y-4">
              <TextField
                label="Correo"
                type="email"
                placeholder="usuario@hospital.com"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                autoComplete="email"
                error={errors.emailError}
              />
              <TextField
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                autoComplete="current-password"
                error={errors.passwordError}
              />

              {error ? <div className="text-sm text-rose-600 dark:text-rose-200">{error}</div> : null}

              <Button
                type="button"
                className="w-full"
                isLoading={isLoading}
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                <Mail className="h-4 w-4" />
                {isLoading ? "Validando..." : "Entrar"}
              </Button>

              <div className="text-xs text-slate-600 dark:text-white/60">
                Si el backend no está configurado, revisa `VITE_API_BASE_URL` y CORS.
              </div>
            </div>
          </Surface>
        </motion.div>
      </div>
    </div>
  );
}
