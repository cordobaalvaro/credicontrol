const PrestamoModel = require("../models/prestamo.model");
const UsuarioModel = require("../models/usuario.model");
const { crearNotificacion } = require("./notificaciones.services");

const procesarCobroBD = async (
  prestamoId,
  monto,
  adminId,
  fechaPago = null
) => {
  try {
    if (!prestamoId || !monto || !adminId) {
      return {
        status: 400,
        msg: "Faltan campos obligatorios: prestamoId, monto, adminId",
        data: null,
      };
    }

    const admin = await UsuarioModel.findById(adminId);
    if (!admin || admin.rol !== "admin") {
      return {
        status: 403,
        msg: "Solo los administradores pueden procesar cobros",
        data: null,
      };
    }

    const prestamo = await PrestamoModel.findById(prestamoId).populate(
      "cliente",
      "nombre dni"
    );
    if (!prestamo) {
      return {
        status: 404,
        msg: "Préstamo no encontrado",
        data: null,
      };
    }

    const montoNumerico = parseFloat(monto);
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      return {
        status: 400,
        msg: "El monto debe ser un número positivo",
        data: null,
      };
    }

    let cuotasAfectadas = [];
    let montoRestante = montoNumerico;
    let cuotaPrincipal = null;
    const estadoAnteriorPrestamo = prestamo.estado;
    for (const cuota of prestamo.planDeCuotas) {
      if (cuota.estado === "completo") continue;
      if (!cuotaPrincipal) cuotaPrincipal = cuota;
      const totalCobrado = cuota.pagado || 0;
      const montoFaltante = cuota.monto - totalCobrado;
      if (montoFaltante > 0) {
        const montoParaEstaCuota = Math.min(montoRestante, montoFaltante);
        cuota.pagado = totalCobrado + montoParaEstaCuota;
        const estadoAnterior = cuota.estado;
        if (cuota.pagado >= cuota.monto) {
          cuota.estado = "completo";
        } else {
          cuota.estado = "cobrado";
        }
        cuotasAfectadas.push({
          numero: cuota.numero,
          montoCobrado: montoParaEstaCuota,
          estadoAnterior,
          estadoNuevo: cuota.estado,
        });
        montoRestante -= montoParaEstaCuota;
        if (montoRestante <= 0) break;
      }
    }

    prestamo.saldoPendiente = Math.max(
      0,
      prestamo.saldoPendiente - montoNumerico
    );

    const esVencido = prestamo.estado === "vencido";
    if (esVencido && prestamo.saldoPendienteVencimiento > 0) {
      prestamo.saldoPendienteVencimiento = Math.max(
        0,
        prestamo.saldoPendienteVencimiento - montoNumerico
      );
    }

    let prestamoCancelado = false;
    let todasLasCuotasCompletas = false;
    if (esVencido) {
        if (prestamo.saldoPendienteVencimiento <= 0) {
        prestamo.estado = "cancelado";
        prestamoCancelado = true;
      }
        } else {
        todasLasCuotasCompletas = prestamo.planDeCuotas.every(
        (c) => c.estado === "completo"
      );
      if (todasLasCuotasCompletas) {
        prestamo.estado = "cancelado";
        prestamoCancelado = true;
      }
    }

    let fechaRegistro;
    if (fechaPago) {
      if (typeof fechaPago === "string" && fechaPago.length === 10 && fechaPago.includes("-")) {
          const [year, month, day] = fechaPago.split("-");
          fechaRegistro = new Date(year, month - 1, day, 12, 0, 0);
      } else {
          fechaRegistro = new Date(fechaPago);
      }
    } else {
        fechaRegistro = new Date();
    }

    const registroCobro = {
      monto: montoNumerico,
      fechaPago: fechaRegistro,
    };
    prestamo.registroCobros.push(registroCobro);

    if (prestamo.estado === "cancelado" && estadoAnteriorPrestamo !== "cancelado") {
      prestamo.fechaCancelacion = fechaRegistro;
    }
    if (prestamo.estado !== "cancelado" && estadoAnteriorPrestamo === "cancelado") {
      prestamo.fechaCancelacion = null;
    }

    await prestamo.save();

    if (prestamoCancelado) {
      try {
        await crearNotificacion({
          tipo: "prestamo_cancelado",
          mensaje: `El préstamo #${prestamo.numero || prestamo._id} (${prestamo.nombre || ""
            }) ha sido cancelado (pagado completamente).`,
          prestamo: prestamo._id,
          cliente: prestamo.cliente?._id || prestamo.cliente,
          metadata: {
            prestamoId: prestamo._id,
            clienteId: prestamo.cliente?._id || prestamo.cliente,
            nombrePrestamo: prestamo.nombre,
            numeroPrestamo: prestamo.numero,
          },
        });
      } catch (notifErr) {
        console.error(
          "Error al crear notificación de préstamo cancelado:",
          notifErr
        );
      }
    }

    return {
      status: 200,
      msg: "Cobro procesado correctamente",
      data: {
        prestamo: {
          _id: prestamo._id,
          cliente: prestamo.cliente,
          montoInicial: prestamo.montoInicial,
          saldoPendiente: prestamo.saldoPendiente,
          estado: prestamo.estado,
        },
        cuotaPrincipal: cuotaPrincipal
          ? {
            numero: cuotaPrincipal.numero,
            monto: cuotaPrincipal.monto,
            totalCobrado: cuotaPrincipal.pagado,
            estado: cuotaPrincipal.estado,
          }
          : null,
        cuotasAfectadas,
        resumen: {
          montoTotalProcesado: montoNumerico,
          nuevoSaldoPendiente: prestamo.saldoPendiente,
          prestamoCompletado: todasLasCuotasCompletas,
          cuotasCompletadas: cuotasAfectadas.filter(
            (c) => c.estadoNuevo === "completo"
          ).length,
          montoSobrante: montoRestante,
        },
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error interno al procesar el cobro",
      data: null,
    };
  }
};

const eliminarCobroBD = async (prestamoId, cobroId) => {
  try {
    if (!prestamoId || !cobroId) {
      return {
        status: 400,
        msg: "PrestamoId y cobroId son requeridos",
        data: null,
      };
    }

    const prestamo = await PrestamoModel.findById(prestamoId);
    if (!prestamo) {
      return {
        status: 404,
        msg: "Préstamo no encontrado",
        data: null,
      };
    }

    const estadoAnteriorPrestamo = prestamo.estado;

    let cobroEncontrado = null;
    let cuotaPadre = null;

    for (const cuota of prestamo.planDeCuotas) {
      const cobro = cuota.cobros.id(cobroId);
      if (cobro) {
        cobroEncontrado = cobro;
        cuotaPadre = cuota;
        break;
      }
    }

    if (!cobroEncontrado) {
      return {
        status: 404,
        msg: "Cobro no encontrado en el préstamo",
        data: null,
      };
    }

    const montoCobro = cobroEncontrado.cobro || 0;

    cobroEncontrado.deleteOne();

    const totalCobradoCuota = cuotaPadre.cobros.reduce(
      (sum, cobro) => sum + (cobro.cobro || 0),
      0
    );

    if (totalCobradoCuota >= cuotaPadre.monto) {
      cuotaPadre.estado = "completo";
    } else if (totalCobradoCuota > 0) {
      cuotaPadre.estado = "cobrado";
    } else {
      cuotaPadre.estado = "pendiente";
    }

    const totalCobradoPrestamo = prestamo.planDeCuotas.reduce((sum, cuota) => {
      return (
        sum +
        cuota.cobros.reduce(
          (sumCobros, cobro) => sumCobros + (cobro.cobro || 0),
          0
        )
      );
    }, 0);

    prestamo.saldoPendiente = Math.max(
      0,
      prestamo.montoTotal - totalCobradoPrestamo
    );

    const todasLasCuotasCompletas = prestamo.planDeCuotas.every(
      (c) => c.estado === "completo"
    );

    if (todasLasCuotasCompletas) {
      prestamo.estado = "cancelado";
    } else {
      prestamo.estado = "activo";
    }

    await prestamo.save();

    return {
      status: 200,
      msg: "Cobro eliminado correctamente",
      data: {
        montoEliminado: montoCobro,
        saldoPendiente: prestamo.saldoPendiente,
        cuota: cuotaPadre.numero,
        estadoCuota: cuotaPadre.estado,
        estadoPrestamo: prestamo.estado,
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error interno al eliminar el cobro",
      data: null,
    };
  }
};

const editarRegistroCobroBD = async (
  prestamoId,
  registroId,
  monto,
  fecha,
  horaPago,
  cuota
) => {
  try {
    if (!prestamoId || !registroId) {
      return {
        status: 400,
        msg: "PrestamoId y registroId son requeridos",
        data: null,
      };
    }

    const prestamo = await PrestamoModel.findById(prestamoId);
    if (!prestamo) {
      return {
        status: 404,
        msg: "Préstamo no encontrado",
        data: null,
      };
    }

    const registroEncontrado = prestamo.registroCobros.id(registroId);
    if (!registroEncontrado) {
      return {
        status: 404,
        msg: "Registro de cobro no encontrado",
        data: null,
      };
    }

    prestamo.planDeCuotas.forEach((cuota) => {
      cuota.pagado = 0;
      cuota.estado = "pendiente";
    });

    if (monto !== undefined) registroEncontrado.monto = parseFloat(monto);
    if (fecha !== undefined) {
      if (typeof fecha === "string" && fecha.length === 10 && fecha.includes("-")) {
          const [year, month, day] = fecha.split("-");
          registroEncontrado.fechaPago = new Date(year, month - 1, day, 12, 0, 0);
      } else {
          registroEncontrado.fechaPago = new Date(fecha);
      }
    }
    if (horaPago !== undefined) registroEncontrado.horaPago = horaPago;
    if (cuota !== undefined) registroEncontrado.cuota = parseInt(cuota);

    const registrosOrdenados = prestamo.registroCobros
      .toObject()
      .sort((a, b) => new Date(a.fechaPago) - new Date(b.fechaPago));

    for (const reg of registrosOrdenados) {
      let montoRestante = reg.monto;
      for (const cuota of prestamo.planDeCuotas) {
        if (cuota.estado === "completo") continue;
        const faltante = cuota.monto - cuota.pagado;
        if (faltante <= 0) continue;
        const aplicar = Math.min(montoRestante, faltante);
        cuota.pagado += aplicar;
        if (cuota.pagado >= cuota.monto) {
          cuota.estado = "completo";
        } else if (cuota.pagado > 0) {
          cuota.estado = "cobrado";
        }
        montoRestante -= aplicar;
        if (montoRestante <= 0) break;
      }
    }

    const totalPagado = prestamo.planDeCuotas.reduce(
      (sum, c) => sum + (c.pagado || 0),
      0
    );

    const nuevoSaldoPendiente = Math.max(0, prestamo.montoTotal - totalPagado);

    const esVencido = prestamo.estado === "vencido";
    if (esVencido && prestamo.saldoPendienteVencimiento > 0) {
      const saldoPendienteAnterior = prestamo.saldoPendiente || 0;
      const diferencia = saldoPendienteAnterior - nuevoSaldoPendiente;
      prestamo.saldoPendienteVencimiento = Math.max(
        0,
        prestamo.saldoPendienteVencimiento - diferencia
      );
    }

    prestamo.saldoPendiente = nuevoSaldoPendiente;

    if (esVencido) {
        if (prestamo.saldoPendienteVencimiento <= 0) {
        prestamo.estado = "cancelado";
      }
      } else {
        const todasCompletas = prestamo.planDeCuotas.every(
        (c) => c.estado === "completo"
      );
      if (todasCompletas) {
        prestamo.estado = "cancelado";
      } else if (prestamo.saldoPendiente < prestamo.montoTotal) {
        prestamo.estado = "activo";
      } else {
        prestamo.estado = "pendiente";
      }
    }

    if (estadoAnteriorPrestamo === "cancelado" && prestamo.estado !== "cancelado") {
      prestamo.fechaCancelacion = null;
    }

    if (estadoAnteriorPrestamo !== "cancelado" && prestamo.estado === "cancelado") {
      prestamo.fechaCancelacion = new Date();
    }

    await prestamo.save();

    return {
      status: 200,
      msg: "Registro de cobro actualizado y cuotas recalculadas correctamente",
      data: {
        registro: registroEncontrado,
        prestamo: prestamoId,
        cuotas: prestamo.planDeCuotas,
        saldoPendiente: prestamo.saldoPendiente,
        estadoPrestamo: prestamo.estado,
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error interno al editar el registro de cobro",
      data: null,
    };
  }
};

const eliminarRegistroCobroBD = async (prestamoId, registroId) => {
  try {
    if (!prestamoId || !registroId) {
      return {
        status: 400,
        msg: "PrestamoId y registroId son requeridos",
        data: null,
      };
    }

    const prestamo = await PrestamoModel.findById(prestamoId);
    if (!prestamo) {
      return {
        status: 404,
        msg: "Préstamo no encontrado",
        data: null,
      };
    }

    const registroEncontrado = prestamo.registroCobros.id(registroId);
    if (!registroEncontrado) {
      return {
        status: 404,
        msg: "Registro de cobro no encontrado",
        data: null,
      };
    }

    const montoEliminado = registroEncontrado.monto;

    registroEncontrado.deleteOne();

    prestamo.planDeCuotas.forEach((cuota) => {
      cuota.pagado = 0;
      cuota.estado = "pendiente";
    });

    const registrosOrdenados = prestamo.registroCobros
      .toObject()
      .sort((a, b) => new Date(a.fechaPago) - new Date(b.fechaPago));

    for (const reg of registrosOrdenados) {
      let montoRestante = reg.monto;
      for (const cuota of prestamo.planDeCuotas) {
        if (cuota.estado === "completo") continue;
        const faltante = cuota.monto - cuota.pagado;
        if (faltante <= 0) continue;
        const aplicar = Math.min(montoRestante, faltante);
        cuota.pagado += aplicar;
        if (cuota.pagado >= cuota.monto) {
          cuota.estado = "completo";
        } else if (cuota.pagado > 0) {
          cuota.estado = "cobrado";
        }
        montoRestante -= aplicar;
        if (montoRestante <= 0) break;
      }
    }

    const totalPagado = prestamo.planDeCuotas.reduce(
      (sum, c) => sum + (c.pagado || 0),
      0
    );

    const nuevoSaldoPendiente = Math.max(0, prestamo.montoTotal - totalPagado);

    const esVencido = prestamo.estado === "vencido";
    if (esVencido && prestamo.saldoPendienteVencimiento > 0) {
      const saldoPendienteAnterior = prestamo.saldoPendiente || 0;
      const diferencia = saldoPendienteAnterior - nuevoSaldoPendiente;
      prestamo.saldoPendienteVencimiento = Math.max(
        0,
        prestamo.saldoPendienteVencimiento - diferencia
      );
    }

    if (esVencido) {
      if (prestamo.saldoPendienteVencimiento <= 0) {
        prestamo.estado = "cancelado";
      }
    } else {
      const todasCompletas = prestamo.planDeCuotas.every((c) => c.estado === "completo");
      if (todasCompletas) {
        prestamo.estado = "cancelado";
      } else if (prestamo.saldoPendiente < prestamo.montoTotal) {
        prestamo.estado = "activo";
      }
    }

    await prestamo.save();

    return {
      status: 200,
      msg: "Registro de cobro eliminado y cuotas recalculadas correctamente",
      data: {
        montoEliminado: montoEliminado,
        prestamo: prestamoId,
        cuotas: prestamo.planDeCuotas,
        saldoPendiente: prestamo.saldoPendiente,
        estadoPrestamo: prestamo.estado,
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error interno al eliminar el registro de cobro",
      data: null,
    };
  }
};


const crearRegistroCobroBD = async (prestamoId, monto, fecha) => {
  try {
    if (!prestamoId || !monto) {
      return {
        status: 400,
        msg: "PrestamoId y monto son requeridos",
        data: null,
      };
    }

    const prestamo = await PrestamoModel.findById(prestamoId);
    if (!prestamo) {
      return {
        status: 404,
        msg: "Préstamo no encontrado",
        data: null,
      };
    }

    const montoNumerico = parseFloat(monto);
    if (montoNumerico <= 0) {
      return {
        status: 400,
        msg: "El monto debe ser mayor a 0",
        data: null,
      };
    }

    let fechaRegistro;
    if (fecha) {
      if (typeof fecha === "string" && fecha.length === 10 && fecha.includes("-")) {
          const [year, month, day] = fecha.split("-");
          fechaRegistro = new Date(year, month - 1, day, 12, 0, 0);
      } else {
          fechaRegistro = new Date(fecha);
      }
    } else {
        fechaRegistro = new Date();
    }

    const registroCobro = {
      monto: montoNumerico,
      fechaPago: fechaRegistro,
    };

    prestamo.registroCobros.push(registroCobro);

    let montoRestante = montoNumerico;
    let cuotasAfectadas = [];

    const cuotasPendientes = prestamo.planDeCuotas
      .filter((cuota) => cuota.estado !== "completo")
      .sort((a, b) => a.numero - b.numero);

    for (const cuota of cuotasPendientes) {
      if (montoRestante <= 0) break;

      const totalCobradoCuota = cuota.pagado || 0;
      const montoFaltante = cuota.monto - totalCobradoCuota;

      if (montoFaltante > 0) {
        const montoParaEstaCuota = Math.min(montoRestante, montoFaltante);

        cuota.pagado = totalCobradoCuota + montoParaEstaCuota;

        const nuevoTotalCuota = totalCobradoCuota + montoParaEstaCuota;
        const estadoAnterior = cuota.estado;
        if (nuevoTotalCuota >= cuota.monto) {
          cuota.estado = "completo";
        } else {
          cuota.estado = "cobrado";
        }

        cuotasAfectadas.push({
          numero: cuota.numero,
          montoCobrado: montoParaEstaCuota,
          estadoAnterior: estadoAnterior,
          estadoNuevo: cuota.estado,
        });

        montoRestante -= montoParaEstaCuota;
      }
    }

    const esVencido = prestamo.estado === "vencido";
    if (esVencido && prestamo.saldoPendienteVencimiento > 0) {
      prestamo.saldoPendienteVencimiento = Math.max(
        0,
        prestamo.saldoPendienteVencimiento - montoNumerico
      );
    }

    if (esVencido) {
      if (prestamo.saldoPendienteVencimiento <= 0) {
        prestamo.estado = "cancelado";
      }
    } else {
      const todasLasCuotasCompletas = prestamo.planDeCuotas.every((c) => c.estado === "completo");
      if (todasLasCuotasCompletas) {
        prestamo.estado = "cancelado";
      } else if (prestamo.saldoPendiente < prestamo.montoTotal) {
        prestamo.estado = "activo";
      }
    }

    await prestamo.save();

    return {
      status: 200,
      msg: "Registro de cobro creado y aplicado correctamente",
      data: {
        registroCreado: registroCobro,
        prestamo: prestamoId,
        montoAplicado: montoNumerico,
        montoSobrante: montoRestante,
        saldoPendiente: prestamo.saldoPendiente,
        estadoPrestamo: prestamo.estado,
        cuotasAfectadas: cuotasAfectadas,
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error interno al crear el registro de cobro",
      data: null,
    };
  }
};



module.exports = {
  procesarCobroBD,
  eliminarCobroBD,
  editarRegistroCobroBD,
  eliminarRegistroCobroBD,
  crearRegistroCobroBD,
};
