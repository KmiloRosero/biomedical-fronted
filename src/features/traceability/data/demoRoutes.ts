import type { BackendRoute, BackendStop } from "../services/RoutesService";

export const demoRoutes: BackendRoute[] = [
  {
    id: "demo-bogota-01",
    code: "BOG-01",
    name: "Ruta Bogotá Norte",
    status: "ACTIVE",
  },
  {
    id: "demo-bogota-02",
    code: "BOG-02",
    name: "Ruta Bogotá Centro",
    status: "ACTIVE",
  },
  {
    id: "demo-soacha-01",
    code: "SOA-01",
    name: "Ruta Soacha",
    status: "ACTIVE",
  },
];

const demoStopsByRouteId: Record<string, BackendStop[]> = {
  "demo-bogota-01": [
    { id: "s1", name: "Hospital Universitario", lat: 4.6533, lng: -74.0837 },
    { id: "s2", name: "Punto de recolección", lat: 4.6678, lng: -74.0896 },
    { id: "s3", name: "Planta de tratamiento", lat: 4.7017, lng: -74.0721 },
    { id: "s4", name: "Disposición final", lat: 4.7252, lng: -74.055 },
  ],
  "demo-bogota-02": [
    { id: "s1", name: "Clínica Central", lat: 4.624, lng: -74.071 },
    { id: "s2", name: "Punto de transferencia", lat: 4.635, lng: -74.08 },
    { id: "s3", name: "Planta de tratamiento", lat: 4.654, lng: -74.095 },
    { id: "s4", name: "Disposición final", lat: 4.667, lng: -74.11 },
  ],
  "demo-soacha-01": [
    { id: "s1", name: "Hospital de Soacha", lat: 4.579, lng: -74.215 },
    { id: "s2", name: "Recolección municipal", lat: 4.586, lng: -74.205 },
    { id: "s3", name: "Planta de tratamiento", lat: 4.602, lng: -74.19 },
    { id: "s4", name: "Disposición final", lat: 4.624, lng: -74.175 },
  ],
};

export function getDemoStops(routeId: string): BackendStop[] {
  return demoStopsByRouteId[routeId] ?? [];
}
