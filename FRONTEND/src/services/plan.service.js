import clientAxios from "../helpers/axios.helpers";

export const planService = {
  
  getPlanes: async (filtros = {}) => {
    const params = new URLSearchParams(filtros);
    const response = await clientAxios.get(`/planes?${params}`);
    return response.data;
  },

  
  crearPlan: async (datos) => {
    const response = await clientAxios.post("/planes", datos);
    return response.data;
  },

  
  updatePlan: async (id, datos) => {
    const response = await clientAxios.put(`/planes/${id}`, datos);
    return response.data;
  },

  
  eliminarPlan: async (id) => {
    const response = await clientAxios.delete(`/planes/${id}`);
    return response.data;
  },

  
  generarPlanes: async () => {
    const response = await clientAxios.post("/planes/generar-planes", {});
    return response.data;
  }
};

export default planService;
