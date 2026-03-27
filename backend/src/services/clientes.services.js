const ClienteModel = require("../models/cliente.model");
const PrestamoModel = require("../models/prestamo.model");
const ZonaModel = require("../models/zona.model");
const DocumentoCliente = require("../models/documentosCliente.model");

/**
 * Crea un nuevo cliente y lo registra automáticamente en su zona.
 * Maneja el error de DNI duplicado (código 11000 de MongoDB).
 *
 * @param {{ nombre: string, dni: string, telefono: string, zona: string, direccion?: string, direccionComercial?: string }} datos
 * @returns {Promise<{status: number, msg: string, data: object|null}>}
 */
const crearClienteBD = async (datos) => {
  try {
    const nuevoCliente = new ClienteModel(datos);
    await nuevoCliente.save();

    await ZonaModel.findByIdAndUpdate(datos.zona, {
      $push: { clientes: nuevoCliente._id },
    });

    return {
      status: 201,
      msg: "Cliente creado exitosamente",
      data: nuevoCliente,
    };
  } catch (error) {
    if (error.code === 11000) {
      return {
        status: 400,
        msg: "Ya existe un cliente con este DNI",
        data: null,
      };
    }
    return {
      status: 500,
      msg: "Error al crear el cliente: " + error.message,
      data: null,
    };
  }
};

const obtenerClientesPorTipoBD = async (tipo) => {
  try {
    const tiposValidos = ["neutro", "bueno", "regular", "malo", "todos"];

    if (!tiposValidos.includes(tipo)) {
      return {
        status: 400,
        msg: "Tipo de cliente inválido",
        data: null,
      };
    }

    const filtroBase = { estado: "activo" };
    if (tipo !== "todos") {
      filtroBase.tipo = tipo;
    }

    const clientes = await ClienteModel.find(
      filtroBase,
      { numero: 1, nombre: 1, dni: 1, telefono: 1, tipo: 1, zona: 1 }
    )
      .populate("zona", "nombre")
      .sort({ numero: 1 });

    return {
      status: 200,
      msg: "Clientes filtrados por tipo obtenidos correctamente",
      data: clientes,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener clientes por tipo: " + error.message,
      data: null,
    };
  }
};

/**
 * Genera un array de mensajes en lenguaje natural explicando por qué un cliente
 * tiene el tipo (scoring) que tiene actualmente.
 * Usa la misma lógica que `repasarTiposDeClientes` pero produce texto legible para el admin.
 *
 * @param {string} clienteId - ID de MongoDB del cliente.
 * @returns {Promise<{status: number, msg: string, data: {cliente: object, tipo: string, razones: string[]}|null}>}
 */
const obtenerRazonTipoClienteBD = async (clienteId) => {
  try {
    const cliente = await ClienteModel.findById(clienteId, {
      numero: 1,
      nombre: 1,
      tipo: 1,
      estado: 1,
    });

    if (!cliente) {
      return {
        status: 404,
        msg: "Cliente no encontrado",
        data: null,
      };
    }

    const prestamos = await PrestamoModel.find({
      cliente: clienteId,
      estado: { $ne: "desactivado" },
    }).select("estado semanasVencidas updatedAt createdAt montoTotal saldoPendiente");

    const razones = [];

    if (!prestamos || prestamos.length === 0) {
      razones.push(
        "El cliente no tiene préstamos asociados actualmente, por lo que aún no puede ser evaluado como bueno, regular o malo."
      );
      razones.push(
        "Este cliente aún no es catalogado como bueno, malo ni regular porque es nuevo en el sistema."
      );
      razones.push(
        "Para ser catalogado como bueno debe, al menos, estar al día y tener algún préstamo con el 50% o más del saldo pendiente pagado."
      );

      return {
        status: 200,
        msg: "Razones del tipo de cliente obtenidas correctamente",
        data: {
          cliente: {
            id: cliente._id,
            numero: cliente.numero,
            nombre: cliente.nombre,
            tipo: cliente.tipo,
            estado: cliente.estado,
          },
          tipo: cliente.tipo,
          razones,
        },
      };
    }

    const ahora = new Date();
    const tresMesesMs = 90 * 24 * 60 * 60 * 1000;

    const prestamosVencidosActuales = prestamos.filter(
      (p) => p.estado === "vencido" && (p.semanasVencidas || 0) > 0
    );

    const semanasVencidasActualesTotal = prestamosVencidosActuales.reduce(
      (sum, p) => sum + (p.semanasVencidas || 0),
      0
    );

    const prestamosConHistorialVencido = prestamos.filter(
      (p) => (p.semanasVencidas || 0) > 0
    );

    const semanasVencidasHistoricasTotal = prestamosConHistorialVencido.reduce(
      (sum, p) => sum + (p.semanasVencidas || 0),
      0
    );

    let fechaUltimoVencido = null;
    for (const p of prestamosConHistorialVencido) {
      const fecha = p.updatedAt || p.createdAt;
      if (!fecha) continue;
      if (!fechaUltimoVencido || fecha > fechaUltimoVencido) {
        fechaUltimoVencido = fecha;
      }
    }

    const tienePrestamoMedioPagado = prestamos.some((p) => {
      const montoTotal = p.montoTotal || 0;
      if (!montoTotal) return false;
      const saldoPendiente = p.saldoPendiente ?? montoTotal;
      const pagado = montoTotal - saldoPendiente;
      const ratioPagado = pagado / montoTotal;
      return ratioPagado >= 0.5;
    });

    
    const tipoActual = cliente.tipo || "neutro";

    if (tipoActual === "malo") {
      razones.push(
        `Este cliente tiene ${prestamosVencidosActuales.length} préstamo(s) vencido(s) actualmente con un total de ${semanasVencidasActualesTotal} semana(s) vencida(s).`
      );

      if (semanasVencidasHistoricasTotal > 0) {
        razones.push(
          `Entre todos sus préstamos, suma ${semanasVencidasHistoricasTotal} semana(s) vencida(s) en su historial.`
        );
      }

      if (fechaUltimoVencido) {
        const diffMs = ahora - fechaUltimoVencido;
        const dias = Math.floor(diffMs / (24 * 60 * 60 * 1000));
        razones.push(
          `Su último préstamo con semanas vencidas fue hace aproximadamente ${dias} día(s).`
        );
      }

      razones.push(
        "En base a su historial reciente, este cliente no se encuentra al día con sus deudas o pagos."
      );
    } else if (tipoActual === "regular") {
      if (prestamosVencidosActuales.length === 0) {
        razones.push(
          "Este cliente está al día actualmente y no tiene préstamos vencidos en este momento."
        );
      } else {
        razones.push(
          `Actualmente tiene ${prestamosVencidosActuales.length} préstamo(s) con semanas vencidas, pero el total de semanas vencidas no es tan alto como para considerarlo un cliente malo.`
        );
      }

      if (semanasVencidasHistoricasTotal > 0) {
        razones.push(
          `En su historial tuvo semanas vencidas en ${prestamosConHistorialVencido.length} préstamo(s), sumando ${semanasVencidasHistoricasTotal} semana(s) vencida(s) en total.`
        );
      }

      if (fechaUltimoVencido) {
        const diffMs = ahora - fechaUltimoVencido;
        const dias = Math.floor(diffMs / (24 * 60 * 60 * 1000));
        razones.push(
          `Su último préstamo con semanas vencidas fue hace aproximadamente ${dias} día(s).`
        );
      }

      razones.push(
        "Este cliente está al día actualmente, pero su historial muestra atrasos previos que se tuvieron en cuenta para catalogarlo como regular."
      );
    } else if (tipoActual === "bueno") {
      razones.push("Este cliente está al día y no presenta préstamos vencidos actualmente.");

      if (semanasVencidasHistoricasTotal > 0) {
        razones.push(
          `En algún momento tuvo semanas vencidas, pero actualmente esas deudas están regularizadas. El total histórico es de ${semanasVencidasHistoricasTotal} semana(s) vencida(s).`
        );
      } else {
        razones.push("No registra semanas vencidas acumuladas en su historial de préstamos.");
      }

      if (tienePrestamoMedioPagado) {
        razones.push(
          "Tiene al menos un préstamo con el 50% o más del monto total ya pagado, lo que refuerza su buen comportamiento de pago."
        );
      }
    } else {
      razones.push(
        "Este cliente aún no es catalogado como bueno, malo ni regular porque es nuevo o tiene poco historial en el sistema."
      );
      razones.push(
        "Para ser catalogado como bueno debe, al menos, estar al día y tener algún préstamo con el 50% o más del saldo pendiente pagado."
      );

      if (tienePrestamoMedioPagado) {
        razones.push(
          "Ya tiene al menos un préstamo con el 50% o más pagado, por lo que en el próximo repaso podría pasar a ser considerado como bueno si mantiene un buen comportamiento de pago."
        );
      } else {
        razones.push(
          "Por ahora todavía no cumple la condición de tener un préstamo con al menos el 50% del monto pagado, por eso sigue en estado neutro."
        );
      }
    }

    return {
      status: 200,
      msg: "Razones del tipo de cliente obtenidas correctamente",
      data: {
        cliente: {
          id: cliente._id,
          numero: cliente.numero,
          nombre: cliente.nombre,
          tipo: cliente.tipo,
          estado: cliente.estado,
        },
        tipo: tipoActual,
        razones,
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener razones del tipo de cliente: " + error.message,
      data: null,
    };
  }
};

/**
 * Job que recalcula y actualiza el tipo (scoring) de todos los clientes activos.
 * Es llamado por el cron nocturno junto con `actualizarPrestamos`.
 *
 * Reglas de clasificación:
 * - 'malo':    tiene préstamos vencidos con 4 o más semanas acumuladas de mora actual.
 * - 'regular': tiene préstamos vencidos con menos de 4 semanas, o tuvo mora reciente (< 90 días).
 * - 'bueno':   sin mora actual, historial de mora resuelto hace más de 90 días (3 meses),
 *              Y al menos un préstamo con el 50% o más del monto pagado.
 * - 'neutro':  sin préstamos, o 'bueno' calculado pero sin cumplir el requisito del 50% pagado.
 *
 * @returns {Promise<{status: number, msg: string, data: {procesados: number, actualizados: number}|null}>}
 */
const repasarTiposDeClientes = async () => {
  try {
    const clientes = await ClienteModel.find(
      { estado: "activo" },
      { numero: 1, nombre: 1, tipo: 1 }
    );

    if (!clientes || clientes.length === 0) {
      return {
        status: 200,
        msg: "No hay clientes para repasar tipos",
        data: { procesados: 0, actualizados: 0 },
      };
    }

    const ahora = new Date();
    // Regla de recuperación: un cliente con historial de mora necesita
    // 90 días (3 meses) sin nuevos vencidos para poder ascender a 'bueno'.
    const tresMesesMs = 90 * 24 * 60 * 60 * 1000;

    let actualizados = 0;

    for (const cliente of clientes) {
      const prestamos = await PrestamoModel.find({
        cliente: cliente._id,
        estado: { $ne: "desactivado" },
      }).select("estado semanasVencidas updatedAt montoTotal saldoPendiente");

      if (!prestamos || prestamos.length === 0) {
          if (cliente.tipo !== "neutro") {
          cliente.tipo = "neutro";
          await cliente.save();
          actualizados++;
        }
        continue;
      }

      const prestamosVencidosActuales = prestamos.filter(
        (p) => p.estado === "vencido" && (p.semanasVencidas || 0) > 0
      );

      const semanasVencidasActualesTotal = prestamosVencidosActuales.reduce(
        (sum, p) => sum + (p.semanasVencidas || 0),
        0
      );

      const prestamosConHistorialVencido = prestamos.filter(
        (p) => (p.semanasVencidas || 0) > 0
      );

      const semanasVencidasHistoricasTotal = prestamosConHistorialVencido.reduce(
        (sum, p) => sum + (p.semanasVencidas || 0),
        0
      );

      let fechaUltimoVencido = null;
      for (const p of prestamosConHistorialVencido) {
        const fecha = p.updatedAt || p.createdAt;
        if (!fecha) continue;
        if (!fechaUltimoVencido || fecha > fechaUltimoVencido) {
          fechaUltimoVencido = fecha;
        }
      }

      const tieneVencidosActuales = prestamosVencidosActuales.length > 0;

      let nuevoTipo = cliente.tipo || "neutro";

      if (tieneVencidosActuales) {
        if (semanasVencidasActualesTotal >= 4) {
          nuevoTipo = "malo";
        } else {
          nuevoTipo = "regular";
        }
      } else {
          if (semanasVencidasHistoricasTotal > 4) {
          if (fechaUltimoVencido) {
            const diffMs = ahora - fechaUltimoVencido;
            if (diffMs >= tresMesesMs) {
              nuevoTipo = "bueno";
            } else {
              nuevoTipo = "regular";
            }
          } else {
                  nuevoTipo = "regular";
          }
        } else {
          nuevoTipo = "bueno";
        }
      }

      if (nuevoTipo === "bueno" && cliente.tipo === "neutro") {
        const tienePrestamoMedioPagado = prestamos.some((p) => {
          const montoTotal = p.montoTotal || 0;
          if (!montoTotal) return false;
          const saldoPendiente = p.saldoPendiente ?? montoTotal;
          const pagado = montoTotal - saldoPendiente;
          const ratioPagado = pagado / montoTotal;
          return ratioPagado >= 0.5;
        });

        if (!tienePrestamoMedioPagado) {
                  nuevoTipo = "neutro";
        }
      }

      if (nuevoTipo !== cliente.tipo) {
        cliente.tipo = nuevoTipo;
        await cliente.save();
        actualizados++;
      }
    }

    return {
      status: 200,
      msg: "Tipos de clientes repasados correctamente",
      data: { procesados: clientes.length, actualizados },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al repasar tipos de clientes: " + error.message,
      data: null,
    };
  }
};

const marcarClienteInactivoBD = async (id) => {
  try {
    const cliente = await ClienteModel.findByIdAndUpdate(
      id,
      { estado: "inactivo" },
      { new: true }
    );

    if (!cliente) {
      return {
        status: 404,
        msg: "Cliente no encontrado",
        data: null,
      };
    }

    return {
      status: 200,
      msg: "Cliente marcado como inactivo correctamente",
      data: cliente,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al marcar el cliente como inactivo: " + error.message,
      data: null,
    };
  }
};

const marcarClienteActivoBD = async (id) => {
  try {
    const cliente = await ClienteModel.findByIdAndUpdate(
      id,
      { estado: "activo" },
      { new: true }
    );

    if (!cliente) {
      return {
        status: 404,
        msg: "Cliente no encontrado",
        data: null,
      };
    }

    return {
      status: 200,
      msg: "Cliente marcado como activo correctamente",
      data: cliente,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al marcar el cliente como activo: " + error.message,
      data: null,
    };
  }
};

/**
 * Obtiene la lista de clientes con filtros opcionales aplicados en memoria.
 * Los filtros `conZona`/`sinZona` no se pueden expresar directamente en la query de Mongo
 * porque dependen del populate, por eso se filtran después de la consulta.
 *
 * @param {{ zona?: string|'conZona'|'sinZona', estado?: 'activo'|'inactivo', q?: string }} [filtros={}]
 * @returns {Promise<{status: number, msg: string, data: object[]|null}>}
 */
const obtenerClientesBD = async (filtros = {}) => {
  try {
    let query = {};
    if (filtros.zona && filtros.zona !== "conZona" && filtros.zona !== "sinZona") {
      query.zona = filtros.zona;
    }
    
    let clientes = await ClienteModel.find(query).populate("prestamos zona");

    if (filtros.zona === "conZona") {
      clientes = clientes.filter((c) => c.zona);
    } else if (filtros.zona === "sinZona") {
      clientes = clientes.filter((c) => !c.zona);
    }

    if (filtros.estado && ["activo", "inactivo"].includes(filtros.estado)) {
      clientes = clientes.filter((c) => c.estado === filtros.estado);
    }

    if (filtros.q && filtros.q.trim()) {
      const q = filtros.q.toString().toLowerCase();
      clientes = clientes.filter((c) => {
        const nombre = (c.nombre || "").toLowerCase();
        const numero =
          typeof c.numero === "number" || typeof c.numero === "string"
            ? c.numero.toString().toLowerCase()
            : "";

        return nombre.includes(q) || numero.includes(q);
      });
    }

    return {
      status: 200,
      msg: "Clientes obtenidos exitosamente",
      data: clientes,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener los clientes: " + error.message,
      data: null,
    };
  }
};

const obtenerClientePorIdBD = async (id) => {
  try {
    const cliente = await ClienteModel.findById(id)
      .populate("prestamos")
      .populate({
        path: "zona",
        populate: {
          path: "cobrador",
        },
      });

    if (!cliente) {
      return {
        status: 404,
        msg: "Cliente no encontrado",
        data: null,
      };
    }

    return {
      status: 200,
      msg: "Cliente encontrado exitosamente",
      data: cliente,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener el cliente: " + error.message,
      data: null,
    };
  }
};

const obtenerClientePorDNIBD = async (dni) => {
  try {
    const cliente = await ClienteModel.findOne({ dni }).populate("prestamos");
    if (!cliente) {
      return {
        status: 404,
        msg: "Cliente no encontrado",
        data: null,
      };
    }
    return {
      status: 200,
      msg: "Cliente encontrado exitosamente",
      data: cliente,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al buscar el cliente por DNI: " + error.message,
      data: null,
    };
  }
};

const actualizarClienteBD = async (id, nuevosDatos) => {
  try {
    const clienteActual = await ClienteModel.findById(id);
    if (!clienteActual) {
      return {
        status: 404,
        msg: "Cliente no encontrado",
        data: null,
      };
    }

    const direccion = nuevosDatos.direccion ?? clienteActual.direccion;
    const direccionComercial =
      nuevosDatos.direccionComercial ?? clienteActual.direccionComercial;
    const direccionCobro = nuevosDatos.direccionCobro ?? clienteActual.direccionCobro;

    if (direccionCobro === "direccionComercial") {
      nuevosDatos.direccionCobroValor = direccionComercial || "";
    } else {
      nuevosDatos.direccionCobroValor = direccion || "";
    }

    if (
      nuevosDatos.zona &&
      nuevosDatos.zona !== clienteActual.zona?.toString()
    ) {
      const nuevaZona = await ZonaModel.findById(nuevosDatos.zona);
      if (!nuevaZona) {
        return {
          status: 404,
          msg: "La nueva zona especificada no existe",
          data: null,
        };
      }

      if (clienteActual.zona) {
        await ZonaModel.findByIdAndUpdate(clienteActual.zona, {
          $pull: { clientes: id },
        });
      }
      await ZonaModel.findByIdAndUpdate(nuevosDatos.zona, {
        $addToSet: { clientes: id },
      });
    }

    const cliente = await ClienteModel.findByIdAndUpdate(id, nuevosDatos, {
      new: true,
      runValidators: true,
    }).populate("zona", "nombre");

    return {
      status: 200,
      msg:
        nuevosDatos.zona && nuevosDatos.zona !== clienteActual.zona?.toString()
          ? "Cliente actualizado exitosamente y movido a nueva zona"
          : "Cliente actualizado exitosamente",
      data: cliente,
    };
  } catch (error) {
    if (error.code === 11000) {
      return {
        status: 400,
        msg: "Ya existe un cliente con este DNI",
        data: null,
      };
    }
    return {
      status: 500,
      msg: "Error al actualizar el cliente: " + error.message,
      data: null,
    };
  }
};

const eliminarClienteBD = async (id) => {
  try {
    const cliente = await ClienteModel.findById(id).populate("prestamos");
    if (!cliente) {
      return {
        status: 404,
        msg: "Cliente no encontrado",
        data: null,
      };
    }

    if (
      cliente.prestamos &&
      cliente.prestamos.some((prestamo) => prestamo.estado === "PENDIENTE")
    ) {
      return {
        status: 400,
        msg: "No se puede eliminar un cliente con préstamos pendientes",
        data: null,
      };
    }

    await PrestamoModel.deleteMany({ cliente: id });
    await DocumentoCliente.deleteMany({ clienteId: id });

    if (cliente.zona) {
      await ZonaModel.findByIdAndUpdate(cliente.zona, {
        $pull: { clientes: id },
      });
    }

    await ClienteModel.findByIdAndDelete(id);

    return {
      status: 200,
      msg: "Cliente y préstamos eliminados exitosamente",
      data: cliente,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al eliminar el cliente: " + error.message,
      data: null,
    };
  }
};

const obtenerResumenClienteBD = async (clienteId) => {
  try {
    const cliente = await ClienteModel.findById(clienteId);
    if (!cliente) {
      return {
        status: 404,
        msg: "Cliente no encontrado",
        data: null,
      };
    }

    const prestamos = await PrestamoModel.find({
      cliente: clienteId,
      estado: { $ne: "desactivado" },
    });

    const prestamosTodos = await PrestamoModel.find({
      cliente: clienteId,
    });

    const estadisticas = {
      totalPrestamos: prestamosTodos.length,
      prestamosActivos: prestamosTodos.filter((p) => p.estado === "activo").length,
      prestamosVencidos: prestamosTodos.filter((p) => p.estado === "vencido").length,
      prestamosDesactivados: prestamosTodos.filter((p) => p.estado === "desactivado")
        .length,
      prestamosCancelados: prestamosTodos.filter((p) => p.estado === "cancelado")
        .length,
      prestamosRefinanciados: prestamosTodos.filter((p) => p.tipo === "refinanciado")
        .length,
      montoPrestadoTotal: prestamos.reduce(
        (sum, p) => sum + (p.montoInicial || 0),
        0
      ),
      totalSaldoPendiente: prestamos.reduce(
        (sum, p) => sum + (p.saldoPendiente || 0),
        0
      ),
    };

    return {
      status: 200,
      msg: "Resumen del cliente obtenido correctamente",
      data: {
        cliente,
        estadisticas,
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener el resumen del cliente: " + error.message,
      data: null,
    };
  }
};

module.exports = {
  crearClienteBD,
  obtenerClientesBD,
  obtenerClientePorIdBD,
  obtenerClientePorDNIBD,
  actualizarClienteBD,
  eliminarClienteBD,
  marcarClienteInactivoBD,
  marcarClienteActivoBD,
  repasarTiposDeClientes,
  obtenerClientesPorTipoBD,
  obtenerRazonTipoClienteBD,
  obtenerResumenClienteBD,
};
