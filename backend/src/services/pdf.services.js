const ClienteModel = require("../models/cliente.model");
const PrestamoModel = require("../models/prestamo.model");

const resumenClientePDFBD = async (clienteId) => {
  try {
    const cliente = await ClienteModel.findById(clienteId)
      .populate("zona", "nombre");

    if (!cliente) {
      return {
        status: 404,
        msg: "Cliente no encontrado",
        data: null,
      };
    }

    const prestamos = await PrestamoModel.find({
      cliente: clienteId,
    });

    const prestamosResumen = prestamos.map((prestamo) => {
      const prestamoBase = {
        numero: prestamo.numero,
        nombre: prestamo.nombre,
        tipo: prestamo.tipo,
        montoInicial: prestamo.montoInicial,
        montoTotal: prestamo.montoTotal,
        saldoPendiente: prestamo.saldoPendiente,
        estadoPrestamo: prestamo.estado,
      };

      if (prestamo.estado === "vencido") {
        prestamoBase.saldoPendienteVencimiento = prestamo.saldoPendienteVencimiento || 0;
        prestamoBase.interesSemanal = prestamo.interesSemanal || 0;
        prestamoBase.semanasVencidas = prestamo.semanasVencidas || 0;
      } else {
        prestamoBase.saldoPendienteVencimiento = null;
        prestamoBase.interesSemanal = null;
        prestamoBase.semanasVencidas = null;
      }

      return prestamoBase;
    });

    const normalizarTipoPrestamo = (tipo) =>
      (tipo || "nuevo").toString().trim().toLowerCase();

    const estadisticas = {
      totalPrestamos: prestamos.length,
      prestamosActivos: prestamos.filter((p) => p.estado === "activo").length,
      prestamosVencidos: prestamos.filter((p) => p.estado === "vencido").length,
      prestamosDesactivados: prestamos.filter((p) => p.estado === "desactivado").length,
      prestamosCancelados: prestamos.filter((p) => p.estado === "cancelado").length,
      prestamosCompletados: prestamos.filter((p) => p.estado === "completado").length,
      prestamosRefinanciados: prestamos.filter(
        (p) => normalizarTipoPrestamo(p.tipo) === "refinanciado"
      ).length,
      montoPrestadoTotal: prestamos
        .filter((p) => normalizarTipoPrestamo(p.tipo) !== "refinanciado")
        .reduce((sum, p) => sum + (p.montoInicial || 0), 0),
      totalMontoTotal: prestamos.reduce((sum, p) => sum + (p.montoTotal || 0), 0),
      totalSaldoPendiente: prestamos
        .filter((p) => p.estado !== "desactivado")
        .reduce((sum, p) => {
          if (p.estado === "vencido") {
            return sum + (p.saldoPendienteVencimiento || p.saldoPendiente || 0);
          }
          return sum + (p.saldoPendiente || 0);
        }, 0),
      totalPagado: prestamos.reduce((sum, p) => {
        const pagado = (p.montoTotal || 0) - (p.saldoPendiente || 0);
        return sum + pagado;
      }, 0),
    };

    const resumen = {
      cliente: {
        numero: cliente.numero,
        nombre: cliente.nombre,
        dni: cliente.dni,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
        tipo: cliente.tipo,
        zona: cliente.zona,
      },
      prestamos: prestamosResumen,
      estadisticas,
    };

    return {
      status: 200,
      msg: "Resumen del cliente obtenido exitosamente",
      data: resumen,
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error al obtener el resumen del cliente: " + error.message,
      data: null,
    };
  }
};

const obtenerReporteCobrosPrestamosPDFBD = async (prestamoId) => {
  try {
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

    const prestamoData = {
      id: prestamo._id,
      numero: prestamo.numero,
      nombre: prestamo.nombre,
      estado: prestamo.estado,
      tipo: prestamo.tipo,
      montoPrestado: prestamo.montoInicial || prestamo.montoPrestado || 0,
      montoInicial: prestamo.montoInicial || 0,
      monto: prestamo.montoTotal || 0,
      montoTotal: prestamo.montoTotal || 0,
      montoCuota: prestamo.montoCuota || (prestamo.planDeCuotas && prestamo.planDeCuotas.length > 0 ? prestamo.planDeCuotas[0].monto : null),
      saldoPendiente: prestamo.saldoPendiente || 0,
      cantidadCuotas: prestamo.cantidadCuotas || 0,
      tipoPrestamo: prestamo.tipoPrestamo || "DIARIO",
      cliente: {
        nombre: prestamo.cliente?.nombre || "N/A",
        dni: prestamo.cliente?.dni || "N/A",
      },
      planDeCuotas: (prestamo.planDeCuotas || []).map((cuota) => ({
        numero: cuota.numero,
        monto: cuota.monto,
        montoCuota: cuota.monto,
        importe: cuota.monto,
        fechaVencimiento: cuota.fechaVencimiento,
        estado: cuota.estado,
      })),
    };

    if (prestamo.estado === "vencido") {
      prestamoData.saldoPendienteVencimiento =
        prestamo.saldoPendienteVencimiento || 0;
      prestamoData.interesSemanal = prestamo.interesSemanal || 0;
      prestamoData.semanasVencidas = prestamo.semanasVencidas || 0;
    } else {
      prestamoData.saldoPendienteVencimiento = null;
      prestamoData.interesSemanal = null;
      prestamoData.semanasVencidas = null;
    }

    const registrosCobros = (prestamo.registroCobros || [])
      .map((registro) => ({
        id: registro._id,
        monto: registro.monto,
        fechaPago: registro.fechaPago,
        metodoPago: registro.metodoPago || null,
        observaciones: registro.observaciones || null,
      }))
      .sort((a, b) => new Date(b.fechaPago) - new Date(a.fechaPago));

    const totalCobrado = registrosCobros.reduce(
      (sum, registro) => sum + (registro.monto || 0),
      0
    );

    const progresoCompletado =
      prestamo.montoTotal > 0
        ? ((totalCobrado / prestamo.montoTotal) * 100).toFixed(2)
        : 0;

    let saldoPendienteActual;
    if (prestamo.estado === "vencido") {
      saldoPendienteActual = Math.max(
        0,
        (prestamo.saldoPendienteVencimiento || prestamo.saldoPendiente) -
        totalCobrado
      );
    } else {
      saldoPendienteActual = Math.max(0, prestamo.montoTotal - totalCobrado);
    }

    const estadisticas = {
      totalRegistros: registrosCobros.length,
      totalCobrado,
      progresoCompletado: parseFloat(progresoCompletado),
      saldoPendienteActual,
    };

    return {
      status: 200,
      msg: "Reporte de cobros obtenido correctamente",
      data: {
        prestamo: prestamoData,
        registrosCobros,
        estadisticas,
      },
    };
  } catch (error) {
    return {
      status: 500,
      msg: "Error interno al obtener el reporte de cobros",
      data: null,
    };
  }
};

module.exports = {
  resumenClientePDFBD,
  obtenerReporteCobrosPrestamosPDFBD,
};
