const TablaSemanalClientesModel = require("../models/tablaSemanalClientes.model")
const PrestamoModel = require("../models/prestamo.model")
const ZonaModel = require("../models/zona.model")
const ClienteModel = require("../models/cliente.model")
const UsuarioModel = require("../models/usuario.model")
const { procesarCobroBD } = require("./admin.services")
const { populateTabla, recalcularTotales, procesarActualizacionMontos } = require("./tablaSemanal.helpers")
const { obtenerPlanDeCuotasPrestamo } = require("./tablaSemanal.shared.services")
const mongoose = require("mongoose")

const calcularDatosTablaSemanal = async ({ 
  cobradorId, 
  zonaId, 
  fechaInicio, 
  fechaFin, 
  soloCuotasSemana = false 
}) => {
  // Usamos strings YYYY-MM-DD para evitar problemas de zona horaria
  const startStr = new Date(fechaInicio).toISOString().split('T')[0]
  const endStr = new Date(fechaFin).toISOString().split('T')[0]

  let zonaIds = []
  if (zonaId) {
    zonaIds = [zonaId]
  } else {
    const usuario = await UsuarioModel.findById(cobradorId).populate("zonaACargo")
    if (!usuario || !usuario.zonaACargo || usuario.zonaACargo.length === 0) {
      throw new Error("El cobrador no tiene zonas asignadas")
    }
    zonaIds = usuario.zonaACargo.map(z => z._id)
  }

  const clientesZona = await ClienteModel.find(
    { zona: { $in: zonaIds }, estado: "activo" },
    { _id: 1, zona: 1 },
  )

  if (!clientesZona || clientesZona.length === 0) {
    throw new Error("No hay clientes activos en las zonas seleccionadas")
  }

  const clienteIds = clientesZona.map((c) => c._id)
  const clienteZonaMap = new Map(clientesZona.map((c) => [String(c._id), c.zona]))

  const prestamos = await PrestamoModel.find({
    cliente: { $in: clienteIds },
    estado: { $in: ["activo", "vencido"] },
  }).select("cliente estado planDeCuotas montoTotal saldoPendiente saldoPendienteVencimiento")

  const items = []
  let totalActivos = 0
  let totalVencidos = 0

  for (const prestamo of prestamos) {
    const zonaItem = clienteZonaMap.get(String(prestamo.cliente))
    if (!zonaItem) continue

    // Cuotas que caen DENTRO del periodo semanal (pendientes o cobradas en rango)
    const cuotasEnSemana = (prestamo.planDeCuotas || []).filter(c => {
      const fvStr = new Date(c.fechaVencimiento).toISOString().split('T')[0]
      return fvStr >= startStr && fvStr <= endStr && (c.estado === "pendiente" || c.estado === "cobrado")
    })

    // Cuotas atrasadas: pendientes cuyo vencimiento es ANTES de la semana
    const cuotasAtrasadas = (prestamo.planDeCuotas || []).filter(c => {
      const fvStr = new Date(c.fechaVencimiento).toISOString().split('T')[0]
      return fvStr < startStr && c.estado === "pendiente"
    })

    // monto estrictamente de la semana (solo cuotas pendientes en rango)
    const montoSemana = cuotasEnSemana
      .filter(c => c.estado === "pendiente")
      .reduce((sum, c) => sum + ((c.monto || 0) - (c.pagado || 0)), 0)

    const montoAtrasado = cuotasAtrasadas
      .reduce((sum, c) => sum + ((c.monto || 0) - (c.pagado || 0)), 0)

    // Si no hay nada (ni en la semana ni atrasado), no lo incluimos en la tabla
    if (montoSemana <= 0 && montoAtrasado <= 0) continue

    // El esperado del item = atraso + semana (para que el cobrador vea el total a cobrar)
    const montoCuotasEsperadoSemana = montoAtrasado + montoSemana

    // Los totales de la tabla: activos = solo semana, vencidos = solo atrasados
    totalVencidos += montoAtrasado
    totalActivos += montoSemana

    // IMPORTANTE: cuotasSemana guardado en el item son SOLO las de la semana,
    // así recalcularTotales puede filtrar correctamente por fecha.
    // Las cuotas atrasadas se reflejan en montoCuotasEsperadoSemana y deudaArrastrada.
    const cuotasParaItem = soloCuotasSemana
      ? cuotasEnSemana  // en modo "solo semana", si no hay ninguna buscamos la próxima pendiente
      : cuotasEnSemana  // en ambos modos solo guardamos las de la semana

    // Si en modo soloCuotasSemana no hay cuotas en el rango, usamos la próxima pendiente
    const cuotasFinales = (soloCuotasSemana && cuotasParaItem.length === 0)
      ? (() => {
          const prox = (prestamo.planDeCuotas || []).find(c => c.estado === "pendiente")
          return prox ? [prox] : []
        })()
      : cuotasParaItem

    items.push({
      prestamo: prestamo._id,
      cliente: prestamo.cliente,
      zona: zonaItem,
      cobrador: cobradorId,
      cuotasSemana: cuotasFinales.map((c) => ({
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

  return { 
    items, 
    zonaIds, 
    inicio: new Date(fechaInicio), 
    fin: new Date(fechaFin),
    totales: {
      totalActivos,
      totalVencidos,
      totalEsperado: totalActivos
    }
  }
}

const generarTablaSemanalAdmin = async ({ 
  cobradorId, 
  zonaId, 
  fechaInicio, 
  fechaFin, 
  adminId,
  soloCuotasSemana = false,
  montoEsperadoManual = null
}) => {
  try {
    const { items, zonaIds, inicio, fin } = await calcularDatosTablaSemanal({
      cobradorId,
      zonaId,
      fechaInicio,
      fechaFin,
      soloCuotasSemana
    })

    if (!items.length) {
      return { status: 200, msg: "No hay préstamos activos para generar la tabla", data: null }
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
        }
      }
    }

    const tabla = new TablaSemanalClientesModel({
      cobrador: cobradorId,
      zonas: zonaIds,
      fechaInicio: inicio,
      fechaFin: fin,
      estado: "borrador",
      montoTotalCobrado: 0,
      items,
      creadoPor: adminId || null,
    })

    await recalcularTotales(tabla)

    if (montoEsperadoManual !== null && !Number.isNaN(Number(montoEsperadoManual))) {
      tabla.montoTotalEsperadoActivos = Number(montoEsperadoManual)
      tabla.montoTotalEsperado = tabla.montoTotalEsperadoActivos
    }

    await tabla.save()

    const tablaPopulada = await populateTabla(TablaSemanalClientesModel.findById(tabla._id))
    return { status: 201, msg: "Tabla semanal generada correctamente", data: tablaPopulada }
  } catch (error) {
    return { status: 500, msg: error.message, data: null }
  }
}

const previsualizarTotalesTablaSemanalAdmin = async ({ 
  cobradorId, 
  zonaId, 
  fechaInicio, 
  fechaFin, 
  soloCuotasSemana = false 
}) => {
  try {
    const { items, totales } = await calcularDatosTablaSemanal({
      cobradorId,
      zonaId,
      fechaInicio,
      fechaFin,
      soloCuotasSemana
    })

    return { 
      status: 200, 
      msg: "Previsualización obtenida", 
      data: {
        montoTotalEsperadoActivos: totales.totalActivos,
        montoTotalEsperadoVencidos: totales.totalVencidos,
        montoTotalEsperado: totales.totalEsperado,
        cantidadItems: items.length
      } 
    }
  } catch (error) {
    return { status: 500, msg: error.message, data: null }
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
      await recalcularTotales(tabla); await tabla.save()
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

    await recalcularTotales(tabla); await tabla.save()
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
    await recalcularTotales(tabla); await tabla.save()
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
    await recalcularTotales(tablaOrigen); await recalcularTotales(tablaDestino)
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
    await recalcularTotales(tabla); await tabla.save()
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

const cargarRendicionAdmin = async (adminId, tablaId, rendicionId) => {
  try {
    const tabla = await TablaSemanalClientesModel.findById(tablaId)
    if (!tabla) return { status: 404, msg: "Tabla semanal no encontrada", data: null }

    const rendicion = tabla.rendiciones.id(rendicionId)
    if (!rendicion) return { status: 404, msg: "Rendición no encontrada", data: null }
    if (rendicion.estado === "cargada") return { status: 400, msg: "Esta rendición ya fue cargada", data: null }

    const hoy = new Date()
    const year = hoy.getFullYear()
    const month = String(hoy.getMonth() + 1).padStart(2, "0")
    const day = String(hoy.getDate()).padStart(2, "0")
    const fechaPago = `${year}-${month}-${day}`

    let procesadosCount = 0
    let errores = []

    for (const item of rendicion.items) {
      try {
        const resultadoCobro = await procesarCobroBD(item.prestamo, item.montoCobrado, adminId, fechaPago, null)
        if (resultadoCobro.status === 200 || resultadoCobro.status === 201) {
          procesadosCount++
        } else {
          errores.push(`Error en préstamo ${item.prestamo}: ${resultadoCobro.msg}`)
        }
      } catch (err) {
        errores.push(`Error en préstamo ${item.prestamo}: ${err.message}`)
      }
    }

    rendicion.estado = "cargada"
    rendicion.fechaCargada = new Date()
    rendicion.cargadoPor = adminId

    await tabla.save()
    const tablaPopulada = await populateTabla(TablaSemanalClientesModel.findById(tablaId))

    return {
      status: 200,
      msg: `Se procesaron ${procesadosCount} cobros correctamente.${errores.length ? " Hubo algunos errores." : ""}`,
      data: tablaPopulada,
      errores: errores.length > 0 ? errores : null,
    }
  } catch (error) {
    return { status: 500, msg: "Error al cargar la rendición: " + error.message, data: null }
  }
}

module.exports = {
  generarTablaSemanalAdmin, 
  previsualizarTotalesTablaSemanalAdmin,
  cargarItemTablaSemanalAdmin, 
  eliminarTablaSemanalAdmin,
  obtenerTodasLasTablasSemanalAdmin, 
  enviarTablaSemanalACobrador, 
  editarMontosTablaSemanalAdmin,
  traerPrestamosCobradores, 
  agregarItemTablaAdmin, 
  eliminarItemAdmin, 
  trasladarItems,
  modificarEsperado, 
  obtenerUltimaTablaSemanalGeneral, 
  abrirTablaSemanalAdmin,
  cargarRendicionAdmin,
}
