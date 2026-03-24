import { Card, Row, Col, Badge } from "react-bootstrap";
import "./TablaResumenCard.css";
const TablaResumenCard = ({
  headerClassName,
  fecha,
  nombre,
  estadoTexto,
  cantidadCobros,
  totalCobrado,
  fechaEnvio,
  renderFechaEnvioExtra,
  renderContenidoExtra,
  children,
}) => {
  return (
    <Card className="h-100 shadow-sm border-0">
      <Card.Header className={headerClassName}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-0">
              <i className="bi bi-calendar3 me-2"></i>
              {fecha}
            </h6>
            <div className="resumen-card-subtitle fw-bold">
              <i className="bi bi-person me-2"></i>
              {nombre}
            </div>
          </div>
          <Badge bg="light" text="dark">
            {estadoTexto}
          </Badge>
        </div>
      </Card.Header>
      <Card.Body>
        <Row className="text-center mb-3">
          <Col>
            <div className="border-end">
              <h4 className="text-primary mb-1">{cantidadCobros || 0}</h4>
              <small className="text-muted">Cobros</small>
            </div>
          </Col>
          <Col>
            <h4 className="text-success mb-1">
              {(totalCobrado || 0).toLocaleString()}
            </h4>
            <small className="text-muted">Total</small>
          </Col>
        </Row>
        {fechaEnvio && (
          <div className="text-center mb-3">
            {renderFechaEnvioExtra ? (
              renderFechaEnvioExtra(fechaEnvio)
            ) : (
              <small className="text-muted">
                <i className="bi bi-send me-1"></i>
                Enviado: {new Date(fechaEnvio).toLocaleDateString()}
              </small>
            )}
          </div>
        )}
        {renderContenidoExtra && renderContenidoExtra()}
      </Card.Body>
      <Card.Footer className="bg-light border-0">
        {children}
      </Card.Footer>
    </Card>
  );
};
export default TablaResumenCard;
