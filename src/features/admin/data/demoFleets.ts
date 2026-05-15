export interface Fleet {
  id: string;
  placa: string;
  marca: string;
  capacidad_toneladas: number;
  conductor: string;
  estado: string;
  ultima_mantenimiento: string;
  isActive: boolean;
}

export const nariñoFleets: Fleet[] = [
  { id: "fleet-001", placa: "NAR-001", marca: "Volvo FH", capacidad_toneladas: 30, conductor: "Carlos Alberto Rodríguez", estado: "activo", ultima_mantenimiento: "2026-04-15", isActive: true },
  { id: "fleet-002", placa: "NAR-002", marca: "Mercedes-Benz Actros", capacidad_toneladas: 28, conductor: "José María López", estado: "activo", ultima_mantenimiento: "2026-04-20", isActive: true },
  { id: "fleet-003", placa: "NAR-003", marca: "Scania R450", capacidad_toneladas: 25, conductor: "Roberto Carlos Mendoza", estado: "activo", ultima_mantenimiento: "2026-04-10", isActive: true },
  { id: "fleet-004", placa: "NAR-004", marca: "Iveco Stralis", capacidad_toneladas: 22, conductor: "Fernando Andrés Perea", estado: "activo", ultima_mantenimiento: "2026-04-18", isActive: true },
  { id: "fleet-005", placa: "NAR-005", marca: "MAN TGX", capacidad_toneladas: 30, conductor: "Miguel Ángel Torres", estado: "activo", ultima_mantenimiento: "2026-04-22", isActive: true },
  { id: "fleet-006", placa: "NAR-006", marca: "DAF XF", capacidad_toneladas: 26, conductor: "Andrés Felipe Sánchez", estado: "activo", ultima_mantenimiento: "2026-04-08", isActive: true },
  { id: "fleet-007", placa: "NAR-007", marca: "Renault T", capacidad_toneladas: 20, conductor: "Juan Sebastián Gómez", estado: "activo", ultima_mantenimiento: "2026-04-25", isActive: true },
  { id: "fleet-008", placa: "NAR-008", marca: "Freightliner Cascadia", capacidad_toneladas: 32, conductor: "David Santiago Ruiz", estado: "activo", ultima_mantenimiento: "2026-04-12", isActive: true },
  { id: "fleet-009", placa: "NAR-009", marca: "Peterbilt 579", capacidad_toneladas: 35, conductor: "En mantenimiento", estado: "mantenimiento", ultima_mantenimiento: "2026-05-01", isActive: true },
  { id: "fleet-010", placa: "NAR-010", marca: "Kenworth T680", capacidad_toneladas: 33, conductor: "En mantenimiento", estado: "mantenimiento", ultima_mantenimiento: "2026-05-05", isActive: true },
];
