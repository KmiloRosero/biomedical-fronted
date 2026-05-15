import type { BackendRoute, BackendStop } from "../services/RoutesService";

export const demoRoutes: BackendRoute[] = [
  {
    id: "demo-pasto-01",
    code: "PAS-01",
    name: "Ruta Pasto Centro",
    status: "ACTIVE",
  },
  {
    id: "demo-pasto-02",
    code: "PAS-02",
    name: "Ruta Pasto Norte",
    status: "ACTIVE",
  },
  {
    id: "demo-pasto-03",
    code: "PAS-03",
    name: "Ruta Pasto Sur",
    status: "ACTIVE",
  },
];

const demoStopsByRouteId: Record<string, BackendStop[]> = {
  "demo-pasto-01": [
    { id: "s1", name: "Hospital (Centro)", lat: 1.2142, lng: -77.2798 },
    { id: "s2", name: "Punto de recolección", lat: 1.2186, lng: -77.2855 },
    { id: "s3", name: "Planta de tratamiento", lat: 1.2264, lng: -77.2897 },
    { id: "s4", name: "Disposición final", lat: 1.2332, lng: -77.2758 },
  ],
  "demo-pasto-02": [
    { id: "s1", name: "Clínica (Norte)", lat: 1.2335, lng: -77.2865 },
    { id: "s2", name: "Transferencia", lat: 1.2441, lng: -77.2922 },
    { id: "s3", name: "Tratamiento", lat: 1.252, lng: -77.283 },
    { id: "s4", name: "Disposición final", lat: 1.2472, lng: -77.2688 },
  ],
  "demo-pasto-03": [
    { id: "s1", name: "Hospital (Sur)", lat: 1.1965, lng: -77.2862 },
    { id: "s2", name: "Punto de recolección", lat: 1.191, lng: -77.2749 },
    { id: "s3", name: "Tratamiento", lat: 1.2002, lng: -77.2635 },
    { id: "s4", name: "Disposición final", lat: 1.2108, lng: -77.2582 },
  ],
};

export function getDemoStops(routeId: string): BackendStop[] {
  return demoStopsByRouteId[routeId] ?? [];
}
