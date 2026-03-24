import { Row, Col, Form } from "react-bootstrap";
const ClienteFormComercial = ({ cliente, errores, onChange, zonas }) => {
  return (
    <Row>
      <Col md={6} className="mb-3">
        <Form.Label>
          <i className="bi bi-building-up me-2"></i>
          Dirección comercial *
        </Form.Label>
        <Form.Control
          type="text"
          name="direccionComercial"
          value={cliente.direccionComercial}
          onChange={onChange}
          required
          isInvalid={!!errores.direccionComercial}
          className={errores.direccionComercial ? "is-invalid" : ""}
        />
        {errores.direccionComercial && (
          <Form.Control.Feedback type="invalid">
            {errores.direccionComercial}
          </Form.Control.Feedback>
        )}
      </Col>
      <Col md={6} className="mb-3">
        <Form.Label>
          <i className="bi bi-check-circle me-2"></i>
          Dirección de cobro *
        </Form.Label>
        <Form.Select
          name="direccionCobro"
          value={cliente.direccionCobro}
          onChange={onChange}
          required
          isInvalid={!!errores.direccionCobro}
        >
          <option value="direccion">Dirección principal</option>
          <option value="direccionComercial">Dirección comercial</option>
        </Form.Select>
        {errores.direccionCobro && (
          <Form.Control.Feedback type="invalid">
            {errores.direccionCobro}
          </Form.Control.Feedback>
        )}
      </Col>
      <Col md={6} className="mb-3">
        <Form.Label>
          <i className="bi bi-geo-alt-fill me-2"></i>Zona
        </Form.Label>
        <Form.Select
          name="zona"
          value={cliente.zona}
          onChange={onChange}
        >
          {!cliente.zona && <option value="">Sin zona asignada</option>}
          {zonas.map((zona) => (
            <option key={zona._id} value={zona._id}>
              {zona.nombre}
            </option>
          ))}
        </Form.Select>
      </Col>
      <Col md={6} className="mb-3">
        <Form.Label>
          <i className="bi bi-shop me-2"></i>Tipo de comercio *
        </Form.Label>
        <Form.Control
          type="text"
          name="tipoDeComercio"
          value={cliente.tipoDeComercio}
          onChange={onChange}
          placeholder="Ej: Almacén, Restaurante, Ferretería..."
          required
          isInvalid={!!errores.tipoDeComercio}
          className={errores.tipoDeComercio ? "is-invalid" : ""}
        />
        {errores.tipoDeComercio && (
          <Form.Control.Feedback type="invalid">
            {errores.tipoDeComercio}
          </Form.Control.Feedback>
        )}
      </Col>
    </Row>
  );
};
export default ClienteFormComercial;
