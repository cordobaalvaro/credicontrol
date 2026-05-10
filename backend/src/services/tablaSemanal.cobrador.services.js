const TablaSemanalClientesModel = require("../models/tablaSemanalClientes.model")
const mongoose = require("mongoose")
const { populateTabla, recalcularTotales, procesarActualizacionMontos } = require("./tablaSemanal.helpers")


const guardarMontoItemTablaSemanalCobrador = async (cobradorId, tablaId, itemId, montoCobrado) => {
  try {
    const tabla = await TablaSemanalClientesModel.findOne({
      _id: tablaId,
      cobrador: cobradorId,
      estado: "enviada",
    })

    if (!tabla) {
      return { status: 404, msg: "Tabla semanal no encontrada para este cobrador o no está enviada", data: null }
    }

    const item = tabla.items.id(itemId)
    if (!item) {
      return { status: 404, msg: "Item de tabla semanal no encontrado", data: null }
    }

    if (item.estado === "cargado") {
      return { status: 400, msg: "Este item ya fue cargado y no puede editarse", data: null }
    }

    const monto = Number(montoCobrado)
    if (Number.isNaN(monto) || monto < 0) {
      return { status: 400, msg: "El monto cobrado debe ser un número mayor o igual a 0", data: null }
    }

    item.montoCobrado = monto
    item.estado = "reportado"

    await recalcularTotales(tabla)
    await tabla.save()

    const tablaPopulada = await populateTabla(TablaSemanalClientesModel.findById(tablaId))
    return { status: 200, msg: "Monto del item guardado correctamente", data: tablaPopulada }
  } catch (error) {
    return { status: 500, msg: "Error al guardar el monto del item: " + error.message, data: null }
  }
}


const obtenerUltimaTablaSemanalCobrador = async (cobradorId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(cobradorId)) {
      return { status: 400, msg: "ID de cobrador inválido", data: null }
    }

    const ultimaTabla = await populateTabla(
      TablaSemanalClientesModel.findOne({ cobrador: cobradorId, estado: { $ne: "borrador" } }).sort({ createdAt: -1 }),
    )

    if (!ultimaTabla) {
      return { status: 200, msg: "No se encontró tabla semanal para este cobrador", data: null }
    }

    return { status: 200, msg: "Última tabla semanal obtenida correctamente", data: ultimaTabla }
  } catch (error) {
    return { status: 500, msg: "Error al obtener última tabla semanal: " + error.message, data: null }
  }
}


const obtenerMisTablasSemanalCobrador = async (cobradorId, filtros = {}) => {
  try {
    const { busqueda, estado, mes } = filtros

    let query = {
      cobrador: cobradorId,
      estado: { $ne: "borrador" },
    }

    if (estado) {
      query.estado = estado
    }

    if (mes) {
      const [year, month] = mes.split("-")
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0, 23, 59, 59, 999)
      query.createdAt = { $gte: startDate, $lte: endDate }
    }

    let tablas = await populateTabla(
      TablaSemanalClientesModel.find(query).sort({ fechaInicio: -1 }),
    )

    if (busqueda && busqueda.trim()) {
      const busquedaLower = busqueda.toLowerCase()
      tablas = tablas.filter((tabla) => {
        if (tabla.cobrador) {
          const cobradorNombre = `${tabla.cobrador.nombre || ""} ${tabla.cobrador.apellido || ""}`.toLowerCase()
          if (cobradorNombre.includes(busquedaLower)) return true
        }
        const fechaInicioStr = tabla.fechaInicio ? new Date(tabla.fechaInicio).toLocaleDateString("es-AR") : ""
        if (fechaInicioStr.toLowerCase().includes(busquedaLower)) return true
        const fechaFinStr = tabla.fechaFin ? new Date(tabla.fechaFin).toLocaleDateString("es-AR") : ""
        if (fechaFinStr.toLowerCase().includes(busquedaLower)) return true
        return false
      })
    }

    return { status: 200, msg: "Tablas semanales del cobrador obtenidas correctamente", data: tablas }
  } catch (error) {
    return { status: 500, msg: "Error al obtener las tablas del cobrador: " + error.message, data: null }
  }
}


const guardarTablaSemanalMontos = async (cobradorId, tablaId, itemsMontos) => {
  try {
    const tabla = await TablaSemanalClientesModel.findOne({
      _id: tablaId,
      cobrador: cobradorId,
    })

    if (!tabla) {
      return { status: 404, msg: "Tabla semanal no encontrada para este cobrador", data: null }
    }

    if (tabla.estado !== "enviada") {
      return { status: 400, msg: "Solo se pueden guardar montos cuando la tabla está enviada", data: null }
    }

    procesarActualizacionMontos(tabla, itemsMontos, true)
    await tabla.save()

    return { status: 200, msg: "Montos de la tabla semanal guardados correctamente", data: tabla }
  } catch (error) {
    return { status: 500, msg: "Error al guardar los montos de la tabla semanal: " + error.message, data: null }
  }
}

const rendirJornadaCobrador = async (cobradorId, tablaId, observaciones = "") => {
  try {
    const tabla = await TablaSemanalClientesModel.findOne({
      _id: tablaId,
      cobrador: cobradorId,
      estado: "enviada",
    })

    if (!tabla) {
      return { status: 404, msg: "Tabla semanal no encontrada o no está en estado para rendir", data: null }
    }

    const itemsConMonto = tabla.items.filter((it) => (it.montoCobrado || 0) > 0)
    if (itemsConMonto.length === 0) {
      return { status: 400, msg: "No hay cobros registrados para rendir en esta jornada", data: null }
    }

    const nuevaRendicion = {
      fechaRendicion: new Date(),
      estado: "reportada",
      observaciones,
      items: itemsConMonto.map((it) => {
        // El esperado que ve el cobrador en su dashboard es la suma de:
        // 1. Las cuotas de la semana (o el esperado del item si no hay cuotasSemana)
        // 2. La deuda arrastrada de semanas anteriores
        const montoEsperadoSemanaBase = (it.cuotasSemana && it.cuotasSemana.length > 0)
          ? it.cuotasSemana.reduce((sum, c) => sum + (c.monto || 0), 0)
          : (it.montoCuotasEsperadoSemana || 0);
        
        // Sumamos la deuda arrastrada para que el "Valor Cuota" en el reporte sea el total que se esperaba cobrar
        const esperadoTotalItem = montoEsperadoSemanaBase + (it.deudaArrastrada || 0);

        return {
          prestamo: it.prestamo,
          cliente: it.cliente,
          montoCobrado: it.montoCobrado,
          montoCuotasEsperadoSemana: esperadoTotalItem,
          saldoPendiente: it.saldoPendiente, // Saldo del préstamo al inicio de la semana
          itemIdOriginal: it._id,
        }
      }),
    }

    if (!tabla.rendiciones) tabla.rendiciones = []
    tabla.rendiciones.push(nuevaRendicion)

    // Resetear montos en la tabla principal para que el cobrador pueda seguir cobrando
    tabla.items.forEach((it) => {
      if ((it.montoCobrado || 0) > 0) {
        it.montoCobrado = 0
        it.estado = "enviado"
      }
    })

    await recalcularTotales(tabla)
    await tabla.save()

    const tablaPopulada = await populateTabla(TablaSemanalClientesModel.findById(tablaId))
    return { status: 200, msg: "Jornada rendida correctamente. Los cobros han sido enviados al administrador.", data: tablaPopulada }
  } catch (error) {
    return { status: 500, msg: "Error al rendir la jornada: " + error.message, data: null }
  }
}

module.exports = {
  guardarMontoItemTablaSemanalCobrador,
  obtenerUltimaTablaSemanalCobrador,
  obtenerMisTablasSemanalCobrador,
  guardarTablaSemanalMontos,
  rendirJornadaCobrador,
}
