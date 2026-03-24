import api from "../helpers/axios.helpers";
const pdfService = {
  
  getResumenCliente: async (id) => {
    try {
      const { data } = await api.get(`/pdfs/cliente/${id}/resumen`);
      return data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  getReporteCobros: async (id) => {
    try {
      const { data } = await api.get(`/pdfs/prestamo/${id}/reporte-cobros`);
      return data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  getDatosTablaSemanal: async (id) => {
    try {
      const { data } = await api.get(`/pdfs/tabla-semanal/${id}`);
      return data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  getDatosPrestamo: async (id) => {
    try {
      const { data } = await api.get(`/pdfs/prestamo/${id}/detalle`);
      return data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  getPlanes: async (tabla) => {
    try {
      const params = tabla ? { tabla } : {};
      const { data } = await api.get("/pdfs/planes", { params });
      return data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
export default pdfService;
