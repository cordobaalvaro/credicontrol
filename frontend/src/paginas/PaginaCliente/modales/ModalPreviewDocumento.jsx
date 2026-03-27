import { Modal, Button } from "react-bootstrap";
const ModalPreviewDocumento = ({ show, onHide, imagenUrl }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-eye me-2"></i>
          Vista Previa del Documento
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center p-0">
        <img
          src={imagenUrl}
          alt="Vista previa del documento"
          className="document-full-preview-img"
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <i className="bi bi-x-circle me-2"></i>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalPreviewDocumento;
