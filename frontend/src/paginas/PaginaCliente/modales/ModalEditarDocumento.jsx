import { Modal, Form, Row, Col } from "react-bootstrap";
import { useState } from "react";
import LoadingButton from "../../../componentes/ui/LoadingButton";
const ModalEditarDocumento = ({
  show,
  onHide,
  nombreEditado,
  onChangeNombre,
  onArchivoChange,
  documento,
  onGuardar,
  submitting = false,
}) => {
  const [errorNombre, setErrorNombre] = useState("");
  const validateForm = () => {
    if (!nombreEditado || nombreEditado.trim() === "") {
      setErrorNombre("El nombre del documento es requerido");
      return false;
    }
    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onGuardar();
    }
  };
  const handleNombreChange = (value) => {
    onChangeNombre(value);
    if (errorNombre && value.trim() !== "") {
      setErrorNombre("");
    }
  };
  return (
    <Modal show={show} onHide={onHide} size="md" centered className="modal-modern">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">
          <i className="bi bi-pencil-square me-2 text-warning"></i>
          Editar Documento
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-4">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold text-muted small text-uppercase">
                  <i className="bi bi-tag me-2"></i>
                  Nombre del documento *
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa el nombre del documento"
                  value={nombreEditado}
                  onChange={(e) => handleNombreChange(e.target.value)}
                  isInvalid={!!errorNombre}
                  className="rounded-3 py-2"
                />
                <Form.Control.Feedback type="invalid">
                  {errorNombre}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold text-muted small text-uppercase">
                  <i className="bi bi-image me-2"></i>
                  Cambiar imagen (opcional)
                </Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => onArchivoChange(e.target.files[0])}
                  accept=".jpg,.jpeg,.png"
                  className="rounded-3"
                />
                <Form.Text className="text-muted small mt-2 d-block">
                  Formatos permitidos: <strong>JPG, JPEG, PNG</strong> (máx. 5MB). 
                  Dejar vacío para mantener imagen actual.
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          {documento && (
            <Row>
              <Col lg={12}>
                <Form.Label className="fw-semibold text-muted small text-uppercase mt-2">
                  Vista previa actual:
                </Form.Label>
                <div className="document-img-container p-2 bg-light rounded-3 border">
                  <img
                    src={documento.url}
                    alt="Vista previa actual"
                    className="document-preview-img"
                  />
                </div>
              </Col>
            </Row>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <LoadingButton
          variant="light"
          onClick={onHide}
          loading={false}
          disabled={submitting}
          className="rounded-pill px-4"
        >
          Cancelar
        </LoadingButton>
        <LoadingButton
          variant="warning"
          type="button"
          onClick={handleSubmit}
          loading={submitting}
          className="rounded-pill px-4 fw-bold"
        >
          <i className="bi bi-check-circle me-2"></i>
          Guardar Cambios
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalEditarDocumento;
