import { Container, Row, Col} from "react-bootstrap";
const ZonaHeader = ({ zona, usuario,  }) => {
  return (
    <div className="zona-header">
      <Container>
        <Row className="align-items-center">
          <Col>
            <h1 className="zona-title">
              <i className="bi bi-geo-alt me-3"></i>
              {zona.nombre || "Zona sin nombre"}
            </h1>
            <p className="zona-subtitle">
              Bienvenido/a, {usuario.nombre}. Gestiona los clientes y localidades de la zona
            </p>
          </Col>
        </Row>
        <div className="d-flex justify-content-start mt-3">
        </div>
      </Container>
    </div>
  );
};
export default ZonaHeader;
