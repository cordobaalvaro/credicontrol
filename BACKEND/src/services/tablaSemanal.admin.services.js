const TablaSemanalClientesModel = require("../models/tablaSemanalClientes.model")
const PrestamoModel = require("../models/prestamo.model")
const ZonaModel = require("../models/zona.model")
const ClienteModel = require("../models/cliente.model")
const UsuarioModel = require("../models/usuario.model")
const { procesarCobroBD } = require("./admin.services")
const { populateTabla, recalcularTotales, procesarActualizacionMontos } = require("./tablaSemanal.helpers")
const { obtenerPlanDeCuotasPrestamo } = require("./tablaSemanal.shared.services")
const mongoose = require("mongoose")

const generarTablaSemanalAdmin = async ({ cobradorId, fechaInicio, fechaFin, adminId }) => {
  try {
    const inicio = new Date(`${fechaInicio}T00:00:00`)
    const fin = new Date(`${fechaFin}T23:59:59`)

    if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) {
      return { status: 400, msg: "Fechas inválidas para generar la tabla semanal", data: null }
    }

    if (inicio > fin) {
      return { status: 400, msg: "La fecha de inicio no puede ser mayor que la fecha de fin", data: null }
    }

    if (inicio.getDay() !== 1) {
      return { status: 400, msg: "La fecha de inicio debe ser un lunes", data: null }
    }

    const finEsperado = new Date(inicio)
    finEsperado.setDate(finEsperado.getDate() + 6)
    finEsperado.setHours(23, 59, 59, 999)
    if (
      fin.getFullYear() !== finEsperado.getFullYear() ||
      fin.getMonth() !== finEsperado.getMonth() ||
      fin.getDate() !== finEsperado.getDate()
    ) {
      return { status: 400, msg: "El período debe ser semanal (7 días): lunes a domingo", data: null }
    }

    const zonasCobrador = await ZonaModel.find({ cobrador: cobradorId }, { _id: 1 })
    if (!zonasCobrador || zonasCobrador.length === 0) {
      return { status: 200, msg: "El cobrador no tiene zonas asignadas, no hay datos para generar la tabla", data: null }
    }

    const zonaIds = zonasCobrador.map((z) => z._id)
    const clientesZona = await ClienteModel.find(
      { zona: { $in: zonaIds }, estado: "activo" },
      { _id: 1, zona: 1 },
    )

    if (!clientesZona || clientesZona.length === 0) {
      return { status: 200, msg: "No hay clientes activos en las zonas del cobrador para el periodo seleccionado", data: null }
    }

    const clienteIds = clientesZona.map((c) => c._id)
    const clienteZonaMap = new Map(clientesZona.map((c) => [String(c._id), c.zona]))

    const prestamos = await PrestamoModel.find({
      cliente: { $in: clienteIds },
      estado: { $in: ["activo", "vencido"] },
    }).select("cliente estado planDeCuotas montoTotal saldoPendiente saldoPendienteVencimiento")

    const items = []

    for (const prestamo of prestamos) {
      const cuotasSemana = (prestamo.planDeCuotas || []).filter((cuota) => {
        const fv = new Date(cuota.fechaVencimiento)
        return fv >= inicio && fv <= fin && (cuota.estado === "pendiente" || cuota.estado === "cobrado")
      })

      if (!cuotasSemana.length) continue

      const zonaItem = clienteZonaMap.get(String(prestamo.cliente))
      if (!zonaItem) continue

      let montoCuotasEsperadoSemana
      if (prestamo.estado === "vencido") {
        montoCuotasEsperadoSemana = prestamo.saldoPendienteVencimiento || 0
      } else {
        montoCuotasEsperadoSemana = cuotasSemana.reduce((sum, c) => {
          return sum + ((c.monto || 0) - (c.pagado || 0))
        }, 0)
      }

      items.push({
        prestamo: prestamo._id,
        cliente: prestamo.cliente,
        zona: zonaItem,
        cobrador: cobradorId,
        cuotasSemana: cuotasSemana.map((c) => ({
          numero: c.numero,
          fechaVencimiento: c.fechaVencimiento,
          monto: (c.monto || 0) - (c.pagado || 0),
        })),
        montoCuotasEsperadoSemana,
        montoTotalPrestamo: prestamo.montoTotal || 0,
        saldoPendiente: (prestamo.saldoPendiente ?? prestamo.montoTotal) || 0,
        saldoPendienteVencimiento: prestamo.saldoPendienteVencimiento ?? null,
        montoCobrado: 0,
        deudaArrastrada: 0,
        estado: "pendiente",
      })
    }

    if (!items.length) {
      return { status: 200, msg: "No hay cuotas que coincidan con el periodo semanal para las zonas del cobrador", data: null }
    }

    const ultimaTablaCerrada = await TablaSemanalClientesModel.findOne({
      cobrador: cobradorId,
      estado: "cerrada",
    }).sort({ createdAt: -1 })

    if (ultimaTablaCerrada && ultimaTablaCerrada.items?.length) {
      const deudaPorPrestamo = new Map()

      for (const itemAnterior of ultimaTablaCerrada.items) {
        const prestamoIdStr = itemAnterior.prestamo ? String(itemAnterior.prestamo) : null
        if (!prestamoIdStr) continue

        const totalEsperado = (itemAnterior.montoCuotasEsperadoSemana || 0) + (itemAnterior.deudaArrastrada || 0)
        const totalCobrado = itemAnterior.montoCobrado || 0
        const deuda = totalEsperado - totalCobrado

        if (deuda > 0) {
          deudaPorPrestamo.set(prestamoIdStr, deuda)
        }
      }

      for (const [prestamoIdStr, deuda] of deudaPorPrestamo) {
        const itemExistente = items.find((it) => String(it.prestamo) === prestamoIdStr)

        if (itemExistente) {
          itemExistente.deudaArrastrada = deuda
        } else {
          const itemAnterior = ultimaTablaCerrada.items.find(
            (it) => String(it.prestamo) === prestamoIdStr,
          )
          if (itemAnterior) {
            items.push({
              prestamo: itemAnterior.prestamo,
              cliente: itemAnterior.cliente,
              zona: itemAnterior.zona,
              cobrador: cobradorId,
              cuotasSemana: [],
              montoCuotasEsperadoSemana: 0,
              montoTotalPrestamo: itemAnterior.montoTotalPrestamo || 0,
              saldoPendiente: itemAnterior.saldoPendiente || 0,
              saldoPendienteVencimiento: itemAnterior.saldoPendienteVencimiento ?? null,
              montoCobrado: 0,
              deudaArrastrada: deuda,
              estado: "pendiente",
            })
          }
        }
      }
    }

    const montoTotalEsperado = items.reduce((sum, item) => sum + (item.montoCuotasEsperadoSemana || 0), 0)
    const montoTotalDeudaArrastrada = items.reduce((sum, item) => sum + (item.deudaArrastrada || 0), 0)

    const tabla = new TablaSemanalClientesModel({
      cobrador: cobradorId,
      zonas: zonaIds,
      fechaInicio: inicio,
      fechaFin: fin,
      estado: "borrador",
      montoTotalEsperado,
      montoTotalDeudaArrastrada,
      montoTotalCobrado: 0,
      items,
      creadoPor: adminId || null,
    })

    await tabla.save()

    const tablaPopulada = await populateTabla(TablaSemanalClientesModel.findById(tabla._id))
    return { status: 201, msg: "Tabla semanal generada correctamente", data: tablaPopulada }
  } catch (error) {
    return { status: 500, msg: "Error al generar la tabla semanal de clientes: " + error.message, data: null }
  }
}

const cargarItemTablaSemanalAdmin = async (adminId, tablaId, itemId) => {
  try {
    const tabla = await TablaSemanalClientesModel.findById(tablaId)

    if (!tabla) return { status: 404, msg: "Tabla semanal no encontrada", data: null }
    if (tabla.estado !== "cerrada") return { status: 400, msg: "La tabla debe estar cerrada para cargar cobros", data: null }

    const item = tabla.items.id(itemId)
    if (!item) return { status: 404, msg: "Item de tabla semanal no encontrado", data: null }
    if (item.estado === "cargado") return { status: 400, msg: "Este item ya fue cargado", data: null }

    const prestamoId = item.prestamo
    const monto = Number(item.montoCobrado || 0)

    if (!prestamoId) return { status: 400, msg: "El item no tiene préstamo asociado", data: null }
    if (Number.isNaN(monto) || monto <= 0) return { status: 400, msg: "El monto cobrado debe ser un número mayor a 0", data: null }

    // Usar la fecha local actual en formato YYYY-MM-DD para evitar el desfase de UTC a la noche
    const hoy = new Date();
    const year = hoy.getFullYear();
    const month = String(hoy.getMonth() + 1).padStart(2, '0');
    const day = String(hoy.getDate()).padStart(2, '0');
    const fechaPago = `${year}-${month}-${day}`;
    
    const resultadoCobro = await procesarCobroBD(prestamoId, monto, adminId, fechaPago, null)

    if (resultadoCobro.status !== 200 && resultadoCobro.status !== 201) {
      return { status: resultadoCobro.status, msg: resultadoCobro.msg, data: null }
    }

    item.estado = "cargado"
    await tabla.save()

    const tablaPopulada = await populateTabla(TablaSemanalClientesModel.findById(tablaId))
    return { status: 200, msg: "Cobro cargado correctamente", data: tablaPopulada }
  } catch (error) {
    return { status: 500, msg: "Error al cargar el cobro del item: " + error.message, data: null }
  }
}

const eliminarTablaSemanalAdmin = async (tablaId) => {
  try {
    const tabla = await TablaSemanalClientesModel.findByIdAndDelete(tablaId)
    if (!tabla) return { status: 404, msg: "Tabla semanal no encontrada", data: null }
    return { status: 200, msg: "Tabla semanal eliminada correctamente", data: tabla }
  } catch (error) {
    return { status: 500, msg: "Error al eliminar la tabla semanal: " + error.message, data: null }
  }
}


const obtenerTodasLasTablasSemanalAdmin = async (filtros = {}) => {
  try {
    const { busqueda, estado, mes, cobrador } = filtros
    let query = {}

    if (estado) query.estado = estado

    if (cobrador) {
      if (mongoose.Types.ObjectId.isValid(cobrador)) {
        query.cobrador = cobrador
      } else {
        const usuario = await UsuarioModel.findOne({
          $or: [
            { nombre: { $regex: cobrador, $options: "i" } },
            { usuarioLogin: { $regex: cobrador, $options: "i" } },
          ],
          rol: "cobrador",
        }).select("_id")

        if (usuario) query.cobrador = usuario._id
        else return { status: 200, msg: "Tablas semanales obtenidas correctamente", data: [] }
      }
    }

    if (mes) {
      const [year, month] = mes.split("-").map(Number)
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0, 23, 59, 59, 999)
      query.createdAt = { $gte: startDate, $lte: endDate }
    }

    let tablas = await populateTabla(TablaSemanalClientesModel.find(query).sort({ createdAt: -1 }))

    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase()
      tablas = tablas.filter((tabla) => {
        const cobradorNombre = (
          typeof tabla.cobrador === "object"
            ? `${tabla.cobrador?.nombre || ""} ${tabla.cobrador?.apellido || ""} ${tabla.cobrador?.email || ""}`.trim()
            : tabla.cobrador || ""
        ).toLowerCase()
        const fecha = (tabla.createdAt ? new Date(tabla.createdAt).toLocaleDateString() : "").toLowerCase()
        return cobradorNombre.includes(busquedaLower) || fecha.includes(busquedaLower)
      })
    }

    return { status: 200, msg: "Tablas semanales obtenidas correctamente", data: tablas }
  } catch (error) {
    return { status: 500, msg: "Error al obtener las tablas semanales: " + error.message, data: null }
  }
}


const enviarTablaSemanalACobrador = async (tablaId) => {
  try {
    const tabla = await TablaSemanalClientesModel.findById(tablaId)
    if (!tabla) return { status: 404, msg: "Tabla semanal no encontrada", data: null }

    tabla.estado = "enviada"
    tabla.items = tabla.items.map((item) => ({ ...item.toObject(), estado: "enviado" }))

    await tabla.save()
    const tablaPopulada = await populateTabla(TablaSemanalClientesModel.findById(tablaId))
    return { status: 200, msg: "Tabla semanal enviada al cobrador", data: tablaPopulada }
  } catch (error) {
    return { status: 500, msg: "Error al enviar la tabla semanal: " + error.message, data: null }
  }
}


const editarMontosTablaSemanalAdmin = async (tablaId, itemsMontos) => {
  try {
    const tabla = await TablaSemanalClientesModel.findById(tablaId)
    if (!tabla) return { status: 404, msg: "Tabla semanal no encontrada", data: null }
    procesarActualizacionMontos(tabla, itemsMontos, false)
    await tabla.save()
    const tablaPopulada = await populateTabla(TablaSemanalClientesModel.findById(tablaId))
    return { status: 200, msg: "Montos de la tabla semanal actualizados correctamente", data: tablaPopulada }
  } catch (error) {
    return { status: 500, msg: "Error al editar los montos de la tabla semanal: " + error.message, data: null }
  }
}


const traerPrestamosCobradores = async (filtros = {}) => {
  try {
    let query = { estado: { $in: ["activo", "vencido"] } }
    if (filtros.cobrador) {
      const cobrador = await UsuarioModel.findById(filtros.cobrador).populate("zonaACargo")
      if (!cobrador) return { status: 404, msg: "Cobrador no encontrado", data: null }
      if (!cobrador.zonaACargo || cobrador.zonaACargo.length === 0) return { status: 200, msg: "Préstamos obtenidos exitosamente", data: [] }
      const zonasIds = cobrador.zonaACargo.map((z) => z._id)
      const clientesEnZonas = await ClienteModel.find({ zona: { $in: zonasIds }, estado: "activo" })
      query.cliente = { $in: clientesEnZonas.map((c) => c._id) }
    }
    if (filtros.estado) query.estado = filtros.estado
    if (filtros.numeroPrestamo) query.numero = filtros.numeroPrestamo
    const prestamos = await PrestamoModel.find(query).populate("cliente", "numero nombre dni zona").sort({ createdAt: -1 })
    return { status: 200, msg: "Préstamos obtenidos exitosamente", data: prestamos }
  } catch (error) {
    return { status: 500, msg: "Error al obtener préstamos de cobradores: " + error.message, data: null }
  }
}


const agregarItemTablaAdmin = async (tablaId, prestamoId) => {
  try {
    if (!tablaId || !prestamoId) return { status: 400, msg: "El ID de la tabla y del préstamo son requeridos", data: null }
    const tabla = await TablaSemanalClientesModel.findById(tablaId).populate("cobrador", "nombre apellido").populate("zonas", "nombre")
    if (!tabla) return { status: 404, msg: "Tabla semanal no encontrada", data: null }
    const prestamo = await PrestamoModel.findById(prestamoId).populate("cliente")
    if (!prestamo) return { status: 404, msg: "Préstamo no encontrado", data: null }
    if (!["activo", "vencido"].includes(prestamo.estado)) return { status: 400, msg: "Solo se pueden agregar préstamos en estado 'activo' o 'vencido'", data: null }

    const zonasCobrador = tabla.zonas.map((z) => z._id.toString())
    if (!zonasCobrador.includes(prestamo.cliente.zona.toString())) return { status: 400, msg: "El préstamo no pertenece a una zona asignada al cobrador", data: null }

    if (tabla.items.find((item) => item.prestamo && item.prestamo.toString() === prestamoId)) {
      return { status: 400, msg: "El préstamo ya está incluido en esta tabla semanal", data: null }
    }

    const cobradorId = tabla.cobrador._id || tabla.cobrador
    if (prestamo.estado === "vencido") {
      tabla.items.push({
        prestamo: prestamo._id, cliente: prestamo.cliente._id, zona: prestamo.cliente.zona, cobrador: cobradorId,
        cuotasSemana: [], montoCuotasEsperadoSemana: prestamo.saldoPendienteVencimiento || 0,
        montoTotalPrestamo: prestamo.montoTotal || 0, saldoPendiente: prestamo.saldoPendiente || 0,
        saldoPendienteVencimiento: prestamo.saldoPendienteVencimiento || 0, montoCobrado: 0,
        estado: tabla.estado === "enviada" ? "enviado" : "pendiente",
      })
      recalcularTotales(tabla); await tabla.save()
      return { status: 200, msg: "Préstamo vencido agregado exitosamente", data: await populateTabla(TablaSemanalClientesModel.findById(tablaId)) }
    }

    const fechaInicio = new Date(tabla.fechaInicio)
    const fechaFin = new Date(tabla.fechaFin)
    const cuotasEnRango = prestamo.planDeCuotas.filter((cuota) => {
      const fv = new Date(cuota.fechaVencimiento); return fv >= fechaInicio && fv <= fechaFin
    })
    const cuotasAAgregar = cuotasEnRango.length > 0 ? cuotasEnRango : prestamo.planDeCuotas.filter((c) => c.estado === "pendiente")

    const cuotasSemana = cuotasAAgregar.map((c) => ({ numero: c.numero, fechaVencimiento: c.fechaVencimiento, monto: (c.monto || 0) - (c.pagado || 0) }))
    tabla.items.push({
      prestamo: prestamo._id, cliente: prestamo.cliente._id, zona: prestamo.cliente.zona, cobrador: cobradorId,
      cuotasSemana, montoCuotasEsperadoSemana: cuotasSemana.reduce((sum, c) => sum + c.monto, 0),
      montoTotalPrestamo: prestamo.montoTotal || 0, saldoPendiente: prestamo.saldoPendiente || 0,
      saldoPendienteVencimiento: prestamo.saldoPendienteVencimiento || null, montoCobrado: 0,
      estado: tabla.estado === "enviada" ? "enviado" : "pendiente",
    })

    recalcularTotales(tabla); await tabla.save()
    return { status: 200, msg: `Se agregaron ${cuotasSemana.length} cuotas`, data: await populateTabla(TablaSemanalClientesModel.findById(tablaId)) }
  } catch (error) {
    return { status: 500, msg: "Error: " + error.message, data: null }
  }
}


const eliminarItemAdmin = async (tablaId, itemId) => {
  try {
    const tabla = await TablaSemanalClientesModel.findById(tablaId)
    if (!tabla) return { status: 404, msg: "Tabla no encontrada", data: null }
    const item = tabla.items.id(itemId)
    if (!item) return { status: 404, msg: "Item no encontrado", data: null }

    const itemEliminado = { _id: item._id, cliente: item.cliente, prestamo: item.prestamo, estado: item.estado }
    tabla.items.pull(itemId)
    recalcularTotales(tabla); await tabla.save()
    return { status: 200, msg: "Item eliminado", data: { tabla: await populateTabla(TablaSemanalClientesModel.findById(tablaId)), itemEliminado } }
  } catch (error) {
    return { status: 500, msg: error.message, data: null }
  }
}


const trasladarItems = async (tablaOrigenId, itemsIds, tablaDestinoId) => {
  try {
    const [tablaOrigen, tablaDestino] = await Promise.all([TablaSemanalClientesModel.findById(tablaOrigenId), TablaSemanalClientesModel.findById(tablaDestinoId)])
    if (!tablaOrigen || !tablaDestino) return { status: 404, msg: "Tablas no encontradas", data: null }

    const itemsATrasladar = tablaOrigen.items.filter((it) => itemsIds.includes(it._id.toString()))
    if (itemsATrasladar.length === 0) return { status: 404, msg: "Items no encontrados", data: null }

    itemsATrasladar.forEach((itOrigen) => {
      const pId = itOrigen.prestamo?._id || itOrigen.prestamo
      const itExistente = tablaDestino.items.find((it) => (it.prestamo?._id || it.prestamo).toString() === pId.toString())

      if (itExistente) {
        itExistente.montoCuotasEsperadoSemana += (itOrigen.montoCuotasEsperadoSemana || 0)
        itExistente.montoCobrado += (itOrigen.montoCobrado || 0)
        itExistente.deudaArrastrada += (itOrigen.deudaArrastrada || 0)
        if (itOrigen.cuotasSemana?.length > 0) {
          if (!itExistente.cuotasSemana) itExistente.cuotasSemana = []
          itOrigen.cuotasSemana.forEach((c) => { if (!itExistente.cuotasSemana.find((ex) => ex.numero === c.numero)) itExistente.cuotasSemana.push(c) })
        }
      } else {
        tablaDestino.items.push({ ...itOrigen.toObject(), cobrador: tablaDestino.cobrador })
      }
    })

    itemsIds.forEach((id) => tablaOrigen.items.pull(id))
    recalcularTotales(tablaOrigen); recalcularTotales(tablaDestino)
    await Promise.all([tablaOrigen.save(), tablaDestino.save()])
    return { status: 200, msg: "Traslado exitoso", data: { tablaOrigen: await populateTabla(TablaSemanalClientesModel.findById(tablaOrigenId)), tablaDestino: await populateTabla(TablaSemanalClientesModel.findById(tablaDestinoId)) } }
  } catch (error) {
    return { status: 500, msg: error.message, data: null }
  }
}


const modificarEsperado = async ({ tablaId, itemId, nuevoMontoEsperado, numeroCuota }) => {
  try {
    const tabla = await TablaSemanalClientesModel.findById(tablaId)
    if (!tabla) return { status: 404, msg: "Tabla no encontrada", data: null }
    const item = tabla.items.id(itemId)
    if (!item) return { status: 404, msg: "Item no encontrado", data: null }

    const planRes = await obtenerPlanDeCuotasPrestamo({ prestamoId: item.prestamo })
    const cuota = (planRes.data?.planDeCuotas || []).find((c) => c.numero === numeroCuota)
    if (!cuota || nuevoMontoEsperado > cuota.montoPendiente) return { status: 400, msg: "Monto inválido", data: null }

    item.montoCuotasEsperadoSemana = nuevoMontoEsperado
    if (item.cuotasSemana.length > 0) item.cuotasSemana[0].monto = nuevoMontoEsperado
    recalcularTotales(tabla); await tabla.save()
    return { status: 200, msg: "Actualizado", data: { itemActualizado: item } }
  } catch (error) {
    return { status: 500, msg: error.message, data: null }
  }
}


const obtenerUltimaTablaSemanalGeneral = async () => {
  try {
    const ultimaTabla = await populateTabla(TablaSemanalClientesModel.findOne().sort({ createdAt: -1 }))
    if (!ultimaTabla) return { status: 200, msg: "No hay tablas", data: null }
    return { status: 200, msg: "Obtenida", data: ultimaTabla }
  } catch (error) {
    return { status: 500, msg: error.message, data: null }
  }
}


const abrirTablaSemanalAdmin = async (adminId, tablaId) => {
  try {
    const tabla = await TablaSemanalClientesModel.findById(tablaId)
    if (!tabla || tabla.estado !== "cerrada") return { status: 400, msg: "No se puede abrir", data: null }
    tabla.estado = "enviada"
    await tabla.save()
    return { status: 200, msg: "Reabierta", data: await populateTabla(TablaSemanalClientesModel.findById(tablaId)) }
  } catch (error) {
    return { status: 500, msg: error.message, data: null }
  }
}

module.exports = {
  generarTablaSemanalAdmin, cargarItemTablaSemanalAdmin, eliminarTablaSemanalAdmin,
  obtenerTodasLasTablasSemanalAdmin, enviarTablaSemanalACobrador, editarMontosTablaSemanalAdmin,
  traerPrestamosCobradores, agregarItemTablaAdmin, eliminarItemAdmin, trasladarItems,
  modificarEsperado, obtenerUltimaTablaSemanalGeneral, abrirTablaSemanalAdmin,
}
