const ZonaModel = require("../models/zona.model");
const ClienteModel = require("../models/cliente.model");
const UsuarioModel = require("../models/usuario.model");
const PrestamoModel = require("../models/prestamo.model");

const crearZonaBD = async (datos) => {
  try {
    const { clientes = [], cobrador = [] } = datos;

    const nuevaZona = new ZonaModel(datos);
    await nuevaZona.save();

    if (clientes.length > 0) {
      await ClienteModel.updateMany(
        { _id: { $in: clientes } },
        { $set: { zona: nuevaZona._id } }
      );
    }

    if (cobrador.length > 0) {
      await UsuarioModel.updateMany(
        { _id: { $in: cobrador } },
        { $push: { zonaACargo: nuevaZona._id } }
      );
    }

    return {
      status: 201,
      msg: "Zona creada exitosamente y referencias actualizadas",
      data: nuevaZona,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al crear la zona: " + error.message,
      data: null,
    };
  }
};

const obtenerZonaOverviewBD = async (zonaId) => {
  try {
    const zona = await ZonaModel.findById(zonaId).populate("cobrador", "nombre apellido email telefono direccion usuarioLogin");
    if (!zona) {
      return { status: 404, msg: "Zona no encontrada", data: null };
    }

    const clientesZona = await ClienteModel.find(
      { zona: zonaId },
      { _id: 1, tipo: 1, estado: 1, numero: 1, nombre: 1 }
    );

    const clienteIds = clientesZona.map((c) => c._id);

    const topBuenos = clientesZona
      .filter((c) => (c.tipo || "neutro") === "bueno")
      .sort((a, b) => (a.numero ?? 0) - (b.numero ?? 0))
      .slice(0, 5)
      .map((c) => ({ _id: c._id, numero: c.numero, nombre: c.nombre, tipo: c.tipo }));

    const topMalos = clientesZona
      .filter((c) => (c.tipo || "neutro") === "malo")
      .sort((a, b) => (a.numero ?? 0) - (b.numero ?? 0))
      .slice(0, 5)
      .map((c) => ({ _id: c._id, numero: c.numero, nombre: c.nombre, tipo: c.tipo }));

    const prestamosZona = clienteIds.length
      ? await PrestamoModel.find(
          { cliente: { $in: clienteIds }, estado: { $in: ["activo", "vencido", "cancelado"] } },
          { estado: 1, saldoPendiente: 1, saldoPendienteVencimiento: 1 }
        )
      : [];

    const cantidadClientes = clientesZona.length;
    const cantidadPrestamos = prestamosZona.length;

    const saldoPendienteActivos = prestamosZona
      .filter((p) => p.estado === "activo")
      .reduce((sum, p) => sum + (Number(p.saldoPendiente) || 0), 0);

    const saldoPendienteVencidos = prestamosZona
      .filter((p) => p.estado === "vencido")
      .reduce(
        (sum, p) =>
          sum +
          (Number(p.saldoPendienteVencimiento) || Number(p.saldoPendiente) || 0),
        0
      );

    const conteoTipos = {
      neutro: 0,
      bueno: 0,
      regular: 0,
      malo: 0,
    };

    for (const c of clientesZona) {
      const tipo = c.tipo || "neutro";
      if (conteoTipos[tipo] === undefined) continue;
      conteoTipos[tipo] += 1;
    }

    const prestamosGlobal = await PrestamoModel.aggregate([
      { $match: { estado: { $ne: "desactivado" } } },
      {
        $lookup: {
          from: "clientes",
          localField: "cliente",
          foreignField: "_id",
          as: "cliente",
        },
      },
      { $unwind: "$cliente" },
      { $match: { "cliente.zona": { $ne: null } } },
      {
        $group: {
          _id: "$cliente.zona",
          totalPrestamos: { $sum: 1 },
          cancelados: {
            $sum: {
              $cond: [{ $eq: ["$estado", "cancelado"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const ranking = prestamosGlobal.map((z) => {
      const total = z.totalPrestamos || 0;
      const cancelados = z.cancelados || 0;
      const ratio = total > 0 ? cancelados / total : 0;
      return {
        zonaId: z._id?.toString(),
        totalPrestamos: total,
        cancelados,
        ratioCancelados: ratio,
      };
    });

    ranking.sort((a, b) => (b.ratioCancelados - a.ratioCancelados) || (b.totalPrestamos - a.totalPrestamos));

    const posicion = ranking.findIndex((r) => r.zonaId === zonaId.toString());
    const totalZonas = ranking.length;

    const rankingZona = {
      posicion: posicion === -1 ? null : posicion + 1,
      totalZonas,
      ratioCancelados: posicion === -1 ? null : ranking[posicion].ratioCancelados,
      cancelados: posicion === -1 ? null : ranking[posicion].cancelados,
      totalPrestamos: posicion === -1 ? null : ranking[posicion].totalPrestamos,
    };

    return {
      status: 200,
      msg: "Overview de zona obtenido correctamente",
      data: {
        zona: {
          _id: zona._id,
          nombre: zona.nombre,
          localidades: zona.localidades,
          cobrador: zona.cobrador,
        },
        metricas: {
          cantidadClientes,
          cantidadPrestamos,
          saldoPendienteActivos,
          saldoPendienteVencidos,
        },
        rankingTiposClientes: conteoTipos,
        topClientes: {
          buenos: topBuenos,
          malos: topMalos,
        },
        rankingZona,
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener overview de zona: " + error.message,
      data: null,
    };
  }
};

const obtenerClientesZonaBD = async ({ zonaId, q, page = 1, limit = 20 } = {}) => {
  try {
    const zona = await ZonaModel.findById(zonaId, { _id: 1, nombre: 1 });
    if (!zona) {
      return { status: 404, msg: "Zona no encontrada", data: null };
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    const query = { zona: zonaId };
    if (q && q.trim()) {
      const texto = q.trim();
      const regex = new RegExp(texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const asNumber = Number(texto);
      const or = [{ nombre: regex }];
      if (Number.isFinite(asNumber)) {
        or.push({ numero: asNumber });
      } else {
        
        or.push({ numero: { $regex: regex } });
      }
      query.$or = or;
    }

    const [itemsRaw, total] = await Promise.all([
      ClienteModel.find(query, { numero: 1, nombre: 1, dni: 1, telefono: 1, tipo: 1, estado: 1 })
        .sort({ numero: 1 })
        .skip(skip)
        .limit(limitNum),
      ClienteModel.countDocuments(query),
    ]);

    const ids = itemsRaw.map((c) => c._id);
    const counts = ids.length
      ? await PrestamoModel.aggregate([
          { $match: { cliente: { $in: ids }, estado: { $ne: "desactivado" } } },
          { $group: { _id: "$cliente", count: { $sum: 1 } } },
        ])
      : [];
    const mapCounts = new Map(counts.map((r) => [r._id.toString(), r.count]));

    const items = itemsRaw.map((c) => {
      const obj = c.toObject ? c.toObject() : c;
      return {
        ...obj,
        zona: { _id: zona._id, nombre: zona.nombre },
        prestamosCount: mapCounts.get(c._id.toString()) || 0,
      };
    });

    return {
      status: 200,
      msg: "Clientes de zona obtenidos correctamente",
      data: {
        items,
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener clientes de zona: " + error.message,
      data: null,
    };
  }
};

const obtenerPrestamosZonaBD = async ({ zonaId, q, estado = "todos", page = 1, limit = 20 } = {}) => {
  try {
    const zona = await ZonaModel.findById(zonaId, { _id: 1 });
    if (!zona) {
      return { status: 404, msg: "Zona no encontrada", data: null };
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
    const skip = (pageNum - 1) * limitNum;

    const clientesIds = await ClienteModel.find({ zona: zonaId }, { _id: 1 });
    const ids = clientesIds.map((c) => c._id);
    if (ids.length === 0) {
      return {
        status: 200,
        msg: "Préstamos de zona obtenidos correctamente",
        data: { items: [], page: pageNum, limit: limitNum, total: 0, totalPages: 1 },
      };
    }

    const match = {
      cliente: { $in: ids },
    };
    if (estado && estado !== "todos") {
      if (!["activo", "vencido"].includes(estado)) {
        return { status: 400, msg: "Estado inválido", data: null };
      }
      match.estado = estado;
    } else {
      match.estado = { $in: ["activo", "vencido"] };
    }

    const texto = q && q.trim() ? q.trim() : "";
    const regex = texto ? new RegExp(texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") : null;
    const numeroPrestamo = texto && Number.isFinite(Number(texto)) ? Number(texto) : null;

    const pipeline = [
      { $match: match },
      {
        $lookup: {
          from: "clientes",
          localField: "cliente",
          foreignField: "_id",
          as: "cliente",
        },
      },
      { $unwind: "$cliente" },
    ];

    if (regex) {
      const or = [{ "cliente.nombre": regex }];
      if (numeroPrestamo != null) {
        or.push({ numero: numeroPrestamo });
      } else {
        or.push({ nombre: regex });
      }
      pipeline.push({ $match: { $or: or } });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    pipeline.push({
      $facet: {
        items: [
          { $skip: skip },
          { $limit: limitNum },
          {
            $project: {
              _id: 1,
              numero: 1,
              nombre: 1,
              estado: 1,
              montoTotal: 1,
              saldoPendiente: 1,
              saldoPendienteVencimiento: 1,
              fechaInicio: 1,
              fechaVencimiento: 1,
              cliente: {
                _id: "$cliente._id",
                nombre: "$cliente.nombre",
                numero: "$cliente.numero",
                dni: "$cliente.dni",
                tipo: "$cliente.tipo",
              },
            },
          },
        ],
        total: [{ $count: "count" }],
      },
    });

    const result = await PrestamoModel.aggregate(pipeline);
    const first = Array.isArray(result) ? result[0] : null;
    const items = first?.items || [];
    const total = first?.total?.[0]?.count || 0;

    return {
      status: 200,
      msg: "Préstamos de zona obtenidos correctamente",
      data: {
        items,
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener préstamos de zona: " + error.message,
      data: null,
    };
  }
};

const obtenerZonasBD = async () => {
  try {
    const zonasRaw = await ZonaModel.find()
      .populate({
        path: "clientes",
        populate: {
          path: "prestamos",
          model: "Prestamo",
          match: { estado: { $in: ["activo", "vencido"] } },
        },
      })
      .populate("cobrador", "nombre");

    const data = zonasRaw.map((zona) => {
      const z = zona.toObject();
      
      let cantidadClientes = z.clientes?.length || 0;
      let cantidadPrestamosActivos = 0;
      let totalACobrar = 0;
      let totalVencido = 0;

      z.clientes?.forEach((cliente) => {
        cliente.prestamos?.forEach((prestamo) => {
          cantidadPrestamosActivos++;
          const saldo = Number(prestamo.saldoPendiente) || 0;
          const saldoVencimiento = Number(prestamo.saldoPendienteVencimiento) || 0;
          
          if (prestamo.estado === "vencido") {
            const montoVencido = saldoVencimiento || saldo;
            totalACobrar += montoVencido;
            totalVencido += montoVencido;
          } else {
            totalACobrar += saldo;
          }
        });
      });

      return {
        ...z,
        cantidadClientes,
        cantidadPrestamosActivos,
        totalACobrar,
        totalVencido,
      };
    });

    return {
      status: 200,
      msg: "Zonas obtenidas exitosamente",
      data,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener las zonas: " + error.message,
      data: null,
    };
  }
};

const obtenerZonaPorIdBD = async (id, q) => {
  try {
    const zona = await ZonaModel.findById(id)
      .populate({
        path: "clientes",
        populate: {
          path: "prestamos",
          model: "Prestamo",
        },
      })
      .populate("cobrador");
    if (!zona) {
      return {
        status: 404,
        msg: "Zona no encontrada",
        data: null,
      };
    }

    
    if (q && q.trim() && Array.isArray(zona.clientes)) {
      const texto = q.toString().toLowerCase();
      zona.clientes = zona.clientes.filter((c) => {
        const nombre = (c.nombre || "").toLowerCase();
        const numero =
          typeof c.numero === "number" || typeof c.numero === "string"
            ? c.numero.toString().toLowerCase()
            : "";

        return nombre.includes(texto) || numero.includes(texto);
      });
    }
    return {
      status: 200,
      msg: "Zona obtenida exitosamente",
      data: zona,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener la zona: " + error.message,
      data: null,
    };
  }
};

const actualizarZonaBD = async (id, datos) => {
  try {
    const zonaActualizada = await ZonaModel.findByIdAndUpdate(id, datos, {
      new: true,
    }).populate("clientes cobrador");
    if (!zonaActualizada) {
      return {
        status: 404,
        msg: "Zona no encontrada",
        data: null,
      };
    }
    return {
      status: 200,
      msg: "Zona actualizada exitosamente",
      data: zonaActualizada,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al actualizar la zona: " + error.message,
      data: null,
    };
  }
};

const eliminarZonaBD = async (id) => {
  try {
    const zona = await ZonaModel.findById(id);
    if (!zona) {
      return {
        status: 404,
        msg: "Zona no encontrada",
        data: null,
      };
    }

    await UsuarioModel.updateMany(
      { _id: { $in: zona.cobrador } },
      { $pull: { zonaACargo: id } }
    );

    await ClienteModel.updateMany(
      { _id: { $in: zona.clientes }, zona: id },
      { $unset: { zona: "" } }
    );

    const zonaEliminada = await ZonaModel.findByIdAndDelete(id);

    return {
      status: 200,
      msg: "Zona eliminada exitosamente y referencias limpiadas",
      data: zonaEliminada,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al eliminar la zona: " + error.message,
      data: null,
    };
  }
};

const agregarClienteAZonaBD = async (idZona, idCliente) => {
  try {
    const zona = await ZonaModel.findById(idZona);
    if (!zona) {
      return {
        status: 404,
        msg: "Zona no encontrada",
        data: null,
      };
    }

    const cliente = await ClienteModel.findById(idCliente);
    if (!cliente) {
      return {
        status: 404,
        msg: "Cliente no encontrado",
        data: null,
      };
    }

    if (zona.clientes.includes(idCliente)) {
      return {
        status: 400,
        msg: "El cliente ya está asignado a esta zona",
        data: null,
      };
    }

    cliente.zona = idZona;
    await cliente.save();

    zona.clientes.push(idCliente);
    await zona.save();

    return {
      status: 200,
      msg: "Cliente agregado a la zona exitosamente",
      data: zona,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al agregar cliente a zona: " + error.message,
      data: null,
    };
  }
};

const eliminarClienteDeZonaBD = async (idZona, idCliente) => {
  try {
    const zona = await ZonaModel.findById(idZona);
    if (!zona) {
      return { status: 404, msg: "Zona no encontrada", data: null };
    }

    const cliente = await ClienteModel.findById(idCliente);
    if (!cliente) {
      return { status: 404, msg: "Cliente no encontrado", data: null };
    }

    zona.clientes = zona.clientes.filter(
      (clienteId) => clienteId.toString() !== idCliente.toString()
    );

    await zona.save();

    if (cliente.zona && cliente.zona.toString() === idZona.toString()) {
      cliente.zona = null;
      await cliente.save();
    }

    return {
      status: 200,
      msg: "Cliente eliminado de la zona correctamente",
      data: zona,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al eliminar cliente de la zona: " + error.message,
      data: null,
    };
  }
};

const moverClienteDeZonaBD = async (idZonaOrigen, idZonaDestino, idCliente) => {
  try {
    const zonaOrigen = await ZonaModel.findById(idZonaOrigen);
    if (!zonaOrigen) {
      return { status: 404, msg: "Zona origen no encontrada", data: null };
    }

    const zonaDestino = await ZonaModel.findById(idZonaDestino);
    if (!zonaDestino) {
      return { status: 404, msg: "Zona destino no encontrada", data: null };
    }

    const cliente = await ClienteModel.findById(idCliente);
    if (!cliente) {
      return { status: 404, msg: "Cliente no encontrado", data: null };
    }

    zonaOrigen.clientes = zonaOrigen.clientes.filter(
      (clienteId) => clienteId.toString() !== idCliente.toString()
    );

    if (
      !zonaDestino.clientes.some((c) => c.toString() === idCliente.toString())
    ) {
      zonaDestino.clientes.push(idCliente);
    }

    cliente.zona = idZonaDestino;

    await zonaOrigen.save();
    await zonaDestino.save();
    await cliente.save();

    return {
      status: 200,
      msg: "Cliente movido exitosamente de una zona a otra",
      data: { zonaOrigen, zonaDestino, cliente },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al mover cliente entre zonas: " + error.message,
      data: null,
    };
  }
};

const añadirCobradorALaZona = async (zonaId, cobradorId) => {
  try {
    const zona = await ZonaModel.findById(zonaId);
    if (!zona) {
      return {
        status: 404,
        msg: "Zona no encontrada",
        data: null,
      };
    }

    const cobrador = await UsuarioModel.findById(cobradorId);
    if (!cobrador) {
      return {
        status: 404,
        msg: "Usuario no encontrado",
        data: null,
      };
    }

    if (cobrador.rol !== "cobrador") {
      return {
        status: 400,
        msg: "El usuario no es un cobrador",
        data: null,
      };
    }

    if (!zona.cobrador || !Array.isArray(zona.cobrador)) {
      zona.cobrador = [];
    }

    if (zona.cobrador.includes(cobradorId)) {
      return {
        status: 400,
        msg: "El cobrador ya está asignado a esta zona",
        data: null,
      };
    }

    zona.cobrador.push(cobradorId);
    await zona.save();

    if (!cobrador.zonaACargo || !Array.isArray(cobrador.zonaACargo)) {
      cobrador.zonaACargo = [];
    }

    if (!cobrador.zonaACargo.includes(zonaId)) {
      cobrador.zonaACargo.push(zonaId);
      await cobrador.save();
    }

    return {
      status: 200,
      msg: "Cobrador asignado a la zona correctamente",
      data: {
        zona: zona,
        cobrador: cobrador,
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al asignar cobrador a la zona: " + error.message,
      data: null,
    };
  }
};

const eliminarCobradorDeLaZona = async (zonaId, cobradorId) => {
  try {
    const zona = await ZonaModel.findById(zonaId);
    if (!zona) {
      return {
        status: 404,
        msg: "Zona no encontrada",
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

    if (!zona.cobrador || !Array.isArray(zona.cobrador)) {
      zona.cobrador = [];
    }

    if (!zona.cobrador.includes(cobradorId)) {
      return {
        status: 400,
        msg: "El cobrador no está asignado a esta zona",
        data: null,
      };
    }

    zona.cobrador = zona.cobrador.filter((id) => id.toString() !== cobradorId);
    await zona.save();

    if (!cobrador.zonaACargo || !Array.isArray(cobrador.zonaACargo)) {
      cobrador.zonaACargo = [];
    }

    cobrador.zonaACargo = cobrador.zonaACargo.filter(
      (id) => id.toString() !== zonaId
    );
    await cobrador.save();

    return {
      status: 200,
      msg: "Cobrador eliminado de la zona correctamente",
      data: {
        zona: zona,
        cobradorEliminado: cobradorId,
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al eliminar cobrador de la zona: " + error.message,
      data: null,
    };
  }
};

module.exports = {
  crearZonaBD,
  obtenerZonasBD,
  obtenerZonaPorIdBD,
  actualizarZonaBD,
  eliminarZonaBD,
  agregarClienteAZonaBD,
  eliminarClienteDeZonaBD,
  moverClienteDeZonaBD,
  añadirCobradorALaZona,
  eliminarCobradorDeLaZona,
  obtenerZonaOverviewBD,
  obtenerClientesZonaBD,
  obtenerPrestamosZonaBD,
};
