const express = require("express");
const router = express.Router();
const {
  obtenerDocumentosCliente,
  crearDocumentoCliente,
  subirImagenDocumentoCliente,
  editarDocumentoCliente,
  editarImagenDocumentoCliente,
  eliminarDocumentoCliente,
} = require("../controllers/documentosClientes.controllers");

const multerMiddlewares = require("../middlewares/multer.middlewares");
const auth = require("../middlewares/auth");

router.get("/:clienteId", auth("admin", "cobrador"), obtenerDocumentosCliente);
router.post("/:clienteId", auth("admin"), crearDocumentoCliente);
router.post(
  "/:documentoId/imagen",
  multerMiddlewares.single("imagen"),
  subirImagenDocumentoCliente
);
router.put("/:documentoId", auth("admin"), editarDocumentoCliente);
router.put(
  "/:documentoId/imagen",
  multerMiddlewares.single("imagen"),
  editarImagenDocumentoCliente
);
router.delete("/:documentoId", auth("admin"), eliminarDocumentoCliente);

module.exports = router;
