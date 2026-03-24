import clientAxios from "../helpers/axios.helpers";

export const registroCobroService = {
  
  crearRegistro: async (prestamoId, datos) => {
    const response = await clientAxios.post(
      `/registro-cobros/prestamos/${prestamoId}/crear-registro`,
      datos
    );
    return response.data;
  },

  
  actualizarRegistro: async (prestamoId, registroId, datos) => {
    const response = await clientAxios.put(
      `/registro-cobros/prestamos/${prestamoId}/registros/${registroId}`,
      datos
    );
    return response.data;
  },

  
  eliminarRegistro: async (prestamoId, registroId) => {
    const response = await clientAxios.delete(
      `/registro-cobros/prestamos/${prestamoId}/registros/${registroId}`
    );
    return response.data;
  }
};

export default registroCobroService;
