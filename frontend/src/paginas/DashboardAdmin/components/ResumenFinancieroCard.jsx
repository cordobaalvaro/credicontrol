"use client"
import { Card, Row, Col } from "react-bootstrap"
import { IconCurrencyDollar } from "@tabler/icons-react"
const ResumenFinancieroCard = ({ dashboardData, onShowCobradosMes, onShowPrestadosMes }) => {
  return (
    <Card className="border-0 shadow-sm mb-4 resumen-financiero-card">
      <Card.Header className="border-0 bg-transparent py-4">
        <div className="d-flex align-items-center">
          <div
            className="me-3 resumen-financiero-icon"
          >
            <IconCurrencyDollar size={24} className="resumen-financiero-icon__svg" />
          </div>
          <div>
            <h5 className="mb-1 fw-semibold resumen-financiero-title">
              Resumen Financiero del Mes
            </h5>
            <small className="text-muted resumen-financiero-subtitle">
              Indicadores clave de capital y rentabilidad
            </small>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="pt-0 px-4 pb-4">
        {dashboardData?.resumenFinancieroGlobal || dashboardData?.metricasFinancieras ? (
          <Row className="g-3">
            <Col xs={6} lg>
              <div
                className="text-center p-3 rounded-3 clickable-metric-card resumen-financiero-metric resumen-financiero-metric--prestado"
                onClick={onShowPrestadosMes}
              >
                <div className="h5 mb-1 fw-bold resumen-financiero-value resumen-financiero-value--dark">
                  ${(dashboardData.resumenFinancieroGlobal?.totalPrestado || 0).toLocaleString()}
                </div>
                <div className="small mb-0 resumen-financiero-label">
                  Prestado
                </div>
                <div className="small text-muted resumen-financiero-detail">
                  Capital entregado este mes
                </div>
              </div>
            </Col>
            <Col xs={6} lg>
              <div
                className="text-center p-3 rounded-3 clickable-metric-card resumen-financiero-metric resumen-financiero-metric--cobrado"
                onClick={onShowCobradosMes}
              >
                <div className="h5 mb-1 fw-bold resumen-financiero-value resumen-financiero-value--success">
                  ${(dashboardData.resumenFinancieroGlobal?.totalCobrado || 0).toLocaleString()}
                </div>
                <div className="small mb-0 resumen-financiero-label">
                  Cobrado
                </div>
                <div className="small text-muted resumen-financiero-detail">
                  {dashboardData.metricasFinancieras?.cantidadCobros || dashboardData.metricasFinancieras?.cantidadCobrosMes || 0} cobros realizados
                </div>
              </div>
            </Col>
            <Col xs={6} lg>
              <div className="text-center p-3 rounded-3 resumen-financiero-metric resumen-financiero-metric--esperado">
                <div className="h5 mb-1 fw-bold resumen-financiero-value resumen-financiero-value--dark">
                  ${(dashboardData.resumenFinancieroGlobal?.totalEsperado || 0).toLocaleString()}
                </div>
                <div className="small mb-0 resumen-financiero-label">
                  Esperado
                </div>
                <div className="small text-muted resumen-financiero-detail">
                  Cuotas del mes
                </div>
              </div>
            </Col>
            <Col xs={6} lg>
              <div className="text-center p-3 rounded-3 resumen-financiero-metric resumen-financiero-metric--ganancia">
                <div className="h5 mb-1 fw-bold resumen-financiero-value resumen-financiero-value--profit">
                  ${(dashboardData.resumenFinancieroGlobal?.gananciaReal || 0).toLocaleString()}
                </div>
                <div className="small mb-0 resumen-financiero-label">
                  Ganancia
                </div>
                <div className="small text-muted resumen-financiero-detail">
                  Ganancia neta real
                </div>
              </div>
            </Col>
            <Col xs={12} lg>
              <div className="text-center p-3 rounded-3 resumen-financiero-metric resumen-financiero-metric--saldo">
                <div className="h5 mb-1 fw-bold resumen-financiero-value resumen-financiero-value--danger">
                  ${(dashboardData.metricasFinancieras?.totalSaldoPendiente || 0).toLocaleString()}
                </div>
                <div className="small mb-0 resumen-financiero-label">
                  Saldo Pendiente
                </div>
                <div className="small text-muted resumen-financiero-detail">
                  {dashboardData.metricasFinancieras?.totalPrestamosActivos || 0} préstamos activos
                </div>
              </div>
            </Col>
          </Row>
        ) : (
          <div className="text-center py-5">
            <div className="mb-3 resumen-financiero-empty-icon">
              <IconCurrencyDollar size={48} className="resumen-financiero-empty-icon__svg" />
            </div>
            <h6 className="resumen-financiero-empty-text">No hay datos financieros disponibles</h6>
          </div>
        )}
      </Card.Body>
    </Card>
  )
}
export default ResumenFinancieroCard
