"use client"
import { Button } from "react-bootstrap"
import {
  IconUserCircle,
  IconUserPlus,
  IconTrash,
  IconPhone,
  IconMail,
  IconMapPin,
  IconUsersGroup,
  IconUserOff,
} from "@tabler/icons-react"
import "./ZonaCobradoresSection.css"
const ZonaCobradoresSection = ({ zona, onOpenAsignar, onEliminarCobrador }) => {
  const cobradores = zona.cobrador || []
  return (
    <div className="cobradores-section">
      {}
      <div className="cobradores-section-header">
        <div className="cobradores-title-wrapper">
          <div className="cobradores-icon-container">
            <IconUsersGroup size={24} stroke={2} />
          </div>
          <div className="cobradores-title-text">
            <h5 className="cobradores-title">Cobradores Asignados</h5>
            <span className="cobradores-count">
              {cobradores.length} {cobradores.length === 1 ? "cobrador" : "cobradores"}
            </span>
          </div>
        </div>
        <Button className="btn-agregar-cobrador" onClick={onOpenAsignar} title="Asignar cobrador">
          <IconUserPlus size={18} stroke={2} />
          Agregar
        </Button>
      </div>
      {}
      <div className="cobradores-list">
        {cobradores.length > 0 ? (
          <div className="cobradores-grid">
            {cobradores.map((cobrador) => (
              <div key={cobrador._id} className="cobrador-card">
                <div className="cobrador-card-header">
                  <div className="cobrador-avatar">
                    <IconUserCircle size={40} stroke={1.5} />
                  </div>
                  <div className="cobrador-info">
                    <h6 className="cobrador-nombre">
                      {cobrador.nombre} {cobrador.apellido || ""}
                    </h6>
                    <span className="cobrador-rol">Cobrador</span>
                  </div>
                </div>
                <div className="cobrador-card-body">
                  {cobrador.telefono && (
                    <div className="cobrador-detail">
                      <IconPhone size={16} stroke={2} />
                      <span>{cobrador.telefono}</span>
                    </div>
                  )}
                  {cobrador.email && (
                    <div className="cobrador-detail">
                      <IconMail size={16} stroke={2} />
                      <span>{cobrador.email}</span>
                    </div>
                  )}
                  {cobrador.direccion && (
                    <div className="cobrador-detail">
                      <IconMapPin size={16} stroke={2} />
                      <span>{cobrador.direccion}</span>
                    </div>
                  )}
                </div>
                <div className="cobrador-card-footer">
                  <Button
                    className="btn-eliminar-cobrador"
                    onClick={() => onEliminarCobrador(cobrador._id)}
                    title="Eliminar cobrador de esta zona"
                  >
                    <IconTrash size={16} stroke={2} />
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="cobradores-empty">
            <div className="empty-icon">
              <IconUserOff size={48} stroke={1.5} />
            </div>
            <p className="empty-text">No hay cobradores asignados a esta zona</p>
            <Button className="btn-agregar-cobrador-empty" onClick={onOpenAsignar}>
              <IconUserPlus size={18} stroke={2} />
              Asignar primer cobrador
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
export default ZonaCobradoresSection
