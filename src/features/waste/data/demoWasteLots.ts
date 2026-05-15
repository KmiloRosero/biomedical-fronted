export interface WasteLot {
  id: string;
  municipio_id: string;
  tipo_residuo_id: string;
  cantidad_kg: number;
  estado: string;
  fecha_generacion: string;
  fecha_vencimiento: string;
  institucion: string;
  isActive: boolean;
}

// Generar 50 lotes de residuos demo distribuidos por los municipios de Nariño
export const wasteLots: WasteLot[] = [
  // Pasto (municipio principal) - muchos lotes
  { id: "lot-001", municipio_id: "mun-001", tipo_residuo_id: "res-001", cantidad_kg: 150.5, estado: "generado", fecha_generacion: "2026-05-10", fecha_vencimiento: "2026-05-17", institucion: "Hospital Universitario de Pasto", isActive: true },
  { id: "lot-002", municipio_id: "mun-001", tipo_residuo_id: "res-002", cantidad_kg: 45.2, estado: "en ruta", fecha_generacion: "2026-05-12", fecha_vencimiento: "2026-05-17", institucion: "Clínica del Sur", isActive: true },
  { id: "lot-003", municipio_id: "mun-001", tipo_residuo_id: "res-003", cantidad_kg: 28.8, estado: "tratado", fecha_generacion: "2026-05-08", fecha_vencimiento: "2026-05-11", institucion: "Hospital Pablo VI", isActive: true },
  { id: "lot-004", municipio_id: "mun-001", tipo_residuo_id: "res-005", cantidad_kg: 15.3, estado: "generado", fecha_generacion: "2026-05-13", fecha_vencimiento: "2026-05-15", institucion: "Centro Oncológico de Nariño", isActive: true },
  { id: "lot-005", municipio_id: "mun-001", tipo_residuo_id: "res-001", cantidad_kg: 200.0, estado: "en ruta", fecha_generacion: "2026-05-11", fecha_vencimiento: "2026-05-18", institucion: "Hospital San Pedro", isActive: true },
  { id: "lot-006", municipio_id: "mun-001", tipo_residuo_id: "res-011", cantidad_kg: 85.5, estado: "generado", fecha_generacion: "2026-05-14", fecha_vencimiento: "2026-05-17", institucion: "Hospital de Niños de Pasto", isActive: true },
  { id: "lot-007", municipio_id: "mun-001", tipo_residuo_id: "res-006", cantidad_kg: 32.0, estado: "tratado", fecha_generacion: "2026-05-05", fecha_vencimiento: "2026-05-15", institucion: "Farmacéutica Nariñense", isActive: true },
  
  // Ipiales
  { id: "lot-008", municipio_id: "mun-011", tipo_residuo_id: "res-001", cantidad_kg: 120.3, estado: "en ruta", fecha_generacion: "2026-05-12", fecha_vencimiento: "2026-05-19", institucion: "Hospital San Lázaro de Ipiales", isActive: true },
  { id: "lot-009", municipio_id: "mun-011", tipo_residuo_id: "res-002", cantidad_kg: 38.5, estado: "generado", fecha_generacion: "2026-05-13", fecha_vencimiento: "2026-05-18", institucion: "Clínica Ipiales", isActive: true },
  { id: "lot-010", municipio_id: "mun-011", tipo_residuo_id: "res-010", cantidad_kg: 180.0, estado: "tratado", fecha_generacion: "2026-05-04", fecha_vencimiento: "2026-05-19", institucion: "Centro Médico Fronterizo", isActive: true },
  
  // Túquerres
  { id: "lot-011", municipio_id: "mun-012", tipo_residuo_id: "res-001", cantidad_kg: 65.8, estado: "generado", fecha_generacion: "2026-05-13", fecha_vencimiento: "2026-05-20", institucion: "Hospital de Túquerres", isActive: true },
  { id: "lot-012", municipio_id: "mun-012", tipo_residuo_id: "res-007", cantidad_kg: 22.4, estado: "en ruta", fecha_generacion: "2026-05-11", fecha_vencimiento: "2026-05-25", institucion: "Laboratorio Clínico del Norte", isActive: true },
  
  // Tumaco
  { id: "lot-013", municipio_id: "mun-031", tipo_residuo_id: "res-001", cantidad_kg: 135.2, estado: "en ruta", fecha_generacion: "2026-05-10", fecha_vencimiento: "2026-05-17", institucion: "Hospital de Tumaco", isActive: true },
  { id: "lot-014", municipio_id: "mun-031", tipo_residuo_id: "res-011", cantidad_kg: 95.6, estado: "generado", fecha_generacion: "2026-05-14", fecha_vencimiento: "2026-05-17", institucion: "PUJ Tumaco", isActive: true },
  { id: "lot-015", municipio_id: "mun-031", tipo_residuo_id: "res-003", cantidad_kg: 42.1, estado: "tratado", fecha_generacion: "2026-05-06", fecha_vencimiento: "2026-05-09", institucion: "Maternidad del Pacífico", isActive: true },
  
  // Barbacoas
  { id: "lot-016", municipio_id: "mun-032", tipo_residuo_id: "res-001", cantidad_kg: 48.5, estado: "generado", fecha_generacion: "2026-05-12", fecha_vencimiento: "2026-05-19", institucion: "Hospital San Antonio de Barbacoas", isActive: true },
  
  // Mocoa
  { id: "lot-017", municipio_id: "mun-041", tipo_residuo_id: "res-001", cantidad_kg: 78.9, estado: "en ruta", fecha_generacion: "2026-05-11", fecha_vencimiento: "2026-05-18", institucion: "Hospital de Mocoa", isActive: true },
  { id: "lot-018", municipio_id: "mun-041", tipo_residuo_id: "res-002", cantidad_kg: 25.3, estado: "generado", fecha_generacion: "2026-05-14", fecha_vencimiento: "2026-05-19", institucion: "Centro de Salud Mocoa", isActive: true },
  
  // Villagarzón
  { id: "lot-019", municipio_id: "mun-042", tipo_residuo_id: "res-001", cantidad_kg: 42.6, estado: "tratado", fecha_generacion: "2026-05-07", fecha_vencimiento: "2026-05-14", institucion: "Hospital de Villagarzón", isActive: true },
  
  // La Unión
  { id: "lot-020", municipio_id: "mun-021", tipo_residuo_id: "res-001", cantidad_kg: 52.4, estado: "generado", fecha_generacion: "2026-05-13", fecha_vencimiento: "2026-05-20", institucion: "Hospital La Unión", isActive: true },
  
  // Sandoná
  { id: "lot-021", municipio_id: "mun-003", tipo_residuo_id: "res-001", cantidad_kg: 30.2, estado: "en ruta", fecha_generacion: "2026-05-12", fecha_vencimiento: "2026-05-19", institucion: "Puesto de Salud Sandoná", isActive: true },
  
  // Consacá
  { id: "lot-022", municipio_id: "mun-002", tipo_residuo_id: "res-010", cantidad_kg: 85.0, estado: "generado", fecha_generacion: "2026-05-14", fecha_vencimiento: "2026-05-29", institucion: "Centro de Salud Consacá", isActive: true },
  
  // Añadir más lotes para llegar a 50... continuando con la distribución
  { id: "lot-023", municipio_id: "mun-001", tipo_residuo_id: "res-001", cantidad_kg: 165.0, estado: "en ruta", fecha_generacion: "2026-05-13", fecha_vencimiento: "2026-05-20", institucion: "Clínica La Merced", isActive: true },
  { id: "lot-024", municipio_id: "mun-001", tipo_residuo_id: "res-002", cantidad_kg: 52.3, estado: "generado", fecha_generacion: "2026-05-14", fecha_vencimiento: "2026-05-19", institucion: "Hospital de la Policía", isActive: true },
  { id: "lot-025", municipio_id: "mun-011", tipo_residuo_id: "res-001", cantidad_kg: 98.5, estado: "tratado", fecha_generacion: "2026-05-05", fecha_vencimiento: "2026-05-12", institucion: "Clínica San Juan de Ipiales", isActive: true },
  { id: "lot-026", municipio_id: "mun-011", tipo_residuo_id: "res-006", cantidad_kg: 28.0, estado: "generado", fecha_generacion: "2026-05-13", fecha_vencimiento: "2026-05-23", institucion: "Droguería Ipiales", isActive: true },
  { id: "lot-027", municipio_id: "mun-031", tipo_residuo_id: "res-001", cantidad_kg: 145.8, estado: "en ruta", fecha_generacion: "2026-05-12", fecha_vencimiento: "2026-05-19", institucion: "Hospital Divino Niño Tumaco", isActive: true },
  { id: "lot-028", municipio_id: "mun-031", tipo_residuo_id: "res-011", cantidad_kg: 72.4, estado: "generado", fecha_generacion: "2026-05-14", fecha_vencimiento: "2026-05-17", institucion: "ESE Tumaco", isActive: true },
  { id: "lot-029", municipio_id: "mun-041", tipo_residuo_id: "res-001", cantidad_kg: 68.2, estado: "tratado", fecha_generacion: "2026-05-08", fecha_vencimiento: "2026-05-15", institucion: "ESE Putumayo", isActive: true },
  { id: "lot-030", municipio_id: "mun-021", tipo_residuo_id: "res-003", cantidad_kg: 18.5, estado: "generado", fecha_generacion: "2026-05-13", fecha_vencimiento: "2026-05-16", institucion: "Clínica La Unión", isActive: true },
  { id: "lot-031", municipio_id: "mun-001", tipo_residuo_id: "res-015", cantidad_kg: 12.3, estado: "en ruta", fecha_generacion: "2026-05-12", fecha_vencimiento: "2026-05-14", institucion: "Banco de Sangre de Nariño", isActive: true },
  { id: "lot-032", municipio_id: "mun-001", tipo_residuo_id: "res-008", cantidad_kg: 5.8, estado: "tratado", fecha_generacion: "2026-05-10", fecha_vencimiento: "2026-05-11", institucion: "Centro de Medicina Nuclear", isActive: true },
  { id: "lot-033", municipio_id: "mun-012", tipo_residuo_id: "res-001", cantidad_kg: 58.9, estado: "generado", fecha_generacion: "2026-05-13", fecha_vencimiento: "2026-05-20", institucion: "ESE Norte de Nariño", isActive: true },
  { id: "lot-034", municipio_id: "mun-027", tipo_residuo_id: "res-001", cantidad_kg: 22.5, estado: "en ruta", fecha_generacion: "2026-05-11", fecha_vencimiento: "2026-05-18", institucion: "Puesto de Salud Carlosama", isActive: true },
  { id: "lot-035", municipio_id: "mun-036", tipo_residuo_id: "res-010", cantidad_kg: 15.2, estado: "generado", fecha_generacion: "2026-05-12", fecha_vencimiento: "2026-05-27", institucion: "Puesto de Salud La Tola", isActive: true },
  { id: "lot-036", municipio_id: "mun-043", tipo_residuo_id: "res-001", cantidad_kg: 25.8, estado: "tratado", fecha_generacion: "2026-05-06", fecha_vencimiento: "2026-05-13", institucion: "Centro de Salud Colón", isActive: true },
  { id: "lot-037", municipio_id: "mun-001", tipo_residuo_id: "res-001", cantidad_kg: 185.5, estado: "generado", fecha_generacion: "2026-05-14", fecha_vencimiento: "2026-05-21", institucion: "Nueva Clínica Pasto", isActive: true },
  { id: "lot-038", municipio_id: "mun-001", tipo_residuo_id: "res-005", cantidad_kg: 18.2, estado: "en ruta", fecha_generacion: "2026-05-13", fecha_vencimiento: "2026-05-15", institucion: "Instituto Nacional de Cancerología", isActive: true },
  { id: "lot-039", municipio_id: "mun-011", tipo_residuo_id: "res-001", cantidad_kg: 88.6, estado: "en ruta", fecha_generacion: "2026-05-12", fecha_vencimiento: "2026-05-19", institucion: "Hospital Rafael Uribe Uribe", isActive: true },
  { id: "lot-040", municipio_id: "mun-011", tipo_residuo_id: "res-002", cantidad_kg: 32.1, estado: "generado", fecha_generacion: "2026-05-14", fecha_vencimiento: "2026-05-19", institucion: "Centro Quirúrgico Ipiales", isActive: true },
  { id: "lot-041", municipio_id: "mun-031", tipo_residuo_id: "res-001", cantidad_kg: 112.3, estado: "generado", fecha_generacion: "2026-05-13", fecha_vencimiento: "2026-05-20", institucion: "ESE Costero", isActive: true },
  { id: "lot-042", municipio_id: "mun-031", tipo_residuo_id: "res-007", cantidad_kg: 45.6, estado: "tratado", fecha_generacion: "2026-05-04", fecha_vencimiento: "2026-05-18", institucion: "Laboratorio Clínico del Pacífico", isActive: true },
  { id: "lot-043", municipio_id: "mun-041", tipo_residuo_id: "res-011", cantidad_kg: 68.9, estado: "generado", fecha_generacion: "2026-05-14", fecha_vencimiento: "2026-05-17", institucion: "Hospital San Francisco de Asís", isActive: true },
  { id: "lot-044", municipio_id: "mun-021", tipo_residuo_id: "res-001", cantidad_kg: 48.2, estado: "en ruta", fecha_generacion: "2026-05-12", fecha_vencimiento: "2026-05-19", institucion: "Clínica Central La Unión", isActive: true },
  { id: "lot-045", municipio_id: "mun-006", tipo_residuo_id: "res-001", cantidad_kg: 22.5, estado: "generado", fecha_generacion: "2026-05-13", fecha_vencimiento: "2026-05-20", institucion: "Puesto de Salud Nariño", isActive: true },
  { id: "lot-046", municipio_id: "mun-009", tipo_residuo_id: "res-010", cantidad_kg: 12.8, estado: "tratado", fecha_generacion: "2026-05-05", fecha_vencimiento: "2026-05-20", institucion: "Centro de Salud San Bernardo", isActive: true },
  { id: "lot-047", municipio_id: "mun-017", tipo_residuo_id: "res-001", cantidad_kg: 35.6, estado: "generado", fecha_generacion: "2026-05-13", fecha_vencimiento: "2026-05-20", institucion: "Hospital de Pupiales", isActive: true },
  { id: "lot-048", municipio_id: "mun-033", tipo_residuo_id: "res-001", cantidad_kg: 22.3, estado: "en ruta", fecha_generacion: "2026-05-11", fecha_vencimiento: "2026-05-18", institucion: "Puesto de Salud Magüí", isActive: true },
  { id: "lot-049", municipio_id: "mun-045", tipo_residuo_id: "res-001", cantidad_kg: 28.9, estado: "generado", fecha_generacion: "2026-05-14", fecha_vencimiento: "2026-05-21", institucion: "Centro de Salud Sibundoy", isActive: true },
  { id: "lot-050", municipio_id: "mun-001", tipo_residuo_id: "res-001", cantidad_kg: 210.0, estado: "en ruta", fecha_generacion: "2026-05-13", fecha_vencimiento: "2026-05-20", institucion: "Gran Clínica de Pasto", isActive: true },
];
