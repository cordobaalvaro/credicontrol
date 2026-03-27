const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  procesarCobro,
  editarRegistroCobro,
  eliminarRegistroCobro,
  crearRegistroCobro,
} = require("../controllers/admin.controllers");

router.post("/procesar-cobro", auth("admin"), procesarCobro);
router.put(
  "/prestamos/:prestamoId/registros/:registroId",
  auth("admin"),
  editarRegistroCobro
);
router.delete(
  "/prestamos/:prestamoId/registros/:registroId",
  auth("admin"),
  eliminarRegistroCobro
);
router.post(
  "/prestamos/:prestamoId/crear-registro",
  auth("admin"),
  crearRegistroCobro
);
module.exports = router;
