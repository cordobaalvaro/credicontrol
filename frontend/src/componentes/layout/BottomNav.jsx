"use client"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Dropdown } from "react-bootstrap"
import "./BottomNav.css"
import { useAuth } from "../../context/AuthContext"
import { useNotifications } from "../../context/NotificationContext"
const BottomNav = () => {
  const { user, logout } = useAuth()
  const { notifCount, notifs, marcarComoLeida, marcarTodasComoLeidas } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()
  const [showNotifModal, setShowNotifModal] = useState(false)
  const rol = user?.rol
  const isActive = (path) => location.pathname === path
  const adminNavItems = [
    { path: "/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
    { path: "/todos-los-clientes", icon: "bi-people", label: "Clientes" },
    { path: "/todos-los-prestamos", icon: "bi-cash-coin", label: "Préstamos" },
  ]
  const cobradorNavItems = [
    { path: "/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
    { path: "/mis-tablas-semanales", icon: "bi-calendar-week", label: "Tablas" },
    { path: "/ver-clientes", icon: "bi-people", label: "Clientes" },
    { path: "/planes", icon: "bi-grid-3x3", label: "Planes" },
  ]
  const navItems = rol === "admin" ? adminNavItems : cobradorNavItems
  const handleLogout = () => {
    logout()
    navigate("/")
  }
  const handleNotifClick = async (n) => {
    const prestamoId = typeof n.prestamo === "object" ? n.prestamo?._id : n.prestamo
    if (!prestamoId) return
    await marcarComoLeida(n._id)
    navigate(`/prestamo/${prestamoId}`)
    setShowNotifModal(false)
  }
  return (
    <>
      <div className="bottom-nav-moderna">
        {navItems.map((item) => (
          <div
            key={item.path}
            className={`bottom-nav-item ${isActive(item.path) ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <i className={`bi ${item.icon}`}></i>
            <span>{item.label}</span>
          </div>
        ))}
        {rol === "admin" && (
          <div className="bottom-nav-item position-relative" onClick={() => setShowNotifModal(true)}>
            <i className="bi bi-bell"></i>
            {notifCount > 0 && <span className="bottom-notif-badge">{notifCount > 99 ? "99+" : notifCount}</span>}
            <span>Notifs</span>
          </div>
        )}
        <Dropdown drop="up" align="end" className="bottom-nav-dropdown">
          <Dropdown.Toggle className="bottom-nav-item">
            <i className="bi bi-three-dots"></i>
            <span>Más</span>
          </Dropdown.Toggle>
          <Dropdown.Menu className="bottom-nav-menu">
            {rol === "admin" && (
              <>
                <Dropdown.Item onClick={() => navigate("/tablas-semanales-clientes")}>
                  <i className="bi bi-calendar-week me-2"></i>
                  Tablas
                </Dropdown.Item>
                <Dropdown.Item onClick={() => navigate("/planes")}>
                  <i className="bi bi-grid-3x3 me-2"></i>
                  Planes
                </Dropdown.Item>
                <Dropdown.Divider />
              </>
            )}
            <Dropdown.Item onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Cerrar Sesión
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      {showNotifModal && (
        <div className="mobile-notif-overlay" onClick={() => setShowNotifModal(false)}>
          <div className="mobile-notif-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-notif-header">
              <h3>Notificaciones</h3>
              <button className="close-modal-btn" onClick={() => setShowNotifModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            {notifCount > 0 && (
              <button className="marcar-todas-mobile" onClick={marcarTodasComoLeidas}>
                Marcar todas como leídas
              </button>
            )}
            <div className="mobile-notif-list">
              {notifs.length === 0 ? (
                <div className="mobile-notif-empty">Sin notificaciones</div>
              ) : (
                notifs.map((n) => (
                  <div key={n._id} className="mobile-notif-item" onClick={() => handleNotifClick(n)}>
                    <div className="mobile-notif-tipo">{n.tipo.replace(/_/g, " ")}</div>
                    <div className="mobile-notif-mensaje">{n.mensaje}</div>
                    <div className="mobile-notif-fecha">{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
export default BottomNav
