const UsuarioModel = require("../models/usuario.model")
const { obtenerUltimaTablaSemanalGeneral } = require("./tablaSemanal.services")
const metricsServices = require("./dashboardAdmin.metrics.services")


const obtenerDashboardAdmin = async (adminId, mes, anio) => {
  try {
    
    const admin = await UsuarioModel.findById(adminId);
    if (!admin || admin.rol !== "admin") {
      return {
        status: 403,
        msg: "Solo los administradores pueden acceder al dashboard",
        data: null
      };
    }

    
    const [
      metricasFinancieras,
      metricasOperativas,
      alertasPrestamos,
      ultimaTablaSemanal,
      estadisticasZonas
    ] = await Promise.all([
      metricsServices.obtenerMetricasFinancieras(mes, anio),
      metricsServices.obtenerMetricasOperativas(mes, anio),
      metricsServices.obtenerAlertasPrestamos(mes, anio),
      obtenerUltimaTablaSemanalGeneral(),
      metricsServices.obtenerEstadisticasGananciasZonas(mes, anio)
    ]);

    
    const resumenFinancieroGlobal = (estadisticasZonas?.data || []).reduce(
      (acc, zona) => {
        acc.totalPrestado += zona.totalPrestado || 0;
        acc.totalCobrado += zona.totalCobrado || 0;
        acc.totalEsperado += zona.totalEsperado || 0;
        acc.gananciaReal += zona.gananciaRealActual || 0;
        return acc;
      },
      { totalPrestado: 0, totalCobrado: 0, totalEsperado: 0, gananciaReal: 0 }
    );

    return {
      status: 200,
      msg: "Dashboard obtenido correctamente",
      data: {
        metricasFinancieras,
        metricasOperativas,
        alertasPrestamos,
        ultimaTablaSemanal,
        resumenFinancieroGlobal,
        ultimaActualizacion: new Date()
      }
    };
  } catch (error) {
    console.error("Error al obtener dashboard admin:", error);
    return {
      status: 500,
      msg: "Error interno al obtener dashboard: " + error.message,
      data: null
    };
  }
};

module.exports = {
  obtenerDashboardAdmin,
  ...metricsServices,
};
