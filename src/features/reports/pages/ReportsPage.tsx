import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, RefreshCw, FileText, Table } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { isDemoMode } from "@/core/config/flags";
import { wasteLots } from "@/features/waste/data/demoWasteLots";
import { nariñoMunicipalities } from "@/features/admin/data/demoMunicipalities";
import { Surface } from "@/shared/ui/Surface";
import { Button } from "@/shared/ui/Button";
import { Skeleton } from "@/shared/ui/Skeleton";
import { JsonViewer } from "@/shared/ui/JsonViewer";
import { toast } from "react-hot-toast";

// Generar datos de gráficos desde datos demo
function generateTrendData() {
  const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const baseKg = 8000;
  return months.map((month, i) => ({
    label: month,
    kilograms: Math.round(baseKg + (i * 300) + Math.random() * 500)
  }));
}

function generateDistributionData() {
  return [
    { label: "Biosanitarios", kilograms: wasteLots.filter(w => w.tipo_residuo_id === "res-001").reduce((s, w) => s + w.cantidad_kg, 0) || 5200 },
    { label: "Químicos", kilograms: wasteLots.filter(w => w.tipo_residuo_id === "res-005" || w.tipo_residuo_id === "res-007").reduce((s, w) => s + w.cantidad_kg, 0) || 2100 },
    { label: "Cortopunzantes", kilograms: wasteLots.filter(w => w.tipo_residuo_id === "res-002").reduce((s, w) => s + w.cantidad_kg, 0) || 1700 },
  ];
}

function generateTopGenerators() {
  // Calcular generación por municipio
  const municipalityTotals: Record<string, number> = {};
  wasteLots.forEach(w => {
    municipalityTotals[w.municipio_id] = (municipalityTotals[w.municipio_id] || 0) + w.cantidad_kg;
  });
  
  // Convertir a array ordenado
  return Object.entries(municipalityTotals)
    .map(([id, kg]) => {
      const municipality = nariñoMunicipalities.find(m => m.id === id);
      return {
        label: municipality?.nombre || "Desconocido",
        kilograms: Math.round(kg)
      };
    })
    .sort((a, b) => b.kilograms - a.kilograms)
    .slice(0, 10);
}

// Funciones de exportación
function exportToCSV() {
  // Crear CSV simple
  const headers = ["ID", "Institución", "Municipio", "Cantidad kg", "Estado", "Fecha generación"];
  const rows = wasteLots.map(w => {
    const municipality = nariñoMunicipalities.find(m => m.id === w.municipio_id);
    return [w.id, w.institucion, municipality?.nombre || "", w.cantidad_kg, w.estado, w.fecha_generacion].join(",");
  });
  
  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reporte-residuos-narino-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("CSV exportado correctamente");
}

function exportToJSON() {
  const report = {
    generatedAt: new Date().toISOString(),
    totalWasteLots: wasteLots.length,
    totalKilograms: wasteLots.reduce((s, w) => s + w.cantidad_kg, 0),
    municipalities: nariñoMunicipalities.length,
    activeFleets: nariñoMunicipalities.filter(m => m.isActive).length,
    data: wasteLots
  };
  
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `reporte-completo-narino-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("JSON exportado correctamente");
}

export function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [kpis, setKpis] = useState<unknown>(null);
  const [trend, setTrend] = useState<unknown>(null);
  const [distribution, setDistribution] = useState<unknown>(null);
  const [topGenerators, setTopGenerators] = useState<unknown>(null);

  const trendChart = useMemo(() => normalizeTrend(trend), [trend]);
  const distChart = useMemo(() => normalizeDistribution(distribution), [distribution]);
  const topChart = useMemo(() => normalizeTopGenerators(topGenerators), [topGenerators]);

  async function load() {
    setIsLoading(true);
    setError(null);
    try {
      // En modo demo, usar datos generados localmente
      if (isDemoMode()) {
        const trendData = generateTrendData();
        const distData = generateDistributionData();
        const topData = generateTopGenerators();
        
        setTrend(trendData);
        setDistribution(distData);
        setTopGenerators(topData);
        setKpis({
          totalKilograms: wasteLots.reduce((s, w) => s + w.cantidad_kg, 0),
          totalLots: wasteLots.length,
          activeMunicipalities: nariñoMunicipalities.filter(m => m.isActive).length,
          compliance: "94%"
        });
      } else {
        // Modo producción - mantener lógica original
        const client = new (await import("@/core/services/RestClient")).RestClient();
        const [k, d, t, top] = await Promise.all([
          client.get<unknown>("/api/statistics"),
          client.get<unknown>("/api/statistics/distribution"),
          client.get<unknown>("/api/statistics/trend", { months: 12 }),
          client.get<unknown>("/api/statistics/top-generators"),
        ]);
        setKpis(k);
        setDistribution(d);
        setTrend(t);
        setTopGenerators(top);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo cargar.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-semibold">Reportes - Nariño</h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-white/70">
            Estadísticas completas del sistema de gestión de residuos biológicos.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" onClick={exportToCSV} disabled={isLoading}>
            <Table className="h-4 w-4" />
            Exportar CSV
          </Button>
          <Button type="button" variant="secondary" onClick={exportToJSON} disabled={isLoading}>
            <FileText className="h-4 w-4" />
            Exportar JSON
          </Button>
          <Button type="button" variant="secondary" onClick={() => void load()} disabled={isLoading}>
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>
      </div>

      {error ? <div className="text-sm text-rose-600 dark:text-rose-200">{error}</div> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="lg:col-span-2">
          <Surface className="p-4 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-base font-semibold">Tendencia de generación</div>
                <div className="mt-1 text-sm text-slate-700 dark:text-white/60">Últimos 12 meses</div>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-2xl border border-slate-200/70 bg-slate-900/5 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>

            <div className="h-[320px]">
              {isLoading ? (
                <div className="flex h-full flex-col justify-end gap-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-40 w-full" />
                </div>
              ) : trendChart.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trendChart} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="label" tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(2,6,23,0.92)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 12,
                        color: "rgba(255,255,255,0.92)",
                      }}
                    />
                    <Bar dataKey="kilograms" name="Kilogramos" fill="#10b981" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <JsonViewer value={trend} />
              )}
            </div>
          </Surface>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.06 }}>
          <Surface className="p-4 sm:p-6">
            <div className="mb-4">
              <div className="text-base font-semibold">Distribución</div>
              <div className="mt-1 text-sm text-slate-700 dark:text-white/60">Por tipo de residuo</div>
            </div>

            <div className="h-[320px]">
              {isLoading ? (
                <div className="flex h-full flex-col items-center justify-center gap-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-40 w-40 rounded-full" />
                </div>
              ) : distChart.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip
                      contentStyle={{
                        background: "rgba(2,6,23,0.92)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 12,
                        color: "rgba(255,255,255,0.92)",
                      }}
                    />
                    <Pie
                      data={distChart}
                      dataKey="kilograms"
                      nameKey="label"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      stroke="rgba(255,255,255,0.12)"
                    >
                      {distChart.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={pieColor(index)} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <JsonViewer value={distribution} />
              )}
            </div>
          </Surface>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2, delay: 0.1 }}>
        <Surface className="p-4 sm:p-6">
          <div className="text-base font-semibold">Top generadores</div>
          <div className="mt-1 text-sm text-slate-700 dark:text-white/60">Ranking por generación (si el backend lo provee)</div>

          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            <div className="h-[280px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : topChart.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topChart} layout="vertical" margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
                    <XAxis type="number" tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="label" tick={{ fill: "rgba(148,163,184,0.9)", fontSize: 12 }} width={110} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(2,6,23,0.92)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 12,
                        color: "rgba(255,255,255,0.92)",
                      }}
                    />
                    <Bar dataKey="kilograms" name="Kilogramos" fill="#38bdf8" radius={[10, 10, 10, 10]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <JsonViewer value={topGenerators} />
              )}
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200/70 bg-slate-900/5 p-4 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                <div className="font-semibold">KPIs</div>
                <div className="mt-2">
                  {isLoading ? <Skeleton className="h-4 w-56" /> : <JsonViewer value={kpis} />}
                </div>
              </div>
            </div>
          </div>
        </Surface>
      </motion.div>
    </div>
  );
}

type ChartPoint = { label: string; kilograms: number };

function normalizeTrend(input: unknown): ChartPoint[] {
  if (!input) return [];
  const arr = Array.isArray(input) ? input : (input as { items?: unknown }).items;
  if (!Array.isArray(arr)) return [];
  const out: ChartPoint[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const label = String(o["month"] ?? o["label"] ?? o["period"] ?? "");
    const kg = Number(o["kilograms"] ?? o["kg"] ?? o["value"] ?? 0);
    if (!label) continue;
    out.push({ label, kilograms: Number.isFinite(kg) ? kg : 0 });
  }
  return out.slice(-12);
}

function normalizeDistribution(input: unknown): ChartPoint[] {
  if (!input) return [];
  const arr = Array.isArray(input) ? input : (input as { items?: unknown }).items;
  if (!Array.isArray(arr)) return [];
  const out: ChartPoint[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const label = String(o["type"] ?? o["label"] ?? o["name"] ?? "");
    const kg = Number(o["kilograms"] ?? o["kg"] ?? o["value"] ?? 0);
    if (!label) continue;
    out.push({ label, kilograms: Number.isFinite(kg) ? kg : 0 });
  }
  return out;
}

function normalizeTopGenerators(input: unknown): ChartPoint[] {
  if (!input) return [];
  const arr = Array.isArray(input) ? input : (input as { items?: unknown }).items;
  if (!Array.isArray(arr)) return [];
  const out: ChartPoint[] = [];
  for (const item of arr) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    const label = String(o["generatorUnit"] ?? o["name"] ?? o["label"] ?? "");
    const kg = Number(o["kilograms"] ?? o["kg"] ?? o["value"] ?? 0);
    if (!label) continue;
    out.push({ label, kilograms: Number.isFinite(kg) ? kg : 0 });
  }
  out.sort((a, b) => b.kilograms - a.kilograms);
  return out.slice(0, 10);
}

function pieColor(index: number) {
  const palette = ["#10b981", "#38bdf8", "#f97316", "#a78bfa", "#f43f5e", "#eab308"];
  return palette[index % palette.length]!;
}
