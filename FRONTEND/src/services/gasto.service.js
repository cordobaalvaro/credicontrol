import clientAxios from "../helpers/axios.helpers";

export const gastoService = {
  
  getGastos: async (filtros = {}) => {
    const paramsFiltrados = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => value !== undefined)
    );
    const params = new URLSearchParams(paramsFiltrados);
    const url = params.toString() ? `/gastos?${params}` : `/gastos`;
    const response = await clientAxios.get(url);
    return response.data;
  },

  
  crearGasto: async (datos) => {
    const response = await clientAxios.post("/gastos", datos);
    return response.data;
  },

  
  updateGasto: async (id, datos) => {
    const response = await clientAxios.put(`/gastos/${id}`, datos);
    return response.data;
  },

  
  eliminarGasto: async (id) => {
    const response = await clientAxios.delete(`/gastos/${id}`);
    return response.data;
  }
};

export default gastoService;
