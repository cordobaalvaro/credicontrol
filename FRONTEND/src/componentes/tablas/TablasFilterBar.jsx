import { Row, Col, Form } from "react-bootstrap";
import "./TablasFilterBar.css";
const TablasFilterBar = ({
  estadoFiltro,
  onEstadoChange,
  mesFiltro,
  onMesChange,
  estadoOptions,
  rightContent,
}) => {
  return (
    <Row className="mb-4">
      <Col md={4} className="d-flex align-items-center">
        <Form.Select
          value={estadoFiltro}
          onChange={(e) => onEstadoChange(e.target.value)}
          className="tabla-filter-select"
        >
          <option value="">Todos los estados</option>
          {estadoOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Form.Select>
        <Form.Control
          type="month"
          value={mesFiltro}
          onChange={(e) => onMesChange(e.target.value)}
          className="tabla-filter-date"
        />
      </Col>
      {rightContent && (
        <Col md={4} className="d-flex align-items-center justify-content-end">
          {rightContent}
        </Col>
      )}
    </Row>
  );
};
export default TablasFilterBar;
