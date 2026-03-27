import clientAxios from "../helpers/axios.helpers";

export const tablaSemanalService = {
  
  getTablas: async (filtros = {}) => {
    const paramsFiltrados = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => value !== undefined)
    );
    const params = new URLSearchParams(paramsFiltrados);
    const url = params.toString() ? `/tablas-semanal?${params}` : `/tablas-semanal`;
    const response = await clientAxios.get(url);
    return response.data;
  },

  getMisTablas: async (filtros = {}) => {
    const paramsFiltrados = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => value !== undefined)
    );
    const params = new URLSearchParams(paramsFiltrados);
    const url = params.toString() ? `/tablas-semanal/mis/tablas?${params}` : `/tablas-semanal/mis/tablas`;
    const response = await clientAxios.get(url);
    return response.data;
  },

  
  getTablaById: async (id) => {
    const response = await clientAxios.get(`/tablas-semanal/${id}`);
    return response.data;
  },

  
  getUltimaTablaPorCobrador: async (cobradorId) => {
    const response = await clientAxios.get(
      `/tablas-semanal/cobrador/${cobradorId}/ultima`
    );
    return response.data;
  },

  
  getPlanCuotas: async (prestamoId) => {
    const response = await clientAxios.get(
      `/tablas-semanal/prestamos/${prestamoId}/plan-cuotas`
    );
    return response.data;
  },

  
  getPrestamosParaTabla: async (filtros = {}) => {
    const paramsFiltrados = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => value !== undefined)
    );
    const params = new URLSearchParams(paramsFiltrados);
    const url = params.toString() ? `/tablas-semanal/prestamos?${params}` : `/tablas-semanal/prestamos`;
    const response = await clientAxios.get(url);
    return response.data;
  },

  
  crearTabla: async (datos) => {
    const response = await clientAxios.post("/tablas-semanal", datos);
    return response.data;
  },

  
  generarTabla: async (datos) => {
    const response = await clientAxios.post("/tablas-semanal/generar", datos);
    return response.data;
  },

  
  enviarTabla: async (id) => {
    const response = await clientAxios.post(`/tablas-semanal/${id}/enviar`, {});
    return response.data;
  },

  
  actualizarMontos: async (tablaId, items) => {
    const response = await clientAxios.put(
      `/tablas-semanal/${tablaId}/montos`,
      { items }
    );
    return response.data;
  },

  
  modificarEsperado: async (tablaId, itemId, datos) => {
    const response = await clientAxios.patch(
      `/tablas-semanal/${tablaId}/items/${itemId}/modificar-esperado`,
      datos
    );
    return response.data;
  },

  
  cargarItem: async (tablaId, itemId, datos) => {
    const response = await clientAxios.put(
      `/tablas-semanal/${tablaId}/items/${itemId}/cargar`,
      datos
    );
    return response.data;
  },

  
  agregarPrestamoATabla: async (tablaId, prestamoId) => {
    const response = await clientAxios.post(
      `/tablas-semanal/${tablaId}/agregar-prestamo`,
      { prestamoId }
    );
    return response.data;
  },

  
  actualizarMontosCobrador: async (tablaId, items) => {
    const response = await clientAxios.put(
      `/tablas-semanal/${tablaId}/items/cobrador`,
      { items }
    );
    return response.data;
  },

  
  cerrarTablaCobrador: async (tablaId) => {
    const response = await clientAxios.put(
      `/tablas-semanal/${tablaId}/cerrar-cobrador`,
      {}
    );
    return response.data;
  },

  
  abrirTabla: async (tablaId) => {
    const response = await clientAxios.post(
      `/tablas-semanal/${tablaId}/abrir`,
      {}
    );
    return response.data;
  },

  
  cerrarTabla: async (tablaId) => {
    const response = await clientAxios.post(
      `/tablas-semanal/${tablaId}/cerrar`,
      {}
    );
    return response.data;
  },

  
  eliminarItem: async (tablaId, itemId) => {
    const response = await clientAxios.delete(
      `/tablas-semanal/${tablaId}/items/${itemId}`
    );
    return response.data;
  },

  
  eliminarTabla: async (id) => {
    const response = await clientAxios.delete(`/tablas-semanal/${id}`);
    return response.data;
  },

  
  trasladarItems: async (tablaOrigenId, datos) => {
    const response = await clientAxios.post(
      `/tablas-semanal/${tablaOrigenId}/trasladar-items`,
      datos
    );
    return response.data;
  }
};

export default tablaSemanalService;

