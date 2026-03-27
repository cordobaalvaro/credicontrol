import clientAxios from "../helpers/axios.helpers";

export const prestamoService = {
  
  getPrestamos: async (filtros = {}) => {
    const paramsFiltrados = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => value !== undefined)
    );
    const params = new URLSearchParams(paramsFiltrados);
    const url = params.toString() ? `/prestamos?${params}` : `/prestamos`;
    const response = await clientAxios.get(url);
    return response.data;
  },

  
  getPrestamoById: async (id) => {
    const response = await clientAxios.get(`/prestamos/${id}`);
    return response.data;
  },

  
  getReporteCobros: async (id) => {
    const response = await clientAxios.get(`/prestamos/${id}/reporte-cobros`);
    return response.data;
  },

  
  crearPrestamo: async (datos) => {
    const response = await clientAxios.post("/prestamos", datos);
    return response.data;
  },

  
  elegirPlan: async (datos) => {
    const response = await clientAxios.post("/prestamos/elegir-plan", datos);
    return response.data;
  },

  
  updatePrestamo: async (id, datos) => {
    const response = await clientAxios.put(`/prestamos/${id}`, datos);
    return response.data;
  },

  
  activarPrestamo: async (id) => {
    const response = await clientAxios.put(`/prestamos/${id}/activar`, {});
    return response.data;
  },

  
  desactivarPrestamo: async (id) => {
    const response = await clientAxios.put(`/prestamos/${id}/desactivar`, {});
    return response.data;
  },

  
  eliminarPrestamo: async (id) => {
    const response = await clientAxios.delete(`/prestamos/${id}`);
    return response.data;
  }
};

export default prestamoService;
