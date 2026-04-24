import clientAxios from "../helpers/axios.helpers";

export const zonaService = {
  
  getZonas: async () => {
    const response = await clientAxios.get("/zonas");
    return response.data;
  },

  
  getZonasDashboard: async (filtroMes, filtroAnio) => {
    const response = await clientAxios.get("/zonas");
    return response.data;
  },

  
  getZonaOverview: async (id) => {
    const response = await clientAxios.get(`/zonas/${id}/overview`);
    return response.data;
  },

  
  getClientesPorZona: async (id, filtros = {}) => {
    const paramsFiltrados = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => value !== undefined)
    );
    const params = new URLSearchParams(paramsFiltrados);
    const url = params.toString() ? `/zonas/${id}/clientes?${params}` : `/zonas/${id}/clientes`;
    const response = await clientAxios.get(url);
    return response.data;
  },

  
  getPrestamosPorZona: async (id, filtros = {}) => {
    const paramsFiltrados = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => value !== undefined)
    );
    const params = new URLSearchParams(paramsFiltrados);
    const url = params.toString() ? `/zonas/${id}/prestamos?${params}` : `/zonas/${id}/prestamos`;
    const response = await clientAxios.get(url);
    return response.data;
  },

  
  getZonaById: async (id, filtros = {}) => {
    const params = new URLSearchParams(filtros);
    const url = params.toString() ? `/zonas/${id}?${params}` : `/zonas/${id}`;
    const response = await clientAxios.get(url);
    return response.data;
  },

  
  crearZona: async (datos) => {
    const response = await clientAxios.post("/zonas", datos);
    return response.data;
  },

  
  actualizarZona: async (id, datos) => {
    const response = await clientAxios.put(`/zonas/${id}`, datos);
    return response.data;
  },

  
  eliminarZona: async (id) => {
    const response = await clientAxios.delete(`/zonas/eliminar-zona/${id}`);
    return response.data;
  },

  
  asignarCliente: async (idZona, idCliente) => {
    const response = await clientAxios.post(`/zonas/${idZona}/clientes/${idCliente}`);
    return response.data;
  },

  
  eliminarCliente: async (idZona, idCliente) => {
    const response = await clientAxios.delete(`/zonas/eliminar-cliente/${idZona}/clientes/${idCliente}`);
    return response.data;
  },

  
  asignarCobrador: async (id, cobradorId) => {
    const response = await clientAxios.post(
      `/zonas/${id}/cobrador`,
      { cobradorId }
    );
    return response.data;
  },

  
  asignarCobradores: async (id, cobradoresIds) => {
    
    
    const promesas = cobradoresIds.map(cobradorId => 
      clientAxios.post(`/zonas/${id}/cobrador`, { cobradorId })
    );
    const responses = await Promise.all(promesas);
    return responses[0].data; 
  },

  
  eliminarCobrador: async (id, cobradorId) => {
    const response = await clientAxios.delete(`/zonas/${id}/cobrador/${cobradorId}`);
    return response.data;
  }
};

export default zonaService;
