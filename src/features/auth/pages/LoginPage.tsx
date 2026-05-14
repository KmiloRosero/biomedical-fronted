import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Facebook, Factory, Github, Link2, Mail, MapPinned, Recycle, Truck, Workflow } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { Dialog } from "@/shared/ui/Dialog";
import { Surface } from "@/shared/ui/Surface";
import { TextField } from "@/shared/ui/TextField";
import { useAuthStore } from "../stores/useAuthStore";

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
  const signUpWithPassword = useAuthStore((s) => s.signUpWithPassword);
  const requestEmailLogin = useAuthStore((s) => s.requestEmailLogin);
  const signInWithOAuth = useAuthStore((s) => s.signInWithOAuth);

  const [mode, setMode] = useState<"login" | "signup">("login");

  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailLogin, setEmailLogin] = useState("");

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

  const canSendEmailLink = emailPattern.test(emailLogin) && !isLoading;

  async function handleSubmit() {
    setTouched({ email: true, password: true });
    if (!emailPattern.test(form.email) || form.password.length < 6) {
      return;
    }

    if (mode === "signup") {
      await signUpWithPassword(form.email, form.password);
      if (!useAuthStore.getState().error) {
        toast.success("Cuenta creada. Si Supabase pide confirmación, revisa tu correo.");
      }
      return;
    }

    await signInWithPassword(form.email, form.password);
  }

  function startOAuth(provider: "github" | "facebook") {
    void signInWithOAuth(provider);
  }

  async function handleEmailLink() {
    if (!emailPattern.test(emailLogin)) {
      return;
    }
    await requestEmailLogin(emailLogin);
    if (!useAuthStore.getState().error) {
      toast.success("Te enviamos un enlace de acceso. Revisa tu correo.");
      setIsEmailDialogOpen(false);
      setEmailLogin("");
    }
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
          className="w-full max-w-5xl"
        >
          <Surface className="overflow-hidden p-0">
            <div className="grid lg:grid-cols-2">
              <div className="p-6 sm:p-8">
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
                  <Button type="button" className="w-full" variant="secondary" onClick={() => startOAuth("facebook")}>
                    <Facebook className="h-4 w-4" />
                    Continuar con Facebook
                  </Button>
                  <Button
                    type="button"
                    className="w-full"
                    variant="secondary"
                    onClick={() => setIsEmailDialogOpen(true)}
                  >
                    <Link2 className="h-4 w-4" />
                    Enviarme enlace al correo
                  </Button>
                </div>

                <div className="my-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200/70 dark:bg-white/10" />
                  <div className="text-xs text-slate-600 dark:text-white/60">o con correo</div>
                  <div className="h-px flex-1 bg-slate-200/70 dark:bg-white/10" />
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2 rounded-2xl border border-slate-200/70 bg-slate-900/5 p-1 dark:border-white/10 dark:bg-white/5">
                    <button
                      type="button"
                      onClick={() => setMode("login")}
                      className={
                        mode === "login"
                          ? "flex-1 rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-900 dark:bg-slate-950/60 dark:text-white"
                          : "flex-1 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-white/70 dark:text-white/70 dark:hover:bg-white/10"
                      }
                    >
                      Entrar
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className={
                        mode === "signup"
                          ? "flex-1 rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-900 dark:bg-slate-950/60 dark:text-white"
                          : "flex-1 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-white/70 dark:text-white/70 dark:hover:bg-white/10"
                      }
                    >
                      Crear cuenta
                    </button>
                  </div>

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
                    {isLoading ? "Validando..." : mode === "signup" ? "Crear cuenta" : "Entrar"}
                  </Button>

                  <div className="text-xs text-slate-600 dark:text-white/60">
                    Si no funciona, verifica `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
                  </div>
                </div>
              </div>

              <div className="relative border-t border-slate-200/70 p-6 dark:border-white/10 lg:border-l lg:border-t-0 lg:p-8">
                <ProjectAnimationPanel />
              </div>
            </div>
          </Surface>
        </motion.div>
      </div>

      <Dialog isOpen={isEmailDialogOpen} title="Acceso por correo" onClose={() => setIsEmailDialogOpen(false)}>
        <div className="space-y-4">
          <div className="text-sm text-slate-700 dark:text-white/70">
            Te enviaremos un enlace seguro para iniciar sesión.
          </div>
          <TextField
            label="Correo"
            type="email"
            placeholder="usuario@hospital.com"
            value={emailLogin}
            onChange={(e) => setEmailLogin(e.target.value)}
            autoComplete="email"
          />
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsEmailDialogOpen(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleEmailLink} disabled={!canSendEmailLink} isLoading={isLoading}>
              Enviar enlace
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

function ProjectAnimationPanel() {
  const items = useMemo(
    () => [
      {
        title: "Generación",
        description: "Registro en unidad generadora",
        icon: <Recycle className="h-5 w-5" />,
        tone: "border-emerald-400/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-100",
      },
      {
        title: "Recolección",
        description: "Asignación y despacho de flota",
        icon: <Truck className="h-5 w-5" />,
        tone: "border-sky-400/25 bg-sky-500/10 text-sky-700 dark:text-sky-100",
      },
      {
        title: "Tratamiento",
        description: "Ingreso y procesamiento en planta",
        icon: <Factory className="h-5 w-5" />,
        tone: "border-amber-400/25 bg-amber-500/10 text-amber-700 dark:text-amber-100",
      },
      {
        title: "Trazabilidad",
        description: "Mapa + hitos del lote",
        icon: <MapPinned className="h-5 w-5" />,
        tone: "border-violet-400/25 bg-violet-500/10 text-violet-700 dark:text-violet-100",
      },
    ],
    []
  );

  return (
    <div className="relative h-full">
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-transparent to-sky-500/10" />

      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Plataforma de Residuos Biomédicos</div>
          <div className="mt-1 text-sm text-slate-700 dark:text-white/60">
            Gestión, despacho, trazabilidad y reportes.
          </div>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200/70 bg-slate-900/5 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
          <Workflow className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute left-5 top-0 h-full w-px bg-slate-200/70 dark:bg-white/10" />
          <motion.div
            className="absolute left-5 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-emerald-500"
            animate={{ y: [0, 84, 168, 252, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="space-y-3">
            {items.map((it, index) => (
              <motion.div
                key={it.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.06 * index }}
                className="relative pl-10"
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.25 * index }}
                  className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-start gap-3">
                    <div className={`grid h-10 w-10 place-items-center rounded-2xl border ${it.tone}`}>{it.icon}</div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{it.title}</div>
                      <div className="mt-1 text-xs text-slate-700 dark:text-white/60">{it.description}</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
        Ideal para demos: explora módulos sin depender del login y luego activa autenticación.
      </div>
    </div>
  );
}
