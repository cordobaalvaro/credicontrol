import clientAxios from "../helpers/axios.helpers";

export const documentoService = {
  
  getDocumentos: async (idCliente) => {
    const response = await clientAxios.get(`/documentos-clientes/${idCliente}`);
    return response.data;
  },

  
  crearDocumento: async (idCliente, nombre) => {
    const response = await clientAxios.post(
      `/documentos-clientes/${idCliente}`,
      { nombre }
    );
    return response.data;
  },

  
  actualizarDocumento: async (documentoId, nombre) => {
    const response = await clientAxios.put(
      `/documentos-clientes/${documentoId}`,
      { nombre }
    );
    return response.data;
  },

  
  subirImagen: async (documentoId, formData, esActualizacion = false) => {
    const method = esActualizacion ? "put" : "post";
    const response = await clientAxios[method](
      `/documentos-clientes/${documentoId}/imagen`,
      formData
    );
    return response.data;
  },

  
  eliminarDocumento: async (documentoId) => {
    const response = await clientAxios.delete(
      `/documentos-clientes/${documentoId}`
    );
    return response.data;
  }
};

export default documentoService;
