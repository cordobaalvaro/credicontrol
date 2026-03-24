const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdf.controllers");
const auth = require("../middlewares/auth");

// Aplicamos middleware de autenticación a todas las rutas de PDF
router.use(auth("admin", "cobrador"));

// Rutas para datos de reportes PDF
router.get("/cliente/:id/resumen", pdfController.obtenerResumenClientePDF);
router.get("/prestamo/:id/reporte-cobros", pdfController.obtenerReporteCobrosPDF);
router.get("/tabla-semanal/:id", pdfController.obtenerDatosTablaSemanalPDF);
router.get("/prestamo/:id/detalle", pdfController.obtenerDatosPrestamoPDF);
router.get("/planes", pdfController.obtenerDatosPlanesPDF);

module.exports = router;
