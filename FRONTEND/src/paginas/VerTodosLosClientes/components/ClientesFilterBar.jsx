import { Card, Row, Col, InputGroup, Form, ButtonGroup, Button } from "react-bootstrap";
const ClientesFilterBar = ({
  busqueda,
  onBusquedaChange,
  filtroZona,
  onFiltroZonaChange,
  stats,
  placeholder = "Buscar por nombre, DNI, teléfono, barrio, ciudad o zona...",
}) => {
  return (
    <Card className="filter-card">
      <Card.Body>
        <Row className="align-items-center">
          <Col md={6}>
            <InputGroup className="search-input">
              <InputGroup.Text>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder={placeholder}
                value={busqueda}
                onChange={onBusquedaChange}
              />
            </InputGroup>
          </Col>
          <Col md={6}>
            <div className="d-flex justify-content-end">
              <ButtonGroup>
                <Button
                  variant={filtroZona === "todos" ? "success" : "outline-success"}
                  onClick={() => onFiltroZonaChange("todos")}
                >
                  <i className="bi bi-list me-2"></i>Todos ({stats.total})
                </Button>
                <Button
                  variant={filtroZona === "conZona" ? "success" : "outline-success"}
                  onClick={() => onFiltroZonaChange("conZona")}
                >
                  <i className="bi bi-geo-alt me-2"></i>Con Zona ({stats.conZona})
                </Button>
                <Button
                  variant={filtroZona === "sinZona" ? "success" : "outline-success"}
                  onClick={() => onFiltroZonaChange("sinZona")}
                >
                  <i className="bi bi-exclamation-triangle me-2"></i>Sin Zona ({
                    stats.sinZona
                  })
                </Button>
              </ButtonGroup>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
export default ClientesFilterBar;
