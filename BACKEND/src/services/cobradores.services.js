const PrestamoModel = require("../models/prestamo.model");
const ClienteModel = require("../models/cliente.model");
const ZonaModel = require("../models/zona.model");
const UsuarioModel = require("../models/usuario.model");

const obtenerMisZonasBD = async (cobradorId) => {
  try {
    if (!cobradorId) {
      return {
        status: 400,
        msg: "ID del cobrador es requerido",
        data: null,
      };
    }

    const cobrador = await UsuarioModel.findById(cobradorId);
    if (!cobrador) {
      return {
        status: 404,
        msg: "Cobrador no encontrado",
        data: null,
      };
    }

    if (cobrador.rol !== "cobrador") {
      return {
        status: 403,
        msg: "El usuario no tiene permisos de cobrador",
        data: null,
      };
    }

    const zonasACargo = await ZonaModel.find({ cobrador: cobradorId })
      .populate({
        path: "clientes",
        match: { estado: "activo" }, 
        populate: {
          path: "prestamos",
          model: "Prestamo",
          match: { estado: { $in: ["activo", "vencido"] } }, 
        },
      })
      .populate("cobrador", "nombre");

    const zonasConEstadisticas = zonasACargo.map((zona) => {
      let totalClientes = zona.clientes.length;
      let clientesConPrestamos = 0;
      let totalPrestamos = 0;
      let cantidadACobrar = 0;
      let totalVencido = 0;

      zona.clientes.forEach((cliente) => {
        if (cliente.prestamos && cliente.prestamos.length > 0) {
          clientesConPrestamos++;
          totalPrestamos += cliente.prestamos.length;

          cliente.prestamos.forEach((prestamo) => {
            
            if (prestamo.estado === 'activo') {
              
              cantidadACobrar += prestamo.saldoPendiente || 0;
            } else if (prestamo.estado === 'vencido') {
              
              totalVencido += prestamo.saldoPendienteVencimiento || 0;
            }
          });
        }
      });

      return {
        _id: zona._id,
        nombre: zona.nombre,
        localidades: zona.localidades,
        cobrador: zona.cobrador,
        estadisticas: {
          totalClientes,
          clientesConPrestamos,
          totalPrestamos,
          cantidadACobrar: parseFloat(cantidadACobrar.toFixed(2)),
          totalVencido: parseFloat(totalVencido.toFixed(2)),
        },
        clientes: zona.clientes.map((cliente) => ({
          _id: cliente._id,
          numero: cliente.numero,
          nombre: cliente.nombre,
          dni: cliente.dni,
          telefono: cliente.telefono,
          direccion: cliente.direccion,
          barrio: cliente.barrio,
          ciudad: cliente.ciudad,
          prestamos: cliente.prestamos || [],
          localidad: cliente.localidad,
          prestamosActivos: cliente.prestamos ? cliente.prestamos.length : 0,
          saldoPendiente: cliente.prestamos
            ? cliente.prestamos.reduce(
              (sum, prestamo) => sum + (prestamo.saldoPendiente || 0),
              0
            )
            : 0,
        })),
      };
    });

    return {
      status: 200,
      msg: "Zonas a cargo obtenidas correctamente",
      data: zonasConEstadisticas,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error interno al obtener zonas a cargo",
      data: null,
    };
  }
};

module.exports = {
  obtenerMisZonasBD,
};
