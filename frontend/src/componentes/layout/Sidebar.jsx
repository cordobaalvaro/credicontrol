"use client"
import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { createPortal } from "react-dom"
import { APP_NAME } from "../../helpers/branding"
import logoBlanco from "/logoBlanco.png"
import "./Sidebar.css"
import { useAuth } from "../../context/AuthContext"
import { useNotifications } from "../../context/NotificationContext"
const Sidebar = () => {
  const { user, logout } = useAuth()
  const { notifCount, notifs, marcarComoLeida, marcarTodasComoLeidas, fetchNotifs } = useNotifications()
  const [isMobile, setIsMobile] = useState(false)
  const [showNotifPanel, setShowNotifPanel] = useState(false)
  const notifBtnRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const rol = user?.rol
  const usuario = user?.nombre
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifPanel) {
        const isNotifBtn = notifBtnRef.current?.contains(event.target)
        const isPanel = event.target.closest(".sidebar-slide-panel")
        if (!isNotifBtn && !isPanel) {
          setShowNotifPanel(false)
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [showNotifPanel])
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowNotifPanel(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])
  const isActive = (path) => location.pathname === path
  const adminNavItems = [
    { path: "/dashboard", icon: "bi-graph-up-arrow", label: "Dashboard" },
    { path: "/todos-los-clientes", icon: "bi-people", label: "Clientes" },
    { path: "/todos-los-prestamos", icon: "bi-cash-coin", label: "Préstamos" },
    { path: "/tablas-semanales-clientes", icon: "bi-calendar-week", label: "Tablas" },
    { path: "/gastos", icon: "bi-wallet2", label: "Gastos" },
    { path: "/planes", icon: "bi-grid-3x3", label: "Planes" },
  ]
  const cobradorNavItems = [
    { path: "/dashboard", icon: "bi-speedometer2", label: "Dashboard" },
    { path: "/mis-tablas-semanales", icon: "bi-calendar-week", label: "Tabla Semanal" },
    { path: "/ver-clientes", icon: "bi-people", label: "Clientes" },
    { path: "/planes", icon: "bi-grid-3x3", label: "Planes" },
  ]
  const navItems = rol === "admin" ? adminNavItems : cobradorNavItems
  const toggleNotifPanel = () => {
    setShowNotifPanel(!showNotifPanel)
  }
  const handleLogout = () => {
    logout()
    navigate("/")
  }
  const handleNotifClick = async (n) => {
    const prestamoId = typeof n.prestamo === "object" ? n.prestamo?._id : n.prestamo
    if (!prestamoId) return
    await marcarComoLeida(n._id)
    navigate(`/prestamo/${prestamoId}`)
    setShowNotifPanel(false)
  }
  const getPanelPosition = (btnRef) => {
    if (!btnRef.current) return { bottom: 20 }
    const rect = btnRef.current.getBoundingClientRect()
    const bottom = window.innerHeight - rect.bottom
    return { bottom: Math.max(12, bottom) }
  }
  if (isMobile) return null
  const NotificationPanel = () => {
    console.log("NotificationPanel render, showNotifPanel:", showNotifPanel)
    if (!showNotifPanel) return null
    const position = getPanelPosition(notifBtnRef)
    const sidebarWidth = 240
    console.log("NotificationPanel position:", position)
    return createPortal(
      <>
        <div className="sidebar-panel-overlay" onClick={() => setShowNotifPanel(false)} />
        <div
          className="sidebar-slide-panel notif-panel"
          style={{ bottom: position.bottom }}
        >
          <div className="panel-header">
            <div className="panel-title">
              <i className="bi bi-bell"></i>
              <span>Notificaciones</span>
            </div>
            <div className="panel-actions">
              <button className="panel-action-btn refresh-btn" onClick={fetchNotifs} title="Actualizar notificaciones">
                <i className="bi bi-arrow-clockwise"></i>
              </button>
              {notifCount > 0 && (
                <button className="panel-action-btn" onClick={marcarTodasComoLeidas}>
                  Marcar todas
                </button>
              )}
            </div>
          </div>
          <div className="panel-content">
            {notifs.length === 0 ? (
              <div className="panel-empty">
                <i className="bi bi-bell-slash"></i>
                <span>Sin notificaciones</span>
              </div>
            ) : (
              <div className="notif-list">
                {notifs.map((n) => (
                  <div
                    key={n._id}
                    className="notif-item"
                    onClick={() => handleNotifClick(n)}
                  >
                    <div className="notif-icon">
                      <i className="bi bi-info-circle"></i>
                    </div>
                    <div className="notif-content">
                      <div className="notif-tipo">{n.tipo.replace(/_/g, " ")}</div>
                      <div className="notif-mensaje">{n.mensaje}</div>
                      <div className="notif-fecha">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </>,
      document.body,
    )
  }
  
  return (
    <>
      <div className="sidebar-moderna">
        <div className="sidebar-header">
          <div className="sidebar-brand" onClick={() => navigate("/dashboard")}>
            <div className="brand-icon-sidebar">
              <img
                src={logoBlanco}
                alt="Logo del sistema"
              />
            </div>
            <span className="brand-text-sidebar">{APP_NAME}</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <div
              key={item.path}
              className={`sidebar-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => navigate(item.path)}
            >
              <i className={`bi ${item.icon}`}></i>
              <span className="sidebar-label">{item.label}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="sidebar-user-display">
            <i className="bi bi-person-circle"></i>
            <div className="user-details">
              <span className="user-name-label">{usuario}</span>
              <span className="user-role-label">{rol === "admin" ? "Admin" : "Cobrador"}</span>
            </div>
          </div>
          <div className="sidebar-footer-actions">
            {rol === "admin" && (
              <div
                ref={notifBtnRef}
                className={`footer-action-btn ${showNotifPanel ? "active" : ""}`}
                onClick={toggleNotifPanel}
                title="Notificaciones"
              >
                <i className="bi bi-bell"></i>
                {notifCount > 0 && <span className="footer-notif-badge">{notifCount > 99 ? "99+" : notifCount}</span>}
              </div>
            )}
            <div
              className="footer-action-btn logout"
              onClick={handleLogout}
              title="Cerrar Sesión"
            >
              <i className="bi bi-box-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
      <NotificationPanel />
    </>
  )
}
export default Sidebar
