import { Card, Badge, Alert } from "react-bootstrap"
import { IconUserPlus, IconTrendingUp, IconClock, IconUser, IconBuilding } from "@tabler/icons-react"
const NovedadesCard = ({ novedadesData, loading }) => {
  if (loading) {
    return (
      <Card className="border-0 shadow-sm h-100">
        <Card.Body className="text-center py-4">
          <div className="spinner-border spinner-border-sm text-success me-2" />
          <span className="text-muted">Cargando novedades...</span>
        </Card.Body>
      </Card>
    )
  }
  const { clientesNuevos = [], prestamosNuevos = [], totalNuevos = 0 } = novedadesData || {}
  if (totalNuevos === 0) {
    return (
      <Card className="border-0 shadow-sm h-100 novedades-card">
        <Card.Header className="border-0 bg-transparent py-3">
          <div className="d-flex align-items-center">
            <div className="me-3 novedades-icon">
              <IconTrendingUp size={24} className="novedades-icon__svg" />
            </div>
            <div className="flex-grow-1">
              <h6 className="mb-0 fw-semibold novedades-title">
                Novedades del Día
              </h6>
              <small className="text-muted novedades-subtitle">
                Sin cambios hoy
              </small>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="pt-0">
          <div className="text-center py-4">
            <IconTrendingUp size={48} className="text-muted mb-3" />
            <h6 className="text-muted">No hay novedades hoy</h6>
            <small className="text-muted">No se agregaron nuevos clientes o préstamos en tus zonas</small>
          </div>
        </Card.Body>
      </Card>
    )
  }
  return (
    <Card className="border-0 shadow-sm h-100 novedades-card">
      <Card.Header className="border-0 bg-transparent py-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <div className="me-3 novedades-icon">
              <IconTrendingUp size={24} className="novedades-icon__svg" />
            </div>
            <div className="flex-grow-1">
              <h6 className="mb-0 fw-semibold novedades-title">
                Novedades del Día
              </h6>
              <small className="text-muted novedades-subtitle">
                {totalNuevos} cambio(s) nuevo(s)
              </small>
            </div>
          </div>
          <Badge 
            className="rounded-pill px-2 py-1 novedades-badge"
          >
            Hoy
          </Badge>
        </div>
      </Card.Header>
      <Card.Body className="pt-0 novedades-body">
        {}
        {clientesNuevos.length > 0 && (
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <IconUserPlus size={16} className="me-2 novedades-accent-icon" />
              <small className="fw-semibold novedades-section-title">
                Clientes Nuevos ({clientesNuevos.length})
              </small>
            </div>
            <div className="space-y-2">
              {clientesNuevos.map((cliente, index) => (
                <div key={index} className="p-2 rounded-2 novedades-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="fw-medium text-truncate novedades-item-title">
                        {cliente.detalles.cliente}
                      </div>
                      <div className="small text-muted novedades-item-subtitle">
                        DNI: {cliente.detalles.dni} • Tel: {cliente.detalles.telefono}
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Badge 
                          className="rounded-pill px-2 py-0 novedades-pill"
                        >
                          <IconBuilding size={10} className="me-1" />
                          {cliente.detalles.zona}
                        </Badge>
                        <small className="text-muted novedades-time">
                          <IconClock size={10} className="me-1" />
                          {new Date(cliente.detalles.fechaCreacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {}
        {prestamosNuevos.length > 0 && (
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <IconTrendingUp size={16} className="me-2 novedades-accent-icon" />
              <small className="fw-semibold novedades-section-title">
                Préstamos Nuevos ({prestamosNuevos.length})
              </small>
            </div>
            <div className="space-y-2">
              {prestamosNuevos.map((prestamo, index) => (
                <div key={index} className="p-2 rounded-2 novedades-item">
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="fw-medium text-truncate novedades-item-title">
                        Préstamo N°{prestamo.detalles.numeroPrestamo}
                      </div>
                      <div className="small text-muted novedades-item-subtitle">
                        Cliente: {prestamo.detalles.cliente} • DNI: {prestamo.detalles.dni}
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Badge 
                          className="rounded-pill px-2 py-0 novedades-pill"
                        >
                          ${prestamo.detalles.monto?.toLocaleString()}
                        </Badge>
                        <Badge 
                          className="rounded-pill px-2 py-0 novedades-pill"
                        >
                          <IconBuilding size={10} className="me-1" />
                          {prestamo.detalles.zona}
                        </Badge>
                        <small className="text-muted novedades-time">
                          <IconClock size={10} className="me-1" />
                          {new Date(prestamo.detalles.fechaCreacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {}
        <div className="mt-3 pt-3 border-top novedades-footer">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted novedades-footer-label">
              Total de novedades hoy:
            </small>
            <Badge 
              className="rounded-pill px-2 py-1 novedades-footer-badge"
            >
              {totalNuevos}
            </Badge>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}
export default NovedadesCard
