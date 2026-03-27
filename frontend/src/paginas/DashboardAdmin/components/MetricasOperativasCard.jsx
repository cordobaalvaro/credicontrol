"use client"
import { Card, Row, Col } from "react-bootstrap"
import { IconUsers } from "@tabler/icons-react"
import "../DashboardAdmin.css"
const MetricasOperativasCard = ({ dashboardData, onShowZonas, onShowCobradores }) => {
  return (
    <Card className="border-0 shadow-sm mb-4">
      <Card.Header className="border-0 bg-transparent py-4">
        <div className="d-flex align-items-center">
          <div className="me-3 metricas-icon-container">
            <IconUsers size={22} className="metricas-icon" />
          </div>
          <h5 className="mb-0 fw-semibold">Métricas Operativas</h5>
        </div>
      </Card.Header>
      <Card.Body className="pt-0 px-4 pb-4">
        <Row className="g-3">
          <Col xs={6} md={3}>
            <div className="text-center p-3 rounded-3 metricas-card">
              <div className="h4 mb-1 fw-bold">{dashboardData?.metricasFinancieras?.totalClientes || 0}</div>
              <div className="small text-muted">Total Clientes</div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div className="text-center p-3 rounded-3 metricas-card">
              <div className="h4 mb-1 fw-bold">
                {dashboardData?.metricasFinancieras?.totalPrestamosCount || dashboardData?.metricasFinancieras?.totalPrestamosActivos || 0}
              </div>
              <div className="small text-muted">Total Préstamos</div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div
              className="text-center p-3 rounded-3 metricas-card-clickable"
              onClick={onShowZonas}
            >
              <div className="h4 mb-1 fw-bold">{dashboardData?.metricasFinancieras?.totalZonas || 0}</div>
              <div className="small text-muted">Total Zonas</div>
            </div>
          </Col>
          <Col xs={6} md={3}>
            <div
              className="text-center p-3 rounded-3 metricas-card-clickable"
              onClick={onShowCobradores}
            >
              <div className="h4 mb-1 fw-bold">{dashboardData?.metricasOperativas?.totalCobradores || 0}</div>
              <div className="small text-muted">Total Cobradores</div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  )
}
export default MetricasOperativasCard
