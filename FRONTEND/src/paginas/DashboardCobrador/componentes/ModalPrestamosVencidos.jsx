"use client"
import { useState, useEffect } from "react"
import { Modal, Button, Spinner, Badge } from "react-bootstrap"
import { IconCash, IconUser, IconMapPin, IconCalendar, IconAlertTriangle, IconX } from "@tabler/icons-react"
import "./ModalPrestamosVencidos.css"
const ModalPrestamosVencidos = ({ show, onHide, prestamosVencidos, loading }) => {
  const [prestamos, setPrestamos] = useState([])
  useEffect(() => {
    if (prestamosVencidos) {
      setPrestamos(prestamosVencidos)
    }
  }, [prestamosVencidos])
  const calcularTotal = () => {
    return prestamos.reduce((total, prestamo) => total + (prestamo.saldoPendienteVencimiento || 0), 0)
  }
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      size="xl" 
      centered 
      className="modal-prestamos-vencidos"
    >
      <Modal.Header className="modal-prestamos-header">
        <div className="modal-header-content">
          <div className="modal-header-icon">
            <IconAlertTriangle size={28} />
          </div>
          <div className="modal-header-text">
            <Modal.Title>Préstamos Vencidos</Modal.Title>
            <p className="modal-subtitle">
              {prestamos.length} préstamo{prestamos.length !== 1 ? "s" : ""} vencido{prestamos.length !== 1 ? "s" : ""}
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
            <Spinner animation="border" variant="danger" className="mb-3" />
            <h5 className="text-muted">Cargando préstamos vencidos...</h5>
          </div>
        ) : prestamos.length > 0 ? (
          <>
            {}
            <div className="resumen-card mb-4">
              <div className="resumen-item">
                <IconAlertTriangle size={20} className="me-2" />
                <span className="fw-semibold">Total Vencido:</span>
                <span className="fw-bold text-danger ms-2">
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
                        className="badge-vencido"
                      >
                        Vencido
                      </Badge>
                    </div>
                    <div className="prestamo-monto">
                      <span className="fw-bold text-danger">
                        ${prestamo.saldoPendienteVencimiento?.toLocaleString() || 0}
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
                    {prestamo.semanasVencidas && (
                      <div className="detail-item">
                        <IconAlertTriangle size={16} className="me-2 text-warning" />
                        <span className="text-warning fw-semibold">
                          {prestamo.semanasVencidas} semana{prestamo.semanasVencidas !== 1 ? "s" : ""} vencida{prestamo.semanasVencidas !== 1 ? "s" : ""}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-5">
            <IconAlertTriangle size={64} className="modal-vencidos-empty-icon" />
            <h5 className="text-muted mb-3">No hay préstamos vencidos</h5>
            <p className="text-muted mb-0">
              No se encontraron préstamos vencidos para mostrar.
            </p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-prestamos-footer">
        <Button variant="secondary" onClick={onHide} className="btn-cerrar-modal">
          <IconX size={18} className="modal-vencidos-close-icon" />
          Cerrar
        </Button>
      </Modal.Footer>
      <style jsx>{`
        .modal-prestamos-vencidos .modal-prestamos-header {
          background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
          border: none;
          color: white;
        }
        .modal-prestamos-vencidos .modal-header-content {
          display: flex;
          align-items: center;
          flex-grow: 1;
        }
        .modal-prestamos-vencidos .modal-header-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 16px;
        }
        .modal-prestamos-vencidos .modal-header-text h5 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .modal-prestamos-vencidos .modal-subtitle {
          margin: 4px 0 0 0;
          opacity: 0.9;
          font-size: 0.875rem;
        }
        .modal-prestamos-vencidos .modal-close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 8px;
          color: white;
          padding: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .modal-prestamos-vencidos .modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        .modal-prestamos-vencidos .resumen-card {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border: 1px solid #fecaca;
          border-radius: 12px;
          padding: 16px;
        }
        .modal-prestamos-vencidos .resumen-item {
          display: flex;
          align-items: center;
          font-size: 1.125rem;
        }
        .modal-prestamos-vencidos .prestamos-list {
          max-height: 400px;
          overflow-y: auto;
        }
        .modal-prestamos-vencidos .prestamo-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 12px;
          margin-bottom: 12px;
          transition: all 0.2s ease;
        }
        .modal-prestamos-vencidos .prestamo-card:hover {
          border-color: #dc2626;
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.1);
        }
        .modal-prestamos-vencidos .prestamo-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .modal-prestamos-vencidos .prestamo-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .modal-prestamos-vencidos .prestamo-numero {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
        }
        .modal-prestamos-vencidos .prestamo-monto {
          font-size: 1.125rem;
        }
        .modal-prestamos-vencidos .prestamo-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .modal-prestamos-vencidos .detail-item {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          color: #6b7280;
        }
        .modal-prestamos-vencidos .btn-cerrar-modal {
          background: #6b7280;
          border-color: #6b7280;
          border-radius: 8px;
          padding: 8px 16px;
        }
        .modal-prestamos-vencidos .btn-cerrar-modal:hover {
          background: #4b5563;
          border-color: #4b5563;
        }
      `}</style>
    </Modal>
  )
}
export default ModalPrestamosVencidos
