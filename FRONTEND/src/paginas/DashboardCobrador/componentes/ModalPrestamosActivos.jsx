"use client"
import { useState, useEffect } from "react"
import { Modal, Button, Spinner, Badge } from "react-bootstrap"
import { IconCash, IconUser, IconMapPin, IconCalendar, IconX } from "@tabler/icons-react"
import "./ModalPrestamosActivos.css"
const ModalPrestamosActivos = ({ show, onHide, prestamosActivos, loading }) => {
  const [prestamos, setPrestamos] = useState([])
  useEffect(() => {
    if (prestamosActivos) {
      setPrestamos(prestamosActivos)
    }
  }, [prestamosActivos])
  const calcularTotal = () => {
    return prestamos.reduce((total, prestamo) => total + (prestamo.saldoPendiente || 0), 0)
  }
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="xl" 
      centered 
      className="modal-prestamos-activos"
    >
      <Modal.Header className="modal-prestamos-header">
        <div className="modal-header-content">
          <div className="modal-header-icon">
            <IconCash size={28} />
          </div>
          <div className="modal-header-text">
            <Modal.Title>Préstamos Activos</Modal.Title>
            <p className="modal-subtitle">
              {prestamos.length} préstamo{prestamos.length !== 1 ? "s" : ""} activo{prestamos.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <button className="modal-close-btn" onClick={onHide}>
          <IconX size={24} />
        </button>
      </Modal.Header>
      <Modal.Body className="modal-prestamos-body">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="success" className="mb-3" />
            <h5 className="text-muted">Cargando préstamos activos...</h5>
          </div>
        ) : prestamos.length > 0 ? (
          <>
            {}
            <div className="resumen-card mb-4">
              <div className="resumen-item">
                <IconCash size={20} className="me-2" />
                <span className="fw-semibold">Total a Cobrar:</span>
                <span className="fw-bold text-success ms-2">
                  ${calcularTotal().toLocaleString()}
                </span>
              </div>
            </div>
            {}
            <div className="prestamos-list">
              {prestamos.map((prestamo) => (
                <div key={prestamo._id} className="prestamo-card">
                  <div className="prestamo-header">
                    <div className="prestamo-info">
                      <h6 className="prestamo-numero">
                        Préstamo #{prestamo.numero}
                      </h6>
                      <Badge 
                        className="badge-activo"
                      >
                        Activo
                      </Badge>
                    </div>
                    <div className="prestamo-monto">
                      <span className="fw-bold text-success">
                        ${prestamo.saldoPendiente?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                  <div className="prestamo-details">
                    <div className="detail-item">
                      <IconUser size={16} className="me-2 text-muted" />
                      <span>{prestamo.cliente?.nombre || "Cliente no disponible"}</span>
                    </div>
                    {prestamo.zona?.nombre && (
                      <div className="detail-item">
                        <IconMapPin size={16} className="me-2 text-muted" />
                        <span>{prestamo.zona.nombre}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-5">
            <IconCash size={64} className="modal-activos-empty-icon" />
            <h5 className="text-muted mb-3">No hay préstamos activos</h5>
            <p className="text-muted mb-0">
              No se encontraron préstamos activos para mostrar.
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-prestamos-footer">
        <Button variant="secondary" onClick={onHide} className="btn-cerrar-modal">
          <IconX size={18} className="modal-activos-close-icon" />
          Cerrar
        </Button>
      </Modal.Footer>
      <style jsx>{`
        .modal-prestamos-activos .modal-prestamos-header {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
          border: none;
          color: white;
        }
        .modal-prestamos-activos .modal-header-content {
          display: flex;
          align-items: center;
          flex-grow: 1;
        }
        .modal-prestamos-activos .modal-header-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
        }
        .modal-prestamos-activos .modal-header-text h5 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .modal-prestamos-activos .modal-subtitle {
          margin: 4px 0 0 0;
          opacity: 0.9;
          font-size: 0.875rem;
        }
        .modal-prestamos-activos .modal-close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 8px;
          color: white;
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .modal-prestamos-activos .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .modal-prestamos-activos .resumen-card {
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 16px;
        }
        .modal-prestamos-activos .resumen-item {
          display: flex;
          align-items: center;
          font-size: 1.125rem;
        }
        .modal-prestamos-activos .prestamos-list {
          max-height: 400px;
          overflow-y: auto;
        }
        .modal-prestamos-activos .prestamo-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }
        .modal-prestamos-activos .prestamo-card:hover {
          border-color: #059669;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.1);
        }
        .modal-prestamos-activos .prestamo-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .modal-prestamos-activos .prestamo-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .modal-prestamos-activos .prestamo-numero {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
        }
        .modal-prestamos-activos .prestamo-monto {
          font-size: 1.125rem;
        }
        .modal-prestamos-activos .prestamo-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .modal-prestamos-activos .detail-item {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          color: #6b7280;
        }
        .modal-prestamos-activos .btn-cerrar-modal {
          background: #6b7280;
          border-color: #6b7280;
          border-radius: 8px;
          padding: 8px 16px;
        }
        .modal-prestamos-activos .btn-cerrar-modal:hover {
          background: #4b5563;
          border-color: #4b5563;
        }
      `}</style>
    </Modal>
  )
}
export default ModalPrestamosActivos
