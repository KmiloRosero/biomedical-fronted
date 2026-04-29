import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  BarChart3,
  ClipboardList,
  Factory,
  MapPinned,
  Recycle,
  Settings,
  ShieldAlert,
  Truck,
  Workflow,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { Surface } from "@/shared/ui/Surface";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/ui/Skeleton";
import { MetricsService, type DashboardSummary } from "../services/MetricsService";
import { cn } from "@/lib/utils";

const metricsService = new MetricsService();

type QuickAction = {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
};

type ProjectUpdate = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  tone: "info" | "warning" | "success";
};

export function DashboardHomePage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setIsLoading(true);
      try {
        const data = await metricsService.getDashboardSummary();
        if (!isMounted) return;
        setSummary(data);
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    }

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  const quickActions = useMemo<QuickAction[]>(
    () => [
      {
        title: "Dashboard Analítico",
        description: "Indicadores y gráficos de gestión.",
        icon: <BarChart3 className="h-5 w-5" />,
        to: "/app/dashboard",
      },
      {
        title: "Operaciones",
        description: "Cola FIFO + pila LIFO para despacho.",
        icon: <ClipboardList className="h-5 w-5" />,
        to: "/app/operations",
      },
      {
        title: "Trazabilidad",
        description: "Ruta, hitos y timeline del lote.",
        icon: <Workflow className="h-5 w-5" />,
        to: "/app/traceability",
      },
      {
        title: "Estabilidad",
        description: "Logs en tiempo real con buffer circular.",
        icon: <Activity className="h-5 w-5" />,
        to: "/app/system-monitor",
      },
      {
        title: "Municipios",
        description: "CRUD dinámico para datos maestros.",
        icon: <MapPinned className="h-5 w-5" />,
        to: "/app/admin/municipalities",
      },
      {
        title: "Tipos de Residuos",
        description: "Catálogo y clasificación.",
        icon: <Recycle className="h-5 w-5" />,
        to: "/app/admin/waste-types",
      },
      {
        title: "Flota",
        description: "Disponibilidad y capacidad de vehículos.",
        icon: <Truck className="h-5 w-5" />,
        to: "/app/admin/transport-fleet",
      },
      {
        title: "Configuración",
        description: "Perfil, seguridad y API Key admin.",
        icon: <Settings className="h-5 w-5" />,
        to: "/app/settings",
      },
    ],
    []
  );

  const updates = useMemo<ProjectUpdate[]>(
    () => [
      {
        id: "u1",
        title: "Conectividad backend",
        description: "Validar CORS y endpoints críticos (chat, admin).",
        timestamp: "Hoy",
        tone: "warning",
      },
      {
        id: "u2",
        title: "Trazabilidad",
        description: "Ruta y hitos del lote disponibles en módulo de mapa.",
        timestamp: "Esta semana",
        tone: "success",
      },
      {
        id: "u3",
        title: "UX",
        description: "Modo oscuro, skeletons y sidebar móvil listos.",
        timestamp: "Reciente",
        tone: "info",
      },
    ],
    []
  );

  const kpis = useMemo(() => {
    if (isLoading) {
      return null;
    }
    return {
      collectedToday: summary?.collectedTodayKg ?? 0,
      vehiclesOnRoute: summary?.vehiclesOnRoute ?? 0,
      criticalAlerts: summary?.criticalAlerts ?? 0,
      pendingOrders: summary?.pendingOrders ?? 0,
    };
  }, [isLoading, summary]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-semibold">Inicio</h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-white/70">
            Bienvenido{user?.fullName ? `, ${user.fullName}` : ""}. Aquí tienes el centro de mando del sistema.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" onClick={() => navigate("/app/dashboard")}
          >
            <BarChart3 className="h-4 w-4" />
            Ver dashboard
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/app/traceability")}
          >
            <Workflow className="h-4 w-4" />
            Ver trazabilidad
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22 }} className="lg:col-span-2">
          <Surface className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-base font-semibold">Resumen operativo</div>
                <div className="text-sm text-slate-700 dark:text-white/60">Indicadores rápidos para decisiones</div>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200/70 bg-slate-900/5 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                <Factory className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard
                title="Residuos hoy"
                value={isLoading ? null : `${formatNumber(kpis?.collectedToday ?? 0)} kg`}
                icon={<Recycle className="h-5 w-5" />}
                tone="emerald"
              />
              <KpiCard
                title="Vehículos en ruta"
                value={isLoading ? null : String(kpis?.vehiclesOnRoute ?? 0)}
                icon={<Truck className="h-5 w-5" />}
                tone="cyan"
              />
              <KpiCard
                title="Alertas críticas"
                value={isLoading ? null : String(kpis?.criticalAlerts ?? 0)}
                icon={<ShieldAlert className="h-5 w-5" />}
                tone="rose"
              />
              <KpiCard
                title="Órdenes pendientes"
                value={isLoading ? null : String(kpis?.pendingOrders ?? 0)}
                icon={<ClipboardList className="h-5 w-5" />}
                tone="amber"
              />
            </div>
          </Surface>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: 0.05 }}>
          <Surface className="p-4 sm:p-6">
            <div className="text-base font-semibold">Estado del sistema</div>
            <div className="mt-1 text-sm text-slate-700 dark:text-white/60">Checklist de operación</div>

            <div className="mt-4 space-y-2">
              <StatusRow label="Autenticación" status="ok" />
              <StatusRow label="Admin API Key" status="warning" />
              <StatusRow label="Conectividad backend" status="warning" />
              <StatusRow label="Módulos activos" status="ok" />
            </div>

            <div className="mt-4">
              <Button type="button" className="w-full" onClick={() => navigate("/app/settings")}
              >
                <Settings className="h-4 w-4" />
                Ir a configuración
              </Button>
            </div>
          </Surface>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: 0.08 }}>
        <Surface className="p-4 sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="text-base font-semibold">Accesos rápidos</div>
              <div className="mt-1 text-sm text-slate-700 dark:text-white/60">Acciones frecuentes del proyecto</div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((a, index) => (
              <motion.button
                key={a.to}
                type="button"
                onClick={() => navigate(a.to)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, delay: 0.03 * index }}
                className="group rounded-2xl border border-slate-200/70 bg-white/70 p-4 text-left transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold">{a.title}</div>
                    <div className="mt-1 text-xs text-slate-700 dark:text-white/60">{a.description}</div>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200/70 bg-slate-900/5 text-slate-700 transition group-hover:bg-slate-900/10 dark:border-white/10 dark:bg-white/5 dark:text-white/80 dark:group-hover:bg-white/10">
                    {a.icon}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </Surface>
      </motion.div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: 0.12 }}>
          <Surface className="p-4 sm:p-6">
            <div className="text-base font-semibold">Actividad reciente</div>
            <div className="mt-1 text-sm text-slate-700 dark:text-white/60">Eventos simulados del proyecto</div>

            <div className="mt-4 space-y-2">
              {updates.map((u) => (
                <div key={u.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/70 bg-slate-900/5 px-4 py-3 dark:border-white/10 dark:bg-white/5">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{u.title}</div>
                    <div className="mt-1 text-xs text-slate-700 dark:text-white/60">{u.description}</div>
                  </div>
                  <div className="shrink-0">
                    <span className={cn("rounded-lg px-2 py-1 text-xs", toneBadge(u.tone))}>{u.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </Surface>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: 0.15 }}>
          <Surface className="p-4 sm:p-6">
            <div className="text-base font-semibold">Guía rápida</div>
            <div className="mt-1 text-sm text-slate-700 dark:text-white/60">Cómo usar el sistema</div>

            <div className="mt-4 grid gap-3">
              <GuideStep
                index={1}
                title="Configura el backend"
                description="Define VITE_API_BASE_URL y valida CORS en Railway."
              />
              <GuideStep
                index={2}
                title="Guarda la API Key"
                description="Ve a Configuración y guarda la llave para /api/admin/*"
              />
              <GuideStep
                index={3}
                title="Explora módulos"
                description="Dashboard, Operaciones, Trazabilidad, Estabilidad y CRUD."
              />
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button type="button" className="flex-1" onClick={() => navigate("/app/settings")}
              >
                <Settings className="h-4 w-4" />
                Configuración
              </Button>
              <Button type="button" variant="secondary" className="flex-1" onClick={() => navigate("/app/system-monitor")}
              >
                <Activity className="h-4 w-4" />
                Ver logs
              </Button>
            </div>
          </Surface>
        </motion.div>
      </div>
    </div>
  );
}

function KpiCard({
  title,
  value,
  icon,
  tone,
}: {
  title: string;
  value: string | null;
  icon: React.ReactNode;
  tone: "emerald" | "cyan" | "rose" | "amber";
}) {
  const toneClass =
    tone === "emerald"
      ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-100"
      : tone === "cyan"
        ? "border-sky-400/25 bg-sky-500/10 text-sky-700 dark:text-sky-100"
        : tone === "rose"
          ? "border-rose-400/25 bg-rose-500/10 text-rose-700 dark:text-rose-100"
          : "border-amber-400/25 bg-amber-500/10 text-amber-700 dark:text-amber-100";

  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-slate-700 dark:text-white/60">{title}</div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">
            {value ? <span>{value}</span> : <Skeleton className="h-7 w-24" />}
          </div>
        </div>
        <div className={cn("grid h-10 w-10 place-items-center rounded-2xl border", toneClass)}>{icon}</div>
      </div>
    </div>
  );
}

function StatusRow({ label, status }: { label: string; status: "ok" | "warning" | "error" }) {
  const pillClass =
    status === "ok"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-100"
      : status === "warning"
        ? "bg-amber-500/15 text-amber-700 dark:text-amber-100"
        : "bg-rose-500/15 text-rose-700 dark:text-rose-100";

  const labelText = status === "ok" ? "OK" : status === "warning" ? "Pendiente" : "Error";

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-slate-900/5 px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <div className="text-sm text-slate-700 dark:text-white/80">{label}</div>
      <span className={cn("rounded-lg px-2 py-1 text-xs", pillClass)}>{labelText}</span>
    </div>
  );
}

function GuideStep({ index, title, description }: { index: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-slate-900/5 px-4 py-3 dark:border-white/10 dark:bg-white/5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-slate-200/70 bg-white/70 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
        {index}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold">{title}</div>
        <div className="mt-1 text-xs text-slate-700 dark:text-white/60">{description}</div>
      </div>
    </div>
  );
}

function toneBadge(tone: ProjectUpdate["tone"]) {
  if (tone === "success") return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-100";
  if (tone === "warning") return "bg-amber-500/15 text-amber-700 dark:text-amber-100";
  return "bg-sky-500/15 text-sky-700 dark:text-sky-100";
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}
