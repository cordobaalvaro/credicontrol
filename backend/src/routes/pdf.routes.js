const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdf.controllers");
const auth = require("../middlewares/auth");


router.use(auth("admin", "cobrador"));


router.get("/cliente/:id/resumen", pdfController.obtenerResumenClientePDF);
router.get("/prestamo/:id/reporte-cobros", pdfController.obtenerReporteCobrosPDF);
router.get("/tabla-semanal/:id", pdfController.obtenerDatosTablaSemanalPDF);
router.get("/prestamo/:id/detalle", pdfController.obtenerDatosPrestamoPDF);
router.get("/planes", pdfController.obtenerDatosPlanesPDF);

module.exports = router;
