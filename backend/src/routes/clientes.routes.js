const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  crearCliente,
  obtenerClientes,
  obtenerClientePorId,
  obtenerClientePorDNI,
  actualizarCliente,
  eliminarCliente,
  marcarClienteInactivo,
  marcarClienteActivo,
  recalcularTiposClientes,
  obtenerClientesPorTipo,
  obtenerRazonTipoCliente,
  obtenerResumenCliente,
} = require("../controllers/clientes.controllers");

router.post("/", auth("admin"), crearCliente);
router.get("/", auth("admin", "cobrador"), obtenerClientes);
router.post("/recalcular-tipos", auth("admin"), recalcularTiposClientes);
router.get("/por-tipo", auth("admin"), obtenerClientesPorTipo);
router.get("/:id/resumen", auth("admin", "cobrador"), obtenerResumenCliente);
router.get("/:id/razon-tipo", auth("admin"), obtenerRazonTipoCliente);
router.get("/:id", auth("admin", "cobrador"), obtenerClientePorId);
router.get("/dni/:dni", auth("admin"), obtenerClientePorDNI);
router.put("/:id", auth("admin"), actualizarCliente);
router.delete("/:id", auth("admin"), eliminarCliente);
router.patch("/:id/inactivar", auth("admin"), marcarClienteInactivo);
router.patch("/:id/activar", auth("admin"), marcarClienteActivo);

module.exports = router;
