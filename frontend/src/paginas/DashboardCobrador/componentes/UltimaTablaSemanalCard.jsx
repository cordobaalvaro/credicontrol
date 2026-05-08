import { useState } from "react"
import { Row, Col, Card, Button, Badge, Collapse } from "react-bootstrap"
import { IconCalendar, IconX, IconEye, IconHistory, IconChevronDown, IconChevronUp, IconSwitchHorizontal, IconNotes } from "@tabler/icons-react"
import ModalDetalleRendicion from "../../TablasSemanalesClientes/modales/ModalDetalleRendicion"
import ModalSeleccionarTabla from "./ModalSeleccionarTabla"

const UltimaTablaSemanalCard = ({ metricasDia, onCerrarTabla, onVerDetalles, onSeleccionarTabla }) => {
  const [showRendicionModal, setShowRendicionModal] = useState(false)
  const [showSeleccionarModal, setShowSeleccionarModal] = useState(false)
  const [rendicionSeleccionada, setRendicionSeleccionada] = useState(null)
  const [showBody, setShowBody] = useState(true)
  const [showRendiciones, setShowRendiciones] = useState(true)

  const handleVerRendicion = (rend) => {
    setRendicionSeleccionada(rend)
    setShowRendicionModal(true)
  }

  const handleSelectTabla = (id) => {
    setShowSeleccionarModal(false)
    onSeleccionarTabla(id)
  }

  if (!metricasDia?.ultimaTabla) {
    return (
      <Row className="g-4 mb-4">
        <Col md={12}>
          <Card className="border-0 shadow-sm ultima-tabla-card">
            <Card.Body className="text-center py-5">
              <div className="mb-3 ultima-tabla-empty-icon">
                <IconCalendar size={48} className="ultima-tabla-empty-icon__svg" />
              </div>
              <h6 className="mb-3 ultima-tabla-empty-text">
                No hay tablas semanales registradas
              </h6>
              <Button 
                variant="primary" 
                size="sm" 
                className="rounded-pill px-4"
                onClick={() => setShowSeleccionarModal(true)}
              >
                Buscar Tablas
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <ModalSeleccionarTabla 
          show={showSeleccionarModal}
          onHide={() => setShowSeleccionarModal(false)}
          onSelect={handleSelectTabla}
          currentTablaId={null}
        />
      </Row>
    )
  }

  const { ultimaTabla } = metricasDia

  return (
    <Row className="g-4 mb-4">
      <Col md={12}>
        <Card className="border-0 shadow-sm ultima-tabla-card">
          <Card.Header 
            className="border-0 bg-transparent py-4 cursor-pointer" 
            onClick={() => setShowBody(!showBody)}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="me-3 ultima-tabla-iconbox">
                  <IconCalendar size={24} className="ultima-tabla-iconbox__svg" />
                </div>
                <h5 className="mb-0 fw-semibold ultima-tabla-title">
                  Última Tabla Semanal
                </h5>
              </div>
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setShowSeleccionarModal(true)}
                      className="rounded-pill px-3 d-flex align-items-center ultima-tabla-btn-outline"
                    >
                      <IconSwitchHorizontal size={14} className="me-1" />
                      <span className="d-none d-md-inline">Cambiar</span>
                    </Button>
                    {ultimaTabla.estado === "enviada" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={onCerrarTabla}
                        className="rounded-pill px-3 d-flex align-items-center"
                      >
                        <IconX size={14} className="me-1" />
                        <span className="d-none d-md-inline">Cerrar</span>
                      </Button>
                    )}
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={onVerDetalles}
                      className="rounded-pill px-3 d-flex align-items-center ultima-tabla-btn-outline"
                    >
                      <IconEye size={14} className="me-1" />
                      <span className="d-none d-md-inline">Detalles</span>
                    </Button>
                  </div>
                  <div className="text-muted">
                    {showBody ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
                  </div>
                </div>
              </div>
            </Card.Header>
            <Collapse in={showBody}>
              <div>
                <Card.Body className="pt-0 px-4 pb-4">
                  <div className="mb-4 pb-3 ultima-tabla-divider">
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <h6 className="mb-0 fw-medium ultima-tabla-name">
                        {ultimaTabla.nombre}
                      </h6>
                      <div className="d-flex gap-2">
                        <Badge
                          className={`rounded-pill px-2 py-1 ultima-tabla-badge badge-status-${ultimaTabla.estado}`}
                        >
                          {ultimaTabla.estado}
                        </Badge>
                        <Badge
                          className="rounded-pill px-2 py-1 ultima-tabla-badge ultima-tabla-badge--week"
                        >
                          {ultimaTabla.numeroTabla 
                            ? `Tabla #${ultimaTabla.numeroTabla}` 
                            : ultimaTabla.semana 
                              ? `Semana ${ultimaTabla.semana}`
                              : 'Tabla Semanal'
                          }
                        </Badge>
                      </div>
                    </div>
                    <div className="small ultima-tabla-dates text-muted mb-2">
                      {new Date(ultimaTabla.fechaInicio).toLocaleDateString()} -{" "}
                      {new Date(ultimaTabla.fechaFin).toLocaleDateString()}
                    </div>
                    {ultimaTabla.zonas && ultimaTabla.zonas.length > 0 && (
                      <div className="small d-flex align-items-center gap-2">
                        <span className="text-muted">Zona(s):</span>
                        <span className="fw-bold text-success">
                          {ultimaTabla.zonas.map(z => z.nombre || z).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
  
                  <Row className="g-2">
                    <Col xs={4} md={2}>
                      <div className="text-center p-2 rounded-3 ultima-tabla-metric">
                        <div className="h5 mb-1 fw-bold">
                          {ultimaTabla.totalItems || 0}
                        </div>
                        <div className="small text-muted">Total Items</div>
                      </div>
                    </Col>
                    <Col xs={4} md={3}>
                      <div className="text-center p-2 rounded-3 ultima-tabla-metric">
                        <div className="h5 mb-1 fw-bold text-success">
                          ${ultimaTabla.montoTotalEsperadoActivos?.toLocaleString() || 0}
                        </div>
                        <div className="small text-muted">Esp. Activos</div>
                      </div>
                    </Col>
                    <Col xs={4} md={3}>
                      <div className="text-center p-2 rounded-3 ultima-tabla-metric">
                        <div className="h5 mb-1 fw-bold text-danger">
                          ${ultimaTabla.montoTotalEsperadoVencidos?.toLocaleString() || 0}
                        </div>
                        <div className="small text-muted">Esp. Vencidos</div>
                      </div>
                    </Col>
                    <Col xs={6} md={2}>
                      <div className="text-center p-2 rounded-3 ultima-tabla-metric">
                        <div className="h5 mb-1 fw-bold text-primary">
                          ${ultimaTabla.montoTotalCobrado?.toLocaleString() || 0}
                        </div>
                        <div className="small text-muted">Total Cobrado</div>
                      </div>
                    </Col>
                    <Col xs={6} md={2}>
                      <div className="text-center p-2 rounded-3 ultima-tabla-metric">
                        <div className="h5 mb-1 fw-bold">
                          {ultimaTabla.montoTotalEsperado > 0
                            ? (((ultimaTabla.montoTotalCobrado || 0) / ultimaTabla.montoTotalEsperado) * 100).toFixed(1)
                            : 0}
                          %
                        </div>
                        <div className="small text-muted">Progreso</div>
                      </div>
                    </Col>
                  </Row>
  
                  {ultimaTabla.rendiciones?.length > 0 && (
                    <div className="mt-4 pt-4 border-top">
                      <div 
                        className="d-flex align-items-center justify-content-between mb-3 cursor-pointer"
                        onClick={() => setShowRendiciones(!showRendiciones)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="d-flex align-items-center">
                          <IconHistory size={18} className="text-muted me-2" />
                          <h6 className="mb-0 fw-semibold text-muted">Historial de Rendiciones (Jornadas)</h6>
                        </div>
                        <div className="text-muted">
                          {showRendiciones ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
                        </div>
                      </div>
                      <Collapse in={showRendiciones}>
                        <div>
                          <div className="d-flex flex-column gap-2">
                            {ultimaTabla.rendiciones.map((rend, idx) => (
                              <div 
                                key={idx} 
                                className="d-flex justify-content-between align-items-center p-3 rounded-3 bg-light border"
                                onClick={() => handleVerRendicion(rend)}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="d-flex flex-column">
                                  <span className="small fw-bold">Jornada {new Date(rend.fechaRendicion).toLocaleDateString()}</span>
                                  <span className="small text-muted">
                                    {rend.items?.length || 0} cobros reportados
                                    {rend.observaciones && <IconNotes size={14} className="ms-2 text-info" title="Tiene observaciones" />}
                                  </span>
                                </div>
                                <div className="d-flex align-items-center gap-3">
                                  <div className="text-end">
                                    <span className="d-block small fw-bold text-success">
                                      ${rend.items?.reduce((sum, it) => sum + (it.montoCobrado || 0), 0).toLocaleString()}
                                    </span>
                                    <Badge bg={rend.estado === "cargada" ? "success" : "info"} className="rounded-pill" style={{ fontSize: '0.65rem' }}>
                                      {rend.estado === "cargada" ? "PROCESADA" : "PENDIENTE ADMIN"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            )).reverse()}
                          </div>
                        </div>
                      </Collapse>
                    </div>
                  )}
                </Card.Body>
              </div>
            </Collapse>
          </Card>
        </Col>
  
        <ModalDetalleRendicion 
          show={showRendicionModal}
          onHide={() => setShowRendicionModal(false)}
          rendicion={rendicionSeleccionada}
        />

        <ModalSeleccionarTabla 
          show={showSeleccionarModal}
          onHide={() => setShowSeleccionarModal(false)}
          onSelect={handleSelectTabla}
          currentTablaId={ultimaTabla._id}
        />
      </Row>
  )
}

export default UltimaTablaSemanalCard
