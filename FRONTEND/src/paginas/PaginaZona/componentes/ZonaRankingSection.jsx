import { Row, Col, Button, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const ZonaRankingSection = ({ rankingZona, rankingTipos, topBuenos, topMalos }) => {
  const navigate = useNavigate();
  return (
    <div className="zona-ranking-wrapper mt-4">
      <Row className="g-3">
        <Col md={6}>
          <div className="ranking-card h-100">
            <h6 className="ranking-card-title">Ranking y Tipos</h6>
            <div className="p-3 rounded-3 mb-3 bg-light border">
              <div className="fw-semibold text-dark">Ranking de la Zona</div>
              <div className="text-muted small">
                {rankingZona.posicion ? `#${rankingZona.posicion} de ${rankingZona.totalZonas}` : "Sin ranking"}
              </div>
              {rankingZona.ratioCancelados != null && (
                <div className="text-success small fw-medium">
                  {(rankingZona.ratioCancelados * 100).toFixed(1)}% de cobro efectivo
                </div>
              )}
            </div>
            <div className="p-3 rounded-3 bg-white border">
              <div className="fw-semibold mb-2 text-dark">Distribución de Clientes</div>
              <div className="d-flex flex-wrap gap-2">
                <Badge bg="success" className="px-2 py-1">Buenos: {rankingTipos.bueno || 0}</Badge>
                <Badge bg="secondary" className="px-2 py-1">Neutros: {rankingTipos.neutro || 0}</Badge>
                <Badge bg="warning" text="dark" className="px-2 py-1">Regulares: {rankingTipos.regular || 0}</Badge>
                <Badge bg="danger" className="px-2 py-1">Malos: {rankingTipos.malo || 0}</Badge>
              </div>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="ranking-card h-100">
            <h6 className="ranking-card-title">Top Clientes</h6>
            <Row className="g-2">
              <Col sm={6}>
                <div className="p-2 rounded-2 bg-success bg-opacity-10 border border-success border-opacity-20 h-100">
                  <div className="fw-semibold small mb-2 text-success">Mejores 5</div>
                  {topBuenos.length === 0 ? (
                    <div className="text-muted extreme-small text-center py-2">Sin datos</div>
                  ) : (
                    <div className="d-flex flex-column gap-1">
                      {topBuenos.map((c) => (
                        <div key={c._id} className="d-flex justify-content-between align-items-center bg-white p-1 rounded-1 shadow-sm">
                          <div className="text-truncate extreme-small fw-medium">
                            <span className="text-success me-1">#{c.numero}</span> {c.nombre}
                          </div>
                          <Button variant="link" className="p-0 extreme-small text-decoration-none" onClick={() => navigate(`/cliente/${c._id}`)}>
                            Ver
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Col>
              <Col sm={6}>
                <div className="p-2 rounded-2 bg-danger bg-opacity-10 border border-danger border-opacity-20 h-100">
                  <div className="fw-semibold small mb-2 text-danger">Peores 5</div>
                  {topMalos.length === 0 ? (
                    <div className="text-muted extreme-small text-center py-2">Sin datos</div>
                  ) : (
                    <div className="d-flex flex-column gap-1">
                      {topMalos.map((c) => (
                        <div key={c._id} className="d-flex justify-content-between align-items-center bg-white p-1 rounded-1 shadow-sm">
                          <div className="text-truncate extreme-small fw-medium">
                            <span className="text-danger me-1">#{c.numero}</span> {c.nombre}
                          </div>
                          <Button variant="link" className="p-0 extreme-small text-decoration-none" onClick={() => navigate(`/cliente/${c._id}`)}>
                            Ver
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default ZonaRankingSection;
