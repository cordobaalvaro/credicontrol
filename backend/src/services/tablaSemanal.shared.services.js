const TablaSemanalClientesModel = require("../models/tablaSemanalClientes.model")
const PrestamoModel = require("../models/prestamo.model")
const mongoose = require("mongoose")
const { populateTabla, recalcularTotales } = require("./tablaSemanal.helpers")


const obtenerTablaSemanal = async (tablaId) => {
  try {
    const tabla = await populateTabla(TablaSemanalClientesModel.findById(tablaId))

    if (!tabla) {
      return { status: 404, msg: "Tabla semanal no encontrada", data: null }
    }

    const tablaPlana = tabla.toObject ? tabla.toObject() : tabla

    // Si los nuevos campos de totales esperados están en 0, recalculamos (para arreglar datos viejos)
    if ((tabla.montoTotalEsperadoActivos === 0 && tabla.montoTotalEsperadoVencidos === 0) && tabla.montoTotalEsperado > 0) {
      await recalcularTotales(tabla);
      await tabla.save();
    }

    return { status: 200, msg: "Tabla semanal obtenida correctamente", data: tabla }
  } catch (error) {
    return { status: 500, msg: "Error al obtener la tabla semanal: " + error.message, data: null }
  }
}


const cerrarTablaSemanal = async (userId, tablaId, rol) => {
  try {
    const query = { _id: tablaId }

    if (rol === "cobrador") {
      query.cobrador = userId
      query.estado = "enviada"
    }

    const tabla = await TablaSemanalClientesModel.findOne(query)

    if (!tabla) {
      const msg = rol === "cobrador"
        ? "Tabla semanal no encontrada para este cobrador o no está enviada"
        : "Tabla semanal no encontrada"
      return { status: 404, msg, data: null }
    }

    if (!tabla.items?.length) {
      return { status: 400, msg: "La tabla no tiene items para cerrar", data: null }
    }

    const faltantes = tabla.items.filter((it) => !["reportado", "cargado"].includes(it.estado))
    if (faltantes.length) {
      return { status: 400, msg: "No se puede cerrar la tabla: faltan items por completar", data: null }
    }

    tabla.estado = "cerrada"
    await tabla.save()

    const tablaPopulada = await populateTabla(TablaSemanalClientesModel.findById(tablaId))
    return { status: 200, msg: "Tabla semanal cerrada correctamente", data: tablaPopulada }
  } catch (error) {
    return { status: 500, msg: "Error al cerrar la tabla semanal: " + error.message, data: null }
  }
}


const obtenerPlanDeCuotasPrestamo = async ({ prestamoId }) => {
  try {
    if (!prestamoId) {
      return { status: 400, msg: "El ID del préstamo es requerido", data: null }
    }

    if (!mongoose.Types.ObjectId.isValid(prestamoId)) {
      return { status: 400, msg: "ID de préstamo inválido", data: null }
    }

    const prestamo = await PrestamoModel.findById(prestamoId).populate("cliente")
    if (!prestamo) {
      return { status: 404, msg: "Préstamo no encontrado", data: null }
    }

    const planDeCuotasConPendientes = prestamo.planDeCuotas.map((cuota) => {
      const montoTotal = cuota.monto
      const montoCobrado = cuota.pagado || 0
      const montoPendiente = Math.max(0, montoTotal - montoCobrado)

      let estadoReal = cuota.estado
      if (montoCobrado >= montoTotal) {
        estadoReal = "completo"
      } else if (montoCobrado > 0) {
        estadoReal = "cobrado"
      } else {
        estadoReal = "pendiente"
      }

      return {
        _id: cuota._id,
        numero: cuota.numero,
        fechaVencimiento: cuota.fechaVencimiento,
        monto: montoTotal,
        montoCobrado,
        montoPendiente,
        estado: cuota.estado,
        estadoReal,
        porcentajePagado: montoTotal > 0 ? Math.round((montoCobrado / montoTotal) * 100) : 0,
      }
    })

    const resumen = {
      totalMonto: planDeCuotasConPendientes.reduce((sum, c) => sum + c.monto, 0),
      totalCobrado: planDeCuotasConPendientes.reduce((sum, c) => sum + c.montoCobrado, 0),
      totalPendiente: planDeCuotasConPendientes.reduce((sum, c) => sum + c.montoPendiente, 0),
      cuotasTotales: planDeCuotasConPendientes.length,
      cuotasCompletas: planDeCuotasConPendientes.filter((c) => c.estadoReal === "completo").length,
      cuotasParciales: planDeCuotasConPendientes.filter((c) => c.estadoReal === "cobrado").length,
      cuotasPendientes: planDeCuotasConPendientes.filter((c) => c.estadoReal === "pendiente").length,
    }

    return {
      status: 200,
      msg: "Plan de cuotas obtenido exitosamente",
      data: {
        prestamo: {
          _id: prestamo._id,
          numero: prestamo.numero,
          nombre: prestamo.nombre,
          cliente: prestamo.cliente,
          montoTotal: prestamo.montoTotal,
          saldoPendiente: prestamo.saldoPendiente,
          estado: prestamo.estado,
          fechaInicio: prestamo.fechaInicio,
          cantidadCuotas: prestamo.cantidadCuotas,
        },
        planDeCuotas: planDeCuotasConPendientes,
        resumen,
      },
    }
  } catch (error) {
    console.error("Error al obtener plan de cuotas del préstamo:", error)
    return { status: 500, msg: "Error interno del servidor al obtener el plan de cuotas", data: null }
  }
}

module.exports = {
  obtenerTablaSemanal,
  cerrarTablaSemanal,
  obtenerPlanDeCuotasPrestamo,
}
