const TablaSemanalClientesModel = require("../models/tablaSemanalClientes.model")


const populateTabla = (query) => {
  return query
    .populate("cobrador", "nombre apellido email")
    .populate("zonas", "nombre")
    .populate("items.cliente", "numero nombre dni zona direccionCobro direccionComercial direccion direccionCobroValor")
    .populate("items.zona", "nombre")
    .populate("items.prestamo", "numero nombre estado")
}


const recalcularTotales = (tabla) => {
  tabla.montoTotalEsperado = tabla.items.reduce(
    (sum, item) => sum + (item.montoCuotasEsperadoSemana || 0),
    0,
  )
  tabla.montoTotalDeudaArrastrada = tabla.items.reduce(
    (sum, item) => sum + (item.deudaArrastrada || 0),
    0,
  )
  tabla.montoTotalCobrado = tabla.items.reduce(
    (sum, item) => sum + (item.montoCobrado || 0),
    0,
  )
}


const procesarActualizacionMontos = (tabla, itemsMontos, skipCargados = true) => {
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

  recalcularTotales(tabla)
}

module.exports = {
  populateTabla,
  recalcularTotales,
  procesarActualizacionMontos,
}
