import { Modal, Form } from "react-bootstrap";
import LoadingButton from "../../../componentes/ui/LoadingButton";
const ModalAsignarCliente = ({
  show,
  onHide,
  clientes,
  clienteSeleccionado,
  onClienteChange,
  onSubmit,
  submitting,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.();
  };
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton className="modal-header">
        <Modal.Title className="modal-title-custom">
          Asignar Cliente a la Zona
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {clientes.length === 0 ? (
            <div className="text-center py-4">
              <i className="bi bi-exclamation-circle modal-alert-icon"></i>
              <h5 className="mt-3">No hay clientes disponibles</h5>
              <p className="text-muted">
                Todos los clientes ya están asignados a una zona.
              </p>
            </div>
          ) : (
            <>
              <Form.Group>
                <Form.Label>
                  Selecciona un cliente sin zona asignada:
                </Form.Label>
                <Form.Select
                  value={clienteSeleccionado}
                  onChange={(e) => onClienteChange(e.target.value)}
                  size="lg"
                >
                  <option value="">-- Selecciona un cliente --</option>
                  {clientes
                    .filter((c) => !c.zona)
                    .map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.nombre} - {c.localidad || "Sin localidad"}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={onHide}>
            Cancelar
          </button>
          {clientes.length > 0 && (
            <LoadingButton
              type="submit"
              variant="success"
              loading={submitting}
              disabled={!clienteSeleccionado}
            >
              Asignar Cliente
            </LoadingButton>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
export default ModalAsignarCliente;
