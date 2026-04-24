const TablaSemanalClientesModel = require("../models/tablaSemanalClientes.model")
const PrestamoModel = require("../models/prestamo.model")
const ZonaModel = require("../models/zona.model")
const ClienteModel = require("../models/cliente.model")
const UsuarioModel = require("../models/usuario.model")
const { getFiltroFechas } = require("./dashboardAdmin.helpers")
const { obtenerZonasBD } = require("./zona.services")
const mongoose = require("mongoose")

const obtenerMetricasFinancieras = async (mes, anio) => {
  try {
    const saldoPendienteTotal = await PrestamoModel.aggregate([
      { $match: { estado: "activo", saldoPendiente: { $gt: 0 } } },
      {
        $group: {
          _id: null,
          totalSaldoPendiente: { $sum: "$saldoPendiente" },
          totalPrestamosActivos: { $sum: 1 }
        }
      }
    ]);

    const { primerDiaMes, ultimoDiaMes, fechaHace4Semanas } = getFiltroFechas(mes, anio);

    const totalCobradoMes = await PrestamoModel.aggregate([
      { $match: { "registroCobros.fechaPago": { $gte: primerDiaMes, $lte: ultimoDiaMes } } },
      { $unwind: "$registroCobros" },
      { $match: { "registroCobros.fechaPago": { $gte: primerDiaMes, $lte: ultimoDiaMes } } },
      {
        $group: {
          _id: null,
          totalCobrado: { $sum: "$registroCobros.monto" },
          cantidadCobros: { $sum: 1 }
        }
      }
    ]);

    const cobrosSemanales = await PrestamoModel.aggregate([
      { $match: { "registroCobros.fechaPago": { $gte: fechaHace4Semanas } } },
      { $unwind: "$registroCobros" },
      { $match: { "registroCobros.fechaPago": { $gte: fechaHace4Semanas } } },
      {
        $group: {
          _id: { year: { $year: "$registroCobros.fechaPago" }, week: { $week: "$registroCobros.fechaPago" } },
          totalSemana: { $sum: "$registroCobros.monto" },
          cantidadSemana: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.week": -1 } }
    ]);

    const promedioSemanal = cobrosSemanales.length > 0
      ? cobrosSemanales.reduce((sum, semana) => sum + semana.totalSemana, 0) / cobrosSemanales.length
      : 0;

    const [totalClientes, totalZonas, totalPrestamosCount] = await Promise.all([
      ClienteModel.countDocuments(),
      ZonaModel.countDocuments(),
      PrestamoModel.countDocuments({ estado: "activo" })
    ]);

    return {
      totalSaldoPendiente: saldoPendienteTotal[0]?.totalSaldoPendiente || 0,
      totalPrestamosActivos: saldoPendienteTotal[0]?.totalPrestamosActivos || 0,
      totalPrestamosCount,
      totalCobradoMes: totalCobradoMes[0]?.totalCobrado || 0,
      cantidadCobrosMes: totalCobradoMes[0]?.cantidadCobros || 0,
      promedioCobrosSemanales: promedioSemanal,
      cobrosSemanalesDetalle: cobrosSemanales,
      totalClientes,
      totalZonas
    };
  } catch (error) {
    console.error("Error al obtener métricas financieras:", error);
    throw error;
  }
};

const obtenerMetricasOperativas = async (mes, anio) => {
  try {
    const { fechaHace4Semanas, fechaHaceUnMes, hoyFiltro, mananaFiltro } = getFiltroFechas(mes, anio);

    const [tablasSemanales, prestamosNuevosCancelados, cobrosHoy, cobradoresActivos] = await Promise.all([
      TablaSemanalClientesModel.aggregate([
        { $match: { createdAt: { $gte: fechaHace4Semanas } } },
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, week: { $week: "$createdAt" } },
            cantidadTablas: { $sum: 1 },
            montoTotalEsperado: { $sum: "$montoTotalEsperado" },
            montoTotalCobrado: { $sum: "$montoTotalCobrado" }
          }
        },
        { $sort: { "_id.year": -1, "_id.week": -1 } }
      ]),
      PrestamoModel.aggregate([
        { $match: { $or: [{ fechaInicio: { $gte: fechaHaceUnMes } }, { fechaCancelacion: { $gte: fechaHaceUnMes } }] } },
        {
          $group: {
            _id: null,
            nuevos: { $sum: { $cond: [{ $gte: ["$fechaInicio", fechaHaceUnMes] }, 1, 0] } },
            cancelados: { $sum: { $cond: [{ $gte: ["$fechaCancelacion", fechaHaceUnMes] }, 1, 0] } }
          }
        }
      ]),
      PrestamoModel.aggregate([
        { $unwind: "$registroCobros" },
        { $match: { "registroCobros.fechaPago": { $gte: hoyFiltro, $lt: mananaFiltro } } },
        { $group: { _id: null, totalCobros: { $sum: 1 }, montoTotal: { $sum: "$registroCobros.monto" } } }
      ]),
      UsuarioModel.aggregate([
        { $match: { rol: "cobrador" } },
        {
          $lookup: {
            from: "tablasemanalclientes",
            let: { cobradorId: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$cobrador", "$$cobradorId"] }, createdAt: { $gte: fechaHace4Semanas } } }
            ],
            as: "tablasRecientes"
          }
        },
        { $addFields: { isActive: { $gt: [{ $size: "$tablasRecientes" }, 0] } } },
        {
          $group: {
            _id: null,
            totalCobradores: { $sum: 1 },
            cobradoresActivos: { $sum: { $cond: ["$isActive", 1, 0] } },
            cobradoresInactivos: { $sum: { $cond: ["$isActive", 0, 1] } }
          }
        }
      ])
    ]);

    return {
      tablasSemanalesCreadas: tablasSemanales.length,
      tablasSemanalesDetalle: tablasSemanales,
      prestamosNuevos: prestamosNuevosCancelados[0]?.nuevos || 0,
      prestamosCancelados: prestamosNuevosCancelados[0]?.cancelados || 0,
      totalCobradores: cobradoresActivos[0]?.totalCobradores || 0,
      cobradoresActivos: cobradoresActivos[0]?.cobradoresActivos || 0,
      cobradoresInactivos: cobradoresActivos[0]?.cobradoresInactivos || 0,
      cobrosHoy: cobrosHoy[0]?.totalCobros || 0,
      montoCobrosHoy: cobrosHoy[0]?.montoTotal || 0
    };
  } catch (error) {
    console.error("Error al obtener métricas operativas:", error);
    throw error;
  }
};

const obtenerAlertasPrestamos = async (mes, anio) => {
  try {
    const { m, a, hace2Semanas } = getFiltroFechas(mes, anio);
    const startOfMonth = new Date(a, m, 1);
    const endOfMonth = new Date(a, m + 1, 0, 23, 59, 59, 999);

    const [prestamosVencidosMes, saldoPendienteVencido, prestamosMuyVencidos, cobradoresSinReportar] = await Promise.all([
      PrestamoModel.find({ estado: "vencido", updatedAt: { $gte: startOfMonth, $lte: endOfMonth } })
        .populate("cliente", "nombre dni telefono").sort({ updatedAt: -1 }).limit(10),
      PrestamoModel.aggregate([
        { $match: { estado: "vencido", updatedAt: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: null, totalSaldoPendienteVencido: { $sum: { $ifNull: ["$saldoPendienteVencimiento", "$saldoPendiente"] } } } }
      ]),
      PrestamoModel.find({ estado: "vencido", semanasVencidas: { $gte: 2 } })
        .populate("cliente", "nombre dni telefono").sort({ semanasVencidas: -1 }).limit(10),
      UsuarioModel.aggregate([
        { $match: { rol: "cobrador" } },
        {
          $lookup: {
            from: "tablasemanalclientes",
            let: { cobradorId: "$_id" },
            pipeline: [
              { $match: { $expr: { $eq: ["$cobrador", "$$cobradorId"] }, createdAt: { $gte: hace2Semanas } } }
            ],
            as: "tablasRecientes"
          }
        },
        { $addFields: { hasReported: { $gt: [{ $size: "$tablasRecientes" }, 0] } } },
        { $match: { hasReported: false } },
        { $project: { nombre: 1, email: 1, telefono: 1, zonaACargo: 1 } }
      ])
    ]);

    return {
      prestamosVencidosMes,
      prestamosMuyVencidos,
      cobradoresSinReportar,
      saldoPendienteVencido: saldoPendienteVencido[0]?.totalSaldoPendienteVencido || 0,
      totalAlertas: {
        vencidosMes: prestamosVencidosMes.length,
        muyVencidos: prestamosMuyVencidos.length,
        cobradoresSinReportar: cobradoresSinReportar.length
      }
    };
  } catch (error) {
    console.error("Error al obtener alertas de préstamos:", error);
    throw error;
  }
};

const obtenerEstadisticasGananciasZonas = async (mes, anio) => {
  try {
    const { primerDiaMes, ultimoDiaMes } = getFiltroFechas(mes, anio);

    const estadisticasZonas = await PrestamoModel.aggregate([
      { $match: { estado: { $in: ["activo", "vencido", "cancelado", "desactivado"] } } },
      { $unwind: { path: "$planDeCuotas", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          cuotaEsperadaMes: {
            $cond: [
              { $and: [{ $gte: ["$planDeCuotas.fechaVencimiento", primerDiaMes] }, { $lte: ["$planDeCuotas.fechaVencimiento", ultimoDiaMes] }] },
              "$planDeCuotas.monto", 0
            ]
          }
        }
      },
      {
        $group: {
          _id: "$_id", zona: { $first: "$zona" }, fechaInicio: { $first: "$fechaInicio" },
          montoInicial: { $first: "$montoInicial" }, montoTotal: { $first: "$montoTotal" },
          tipo: { $first: "$tipo" }, registroCobros: { $first: "$registroCobros" },
          totalCuotasEsperadasMes: { $sum: "$cuotaEsperadaMes" }
        }
      },
      { $unwind: { path: "$registroCobros", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          porcentajeGanancia: {
            $cond: [{ $gt: ["$montoTotal", 0] }, { $divide: [{ $subtract: ["$montoTotal", "$montoInicial"] }, "$montoTotal"] }, 0]
          },
          montoCobradoMes: {
            $cond: [
              { $and: [{ $gte: ["$registroCobros.fechaPago", primerDiaMes] }, { $lte: ["$registroCobros.fechaPago", ultimoDiaMes] }] },
              "$registroCobros.monto", 0
            ]
          }
        }
      },
      { $addFields: { gananciaCobroMes: { $multiply: ["$montoCobradoMes", "$porcentajeGanancia"] } } },
      {
        $group: {
          _id: "$_id", zona: { $first: "$zona" }, totalCuotasEsperadasMes: { $first: "$totalCuotasEsperadasMes" },
          porcentajeGanancia: { $first: "$porcentajeGanancia" },
          montoInicialMes: {
            $first: {
              $cond: [
                { $and: [{ $gte: ["$fechaInicio", primerDiaMes] }, { $lt: ["$fechaInicio", ultimoDiaMes] }, { $ne: ["$tipo", "refinanciado"] }] },
                "$montoInicial", 0
              ]
            }
          },
          totalCobradoPrestamoMes: { $sum: "$montoCobradoMes" },
          gananciaRealPrestamoMes: { $sum: "$gananciaCobroMes" }
        }
      },
      {
        $group: {
          _id: "$zona", totalPrestado: { $sum: "$montoInicialMes" },
          totalEsperado: { $sum: "$totalCuotasEsperadasMes" },
          totalCobrado: { $sum: "$totalCobradoPrestamoMes" },
          gananciaRealActual: { $sum: "$gananciaRealPrestamoMes" }
        }
      },
      { $addFields: { gananciaRealEsperada: { $subtract: ["$totalEsperado", "$totalPrestado"] } } },
      { $lookup: { from: "zonas", localField: "_id", foreignField: "_id", as: "zonaInfo" } },
      { $unwind: { path: "$zonaInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          zonaId: "$_id", zonaNombre: { $ifNull: ["$zonaInfo.nombre", "Sin Zona Asignada"] },
          totalPrestado: 1, totalEsperado: 1, totalCobrado: 1, gananciaRealEsperada: 1, gananciaRealActual: 1
        }
      },
      { $sort: { zonaNombre: 1 } }
    ]);

    return { status: 200, msg: "Estadísticas de ganancias obtenidas correctamente", data: estadisticasZonas };
  } catch (error) {
    console.error("Error al obtener estadísticas de ganancias por zonas:", error);
    throw error;
  }
};

const obtenerMetricasCobrador = async (cobradorId, mes, anio) => {
  try {
    const { fechaHaceUnMes } = getFiltroFechas(mes, anio);
    const metricas = await TablaSemanalClientesModel.aggregate([
      { $match: { cobrador: new mongoose.Types.ObjectId(cobradorId), createdAt: { $gte: fechaHaceUnMes } } },
      {
        $group: {
          _id: "$cobrador", totalTablas: { $sum: 1 },
          montoTotalEsperado: { $sum: "$montoTotalEsperado" },
          montoTotalCobrado: { $sum: "$montoTotalCobrado" },
          promedioCobroPorTabla: { $avg: "$montoTotalCobrado" },
          eficienciaCobro: {
            $avg: { $cond: [{ $eq: ["$montoTotalEsperado", 0] }, 0, { $divide: ["$montoTotalCobrado", "$montoTotalEsperado"] }] }
          }
        }
      },
      { $lookup: { from: "usuarios", localField: "_id", foreignField: "_id", as: "cobradorInfo" } },
      { $unwind: "$cobradorInfo" }
    ]);
    return { status: 200, msg: "Métricas del cobrador obtenidas", data: metricas[0] || null };
  } catch (error) {
    throw error;
  }
};

const obtenerPrestamosCobradosMes = async (mes, anio) => {
  try {
    const { primerDiaMes, ultimoDiaMes } = getFiltroFechas(mes, anio);
    const cobrados = await PrestamoModel.aggregate([
      { $match: { "registroCobros.fechaPago": { $gte: primerDiaMes, $lte: ultimoDiaMes } } },
      { $unwind: "$registroCobros" },
      { $match: { "registroCobros.fechaPago": { $gte: primerDiaMes, $lte: ultimoDiaMes } } },
      { $lookup: { from: "clientes", localField: "cliente", foreignField: "_id", as: "clienteInfo" } },
      { $unwind: "$clienteInfo" },
      { $project: { numero: 1, cliente: { nombre: "$clienteInfo.nombre" }, montoCobro: "$registroCobros.monto", fechaCobro: "$registroCobros.fechaPago", metodoPago: "$registroCobros.metodoPago", cuotaCobrada: "$registroCobros.cuota" } },
      { $sort: { fechaCobro: -1 } }
    ]);
    return { status: 200, msg: "Obtenidos", data: cobrados };
  } catch (error) {
    throw error;
  }
};

const obtenerPrestamosPrestadosMes = async (mes, anio) => {
  try {
    const { primerDiaMes, ultimoDiaMes } = getFiltroFechas(mes, anio);
    const prestados = await PrestamoModel.aggregate([
      {
        $match: {
          fechaInicio: { $gte: primerDiaMes, $lte: ultimoDiaMes },
          tipo: { $ne: "refinanciado" }
        }
      },
      {
        $lookup: {
          from: "clientes",
          localField: "cliente",
          foreignField: "_id",
          as: "clienteInfo"
        }
      },
      { $unwind: "$clienteInfo" },
      {
        $lookup: {
          from: "zonas",
          localField: "zona",
          foreignField: "_id",
          as: "zonaInfo"
        }
      },
      { $unwind: { path: "$zonaInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          numero: 1,
          cliente: { nombre: "$clienteInfo.nombre", dni: "$clienteInfo.dni" },
          zona: { nombre: "$zonaInfo.nombre" },
          montoInicial: 1,
          montoTotal: 1,
          fechaInicio: 1,
          tipo: 1,
          estado: 1
        }
      },
      { $sort: { fechaInicio: -1 } }
    ]);
    return { status: 200, msg: "Préstamos prestados obtenidos correctamente", data: prestados };
  } catch (error) {
    console.error("Error al obtener préstamos prestados mes:", error);
    throw error;
  }
};

const obtenerTodasLasZonas = async () => {
  try {
    const resZonas = await obtenerZonasBD();
    if (!resZonas?.data) return { status: 500, msg: "Error", data: [] };
    const zonasConMetricas = await Promise.all(resZonas.data.map(async (zona) => {
      const prestamoIds = [];
      zona.clientes.forEach(c => (c.prestamos || []).forEach(p => p._id && prestamoIds.push(p._id)));
      const metricas = await PrestamoModel.aggregate([
        { $match: { _id: { $in: prestamoIds } } },
        {
          $group: {
            _id: null, totalClientes: { $addToSet: "$cliente" },
            prestamosActivos: { $sum: { $cond: [{ $eq: ["$estado", "activo"] }, 1, 0] } },
            prestamosVencidos: { $sum: { $cond: [{ $eq: ["$estado", "vencido"] }, 1, 0] } },
            totalACobrar: { $sum: { $cond: [{ $in: ["$estado", ["activo", "vencido"]] }, "$saldoPendiente", 0] } },
            totalVencido: { $sum: { $cond: [{ $eq: ["$estado", "vencido"] }, "$saldoPendienteVencimiento", 0] } }
          }
        }
      ]);
      const m = metricas[0] || { totalClientes: 0, prestamosActivos: 0, prestamosVencidos: 0, totalACobrar: 0, totalVencido: 0 };
      return {
        _id: zona._id, nombre: zona.nombre, localidades: zona.localidades,
        cobrador: zona.cobrador?.length > 0 ? zona.cobrador.map(c => c.nombre).join(", ") : "Sin asignar",
        cantidadClientes: m.totalClientes.length || 0,
        cantidadPrestamosActivos: m.prestamosActivos,
        cantidadPrestamosVencidos: m.prestamosVencidos,
        totalACobrar: m.totalACobrar,
        totalVencido: m.totalVencido
      };
    }));
    return { status: 200, msg: "Zonas obtenidas", data: zonasConMetricas };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  obtenerMetricasFinancieras, obtenerMetricasOperativas, obtenerAlertasPrestamos,
  obtenerEstadisticasGananciasZonas, obtenerMetricasCobrador, obtenerPrestamosCobradosMes, obtenerPrestamosPrestadosMes, obtenerTodasLasZonas
};
