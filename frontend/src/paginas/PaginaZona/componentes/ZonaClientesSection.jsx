"use client"
import { useState } from "react"
import { Button, Form } from "react-bootstrap"
import ViewToggle from "../../../componentes/ui/ViewToggle"
import ClienteZonaListItem from "./ClienteZonaListItem"
import ListFilterBar from "../../../componentes/ui/ListFilterBar"
import "../../../componentes/ui/ViewToggle.css"
const ZonaClientesSection = ({
  zona,
  busqueda,
  onBusquedaChange,
  seleccionados,
  seleccionarTodos,
  onToggleSeleccionTodos,
  onToggleSeleccion,
  onEliminarSeleccionados,
  onVerCliente,
  onOpenAsignarCliente,
}) => {
  const [viewMode, setViewMode] = useState("list")
  return (
    <div className="clientes-section">
      <div className="section-header">
        <h4 className="section-title">
          <i className="bi bi-people"></i>Clientes de la Zona ({zona.clientes.length})
        </h4>
        <div className="header-actions-group">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <Button className="btn-agregar" onClick={onOpenAsignarCliente}>
            <i className="bi bi-person-plus me-2"></i>
            Asignar Cliente
          </Button>
        </div>
      </div>
      <ListFilterBar
        busqueda={busqueda}
        onBusquedaChange={onBusquedaChange}
        filtroZona={"todos"}
        onFiltroZonaChange={() => {}}
        stats={{ total: zona.clientes.length, conZona: 0, sinZona: 0 }}
        placeholder="Buscar por número o nombre de cliente..."
        showZonaFilters={false}
      />
      {zona.clientes.length > 0 && (
        <div className="actions-bar">
          <div className="selection-controls">
            <Form.Check
              type="checkbox"
              className="cliente-checkbox px-2"
              checked={seleccionarTodos}
              onChange={onToggleSeleccionTodos}
              label="Seleccionar todos"
            />
            <span className="text-muted">
              {seleccionados.length} de {zona.clientes.length} seleccionados
            </span>
          </div>
          {seleccionados.length > 0 && (
            <div className="bulk-actions">
              <Button className="btn-bulk btn-bulk-delete" onClick={onEliminarSeleccionados}>
                <i className="bi bi-trash me-2"></i>
                Eliminar {seleccionados.length}
              </Button>
            </div>
          )}
        </div>
      )}
      {zona.clientes.length === 0 ? (
        <div className="no-clientes">
          <i className="bi bi-people"></i>
          <h5>No hay clientes</h5>
          <p>Esta zona no tiene clientes asignados aún.</p>
        </div>
      ) : viewMode === "cards" ? (
        <div className="clientes-grid">
          {zona.clientes.map((cliente) => (
            <div
              key={cliente._id}
              className={`cliente-item ${seleccionados.includes(cliente._id) ? "selected" : ""}`}
            >
              <div className="cliente-header">
                <h5 className="cliente-nombre">{cliente.nombre}</h5>
                <div className="cliente-controls">
                  <Form.Check
                    type="checkbox"
                    className="cliente-checkbox"
                    checked={seleccionados.includes(cliente._id)}
                    onChange={() => onToggleSeleccion(cliente._id)}
                  />
                </div>
              </div>
              <div className="cliente-details">
                <div className="detail-item">
                  <i className="bi bi-hash"></i>
                  <span>N°: {cliente.numero || "N/A"}</span>
                </div>
                <div className="detail-item">
                  <i className="bi bi-card-text"></i>
                  <span>DNI: {cliente.dni}</span>
                </div>
                <div className="detail-item">
                  <i className="bi bi-telephone"></i>
                  <span>Tel: {cliente.telefono || "No especificado"}</span>
                </div>
                <div className="detail-item">
                  <i className="bi bi-cash-stack"></i>
                  <span>Préstamos: {cliente.prestamos?.length || 0}</span>
                </div>
              </div>
              <div className="cliente-actions">
                <Button className="btn-action btn-ver" onClick={() => onVerCliente(cliente._id)}>
                  <i className="bi bi-eye me-1"></i>Ver
                </Button>
                <Button
                  className="btn-action btn-eliminar"
                  onClick={() => {
                    onToggleSeleccion(cliente._id)
                    onEliminarSeleccionados()
                  }}
                >
                  <i className="bi bi-trash me-1"></i>Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="items-list-view">
          {zona.clientes.map((cliente) => (
            <ClienteZonaListItem
              key={cliente._id}
              cliente={cliente}
              isSelected={seleccionados.includes(cliente._id)}
              onToggleSeleccion={onToggleSeleccion}
              onVerCliente={onVerCliente}
              onEliminar={() => {
                onToggleSeleccion(cliente._id)
                onEliminarSeleccionados()
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
export default ZonaClientesSection
