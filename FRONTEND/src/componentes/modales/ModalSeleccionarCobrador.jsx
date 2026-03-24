import { Modal, Form, Button, Spinner } from "react-bootstrap";
import PropTypes from "prop-types";
import useModalSeleccionarCobrador from "./hooks/useModalSeleccionarCobrador";
const ModalSeleccionarCobrador = ({ show, onHide, onSeleccionar }) => {
  const {
    cobradores,
    cobradorSeleccionado,
    setCobradorSeleccionado,
    loading,
    handleSeleccionar,
    handleClose,
  } = useModalSeleccionarCobrador({ show, onHide, onSeleccionar });
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-person-check me-2"></i>
          Seleccionar Cobrador
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-3">
          Seleccione el cobrador que aparecerá en el PDF de la tabla de planes.
        </p>
        <Form.Group>
          <Form.Label>Cobrador *</Form.Label>
          <Form.Select
            value={cobradorSeleccionado}
            onChange={(e) => setCobradorSeleccionado(e.target.value)}
            disabled={loading}
          >
            <option value="">Seleccione un cobrador...</option>
            {cobradores.map((cobrador) => (
              <option key={cobrador._id} value={cobrador._id}>
                {cobrador.nombre} - {cobrador.telefono || "Sin teléfono"}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <i className="bi bi-x-circle me-2"></i>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSeleccionar}
          disabled={!cobradorSeleccionado || loading}
        >
          {loading ? (
            <>
              <Spinner size="sm" animation="border" className="me-2" />
              Cargando...
            </>
          ) : (
            <>
              <i className="bi bi-check-circle me-2"></i>
              Generar PDF
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
ModalSeleccionarCobrador.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onSeleccionar: PropTypes.func.isRequired,
};
export default ModalSeleccionarCobrador;
