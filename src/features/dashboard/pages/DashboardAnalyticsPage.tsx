import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ClipboardList,
  Download,
  Recycle,
  RefreshCw,
  Truck,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Surface } from "@/shared/ui/Surface";
import { Skeleton } from "@/shared/ui/Skeleton";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  MetricsService,
  type DashboardSummary,
  type MonthlyGenerationItem,
  type WasteTypeDistributionItem,
} from "../services/MetricsService";

const metricsService = new MetricsService();

export function DashboardAnalyticsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [monthly, setMonthly] = useState<MonthlyGenerationItem[]>([]);
  const [distribution, setDistribution] = useState<WasteTypeDistributionItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [s, m, d] = await Promise.all([
          metricsService.getDashboardSummary(),
          metricsService.getMonthlyGeneration(),
          metricsService.getWasteTypeDistribution(),
        ]);
        if (!isMounted) return;
        setSummary(s);
        setMonthly(m);
        setDistribution(d);
      } catch {
        if (!isMounted) return;
        setError("No se pudieron cargar las métricas.");
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

  const cards = useMemo(() => {
    const s = summary;
    return [
      {
        title: "Residuos recolectados hoy",
        value: s ? `${formatNumber(s.collectedTodayKg)} kg` : "—",
        icon: <Recycle className="h-5 w-5" />,
        tone: "emerald" as const,
        to: "/app/waste?estado=tratado",
      },
      {
        title: "Vehículos en ruta",
        value: s ? String(s.vehiclesOnRoute) : "—",
        icon: <Truck className="h-5 w-5" />,
        tone: "cyan" as const,
        to: "/app/admin/transport-fleet?estado=en%20ruta",
      },
      {
        title: "Alertas críticas activas",
        value: s ? String(s.criticalAlerts) : "—",
        icon: <AlertTriangle className="h-5 w-5" />,
        tone: "rose" as const,
        to: "/app/alerts?nivel=critical&open=1",
      },
      {
        title: "Órdenes pendientes",
        value: s ? String(s.pendingOrders) : "—",
        icon: <ClipboardList className="h-5 w-5" />,
        tone: "amber" as const,
        to: "/app/waste?estado=generado",
      },
    ];
  }, [summary]);

  const pieData = useMemo(() => {
    return distribution.map((d) => ({
      name: wasteTypeLabel(d.type),
      value: d.kilograms,
    }));
  }, [distribution]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3">
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Principal Analítico</h2>
          <p className="mt-1.5 text-base text-slate-700 dark:text-white/70">Centro de mando con métricas y gráficos interactivos.</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="hidden sm:flex items-center gap-2 rounded-xl border border-slate-200/70 bg-slate-900/5 px-4 py-2.5 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Actualizando..." : "Actualizado"}
        </motion.div>
      </div>

      {error ? <div className="text-sm text-rose-200">{error}</div> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={`summary-skeleton-${index}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: 0.05 * index }}
              >
                <Surface className="p-4 sm:p-6">
                  <Skeleton className="mb-2 h-4 w-32" />
                  <Skeleton className="h-7 w-24" />
                </Surface>
              </motion.div>
            ))
          : cards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, delay: 0.05 * index }}
              >
                <SummaryCard
                  title={card.title}
                  value={card.value}
                  icon={card.icon}
                  tone={card.tone}
                  onClick={() => navigate(card.to)}
                />
              </motion.div>
            ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.1 }}
        >
          <Surface className="p-4 sm:p-6">
            <div className="mb-4">
              <div className="text-base font-semibold">Generación de Residuos por Mes</div>
              <div className="text-sm text-slate-700 dark:text-white/60">Simulación de la vista v_generacion_mensual</div>
            </div>
            <div className="h-[400px]">
              {isLoading ? (
                <div className="flex h-full flex-col justify-end gap-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthly} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.6)" tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="rgba(255,255,255,0.6)"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(2,6,23,0.85)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      color: "rgba(255,255,255,0.9)",
                    }}
                    labelStyle={{ color: "rgba(255,255,255,0.75)" }}
                    formatter={(value) => [`${formatNumber(Number(value))} kg`, "Generación"]}
                  />
                  <Legend wrapperStyle={{ color: "rgba(255,255,255,0.75)" }} />
                    <Bar dataKey="kilograms" name="Kilogramos" fill="#10b981" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Surface>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.16 }}
        >
          <Surface className="p-4 sm:p-6">
            <div className="mb-4">
              <div className="text-base font-semibold">Distribución por Tipo de Residuo</div>
              <div className="text-sm text-slate-700 dark:text-white/60">Infeccioso, Químico, Cortopunzante</div>
            </div>
            <div className="h-[400px]">
              {isLoading ? (
                <div className="flex h-full flex-col items-center justify-center gap-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-40 w-40 rounded-full" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                  <Tooltip
                    contentStyle={{
                      background: "rgba(2,6,23,0.85)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 12,
                      color: "rgba(255,255,255,0.9)",
                    }}
                    formatter={(value, name) => [`${formatNumber(Number(value))} kg`, String(name)]}
                  />
                  <Legend wrapperStyle={{ color: "rgba(255,255,255,0.75)" }} />
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      stroke="rgba(255,255,255,0.12)"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={pieColor(index)} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Surface>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        whileHover={{ scale: 1.08, boxShadow: "0 20px 25px -5px rgba(16, 185, 129, 0.35)" }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 grid h-16 w-16 place-items-center rounded-full bg-emerald-600 text-white shadow-xl shadow-emerald-600/40 transition-all hover:bg-emerald-500"
        aria-label="Ir a reportes"
        onClick={() => navigate("/app/reports")}
      >
        <Download className="h-7 w-7" />
      </motion.button>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon,
  tone,
  onClick,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  tone: "emerald" | "cyan" | "rose" | "amber";
  onClick?: () => void;
}) {
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-500/10 text-emerald-100 border-emerald-400/20"
      : tone === "cyan"
        ? "bg-cyan-500/10 text-cyan-100 border-cyan-400/20"
        : tone === "rose"
          ? "bg-rose-500/10 text-rose-100 border-rose-400/20"
          : "bg-amber-500/10 text-amber-100 border-amber-400/20";

  return (
    <Surface
      className={cn(
        "p-6 sm:p-8 transition",
        onClick ? "cursor-pointer hover:bg-slate-900/5 dark:hover:bg-white/5" : null
      )}
    >
      <button type="button" className="w-full text-left" onClick={onClick}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-base text-slate-700 dark:text-white/70 font-medium">{title}</div>
            <div className="mt-3 text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</div>
          </div>
          <div className={cn("grid h-14 w-14 place-items-center rounded-3xl border", toneClass)}>
            {icon}
          </div>
        </div>
      </button>
    </Surface>
  );
}

function wasteTypeLabel(type: WasteTypeDistributionItem["type"]) {
  if (type === "INFECTIOUS") return "Infeccioso";
  if (type === "CHEMICAL") return "Químico";
  return "Cortopunzante";
}

function pieColor(index: number) {
  const palette = ["#10b981", "#38bdf8", "#f43f5e", "#f59e0b", "#a78bfa"];
  return palette[index % palette.length]!;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(value);
}
