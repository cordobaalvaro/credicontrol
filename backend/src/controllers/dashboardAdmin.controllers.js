const {
  obtenerDashboardAdmin,
  obtenerMetricasFinancieras,
  obtenerMetricasOperativas,
  obtenerMovimientosRecientes,
  obtenerAlertasPrestamos,
  obtenerMetricasCobrador,
  obtenerPrestamosCobradosMes,
  obtenerTodasLasZonas,
  obtenerEstadisticasGananciasZonas
} = require("../services/dashboardAdmin.services");


const getDashboardAdmin = async (req, res) => {
  try {
    const adminId = req.idUsuario;
    const { mes, anio } = req.query;

    const resultado = await obtenerDashboardAdmin(adminId, mes, anio);

    return res.status(resultado.status).json(resultado);
  } catch (error) {
    console.error("Error en controller getDashboardAdmin:", error);
    return res.status(500).json({
      status: 500,
      msg: "Error interno del servidor al obtener dashboard",
      data: null
    });
  }
};


const getMetricasFinancieras = async (req, res) => {
  try {
    const { mes, anio } = req.query;
    const resultado = await obtenerMetricasFinancieras(mes, anio);

    return res.status(200).json({
      status: 200,
      msg: "Métricas financieras obtenidas correctamente",
      data: resultado
    });
  } catch (error) {
    console.error("Error en controller getMetricasFinancieras:", error);
    return res.status(500).json({
      status: 500,
      msg: "Error interno del servidor al obtener métricas financieras",
      data: null
    });
  }
};


const getMetricasOperativas = async (req, res) => {
  try {
    const { mes, anio } = req.query;
    const resultado = await obtenerMetricasOperativas(mes, anio);

    return res.status(200).json({
      status: 200,
      msg: "Métricas operativas obtenidas correctamente",
      data: resultado
    });
  } catch (error) {
    console.error("Error en controller getMetricasOperativas:", error);
    return res.status(500).json({
      status: 500,
      msg: "Error interno del servidor al obtener métricas operativas",
      data: null
    });
  }
};


const getMovimientosRecientes = async (req, res) => {
  try {
    
    return res.status(200).json({
      status: 200,
      msg: "Movimientos recientes (endpoint desactivado)",
      data: null
    });
  } catch (error) {
    console.error("Error en controller getMovimientosRecientes:", error);
    return res.status(500).json({
      status: 500,
      msg: "Error interno del servidor al obtener movimientos recientes",
      data: null
    });
  }
};


const getAlertasPrestamos = async (req, res) => {
  try {
    const { mes, anio } = req.query;
    const resultado = await obtenerAlertasPrestamos(mes, anio);

    return res.status(200).json({
      status: 200,
      msg: "Alertas de préstamos obtenidas correctamente",
      data: resultado
    });
  } catch (error) {
    console.error("Error en controller getAlertasPrestamos:", error);
    return res.status(500).json({
      status: 500,
      msg: "Error interno del servidor al obtener alertas de préstamos",
      data: null
    });
  }
};


const getMetricasCobrador = async (req, res) => {
  try {
    const { cobradorId } = req.params;
    const { mes, anio } = req.query;

    if (!cobradorId) {
      return res.status(400).json({
        status: 400,
        msg: "ID del cobrador es requerido",
        data: null
      });
    }

    const resultado = await obtenerMetricasCobrador(cobradorId, mes, anio);

    return res.status(resultado.status).json(resultado);
  } catch (error) {
    console.error("Error en controller getMetricasCobrador:", error);
    return res.status(500).json({
      status: 500,
      msg: "Error interno del servidor al obtener métricas del cobrador",
      data: null
    });
  }
};


const getPrestamosCobradosMes = async (req, res) => {
  try {
    const { mes, anio } = req.query;
    const resultado = await obtenerPrestamosCobradosMes(mes, anio);

    return res.status(resultado.status).json(resultado);
  } catch (error) {
    console.error("Error en controller getPrestamosCobradosMes:", error);
    return res.status(500).json({
      status: 500,
      msg: "Error interno del servidor al obtener préstamos cobrados del mes",
      data: []
    });
  }
};


const getTodasLasZonas = async (req, res) => {
  try {
    const resultado = await obtenerTodasLasZonas();

    return res.status(resultado.status).json(resultado);
  } catch (error) {
    console.error("Error en controller getTodasLasZonas:", error);
    return res.status(500).json({
      status: 500,
      msg: "Error interno del servidor al obtener las zonas",
      data: []
    });
  }
};


const getEstadisticasGananciasZonas = async (req, res) => {
  try {
    const { mes, anio } = req.query;
    const resultado = await obtenerEstadisticasGananciasZonas(mes, anio);

    return res.status(resultado.status).json(resultado);
  } catch (error) {
    console.error("Error en controller getEstadisticasGananciasZonas:", error);
    return res.status(500).json({
      status: 500,
      msg: "Error interno del servidor al obtener estadísticas de ganancias por zonas",
      data: []
    });
  }
};

module.exports = {
  getDashboardAdmin,
  getMetricasFinancieras,
  getMetricasOperativas,
  getMovimientosRecientes,
  getAlertasPrestamos,
  getMetricasCobrador,
  getPrestamosCobradosMes,
  getTodasLasZonas,
  getEstadisticasGananciasZonas
};
