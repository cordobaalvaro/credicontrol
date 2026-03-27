const pdfService = require("../services/pdf.services");
const tablaSemanalService = require("../services/tablaSemanal.services");
const prestamoService = require("../services/prestamos.services");
const planesService = require("../services/planes.services");

/**
 * Obtiene los datos para el reporte de resumen de cliente.
 */
exports.obtenerResumenClientePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pdfService.resumenClientePDFBD(id);
    return res.status(resultado.status).json(resultado);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: "Error al obtener resumen de cliente para PDF",
      error: error.message,
    });
  }
};

/**
 * Obtiene los datos para el reporte de registros de cobros de un préstamo.
 */
exports.obtenerReporteCobrosPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await pdfService.obtenerReporteCobrosPrestamosPDFBD(id);
    return res.status(resultado.status).json(resultado);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: "Error al obtener reporte de cobros para PDF",
      error: error.message,
    });
  }
};

/**
 * Obtiene los datos de una tabla semanal para generar su PDF o planilla.
 */
exports.obtenerDatosTablaSemanalPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await tablaSemanalService.obtenerTablaSemanal(id);
    return res.status(resultado.status).json(resultado);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: "Error al obtener datos de tabla semanal para PDF",
      error: error.message,
    });
  }
};

/**
 * Obtiene los datos de un préstamo específico para su PDF.
 */
exports.obtenerDatosPrestamoPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await prestamoService.obtenerPrestamoPorIdBD(id);
    return res.status(resultado.status).json(resultado);
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: "Error al obtener datos de préstamo para PDF",
      error: error.message,
    });
  }
};

/**
 * Obtiene la lista de planes para exportar a PDF (si aplica).
 */
exports.obtenerDatosPlanesPDF = async (req, res) => {
  try {
    const { tabla } = req.query;
    const resultado = await planesService.listarPlanes({ tabla });
    // planesService.listarPlanes devuelve el resultado directamente o un objeto con status?
    // Revisando planes.controllers.js, parece que devuelve el resultado directamente.
    // Ajustaremos para ser consistentes con el formato de respuesta del backend.
    return res.json({
      status: 200,
      msg: "Planes obtenidos correctamente para PDF",
      data: resultado
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      msg: "Error al obtener datos de planes para PDF",
      error: error.message,
    });
  }
};
