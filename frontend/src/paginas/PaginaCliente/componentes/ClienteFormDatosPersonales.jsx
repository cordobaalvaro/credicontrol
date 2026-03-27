import { Row, Col, Form } from "react-bootstrap";
const ClienteFormDatosPersonales = ({ cliente, errores, onChange }) => {
  return (
    <Row>
      <Col md={6} className="mb-3">
        <Form.Label>
          <i className="bi bi-person me-2"></i>Nombre completo *
        </Form.Label>
        <Form.Control
          type="text"
          name="nombre"
          value={cliente.nombre}
          onChange={onChange}
          required
          isInvalid={!!errores.nombre}
          className={errores.nombre ? "is-invalid" : ""}
        />
        {errores.nombre && (
          <Form.Control.Feedback type="invalid">
            {errores.nombre}
          </Form.Control.Feedback>
        )}
      </Col>
      <Col md={6} className="mb-3">
        <Form.Label>
          <i className="bi bi-card-text me-2"></i>DNI *
        </Form.Label>
        <Form.Control
          type="text"
          name="dni"
          value={cliente.dni}
          onChange={onChange}
          required
          isInvalid={!!errores.dni}
          className={errores.dni ? "is-invalid" : ""}
        />
        {errores.dni && (
          <Form.Control.Feedback type="invalid">
            {errores.dni}
          </Form.Control.Feedback>
        )}
      </Col>
      <Col md={6} className="mb-3">
        <Form.Label>
          <i className="bi bi-telephone me-2"></i>Teléfono *
        </Form.Label>
        <Form.Control
          type="text"
          name="telefono"
          value={cliente.telefono}
          onChange={onChange}
          required
          isInvalid={!!errores.telefono}
          className={errores.telefono ? "is-invalid" : ""}
        />
        {errores.telefono && (
          <Form.Control.Feedback type="invalid">
            {errores.telefono}
          </Form.Control.Feedback>
        )}
      </Col>
      <Col md={6} className="mb-3">
        <Form.Label>
          <i className="bi bi-calendar me-2"></i>Fecha de Nacimiento *
        </Form.Label>
        <Form.Control
          type="date"
          name="fechaNacimiento"
          value={cliente.fechaNacimiento}
          onChange={onChange}
          required
          isInvalid={!!errores.fechaNacimiento}
          className={errores.fechaNacimiento ? "is-invalid" : ""}
        />
        {errores.fechaNacimiento && (
          <Form.Control.Feedback type="invalid">
            {errores.fechaNacimiento}
          </Form.Control.Feedback>
        )}
      </Col>
    </Row>
  );
};
export default ClienteFormDatosPersonales;
