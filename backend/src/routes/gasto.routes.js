const express = require("express");
const {
    crearNuevoGasto,
    listarGastos,
    obtenerGasto,
    modificarGasto,
    borrarGasto
} = require("../controllers/gasto.controllers");
const auth = require("../middlewares/auth");

const router = express.Router();


router.use(auth("admin"));

router.post("/", crearNuevoGasto);
router.get("/", listarGastos);
router.get("/:id", obtenerGasto);
router.put("/:id", modificarGasto);
router.delete("/:id", borrarGasto);

module.exports = router;
