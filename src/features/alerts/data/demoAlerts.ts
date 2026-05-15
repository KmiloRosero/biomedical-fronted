export interface Alert {
  id: string;
  tipo: string;
  nivel: string;
  mensaje: string;
  entidad_id: string;
  fecha_creacion: string;
  resuelta: boolean;
}

export const systemAlerts: Alert[] = [
  { 
    id: "alert-001", 
    tipo: "vencimiento", 
    nivel: "critical", 
    mensaje: "Lote próximo a vencimiento en Hospital Universitario de Pasto", 
    entidad_id: "lot-004", 
    fecha_creacion: "2026-05-14T08:30:00Z", 
    resuelta: false 
  },
  { 
    id: "alert-002", 
    tipo: "mantenimiento", 
    nivel: "high", 
    mensaje: "Mantenimiento vencido para flota NAR-009", 
    entidad_id: "fleet-009", 
    fecha_creacion: "2026-05-14T07:15:00Z", 
    resuelta: false 
  },
  { 
    id: "alert-003", 
    tipo: "desviacion", 
    nivel: "high", 
    mensaje: "Ruta Sur desviada más de 30 minutos del programa", 
    entidad_id: "route-001", 
    fecha_creacion: "2026-05-14T09:45:00Z", 
    resuelta: false 
  },
  { 
    id: "alert-004", 
    tipo: "registro", 
    nivel: "medium", 
    mensaje: "Sin registros de residuos en Municipio de Barbacoas por 8 días", 
    entidad_id: "mun-032", 
    fecha_creacion: "2026-05-13T18:00:00Z", 
    resuelta: false 
  },
  { 
    id: "alert-005", 
    tipo: "capacidad", 
    nivel: "medium", 
    mensaje: "Alcanzado 90% de capacidad en centro de tratamiento", 
    entidad_id: "system", 
    fecha_creacion: "2026-05-14T06:00:00Z", 
    resuelta: false 
  },
  { 
    id: "alert-006", 
    tipo: "inventario", 
    nivel: "low", 
    mensaje: "Quedan menos de 50 contenedores disponibles para Pasto", 
    entidad_id: "mun-001", 
    fecha_creacion: "2026-05-13T14:30:00Z", 
    resuelta: true 
  },
  { 
    id: "alert-007", 
    tipo: "personal", 
    nivel: "medium", 
    mensaje: "Cambio de conductor para flota NAR-002 programado", 
    entidad_id: "fleet-002", 
    fecha_creacion: "2026-05-14T05:00:00Z", 
    resuelta: false 
  },
];
