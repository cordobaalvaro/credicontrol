const TablaSemanalClientesModel = require("../models/tablaSemanalClientes.model")


const populateTabla = (query) => {
  return query
    .populate("cobrador", "nombre apellido email")
    .populate("zonas", "nombre")
    .populate("items.cliente", "numero nombre dni zona direccionCobro direccionComercial direccion direccionCobroValor")
    .populate("items.zona", "nombre")
    .populate("items.prestamo", "numero nombre estado")
    .populate("rendiciones.items.prestamo", "numero nombre estado")
    .populate("rendiciones.items.cliente", "numero nombre dni zona")
    .populate("rendiciones.cargadoPor", "nombre apellido")
}


const recalcularTotales = async (tabla) => {
  // Para recalcular por estado, necesitamos que los préstamos estén populados o tener acceso a sus estados
  const hasPopulatedPrestamos = tabla.items?.length > 0 && 
                                tabla.items[0].prestamo && 
                                typeof tabla.items[0].prestamo === 'object' &&
                                tabla.items[0].prestamo.estado;

  if (!hasPopulatedPrestamos && tabla.items?.length > 0) {
    // Populamos directamente el objeto en memoria para no perder los cambios pendientes de guardar (montoCobrado, etc)
    await tabla.populate("items.prestamo", "estado");
  }

  let itemsToProcess = tabla.items || [];

  let totalEsperado = 0;
  let totalActivos = 0;
  let totalVencidos = 0;
  let totalDeudaArrastrada = 0;
  let totalCobrado = 0;

  itemsToProcess.forEach(item => {
    const fInicio = new Date(tabla.fechaInicio);
    const fInicioStr = new Date(tabla.fechaInicio).toISOString().split('T')[0];
    const fFinStr = new Date(tabla.fechaFin).toISOString().split('T')[0];
    const deuda = item.deudaArrastrada || 0;
    const cobrado = item.montoCobrado || 0;

    // Calculamos cuánto de este item es de la semana y cuánto es atrasado
    let montoEnSemana = 0;
    let montoAtrasado = 0;

    (item.cuotasSemana || []).forEach(c => {
      const fvStr = new Date(c.fechaVencimiento).toISOString().split('T')[0];
      if (fvStr >= fInicioStr && fvStr <= fFinStr) {
        montoEnSemana += (c.monto || 0);
      } else if (fvStr < fInicioStr) {
        montoAtrasado += (c.monto || 0);
      }
    });

    // Si es un préstamo vencido, aseguramos que al menos sume su saldo vencido si no hay cuotas listadas
    if (item.prestamo?.estado === "vencido" && montoAtrasado === 0) {
      montoAtrasado = item.saldoPendienteVencimiento || 0;
    }

    totalActivos += montoEnSemana;
    totalVencidos += montoAtrasado;
    // El esperado global de la tabla ahora es SOLO lo de la semana
    totalEsperado += montoEnSemana;
    
    totalDeudaArrastrada += deuda;
    totalCobrado += cobrado;
  });

  tabla.montoTotalEsperado = totalEsperado;
  tabla.montoTotalEsperadoActivos = totalActivos;
  tabla.montoTotalEsperadoVencidos = totalVencidos;
  tabla.montoTotalDeudaArrastrada = totalDeudaArrastrada;

  // El total cobrado es la suma de los montos actuales en items + los montos en rendiciones
  let totalRendiciones = 0;
  if (tabla.rendiciones && tabla.rendiciones.length > 0) {
    tabla.rendiciones.forEach(rendicion => {
      rendicion.items.forEach(it => {
        totalRendiciones += (it.montoCobrado || 0);
      });
    });
  }

  // Si la tabla está cerrada, el total cobrado oficial es solo lo que se rindió.
  // Los montos que quedaron "sueltos" en los items no deberían sumar al total de una tabla ya finalizada
  // ya que esos ítems están ocultos en la UI de todos modos.
  if (tabla.estado === "cerrada") {
    tabla.montoTotalCobrado = totalRendiciones;
  } else {
    tabla.montoTotalCobrado = totalCobrado + totalRendiciones;
  }
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
        estado: it.estado === "cargado" ? "cargado" : (monto > 0 ? "reportado" : "enviado"),
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
