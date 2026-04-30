const BASE_URL: string =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
 
// ══════════════════════════════════════════════════════════════════════
//  Tipos
// ══════════════════════════════════════════════════════════════════════
 
interface RequestOptions extends Omit<RequestInit, 'body'> {
  token?: string;|
  body?: Record<string, any> | unknown[];
}
 
export class ApiError extends Error {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name   = 'ApiError';
    this.status = status;
    this.data   = data;
  }
}
 
// ══════════════════════════════════════════════════════════════════════
//  Cliente HTTP base
// ══════════════════════════════════════════════════════════════════════
 
async function request<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, body, headers: extra, ...rest } = options;
 
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extra ?? {}),
  };
 
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
 
  if (response.status === 204) return null as T;
 
  const data = await response.json().catch(() => null);
 
  if (!response.ok) {
    throw new ApiError(
      (data as { message?: string })?.message ?? `HTTP ${response.status}`,
      response.status,
      data
    );
  }
 
  return data as T;
}
 
type Body = RequestOptions['body'];
const get    = <T>(url: string, opts?: RequestOptions)            => request<T>(url, { method: 'GET',    ...opts });
const post   = <T>(url: string, body?: Body, opts?: RequestOptions) => request<T>(url, { method: 'POST',   body, ...opts });
const put    = <T>(url: string, body?: Body, opts?: RequestOptions) => request<T>(url, { method: 'PUT',    body, ...opts });
const patch  = <T>(url: string, body?: Body, opts?: RequestOptions) => request<T>(url, { method: 'PATCH',  body, ...opts });
const del    = <T>(url: string, opts?: RequestOptions)            => request<T>(url, { method: 'DELETE', ...opts });
 
// ══════════════════════════════════════════════════════════════════════
//  API — mapeada 1:1 a los controllers Spring Boot
// ══════════════════════════════════════════════════════════════════════
 
const api = {
 
  // ── WasteController ───────────────────────────────────────────
  residuos: {
    getAll:     (o?: RequestOptions)              => get('/api/waste', o),
    getById:    (id: number, o?: RequestOptions)  => get(`/api/waste/${id}`, o),
    crear:      (data: Body, o?: RequestOptions)  => post('/api/waste', data, o),
    actualizar: (id: number, data: Body, o?: RequestOptions) => put(`/api/waste/${id}`, data, o),
    eliminar:   (id: number, o?: RequestOptions)  => del(`/api/waste/${id}`, o),
  },
 
  // ── RouteController ───────────────────────────────────────────
  rutasOp: {
    getAll:        (o?: RequestOptions)             => get('/api/routes', o),
    getById:       (id: number, o?: RequestOptions) => get(`/api/routes/${id}`, o),
    getParadas:    (id: number, o?: RequestOptions) => get(`/api/routes/${id}/stops`, o),
    getOptimizada: (id: number, o?: RequestOptions) => get(`/api/routes/${id}/optimized`, o),
    crear:         (data: Body, o?: RequestOptions) => post('/api/routes', data, o),
    actualizar:    (id: number, data: Body, o?: RequestOptions) => put(`/api/routes/${id}`, data, o),
    eliminar:      (id: number, o?: RequestOptions) => del(`/api/routes/${id}`, o),
  },
 
  // ── AlertController ───────────────────────────────────────────
  alertas: {
    getActivas:  (o?: RequestOptions)                      => get('/api/alerts', o),
    getById:     (id: number, o?: RequestOptions)          => get(`/api/alerts/${id}`, o),
    getByNivel:  (nivel: string, o?: RequestOptions)       => get(`/api/alerts?level=${nivel}`, o),
    marcarLeida: (id: number, o?: RequestOptions)          => patch(`/api/alerts/${id}/read`, undefined, o),
    crear:       (data: Body, o?: RequestOptions)          => post('/api/alerts', data, o),
    eliminar:    (id: number, o?: RequestOptions)          => del(`/api/alerts/${id}`, o),
  },
 
  // ── StatisticsController ─────────────────────────────────────
  estadisticas: {
    kpis:              (o?: RequestOptions)                          => get('/api/statistics', o),
    distribucion:      (o?: RequestOptions)                          => get('/api/statistics/distribution', o),
    tendencia:         (meses: number = 12, o?: RequestOptions)      => get(`/api/statistics/trend?months=${meses}`, o),
    porMunicipio:      (o?: RequestOptions)                          => get('/api/statistics/by-municipality', o),
    rendimientoRutas:  (o?: RequestOptions)                          => get('/api/statistics/routes-performance', o),
    topGeneradores:    (o?: RequestOptions)                          => get('/api/statistics/top-generators', o),
    costos:            (anio: number, mes: number, o?: RequestOptions) =>
                       get(`/api/statistics/costs?year=${anio}&month=${mes}`, o),
  },
 
  // ── ChatController ────────────────────────────────────────────
  chat: {
    enviarMensaje:    (data: Body, o?: RequestOptions) => post('/api/chat', data, o),
    getHistorial:     (o?: RequestOptions)             => get('/api/chat/history', o),
    limpiarHistorial: (o?: RequestOptions)             => del('/api/chat/history', o),
  },
 
  // ══════════════════════════════════════════════════════════════
  //  MÓDULO ADMIN  /api/admin/...
  // ══════════════════════════════════════════════════════════════
  admin: {
 
    // ── CatalogoTipoResiduoAdminController ──────────────────────
    tiposResiduo: {
      getAll:     (o?: RequestOptions)                              => get('/api/admin/catalogo-tipo-residuo', o),
      getById:    (id: number, o?: RequestOptions)                  => get(`/api/admin/catalogo-tipo-residuo/${id}`, o),
      crear:      (data: Body, o?: RequestOptions)                  => post('/api/admin/catalogo-tipo-residuo', data, o),
      actualizar: (id: number, data: Body, o?: RequestOptions)      => put(`/api/admin/catalogo-tipo-residuo/${id}`, data, o),
      eliminar:   (id: number, o?: RequestOptions)                  => del(`/api/admin/catalogo-tipo-residuo/${id}`, o),
    },
 
    // ── CatalogoMetodoTratAdminController ────────────────────────
    metodosTratamiento: {
      getAll:     (o?: RequestOptions)                              => get('/api/admin/catalogo-metodo-tratamiento', o),
      getById:    (id: number, o?: RequestOptions)                  => get(`/api/admin/catalogo-metodo-tratamiento/${id}`, o),
      crear:      (data: Body, o?: RequestOptions)                  => post('/api/admin/catalogo-metodo-tratamiento', data, o),
      actualizar: (id: number, data: Body, o?: RequestOptions)      => put(`/api/admin/catalogo-metodo-tratamiento/${id}`, data, o),
      eliminar:   (id: number, o?: RequestOptions)                  => del(`/api/admin/catalogo-metodo-tratamiento/${id}`, o),
    },
 
    // ── CatalogoTipoInstalacionesAdminController ─────────────────
    tiposInstalacion: {
      getAll:     (o?: RequestOptions)                              => get('/api/admin/catalogo-tipo-instalacion', o),
      getById:    (id: number, o?: RequestOptions)                  => get(`/api/admin/catalogo-tipo-instalacion/${id}`, o),
      crear:      (data: Body, o?: RequestOptions)                  => post('/api/admin/catalogo-tipo-instalacion', data, o),
      actualizar: (id: number, data: Body, o?: RequestOptions)      => put(`/api/admin/catalogo-tipo-instalacion/${id}`, data, o),
      eliminar:   (id: number, o?: RequestOptions)                  => del(`/api/admin/catalogo-tipo-instalacion/${id}`, o),
    },
 
    // ── DepartamentosAdminController ─────────────────────────────
    departamentos: {
      getAll:     (o?: RequestOptions)                              => get('/api/admin/departamentos', o),
      getById:    (id: number, o?: RequestOptions)                  => get(`/api/admin/departamentos/${id}`, o),
      crear:      (data: Body, o?: RequestOptions)                  => post('/api/admin/departamentos', data, o),
      actualizar: (id: number, data: Body, o?: RequestOptions)      => put(`/api/admin/departamentos/${id}`, data, o),
      eliminar:   (id: number, o?: RequestOptions)                  => del(`/api/admin/departamentos/${id}`, o),
    },
 
    // ── MunicipiosAdminController ────────────────────────────────
    municipios: {
      getAll:            (o?: RequestOptions)                       => get('/api/admin/municipios', o),
      getById:           (id: number, o?: RequestOptions)           => get(`/api/admin/municipios/${id}`, o),
      getByDepartamento: (depId: number, o?: RequestOptions)        => get(`/api/admin/municipios?departamento=${depId}`, o),
      getGeoData:        (o?: RequestOptions)                       => get('/api/admin/municipios/geo', o),
      crear:             (data: Body, o?: RequestOptions)           => post('/api/admin/municipios', data, o),
      actualizar:        (id: number, data: Body, o?: RequestOptions) => put(`/api/admin/municipios/${id}`, data, o),
      eliminar:          (id: number, o?: RequestOptions)           => del(`/api/admin/municipios/${id}`, o),
    },
 
    // ── ClientesInstalacionesAdminController ─────────────────────
    clientes: {
      getAll:                (o?: RequestOptions)                          => get('/api/admin/clientes-instalaciones', o),
      getById:               (id: number, o?: RequestOptions)              => get(`/api/admin/clientes-instalaciones/${id}`, o),
      getByMunicipio:        (mId: number, o?: RequestOptions)             => get(`/api/admin/clientes-instalaciones?municipio=${mId}`, o),
      buscar:                (q: string, o?: RequestOptions)               => get(`/api/admin/clientes-instalaciones/search?q=${encodeURIComponent(q)}`, o),
      getContratosPorVencer: (dias = 30, o?: RequestOptions)               => get(`/api/admin/clientes-instalaciones/contratos-por-vencer?dias=${dias}`, o),
      crear:                 (data: Body, o?: RequestOptions)              => post('/api/admin/clientes-instalaciones', data, o),
      actualizar:            (id: number, data: Body, o?: RequestOptions)  => put(`/api/admin/clientes-instalaciones/${id}`, data, o),
      desactivar:            (id: number, o?: RequestOptions)              => patch(`/api/admin/clientes-instalaciones/${id}/desactivar`, undefined, o),
      eliminar:              (id: number, o?: RequestOptions)              => del(`/api/admin/clientes-instalaciones/${id}`, o),
    },
 
    // ── PersonalAdminController ──────────────────────────────────
    personal: {
      getAll:                 (o?: RequestOptions)                         => get('/api/admin/personal', o),
      getById:                (id: number, o?: RequestOptions)             => get(`/api/admin/personal/${id}`, o),
      getConductores:         (o?: RequestOptions)                         => get('/api/admin/personal/conductores', o),
      alertasCertificaciones: (dias = 30, o?: RequestOptions)              => get(`/api/admin/personal/alertas-certificaciones?dias=${dias}`, o),
      crear:                  (data: Body, o?: RequestOptions)             => post('/api/admin/personal', data, o),
      actualizar:             (id: number, data: Body, o?: RequestOptions) => put(`/api/admin/personal/${id}`, data, o),
      desactivar:             (id: number, o?: RequestOptions)             => patch(`/api/admin/personal/${id}/desactivar`, undefined, o),
      eliminar:               (id: number, o?: RequestOptions)             => del(`/api/admin/personal/${id}`, o),
    },
 
    // ── EppEntregasAdminController ───────────────────────────────
    epp: {
      getAll:           (o?: RequestOptions)                              => get('/api/admin/epp-entregas', o),
      getByEmpleado:    (empId: number, o?: RequestOptions)               => get(`/api/admin/epp-entregas?empleado=${empId}`, o),
      registrarEntrega: (data: Body, o?: RequestOptions)                  => post('/api/admin/epp-entregas', data, o),
      actualizar:       (id: number, data: Body, o?: RequestOptions)      => put(`/api/admin/epp-entregas/${id}`, data, o),
      eliminar:         (id: number, o?: RequestOptions)                  => del(`/api/admin/epp-entregas/${id}`, o),
    },
 
    // ── FlotaTransporteAdminController ───────────────────────────
    flota: {
      getAll:               (o?: RequestOptions)                          => get('/api/admin/flota-transporte', o),
      getById:              (id: number, o?: RequestOptions)              => get(`/api/admin/flota-transporte/${id}`, o),
      getActivos:           (o?: RequestOptions)                          => get('/api/admin/flota-transporte?estado=Activo', o),
      getConRefrigeracion:  (o?: RequestOptions)                          => get('/api/admin/flota-transporte/con-refrigeracion', o),
      getAlertasDocumentos: (o?: RequestOptions)                          => get('/api/admin/flota-transporte/alertas-documentos', o),
      registrar:            (data: Body, o?: RequestOptions)              => post('/api/admin/flota-transporte', data, o),
      actualizar:           (id: number, data: Body, o?: RequestOptions)  => put(`/api/admin/flota-transporte/${id}`, data, o),
      cambiarEstado:        (id: number, estado: string, o?: RequestOptions) =>
                            patch(`/api/admin/flota-transporte/${id}/estado`, { estado }, o),
      eliminar:             (id: number, o?: RequestOptions)              => del(`/api/admin/flota-transporte/${id}`, o),
    },
 
    // ── OrdenesRecoleccionAdminController ────────────────────────
    ordenes: {
      getAll:             (o?: RequestOptions)                                          => get('/api/admin/ordenes-recoleccion', o),
      getById:            (id: number, o?: RequestOptions)                             => get(`/api/admin/ordenes-recoleccion/${id}`, o),
      getPendientes:      (o?: RequestOptions)                                          => get('/api/admin/ordenes-recoleccion/pendientes', o),
      getByCliente:       (cliId: number, meses = 3, o?: RequestOptions)               => get(`/api/admin/ordenes-recoleccion?cliente=${cliId}&meses=${meses}`, o),
      getPorFechaYEstado: (desde: string, hasta: string, estado?: string, o?: RequestOptions) =>
                          get(`/api/admin/ordenes-recoleccion?desde=${desde}&hasta=${hasta}${estado ? `&estado=${estado}` : ''}`, o),
      getDetalle:         (id: number, o?: RequestOptions)                             => get(`/api/admin/ordenes-recoleccion/${id}/detalle`, o),
      crear:              (data: Body, o?: RequestOptions)                             => post('/api/admin/ordenes-recoleccion', data, o),
      agregarDetalle:     (id: number, data: Body, o?: RequestOptions)                 => post(`/api/admin/ordenes-recoleccion/${id}/detalle`, data, o),
      actualizarEstado:   (id: number, data: Body, o?: RequestOptions)                 => patch(`/api/admin/ordenes-recoleccion/${id}/estado`, data, o),
      eliminar:           (id: number, o?: RequestOptions)                             => del(`/api/admin/ordenes-recoleccion/${id}`, o),
    },
 
    // ── OrdenesLotesAdminController ──────────────────────────────
    ordenesLotes: {
      getAll:     (o?: RequestOptions)                                       => get('/api/admin/ordenes-lotes', o),
      getByOrden: (ordId: number, o?: RequestOptions)                        => get(`/api/admin/ordenes-lotes?orden=${ordId}`, o),
      getByLote:  (loteId: number, o?: RequestOptions)                       => get(`/api/admin/ordenes-lotes?lote=${loteId}`, o),
      vincular:   (data: Body, o?: RequestOptions)                           => post('/api/admin/ordenes-lotes', data, o),
      eliminar:   (ordId: number, loteId: number, o?: RequestOptions)        => del(`/api/admin/ordenes-lotes/${ordId}/${loteId}`, o),
    },
 
    // ── EjecucionesRutaAdminController ───────────────────────────
    ejecucionesRuta: {
      getAll:          (o?: RequestOptions)                                                  => get('/api/admin/ejecuciones-ruta', o),
      getById:         (id: number, o?: RequestOptions)                                     => get(`/api/admin/ejecuciones-ruta/${id}`, o),
      getRecientes:    (limit = 20, o?: RequestOptions)                                     => get(`/api/admin/ejecuciones-ruta?limit=${limit}`, o),
      getByRutaYFecha: (rutaId: number, desde: string, hasta: string, o?: RequestOptions)   =>
                       get(`/api/admin/ejecuciones-ruta?ruta=${rutaId}&desde=${desde}&hasta=${hasta}`, o),
      registrar:       (data: Body, o?: RequestOptions)                                     => post('/api/admin/ejecuciones-ruta', data, o),
      actualizar:      (id: number, data: Body, o?: RequestOptions)                         => put(`/api/admin/ejecuciones-ruta/${id}`, data, o),
      eliminar:        (id: number, o?: RequestOptions)                                     => del(`/api/admin/ejecuciones-ruta/${id}`, o),
    },
 
    // ── PlantasTratamientoAdminController ────────────────────────
    plantas: {
      getAll:     (o?: RequestOptions)                              => get('/api/admin/plantas-tratamiento', o),
      getById:    (id: number, o?: RequestOptions)                  => get(`/api/admin/plantas-tratamiento/${id}`, o),
      getActivas: (o?: RequestOptions)                              => get('/api/admin/plantas-tratamiento?activa=true', o),
      crear:      (data: Body, o?: RequestOptions)                  => post('/api/admin/plantas-tratamiento', data, o),
      actualizar: (id: number, data: Body, o?: RequestOptions)      => put(`/api/admin/plantas-tratamiento/${id}`, data, o),
      eliminar:   (id: number, o?: RequestOptions)                  => del(`/api/admin/plantas-tratamiento/${id}`, o),
    },
 
    // ── LotesTratamientoAdminController ──────────────────────────
    lotes: {
      getAll:           (o?: RequestOptions)                              => get('/api/admin/lotes-tratamiento', o),
      getById:          (id: number, o?: RequestOptions)                  => get(`/api/admin/lotes-tratamiento/${id}`, o),
      getPorPeriodo:    (desde: string, hasta: string, o?: RequestOptions) =>
                        get(`/api/admin/lotes-tratamiento?desde=${desde}&hasta=${hasta}`, o),
      getCostosPorLote: (limit = 20, o?: RequestOptions)                  => get(`/api/admin/lotes-tratamiento/costos?limit=${limit}`, o),
      crear:            (data: Body, o?: RequestOptions)                  => post('/api/admin/lotes-tratamiento', data, o),
      cerrar:           (id: number, data: Body, o?: RequestOptions)      => patch(`/api/admin/lotes-tratamiento/${id}/cerrar`, data, o),
      actualizar:       (id: number, data: Body, o?: RequestOptions)      => put(`/api/admin/lotes-tratamiento/${id}`, data, o),
      eliminar:         (id: number, o?: RequestOptions)                  => del(`/api/admin/lotes-tratamiento/${id}`, o),
    },
 
    // ── DisposicionFinalAdminController ──────────────────────────
    disposicionFinal: {
      getAll:       (o?: RequestOptions)                              => get('/api/admin/disposicion-final', o),
      getById:      (id: number, o?: RequestOptions)                  => get(`/api/admin/disposicion-final/${id}`, o),
      getHistorial: (limit = 20, o?: RequestOptions)                  => get(`/api/admin/disposicion-final?limit=${limit}`, o),
      registrar:    (data: Body, o?: RequestOptions)                  => post('/api/admin/disposicion-final', data, o),
      actualizar:   (id: number, data: Body, o?: RequestOptions)      => put(`/api/admin/disposicion-final/${id}`, data, o),
      eliminar:     (id: number, o?: RequestOptions)                  => del(`/api/admin/disposicion-final/${id}`, o),
    },
 
    // ── ManifiestosTransporteAdminController ─────────────────────
    manifiestos: {
      getAll:         (o?: RequestOptions)                                                  => get('/api/admin/manifiestos-transporte', o),
      getById:        (id: number, o?: RequestOptions)                                     => get(`/api/admin/manifiestos-transporte/${id}`, o),
      getIncompletos: (o?: RequestOptions)                                                  => get('/api/admin/manifiestos-transporte/incompletos', o),
      getByCliente:   (cliId: number, d: string, h: string, o?: RequestOptions)            =>
                      get(`/api/admin/manifiestos-transporte?cliente=${cliId}&desde=${d}&hasta=${h}`, o),
      crear:          (data: Body, o?: RequestOptions)                                     => post('/api/admin/manifiestos-transporte', data, o),
      firmar:         (id: number, parte: 'generador' | 'transportador' | 'receptor', o?: RequestOptions) =>
                      patch(`/api/admin/manifiestos-transporte/${id}/firmar`, { parte }, o),
      eliminar:       (id: number, o?: RequestOptions)                                     => del(`/api/admin/manifiestos-transporte/${id}`, o),
    },
 
    // ── AuditoriasAdminController ────────────────────────────────
    auditorias: {
      getAll:        (o?: RequestOptions)                              => get('/api/admin/auditorias', o),
      getById:       (id: number, o?: RequestOptions)                  => get(`/api/admin/auditorias/${id}`, o),
      getRiesgoAlto: (o?: RequestOptions)                              => get('/api/admin/auditorias/riesgo-alto', o),
      registrar:     (data: Body, o?: RequestOptions)                  => post('/api/admin/auditorias', data, o),
      cerrar:        (id: number, o?: RequestOptions)                  => patch(`/api/admin/auditorias/${id}/cerrar`, undefined, o),
      actualizar:    (id: number, data: Body, o?: RequestOptions)      => put(`/api/admin/auditorias/${id}`, data, o),
      eliminar:      (id: number, o?: RequestOptions)                  => del(`/api/admin/auditorias/${id}`, o),
    },
 
    // ── CapexActivosAdminController ──────────────────────────────
    capex: {
      getAll:                (o?: RequestOptions)                              => get('/api/admin/capex-activos', o),
      getById:               (id: number, o?: RequestOptions)                  => get(`/api/admin/capex-activos/${id}`, o),
      getDepreciacionMensual:(o?: RequestOptions)                              => get('/api/admin/capex-activos/depreciacion', o),
      registrar:             (data: Body, o?: RequestOptions)                  => post('/api/admin/capex-activos', data, o),
      actualizar:            (id: number, data: Body, o?: RequestOptions)      => put(`/api/admin/capex-activos/${id}`, data, o),
      eliminar:              (id: number, o?: RequestOptions)                  => del(`/api/admin/capex-activos/${id}`, o),
    },
 
    // ── Facturas ──────────────────────────────────────────────────
    facturas: {
      getAll:            (o?: RequestOptions)                                    => get('/api/admin/facturas', o),
      getById:           (id: number, o?: RequestOptions)                        => get(`/api/admin/facturas/${id}`, o),
      getByCliente:      (cliId: number, o?: RequestOptions)                     => get(`/api/admin/facturas?cliente=${cliId}`, o),
      getPendientes:     (o?: RequestOptions)                                    => get('/api/admin/facturas/pendientes', o),
      getResumenMensual: (o?: RequestOptions)                                    => get('/api/admin/facturas/resumen-mensual', o),
      crear:             (data: Body, o?: RequestOptions)                        => post('/api/admin/facturas', data, o),
      actualizarEstado:  (num: string, estado: string, o?: RequestOptions)       =>
                         patch(`/api/admin/facturas/${num}/estado`, { estado }, o),
      eliminar:          (id: number, o?: RequestOptions)                        => del(`/api/admin/facturas/${id}`, o),
    },
 
    // ── Tarifas de Mercado ───────────────────────────────────────
    tarifas: {
      getActual:  (o?: RequestOptions)                              => get('/api/admin/tarifas-mercado/actual', o),
      getAll:     (o?: RequestOptions)                              => get('/api/admin/tarifas-mercado', o),
      insertar:   (data: Body, o?: RequestOptions)                  => post('/api/admin/tarifas-mercado', data, o),
      actualizar: (id: number, data: Body, o?: RequestOptions)      => put(`/api/admin/tarifas-mercado/${id}`, data, o),
    },
 
    // ── HistoricoGeneracionAdminController (módulo IA) ───────────
    historicoGeneracion: {
      getAll:              (o?: RequestOptions)                                   => get('/api/admin/historico-generacion', o),
      getGeneracionMensual:(filtros: Record<string, string> = {}, o?: RequestOptions) => {
        const p = new URLSearchParams(filtros).toString();
        return get(`/api/admin/historico-generacion/mensual${p ? '?' + p : ''}`, o);
      },
      getSerieCliente:     (cliId: number, tipId: number, o?: RequestOptions)     =>
                           get(`/api/admin/historico-generacion/serie?cliente=${cliId}&tipo=${tipId}`, o),
      getByMunicipio:      (desde: string, hasta: string, o?: RequestOptions)     =>
                           get(`/api/admin/historico-generacion/municipio?desde=${desde}&hasta=${hasta}`, o),
      getTendencia:        (o?: RequestOptions)                                   => get('/api/admin/historico-generacion/tendencia', o),
      getEstacionalidad:   (o?: RequestOptions)                                   => get('/api/admin/historico-generacion/estacionalidad', o),
      getAnomalias:        (o?: RequestOptions)                                   => get('/api/admin/historico-generacion/anomalias', o),
      registrar:           (data: Body, o?: RequestOptions)                       => post('/api/admin/historico-generacion', data, o),
      eliminar:            (id: number, o?: RequestOptions)                       => del(`/api/admin/historico-generacion/${id}`, o),
    },
 
    // ── PrediccionesGeneracionAdminController (módulo IA) ────────
    predicciones: {
      getAll:              (o?: RequestOptions)                              => get('/api/admin/predicciones-generacion', o),
      getByCliente:        (cliId: number, o?: RequestOptions)               => get(`/api/admin/predicciones-generacion?cliente=${cliId}`, o),
      getVigentes:         (cliId: number, o?: RequestOptions)               => get(`/api/admin/predicciones-generacion/vigentes?cliente=${cliId}`, o),
      getEvaluacionModelo: (o?: RequestOptions)                              => get('/api/admin/predicciones-generacion/evaluacion', o),
      insertar:            (data: Body, o?: RequestOptions)                  => post('/api/admin/predicciones-generacion', data, o),
      actualizarPesoReal:  (id: number, data: Body, o?: RequestOptions)      =>
                           patch(`/api/admin/predicciones-generacion/${id}/peso-real`, data, o),
      eliminar:            (id: number, o?: RequestOptions)                  => del(`/api/admin/predicciones-generacion/${id}`, o),
    },
 
    // ── ClustersGeneradoresAdminController (módulo IA) ───────────
    clusters: {
      getAll:     (o?: RequestOptions)                              => get('/api/admin/clusters-generadores', o),
      getById:    (id: number, o?: RequestOptions)                  => get(`/api/admin/clusters-generadores/${id}`, o),
      crear:      (data: Body, o?: RequestOptions)                  => post('/api/admin/clusters-generadores', data, o),
      actualizar: (id: number, data: Body, o?: RequestOptions)      => put(`/api/admin/clusters-generadores/${id}`, data, o),
      eliminar:   (id: number, o?: RequestOptions)                  => del(`/api/admin/clusters-generadores/${id}`, o),
    },
 
    // ── ClustersClientesAdminController (módulo IA) ──────────────
    clustersClientes: {
      getAll:        (o?: RequestOptions)                                        => get('/api/admin/clusters-clientes', o),
      getByCluster:  (clusterId: number, o?: RequestOptions)                     => get(`/api/admin/clusters-clientes?cluster=${clusterId}`, o),
      getPorCluster: (o?: RequestOptions)                                        => get('/api/admin/clusters-clientes/por-cluster', o),
      asignar:       (data: Body, o?: RequestOptions)                            => post('/api/admin/clusters-clientes', data, o),
      eliminar:      (clusId: number, cliId: number, o?: RequestOptions)         => del(`/api/admin/clusters-clientes/${clusId}/${cliId}`, o),
    },
 
  }, // fin admin
 
  // ══════════════════════════════════════════════════════════════
  //  DASHBOARD — carga agregada en paralelo
  // ══════════════════════════════════════════════════════════════
  dashboard: {
    kpis:                (o?: RequestOptions) => get('/api/statistics', o),
    distribucionResiduos:(o?: RequestOptions) => get('/api/statistics/distribution', o),
    tendencia:           (o?: RequestOptions) => get('/api/admin/historico-generacion/tendencia', o),
    mapaCalor:           (o?: RequestOptions) => get('/api/statistics/by-municipality', o),
    alertasActivas:      (o?: RequestOptions) => get('/api/alerts', o),
    topGeneradores:      (o?: RequestOptions) => get('/api/statistics/top-generators', o),
    anomalias:           (o?: RequestOptions) => get('/api/admin/historico-generacion/anomalias', o),
 
    async cargarTodo(o?: RequestOptions) {
      const [kpis, distribucion, alertas, tendencia, mapaCalor, anomalias] =
        await Promise.allSettled([
          api.dashboard.kpis(o),
          api.dashboard.distribucionResiduos(o),
          api.dashboard.alertasActivas(o),
          api.dashboard.tendencia(o),
          api.dashboard.mapaCalor(o),
          api.dashboard.anomalias(o),
        ]);
      return {
        kpis:         kpis.status         === 'fulfilled' ? kpis.value         : null,
        distribucion: distribucion.status  === 'fulfilled' ? distribucion.value  : null,
        alertas:      alertas.status       === 'fulfilled' ? alertas.value       : null,
        tendencia:    tendencia.status     === 'fulfilled' ? tendencia.value     : null,
        mapaCalor:    mapaCalor.status     === 'fulfilled' ? mapaCalor.value     : null,
        anomalias:    anomalias.status     === 'fulfilled' ? anomalias.value     : null,
      };
    },
  },
 
  // ══════════════════════════════════════════════════════════════
  //  UTILIDADES
  // ══════════════════════════════════════════════════════════════
  utils: {
    healthCheck: (o?: RequestOptions) => get<{ status: string }>('/', o),
  },
 
} as const;
 
export default api;
 
export const {
  residuos, rutasOp, alertas, estadisticas, chat, admin, dashboard,
} = api;
 
