import clientAxios from "../helpers/axios.helpers";

export const notificacionService = {
  
  getNotificaciones: async (filtros = {}) => {
    const response = await clientAxios.get("/notificaciones", {
      params: filtros,
    });
    return response.data;
  },

  
  marcarTodasComoLeidas: async () => {
    const response = await clientAxios.patch("/notificaciones/leidas/todas", {});
    return response.data;
  },

  
  marcarComoLeida: async (id) => {
    const response = await clientAxios.patch(`/notificaciones/leidas/${id}`, {});
    return response.data;
  },

  
  eliminarNotificacion: async (id) => {
    const response = await clientAxios.delete(`/notificaciones/${id}`);
    return response.data;
  }
};

export default notificacionService;
