"use client"
import { useState, useEffect } from "react"
import { Badge, Form, Dropdown } from "react-bootstrap"
import {
  IconUser,
  IconCash,
  IconDots,
  IconMoodSmile,
  IconMoodNeutral,
  IconMoodSad,
  IconMoodEmpty,
} from "@tabler/icons-react"
import "./UnifiedListItem.css"
const getTipoClienteIcon = (tipo) => {
  switch (tipo) {
    case "bueno": return IconMoodSmile
    case "regular": return IconMoodNeutral
    case "malo": return IconMoodSad
    case "neutro": return IconMoodEmpty
    default: return IconMoodEmpty
  }
}
const UnifiedListItem = ({
  tipo = "cliente", 
  data,
  isSelected,
  onToggleSelected,
  onClick,
  acciones = [], 
  dropdownAcciones = [], 
  showCheckbox = true,
}) => {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])
  const isCliente = tipo === "cliente"
  let MainIcon = isCliente ? IconUser : IconCash
  let iconClass = ""
  if (isCliente) {
    const tipoCliente = data.tipo || "neutro"
    MainIcon = getTipoClienteIcon(tipoCliente)
    iconClass = `tipo-${tipoCliente}`
  } else {
    iconClass = `prestamo-${data.estado || "activo"}`
  }
  const title = isCliente 
    ? (data.numero ? `NÂ°${data.numero} - ${data.nombre}` : data.nombre)
    : (data.numero ? `#${data.numero} - ${data.nombre || data.cliente?.nombre}` : (data.nombre || `Préstamo #${data._id?.slice(-6)}`))
  const subtitle = isCliente 
    ? `DNI: ${data.dni}`
    : `${data.cliente?.nombre || "Sin cliente"}${data.cliente?.dni ? ` â€¢ DNI: ${data.cliente.dni}` : ""}`
  const infoItems = isCliente ? [
    { label: "Teléfono", value: data.telefono || "-" },
    { label: "Préstamos", value: data.prestamosCount ?? data.prestamos?.length ?? 0 }
  ] : [
    { label: "Total", value: `$${data.montoTotal?.toLocaleString() || "0"}` },
    { label: "Pendiente", value: `$${data.saldoPendiente?.toLocaleString() || "0"}` },
    { label: "Vencimiento", value: data.fechaVencimiento ? new Date(data.fechaVencimiento).toLocaleDateString() : "-" }
  ]
  const badgeContent = isCliente ? (
    data.zona ? (
      <Badge bg="success" className="unified-zona-badge">
        {data.zona.nombre}
      </Badge>
    ) : (
      <Badge bg="warning" className="unified-no-zona-badge">
        Sin Zona
      </Badge>
    )
  ) : (
    <Badge className={`${data.estadoBadge || "bg-secondary"} px-2 py-1`}>
      {data.estado?.toUpperCase() || "DESCONOCIDO"}
    </Badge>
  )
  return (
    <div 
      className={`unified-list-item ${isSelected ? "selected" : ""} ${!isCliente && data.estado === "vencido" ? "no-hover-vencido" : ""}`} 
      onClick={onClick}
    >
      {showCheckbox && (
        <div className="item-checkbox" onClick={(e) => e.stopPropagation()}>
          <Form.Check
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation()
              onToggleSelected && onToggleSelected()
            }}
          />
        </div>
      )}
      <div className={`item-main-icon ${iconClass}`}>
        <MainIcon size={20} />
      </div>
      <div className="item-content">
        <div className="item-title-row">
          <h5 className="item-title">{title}</h5>
          <div className="item-badge">{badgeContent}</div>
        </div>
        <p className="item-subtitle">{subtitle}</p>
      </div>
      {!isMobile && (
        <div className="item-info-grid">
          {infoItems.map((item, idx) => (
            <div key={idx} className="item-info-cell">
              <span className="item-info-label">{item.label}</span>
              <span className="item-info-value">{item.value}</span>
            </div>
          ))}
        </div>
      )}
      <div className="item-actions">
        {isMobile || dropdownAcciones.length > 0 ? (
          <Dropdown drop="start" onClick={(e) => e.stopPropagation()}>
            <Dropdown.Toggle variant="light" id="dropdown-actions" className="item-action-btn">
              <IconDots size={18} />
            </Dropdown.Toggle>
            <Dropdown.Menu className="unified-dropdown-menu">
              {}
              {isMobile && acciones.map((acc, idx) => {
                const Icon = acc.icon;
                return (
                  <Dropdown.Item key={`acc-${idx}`} onClick={acc.onClick} title={acc.title}>
                    <Icon className="me-2" size={16} />
                    {acc.title}
                  </Dropdown.Item>
                );
              })}
              {}
              {dropdownAcciones.map((acc, idx) => {
                const Icon = acc.icon;
                return (
                  <Dropdown.Item 
                    key={`drp-${idx}`} 
                    onClick={acc.onClick}
                    className={acc.variant === 'danger' ? 'text-danger' : ''}
                  >
                    <Icon className="me-2" size={16} />
                    {acc.label}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          acciones.map((acc, idx) => (
            <button
              key={idx}
              className={`item-action-btn action-${acc.color || 'default'} ${acc.backgroundColor ? 'action-bg' : ''}`}
              onClick={(e) => {
                e.stopPropagation()
                acc.onClick()
              }}
              title={acc.title}
            >
              <acc.icon />
            </button>
          ))
        )}
      </div>
    </div>
  )
}
export default UnifiedListItem
