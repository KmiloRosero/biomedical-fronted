import { isDemoMode } from "@/core/config/flags";

type DemoWasteLot = {
  cantidad_kg: number;
  estado: string;
  fecha_generacion: string;
  tipo_residuo_id: string;
};

type DemoFleet = {
  estado: string;
  isActive: boolean;
};

type DemoRoute = {
  isActive: boolean;
};

type DemoAlert = {
  nivel: string;
  resuelta: boolean;
};

export type MonthlyGenerationItem = {
  month: string;
  kilograms: number;
};

export type WasteTypeDistributionItem = {
  type: "INFECTIOUS" | "CHEMICAL" | "SHARPS";
  kilograms: number;
};

export type DashboardSummary = {
  collectedTodayKg: number;
  vehiclesOnRoute: number;
  criticalAlerts: number;
  pendingOrders: number;
};

// Calcular métricas desde datos demo
function calculateCollectedToday(): number {
  if (!isDemoMode()) return 1240;
  
  const wasteLots = readDemo<DemoWasteLot[]>("demo_waste-lots", []);
  const today = new Date().toISOString().split("T")[0]!;
  const todays = wasteLots.filter((w) => w.fecha_generacion === today);

  const collectedToday = (todays.length ? todays : wasteLots)
    .filter((w) => w.estado === "tratado" || w.estado === "en ruta")
    .reduce((sum, w) => sum + (Number(w.cantidad_kg) || 0), 0);
  
  return Math.round(collectedToday || 1240);
}

function calculateCriticalAlerts(): number {
  if (!isDemoMode()) return 3;
  
  const alerts = readDemo<DemoAlert[]>("demo_system-alerts", []);
  return alerts.filter((a) => a.nivel === "critical" && !a.resuelta).length;
}

function calculatePendingOrders(): number {
  if (!isDemoMode()) return 14;
  
  const wasteLots = readDemo<DemoWasteLot[]>("demo_waste-lots", []);
  return wasteLots.filter((w) => w.estado === "generado").length;
}

function calculateVehiclesOnRoute(): number {
  if (!isDemoMode()) return 8;
  const fleets = readDemo<DemoFleet[]>("demo_transport-fleet", []);
  const count = fleets.filter((f) => f.isActive !== false && String(f.estado).toLowerCase() === "en ruta").length;
  return count || 8;
}

function calculateActiveRoutes(): number {
  if (!isDemoMode()) return 8;
  const routes = readDemo<DemoRoute[]>("demo_departmental-routes", []);
  const count = routes.filter((r) => r.isActive).length;
  return count || 8;
}

function calculateMonthlyGeneration(): MonthlyGenerationItem[] {
  const labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  if (!isDemoMode()) {
    return labels.map((month, i) => ({ month, kilograms: 8200 + i * 350 }));
  }

  const lots = readDemo<DemoWasteLot[]>("demo_waste-lots", []);
  const byMonth = new Array<number>(12).fill(0);
  for (const lot of lots) {
    const iso = String(lot.fecha_generacion || "");
    const parts = iso.split("-");
    if (parts.length < 2) continue;
    const monthIndex = Number(parts[1]) - 1;
    if (monthIndex < 0 || monthIndex > 11) continue;
    byMonth[monthIndex] = (byMonth[monthIndex] ?? 0) + (Number(lot.cantidad_kg) || 0);
  }

  const total = byMonth.reduce((s, v) => s + v, 0);
  if (total === 0) {
    return labels.map((month, i) => ({ month, kilograms: 7800 + i * 420 }));
  }

  return labels.map((month, i) => ({ month, kilograms: Math.round(byMonth[i] || 0) }));
}

function calculateWasteTypeDistribution(): WasteTypeDistributionItem[] {
  if (!isDemoMode()) {
    return [
      { type: "INFECTIOUS", kilograms: 5200 },
      { type: "CHEMICAL", kilograms: 2100 },
      { type: "SHARPS", kilograms: 1700 },
    ];
  }

  const lots = readDemo<DemoWasteLot[]>("demo_waste-lots", []);
  const infectiousIds = new Set(["res-001", "res-003", "res-004", "res-011", "res-015"]);
  const chemicalIds = new Set(["res-005", "res-007", "res-009", "res-012"]);
  const sharpsIds = new Set(["res-002"]);

  let infectious = 0;
  let chemical = 0;
  let sharps = 0;
  for (const lot of lots) {
    const kg = Number(lot.cantidad_kg) || 0;
    const id = String(lot.tipo_residuo_id);
    if (sharpsIds.has(id)) {
      sharps += kg;
      continue;
    }
    if (chemicalIds.has(id)) {
      chemical += kg;
      continue;
    }
    if (infectiousIds.has(id)) {
      infectious += kg;
      continue;
    }
    infectious += kg;
  }

  return [
    { type: "INFECTIOUS", kilograms: Math.round(infectious || 5200) },
    { type: "CHEMICAL", kilograms: Math.round(chemical || 2100) },
    { type: "SHARPS", kilograms: Math.round(sharps || 1700) },
  ];
}

function readDemo<T>(key: string, fallback: T): T {
  if (!isDemoMode()) return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export class MetricsService {
  public async getTotalWastes(): Promise<number> {
    await this.delay(300);
    return calculateCollectedToday();
  }

  public async getActiveRoutes(): Promise<number> {
    await this.delay(260);
    return calculateActiveRoutes();
  }

  public async getMonthlyGeneration(): Promise<MonthlyGenerationItem[]> {
    await this.delay(420);
    return calculateMonthlyGeneration();
  }

  public async getWasteTypeDistribution(): Promise<WasteTypeDistributionItem[]> {
    await this.delay(320);
    return calculateWasteTypeDistribution();
  }

  public async getDashboardSummary(): Promise<DashboardSummary> {
    const [collectedTodayKg, activeRoutes] = await Promise.all([this.getTotalWastes(), this.getActiveRoutes()]);
    await this.delay(180);
    return {
      collectedTodayKg,
      vehiclesOnRoute: calculateVehiclesOnRoute() || activeRoutes,
      criticalAlerts: calculateCriticalAlerts(),
      pendingOrders: calculatePendingOrders(),
    };
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
