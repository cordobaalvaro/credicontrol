import clientAxios from "../helpers/axios.helpers";

export const clienteService = {
  
  getClientes: async (filtros = {}) => {
    
    const paramsFiltrados = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => value !== undefined)
    );
    const params = new URLSearchParams(paramsFiltrados);
    const url = params.toString() ? `/clientes?${params}` : `/clientes`;
    const response = await clientAxios.get(url);
    return response.data;
  },

  
  getClienteById: async (id) => {
    const response = await clientAxios.get(`/clientes/${id}`);
    return response.data;
  },

  
  getClientesPorTipo: async (tipo) => {
    const response = await clientAxios.get(
      `/clientes/por-tipo?tipo=${encodeURIComponent(tipo)}`
    );
    return response.data;
  },

  
  getRazonTipo: async (id) => {
    const response = await clientAxios.get(`/clientes/${id}/razon-tipo`);
    return response.data;
  },

  
  crearCliente: async (datos) => {
    const response = await clientAxios.post("/clientes", datos);
    return response.data;
  },

  
  actualizarCliente: async (id, datos) => {
    const response = await clientAxios.put(`/clientes/${id}`, datos);
    return response.data;
  },

  
  eliminarCliente: async (id) => {
    const response = await clientAxios.delete(`/clientes/${id}`);
    return response.data;
  },

  
  getResumenCliente: async (id) => {
    const response = await clientAxios.get(`/clientes/${id}/resumen`);
    return response.data;
  },

  
  recalcularTipos: async () => {
    const response = await clientAxios.post("/clientes/recalcular-tipos", {});
    return response.data;
  }
};

export default clienteService;
