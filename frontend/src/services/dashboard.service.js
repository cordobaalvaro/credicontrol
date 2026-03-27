import clientAxios from "../helpers/axios.helpers";

export const dashboardService = {
  
  getAdminDashboard: async (mes, anio) => {
    const params = new URLSearchParams({ mes, anio });
    const response = await clientAxios.get(`/dashboard?${params}`);
    return response.data;
  },

  
  getCobradorDashboard: async () => {
    const response = await clientAxios.get("/dashboard-cobrador");
    return response.data;
  },

  
  getMetricasDia: async () => {
    const response = await clientAxios.get("/dashboard-cobrador/metricas-dia");
    return response.data;
  },

  
  getResumenSemanal: async () => {
    const response = await clientAxios.get("/dashboard-cobrador/resumen-semanal");
    return response.data;
  },

  
  getProximosACobrar: async () => {
    const response = await clientAxios.get("/dashboard-cobrador/proximos-cobrar");
    return response.data;
  },

  
  getMisZonas: async () => {
    const response = await clientAxios.get("/dashboard-cobrador/mis-zonas");
    return response.data;
  },

  
  getNovedades: async () => {
    const response = await clientAxios.get("/dashboard-cobrador/novedades");
    return response.data;
  },

  
  getPrestamosActivos: async () => {
    const response = await clientAxios.get("/dashboard-cobrador/prestamos-activos");
    return response.data;
  },

  
  getPrestamosVencidos: async () => {
    const response = await clientAxios.get("/dashboard-cobrador/prestamos-vencidos");
    return response.data;
  },

  
  getPrestamosCobradosMes: async (mes, anio) => {
    const params = new URLSearchParams({ mes, anio });
    const response = await clientAxios.get(`/dashboard/prestamos-cobrados-mes?${params}`);
    return response.data;
  },

  
  getEstadisticasGanancias: async (mes, anio) => {
    const params = new URLSearchParams({ mes, anio });
    const response = await clientAxios.get(`/dashboard/estadisticas-ganancias?${params}`);
    return response.data;
  }
};

export default dashboardService;
