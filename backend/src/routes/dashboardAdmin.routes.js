const { Router } = require("express");
const {
  getDashboardAdmin,
  getMetricasFinancieras,
  getMetricasOperativas,
  getMovimientosRecientes,
  getAlertasPrestamos,
  getMetricasCobrador,
  getPrestamosCobradosMes,
  getTodasLasZonas,
  getEstadisticasGananciasZonas
} = require("../controllers/dashboardAdmin.controllers");


const auth = require("../middlewares/auth");

const router = Router();


router.use(auth("admin"));


router.get("/", getDashboardAdmin);
router.get("/metricas/financieras", getMetricasFinancieras);
router.get("/metricas/operativas", getMetricasOperativas);
router.get("/movimientos", getMovimientosRecientes);
router.get("/alertas", getAlertasPrestamos);
router.get("/cobrador/:cobradorId/metricas", getMetricasCobrador);
router.get("/prestamos-cobrados-mes", getPrestamosCobradosMes);
router.get("/zonas", getTodasLasZonas);
router.get("/estadisticas-ganancias", getEstadisticasGananciasZonas);

module.exports = router;
