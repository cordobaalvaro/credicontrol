const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const { 
  getInfoCobrador, 
  getMetricasDia, 
  getResumenSemanal, 
  getProximosACobrar, 
  getMisZonas, 
  getInfoClientesPrestamos,
  getDashboardCobrador,
  getPrestamosActivos,
  getPrestamosVencidos
} = require("../controllers/dashboardCobrador.controllers");


router.get("/", auth("cobrador"), getDashboardCobrador);


router.get("/info", auth("cobrador"), getInfoCobrador);


router.get("/metricas-dia", auth("cobrador"), getMetricasDia);


router.get("/resumen-semanal", auth("cobrador"), getResumenSemanal);


router.get("/proximos-cobrar", auth("cobrador"), getProximosACobrar);


router.get("/mis-zonas", auth("cobrador"), getMisZonas);


router.get("/novedades", auth("cobrador"), getInfoClientesPrestamos);


router.get("/prestamos-activos", auth("cobrador"), getPrestamosActivos);


router.get("/prestamos-vencidos", auth("cobrador"), getPrestamosVencidos);

module.exports = router;
