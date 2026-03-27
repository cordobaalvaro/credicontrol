import { Modal, Form, Row, Col, InputGroup, Badge, Alert } from "react-bootstrap";
import LoadingButton from "../../../componentes/ui/LoadingButton";
const ModalEditarZona = ({
  show,
  onHide,
  zonaEditando,
  nuevaLocalidadEdit,
  setNuevaLocalidadEdit,
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
          <i className="bi bi-pencil-square me-2"></i>
          Editar Zona
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
                  value={zonaEditando.nombre}
                  onChange={onInputChange}
                  placeholder="Ingrese el nombre de la zona"
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
                    value={nuevaLocalidadEdit}
                    onChange={(e) => setNuevaLocalidadEdit(e.target.value)}
                    placeholder="Escriba una localidad y presione Enter o '+'"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), onAgregarLocalidad())}
                  />
                  <LoadingButton
                    variant="success"
                    onClick={onAgregarLocalidad}
                    disabled={!nuevaLocalidadEdit.trim()}
                    loading={false}
                  >
                    <i className="bi bi-plus"></i>
                  </LoadingButton>
                </InputGroup>
                <div className="localidades-list-container">
                  {zonaEditando.localidades.map((localidad, index) => (
                    <Badge
                      key={index}
                      bg="primary"
                      className="localidad-badge"
                      onClick={() => onEliminarLocalidad(index)}
                      title="Clic para eliminar"
                    >
                      {localidad}
                      <i className="bi bi-x ms-2"></i>
                    </Badge>
                  ))}
                </div>
                {zonaEditando.localidades.length === 0 && (
                  <small className="text-muted">Agregue al menos una localidad para esta zona</small>
                )}
                {zonaEditando.localidades.length > 0 && (
                  <small className="text-success">
                    <i className="bi bi-check-circle me-1"></i>
                    {zonaEditando.localidades.length} localidad
                    {zonaEditando.localidades.length !== 1 ? "es" : ""} agregada
                    {zonaEditando.localidades.length !== 1 ? "s" : ""}
                  </small>
                )}
              </Form.Group>
            </Col>
          </Row>
          <Alert variant="info" className="mb-0">
            <i className="bi bi-info-circle me-2"></i>
            Los campos marcados con (*) son obligatorios. La zona se actualizará sin modificar la asignación de cobrador.
          </Alert>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <LoadingButton variant="secondary" onClick={onHide} loading={false} disabled={submitting}>
          <i className="bi bi-x-circle me-2"></i>
          Cancelar
        </LoadingButton>
        <LoadingButton variant="warning" type="submit" onClick={onSubmit} loading={submitting}>
          <i className="bi bi-check-circle me-2"></i>
          Actualizar Zona
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalEditarZona;
