import { api } from "../helpers/axios.helpers";

export const authService = {
  
  login: async (credenciales) => {
    const response = await api.post("/auth/login", credenciales);
    return response.data;
  },

  
  getPerfil: async () => {
    const response = await api.get("/auth/perfil");
    return response.data;
  },

  
  updatePerfil: async (datos) => {
    const response = await api.put("/auth/perfil", datos);
    return response.data;
  }
};

export default authService;
