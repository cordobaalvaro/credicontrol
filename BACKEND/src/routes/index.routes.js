const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});

const clientesRoutes = require("./clientes.routes");
const prestamosRoutes = require("./prestamos.routes");
const usuariosRoutes = require("./usuarios.routes");
const zonaRoutes = require("./zona.routes");
const cobradoresRoutes = require("./cobradores.routes");
const adminRoutes = require("./admin.routes");
const documentosClientesRoutes = require("./documentosClientes.routes");
const planesRoutes = require("./planes.routes");
const notificacionesRoutes = require("./notificaciones.routes");
const authRoutes = require("./auth.routes");
const tablaSemanalRoutes = require("./tablaSemanal.routes");
// const balanceRoutes = require("./balance.routes")
// const balanceAnualRoutes = require("./balanceAnual.routes")
const dashboardAdminRoutes = require("./dashboardAdmin.routes")
const dashboardCobradorRoutes = require("./dashboardCobrador.routes")
const gastosRoutes = require("./gasto.routes");
const registroCobrosRoutes = require("./registroCobros.routes");
const pdfRoutes = require("./pdf.routes");



router.use("/planes", planesRoutes);
router.use("/datos-libres", planesRoutes);
router.use("/notificaciones", notificacionesRoutes);
router.use("/auth", authRoutes);

router.use("/documentos-clientes", documentosClientesRoutes);
router.use("/clientes", clientesRoutes);
router.use("/prestamos", prestamosRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/zonas", zonaRoutes);
router.use("/cobradores", cobradoresRoutes);
router.use("/admin", adminRoutes);
router.use("/tablas-semanal", tablaSemanalRoutes);
// router.use("/balance", balanceRoutes)
// router.use("/balance-anual", balanceAnualRoutes)
router.use("/dashboard", dashboardAdminRoutes)
router.use("/dashboard-cobrador", dashboardCobradorRoutes)
router.use("/gastos", gastosRoutes);
router.use("/registro-cobros", registroCobrosRoutes);
router.use("/pdfs", pdfRoutes);


module.exports = router;
