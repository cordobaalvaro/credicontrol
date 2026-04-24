"use client"
import { Row, Col, Card, Button, Badge } from "react-bootstrap"
import { IconCalendar, IconX, IconEye, IconList } from "@tabler/icons-react"
const UltimaTablaSemanalCard = ({ metricasDia, onCerrarTabla, onVerDetalles }) => {
  return (
    <Row className="g-4 mb-4">
      <Col md={12}>
        <Card className="border-0 shadow-sm ultima-tabla-card">
          <Card.Header className="border-0 bg-transparent py-4">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="me-3 ultima-tabla-iconbox">
                  <IconCalendar size={24} className="ultima-tabla-iconbox__svg" />
                </div>
                <h5 className="mb-0 fw-semibold ultima-tabla-title">
                  Última Tabla Semanal
                </h5>
              </div>
              <div className="d-flex gap-2">
                {metricasDia?.ultimaTabla?.estado === "enviada" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={onCerrarTabla}
                    className="rounded-pill px-3 d-flex align-items-center"
                  >
                    <IconX size={14} className="me-1 d-md-none d-lg-inline" />
                    <span className="d-none d-md-inline">Cerrar tabla</span>
                  </Button>
                )}
                <Button
                  variant="outline-success"
                  size="sm"
                  onClick={onVerDetalles}
                  className="rounded-pill px-3 d-flex align-items-center ultima-tabla-btn-outline"
                >
                  <IconEye size={14} className="me-1 d-md-none d-lg-inline" />
                  <span className="d-none d-md-inline">Ver Detalles</span>
                </Button>
                <Button
                  variant="outline-success"
                  size="sm"
                  href="/tablas-semanal-cobrador#/mis-tablas-semanales"
                  className="rounded-pill px-3 d-flex align-items-center ultima-tabla-btn-outline"
                >
                  <IconList size={14} className="me-1 d-md-none d-lg-inline" />
                  <span className="d-none d-md-inline">Ver Todas</span>
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Body className="pt-0 px-4 pb-4">
            {metricasDia?.ultimaTabla ? (
              <>
                <div className="mb-4 pb-3 ultima-tabla-divider">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <h6 className="mb-0 fw-medium ultima-tabla-name">
                      {metricasDia.ultimaTabla.nombre}
                    </h6>
                    <div className="d-flex gap-2">
                      <Badge
                        className={`rounded-pill px-2 py-1 ultima-tabla-badge badge-status-${metricasDia.ultimaTabla.state || metricasDia.ultimaTabla.estado}`}
                      >
                        {metricasDia.ultimaTabla.estado}
                      </Badge>
                      <Badge
                        className="rounded-pill px-2 py-1 ultima-tabla-badge ultima-tabla-badge--week"
                      >
                        {metricasDia.ultimaTabla.numeroTabla ? `Tabla #${metricasDia.ultimaTabla.numeroTabla}` : `Semana ${metricasDia.ultimaTabla.semana}`}
                      </Badge>
                    </div>
                  </div>
                  <div className="small ultima-tabla-dates">
                    {new Date(metricasDia.ultimaTabla.fechaInicio).toLocaleDateString()} -{" "}
                    {new Date(metricasDia.ultimaTabla.fechaFin).toLocaleDateString()}
                  </div>
                </div>
                <Row className="g-2">
                  <Col xs={4} md={2}>
                    <div className="text-center p-2 rounded-3 ultima-tabla-metric">
                      <div className="h5 mb-1 fw-bold ultima-tabla-metric-value">
                        {metricasDia.ultimaTabla.totalItems || 0}
                      </div>
                      <div className="small mb-0 ultima-tabla-metric-label">
                        Total Items
                      </div>
                    </div>
                  </Col>
                  <Col xs={4} md={3}>
                    <div className="text-center p-2 rounded-3 ultima-tabla-metric">
                      <div className="h5 mb-1 fw-bold ultima-tabla-metric-value text-success">
                        ${metricasDia.ultimaTabla.montoTotalEsperadoActivos?.toLocaleString() || 0}
                      </div>
                      <div className="small mb-0 ultima-tabla-metric-label">
                        Esp. Activos
                      </div>
                    </div>
                  </Col>
                  <Col xs={4} md={3}>
                    <div className="text-center p-2 rounded-3 ultima-tabla-metric">
                      <div className="h5 mb-1 fw-bold ultima-tabla-metric-value text-danger">
                        ${metricasDia.ultimaTabla.montoTotalEsperadoVencidos?.toLocaleString() || 0}
                      </div>
                      <div className="small mb-0 ultima-tabla-metric-label">
                        Esp. Vencidos
                      </div>
                    </div>
                  </Col>
                  <Col xs={6} md={2}>
                    <div className="text-center p-2 rounded-3 ultima-tabla-metric">
                      <div className="h5 mb-1 fw-bold ultima-tabla-metric-value">
                        ${metricasDia.ultimaTabla.montoTotalCobrado?.toLocaleString() || 0}
                      </div>
                      <div className="small mb-0 ultima-tabla-metric-label">
                        Total Cobrado
                      </div>
                    </div>
                  </Col>
                  <Col xs={6} md={2}>
                    <div className="text-center p-2 rounded-3 ultima-tabla-metric">
                      <div className="h5 mb-1 fw-bold ultima-tabla-metric-value">
                        {metricasDia.ultimaTabla.montoTotalEsperado > 0
                          ? (
                            ((metricasDia.ultimaTabla.montoTotalCobrado || 0) /
                              metricasDia.ultimaTabla.montoTotalEsperado) *
                            100
                          ).toFixed(1)
                          : 0}
                        %
                      </div>
                      <div className="small mb-0 ultima-tabla-metric-label">
                        Completado
                      </div>
                    </div>
                  </Col>
                </Row>
              </>
            ) : (
              <div className="text-center py-5">
                <div className="mb-3 ultima-tabla-empty-icon">
                  <IconCalendar size={48} className="ultima-tabla-empty-icon__svg" />
                </div>
                <h6 className="mb-3 ultima-tabla-empty-text">
                  No hay tablas semanales registradas
                </h6>
              </div>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}
export default UltimaTablaSemanalCard
