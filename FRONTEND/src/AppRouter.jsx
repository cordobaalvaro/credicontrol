import { Routes, Route, useLocation } from "react-router-dom"
import RequireAuth from "./componentes/ui/RequireAuth"
import Login from "./paginas/Login"
import Sidebar from "./componentes/layout/Sidebar"
import BottomNav from "./componentes/layout/BottomNav"
import PaginaZona from "./paginas/PaginaZona/PaginaZona"
import PaginaCliente from "./paginas/PaginaCliente/PaginaCliente"
import DetallePrestamo from "./paginas/DetallePrestamo/DetallePrestamo"
import VerTodosLosClientes from "./paginas/VerTodosLosClientes/VerTodosLosClientes"
import VerClientes from "./paginas/VerClientes/VerClientes"
import VerTodosLosPrestamos from "./paginas/VerTodosLosPrestamos/VerTodosLosPrestamos"
import PaginaPlanes from "./paginas/PaginaPlanes/PaginaPlanes"
import TablasSemanalesClientes from "./paginas/TablasSemanalesClientes/TablasSemanalesClientes"
import TablasSemanalesCobrador from "./paginas/TablasSemanalesCobrador/TablasSemanalesCobrador"

import DashboardAdmin from "./paginas/DashboardAdmin/DashboardAdmin"
import DashboardCobrador from "./paginas/DashboardCobrador/DashboardCobrador"
import DetalleTablaSemanal from "./paginas/TablasSemanalesClientes/DetalleTablaSemanal"
import Gastos from "./paginas/Gastos/Gastos"
import NotFound from "./paginas/NotFound"
import { useAuth } from "./context/AuthContext"
const DashboardPorRol = () => {
  const { user } = useAuth()
  if (user?.rol === "cobrador") return <DashboardCobrador />
  return <DashboardAdmin />
}
const AppRouter = () => {
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const isLogin = location.pathname === "/"
  const ocultarNavbar = isLogin || !isAuthenticated
  return (
    <div className={`app-wrapper ${isLogin ? "no-padding-top" : ""}`}>
      {!ocultarNavbar && (
        <>
          <Sidebar />
          <BottomNav />
        </>
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPorRol />
            </RequireAuth>
          }
        />
        <Route
          path="/gastos"
          element={
            <RequireAuth rol="admin">
              <Gastos />
            </RequireAuth>
          }
        />
        <Route
          path="/zona/:id"
          element={
            <RequireAuth rol={["admin", "cobrador"]}>
              <PaginaZona />
            </RequireAuth>
          }
        />
        <Route
          path="/cliente/:id"
          element={
            <RequireAuth rol={["admin", "cobrador"]}>
              <PaginaCliente />
            </RequireAuth>
          }
        />
        <Route
          path="/prestamo/:id"
          element={
            <RequireAuth rol={["admin", "cobrador"]}>
              <DetallePrestamo />
            </RequireAuth>
          }
        />
        <Route
          path="/todos-los-clientes"
          element={
            <RequireAuth rol="admin">
              <VerTodosLosClientes />
            </RequireAuth>
          }
        />
        <Route
          path="/todos-los-prestamos"
          element={
            <RequireAuth rol="admin">
              <VerTodosLosPrestamos />
            </RequireAuth>
          }
        />
        <Route
          path="/ver-clientes"
          element={
            <RequireAuth rol="cobrador">
              <VerClientes />
            </RequireAuth>
          }
        />
        <Route
          path="/planes"
          element={
            <RequireAuth rol={["admin", "cobrador"]}>
              <PaginaPlanes />
            </RequireAuth>
          }
        />
        <Route
          path="/tablas-semanales-clientes"
          element={
            <RequireAuth rol="admin">
              <TablasSemanalesClientes />
            </RequireAuth>
          }
        />
        {}
        <Route
          path="/mis-tablas-semanales"
          element={
            <RequireAuth rol="cobrador">
              <TablasSemanalesCobrador />
            </RequireAuth>
          }
        />
        <Route
          path="/tablas-semanal/:id"
          element={
            <RequireAuth rol={["admin", "cobrador"]}>
              <DetalleTablaSemanal />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}
export default AppRouter
