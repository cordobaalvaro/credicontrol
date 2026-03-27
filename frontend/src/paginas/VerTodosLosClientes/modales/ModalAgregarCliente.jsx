import { Modal, Form, Row, Col, Button, Spinner } from "react-bootstrap";
import PropTypes from "prop-types";
const ModalAgregarCliente = ({
  show,
  onHide,
  zonas,
  nuevoCliente,
  erroresValidacion,
  onChange,
  onSubmit,
  saving,
}) => {
  const campos = [
    {
      campo: "nombre",
      label: "Nombre completo *",
      tipo: "text",
      obligatorio: true,
    },
    { campo: "dni", label: "DNI *", tipo: "text", obligatorio: true },
    { campo: "telefono", label: "Teléfono *", tipo: "text", obligatorio: true },
    {
      campo: "direccion",
      label: "Dirección *",
      tipo: "text",
      obligatorio: true,
    },
    { campo: "barrio", label: "Barrio *", tipo: "text", obligatorio: true },
    { campo: "ciudad", label: "Ciudad *", tipo: "text", obligatorio: true },
    {
      campo: "localidad",
      label: "Localidad *",
      tipo: "text",
      obligatorio: true,
    },
    {
      campo: "fechaNacimiento",
      label: "Fecha de nacimiento *",
      tipo: "date",
      obligatorio: true,
    },
    {
      campo: "direccionComercial",
      label: "Dirección comercial *",
      tipo: "text",
      obligatorio: true,
    },
    {
      campo: "tipoDeComercio",
      label: "Tipo de comercio *",
      tipo: "text",
      obligatorio: true,
    },
  ];
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      className="modal-todos-clientes"
    >
      <Modal.Header closeButton className="modal-todos-clientes-header">
        <Modal.Title>Añadir Cliente</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Row>
            {campos.map(({ campo, label, tipo, obligatorio }) => (
              <Col md={6} className="mb-3" key={campo}>
                <Form.Label>{label}</Form.Label>
                <Form.Control
                  type={tipo}
                  name={campo}
                  value={nuevoCliente[campo]}
                  onChange={onChange}
                  required={obligatorio}
                  isInvalid={!!erroresValidacion[campo]}
                  className={erroresValidacion[campo] ? "is-invalid" : ""}
                />
                {erroresValidacion[campo] && (
                  <Form.Control.Feedback type="invalid">
                    {erroresValidacion[campo]}
                  </Form.Control.Feedback>
                )}
              </Col>
            ))}
            <Col md={6} className="mb-3">
              <Form.Label>Dirección de cobro *</Form.Label>
              <Form.Select
                name="direccionCobro"
                value={nuevoCliente.direccionCobro}
                onChange={onChange}
                required
                isInvalid={!!erroresValidacion.direccionCobro}
              >
                <option value="direccion">Dirección principal</option>
                <option value="direccionComercial">Dirección comercial</option>
              </Form.Select>
              {erroresValidacion.direccionCobro && (
                <Form.Control.Feedback type="invalid">
                  {erroresValidacion.direccionCobro}
                </Form.Control.Feedback>
              )}
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Zona</Form.Label>
              <Form.Select
                name="zona"
                value={nuevoCliente.zona}
                onChange={onChange}
              >
                <option value="">Sin zona asignada</option>
                {zonas.map((zona) => (
                  <option key={zona._id} value={zona._id}>
                    {zona.nombre}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="success" type="submit" disabled={saving}>
            {saving ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />{" "}
                Guardando...
              </>
            ) : (
              "Guardar Cliente"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
ModalAgregarCliente.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  zonas: PropTypes.array.isRequired,
  nuevoCliente: PropTypes.object.isRequired,
  erroresValidacion: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  saving: PropTypes.bool,
};
export default ModalAgregarCliente;
