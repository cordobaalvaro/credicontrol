const express = require("express")
const router = express.Router()
const auth = require("../middlewares/auth")

const {
  generarTablaSemanalCtrl,
  obtenerTablasSemanalAdminCtrl,
  obtenerTablaSemanalPorIdCtrl,
  enviarTablaSemanalCtrl,
  obtenerMisTablasSemanalCtrl,
  guardarMontosTablaSemanalCtrl,
  guardarMontoItemTablaSemanal,
  cerrarTablaSemanalCtrl,
  abrirTablaAdminCtrl,
  eliminarTablaSemanalCtrl,
  editarMontosTablaSemanalCtrl,
  cargarItemTablaSemanalCtrl,
  traerPrestamosCobradoresCtrl,
  agregarItemTablaCtrl,
  eliminarItemTablaCtrl,
  trasladarItemsCtrl,
  obtenerPlanDeCuotasPrestamoCtrl,
  modificarEsperadoCtrl,
  obtenerUltimaTablaSemanalCobradorCtrl,
  obtenerUltimaTablaSemanalGeneralCtrl,
} = require("../controllers/tablaSemanal.controllers")


router.post("/generar", auth("admin"), generarTablaSemanalCtrl)
router.get("/prestamos", auth("admin"), traerPrestamosCobradoresCtrl)
router.get("/", auth("admin"), obtenerTablasSemanalAdminCtrl)
router.get("/:id", auth("admin", "cobrador"), obtenerTablaSemanalPorIdCtrl)
router.post("/:id/enviar", auth("admin"), enviarTablaSemanalCtrl)
router.delete("/:id", auth("admin"), eliminarTablaSemanalCtrl)
router.put("/:id/montos", auth("admin"), editarMontosTablaSemanalCtrl)
router.put("/:id/items/:itemId/cargar", auth("admin"), cargarItemTablaSemanalCtrl)
router.post("/:id/cerrar", auth("admin", "cobrador"), cerrarTablaSemanalCtrl)
router.post("/:id/abrir", auth("admin"), abrirTablaAdminCtrl)
router.post("/:id/agregar-prestamo", auth("admin"), agregarItemTablaCtrl)
router.delete("/:id/items/:itemId", auth("admin"), eliminarItemTablaCtrl)
router.post("/:id/trasladar-items", auth("admin"), trasladarItemsCtrl)


router.get("/ultima/general", auth("admin"), obtenerUltimaTablaSemanalGeneralCtrl)
router.get("/ultima/cobrador/:cobradorId", auth("admin"), obtenerUltimaTablaSemanalCobradorCtrl)


router.get("/mis/tablas", auth("cobrador"), obtenerMisTablasSemanalCtrl)
router.post("/mis/tablas/:id/montos", auth("cobrador"), guardarMontosTablaSemanalCtrl)
router.put("/:id/items/cobrador", auth("cobrador"), guardarMontosTablaSemanalCtrl)
router.put("/:id/cerrar-cobrador", auth("admin", "cobrador"), cerrarTablaSemanalCtrl)
router.patch("/mis/tablas/:id/items/:itemId", auth("cobrador"), guardarMontoItemTablaSemanal)
router.post("/mis/tablas/:id/cerrar", auth("admin", "cobrador"), cerrarTablaSemanalCtrl)


router.get("/prestamos/:prestamoId/plan-cuotas", auth("admin", "cobrador"), obtenerPlanDeCuotasPrestamoCtrl)


router.patch("/:tablaId/items/:itemId/modificar-esperado", auth("admin", "cobrador"), modificarEsperadoCtrl)

module.exports = router
