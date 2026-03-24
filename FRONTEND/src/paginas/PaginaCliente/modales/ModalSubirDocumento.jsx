import { Modal, Form, Row, Col } from "react-bootstrap";
import { useState } from "react";
import LoadingButton from "../../../componentes/ui/LoadingButton";
const ModalSubirDocumento = ({
  show,
  onHide,
  nombre,
  onNombreChange,
  onArchivoChange,
  onSubmit,
  submitting = false,
}) => {
  const [errors, setErrors] = useState({ nombre: "", archivo: "" });
  const [archivo, setArchivo] = useState(null);
  const validateForm = () => {
    const newErrors = { nombre: "", archivo: "" };
    let isValid = true;
    if (!nombre || nombre.trim() === "") {
      newErrors.nombre = "El nombre del documento es requerido";
      isValid = false;
    }
    if (!archivo) {
      newErrors.archivo = "Debe seleccionar un archivo";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };
  const handleNombreChange = (value) => {
    onNombreChange(value);
    if (errors.nombre && value.trim() !== "") {
      setErrors((prev) => ({ ...prev, nombre: "" }));
    }
  };
  const handleArchivoChange = (file) => {
    setArchivo(file);
    onArchivoChange(file);
    if (errors.archivo && file) {
      setErrors((prev) => ({ ...prev, archivo: "" }));
    }
  };
  return (
    <Modal show={show} onHide={onHide} size="md">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-cloud-upload me-2"></i>
          Subir Documento
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-tag me-2"></i>
                  Nombre del documento *
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Cédula de identidad, Comprobante de ingresos..."
                  value={nombre}
                  onChange={(e) => handleNombreChange(e.target.value)}
                  isInvalid={!!errors.nombre}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.nombre}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-file-earmark me-2"></i>
                  Seleccionar archivo *
                </Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => handleArchivoChange(e.target.files[0])}
                  accept=".jpg,.jpeg,.png"
                  isInvalid={!!errors.archivo}
                />
                {errors.archivo && (
                  <Form.Control.Feedback type="invalid">
                    {errors.archivo}
                  </Form.Control.Feedback>
                )}
                {!errors.archivo && (
                  <Form.Text className="text-muted">
                    Formatos permitidos: JPG, JPEG, PNG (máximo 5MB)
                  </Form.Text>
                )}
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <LoadingButton
          variant="secondary"
          onClick={onHide}
          loading={false}
          disabled={submitting}
        >
          <i className="bi bi-x-circle me-2"></i>
          Cancelar
        </LoadingButton>
        <LoadingButton
          variant="success"
          type="button"
          onClick={handleSubmit}
          loading={submitting}
        >
          <i className="bi bi-cloud-upload me-2"></i>
          Subir Documento
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalSubirDocumento;
