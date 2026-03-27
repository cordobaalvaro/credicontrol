const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

const {
  obtenerMisZonas,
} = require("../controllers/cobradores.controllers");

router.get("/mis-zonas", auth("cobrador"), obtenerMisZonas);

module.exports = router;
