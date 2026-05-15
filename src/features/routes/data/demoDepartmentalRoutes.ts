export interface DepartmentalRoute {
  id: string;
  nombre: string;
  flota_id: string;
  municipios_ids: string[];
  horario: string;
  progreso: string;
  isActive: boolean;
}

export const departmentalRoutes: DepartmentalRoute[] = [
  // Ruta Sur - Pasto y alrededores
  { 
    id: "route-001", 
    nombre: "Ruta Sur - Área Metropolitana", 
    flota_id: "fleet-001", 
    municipios_ids: ["mun-001", "mun-002", "mun-003", "mun-004", "mun-005"],
    horario: "Lun-Mié-Vie 06:00-18:00", 
    progreso: "75%",
    isActive: true 
  },
  // Ruta Norte - Ipiales, Túquerres y fronteriza
  { 
    id: "route-002", 
    nombre: "Ruta Norte - Fronteriza", 
    flota_id: "fleet-002", 
    municipios_ids: ["mun-011", "mun-012", "mun-013", "mun-017", "mun-018"],
    horario: "Mar-Jue-Sáb 05:00-20:00", 
    progreso: "45%",
    isActive: true 
  },
  // Ruta Occidente - Costa Pacífica
  { 
    id: "route-003", 
    nombre: "Ruta Occidente - Pacífico", 
    flota_id: "fleet-003", 
    municipios_ids: ["mun-031", "mun-032", "mun-033", "mun-035", "mun-038"],
    horario: "Lun-Jue 04:00-22:00", 
    progreso: "30%",
    isActive: true 
  },
  // Ruta Oriente - Putumayo
  { 
    id: "route-004", 
    nombre: "Ruta Oriente - Amazónica", 
    flota_id: "fleet-004", 
    municipios_ids: ["mun-041", "mun-042", "mun-043", "mun-045", "mun-046"],
    horario: "Miér-Sáb 06:00-20:00", 
    progreso: "60%",
    isActive: true 
  },
  // Ruta Centro - La Unión y centro del departamento
  { 
    id: "route-005", 
    nombre: "Ruta Centro - Cordillera", 
    flota_id: "fleet-005", 
    municipios_ids: ["mun-021", "mun-022", "mun-024", "mun-025", "mun-060"],
    horario: "Mar-Vie 07:00-19:00", 
    progreso: "85%",
    isActive: true 
  },
  // Ruta Suroccidente - Costa baja
  { 
    id: "route-006", 
    nombre: "Ruta Suroccidente - Litoral", 
    flota_id: "fleet-006", 
    municipios_ids: ["mun-036", "mun-037", "mun-039", "mun-040", "mun-063"],
    horario: "Sáb-Dom 05:00-23:00", 
    progreso: "20%",
    isActive: true 
  },
  // Ruta Nororiente - Mocoa extension
  { 
    id: "route-007", 
    nombre: "Ruta Nororiente - Putumayo Ampliada", 
    flota_id: "fleet-007", 
    municipios_ids: ["mun-041", "mun-044", "mun-047", "mun-050"],
    horario: "Jue-Dom 06:00-22:00", 
    progreso: "55%",
    isActive: true 
  },
  // Ruta Especial - Emergencias
  { 
    id: "route-008", 
    nombre: "Ruta Especial - Urgencias", 
    flota_id: "fleet-008", 
    municipios_ids: ["mun-001", "mun-011", "mun-031", "mun-041"],
    horario: "24/7 - Emergencias", 
    progreso: "100%",
    isActive: true 
  },
  {
    id: "route-009",
    nombre: "Ruta Oriente - Cordillera Alta",
    flota_id: "fleet-014",
    municipios_ids: ["mun-024", "mun-025", "mun-030", "mun-010", "mun-008"],
    horario: "Lun-Mié 07:00-18:00",
    progreso: "40%",
    isActive: true,
  },
  {
    id: "route-010",
    nombre: "Ruta Occidente - Pacífico Norte",
    flota_id: "fleet-016",
    municipios_ids: ["mun-034", "mun-035", "mun-037", "mun-039", "mun-040"],
    horario: "Mar-Vie 04:30-21:30",
    progreso: "25%",
    isActive: true,
  },
  {
    id: "route-011",
    nombre: "Ruta Centro - Intermunicipal",
    flota_id: "fleet-012",
    municipios_ids: ["mun-021", "mun-022", "mun-023", "mun-024", "mun-025"],
    horario: "Mar-Jue 06:00-19:00",
    progreso: "65%",
    isActive: true,
  },
  {
    id: "route-012",
    nombre: "Ruta Norte - Altiplano",
    flota_id: "fleet-013",
    municipios_ids: ["mun-026", "mun-027", "mun-028", "mun-015", "mun-016"],
    horario: "Miér-Sáb 05:30-19:30",
    progreso: "55%",
    isActive: true,
  },
  {
    id: "route-013",
    nombre: "Ruta Sur - Corredor Hospitalario",
    flota_id: "fleet-011",
    municipios_ids: ["mun-001", "mun-004", "mun-005", "mun-006", "mun-003"],
    horario: "Lun-Vie 06:00-17:00",
    progreso: "80%",
    isActive: true,
  },
  {
    id: "route-014",
    nombre: "Ruta Especial - Recolección Nocturna",
    flota_id: "fleet-019",
    municipios_ids: ["mun-001", "mun-011", "mun-012"],
    horario: "Nocturna 19:00-02:00",
    progreso: "10%",
    isActive: true,
  },
];
