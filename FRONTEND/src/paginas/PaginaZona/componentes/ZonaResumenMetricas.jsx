import { Row, Col, Button } from 'react-bootstrap';
const ZonaResumenMetricas = ({ metricas, onRecargar }) => {
  return (
    <div className="zona-resumen-wrapper mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h6 className="mb-0 fw-semibold text-dark">Resumen de la Zona</h6>
          <small className="text-muted">Métricas y ranking actualizados</small>
        </div>
        <Button variant="light" size="sm" onClick={onRecargar} className="btn-recargar-zona">
          <i className="bi bi-arrow-clockwise me-1"></i> Recargar
        </Button>
      </div>
      <Row className="g-3">
        <Col md={3}>
          <div className="stat-box-zona green">
            <div className="stat-value">{metricas.cantidadClientes || 0}</div>
            <div className="stat-label">Clientes</div>
          </div>
        </Col>
        <Col md={3}>
          <div className="stat-box-zona green">
            <div className="stat-value">{metricas.cantidadPrestamos || 0}</div>
            <div className="stat-label">Préstamos</div>
          </div>
        </Col>
        <Col md={3}>
          <div className="stat-box-zona green">
            <div className="stat-value">
              ${(Number(metricas.saldoPendienteActivos || 0)).toLocaleString()}
            </div>
            <div className="stat-label">Saldo pendiente (Activos)</div>
          </div>
        </Col>
        <Col md={3}>
          <div className="stat-box-zona yellow">
            <div className="stat-value">
              ${(Number(metricas.saldoPendienteVencidos || 0)).toLocaleString()}
            </div>
            <div className="stat-label">Saldo pendiente (Vencidos)</div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default ZonaResumenMetricas;
