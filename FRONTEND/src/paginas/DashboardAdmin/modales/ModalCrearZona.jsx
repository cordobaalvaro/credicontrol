import { Modal, Form, Row, Col, InputGroup, Badge } from "react-bootstrap";
import LoadingButton from "../../../componentes/ui/LoadingButton";
const ModalCrearZona = ({
  show,
  onHide,
  nuevaZona,
  nuevaLocalidad,
  setNuevaLocalidad,
  onInputChange,
  onAgregarLocalidad,
  onEliminarLocalidad,
  onSubmit,
  submitting = false,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-geo-alt-fill me-2"></i>
          Añadir Nueva Zona
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-pin-map me-2"></i>
                  Nombre de la Zona *
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  placeholder="Nombre de la Zona"
                  value={nuevaZona.nombre}
                  onChange={onInputChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-buildings me-2"></i>
                  Localidades *
                </Form.Label>
                <InputGroup className="mb-2">
                  <Form.Control
                    type="text"
                    value={nuevaLocalidad}
                    onChange={(e) => setNuevaLocalidad(e.target.value)}
                    placeholder="Nombre de la localidad"
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        onAgregarLocalidad();
                      }
                    }}
                  />
                  <LoadingButton variant="outline-success" onClick={onAgregarLocalidad} loading={false}>
                    <i className="bi bi-plus"></i>
                  </LoadingButton>
                </InputGroup>
                <div className="localidades-list-container">
                  {nuevaZona.localidades.map((localidad, index) => (
                    <Badge key={index} bg="primary" className="localidad-badge">
                      {localidad}
                      <LoadingButton
                        variant="link"
                        size="sm"
                        className="localidad-delete-btn ms-1"
                        onClick={() => onEliminarLocalidad(index)}
                        loading={false}
                      >
                        <i className="bi bi-x"></i>
                      </LoadingButton>
                    </Badge>
                  ))}
                </div>
                {nuevaZona.localidades.length === 0 && (
                  <small className="text-muted">Agregue al menos una localidad para esta zona</small>
                )}
                {nuevaZona.localidades.length > 0 && (
                  <small className="text-success">
                    <i className="bi bi-check-circle me-1"></i>
                    {nuevaZona.localidades.length} localidad
                    {nuevaZona.localidades.length !== 1 ? "es" : ""} agregada
                    {nuevaZona.localidades.length !== 1 ? "s" : ""}
                  </small>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <LoadingButton variant="secondary" onClick={onHide} loading={false} disabled={submitting}>
          <i className="bi bi-x-circle me-2"></i>
          Cancelar
        </LoadingButton>
        <LoadingButton variant="success" type="submit" onClick={onSubmit} loading={submitting}>
          <i className="bi bi-check-circle me-2"></i>
          Crear Zona
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalCrearZona;
