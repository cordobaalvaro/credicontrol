import { Modal, Form, Row, Col } from "react-bootstrap";
import LoadingButton from "../../../componentes/ui/LoadingButton";
const ModalEditarRegistroCobro = ({
  show,
  onHide,
  datos,
  onChange,
  prestamo,
  onGuardar,
  submitting = false,
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-pencil-square me-2"></i>
          Editar Registro de Cobro
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            onGuardar();
          }}
        >
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-currency-dollar me-1"></i>
                  Monto *
                </Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  name="monto"
                  value={datos.monto}
                  onChange={onChange}
                  placeholder="Ingrese el monto"
                  autoFocus
                />
                <Form.Text className="text-muted">
                  Ingrese el monto del pago recibido
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <i className="bi bi-calendar3 me-1"></i>
                  Fecha de Pago *
                </Form.Label>
                <Form.Control
                  type="date"
                  name="fechaPago"
                  value={datos.fechaPago}
                  onChange={onChange}
                />
                <Form.Text className="text-muted">
                  Fecha en que se realizó el pago
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div className="bg-light p-3 rounded">
                <h6 className="text-primary mb-2">
                  <i className="bi bi-info-circle me-1"></i>
                  Información del Préstamo
                </h6>
                <p className="mb-1">
                  <strong>Cliente:</strong> {prestamo?.cliente?.nombre || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Monto Total:</strong> $
                  {prestamo?.montoTotal?.toLocaleString() || "N/A"}
                </p>
                <p className="mb-0">
                  <strong>Saldo Pendiente:</strong> $
                  {prestamo?.saldoPendiente?.toLocaleString() || "N/A"}
                </p>
              </div>
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
          variant="primary"
          type="submit"
          onClick={onGuardar}
          loading={submitting}
        >
          <i className="bi bi-check-circle me-2"></i>
          Guardar Cambios
        </LoadingButton>
      </Modal.Footer>
    </Modal>
  );
};
export default ModalEditarRegistroCobro;
