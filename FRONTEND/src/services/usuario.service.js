import clientAxios from "../helpers/axios.helpers";

export const usuarioService = {

  getUsuarios: async (filtros = {}) => {
    const paramsFiltrados = Object.fromEntries(
      Object.entries(filtros).filter(([_, value]) => value !== undefined)
    );
    const params = new URLSearchParams(paramsFiltrados);
    const url = params.toString() ? `/usuarios?${params}` : `/usuarios`;
    const response = await clientAxios.get(url);
    return response.data;
  },

  getUsuarioById: async (id) => {
    const response = await clientAxios.get(`/usuarios/${id}`);
    return response.data;
  },

  getMisZonasCobradores: async () => {
    const response = await clientAxios.get("/cobradores/mis-zonas");
    return response.data;
  },

  crearUsuario: async (datos) => {
    const response = await clientAxios.post("/usuarios", datos);
    return response.data;
  },

  actualizarUsuario: async (id, datos) => {
    const response = await clientAxios.put(`/usuarios/${id}`, datos);
    return response.data;
  },

  eliminarUsuario: async (id) => {
    const response = await clientAxios.delete(`/usuarios/${id}`);
    return response.data;
  }
};

export default usuarioService;
