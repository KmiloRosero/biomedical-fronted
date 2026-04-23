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

export class MetricsService {
  public async getTotalWastes(): Promise<number> {
    await this.delay(300);
    return 1240;
  }

  public async getActiveRoutes(): Promise<number> {
    await this.delay(260);
    return 7;
  }

  public async getMonthlyGeneration(): Promise<MonthlyGenerationItem[]> {
    await this.delay(420);
    return [
      { month: "Ene", kilograms: 8200 },
      { month: "Feb", kilograms: 7800 },
      { month: "Mar", kilograms: 9100 },
      { month: "Abr", kilograms: 8600 },
      { month: "May", kilograms: 9400 },
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
    return [
      { type: "INFECTIOUS", kilograms: 5200 },
      { type: "CHEMICAL", kilograms: 2100 },
      { type: "SHARPS", kilograms: 1700 },
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
      criticalAlerts: 3,
      pendingOrders: 14,
    };
  }

  private async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
