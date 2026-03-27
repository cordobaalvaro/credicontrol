"use client"
import { Card, Badge } from "react-bootstrap"
import { IconAlertTriangle } from "@tabler/icons-react"
import "../DashboardAdmin.css"
const AlertasPrestamosCard = ({ dashboardData, onGoPrestamo }) => {
  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Header className="border-0 bg-transparent py-3">
        <div className="d-flex align-items-center">
          <div className="me-3 p-2 rounded-3 bg-danger-subtle">
            <IconAlertTriangle size={20} className="text-danger" />
          </div>
          <h6 className="mb-0 fw-semibold">Alertas de Préstamos</h6>
        </div>
      </Card.Header>
      <Card.Body>
        {dashboardData?.alertasPrestamos?.prestamosVencidosMes?.length > 0 ? (
          <div className="alertas-container">
            {dashboardData.alertasPrestamos.prestamosVencidosMes.map((alerta, index) => (
              <div
                key={alerta._id || index}
                className="d-flex align-items-center p-2 rounded-2 mb-2 border border-danger-subtle bg-danger-subtle bg-opacity-10 alertas-item cursor-pointer shadow-hover-sm transition-all"
                onClick={() => onGoPrestamo(alerta._id)}
                title="Ver detalle del préstamo"
              >
                <div className="flex-grow-1">
                  <div className="fw-medium small">{alerta.cliente?.nombre || "Cliente"}</div>
                  <div className="text-muted alertas-cliente-dni">
                    DNI: {alerta.cliente?.dni}
                  </div>
                </div>
                <div className="text-end ms-2">
                  <div className="fw-semibold text-danger small">${alerta.saldoPendienteVencimiento?.toLocaleString()}</div>
                  <Badge bg="danger" className="activity-item-status">
                    Vencido
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted small">Sin alertas de vencimiento</div>
        )}
      </Card.Body>
    </Card>
  )
}
export default AlertasPrestamosCard
