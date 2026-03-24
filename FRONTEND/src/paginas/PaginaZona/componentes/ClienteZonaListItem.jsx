"use client"
import { Form } from "react-bootstrap"
import { IconUser, IconEye, IconTrash } from "@tabler/icons-react"
const ClienteZonaListItem = ({ cliente, isSelected, onToggleSeleccion, onVerCliente, onEliminar }) => {
  return (
    <div className={`list-item ${isSelected ? "selected" : ""}`}>
      <div className="list-item-checkbox">
        <Form.Check type="checkbox" checked={isSelected} onChange={() => onToggleSeleccion(cliente._id)} />
      </div>
      <div className="list-item-icon">
        <IconUser />
      </div>
      <div className="list-item-content">
        <h5 className="list-item-title">{cliente.nombre}</h5>
        <p className="list-item-subtitle">DNI: {cliente.dni}</p>
      </div>
      <div className="list-item-info">
        <div className="list-item-info-item">
          <span className="list-item-info-label">NÂ°</span>
          <span className="list-item-info-value">{cliente.numero || "N/A"}</span>
        </div>
        <div className="list-item-info-item">
          <span className="list-item-info-label">Teléfono</span>
          <span className="list-item-info-value">{cliente.telefono || "-"}</span>
        </div>
        <div className="list-item-info-item">
          <span className="list-item-info-label">Préstamos</span>
          <span className="list-item-info-value">{cliente.prestamos?.length || 0}</span>
        </div>
      </div>
      <div className="list-item-actions">
        <button className="list-item-action-btn btn-ver" onClick={() => onVerCliente(cliente._id)} title="Ver cliente">
          <IconEye />
        </button>
        <button className="list-item-action-btn btn-eliminar" onClick={onEliminar} title="Eliminar de zona">
          <IconTrash />
        </button>
      </div>
    </div>
  )
}
export default ClienteZonaListItem
