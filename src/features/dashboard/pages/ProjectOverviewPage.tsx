import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  FileBarChart2,
  MapPinned,
  Recycle,
  Route,
  ShieldCheck,
  Truck,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Surface } from "@/shared/ui/Surface";

type AboutTab = "resumen" | "flujo" | "modulos" | "demo";

type TabDef = {
  id: AboutTab;
  label: string;
};

export function ProjectOverviewPage() {
  const [tab, setTab] = useState<AboutTab>("resumen");

  const contentMotion = useMemo(
    () => ({
      hidden: { opacity: 0, y: 10 },
      show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const, staggerChildren: 0.06 },
      },
    }),
    []
  );

  const bulletMotion = useMemo(
    () => ({
      hidden: { opacity: 0, x: -8 },
      show: { opacity: 1, x: 0, transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] as const } },
    }),
    []
  );

  const tabs = useMemo<TabDef[]>(
    () => [
      { id: "resumen", label: "Resumen" },
      { id: "flujo", label: "Flujo" },
      { id: "modulos", label: "Módulos" },
      { id: "demo", label: "Datos demo" },
    ],
    []
  );

  const content = useMemo(() => {
    if (tab === "resumen") {
      return {
        title: "Gestión y trazabilidad de residuos biomédicos",
        description:
          "Plataforma para registrar residuos, planificar rutas y hacer seguimiento en tiempo real del traslado y tratamiento, con operación enfocada en Pasto (Nariño).",
        bullets: [
          "Centraliza municipios, tipos de residuos y flota.",
          "Controla alertas y reportes de indicadores.",
          "Permite trazabilidad por ruta con mapa y hitos.",
        ],
      };
    }
    if (tab === "flujo") {
      return {
        title: "Flujo operativo",
        description:
          "El sistema modela el ciclo completo: generación → recolección → transporte → tratamiento → disposición final, con estados, evidencias y tiempos.",
        bullets: [
          "Asignación y despacho (Operaciones).",
          "Seguimiento en mapa (Trazabilidad).",
          "Cierre con métricas y reportes exportables.",
        ],
      };
    }
    if (tab === "modulos") {
      return {
        title: "Módulos del sistema",
        description:
          "Cada módulo está pensado para una tarea clara, con la misma experiencia UI y un CRUD consistente para la entrega del proyecto.",
        bullets: [
          "Residuos: lotes, clasificación y estados.",
          "Rutas: rutas departamentales y planificación.",
          "Alertas/Reportes: control y auditoría.",
          "Maestros: Municipios, Tipos de Residuos, Flota.",
        ],
      };
    }
    return {
      title: "Modo demostración para Nariño",
      description:
        "Incluye datos precargados para mostrar el sistema completo sin depender del backend: municipios, flota, tipos de residuos, lotes, alertas y rutas.",
      bullets: [
        "64 municipios de Nariño.",
        "Rutas departamentales + trazabilidad en Pasto.",
        "Exportación de reportes (CSV/JSON).",
      ],
    };
  }, [tab]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Acerca del proyecto</h2>
        <p className="mt-1 text-sm text-slate-700 dark:text-white/70">
          Vista general para explicar el sistema a jurados y usuarios.
        </p>
      </div>

      <Surface className="p-4 sm:p-6">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => {
            const isActive = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-400/60",
                  isActive
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-900/5 text-slate-900 hover:bg-slate-900/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-950/5 p-5 dark:border-white/10 dark:bg-white/5 sm:p-6">
              <motion.div
                className="pointer-events-none absolute -inset-24 opacity-70 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle at 15% 20%, rgba(16,185,129,0.22), transparent 55%), radial-gradient(circle at 85% 40%, rgba(56,189,248,0.16), transparent 60%), radial-gradient(circle at 55% 95%, rgba(99,102,241,0.16), transparent 55%)",
                }}
                animate={{
                  x: [0, 14, -10, 0],
                  y: [0, -8, 12, 0],
                  opacity: [0.55, 0.78, 0.62, 0.55],
                }}
                transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                key={tab}
                variants={contentMotion}
                initial="hidden"
                animate="show"
              >
                <motion.div variants={bulletMotion} className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_8px_rgba(16,185,129,0.14)]" />
                  <div className="text-xs font-semibold tracking-wide text-slate-700 dark:text-white/70">Resumen ejecutivo</div>
                </motion.div>

                <motion.div variants={bulletMotion} className="mt-3 text-2xl font-semibold leading-tight sm:text-3xl">
                  {content.title}
                </motion.div>
                <motion.div variants={bulletMotion} className="mt-3 text-sm text-slate-700 dark:text-white/70 sm:text-base">
                  {content.description}
                </motion.div>

                <motion.ul className="mt-5 space-y-2.5 text-sm text-slate-800 dark:text-white/85" variants={contentMotion}>
                  {content.bullets.map((b) => (
                    <motion.li key={b} variants={bulletMotion} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500/85" />
                      <span>{b}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <StatCard
                  icon={<MapPinned className="h-6 w-6" />}
                  label="Cobertura"
                  value="Nariño (Pasto)"
                  tone="emerald"
                />
                <StatCard
                  icon={<Truck className="h-6 w-6" />}
                  label="Flota demo"
                  value="10 vehículos"
                  tone="cyan"
                />
                <StatCard
                  icon={<Recycle className="h-6 w-6" />}
                  label="Tipos"
                  value="15 categorías"
                  tone="indigo"
                />
                <StatCard
                  icon={<ShieldCheck className="h-6 w-6" />}
                  label="Estado"
                  value="Operativo"
                  tone="amber"
                />
              </div>
            </div>
          </div>

          <AnimatedProjectPanel />
        </div>
      </Surface>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone?: "emerald" | "cyan" | "indigo" | "amber";
}) {
  const accent =
    tone === "emerald"
      ? "bg-emerald-500"
      : tone === "cyan"
        ? "bg-cyan-400"
        : tone === "indigo"
          ? "bg-indigo-400"
          : "bg-amber-400";

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.16 }}
      className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/40 p-4 dark:border-white/10 dark:bg-white/5"
    >
      <div className={cn("absolute left-0 top-0 h-full w-1", accent)} />
      <motion.div
        className={cn("absolute -inset-12 opacity-10 blur-2xl", accent)}
        animate={{ opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative grid h-12 w-12 place-items-center rounded-2xl border border-slate-200/70 bg-white/70 text-slate-800 dark:border-white/10 dark:bg-white/10 dark:text-white/90">
        {icon}
      </div>
      <div className="relative min-w-0">
        <div className="text-xs text-slate-600 dark:text-white/60">{label}</div>
        <div className="truncate text-base font-semibold text-slate-900 dark:text-white">{value}</div>
      </div>
    </motion.div>
  );
}

function AnimatedProjectPanel() {
  const steps = useMemo(
    () => [
      { label: "Registro", icon: <Recycle className="h-5 w-5" />, tone: "emerald" },
      { label: "Ruta", icon: <Route className="h-5 w-5" />, tone: "cyan" },
      { label: "Trazabilidad", icon: <Workflow className="h-5 w-5" />, tone: "indigo" },
      { label: "Alertas", icon: <Bell className="h-5 w-5" />, tone: "rose" },
      { label: "Reportes", icon: <FileBarChart2 className="h-5 w-5" />, tone: "amber" },
    ],
    []
  );

  const toneClass = (tone: string) => {
    if (tone === "emerald") return "bg-emerald-500";
    if (tone === "cyan") return "bg-cyan-400";
    if (tone === "indigo") return "bg-indigo-400";
    if (tone === "rose") return "bg-rose-400";
    return "bg-amber-400";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-slate-950/5 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">Vista animada</div>
          <div className="mt-1 text-xs text-slate-700 dark:text-white/60">
            Flujo del sistema en tiempo real
          </div>
        </div>
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(16,185,129,0.16)]" />
      </div>

      <div className="relative mt-4 h-[360px] rounded-2xl border border-slate-200/70 bg-gradient-to-br from-emerald-500/10 via-sky-500/10 to-indigo-500/10 dark:border-white/10">
        <motion.div
          className="absolute -inset-24 opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.22), transparent 55%), radial-gradient(circle at 80% 40%, rgba(56,189,248,0.18), transparent 60%), radial-gradient(circle at 60% 90%, rgba(99,102,241,0.18), transparent 55%)",
          }}
          animate={{
            x: [0, 18, -14, 0],
            y: [0, -10, 16, 0],
            opacity: [0.55, 0.75, 0.6, 0.55],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="absolute left-7 top-8 bottom-8 w-px bg-slate-900/10 dark:bg-white/15" />

        <motion.div
          className="absolute left-[22px] top-8 h-4 w-4 rounded-full bg-emerald-400 shadow-[0_0_0_8px_rgba(16,185,129,0.18)]"
          animate={{ y: [0, 280, 0] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {steps.map((s, index) => {
          const top = 32 + index * 70;
          return (
            <div
              key={s.label}
              className="absolute left-10 right-4 flex items-center gap-3"
              style={{ top }}
            >
              <div className="relative">
                <div
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-2xl border border-slate-200/70 bg-white/70 text-slate-900 dark:border-white/10 dark:bg-white/10 dark:text-white",
                    "shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] dark:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.8)]"
                  )}
                >
                  {s.icon}
                </div>
                <motion.div
                  className={cn(
                    "absolute -inset-2 rounded-3xl opacity-30",
                    toneClass(s.tone)
                  )}
                  animate={{ opacity: [0.12, 0.28, 0.12], scale: [0.96, 1.02, 0.96] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: index * 0.15 }}
                />
              </div>

              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">{s.label}</div>
                <div className="mt-0.5 text-xs text-slate-700 dark:text-white/60">
                  {index === 0
                    ? "Ingreso y clasificación"
                    : index === 1
                      ? "Planificación y asignación"
                      : index === 2
                        ? "Mapa y hitos"
                        : index === 3
                          ? "Riesgos y eventos"
                          : "KPIs y exportación"}
                </div>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <span className={cn("h-2.5 w-2.5 rounded-full", toneClass(s.tone))} />
                <span className="text-xs text-slate-700 dark:text-white/60">Activo</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
