import { Row, Col, Form } from "react-bootstrap";
const ClienteFormDireccion = ({ cliente, errores, onChange }) => {
  return (
    <Row>
      <Col md={6} className="mb-3">
        <Form.Label>
          <i className="bi bi-geo-alt me-2"></i>Dirección *
        </Form.Label>
        <Form.Control
          type="text"
          name="direccion"
          value={cliente.direccion}
          onChange={onChange}
          required
          isInvalid={!!errores.direccion}
          className={errores.direccion ? "is-invalid" : ""}
        />
        {errores.direccion && (
          <Form.Control.Feedback type="invalid">
            {errores.direccion}
          </Form.Control.Feedback>
        )}
      </Col>
      <Col md={6} className="mb-3">
        <Form.Label>
          <i className="bi bi-building me-2"></i>Barrio *
        </Form.Label>
        <Form.Control
          type="text"
          name="barrio"
          value={cliente.barrio}
          onChange={onChange}
          required
          isInvalid={!!errores.barrio}
          className={errores.barrio ? "is-invalid" : ""}
        />
        {errores.barrio && (
          <Form.Control.Feedback type="invalid">
            {errores.barrio}
          </Form.Control.Feedback>
        )}
      </Col>
      <Col md={6} className="mb-3">
        <Form.Label>
          <i className="bi bi-geo me-2"></i>Ciudad *
        </Form.Label>
        <Form.Control
          type="text"
          name="ciudad"
          value={cliente.ciudad}
          onChange={onChange}
          required
          isInvalid={!!errores.ciudad}
          className={errores.ciudad ? "is-invalid" : ""}
        />
        {errores.ciudad && (
          <Form.Control.Feedback type="invalid">
            {errores.ciudad}
          </Form.Control.Feedback>
        )}
      </Col>
      <Col md={6} className="mb-3">
        <Form.Label>
          <i className="bi bi-geo-fill me-2"></i>Localidad *
        </Form.Label>
        <Form.Control
          type="text"
          name="localidad"
          value={cliente.localidad}
          onChange={onChange}
          required
          isInvalid={!!errores.localidad}
          className={errores.localidad ? "is-invalid" : ""}
        />
        {errores.localidad && (
          <Form.Control.Feedback type="invalid">
            {errores.localidad}
          </Form.Control.Feedback>
        )}
      </Col>
    </Row>
  );
};
export default ClienteFormDireccion;
