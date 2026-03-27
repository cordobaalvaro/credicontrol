const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/planes.controllers");
const auth = require("../middlewares/auth");

router.get("/", auth("admin", "cobrador"), ctrl.listarPlanes);
router.get("/:id", auth("admin", "cobrador"), ctrl.obtenerPlan);
router.post("/", auth("admin"), ctrl.crearPlan);
router.put("/:id", auth("admin"), ctrl.actualizarPlan);
router.delete("/:id", auth("admin"), ctrl.eliminarPlan);
router.post("/generar-planes", auth("admin"), ctrl.generarPlanes);

module.exports = router;
