import { isDemoMode } from "@/core/config/flags";
import { wasteLots } from "@/features/waste/data/demoWasteLots";
import { systemAlerts } from "@/features/alerts/data/demoAlerts";
import { departmentalRoutes } from "@/features/routes/data/demoDepartmentalRoutes";

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
  
  const today = new Date().toISOString().split('T')[0]!;
  const collectedToday = wasteLots
    .filter(w => w.estado === "tratado" && w.fecha_generacion >= today)
    .reduce((sum, w) => sum + w.cantidad_kg, 0);
  
  return Math.round(collectedToday || 1240);
}

function calculateCriticalAlerts(): number {
  if (!isDemoMode()) return 3;
  
  return systemAlerts.filter(a => a.nivel === "critical" && !a.resuelta).length;
}

function calculatePendingOrders(): number {
  if (!isDemoMode()) return 14;
  
  return wasteLots.filter(w => w.estado === "generado").length;
}

export class MetricsService {
  public async getTotalWastes(): Promise<number> {
    await this.delay(300);
    return calculateCollectedToday();
  }

  public async getActiveRoutes(): Promise<number> {
    await this.delay(260);
    return departmentalRoutes.filter(r => r.isActive).length;
  }

  public async getMonthlyGeneration(): Promise<MonthlyGenerationItem[]> {
    await this.delay(420);
    return [
      { month: "Ene", kilograms: 8200 },
      { month: "Feb", kilograms: 7800 },
      { month: "Mar", kilograms: 9100 },
      { month: "Abr", kilograms: 8600 },
      { month: "May", kilograms: calculateCollectedToday() * 30 }, // Total mensual estimado
      { month: "Jun", kilograms: 9900 },
      { month: "Jul", kilograms: 10150 },
      { month: "Ago", kilograms: 9700 },
      { month: "Sep", kilograms: 10400 },
      { month: "Oct", kilograms: 11250 },
      { month: "Nov", kilograms: 10900 },
      { month: "Dic", kilograms: 11850 },
    ];
  }

  public async getWasteTypeDistribution(): Promise<WasteTypeDistributionItem[]> {
    await this.delay(320);
    // Calcular distribución real desde datos demo
    const biosanitarios = wasteLots.filter(w => w.tipo_residuo_id.includes("res-001")).reduce((s, w) => s + w.cantidad_kg, 0);
    const químicos = wasteLots.filter(w => w.tipo_residuo_id.includes("res-005") || w.tipo_residuo_id.includes("res-007")).reduce((s, w) => s + w.cantidad_kg, 0);
    const cortopunzantes = wasteLots.filter(w => w.tipo_residuo_id.includes("res-002")).reduce((s, w) => s + w.cantidad_kg, 0);
    
    return [
      { type: "INFECTIOUS", kilograms: Math.round(biosanitarios || 5200) },
      { type: "CHEMICAL", kilograms: Math.round(químicos || 2100) },
      { type: "SHARPS", kilograms: Math.round(cortopunzantes || 1700) },
    ];
  }

  public async getDashboardSummary(): Promise<DashboardSummary> {
    const [collectedTodayKg, vehiclesOnRoute] = await Promise.all([
      this.getTotalWastes(),
      this.getActiveRoutes(),
    ]);
    await this.delay(180);
    return {
      collectedTodayKg,
      vehiclesOnRoute,
      criticalAlerts: calculateCriticalAlerts(),
      pendingOrders: calculatePendingOrders(),
    };
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
