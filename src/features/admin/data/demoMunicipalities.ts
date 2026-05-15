export interface Municipality {
  id: string;
  nombre: string;
  region: string;
  latitud: number;
  longitud: number;
  instituciones_salud: number;
  generacion_mensual: number;
  isActive: boolean;
}

export const nariñoMunicipalities: Municipality[] = [
  // Sur de Nariño - Pasto y alrededores
  { id: "mun-001", nombre: "Pasto", region: "Sur", latitud: 1.2080, longitud: -77.2780, instituciones_salud: 45, generacion_mensual: 180.5, isActive: true },
  { id: "mun-002", nombre: "Consacá", region: "Sur", latitud: 1.3020, longitud: -77.2350, instituciones_salud: 5, generacion_mensual: 12.3, isActive: true },
  { id: "mun-003", nombre: "Sandoná", region: "Sur", latitud: 1.2940, longitud: -77.3120, instituciones_salud: 8, generacion_mensual: 25.8, isActive: true },
  { id: "mun-004", nombre: "Yacuanquer", region: "Sur", latitud: 1.1850, longitud: -77.3850, instituciones_salud: 4, generacion_mensual: 10.2, isActive: true },
  { id: "mun-005", nombre: "Tangua", region: "Sur", latitud: 1.0980, longitud: -77.3540, instituciones_salud: 6, generacion_mensual: 15.6, isActive: true },
  { id: "mun-006", nombre: "Nariño", region: "Sur", latitud: 1.1620, longitud: -77.1680, instituciones_salud: 7, generacion_mensual: 18.4, isActive: true },
  { id: "mun-007", nombre: "Arboleda", region: "Sur", latitud: 1.3850, longitud: -77.1250, instituciones_salud: 3, generacion_mensual: 8.5, isActive: true },
  { id: "mun-008", nombre: "El Tablón", region: "Sur", latitud: 1.4250, longitud: -77.0980, instituciones_salud: 4, generacion_mensual: 11.2, isActive: true },
  { id: "mun-009", nombre: "San Bernardo", region: "Sur", latitud: 1.4850, longitud: -77.0560, instituciones_salud: 3, generacion_mensual: 9.8, isActive: true },
  { id: "mun-010", nombre: "La Cruz", region: "Sur", latitud: 1.5250, longitud: -77.0230, instituciones_salud: 5, generacion_mensual: 14.3, isActive: true },
  
  // Norte de Nariño - Ipiales, Túquerres
  { id: "mun-011", nombre: "Ipiales", region: "Norte", latitud: 0.8230, longitud: -77.6380, instituciones_salud: 32, generacion_mensual: 145.2, isActive: true },
  { id: "mun-012", nombre: "Túquerres", region: "Norte", latitud: 1.0850, longitud: -77.6230, instituciones_salud: 15, generacion_mensual: 58.7, isActive: true },
  { id: "mun-013", nombre: "Guaitarilla", region: "Norte", latitud: 1.0250, longitud: -77.5850, instituciones_salud: 7, generacion_mensual: 22.4, isActive: true },
  { id: "mun-014", nombre: "Contadero", region: "Norte", latitud: 1.0520, longitud: -77.5560, instituciones_salud: 3, generacion_mensual: 9.6, isActive: true },
  { id: "mun-015", nombre: "Potosí", region: "Norte", latitud: 0.9850, longitud: -77.6120, instituciones_salud: 4, generacion_mensual: 11.8, isActive: true },
  { id: "mun-016", nombre: "Córdoba", region: "Norte", latitud: 0.9120, longitud: -77.5850, instituciones_salud: 5, generacion_mensual: 16.3, isActive: true },
  { id: "mun-017", nombre: "Pupiales", region: "Norte", latitud: 0.7850, longitud: -77.5680, instituciones_salud: 8, generacion_mensual: 28.5, isActive: true },
  { id: "mun-018", nombre: "San Gabriel", region: "Norte", latitud: 0.6850, longitud: -77.5320, instituciones_salud: 6, generacion_mensual: 19.2, isActive: true },
  { id: "mun-019", nombre: "San Pedro de Cartago", region: "Norte", latitud: 0.5850, longitud: -77.5120, instituciones_salud: 5, generacion_mensual: 15.7, isActive: true },
  { id: "mun-020", nombre: "Aldana", region: "Norte", latitud: 0.5120, longitud: -77.4850, instituciones_salud: 4, generacion_mensual: 12.3, isActive: true },
  
  // Centro de Nariño - La Unión, etc.
  { id: "mun-021", nombre: "La Unión", region: "Centro", latitud: 1.5850, longitud: -77.1560, instituciones_salud: 12, generacion_mensual: 45.8, isActive: true },
  { id: "mun-022", nombre: "San José", region: "Centro", latitud: 1.6520, longitud: -77.1850, instituciones_salud: 5, generacion_mensual: 17.3, isActive: true },
  { id: "mun-023", nombre: "El Rosal", region: "Centro", latitud: 1.7250, longitud: -77.2120, instituciones_salud: 3, generacion_mensual: 9.8, isActive: true },
  { id: "mun-024", nombre: "San Pablo", region: "Centro", latitud: 1.5120, longitud: -77.2850, instituciones_salud: 6, generacion_mensual: 21.5, isActive: true },
  { id: "mun-025", nombre: "San Lorenzo", region: "Centro", latitud: 1.4450, longitud: -77.3560, instituciones_salud: 7, generacion_mensual: 24.6, isActive: true },
  { id: "mun-026", nombre: "Cumbal", region: "Centro", latitud: 0.8850, longitud: -77.8850, instituciones_salud: 9, generacion_mensual: 32.1, isActive: true },
  { id: "mun-027", nombre: "Carlosama", region: "Centro", latitud: 0.7120, longitud: -77.8560, instituciones_salud: 5, generacion_mensual: 16.8, isActive: true },
  { id: "mun-028", nombre: "Imués", region: "Centro", latitud: 0.6250, longitud: -77.8230, instituciones_salud: 4, generacion_mensual: 13.5, isActive: true },
  { id: "mun-029", nombre: "Ancuya", region: "Centro", latitud: 0.5520, longitud: -77.7850, instituciones_salud: 4, generacion_mensual: 12.8, isActive: true },
  { id: "mun-030", nombre: "Sapuyes", region: "Centro", latitud: 1.1520, longitud: -77.4850, instituciones_salud: 5, generacion_mensual: 16.2, isActive: true },
  
  // Occidente - Tumaco, Barbacoas
  { id: "mun-031", nombre: "Tumaco", region: "Occidente", latitud: 1.8100, longitud: -78.7600, instituciones_salud: 28, generacion_mensual: 125.4, isActive: true },
  { id: "mun-032", nombre: "Barbacoas", region: "Occidente", latitud: 1.6750, longitud: -78.1050, instituciones_salud: 11, generacion_mensual: 42.3, isActive: true },
  { id: "mun-033", nombre: "Magüí", region: "Occidente", latitud: 1.7850, longitud: -78.3560, instituciones_salud: 5, generacion_mensual: 18.7, isActive: true },
  { id: "mun-034", nombre: "Mosquera", region: "Occidente", latitud: 2.2850, longitud: -78.2850, instituciones_salud: 4, generacion_mensual: 14.5, isActive: true },
  { id: "mun-035", nombre: "El Charco", region: "Occidente", latitud: 2.4850, longitud: -78.1230, instituciones_salud: 6, generacion_mensual: 21.2, isActive: true },
  { id: "mun-036", nombre: "La Tola", region: "Occidente", latitud: 2.6520, longitud: -77.9850, instituciones_salud: 3, generacion_mensual: 10.8, isActive: true },
  { id: "mun-037", nombre: "Olaya Herrera", region: "Occidente", latitud: 2.7850, longitud: -77.8560, instituciones_salud: 4, generacion_mensual: 13.5, isActive: true },
  { id: "mun-038", nombre: "Policarpa", region: "Occidente", latitud: 1.9520, longitud: -77.9230, instituciones_salud: 5, generacion_mensual: 17.6, isActive: true },
  { id: "mun-039", nombre: "Roberto Payán", region: "Occidente", latitud: 2.0850, longitud: -78.0560, instituciones_salud: 4, generacion_mensual: 14.2, isActive: true },
  { id: "mun-040", nombre: "Santa Bárbara", region: "Occidente", latitud: 2.1520, longitud: -78.1850, instituciones_salud: 5, generacion_mensual: 16.8, isActive: true },
  
  // Oriente - Mocoa, Villagarzón (ubicados en el oriente del departamento)
  { id: "mun-041", nombre: "Mocoa", region: "Oriente", latitud: 1.1550, longitud: -76.6480, instituciones_salud: 18, generacion_mensual: 68.5, isActive: true },
  { id: "mun-042", nombre: "Villagarzón", region: "Oriente", latitud: 0.9850, longitud: -76.5850, instituciones_salud: 9, generacion_mensual: 35.2, isActive: true },
  { id: "mun-043", nombre: "Colón", region: "Oriente", latitud: 1.3520, longitud: -76.5560, instituciones_salud: 5, generacion_mensual: 18.9, isActive: true },
  { id: "mun-044", nombre: "San Francisco", region: "Oriente", latitud: 1.4850, longitud: -76.5120, instituciones_salud: 4, generacion_mensual: 14.6, isActive: true },
  { id: "mun-045", nombre: "Sibundoy", region: "Oriente", latitud: 1.2250, longitud: -76.6850, instituciones_salud: 6, generacion_mensual: 22.3, isActive: true },
  { id: "mun-046", nombre: "San Miguel", region: "Oriente", latitud: 0.8520, longitud: -76.5230, instituciones_salud: 5, generacion_mensual: 17.8, isActive: true },
  { id: "mun-047", nombre: "Ospina", region: "Oriente", latitud: 1.0520, longitud: -77.0560, instituciones_salud: 4, generacion_mensual: 13.5, isActive: true },
  { id: "mun-048", nombre: "Gualmatán", region: "Oriente", latitud: 0.9250, longitud: -77.0850, instituciones_salud: 3, generacion_mensual: 10.4, isActive: true },
  { id: "mun-049", nombre: "Pasto", region: "Oriente", latitud: 1.1250, longitud: -76.8560, instituciones_salud: 5, generacion_mensual: 16.7, isActive: true },
  { id: "mun-050", nombre: "El Pepino", region: "Oriente", latitud: 0.7520, longitud: -76.4560, instituciones_salud: 3, generacion_mensual: 9.5, isActive: true },
  
  // Municipios adicionales para completar 64
  { id: "mun-051", nombre: "Buesaco", region: "Sur", latitud: 1.3120, longitud: -77.4560, instituciones_salud: 6, generacion_mensual: 19.3, isActive: true },
  { id: "mun-052", nombre: "Chachagüí", region: "Centro", latitud: 1.2850, longitud: -77.5120, instituciones_salud: 5, generacion_mensual: 16.8, isActive: true },
  { id: "mun-053", nombre: "Consacá", region: "Sur", latitud: 1.3020, longitud: -77.2350, instituciones_salud: 5, generacion_mensual: 15.2, isActive: true },
  { id: "mun-054", nombre: "El Contento", region: "Occidente", latitud: 2.8520, longitud: -77.7560, instituciones_salud: 3, generacion_mensual: 9.8, isActive: true },
  { id: "mun-055", nombre: "Funes", region: "Centro", latitud: 0.4520, longitud: -77.4560, instituciones_salud: 4, generacion_mensual: 12.5, isActive: true },
  { id: "mun-056", nombre: "Guachucal", region: "Norte", latitud: 0.5120, longitud: -77.9120, instituciones_salud: 5, generacion_mensual: 16.3, isActive: true },
  { id: "mun-057", nombre: "Génova", region: "Centro", latitud: 1.8520, longitud: -77.4560, instituciones_salud: 4, generacion_mensual: 13.7, isActive: true },
  { id: "mun-058", nombre: "Iles", region: "Centro", latitud: 1.1520, longitud: -77.5560, instituciones_salud: 4, generacion_mensual: 12.8, isActive: true },
  { id: "mun-059", nombre: "La Llanada", region: "Sur", latitud: 0.9850, longitud: -77.4560, instituciones_salud: 3, generacion_mensual: 9.5, isActive: true },
  { id: "mun-060", nombre: "Leiva", region: "Centro", latitud: 1.7850, longitud: -77.3560, instituciones_salud: 5, generacion_mensual: 17.2, isActive: true },
  { id: "mun-061", nombre: "Los Andes", region: "Occidente", latitud: 1.5520, longitud: -78.0560, instituciones_salud: 4, generacion_mensual: 14.3, isActive: true },
  { id: "mun-062", nombre: "Mallama", region: "Norte", latitud: 0.4120, longitud: -77.8560, instituciones_salud: 3, generacion_mensual: 10.6, isActive: true },
  { id: "mun-063", nombre: "Pizares", region: "Occidente", latitud: 2.3520, longitud: -78.3560, instituciones_salud: 3, generacion_mensual: 9.9, isActive: true },
  { id: "mun-064", nombre: "Ricaurte", region: "Norte", latitud: 0.5520, longitud: -77.5560, instituciones_salud: 4, generacion_mensual: 13.4, isActive: true },
];
