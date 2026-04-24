const TablaSemanalClientesModel = require("../models/tablaSemanalClientes.model")


const populateTabla = (query) => {
  return query
    .populate("cobrador", "nombre apellido email")
    .populate("zonas", "nombre")
    .populate("items.cliente", "numero nombre dni zona direccionCobro direccionComercial direccion direccionCobroValor")
    .populate("items.zona", "nombre")
    .populate("items.prestamo", "numero nombre estado")
}


const recalcularTotales = async (tabla) => {
  // Para recalcular por estado, necesitamos que los préstamos estén populados o tener acceso a sus estados
  // Si no están populados, intentamos popularlos brevemente
  let itemsToProcess = tabla.items;
  
  const hasPopulatedPrestamos = itemsToProcess.length > 0 && 
                                itemsToProcess[0].prestamo && 
                                typeof itemsToProcess[0].prestamo === 'object' &&
                                itemsToProcess[0].prestamo.estado;

  if (!hasPopulatedPrestamos && itemsToProcess.length > 0) {
    const populated = await TablaSemanalClientesModel.findById(tabla._id).populate("items.prestamo", "estado");
    if (populated) itemsToProcess = populated.items;
  }

  let totalEsperado = 0;
  let totalActivos = 0;
  let totalVencidos = 0;
  let totalDeudaArrastrada = 0;
  let totalCobrado = 0;

  itemsToProcess.forEach(item => {
    const monto = item.montoCuotasEsperadoSemana || 0;
    const deuda = item.deudaArrastrada || 0;
    const cobrado = item.montoCobrado || 0;
    
    totalEsperado += monto;
    totalDeudaArrastrada += deuda;
    totalCobrado += cobrado;

    // Categorizar por estado del préstamo
    const estadoPrestamo = item.prestamo?.estado;
    if (estadoPrestamo === "vencido") {
      totalVencidos += monto;
    } else {
      totalActivos += monto;
    }
  });

  tabla.montoTotalEsperado = totalEsperado;
  tabla.montoTotalEsperadoActivos = totalActivos;
  tabla.montoTotalEsperadoVencidos = totalVencidos;
  tabla.montoTotalDeudaArrastrada = totalDeudaArrastrada;
  tabla.montoTotalCobrado = totalCobrado;
}


const procesarActualizacionMontos = async (tabla, itemsMontos, skipCargados = true) => {
  const montosPorItem = new Map()
  for (const item of itemsMontos || []) {
    if (!item.itemId && !item.prestamoId) continue
    const monto = Number(item.montoCobrado || 0)
    if (Number.isNaN(monto) || monto < 0) continue
    if (item.itemId) montosPorItem.set(String(item.itemId), monto)
    if (item.prestamoId) montosPorItem.set(String(item.prestamoId), monto)
  }

  tabla.items = tabla.items.map((it) => {
    if (skipCargados && it.estado === "cargado") return it

    const idStr = String(it._id)
    const prestamoStr = it.prestamo ? String(it.prestamo) : null
    const tieneMontoPorId = montosPorItem.has(idStr)
    const tieneMontoPorPrestamo = prestamoStr && montosPorItem.has(prestamoStr)

    if (tieneMontoPorId || tieneMontoPorPrestamo) {
      const key = tieneMontoPorId ? idStr : prestamoStr
      const monto = montosPorItem.get(key)
      return {
        ...it.toObject(),
        montoCobrado: monto,
        estado: it.estado === "cargado" ? "cargado" : "reportado",
      }
    }
    return it
  })

  await recalcularTotales(tabla)
}

module.exports = {
  populateTabla,
  recalcularTotales,
  procesarActualizacionMontos,
}
